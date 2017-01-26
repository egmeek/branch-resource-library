var express = require('express'),
  router = express.Router(),
  Error = require('../../controllers/error'),
  MasterController = require('../../controllers/master'),
  gitTools = require("../../controllers/git-tools")

router.get('/userInfo', function (req, res) {
  var menu = buildMenu(req.user);
  var userNoPassword = {};
  if (req.user && req.user.role) {
    userNoPassword = cloneObject(req.user);
    delete userNoPassword["password"];
  }
  res.json({
    user: userNoPassword,
    menu: menu
  });
});

router.get('/lasterror', function (req, res) {
  console.log(req.session.lastError);
  if (req.session && req.session.lastError) {
    res.json(req.session.lastError);
  }
  else {
    res.json({});
  }
});

router.post('/git/projects', function (req, res) {
  try {
    var gitUser;
    if (!req.session.gitToken) {
      res.json(Error.custom("Unable to authenticate. Please contact branch.admin@qlik.com"))
      return
    }
    if (req.body.search) {
      var query = req.body.search + "+user:" + req.user.github_user
      gitTools.search({ oauthToken: req.session.gitToken, query: query })
        .then(repos => {
          res.json({ repos: repos && repos.items ? repos.items : [] })
        })
        .catch(err => {
          console.error(err)
          res.json(Error.custom(err.message))
        })
    } else {
      gitTools.getRepositories({ oauthToken: req.session.gitToken, user: req.user.github_user })
        .then(repos => {
          res.json({ repos: repos })
        })
        .catch(err => {
          console.error(err);
          res.json(Error.custom(err.message))
        })
    }
  }
  catch (ex) {
    console.error(ex);
    res.json(Error.custom("Unable to authenticate"))
  }
});

function buildMenu(user) {
  var topMenu;
  var basicMenu = [
    {
      label: "Logout",
      href: "/auth/logout"
    }
  ];
  if (user) {
    basicMenu.splice(0, 0, {
      label: "Change Password",
      href: "#!user/changepassword"
    });
    basicMenu.splice(0, 0, {
      label: "My Profile",
      href: "#!user/" + user._id
    });
    if (user.role.permissions && user.role.permissions.resource && user.role.permissions.resource.create == true) {
      basicMenu.splice(0, 0, {
        label: "Create Resource",
        href: "#!resource/new/edit"
      });
    }
    if (user.role.permissions && user.role.permissions.project && user.role.permissions.project.create == true) {
      basicMenu.splice(0, 0, {
        label: "Create Project",
        href: "#!project/new/edit"
      });
    }
    topMenu = {
      items: [{
        label: user.username.length > 15 ? `${user.username.substring(0, 12)}...` : user.username,
        items: []
      }]
    };
    //establish whether or not the user has "moderator" permissions
    if (user.role.permissions) {
      var strPerm = JSON.stringify(user.role.permissions);
      if (strPerm.indexOf('"hide":true') != -1 || strPerm.indexOf('"approve":true') != -1 || strPerm.indexOf('"flag":true') != -1) {
        basicMenu.splice(0, 0, {
          label: "Moderator Console",
          href: "#!moderator"
        });
      }
    }
    //establish whether or not the user is an admin
    if (user.role.name == "admin") {
      basicMenu.splice(0, 0, {
        label: "Admin Console",
        href: "#!shouldntbeabletoguessthisurl"
      });
    }
    topMenu.items[0].items = basicMenu;
  }
  else {
    topMenu = {
      items: [{
        label: "Login",
        href: "#!loginsignup",
        items: []
      }]
    };
  }
  return topMenu;
}

function cloneObject(object) {
  var clone = {};
  for (var key in object) {
    clone[key] = object[key];
  }
  return clone;
}

module.exports = router;
