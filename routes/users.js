const passport = require('passport');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');
const { signupValidator,forgotpassValidator,resetpassValidator } = require('../middlewares/validator');
const secret = require('../config/secret');

const User = require('../models/User');

router.get('/signup',checkLogin,(req,res) => {
	res.render('user/signup',{
		title: 'Sign Up || RateMe',
		error_message: req.flash('error'),
		validation_errors: req.flash('errors'),
		data: req.flash('data')[0]
	});
})


router.post('/signup',signupValidator,checkLogin,(req,res,next) => {
	const  user = new User()

	user.fullname = req.body.fullname;
	user.email = req.body.email;
	user.password = req.body.password;


	User.findOne({ email : req.body.email })
		.then(foundUser => {
			if(foundUser){
				console.log(`${req.body.email} Already exists`);
				req.flash('error','Account with email address already exists');
				req.flash('data',req.body);
				return res.redirect('/users/signup');
			}else{

				user.save()
					.then(user => {
						req.flash('loginMessage','Registration Completed Successfully');
						res.redirect('/users/login')

					})
					.catch(err => {
						const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
					   	req.flash('errors',validationErrors);
					   	req.flash('data',req.body)
					    res.redirect('/users/signup');
					});
			}
	}).catch(err => console.log(err));
});


router.get('/profile',ensureAuthenticated,(req,res) => {
	res.render('home',{
		title: 'Home || RateME'
	})
});


router.get('/login',checkLogin,(req,res) => {
	res.render('user/login',{
		title: 'Login || RateMe',
		message : req.flash('loginMessage'),
		error_message: req.flash('error'),
	});
});

// router.post('/login',checkLogin, (req, res, next) => {
//   passport.authenticate('local', {
//     //successRedirect:'/users/profile',
//     failureRedirect: '/users/login',
//     failureFlash: true
//   }),((req, res) => {
// 	if(req.body.rememberme){
// 		console.log('ok');
// 		req.session.cookie.maxAge = 30*24*60*60*1000;
// 	}else{
// 		req.session.cookie.expires = null;
// 	}
// 	res.redirect('/users/profile');

//   });
// });


router.post('/login', checkLogin, passport.authenticate('local', {
      	//successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash : true
    }), (req, res) => {
        if(req.body.rememberme){
            req.session.cookie.maxAge = 30*24*60*60*1000; // 30 days
        }else{
            req.session.cookie.expires = null;
        }
        res.redirect('/users/profile');
});


router.get('/forgot',(req,res) => {
	res.render('user/forgot',{
		title: 'Forgot Password || RateMe',
		error_message: req.flash('error'),
		message: req.flash('success'),
		validation_errors: req.flash('errors'),
		data: req.flash('data')[0]
	});
});

router.post('/forgot',forgotpassValidator,(req,res) => {
	User.findOne({email:req.body.email})
		.then(user => {
			if(user){
				crypto.randomBytes(20,(err,buf) => {
					const rand = buf.toString('hex');
					user.passwordResetToken = rand;
					user.passwordResetExpries = Date.now() + 60*60*1000;

					user.save()
						.then(user => {
							const smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: secret.auth.user,
									pass: secret.auth.pass
								}
							});

							const mailOptions = {
								to: user.email,
								from: `RateME ${secret.auth.user}`,
								subject: 'RateMe Application Password Reset Token',
								text: `You Have Requested For Password Reset Token. \n\n Pleae Click On The Link To Complete The Process: \n\n http://localhost:3000/users/reset/${rand} \n\n`
							};
							smtpTransport.sendMail(mailOptions)
								.then(() => {
									req.flash('success','A Password Reset Token has Been Sent To Your Email');
									res.redirect('/users/forgot');
								})
								.catch(err => console.log(err));
						})
						.catch(err => console.log(err));
				});

			}else{
				req.flash('error','Account with email address Does Not exist');
				req.flash('data',req.body);
				return res.redirect('/users/forgot');
			}
		})
		.catch(err => console.log(err));
});

router.get('/reset/:token',(req,res) => {
	User.findOne({passwordResetToken:req.params.token, passwordResetExpries: {$gt: Date.now()}})
		.then(user => {
			if(!user){
				console.log('okk');
				req.flash('error','Password Reset Token Has Expried Or Is Invalid.');
				return res.redirect('/users/forgot');
			}else{
				console.log('ok')
				res.render('user/reset',{
					title: 'Reset Passwors || RateMe',
					validation_errors : req.flash('errors'),
					error_message : req.flash('error')
				})
			}
		})
		.catch(err => console.log(err));
});

router.post('/reset/:token',resetpassValidator,(req,res) => {
	User.findOne({passwordResetToken:req.params.token, passwordResetExpries: {$gt: Date.now()}})
		.then(user => {
			if(req.body.password === req.body.confirm_password){
				if(user){
				user.password = req.body.password;
				user.passwordResetToken = undefined;
				user.passwordResetExpries = undefined;
				user.save()
					.then(user => {
						const smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: secret.auth.user,
									pass: secret.auth.pass
								}
							});

							const mailOptions = {
								to: user.email,
								from: `RateME ${secret.auth.user}`,
								subject: 'RateMe Application Password Changed',
								text: `This Is COnfirmation That You Updated The Password For ${user.email}`
							};
							smtpTransport.sendMail(mailOptions)
								.then(() => {
									req.flash('loginMessage','Your password Has Been Changed SuccessFully');
									res.redirect('/users/login')
								})
								.catch(err => console.log(err));

					})
					.catch(err => console.log(err));
				}else{
					req.flash('error','Password Reset Token Has Expried Or Is Invalid.');
					return res.redirect('/users/forgot');
				}
			}else{
				req.flash('error','Confirm Password Does Not Match');
				res.redirect('/users/reset/' + req.params.token);
			}
		})
		.catch(err => console.log(err));
});


router.get('/logout',ensureAuthenticated,(req,res,next) => {
	req.logout();
	req.session.destroy((err) => {
		res.redirect('/');
	});

});


router.get('/auth/google',(req,res) => {

});


module.exports = router;
