const async = require('async');
const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const User = require('../models/User');

const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');

router.get('/company/:id',ensureAuthenticated,(req,res) => {
	Company.findOne({_id:req.params.id})
		.then(company => {
			res.render('company/review',{
				title: `${company.name}-Review || RateMe`,
				message: req.flash('success'),
				company: company
			})
		})
		.catch(err => console.log(err));
});

router.post('/company/:id',ensureAuthenticated,(req,res) => {
	Company.findOne({_id:req.params.id})
		.then(company => {
			console.log(req.body.clickedValue)
			Company.findOneAndUpdate({_id:req.params.id},
				{
                    $push: {companyRatings: {
                        companyName: req.body.sender,
                        userFullName: req.user.fullname,
                        userRole: req.user.role,
                        companyImage: req.user.company.image,
                        userRating: req.body.clickedValue,
                        userReview: req.body.review
                    },
                        ratingNumber: req.body.clickedValue
                    },
                    $inc: {ratingSum: req.body.clickedValue}
                }
			)
			.then(updatedCompany => {
				req.flash('success','Your Review Has Been Added');
				res.redirect('/review/company/' + req.params.id)
			})
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

module.exports = router;

