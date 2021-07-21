const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const session=require('express-session');
const flash = require('connect-flash');
const window=require('window');
const alert=require('alert');

//const bodyParser=require("body-parser");
//let user_id;
const methodOverride=require("method-override");

app.use(methodOverride("_method"));

app.use(flash());
app.use(express.static("assets"));

app.use(express.urlencoded({extended:true}));
app.use(session({ secret:'notagoodsecret' }));

const User=require('./models/user');
const Achievement=require('./models/achievement');
const Collect=require('./models/collect');
const Access=require('./models/access');



app.set("view engine","ejs"); 

app.listen(3000, () => { 
    console.log('Server listening on port 3000'); 
});

mongoose.connect('mongodb://localhost:27017/userAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Access.create({
//     rid:"INFO8325",
//     usn:["1RV18CS143", "1RV18CS142"]
// }, (err,access)=>{
//     if(err){
//         console.log("something wrong with create");
//         console.log(err);
//     } else {
//         console.log(access);
//     }
// });

// const requireLogin = (req, res, next) => {
//     if (!req.session.user_id) {
//         return res.redirect('/login')
//     }
//     next();
// }
app.get("/",(req,res)=>{
    res.render("index");
});

// app.get('/secret', (req,res)=>{
//     if(!req.session.user_id){
//         res.redirect('/login');
//     }
//     res.send("THIS IS A SECRET AND CAN BE SEEN IF U ARE LOGGED IN ONLY!");
// }); 


var mysql      = require('mysql');
const achievement = require("./models/achievement");
const { render } = require("ejs");
var connection = mysql.createConnection({
    host     : 'localhost',
    database : 'sawa',
    user     : 'root',
    password : 'root',
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);
});

// connection.query('SELECT * FROM user', function (error, results, fields) {
//     if (error)
//         throw error;

//     results.forEach(result => {
//         console.log(result);
//     });
// });



//REGISTER ROUTE
app.get("/register",(req,res)=>{
    res.render("signup");
});

app.post("/register", async (req,res)=>{
    const { username,id,pwd,pwd2 }=req.body;
    // const p1= pwd.toString();
    // const p2= pwd2.toString();
    if(username===""){
        alert("Username cannot be Blank");
        return;
    }   
    else if(id===""){
        alert("UserID cannot be Blank");
        return;
    }
    else if(pwd==="" || pwd2==="" ){
        alert("Passwords cannot be Blank");
        return;
    }
    // else if(!(pwd===pwd2)){
    //     alert("Passwords do not match");
    //     return;
    // }
    else
        console.log("hi");
    // let user= await User.findOne({ username });


    //uncomment this ffs
    let user= await User.findOne({ $or: [ {'username':username} , {'userid':id} ]  });
    //let user1=User.findOne({ id });

    if(user){
        alert("Username or UserID already exists");
        //res.redirect("/register");
    }


    // else if(user1){
    //     alert("user id already exists");
    // }
    else{
        const hash= await bcrypt.hash(pwd,12);
        //res.send(hash);
        user=new User({
        userid:id,
        username:username,
        password:hash
        });
        var u={
            "username":username,
            "id":id,
            "password":hash
          }
         
         connection.query('INSERT INTO user SET ?',u, function (error, results, fields) {
           if (error) {
             res.send({
               "code":400,
               "failed":"error ocurred"
             })
           } else {
            //  res.send({
            //    "code":200,
            //    "success":"user registered sucessfully"
            //      });
                console.log("inserted into db");
             }
         });
            await user.save();
        //req.session.user_id=user_id;
        res.redirect("/");
    }
        //const hash= await bcrypt.hash(pwd,12);
        // let q="INSERT INTO user VALUES("+username+","+id+","+hash+")";
        // console.log(q);
        // connection.query("INSERT INTO user VALUES( %s ,"+id+","+hash+")", function (error, results, fields) {
        //     if (error)
        //         throw error;
        
        //     results.forEach(result => {
        //         console.log(result);
        //     });
        // });

        // var u={
        //     "username":username,
        //     "id":id,
        //     "password":hash
        //   }
         
        //  connection.query('INSERT INTO user SET ?',u, function (error, results, fields) {
        //    if (error) {
        //      res.send({
        //        "code":400,
        //        "failed":"error ocurred"
        //      })
        //    } else {
        //      res.send({
        //        "code":200,
        //        "success":"user registered sucessfully"
        //          });
        //      }
        //  });
    
});

//LOGIN ROUTE
app.get("/studentlogin",(req,res)=>{
    res.render("studentLogin");
});

app.post("/studentlogin", async (req,res)=>{
    const { username,id,pwd }=req.body;
    if(username===""){
        alert("Username cannot be Blank");
        return;
    }   
    else if(id===""){
        alert("USN cannot be Blank");
        return;
    }
    else if(pwd===""){
        alert("Password cannot be Blank");
        return;
    }
    const user= await User.findOne({ username });
    if(!user){
        alert("Wrong Credentials entered.");
        return;
    }
    const validPassword = await bcrypt.compare(pwd,user.password);
    if(validPassword){
        const st="/student/"+user.userid;
        res.redirect(st);
    }
    else {
         //res.send('Try again');
         //req.flash('error', "Wrong credentials");
         alert("Invalid Username or password");
         //window.location.href = "./";
         //res.redirect('/studentlogin');
    }
});
// app.post('/register', catchAsync(async (req, res, next) => {
//     try {
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome to Yelp Camp!');
//             res.redirect('/campgrounds');
//         })
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('register');
//     }
// }));

app.get("/teacherlogin",(req,res)=>{
    res.render("teacherLogin");
});

app.post("/teacherlogin", async (req,res)=>{
    const { username,tid,pwd }=req.body;
    if(username===""){
        alert("Username cannot be Blank");
        return;
    }   
    else if(tid===""){
        alert("TeacherID cannot be Blank");
        return;
    }
    else if(pwd===""){
        alert("Password cannot be Blank");
        return;
    }
    const user= await User.findOne({ username });
    if(!user){
        alert("Wrong Credentials entered.");
        return;
    }
    const validPassword = await bcrypt.compare(pwd,user.password);
    if(validPassword){
        //console.log(tid);
        Collect.findOne({ tid }, (err,teacher)=>{
            if(err)
                console.log(err);
            else{
                    let arr=teacher.usn;
                    let acharr=["Internship","Course","Paper","Project","Technical Paper","Co-curricular","Sports"];
                    res.render("teacherLand",{arr:arr,acharr:acharr});
                }
        });
    }
    else{
        alert("Invalid Username or password");
    }
});


app.get("/recruiterlogin",(req,res)=>{
    res.render("recruiterLogin");
});

app.post("/recruiterlogin", async (req,res)=>{
    const { username,rid,pwd }=req.body;
    if(username===""){
        alert("Username cannot be Blank");
        return;
    }   
    else if(rid===""){
        alert("RecruiterID cannot be Blank");
        return;
    }
    else if(pwd===""){
        alert("Password cannot be Blank");
        return;
    }
    const user= await User.findOne({ username });
    if(!user){
        alert("Wrong Credentials entered.");
        return;
    }
    const validPassword = await bcrypt.compare(pwd,user.password);
    if(validPassword){
        //console.log(rid);
        Access.findOne({ rid }, (err,recruiter)=>{
            if(err)
                console.log(err);
            else{
                    let arr=recruiter.usn;
                    //console.log(arr);
                    res.render("recruiterLand",{arr:arr});
                }
        });
    }
    else{
        alert("Invalid Username or password");
    }
});


app.get('/logout', (req, res) => {
    //req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/');
})

//Landing page
app.get("/student/:id",  (req,res)=>{
    const userid=req.params.id;
    let stud="";
    User.findOne({ userid }, (err,user)=>{
        if(err)
            console.log(err);
        else{
                stud=user;
            }
    });
    console.log(stud);
    Achievement.find({userid:userid}, (err,achs)=>{
        if(err)
            console.log(err);
        else{
                res.render("studentLand",{achs:achs,user:stud});
            }
    });
});




// app.get('/topsecret', requireLogin, (req, res) => {
//     res.send("TOP SECRET!!!")
// })
app.get("/student/:id/new", (req,res) => {  //this shows the form that is then directed to the post route
    console.log(req.params.id);
    res.render("new",{id:req.params.id});
});

//CREATE ROUTE
app.post("/student/:id/new", (req,res)=>{
    // req.body.blog.desc= req.sanitize(req.body.blog.desc);    
    // const userid=req.body.ach.userid;
    const userid=req.params.id;
    let {userid1,achtype,link,desc}=req.body.ach;

    req.body.ach.userid=userid;
    //let achiev= 
    let ac=Achievement.findOne({ $and: [ {'userid':userid1} , {'achtype':achtype}, {'desc':desc} ]}, (err,achiev)=>{
        if(err){
            console.log(err);
        }
        else{
                // if(achiev!=null){
                //     console.log(achiev);
                //     alert("Achievement already exists");
                //     return;
                //     //res.redirect("/register");
                
                if(achiev!=null){
                    console.log("inside");
                    console.log(achiev.userid);
                    console.log(achiev.achtype);
                    console.log(achiev.desc);
                    alert("Achievement already exists");
                    return;
                }
            }
    });
    // if(ac!=null){
    //     console.log("HIIII");
    //     console.log(ac.userid);
    //     console.log(ac.achtype);
    //     console.log(ac.desc);
    //     console.log(ac);
    //     alert("Achievement already exists");
    //     return;
    //     //res.redirect("/register");
    // }
    // if(ac==null){
    //     Achievement.create(req.body.ach, (err,ach)=>{            
    //         if(err){
    //             console.log("something wrong with create");
    //             console.log(err);
    //             res.render("new");
    //         } else {
    //             //console.log(camp);
    //             res.redirect("/student/"+userid);
    //         }
    //     });
    //     //res.redirect("/register");
    // }
    // else{
    //     console.log("HIIII");
    //     console.log(ac.userid);
    //     console.log(ac.achtype);
    //     console.log(ac.desc);
    //     console.log(ac);
    //     alert("Achievement already exists");
    //     return;
    // }
    //let user1=User.findOne({ id });
    // console.log(achiev);

    // if(achiev){
    //     alert("Achievement already exists");
    //     return;
    //     //res.redirect("/register");
    // }


    Achievement.create(req.body.ach, (err,ach)=>{            
        if(err){
            console.log("something wrong with create");
            console.log(err);
            res.render("new");
        } else {
            //console.log(camp);
            res.redirect("/student/"+userid);
        }
    });
});
//EDIT ROUTE
app.get("/student/:id1/achievement/:id/edit",(req,res)=>{
    let stud="";
    const userid=req.params.id1;
    User.findOne({ userid }, (err,user)=>{
        if(err)
            console.log(err);
        else{
                stud=user;
            }
    });
    //console.log(stud);
    Achievement.findById(req.params.id, (err,foundAch)=>{
        if(err)
            res.redirect("/");
        else
            res.render("edit", {ach: foundAch, user:stud});
    });
});

//UPDATE ROUTE
app.put("/student/:id1/achievement/:id", (req,res)=>{
    // req.body.blog.body= req.sanitize(req.body.blog.body);
    let stud="";
    const userid=req.params.id1;
    User.findOne({ userid }, (err,user)=>{
        if(err)
            console.log(err);
        else{
                stud=user;
            }
    });
    // let {userid1,achtype,link,desc}=req.body.ach;

    // req.body.ach.userid=userid;
    // let achiev= Achievement.findOne({ $and: [ {'userid':userid1} , {'achtype':achtype}, {'desc':desc} ]  });
    // //let user1=User.findOne({ id });

    // if(achiev){
    //     alert("Achievement already exists");
    //     return;
    //     //res.redirect("/register");
    // }
    Achievement.findByIdAndUpdate(req.params.id, req.body.ach, (err,updatedach)=>{
        if(err){
            res.redirect("/");
        }else{
            console.log(updatedach);
        }
    });
    Achievement.find({userid:userid}, (err,achs)=>{
        if(err)
            console.log(err);
        else{
                res.redirect("/student/"+stud.userid);
            }
    });
});


//DELETE ROUTE
app.delete("/student/:id1/achievement/:id", (req,res)=>{
    Achievement.findByIdAndRemove(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/"); 
        }else{
            console.log(foundBlog);
        }
    });
    const userid=req.params.id1;
    User.findOne({ userid }, (err,user)=>{
        if(err)
            console.log(err);
        else{
            res.redirect("/student/"+user.userid);
            }
    });
});

//student viewing for recruiter
app.get("/recruiter/:id",  (req,res)=>{
    const userid=req.params.id;
    let stud="";
    User.findOne({ userid }, (err,user)=>{
        if(err)
            console.log(err);
        else{
                stud=user;
            }
    });
    //console.log(stud);
    Achievement.find({userid:userid}, (err,achs)=>{
        if(err)
            console.log(err);
        else{
                res.render("recruiterview",{achs:achs,user:stud});
            }
    });
})

app.get("/teacherachievement/:id",  (req,res)=>{
    const achtype=req.params.id;
    let stud="";
    // User.findOne({ userid }, (err,user)=>{
    //     if(err)
    //         console.log(err);
    //     else{
    //             stud=user;
    //         }
    // });
    //console.log(stud);
    Achievement.find({achtype:achtype}, (err,achs)=>{
        if(err)
            console.log(err);
        else{
                res.render("achieveLand",{achs:achs}); //CHANGE THIS + achieveLand also
            }
    });
});