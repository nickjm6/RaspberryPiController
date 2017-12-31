var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var GoogleTokenStrategy = require("passport-google-id-token")

var User = require("./user")
var config = require("./config")

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id)
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		})
	})

	passport.use(new GoogleStrategy({
		clientID: config.clientID,
		clientSecret: config.clientSecret,
		callbackURL: config.callbackURL
	},
	function(token, refreshToken, profile, done){
		process.nextTick(function(){
			User.findOne({"google.id" : profile.id}, function(err, user){
				if(err)
					return done(err);

				if(user){
					return done(null, user);
				} else{
					// var newUser = new User();
					// newUser.google.id = profile.id;
					// newUser.google.token = token;
					// newUser.google.name = profile.displayName;
					// newUser.google.email = profile.emails[0].value;

					// newUser.save(function(err){
					// 	if(err)
					// 		throw err;
					// 	return done(null, newUser);
					// })
					return done("Not a valid User")
				}

			})
		})
	}))

	passport.use(new GoogleTokenStrategy({
		clientID: config.clientID
	}, function(parsedToken, googleId, done){
		console.log("about to search id")
		console.log("id: " + googleId)
		User.findOne({"google.id" : googleId}, function(err, user){
			if (err)
				return done(err);
			if(user){
				return done(null, user);
			} else{
				return done("Not a valid User");
			}
		})
	})); 
}