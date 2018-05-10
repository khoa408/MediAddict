var config = { };
//mongo link config
//config.mongoUri = 'mongodb://localhost:27017/mediaddict'
//config.mongoUri = 'mongodb://user1:team10@ds257579.mlab.com:57579/rtr';
config.mongoUri = "mongodb://bossman:recommedia@ds014648.mlab.com:14648/mediaddict";

//set cookie age = 30 days
config.cookieMaxAge = 30 * 24 * 3600 * 1000;

module.exports = config;

