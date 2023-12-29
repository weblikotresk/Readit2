import React, { useEffect, useState, useContext} from 'react'

import './Vocabulary.css'
import getBeautifulDate from'./utils.js'


function Vocabulary(props){
    let [vocabData, setVocabData] = useState([{word:"Пока нет добавленных слов."}]) 
    useEffect(()=>{
        fetch(`http://localhost:8081/vocab`)
        .then(res=>res.json())
        .then(data =>{
            //check if data is array or not (then it's an error)
            data[0] ?  setVocabData(data) :  setVocabData([data]);
           
            if(data.code){
                console.error("MYSQL error:", data)
            }
        } )
        .catch(err=>console.log(err))
        }, [props])

        let old_iteration=new Date(vocabData[0].timestamp)
    return(
        <div className={props.className}>
        {
            vocabData.map((element, index) => {
                let curr_iteration = new Date(element.timestamp);
                let horizontal_flag = true;

                if(old_iteration.getDate() > curr_iteration.getDate()  && old_iteration > curr_iteration){
                    horizontal_flag = true
                }else if(old_iteration > curr_iteration && old_iteration.getDate() != curr_iteration.getDate()){
                    horizontal_flag = true
                }else{
                    horizontal_flag = false
                }
                old_iteration = curr_iteration
               return (<>

                {horizontal_flag ? 
                <div className='date-vocab-container' >
                    {getBeautifulDate(old_iteration)}
                    
                </div>
                :null}
               <div className='vocab-item' key={index}>
                   <div className='word'>{element.word} <sup>[{element.lang}]</sup></div>
                   <div className='translation'>{element.translation}</div>
               </div>
                </>);
           })
        }
        </div>
    )
}

export default Vocabulary