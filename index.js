const fs= require('fs')
const http = require('http')
const { resolve } = require('path')
const HOST_NAME = 'localhost'
const PORT = 4000
const path = require('path')

const userDbPath = path.join(__dirname, "db", "users.json")
let usersDB = "";

function serverListener(req, res) {
    if (req.url === "/user/create" && req.method === "POST") {
        
        createUser(req, res)
    } else if (req.url === "/user/authenticate" && req.method === "POST"){
        authenticateUser(req, res)
    } else if (req.url === "/users" && req.method === "GET"){
        getAllUsers(req, res)
    }else if (req.url === "/book" && req.method === "POST"){
        createBook(req, res)
    }else if (req.url === "/book" && req.method === "DELETE"){
        deleteBook(req, res)
    }else if (req.url === "/book/loan_out" && req.method === "POST"){
        loanOutBook(req, res)
    }else if (req.url === "/book/return" && req.method === "POST"){
        returnLoanedBook(req, res)
    }else if (req.url === "/book/update" && req.method === "PUT"){
        updateBook(req, res)
    }

  
}



// function authenticationUser (req, res){
//     let userData = "";

//     req.on('data', chunk => {
//         userData = userData + chunk.toString();
//     })
//     req.on('end',)
// }


// function authenticateUser(req, res){
//     res.end("Authenticate User")
// }
const getAllUsers = function(req, res){
    fs.readFile(userDbPath, 'utf8', (err, users) => {
        if (err){
            res.end("An error occured")
        }
        res.end(users)
    })
    
}

function createUser(req, res){
    let userData ="";

    req.on('data', (chunk) => {
        userData += chunk.toString();
    })
    req.on('end', () => {
        const newUser = userData;
        
       
        usersDB.push(newUser);
        fs.writeFile(userDbPath, JSON.stringify(usersDB), (err) => {
            if(err){
                res.end(err)
            }
            res.end(JSON.stringify(newUser))
    })
    })


    
}

const server = http.createServer(serverListener)
server.listen(PORT, HOST_NAME, () => {
   
    console.log("Server started")
})