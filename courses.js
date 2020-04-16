const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema for Courses 



const CourseSchema = new Schema({
  name:         {type: String, required:true},
  duration:     {type: Number, required:true},
  datecompleted:{type: Date,   required:true},
  notes:        {type: String}
  
  
  
    
});

//create collection and add Schema
mongoose.model('courses', CourseSchema);