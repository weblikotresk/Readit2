import styles from './recents.module.css'
import React, { useEffect, useState} from 'react'
import getBeautifulDate from'./utils.js'
import { Link } from "react-router-dom";

const showMoreLimit = 4; //has to be the same that is in server.js





export default function Recents(props){
    let [backendData, setBackendData] = useState([{id:"0"}])
    let [showMoreCounter, setShowMoreCounter] = useState(0);

    function recentsClickHandler(e){
        console.log(e.currentTarget.getAttribute('data-url'))
        props.onCardClick(e.currentTarget.getAttribute('data-url'))
    }
    

    function showMoreHandler(){
        setShowMoreCounter(showMoreCounter + showMoreLimit)
    }

    useEffect(()=>{
        fetch(`http://localhost:8081/recents?counter=${showMoreCounter}`)
        .then(res=>res.json())
        .then(data =>{
          setBackendData(data)
          
        } )
        .catch(err=>console.log(err))
      }, [showMoreCounter])

    function btnInnerText(backendLength, showMoreCounterVal){
        if(backendLength >= showMoreCounterVal) return <div className={styles["show-more-btn"]} onClick={showMoreHandler}>Показать больше</div>
        else  return <div className={styles["show-more-btn"]} >Записей больше нет.</div>  
    }
    
    return(
        <>
            <div className={styles['recents-container']}>
                {backendData.map((element, index) => {
                return (
                    <div className={styles["page-container"]} onClick={recentsClickHandler} data-url={element.url} key={index}>
                        <div className={styles[ "page-thumbnail-container"]}>
                            <img src={element.main_image_URL} alt="Thumbnail picture" />
                        </div>
                        <div className={styles["cefr-grade-container"]}>
                            <span>{element.cefr_grade}</span>
                        </div>
                        <div className={styles["page-title"]}>
                            <span>{element.title}</span>
                        </div>
                        <div className={styles["page-date"]}>
                            <span>{getBeautifulDate(new Date(element.timestamp))}</span>
                        </div>
                    </div>
                
                );
            })}

                
                {btnInnerText(backendData.length, showMoreCounter+3)}

            </div>
        </>
    )
}