//This is the model for what will be stored in the database
var mongoose = require('mongoose');

module.exports = mongoose.model('Cache', {
  name: String, albums: Object
});	