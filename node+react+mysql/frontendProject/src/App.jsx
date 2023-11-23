import React, { useEffect, useState} from 'react'
import DOMPurify from 'dompurify';
import './App.css'

function App(){



  let [data, setData] = useState('http://localhost:5173/')
  let [articledata, setArticleData] = useState('http://localhost:5173/')

  useEffect(()=>{
    console.log(Date.now())
    fetch('http://localhost:8081/users')
    .then(res=>res.json())
    .then(data => setData(data))
    .catch(err=>console.log(err))
  }, [])


  useEffect(()=>{
    console.log(Date.now())
    fetch('http://localhost:8081/article')
    .then(res=>res.json())
    .then(articledata => setArticleData(articledata))
    .catch(err=>console.log(err))

  }, [])

 // console.log(articledata);

  useEffect(() => {
//   let cssLinks=[];
//   console.log(articledata);
//   articledata[1].forEach(element => {
//     const linkElement = document.createElement('link');
//   // Set the rel and href attributes
//   linkElement.rel = 'stylesheet';
  
//   linkElement.href = element;

//   // Append the link element to the head of the document
//   document.head.appendChild(linkElement);
//   cssLinks.push(linkElement);
//   });

//   // Clean up the link element when the component unmounts
  return () => {
    deleteCssScripts();
      };

      
   ;
 }, []);

  // useEffect(() => {
  //   // console.log(Date.now())
  //   // const linkElement = document.createElement('link');
  //   // // Set the rel and href attributes
  //   // linkElement.rel = 'stylesheet';
    
  //   // linkElement.href = articledata[1][0];

  //   // // Append the link element to the head of the document
  //   // document.head.appendChild(linkElement);
  //   // console.log('gimme css')
  //   // //js scripts
  //   // const scriptElement = document.createElement('script');
  //   // // Set the rel and href attributes
  //   // let scripts = articledata[2];
    

  //   // scripts.forEach(element => {
  //   //   scriptElement.textContent = element;

  //   // // Append the link element to the head of the document
  //   // document.body.appendChild(scriptElement);
  //   // });




  //   // Clean up the link element when the component unmounts
  //   return () => {
  //     document.head.removeChild(linkElement);
  //     document.body.removeChild(scriptElement);
  //   };
  // });
  let cssLinks=[];
  let jsScripts=[];
function deleteCssScripts(){
  cssLinks.forEach(element => {
    document.head.removeChild(element);
  });
  jsScripts.forEach(element => {
    document.body.removeChild(element);
  });
}

  function insertCssScripts(cssArr, cssWithDomainArr,  jsArr){
   // console.log(cssArr, jsArr)
    if(cssArr!='t' && jsArr!='t'){
      
      console.log(articledata);
      cssArr.forEach(element => {
        const linkElement = document.createElement('link');
      // Set the rel and href attributes
      linkElement.rel = 'stylesheet';
      
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
        jsScripts.push(scriptElement)
  
      // Append the link element to the head of the document
      document.body.appendChild(scriptElement);
      });
    }
    
  }

  //articledata = [articleHtml, cssLinks]
  console.log(Date.now())
  const sanitizedArticleData = DOMPurify.sanitize(articledata[0]);
  return (
    <>
    {insertCssScripts(articledata[1], articledata[2], articledata[3])}
    <header id='readitHeader'>
    <div className="logo_container">
        <h1>
            Read It
        </h1>
    </div>
</header>
    <main className='mainReadit'>

<section className="recents">
    <div className="heading">
        <h2>
            Недавно <br/> просмотренные
        </h2>

    </div>


</section>

<section className="input_section">
    <h1>Привет, Илья!</h1>



    <input type="text" placeholder="Введите адрес статьи..." className="text_input"/>


<div dangerouslySetInnerHTML={{ __html: sanitizedArticleData }} />




</section>




<section className="vocabulary">
    <div className="heading">
        <h2>
            Словарь
        </h2>

    </div>

</section>
</main>
    </>
    

  )
  
}

export default App