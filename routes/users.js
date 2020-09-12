//import alert from 'alert-node'
const alert = require('alert-node');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const localstorage = require('localStorage');
const multer  = require('multer');
const path = require('path');

//To Get uploaded file path to insert into database
const newpath = require('../app');

// Load User model
const User    = require('../models/User');
const Company = require('../models/Company');
const Client  = require('../models/Client');
const Shop    = require('../models/Shop');
const Brand   = require('../models/Brand');
const Product = require('../models/Product');
const Country = require('../models/Country');
const { forwardAuthenticated,ensureAuthenticated } = require('../config/auth');


 //Multer Storage
 var brandstorage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, 'uploads/brands/');  
  },  
  filename: function (req, file, callback) {  
    callback(null, Date.now() + file.originalname);  
  }  
});  
var modelstorage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, 'uploads/products/');  
  },  
  filename: function (req, file, callback) {  
    callback(null, Date.now() + file.originalname);  
  }  
});



var add_brand = multer({ storage : brandstorage}); 
 
var add_product = multer({ storage : modelstorage}); 

//var upload = multer({ storage : storage}).single('myfile');  
  

 
// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//forgot-password
router.get('/forgot-password',forwardAuthenticated,(req, res) => res.render('forgot-password'));

//reset-password
router.get('/reset-password',forwardAuthenticated, (req, res) => res.render('reset-password'));

//add_company
router.get('/add_company',ensureAuthenticated,(req,res)=> {
  //console.log('getting all records');
  Company.find((err, companies)=>{
    if(err) {console.log(err);}
    else{
       Country.find((err, country)=>{
         if(err){console.log(err)}
         else{
           res.render('add_company',{companies : companies,country : country});
         }
       });
    }
  }); 
});

router.get('/delete',(req,res)=>{
  console.log("delete"+req.param.id);
  Company.findOneAndDelete(req.params.id, (err,project)=>{
    if(err){
      console.log(err);
      res.redirect('/users/add_company');
    }else{
      req.flash('success_msg','Data deleted successfully');
      res.redirect('/users/add_company');
    }
  });
});
router.get('/edit',(req,res)=>{
  const {cname,caddress,city,state,country,mobile} = req.body;
  const newcomp = new Company({
    cname,
    caddress,
    city,
    state,
    country,
    mobile
  });
  Company.findByIdAndUpdate(req.params.id,newcomp,(err)=>{
    if(err){
      res.redirect('/users/add_company'+req.params.id);
      console.log("if..")
    }
    else{
      req.flash('success_msg','Data Updated successfully')
      res.redirect('/users/add_company');
      console.log("else..")
    }
  });
});
//add_brand
router.get('/add_product', ensureAuthenticated,(req,res)=> res.render('add_product'));
//About Us
router.get('/aboutus', ensureAuthenticated,(req,res)=> res.render('aboutus'));
//add_client
router.get('/add_client',ensureAuthenticated,(req,res)=> {

  Country.find((err, countries)=>{
    if(err) {console.log(err);}
    else{
          res.render('add_client',{countries : countries});
    }
    console.log(JSON.stringify(countries));
  }).sort({country:1}); 
});
//add_shop
router.get('/add_shop',ensureAuthenticated,(req,res)=> res.render('add_shop'));
//add_brand
router.get('/add_brand',ensureAuthenticated,(req,res)=> res.render('add_brand'));
//pricing page
router.get('/pricing',ensureAuthenticated,(req,res)=> res.render('pricing'));
//uploads page
router.get('/uploads',ensureAuthenticated,(req,res)=> res.render('uploads'));
// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//Add Client Post
router.post('/add_Client',(req,res)=>{
  const { clientname,
       clientaddress,
       clientcity,
       clientstate, 
       clientcountry, 
       clientmobile,
       clientuser, 
       clientpass, 
       status} = req.body;
  let errors = [];
  
  if(clientname=="" || clientaddress=="" || clientcity=="" || clientstate=="" || clientcountry=="" || clientmobile=="" || clientuser=="" || clientpass=="" || status==""){
    errors.push({ msg : 'All fields required' });
    res.render('add_client',{
      errors,
      clientname,
      clientaddress,
      clientcity,
      clientstate, 
      clientcountry, 
      clientmobile,
      clientuser, 
      clientpass, 
      status
    });
  }else{
    const newclient = new Client({
      clientname,
      clientaddress,
      clientcity,
      clientstate, 
      clientcountry, 
      clientmobile,
      clientuser, 
      clientpass, 
      status
    });

    bcrypt.genSalt(10,(err, salt)=>{
      bcrypt.hash(newclient.clientpass,salt,(err,hash)=>{
        if(err) throw err;
        newclient.clientpass = hash;
        console.log(hash);
        newclient.save()
        .then(user => {
          req.flash('success_msg' , 'Client details submitted successfully');
          res.redirect('/users/add_client');
        })
        .catch(err => {console.log(err)});
    });//console.log(req.body);
      });
    }
     
});
 
 

//Add Company Post
router.post('/add_company',(req,res)=>{
  const {cname,caddress,city,state,country,mobile} = req.body;
  let errors = [];
 // console.log(req.body);
  if(cname=="" || caddress=="" || city=="" || state=="" || country=="" || mobile==""){
    //if(isNaN(mobile)){}
    //errors.push({ msg : 'All fields required' });
    req.flash('error_msg','All fields required');
    res.redirect('/users/add_company');
  }else{
    const newcomp = new Company({
      cname,
      caddress,
      city,
      state,
      country,
      mobile
    });
     newcomp.save()
      .then(user =>{
        req.flash(
          'success_msg',
          'Company details submitted successfully'
        );
        res.redirect('/users/add_company');
      })
      .catch(err => {console.log(err)});
  }
});

//Add Shop Post
router.post('/add_shop',(req,res)=> {
  const {shopname, shopaddress, 
    shopcity, shopstate, 
    shopcountry, contactname, 
    shopmobile, shopstatus, 
    shopuser, shoptpass} = req.body;
  let errors = [];
   
  if(shopname=="" || shopaddress=="" || shopstate=="" || shopcity=="" || shopcountry=="" || contactname=="" || shopmobile=="" || shopstatus=="" || shopuser=="" || shoptpass==""){
    errors.push({msg : "All fields required"});
    res.render('add_shop',{errors});
  }else{
      const newshop = new Shop({
        shopname, shopaddress, 
        shopcity, shopstate, 
        shopcountry, contactname, 
        shopmobile, shopstatus, 
        shopuser, shoptpass
      });
     newshop.save()
     .then(user =>{
       console.log(newshop);
       req.flash('success_msg','Shop details submitted successfully');
      res.redirect('/users/add_shop');
     })
     .catch(err => console.log(err));
  }
});
 
//Add Brand Post
router.post('/add_brand',add_brand.single('brandfile'), function(req,res){  
   const {brandname ,brandstatus}  = req.body;
   var fileinfo = req.file;
   let errors = [];
   console.log('size: '+JSON.stringify(req.file));
   console.log(brandname +"  "+brandstatus);
  if(brandname=="" || brandstatus=="" || JSON.stringify(req.file) == undefined){ 
    errors.push({msg : "All fields required"});
    res.render('add_brand',{errors});
  }else{
    var brandpath = req.file.path;
    const newbrand = new Brand({
      brandname, brandstatus, brandpath
    });
      newbrand.save()
      .then(user => {
        req.flash('success_msg' , 'Client details submitted successfully');
        res.redirect('/users/add_brand');
      })
      .catch(err => {console.log(err)});
  } 
}); 


//Product Post
router.post('/add_product',add_product.single('productfile'),function(req,res){
  const {productname, description} = req.body;
  var fileinfo = req.file;
  let errors = [];
  console.log(req.file);
 
 if(productname=="" || description=="" || JSON.stringify(req.file) == undefined)
 {
   errors.push({msg : "All fields required"}); 
   res.render('add_product',{errors});
 }else{
   var productpath = req.file.path;
   const newproduct = new Product({
    productname, description, productpath
   });
   newproduct.save()
    .then(user=>{
      req.flash('success_msg','Product details submitted successfully');
      res.redirect('/users/add_product');
      
      //console.log(req.body._id);
    })
    .catch(err => {console.log(err)});
 }
});
 

//reset password post
router.post('/reset-password',(req,res)=>{
  const {password,password2} = req.body;
  console.log('password: ',password,',password2: '+password2);
  // bcrypt.genSalt(10, (err, salt) => {
  //   bcrypt.hash(password, salt, (err, hash) => {
  //     if (err) throw err;
  //      password = hash;
      //console.log("local email : "+JSON.stringify(localstorage.getItem('email')));
       User.find({email : localstorage.getItem('email'),_id},function(err,result){
         if(err) console.log("Error",err);
         else{
           console.log(_id);
           console.log('result: ',JSON.stringify(result[0]));
           const user = result[0];
           //user.password = password;
        user
          .save()
          .then(user => {
            console.log('success...');
            req.flash(
              'success_msg',
              'Password changed successufully...'
            );
            res.redirect('/users/login');
          });    
         }
       }) ;
});

//forgot-password
router.post('/forgot-password',(req,res)=> {
  
  const { email } = req.body;
  let errors = [];
  console.log(email);
  if(email == ""){
     errors.push({msg:'Enter email'}); 
     res.render('forgot-password',{errors});
     }
    
  User.findOne({email : email}).then(user => {
   // console.log()
    if(user){
      req.flash('success_msg', 'Your email found');
     // localstorage.setItem('email',email);
       res.redirect('/users/reset-password');
    }else{
      errors.push({msg:'Email not exists'});
      res.render('forgot-password',{errors}); 
    }
  }) .catch(err => console.log(err));
});

module.exports = router;
