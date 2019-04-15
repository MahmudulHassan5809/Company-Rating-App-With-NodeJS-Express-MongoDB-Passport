const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const User = require('../models/User');
const Message = require('../models/Message');

const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');

router.get('/:employeeId',ensureAuthenticated,(req,res) => {
	User.findOne({_id: req.params.employeeId})
		.then(foundUser => {
			Message.find({$or : [{'userFrom' : req.user._id,'userTo':req.params.employeeId},{'userFrom':req.params.employeeId,'userTo':req.user._id}]})
				.then(messages => {
					console.log(messages)
					res.render('messages/message',{
						title: 'Send Message || RateMe',
						foundUser: foundUser,
						messages: messages
					});
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

router.post('/:employeeId',ensureAuthenticated,(req,res) => {

	User.findOne({_id: req.params.employeeId})
		.then(foundUser => {
			const newMessage = new Message();
			newMessage.userFrom = req.user._id;
			newMessage.userTo = req.params.employeeId;
			newMessage.userFromName = req.user.fullname;
			newMessage.userToName = foundUser.fullname;
			newMessage.body = req.body.message;
			newMessage.save()
				.then(savedMessage => {
					console.log(savedMessage);
					res.redirect('/message/' + req.params.employeeId)
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

module.exports = router;
