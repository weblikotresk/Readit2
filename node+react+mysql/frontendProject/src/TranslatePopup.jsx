import React, { useEffect, useState} from 'react'
import './TranslatePopup.css'

const vocabWordTranslationLengthLimit = 30;


function showContextMenu(x, y) {
  const contextMenu = document.getElementById('custom-context-menu');
  contextMenu.style.display = 'block';
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
}

// Function to hide the context menu
function hideContextMenu() {
  const contextMenu = document.getElementById('custom-context-menu');
  contextMenu.style.display = 'none';
}


function TranslatePopup(props){
  let [translatedText, setTranslatedText] = useState('')
  let [detectedLang, setDetectedLang] = useState('')
  let [selectedText, setSelectedText] = useState('')

  useEffect(()=>{
    fetch(`http://localhost:8081/translate?text=${selectedText}`)
        .then(res=>res.json())
        .then(data => {setTranslatedText(data.text); setDetectedLang(data.detectedLanguageCode)})
        .catch(err=>console.log(err));
  }, [selectedText])
  
  const add_word = () => {

    if(translatedText.length < vocabWordTranslationLengthLimit){
      fetch('http://localhost:8081/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          word: props.text,
          translate: translatedText,
          lang: detectedLang
        })
        
      })
      .then(res => res.json())
      .then(data =>{
        console.log(data)
        if(data={})alert('Это слово уже есть в словаре.')
        
      } )
      .catch(err =>{
        console.log(err)

      }) ;
    }else{
      alert('Превышен лимит на количество символов в переводе. Попробуйте выбрать более короткую фразу.')
    }
     
   
  
    hideContextMenu();
    let update_outer_state= props.states[1];
    update_outer_state(props.states[0]+1)
    update_outer_state(props.states[0]+1)
  }


document.getElementById('input_section').addEventListener('contextmenu', function (e) {

  let selection = window.getSelection().toString().trim().toLowerCase();
  if(selection.length < 250){
    setSelectedText(selection)
  }else{
    alert("Выберите более короткую фразу.")
  }
  
  console.log(selection, selectedText)
  if (selectedText !== '') {
      e.preventDefault(); 
      showContextMenu(e.pageX - window.innerWidth * 0.24, e.pageY -64);
  } else {
      hideContextMenu();
  }
});

document.addEventListener('click', function () {
  hideContextMenu();
});

      return(

        <div id="custom-context-menu" className="context-menu">
          <div className="translation">{translatedText}</div>
          <div className="context-menu-item" onClick={add_word}>
            
          <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" fill="none">
          <path id="icon_border" opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#1C274C" stroke-width="1.5"/>
          <path id="icon_add_sign" d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
            Добавить в словарь
          </div>
    </div>
      )
}

export default TranslatePopup;
