import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';
import Home from './components/Home/Home';
import Followed from './components/Home/Followed/Followed';
import Discover from './components/Home/Discover/Discover';
import TopLiked from './components/Home/TopLiked/TopLiked';

import Account from './components/Account/Account';
import Login from './components/Account/Login/Login';
import Register from './components/Account/Register/Register';
import UploadPodcast from './components/UploadPodcast/UploadPodcast';
import Podcast from './components/Podcast/Podcast';
import Dashboard from './components/Dashboard/Dashboard';
import GlobalAudioPlayer from './components/UI/GlobalAudioPlayer/GlobalAudioPlayer';
const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route index element={<Followed/>}/>
          </Route>
          <Route  path="home" element={<Home/>}>
            <Route index element={<Discover/>}/>
            <Route path="discover" element={<Discover/>}/>
            <Route path="top" element={<TopLiked/>}/>
            <Route path="followed" element={<Followed/>}/>
          </Route>
          <Route path="account" element={<Account/>}>
            {/* <Route index element={<Login/>}/> */}
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
          </Route>
          <Route path="upload" element={<UploadPodcast/>}>
          </Route>
          <Route path="podcast/:podcastId" element={<Podcast/>}></Route>
          <Route path="dashboard" element={<Dashboard/>}/>
        </Routes>
        <GlobalAudioPlayer/>
      </BrowserRouter>
  );
}

export default App;
