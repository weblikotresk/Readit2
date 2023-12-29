import Vocabulary from "./Vocabulary"

import styles from './VocabularyPage.module.css'
import Header from "./Header"
import Footer from "./Footer"
import MobileFooter from "./MobileFooter"

import { useMediaQuery } from 'react-responsive'
import './general_styles.css'

export default function VocabularyPage(){
    return(
        <> 
        <Header/>

        <div className={styles['vocab-h1-container']}>
        <h1 className={styles['vocab-h1']}>Словарь</h1>
        </div>
        

        <Vocabulary className={styles['vocab-container']}/>
        {
      useMediaQuery({ minWidth: 1000 }) ?(
        <Footer/>

      ): <MobileFooter/>
    }
        </>
    )
}