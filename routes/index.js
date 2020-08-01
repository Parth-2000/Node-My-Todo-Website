var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var todoModule = require('../modules/todo');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var getTodos = todoModule.find({});


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



function checkLoginUser(req, res, next){
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch (error) {
    res.redirect('/');
  }
  next();
}

function checkDuplicateEmail(req, res, next){
  var email = req.body.email;
  var checkExitingEmail = userModule.findOne({email: email});  
  checkExitingEmail.exec((err, data) => {
    if(err) throw err;
    if(data){
      return res.render('register', { title: 'Express', msg: "Email Already Exits."});
    }
    next();
  });
}

function checkDuplicateUserName(req, res, next){
  var username = req.body.username;
  var checkExistingUsername = userModule.findOne({username: username});
  checkExistingUsername.exec((err, data) => {
    if(err) throw err;
    if(data){
      return res.render('register', { title: 'Express', msg: "Username Already Exits"});
    }
    next();
  })
}

/* GET landing page. */
router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./home');
  }else{
    res.render('index', { title: 'Express', msg: '' });
  }
});

/* POST landing page */
router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var checkUserExits = userModule.findOne({username: username});
  checkUserExits.exec((err, data) => {
    if(err) throw err;
    // var getUserID = data._id;
    // var getPassword = data.password;
    if(!data){
      res.render('index', { title: 'Express', msg: 'Invalid Username and Password' });
    }else{
      if(bcrypt.compareSync(password, data.password)){
        var getUserID = data._id;
        var token = jwt.sign({userID: getUserID}, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        res.redirect('/home');
      }else{
        res.render('index', { title: 'Express', msg: 'Invalid Username and Password' });
      }  
    }    
  });  
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./home');
  }else{
    res.render('register', { title: 'Express', msg: ""});
  }
});

/* POST register page. */
router.post('/register', checkDuplicateUserName, checkDuplicateEmail, function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;
  var gender = req.body.gender;
  var email = req.body.email;
  var contactnumber = req.body.contactnumber;

  if(password != confirmpassword){
    res.render('register', { title: 'Express', msg: 'Password Not Matched' });
  }else{
    password = bcrypt.hashSync(password, 10);
    var userDetails = new userModule({
      username: username,
      email: email,
      password: password,
      gender: gender,
      contactnumber: contactnumber,
    });
    userDetails.save((err, doc) => {
      if(err) throw err;
      res.render('register', { title: 'Express', msg: 'User Register Successfully' });
    });
  }  
});

/* GET home page. */
router.get('/home', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  getTodos.exec(function(err, data){
    if(err) throw err;
    res.render('home', { title: 'Express', loginUser: loginUser, msg: "", records: data, fetchData: ""});
  }); 
});

/* POST home page. */
router.post('/home', checkLoginUser, function(req, res, next) {
  var title = req.body.title;
  var description = req.body.description;
  var loginUser=localStorage.getItem('loginUser');
  console.log(loginUser);
  var todoDetails = new todoModule({
    username: loginUser,
    title: title,
    description: description,
  });
  todoDetails.save((err, doc) => {
    if(err) throw err;
    console.log("Data Inserted Succesfully");
    getTodos.exec(function(err, data){
      if(err) throw err;
      res.render('home', { title: 'Express', loginUser: loginUser, msg: "Data Inserted Successfully", records: data, fetchData:""});
    }); 
  });
});

/* GET edittodo route */
router.get('/edit/:id', checkLoginUser, function(req, res, next){
  var loginUser=localStorage.getItem('loginUser');
  var getTodoID = req.params.id;
  console.log(getTodoID);
  var todoEditInfo = todoModule.findById(getTodoID);
  todoEditInfo.exec(function(err, data){
    console.log(data);
    if(err) throw err;
    res.render('edit', { title: 'Express', loginUser: loginUser, msg: "", records: "", fetchData: data});
    // res.redirect('/home');
  }); 
});

/* POST edittodo route */
router.post('/edit/', checkLoginUser, function(req, res, next){
  var title = req.body.title;
  var description = req.body.description;
  var id = req.body.id;
  var loginUser=localStorage.getItem('loginUser');
  var todoEditInfo = todoModule.findById(id);
  var editTodoDetails = todoModule.findByIdAndUpdate(id, {
    username: loginUser,
    title: title,
    description: description,
  });
  editTodoDetails.exec((err, doc) => {
    if(err) throw err;
    todoEditInfo.exec(function(err, data){
      if(err) throw err;
      // getTodos.exec(function(err, data1){
      //   if(err) throw err;
      //   res.render('home', { title: 'Express', loginUser: loginUser, msg: "Data Updated Successfully", records: data1, fetchData: ""});
      // });      
      res.redirect('/home');
    }); 
  });
});

/* GET deletetodo route */
router.get('/home/delete/:id', checkLoginUser, function(req, res, next){
  var loginUser=localStorage.getItem('loginUser');
  var getTodoID = req.params.id;
  // console.log(getTodoID);
  var todoDelete = todoModule.findByIdAndDelete(getTodoID);
  todoDelete.exec(function(err, data){
    if(err) throw err;
    res.redirect('/home');
  }); 
});

/* GET logout route. */
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});


module.exports = router;