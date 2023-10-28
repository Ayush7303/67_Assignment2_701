// const express=require('express')
// const app=express()
// // app.set("view engine","ejs")
// // app.set("views","./views")
// app.set('view engine', 'ejs');

// app.get('/',(req,res)=>{
//     res.render("register.ejs");
// })
// app.listen(8000,()=>{
//     console.log("Server listening on port 8000")
// })

const express=require('express')
const multer=require('multer')
const path=require('path')
const bodyParser = require('body-parser')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app=express()
const mongoose=require('mongoose')
app.use(express.static('public'))
const user=require('./model/userschema')
// const db=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'mean'
// })
// db.connect((err)=>{
//     if(err){
//         console.error('Connection Failed.');
//         return;
//     }
//     console.log('Connected.');
// })


var options=multer.diskStorage({
    destination:function(req,file,cb){
        if(file.mimetype!=='image/jpeg')
        {
            return cb('Invalid File');
        }
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,(Math.random().toString(30)).slice(5,10)+Date.now()+path.extname(file.originalname));
    }
})
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	store: new FileStore({ path: './session-data'})
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render("login.ejs");
})
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login',async (req, res) => {
    // const { email, password } = req.body;
    var email = req.body.email;
    var password = req.body.password;
    try {
        const User = await user.findOne({ email: email, password: password });

        if (!User) {
            res.status(401).send('Invalid email or password');
            return;
        }
        // res.send('Login successful');

        req.session.loggedin = true;
		req.session.email = email;
        res.redirect('/home');
    } catch (err) { 
        console.error('Error querying user:', err);
        res.status(500).send('Login failed');
    }
});
   
    app.get('/home', (req, res) => {
        if(req.session.loggedin){
            res.render("home.ejs",{user});
        }
      
    });
    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login'); // Redirect to the login page after logout
        });
    });
    // // user.findOne({ email: email, password: password }, (err, user) => {
    //     if (err) {
    //         console.error('Error querying user:', err);
    //         res.status(500).send('Login failed');
    //         return;
    //     }

    //     if (!user) {
    //         res.status(401).send('Invalid email or password');
    //         return;
    //     }

    //     // You could implement session management or JWT here
        			
    //     res.send('Login successful');
    // });
var upload=multer({storage:options});

app.post('/register',upload.single('profilepic'),async function(req,res,next){
    const {email,password,mobileno}=req.body;
    const profilepic=req.file?req.file.filename:null;
    // const userData={
    //     email:email,
    //     password:password,
    //     mobileno:mobileno,
    //     profileimage:profilepic
    // };
    const userinsert=new user({
        email: email,
        password: password,
        mobileno: mobileno,
        profilepic: profilepic
    })
    const usersave=await userinsert.save()
    if(usersave)
    {
    res.render("login.ejs");
        
    }
    else{
        console.log("Bye")
    }
    // db.query('INSERT INTO usertb SET ?',userData,(error,results)=>{
    //     if (error) {
    //         console.error('Error inserting user data: ' + error.message)
    //         res.status(500).send('Error registering user')
    //         return;
    //     }
    //     console.log('User registered successfully')
    //     res.send('Registration successful!')
    // })
})
// app.use(function(err,req,res,next){
//     if(err instanceof multer.MulterError)
//     {
//         console.log("ERROR");
//         res.status(500).send("file upload  err "+err.message);

//     }
//     else{
//         next(err);
//     }
// })
// app.set("view engine","ejs")
// app.set("views","./views")

app.listen(8000,()=>{
    console.log("Server listening on port 8000")
})