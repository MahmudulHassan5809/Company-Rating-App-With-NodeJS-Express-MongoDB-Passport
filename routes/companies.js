const fs = require('fs');
const path = require('path');
const { arrayAverage } = require('../myFUnction');
const express = require('express');
const router = express.Router();


const Company = require('../models/Company');
const User = require('../models/User');

const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');

const multer  = require('multer')
const date = Date.now();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, date +  file.originalname)
  }
})
const upload = multer({ storage: storage })


router.get('/create',ensureAuthenticated,(req,res) => {
	res.render('company/company',{
		title: 'Company Registration || RateMe',
		message: req.flash('success'),
	})
});

router.post('/upload',ensureAuthenticated,upload.single('upload'),(req,res) => {
	console.log(req.file)
})

router.post('/create',ensureAuthenticated,(req,res) => {
	const company = new Company();

	company.name = req.body.name;
	company.address = req.body.address;
	company.city = req.body.city;
	company.country = req.body.country;
	company.sector = req.body.sector;
	company.website = req.body.website;
	company.image = '/uploads/' + date + req.body.upload;

	company.save()
		.then(company => {
			req.flash('success','Company Data Has Been Added');
			res.redirect('/company/create');
		})
		.catch(err => console.log(err));

});


router.get('/companies',(req,res) => {
	Company.find({})
		.then(companies => {
			res.render('company/companies',{
				title: 'All Companies || RateMe',
				companies: companies
			});
		})
		.catch(err => console.log(err));
});


router.get('/leaderboard',(req,res) => {
	Company.find({})
		.sort({'ratingSum' : -1})
		.then(companies => {
			res.render('company/leaderboard',{
				title: 'LeaderBoard || RateMe',
				companies: companies
			});
		})
		.catch(err => console.log(err));
});


router.get('/search',(req,res) => {
	res.render('company/search',{
		title: 'Search Companies || RateMe'
	});
});

router.post('/search',(req,res) => {
	const search = req.body.search;
	Company.find({ 'name' : { '$regex' : search, '$options' : 'i'} })
		.then(companies => {
			res.render('company/companies',{
				title: `Search Result || RateMe`,
				companies:companies
			});
		})
		.catch(err => console.log(err));
});

router.get('/company-profile/:id',ensureAuthenticated,(req,res) => {
	Company.findOne({_id:req.params.id})
		.then(company => {
			const avg = arrayAverage(company.ratingNumber)
			res.render('company/company-profile',{
				title: `${company.name} || RateMe`,
				company: company,
				avg: avg
			});
		})
		.catch(err => console.log(err));
});

router.get('/register-employee/:id',ensureAuthenticated,(req,res) => {
	Company.findOne({_id:req.params.id})
		.then(company => {
			res.render('company/register-employee',{
				title: `Register Employee || RateMe`,
				error_message: req.flash('error'),
				company: company
			});
		})
		.catch(err => console.log(err));
});

router.post('/register-employee/:id',ensureAuthenticated,(req,res) => {
	Company.findOneAndUpdate({_id:req.params.id,'employees.employee': {$ne:req.user._id}}, {$push: {employees: {employee: req.user._id}}})
		.then(company => {
			if(company){
				User.findOne({_id:req.user._id})
				.then(user => {
					user.role = req.body.role;
					user.company.name = company.name
					user.company.image = company.image

					user.save()
						.then(user => {
							res.redirect('/');
						})
						.catch(err => console.log(err));
				})
				.catch(err => console.log(err));
			}else{
				req.flash('error','User Already Registered');
				return res.redirect('/company/register-employee/' + req.params.id);
			}
		})
		.catch(err => console.log(err));
});


router.get('/:id/employess',ensureAuthenticated,(req,res) => {
	Company.findOne({_id:req.params.id})
		.populate('employees.employee')
		.then(company => {
			res.render('company/employees',{
				title: `${company.name} Employees || RateMe`,
				company:company
			})
		})
		.catch(err => console.log(err));
});



module.exports = router;
