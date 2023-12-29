import {Link} from 'react-router-dom'
import './general_styles.css'
export default function Header(){
    return(
        <>
            <header id='readitHeader'>
                <div className="logo_container">
                    <h1>
                        <Link to='/'> Read It</Link>
                        
                    </h1>
                </div>
        </header>
        </>
    )
}