import React, {useState} from 'react'

import { useMediaQuery } from 'react-responsive'
import {useParams} from 'react-router-dom'

import Article from './Article.jsx'
import Vocabulary from './Vocabulary.jsx'
import  WordsContext  from './WordsContext';
import Recents from './Recents.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import MobileFooter from './MobileFooter.jsx';

import styles from './App.module.css'


const snapWidth = 1000;

function App(){

  let [articleUrl, setArticleUrl] = useState('')
  let [wordsAdded, setWordsAdded] = useState(0)

  const { url } = useParams();
  url ? setArticleUrl(url):null;

  console.log(wordsAdded, 'i hav in app rn')
  
  const inputHandler = (e, url=document.getElementById('text_input').value)=>{
    {
      e.preventDefault();
      console.log("submitted")
      setArticleUrl(url)
      
    }
  }

  const handleRecentsClick = (url) => {
    setArticleUrl(url)
  };

  return (
    <WordsContext.Provider value={wordsAdded}>
    <>
    <Header/>
    <main  className={styles['mainReadit']}>

{useMediaQuery({ minWidth: snapWidth }) ? (
  <section className={styles["recents"]}>
    <div className={styles["heading"]}>
        <h2>
            Недавно <br/> просмотренные
        </h2>
    </div>
     <Recents onCardClick={handleRecentsClick}/>


</section>

):null}




<section className={styles["input_section"]} id='input_section'>
  <div className={styles["input_container"]}>
    <h1>Привет!</h1>


  <form id="form" onSubmit={inputHandler}>
    <input type="text" placeholder="Введите адрес статьи..." className={styles["text_input"]} id="text_input" pattern="https?://.+"/>
    
    <div className={styles["submit_btn"]} onClick={inputHandler}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path id="first-path" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#323232" strokeWidth="2"/>
      <path id="second-path" d="M16 12L8 12" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path  id="third-path"d="M13 15L15.913 12.087V12.087C15.961 12.039 15.961 11.961 15.913 11.913V11.913L13 9" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <input type="submit"/>
  </form>
  </div>
    



    {articleUrl ? <Article url={articleUrl} states={[wordsAdded, setWordsAdded]}/> : null}
    
    
    
    

</section>


{useMediaQuery({ minWidth: snapWidth }) ? (
  <section className={styles[ "vocabulary"]}>
    <div className={styles["heading"]}>
        <h2>
            Словарь
        </h2>

    </div>
    <Vocabulary data = {wordsAdded} className='vocab-container'/>
</section>


):null}






    </main>

    {
      useMediaQuery({ minWidth: snapWidth }) ?(
        <Footer/>

      ): <MobileFooter/>
    }
    
    </>

    </WordsContext.Provider>

    

  )
  
}

export default App