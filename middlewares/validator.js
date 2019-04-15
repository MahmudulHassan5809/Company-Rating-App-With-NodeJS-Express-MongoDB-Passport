const { body } = require('express-validator/check');
module.exports = {
  signupValidator: function(req, res, next){
    req.checkBody('fullname','FullName Must Not Be Less Than 5').isLength({min:5});
    req.checkBody('email','Email is Invalid').isEmail();
    req.checkBody('password','Password Must Not Be Less Than 5').isLength({min:5});
    req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

    const errors = req.validationErrors();

    if(errors){
         let messages = [];
         errors.forEach((error) => {
             messages.push(error.msg);
         });

         req.flash('errors', messages);
         req.flash('data',req.body);
         res.redirect('/users/signup');
    }else{
         return next();
    }
  },
  forgotpassValidator: function(req, res, next){
    req.checkBody('email','Email is Required').notEmpty();
    req.checkBody('email','Email is Invalid').isEmail();

    const errors = req.validationErrors();

    if(errors){
         let messages = [];
         errors.forEach((error) => {
             messages.push(error.msg);
         });

         req.flash('errors', messages);
         req.flash('data',req.body);
         res.redirect('/users/forgot');
    }else{
         return next();
    }
  },
  resetpassValidator: function(req, res, next){
    const {confirm_password,password} = req.body
    console.log(confirm_password,password)
    req.checkBody('password','Password is Required').notEmpty();
    req.checkBody('confirm_password','Confirm Password is Required').notEmpty();
    req.checkBody('password','Password Must Not Be Less Than 5').isLength({min:5});
    req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

    //req.check(password).equals(confirm_password).withMessage("Passwords don't match.");



    const errors = req.validationErrors();

    if(errors){
         let messages = [];
         errors.forEach((error) => {
             messages.push(error.msg);
         });

         req.flash('errors', messages);
         req.flash('data',req.body);
         res.redirect('/users/reset/' + req.params.token);
    }else{
         return next();
    }
  }
}
