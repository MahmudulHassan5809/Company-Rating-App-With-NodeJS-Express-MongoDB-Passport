const async = require('async');
const express = require('express');
const router = express.Router();


router.get('/',(req,res) => {

	if(req.session.cookie.originalMaxAge != null || req.user != null){
		res.redirect('/users/profile');
	}else{
		res.render('index',{
			title: 'Index || RateMe'
		});
	}
})


module.exports = router;
