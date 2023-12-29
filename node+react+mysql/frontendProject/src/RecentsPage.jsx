import MobileFooter from "./MobileFooter";
import Header from "./Header";
import Recents from "./Recents";
import Footer from "./Footer";
import Article from "./Article";
import { useMediaQuery } from 'react-responsive'
import styles from './RecentsPage.module.css'
import React, { useState} from 'react'

export default function RecentsPage(){
    let[url, setUrl] = useState('');
    function handleRecentsClick(url){
        setUrl(url)
    }

    return(
        <>
        <Header/>

        <div className={styles["heading"]}>
            <h2>
                Недавно <br/> просмотренные
            </h2>
        </div>

        <div className={styles['recents-outer']}>
            {
                url!='' ? (

                    <div id="input_section">
                        <Article url={url}/>
                    </div>
                ) : <Recents onCardClick={handleRecentsClick}/>
            }
        
        </div>
        

        {
            useMediaQuery({ minWidth: 1000 }) ?(
                <Footer/>
        
              ): <MobileFooter/>
        }
        </>
    )
}