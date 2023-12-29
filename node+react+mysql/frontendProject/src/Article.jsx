import TranslatePopup from './TranslatePopup.jsx'
import './general_styles.css'
import './article.css'
import DOMPurify from 'dompurify';
import React, { useEffect, useState} from 'react'

let cssLinks=[];
let jsScripts=[];

let dataToFrontend={
  articleHTMLContent:"Loading article...",
  cssLinks:"cssLinks",
  cssLinksWithDomain:"cssLinksWithDomain",
  scripts:"scripts",
  CEFR_grade:"Loading CEFR...",
  metaImgLinks: "metaImgLinks",
  title:"Loading title..."
}



function Article(props){
  let [toTranslateText, setToTranslateText] = useState('')
  let [backendData, setBackendData] = useState(dataToFrontend)
  let [insertCSSFlag, setCSSFlag] = useState(false)

  
  const selectHandler = (e)=>{
    e.preventDefault();
    
    let selected_text = window.getSelection().toString().trim().toLowerCase();
    setToTranslateText(selected_text)
  }

  useEffect(()=>{
    console.log(Date.now())

    fetch(`http://localhost:8081/article?url=${props.url}`)
    .then(res=>res.json())
    .then(data =>{
      console.log('got me article')
      if(data.articleHTMLContent == undefined) throw data
      setBackendData(data)
      setCSSFlag(true)
    } )
    .catch(err=>{
      console.log(err);
      alert("Возникла ошибка на сервере: " + err.error.status + " " + err.status + ". Попробуйте ввести другую статью.")
      document.getElementById('ArticleFetched').remove()
      document.getElementsByClassName('cefr-grade-outer')[0].remove()

    })
  }, [props.url])


  function insertCssScripts(cssArr, cssWithDomainArr,  jsArr){

    deleteCssScripts()
    console.log("css inserted")
     if(cssArr!='t' && jsArr!='t'){
       
       console.log(dataToFrontend);
       cssArr.forEach(element => {
         const linkElement = document.createElement('link');
       // Set the rel and href attributes
       linkElement.rel = 'stylesheet';
       let data = linkElement.dataset;
       data.descent = 'readitInserted';
       linkElement.href = element;
   
       // Append the link element to the head of the document
       document.head.appendChild(linkElement);
       cssLinks.push(linkElement);
       });
  
       //css scripts with domain
       
       cssWithDomainArr.forEach(element => {
         const linkElement = document.createElement('link');
       // Set the rel and href attributes
       linkElement.rel = 'stylesheet';
      let data = linkElement.dataset;
       data.descent = 'readitInserted';
       linkElement.href = element;
   
       // Append the link element to the head of the document
       document.head.appendChild(linkElement);
       cssLinks.push(linkElement);
       });
   
   
   
   
       //js scripts
       
       // Set the rel and href attributes
       jsArr.forEach(element => {
         const scriptElement = document.createElement('style');
         scriptElement.textContent = element;
         let data = scriptElement.dataset;
          data.descent = 'readitInserted';
         jsScripts.push(scriptElement)
   
       // Append the link element to the head of the document
       document.body.appendChild(scriptElement);
       });
     }
     
  }

  function deleteCssScripts(){
    let styles = document.querySelectorAll('style[data-descent]');
    console.log( [...styles])
    styles = [...styles]
    let links = document.querySelectorAll('link[data-descent]');
    links=[...links]
    if(styles !=[]&&links!=[]){
      for(let i=0;i<styles.length;i++){
        styles[i].parentNode.removeChild(styles[i])
      }
      for(let i=0;i<links.length;i++){
        links[i].parentNode.removeChild(links[i])
      }
    }

  }





   console.log(backendData)
  const sanitizedArticleData = DOMPurify.sanitize(backendData.articleHTMLContent);

  return(
    <>

    {
    insertCSSFlag ?
      
      insertCssScripts(backendData.cssLinks, backendData.cssLinksWithDomain, backendData.scripts)


    : (null)
    }

    <div className="cefr-grade-outer">
      <span>
      Сложность данного текста —
      </span>
      <div className="cefr-grade-article">
        {backendData.CEFR_grade}
      </div>
    </div>

    
    <div id="ArticleFetched" onPointerUp={selectHandler} dangerouslySetInnerHTML={{ __html: sanitizedArticleData }} />
    
    {toTranslateText ? <TranslatePopup text={toTranslateText} states = {props.states}/> : null}
    </>

  )

}

export default Article