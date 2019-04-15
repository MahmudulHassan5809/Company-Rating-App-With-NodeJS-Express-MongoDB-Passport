if(process.env.NODE_ENV === 'production'){
 module.exports = {
 	mongoURI: 'Your Mlab Uri',
 }
}else{
  module.exports = {
  	mongoURI : 'mongodb://localhost:27017/rating_dev'
  }
}
