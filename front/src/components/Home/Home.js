import React, {useContext} from 'react';
import {Outlet} from 'react-router-dom';
import Header from '../UI/Header/Header';
import LandingHeader from '../UI/LandingHeader/LandingHeader';
import GlobalAudioPlayer from '../UI/GlobalAudioPlayer/GlobalAudioPlayer';
import SearchContext from '../Utils/search-context';

const Home = () => {
    const searchContext = useContext(SearchContext);

    return (
        <div style={{paddingBottom: "100px"}}>
            <Header/>
            <LandingHeader/>
            {searchContext.searchText !== '' &&<div className='w-100 d-flex justify-content-center'><h1 className='text-primary text-center w-75 text-truncate'>Mostrando resultados de busqueda de "{searchContext.searchText}"...</h1></div> }
            <Outlet/>
            {/* <GlobalAudioPlayer/> */}
         
            {/* <Header/>
            <LandingHeader/> */}
        </div>
    );
}

export default Home;