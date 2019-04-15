# App Info
	Awesome Business Company Rating App With NodeJS,Express,MongoDB,Ejs,Passport And Many More

# Features
	* Full Authentication With Passport Google Oauth
	* Add Company
	* Add Employees
	* Rating Company
	* Review Company
	* View Company profile
	* Send Private Message (Real Time)
	* Search Companies
	* Many More

# Setup

#### Please Edit secret.js in config folder
    module.exports = {
	auth:{
		user: 'your email',
		pass: 'your password'
	},
	googleClientID: 'XXXXXXXX',
	googleClientSecret: 'XXXXXXXXXXXXXX'
	}

 #### Also Edit database.js
    if(process.env.NODE_ENV === 'production'){
     module.exports = {
        mongoURI: 'Your Mlab Uri',
     }
    }else{
      module.exports = {
        mongoURI : 'mongodb://localhost:27017/rating_dev'
      }
    }


### Version
	1.1.0

## Usage

### Installation

Install the dependencies

```sh
$ npm install
```

### Serve
To serve in the browser  -

```sh
$ npm run server
```


## More Info

### Author

Mahmudul Hassan


### License

This project is licensed under the MIT License
