const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test"
})

const superagent = require("superagent");
const cheerio = require('cheerio');

//"https://edition.cnn.com/2023/11/19/world/argentina-vote-milei-massa-nov-19/index.html"
    const getData = async() => {
    try{
        const response = await superagent.get("https://www.nytimes.com/2023/11/16/us/politics/biden-trump-election-presidents-polling.html")
        const $ = cheerio.load(response.text);
        const articleContent = $('article').html();
        const cssLinks = $('link[rel="stylesheet"]').map((index, element) => {
            return "https://www.nytimes.com/" + $(element).attr('href');
            
          }).get();
        const cssLinksWithDomain = $('link[rel="stylesheet"]').map((index, element) => {
            return $(element).attr('href');
            
          }).get();
        const scripts = $('style').map((index, element) => {
            return $(element).html(); // Or use $(element).attr('src') to get the "src" attribute
        }).get();
          
          //console.log([articleContent, cssLinks]);

        //console.log(scripts);
        return [articleContent,cssLinks,cssLinksWithDomain, scripts]
    }
    catch(e)
    {
        console.log(e);
    }
    }

    
getData().then(resp =>{
    app.get('/article', (re,  res)=>{
        return res.json(resp);
        //return res.json('From Backend Side');
    })
    

})




// async function getData() {
//     // Assuming you have a function that returns a Promise
//     const result = await myAsyncFunction();
  
//     // Do something with the result or perform additional actions
  
//     // Return the value
//     return result;
//   }
  
//   // Example of an asynchronous function that returns a Promise
//   function myAsyncFunction() {
//     return new Promise((resolve, reject) => {
//       // Simulating an asynchronous operation (e.g., fetching data from a database or API)
//       setTimeout(() => {
//         const data = "Hello, World!";
//         resolve(data);
//       }, 1000); // Simulating a delay of 1000 milliseconds (1 second)
//     });
//   }
  
//   // Usage of the function
//   getData().then((result) => {
//     console.log(result); // This will log "Hello, World!" after the Promise is fulfilled
//   });


app.get('/users', (req, res)=>{
    const sql = "SELECT * FROM USERS";
    console.log('gettin users')
    db.query(sql, (err, data)=>{
        if(err)return res.json(err);
        return res.json(data);
    })
})


app.get('/articled', (req, res)=>{
    const sql = "SELECT * FROM USERS";
    console.log('gettin users')
    db.query(sql, (err, data)=>{
        if(err)return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, ()=>{
    console.log('listening');
})