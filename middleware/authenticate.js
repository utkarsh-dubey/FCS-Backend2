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
        // console.log("JWT payload: ", jwt_payload);
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


exports.matchIdandJwt = function(req,res,next) {
    let jwtToken = req.headers.authorization.replace('Bearer ', '');
    let decoded=jwt.verify(jwtToken, opts.secretOrKey);
    req.params.id = req.params.id.replace("$","");
    req.params.id = req.params.id.replace(":","");
    req.params.id = req.params.id.replace(" ","");

    if(req.params.id.length!==24){
        return res.status(401).send({message:"invalid id used"});
    }
    if(!(decoded._id===req.params.id)){
        res.status(401).send({message: "route id mismatch, use correct id"});
    }
    else{
        next();
    }
};


exports.verifyUser = passport.authenticate('jwt', { session: false });
