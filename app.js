const express = require("express");
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const fileUpload = require('express-fileupload');

//cookies and file 
const cookieParser = require('cookie-parser')



//regular middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true}))



//cookies and file upload
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

//temp check
app.set("view engine","ejs");

// importing all the routers here
const home = require('./routes/home')
const user = require('./routes/user');

app.use(morgan("tiny"))

// router middleware
app.use('/api/v1',home)
app.use('/api/v1',user)

app.get('/signuptest',(req,res)=> {
    res.render("signuptest")
})


// exporting
module.exports = app 

