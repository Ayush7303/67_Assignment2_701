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
const bodyParser = require('body-parser');
const app=express()
const mysql=require('mysql')
app.use(express.static('public'))

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mean'
})
db.connect((err)=>{
    if(err){
        console.error('Connection Failed.');
        return;
    }
    console.log('Connected.');
})

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
var upload=multer({storage:options});
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register',upload.single('profilepic'),function(req,res,next){
    const {email,password,mobileno}=req.body;
    const profilepic=req.file?req.file.filename:null;
    const userData={
        email:email,
        password:password,
        mobileno:mobileno,
        profileimage:profilepic
    };
    db.query('INSERT INTO usertb SET ?',userData,(error,results)=>{
        if (error) {
            console.error('Error inserting user data: ' + error.message)
            res.status(500).send('Error registering user')
            return;
        }
        console.log('User registered successfully')
        res.send('Registration successful!')
    })
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
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render("register.ejs");
})
app.listen(8000,()=>{
    console.log("Server listening on port 8000")
})