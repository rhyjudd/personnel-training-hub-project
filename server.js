// server.js
// where your node app starts

// init project
const express      = require("express");
const app          = express();
const bodyParser   = require("body-parser");
const mongoose     = require("mongoose");
const dns          = require("dns");
const ejs          = require("ejs");
const bcrypt       = require("bcrypt");

//set view engine
app.set('view engine', 'ejs');

//To fix depreciation warnings
mongoose.set('useUnifiedTopology', true);


//Load model
require('./employees.js');
require('./certifications.js');
const Employee = mongoose.model('employees');
const Cert     = mongoose.model('certifications');


//Connecting to the database
let mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log(`Connected to database on ${new Date().toISOString().slice(0,10)}`);
});


//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
//Default route
app.get("/", (req, res)=>{
  res.render('pages/index');
});

//Dashboard route
app.get("/dashboard", (req,res)=>{
  Employee.find().then( (employees)=>{ 
    let employeesObj = employees; 
    res.render('./pages/dashboard', {employees: employeesObj});
  });
})


//
//Employees Routes
//
app.get("/addemployee",(req,res)=>{
  res.render("pages/addemployee");
})


app.post("/addemployee",(req,res)=>{
  console.log(req.body);
  let today = new Date();
   
  bcrypt.hash(req.body.password, 10, (err, hash)=>{
    const newEmployee = {
      
    pnumber    :req.body.pnumber,
    lastname   :req.body.lastname,
    firstname  :req.body.firstname,
    password   :hash,
    email      :req.body.email,
    phonenumber:req.body.phonenumber,
    date       :today
    }  
    
    new Employee(newEmployee).save().then(()=>{
    console.log(newEmployee)
    })    
  });
  
  res.redirect("/dashboard");
})

app.get('/employee/:id',(req,res)=>{
  let id = req.params.id;
  Employee.findById(id).then((result)=>{
    const getCerts = async(object) =>{
      console.log(`results: ${result.certs}`);
      let certResults = await Cert.find({_id: {$in: result.certs}}).then((results)=>{
        console.log(results);
      });
      
    }
    getCerts(result);
    res.render("pages/employee", {employees: result})
  })
 
  //res.redirect("/");
});


//
//Certifications routes
//
app.get("/certs", (req,res)=>{
  Cert.find().sort({name: 1}).then((certs)=>{
    let certsObj = certs;
    console.log(certsObj);
    res.render("pages/certs",{certs: certsObj});
  })
})


app.get("/addcert", (req,res)=>{
  res.render("pages/addcert");
})


app.post("/addcert", (req, res)=>{
  const newCert = {name: req.body.certname};
  console.log(req.body.certname);
  new Cert(newCert).save().then(()=>{
    console.log(newCert)
  });  
  res.redirect("/dashboard");
})

app.get("/addcerttoemp/:id",(req,res)=>{
  //console.log(req.params.id);
  let id = req.params.id
  Cert.find().sort({name: 1}).then((certs)=>{
    res.render("pages/addcerttoemp",{employeeID: id,  certs:certs})
  })
})

app.post("/addcerttoemp/:id",(req,res)=>{
  console.log(`employee Id: ${req.params.id}`);
  console.log(req.body);
  
  
  Employee.update({_id: req.params.id},
                  {$push: {certs: req.body}},
                   function (error, success) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(success);
                        }
                  
  
  });
  

  res.redirect("/dashboard");
})



//
//Courses routes
//
app.get("/courses", (req,res)=>{
  res.render("pages/courses");
})

app.get("/addcourse",(req,res)=>{
  res.render("pages/addcourse");
})










// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
