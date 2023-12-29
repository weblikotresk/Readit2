const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const grade = require('vocabulary-level-grader');
const superagent = require("superagent");
const cheerio = require('cheerio');
const statusCoding = require('http-status-codes')
const app = express()


app.use(express.json())
app.use(cors())


app.listen(8081, ()=>{
  console.log('listening');
})


const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"readitdb"
})


const getData = async(url) => {
    try {
        const response = await superagent.get(url)
        const $ = cheerio.load(response.text);
        const articleContent = $('article').html();

        const title = $('title').map((index, element)=>{
          return $(element).text()
        }).get()

        const metaImgLinks = $('meta[property="og:image"]').map((index, element)=>{
          return $(element).attr('content')
        }).get()

        const cssLinks = $('link[rel="stylesheet"]').map((index, element) => {
            return url.match(/^https?:\/\/.+\//gm) + $(element).attr('href');
        }).get();
        const cssLinksWithDomain = $('link[rel="stylesheet"]').map((index, element) => {
            return $(element).attr('href');
            
        }).get();
        const scripts = $('style').map((index, element) => {
            return $(element).html(); 
        }).get();

        //cefr grade
        const articleText = cheerio.load(articleContent).text()
        const CEFR_grade = grade(articleText);
        console.log(CEFR_grade.meta.grade);

        let dataToFrontend={
          articleHTMLContent:articleContent,
          cssLinks:cssLinks,
          cssLinksWithDomain:cssLinksWithDomain,
          scripts:scripts,
          CEFR_grade:CEFR_grade.meta.grade,
          metaImgLinks: metaImgLinks,
          title:title,
          status:response.status
        }


        return dataToFrontend

      } catch (error) {

        


        if(error){
          console.log('code of error:', error.status )
          console.error(error);
          if(error.code =='ENOTFOUND'){
            return {error:error, status: 'Not Found'}
          }
          return {error:error, status: statusCoding.getReasonPhrase(error.status)}
          //403 forbidden
        }

      }

    
    

}


const util = require('util');
const dbQueryAsync = util.promisify(db.query).bind(db);

const sendToDB = async (query, values) => {
  try {
    const data = await dbQueryAsync(query, [values]);
    return data;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Duplicate entry error');
    } else {

      console.error('Database error:', error);
      throw error; // rethrow the error if it's not a duplicate entry error
    }
  }
};



const getFromDB = async(req, res, sql)=>{
  db.query(sql, (err, data)=>{
      if(err) throw err;
      return res.json(data);
  })
}

async function getTranslate(to_translate) {
  if(to_translate =="") return {text:"", detectedLanguageCode:"ru"}
  const folder_id = 'b1ggralllcs9g3pa3q99'
    const target_language = 'ru'
    const texts = to_translate
  const response = await fetch('https://translate.api.cloud.yandex.net/translate/v2/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Api-Key AQVNxmH8Hzgv_gwa_Vz0g2MpIkNaZaxWy3WmEufe',
    },
    body: JSON.stringify({
      targetLanguageCode: target_language,
      texts: texts,
      folderId: folder_id
    })
  });
  const result = await response.json();
  return result.translations[0];
}




app.get('/article', async (re,  res)=>{
    if(re.query.url){
        const article_response = await getData(re.query.url);
        //error handler
        if(article_response.articleHTMLContent == undefined){
          console.log('sussy baka', article_response.status)
          res.json(article_response);
          return null;
        }else if(article_response.title.length > 1){
          article_response.title = article_response.title[0]
        }


         res.json(article_response)


        // post to db
        const sql = "SELECT * FROM recents WHERE (url = '" + re.query.url + "')";
        db.query(sql, (err, data)=>{
            if(err) throw err;
            if(data[0] == undefined){
              const insert_query = "INSERT INTO `recents`(`title`, `cefr_grade`, `url`, `main_image_URL`)  VALUES (?)"
              const values =[
                article_response.title,
                article_response.CEFR_grade,
                re.query.url,
                article_response.metaImgLinks
              ]
              sendToDB(insert_query, values)
            }else{
              //update timestamp
              let now_timestamp = new Date(Date.now())
              let offsetTime = new Date(now_timestamp.getTime() - now_timestamp.getTimezoneOffset() * 60 * 1000);
              offsetTime = offsetTime.toISOString().slice(0, 19).replace('T', ' ');
              const insert_query = `UPDATE recents SET timestamp = '${offsetTime}' WHERE url = (?)`
              sendToDB(insert_query, re.query.url)
            }
        })
    }else{
        console.log('url is empty')
    }
    
})

app.get('/recents', (req, res)=>{
  const sql = `SELECT * FROM recents ORDER BY timestamp DESC LIMIT ${4 + parseInt(req.query.counter)} `;
  console.log(sql)
  getFromDB(req, res, sql)
})

app.get('/vocab', (req, res)=>{
  const sql = "SELECT * FROM vocab ORDER BY timestamp DESC";
  getFromDB(req, res, sql)
})

app.get('/translate', async (req, res)=>{
  const result = await getTranslate(req.query.text);
  res.json(result)
})


app.post('/create', async (req, res) => {
    let postData  = req.body;
    if(postData.word !='' && postData.word){
      const sql_query = "INSERT INTO `vocab`(`word`, `translation`, `lang`)  VALUES (?)"
      const values =[
            req.body.word,
            req.body.translate,
            req.body.lang
          ]


          try {
            const result = await sendToDB(sql_query, values);
            console.log('Insert successful:', result);
          } catch (error) {
            console.error('Error:', error.message);
            
            res.status(400).json(error)
          }
          
        
      
    }else{
      console.log('the word is empty')
    }
});

