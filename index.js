const fs= require('fs')
const http = require('http')
const { resolve } = require('path')
const HOST_NAME = 'localhost'
const PORT = 4000
const path = require('path')
const { brotliDecompressSync } = require('zlib')

const userDbPath = path.join(__dirname, "db", "users.json")
const bookDbPath = path.join(__dirname, "db", "books.json")
let usersDb = [];
let booksDB =[];

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
    let userData =[];

    req.on('data', (chunk) => {
       userData.push(chunk);
    })
    req.on('end', () => {
        const parsedUser = Buffer.concat(userData).toString();
        const newUser = JSON.parse(parsedUser);

        fs.readFile(userDbPath, 'utf8', (err, users) => {
            if (err){
                res.end("An error occured")
            }
            const oldUsers = JSON.parse(users);
            const allUsers = [...oldUsers, newUser]

            fs.writeFile(userDbPath, JSON.stringify(allUsers), (err) => {
                if(err){
                    res.writeHead(500);
                    res.end(err)
                }
                res.end(JSON.stringify(newUser));
            })
        });
       
    })
    
}

function createBook(req, res){
    let bookDb =[];

    req.on('data', (chunk) => {
       bookDb.push(chunk);
    })
    req.on('end', () => {
        const parsedBook = Buffer.concat(bookDb).toString();
        const newBook = JSON.parse(parsedBook);

        // const lastBook = booksDB[booksDB.length - 1];
        // const lastBookId = lastBook.id
        // newBook.id = lastBookId + 1;
        // console.log(newBook.id)


        fs.readFile(bookDbPath, 'utf8', (err, books) => {
            if (err){
                res.end("An error occured")
            }
            
            const oldBooks = JSON.parse(books);
            const allBooks = [...oldBooks, newBook]

            const lastBook = oldBooks[oldBooks.length - 1]
            const lastBookId = lastBook.id
            newBook.id = lastBookId + 1;
                        
            fs.writeFile(bookDbPath, JSON.stringify(allBooks), (err) => {
                if(err){
                    res.writeHead(500);
                    res.end(err)
                }
                res.end(JSON.stringify(newBook));
            })
        });
       
    })
    
}

const server = http.createServer(serverListener)
server.listen(PORT, HOST_NAME, () => {
    booksDB = JSON.parse(fs.readFileSync(bookDbPath, 'utf8'));
    console.log("Server started")
})