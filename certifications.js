const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema for Certifications



const CertificationSchema = new Schema({
  name:{type: String, required:true},
  
  
  
    
});

//create collection and add Schema
mongoose.model('certifications', CertificationSchema);