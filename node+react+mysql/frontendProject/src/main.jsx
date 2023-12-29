import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import App from './App.jsx'
import RecentsPage from './RecentsPage.jsx'
import VocabularyPage from './VocabularyPage.jsx'
import NoPage from './NoPage.jsx'

import './general_styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes> 
        {/* <Route path="/" element={<Layout />}> */}
        <Route index path="/:url?" element={<App />} />
        <Route path="recents" element={<RecentsPage />} />
        <Route path="vocabulary" element={<VocabularyPage/>} />
        <Route path="*" element={<NoPage />} /> 
        {/* </Route> */}
      </Routes>
    </BrowserRouter> 

  </React.StrictMode>,
)
