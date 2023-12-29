import './general_styles.css'
import {Link} from 'react-router-dom'

export default function Footer(){
    return(
        <>
        <footer id='readitFooter'>

          <div className="footer-inner">
            <div className="footer-container">
            <div className="logo_container">
                    <h1>
                        Read It
                    </h1>
                </div>
            </div>
            <div className="footer-container">
              <nav className="footer-nav">

              <Link to='/'>
                <span>Главная</span>
              </Link>

              <Link to='/vocabulary'>
                <span>Словарь</span>
              </Link>
                
              <Link to='/recents'>
                <span>Недавно просмотренные</span>
              </Link>
                
                {/* <span>О разработчике</span> */}
              </nav>
            </div>
          </div>
      
        </footer>
        </>
    )
}