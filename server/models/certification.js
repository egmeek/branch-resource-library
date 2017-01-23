var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var certificationSchema = new Schema({
  entityId: {
    type: Schema.ObjectId
  },
  projectid: {
    type: Schema.ObjectId,
    ref: 'projects'
  },
  createdate: Date,
  createdate_num: Number,
  release: String,
  productversions: [{
    type: Schema.ObjectId,
    ref: 'picklistitem'
  }],
  status: String
});

module.exports = mongoose.model('certification', certificationSchema)
