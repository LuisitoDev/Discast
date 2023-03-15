import React, {useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import AuthContext from "../../Utils/auth-context";



const LandingHeader = () => {
    const {pathname} = useLocation();

    const authContext = useContext(AuthContext);
    
    return (
        <React.Fragment>
        <ul className="nav nav-pills nav-fill fs-5 my-4">
            <li className="nav-item">
                <Link to="/home/discover" className='text-white text-decoration-none'>
                    <button className={`nav-link ${('/home/discover' === pathname || '/home' === pathname || '/' === pathname) && 'active'}`} id="discoverTab" type="button">
                        Discover
                    </button>
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/home/top" className='text-white text-decoration-none'>
                    <button className={`nav-link ${'/home/top' === pathname && 'active'}`} id="likesTab" type="button">
                        Top liked
                    </button>
                </Link>
            </li>
            {authContext.isLoggedIn() && <li className="nav-item">
                <Link to="/home/followed" className='text-white text-decoration-none'>
                    <button className={`nav-link ${'/home/followed' === pathname  && 'active'}`} id="followedTab" type="button">
                        Followed
                    </button>
                </Link>
            </li>}
        </ul>
        <hr className='mx-2 text-primary' size='3'/>
        </React.Fragment>
    );
}

export default LandingHeader;