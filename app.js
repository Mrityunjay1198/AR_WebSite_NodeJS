const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

/*
function checkfile(file,cb){
  const filetypes = /jpeg|jpg|png|fbx|3ds/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //console.log("mimetype value: "+JSON.stringify(file.mimetype));
  const mimetype = filetypes.test(file.mimetype);
//console.log(mimetype+" , "+extname);
 if(extname){
  return cb(null,true);
}else{
  cb('Images Only');
}
}
*/

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { 
      useNewUrlParser: true,
      useUnifiedTopology : true
     }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(express.static('./public'));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/assets', express.static('./assets'));
/*
app.post('/upload',(req,res)=>{
  upload(req,res,(err)=>{
    if(err){
      res.render('uploads', {
        msg : err
      });
    }else{
       if(req.file == undefined){
         res.render('uploads',{
           msg :'No file selected'
         });
       }else{
        res.render('uploads',{
          msg :'File Uploaded'
        });
       }
    }
  });
});
   
 */

const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`Server started on port ${PORT}`));
