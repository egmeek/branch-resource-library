var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Error = require('../controllers/error'),
    passport = require('passport');
const UserProfile = require('../models/userprofile')

router.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, user){
    if(err){
      res.json(Error.custom(err));
    }
    else{
      req.logIn(user, function(err){
        if(err){
          res.json(Error.custom(err));
        }
        else{
          res.json({});
        }
      })
    }
  })(req, res, next);
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/check', (req, res) => {
  UserProfile.findOne({ $or: [{ username: req.query["username"] }, { email: req.query["email"] }]  }, function(err, user) {
    if (err) {
      res.json({ found: false })
      return
    }

    if (user) {
      if(user.username == req.query["username"]){
        res.json({ found: true, message: 'User already exists with username "' + req.query["username"] + '"' })
      }
      else if (user.email == req.body.email) {
        res.json({ found: true, message: 'User already exists with email "' + req.query["email"] + '"' })
      }
      else{
        //both the username & emails are in use (rare)
        res.json({ found: true, message: 'User already exists with username "' + req.query["username"] + '" and email "' + req.query["email"] + '"' })
      }
      return
    }

    res.json({ found: false })
  })
})

router.post('/signup', function(req, res){
  passport.authenticate('signup', function(err, user){
    if(err){
      res.json(Error.custom(err));
    }
    else{
      req.logIn(user, function(err){
        if(err){
          res.json(Error.custom(err));
        }
        else{
          res.json({});
        }
      })
    }
  })(req, res);
});

router.post('/reset', function(req, res){
  require('../controllers/passport/reset.js')(req, res, function(err, user) {
    if(err){
      res.json(Error.custom(err));
    }
    else{
      res.json({});
    }
  })
});

router.post('/change', function(req, res){
  if(req.user){
    User.findOne({'_id': req.user._id}, function(err, user){
      if(user.authenticate(req.body.oldPassword)){
        user.salt = user.createSalt(req.body.password);
        user.password = user.hashPassword(req.body.password, user.salt);
        user.save(function(err){
          if(err){
            res.json(Error.custom(err));
          }
          else{
            res.json({});
          }
        });
      }
      else{
        res.json(Error.custom("Old Password is not correct"));
      }
    });
  }
});

module.exports = router;
