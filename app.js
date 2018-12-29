var express = require('express');
var bodyParser = require("body-parser")
var fs = require('fs')
var multer = require('multer')

var customConfig = multer.diskStorage({
    destination: function (req, res, next) {
        next(null, './uploads')
    },
    filename: function (req, file, next) {
        
        // next(null, file.originalname)

        next(null, Math.random() + '-' +file.originalname)
    }
})

// var upload = multer({dest: 'upload/'})

var upload = multer({storage: customConfig})

var server = express();

server.use(bodyParser.urlencoded())
server.use(bodyParser.json())
server.use(express.static('./frontend'))

// var users = ['Mudassir', "Rizwan", 'shoaib']
var users = [{username: 'Malik', passwoed: 123}]

server.get('/getAllUsers', (req, res)=>{
    res.send(users)
})

server.post('/addUser', (req, res)=>{

    // users.push('Raheel')                                 without name field

    // users.push(req.body.username)                         with only one field
    
    let newUser = {username: req.body.username, password: req.body.password} 
    users.push(newUser)
    res.end('User is added')
})

// File Handling is going to start from here

server.post('/createFile', (req, res)=>{
    fs.writeFile('myfiles/myNewfile.txt', "Hello Everyone", function (err){
        if(err) throw err;
        res.send('File successfully created')
    });
})


server.get('/updateFile', (req, res)=>{
    fs.appendFile('myfiles/myNewfile.txt', "Hello Everyone  once again" + '\r\n', function (err){
        if(err) {
             next (err);
        }else{

            res.send('File successfully updated')
        }
    });
 })
                

        

server.get('/getData', (req, res, next)=>{
    fs.readFile("myfiles/mynewfile.txt", 'utf8', function (err, data) {
if (err){
    next (err);
}else{

    res.send(data)
}
    
    });
})


server.delete('/deleteFile', (req, res, next)=>{
    fs.unlink('myfiles/myNewfile.txt', function (err){
    if (err){

        next(err)

    }else{
        res.send('File is successfully deleted')
    }
    });
})

server.use((err, req, res, next) =>{
    console.log(err)
    // res.status(500).send(err.message)

    res.status(500).send('Something wrong with server')
})

// server.post('/profile', upload.single('profilePicture'), function (req, res, next){
//     console.log(req.file)
//      res.send('File successfully uploaded')
// })

server.post('/profile', upload.array('profilePicture', 10), function (req, res, next){
    console.log(req.file)
     res.send('File successfully uploaded')
})

server.get('/', (req, res)=>{

    res.send("My server is Ready to use")

}).listen(4050, ()=>{console.log("Server is successfully started")})