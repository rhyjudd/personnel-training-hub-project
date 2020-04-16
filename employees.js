const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema Employees



const EmployeeSchema = new Schema({
  pnumber    :{ type: Number,required:true},
  lastname   :{ type: String,required:true},
  firstname  :{ type: String,required:true},
  password   :{ type: String,required:true},
  email      :{ type: String,required:true},
  phonenumber:{ type: String},
  date       :{ type: Date},
  certs      :[
                {
                  certname:{ type: String} ,
                }
                
              ]
  
  
  
    
});

//create collection and add Schema
mongoose.model('employees', EmployeeSchema);