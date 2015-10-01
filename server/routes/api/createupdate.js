//These routes are for creating or updating records
var MasterController = require("../../controllers/master"),
    Error = require("../../controllers/error"),
    fs = require('fs'),
    attachmentDir = require("../../../attachmentDir"),
    entities = require("../entityConfig"),
    mongoose = require("mongoose"),
    epoch = require("milli-epoch"),
    atob = require("atob"),
    git = require("github"),
    GitCredentials = require("../../../gitCredentials"),
    GitHub = new git({
        // required
        version: "3.0.0",
        // optional
        debug: false,
        protocol: "https",
        host: "api.github.com", // should be api.github.com for GitHub
        pathPrefix: "", // for some GHEs; none for GitHub
        timeout: 5000,
        headers: {
            "user-agent": "qlik-branch" // GitHub is happy with a unique user agent
        }
    });

GitHub.authenticate({type: "token", token: GitCredentials.token });

module.exports = function(req, res){
  //This route is for creating a new record on the 'Project' entity and returning the new record
  //Requires "create" permission on the 'Project' entity
  //This has been separated due to the nature of creating a 'Project'
  var entity = req.params.entity;
  var user = req.user;
  var userPermissions = req.user.role.permissions['projects'];
  var data = req.body;
  var query;
  if(req.params.id){
    query = {
      "_id" : req.params.id
    }
  }
  if(!userPermissions || userPermissions.create!=true){
    res.json(Error.insufficientPermissions());
  }
  else{
    var record = data.standard || data;
    record._id = mongoose.Types.ObjectId();
    record.createuser = user._id;
    record.userid = user._id;
    record.createdate = Date.now();
    var imageBuffer;

    if(req.params.entity=="projects"){
      //build the similar projects query
      var similarQuery = {
        category: data.standard.category,
        $or: []
      };
      var tagList = data.standar.tags.split(",");
      for(var i=0;i<tagList.length;i++){
        similarQuery.$or.push({
          tags: {
            $regex: tagList[i],
            $options: "gi"
          }
        });
      }
    }

    if(data.special){
      if(!fs.existsSync(attachmentDir+record._id.toString())){
        fs.mkdirSync(attachmentDir+record._id.toString());
      }
      if(data.special.image){
        //write the image to disk and store the Url
        imageBuffer = new Buffer(data.special.image.data, 'base64');
        fs.writeFile(attachmentDir+record._id.toString()+"/image.png", imageBuffer, function(err){
          if(err){
            console.log(err);
          }
        });
        record.image = "/attachments/"+record._id.toString()+"/image.png";
      }
      else{
        record.image = "/attachments/default/"+req.params.entity+".png";
      }
      if(data.special.thumbnail){
        //write the image to disk and store the Url
        imageBuffer = new Buffer(data.special.thumbnail.data, 'base64');
        fs.writeFile(attachmentDir+record._id.toString()+"/thumbnail.png", imageBuffer, function(err){
          if(err){
            console.log(err);
          }
        });
        record.thumbnail = "/attachments/"+record._id.toString()+"/thumbnail.png";
      }
      else{
        record.thumbnail = "/attachments/default/"+req.params.entity+".png";
      }
      if(data.special.gitProject){
        console.log('need to get git project');
        GitHub.repos.get({user:data.special.gitProject.owner, repo:data.special.gitProject.repo}, function(err, gitresult){
          console.log('got project');
          record.last_updated = new Date(gitresult.updated_at);
          record.last_git_check = epoch.now();
          record.git_repo = data.special.gitProject.repo;
          record.git_user = data.special.gitProject.owner;
          record.project_site = gitresult.url;
          record.git_clone_url = gitresult.clone_url;
          GitHub.repos.getReadme({user:data.special.gitProject.owner, repo:data.special.gitProject.repo}, function(err, readmeresult){
            console.log('setting readme');
            record.content = atob(readmeresult.content);
            //check for similar projects
            MasterController.getIds(similarQuery, similarQuery, entities["projects"], function(results){

              MasterController.save(query, project, entities['projects'], function(newrecord){
                res.json(newproject);
              });
            });
          });
        });
      }
      else{
        if(req.params.entity=="projects"){
          var newDate = Date.now();
          record.last_updated = newDate;
          record.last_updated_num = epoch.now();

        }
        MasterController.save(query, record, entities[req.params.entity], function(newrecord){
          res.json(newrecord);
        });
      }
    }
    else{
      MasterController.save(query, record, entities[req.params.entity], function(newrecord){
        res.json(newrecord);
      });
    }
  }
};