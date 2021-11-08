var passport = require('passport');
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        //expires in 2 hour
        { expiresIn: 7200});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});
// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
  
//   passport.deserializeUser(function(user, done) {
//     done(null, user);
//   });


exports.matchIdandJwt = function(req,res) {
    // console.log("kuch aaya kya",req);
    let check=passport.use(new JwtStrategy(opts,
        (jwt_payload, done) => {
            console.log("gggggggggggggg",jwt_payload);
            if (req.params.id===jwt_payload._id) {
                return done(null,"okay");
            }
            else {
                return done(null, false);
            }
    }));
    console.log("ccccccccccccc",check)
};


exports.verifyUser = passport.authenticate('jwt', { session: false });
