/*  Documentacion
https://react-popup.elazizi.com/ plugin que se uso para el pop up
*/

import React, {useEffect, useState, useRef, useContext, Fragment} from 'react';
import Popup from 'reactjs-popup';
import AuthContext from "../../Utils/auth-context";
import * as UserService from '../../../services/user.service'
import {addElementToStateArray, removeElementFromStateArray} from '../../Utils/manipulate-state-arrays'
import AvatarPlaceholder from "../../../images/avatar_placeholder_user.png";

import 'reactjs-popup/dist/index.css';
import './Popup.css';

const ProfilePopup = (props) => {
    const authContext = useContext(AuthContext);
    const isInitialMount = useRef(true);

    const [userLoggedIn, setUserLoggedIn] = useState(false)

    const [followingUser, setFollowingUser] = useState([])
    const [followersUser, setFollowersUser] = useState([])
    const [userFollowed, setUserFollowed] = useState(false)

    
    const [friendsUser, setFriendsUser] = useState([])
    const [userHasSendFriendReq, setHasUserFriendReq] = useState(null)
    
    const loggedUserId = useRef(null)

    const [isLoading, setIsLoading] = useState(true)
    
    
    let {user} = props
    
    if(!user)
        user = {imageFileUser: '', followingUser:[], followersUser:[], friendsUser:[], friendRequestsUser:[], nameUser: 'Felix', apPaternoUser: 'Lara'} //TODO: DEPERECATDE


    useEffect(()=> {
        if (isInitialMount.current) {

            if(user != undefined){
                setFollowingUser(user.followingUser)
                setFollowersUser(user.followersUser)
                setFriendsUser(user.friendsUser);
                
        
                isInitialMount.current = false;
                setIsLoading(false);
            }
        }       

        const isLoggedIn = authContext.isLoggedIn();
        const userInfo = authContext.userInfo;

        if (isLoggedIn !== null && userInfo !== null){

            loggedUserId.current = authContext.userInfo._id;
            setUserLoggedIn(isLoggedIn);
            
            
            if (loggedUserId.current != undefined){
                if (followersUser.includes(loggedUserId.current)){
                    setUserFollowed(true)
                }
                else{
                    setUserFollowed(false)
                }

                if (friendsUser.includes(loggedUserId.current)){
                    setHasUserFriendReq(null);
                }
                else{
                    if (user.friendRequestsUser.includes(loggedUserId.current)){
                        setHasUserFriendReq(true);
                    }
                    else{
                        setHasUserFriendReq(false);
                    }
                }
            }            
        }
         
        return () => console.log('se quito el timeline')
    }, [authContext, followersUser, isLoading, friendsUser])

    const followHandler = () => {

        if (!loggedUserId.current || loggedUserId.current === user._id)
            return;

        const followersUserBefore = followersUser
    
        if (userFollowed === false){
            addElementToStateArray(followersUser, setFollowersUser, loggedUserId.current);
        }
        else if (userFollowed === true){
            removeElementFromStateArray(followersUser, setFollowersUser, loggedUserId.current);
        }

        UserService.followUser(authContext.getAuthHeader(), user._id).then(result => {
            if(!result || result.status !== 'SUCCESS') {
                setFollowersUser(followersUserBefore);     
            }
          })
        
    }
    
    const friendRequestHandler = () => {
        if (!loggedUserId.current || loggedUserId.current === user._id || userHasSendFriendReq === null)
            return;

        const friendRequestBefore = followersUser
    
        let sendUserFriendRequest = null;

        if (userHasSendFriendReq === false){
            sendUserFriendRequest = true;
        }
        else if (userHasSendFriendReq === true){
            sendUserFriendRequest = false;
        }

        setHasUserFriendReq(sendUserFriendRequest)

        UserService.sendFriendRequest(authContext.getAuthHeader(), user._id).then(result => {
            
            if(!result || result.status !== 'SUCCESS') {
                setHasUserFriendReq(friendRequestBefore);     
            }
            else if (result?.status === 'SUCCESS' && result?.friend_added === true){
                setHasUserFriendReq(null);
                addElementToStateArray(friendsUser, setFriendsUser, loggedUserId.current);
            }
            else if (result?.status === 'SUCCESS'){
                if (result.message === 'The friend request was sended correctly' && sendUserFriendRequest === false)
                    setHasUserFriendReq(true)
                else if (result.message === 'The friend request was canceled correctly' && sendUserFriendRequest === true)
                    setHasUserFriendReq(false)
            }
          })
    }

    return(
        <Popup
            trigger={props.children}
            position={['top center', 'bottom center']}
            on={['hover', 'focus']}
            > 
            {!isLoading &&
                <Fragment>
                    <div className='d-flex justify-content-between'>
                        <div className='userImageContainer d-flex flex-column'>
                            <img src={user.imageFileUser ? (`https://programacion-web-2.herokuapp.com/api/file/${user.imageFileUser}`) : AvatarPlaceholder} alt="userImage"
                            className={`${user.imageFileUser ? "profileImagePopup" : "profileImagePlaceholderPopup"} img-fluid img-thumbnail`} />
                        </div>
                        {userLoggedIn && loggedUserId.current !== user._id &&
                            <div className='my-2 me-2'>
                                <button className='btn btn-primary text-white' onClick={followHandler}>{userFollowed === false ? `Seguir` : `Siguiendo`}</button>
                            </div>
                        }
                    </div>
                    <div className='mt-2 text-white d-flex justify-content-between'>
                        <p className='fs-4'>{`${user.nameUser} ${user.apPaternoUser}`}</p>
                        {userLoggedIn && loggedUserId.current !== user._id && userHasSendFriendReq !== null &&
                            <button className='btn btn-primary text-white addFriendButton' onClick={friendRequestHandler}>
                                <i className={`${userHasSendFriendReq === false ? `fas fa-user-plus` : `fas fa-user-minus`}`}></i> 
                            </button>
                        }
                        {userLoggedIn && loggedUserId.current !== user._id && userHasSendFriendReq === null &&
                             <span className='fw-normal'>¡Son amigos!</span>
                        }
                    </div>
                    <div className='followContainer d-flex text-white fw-bold justify-content-between'>
                        <span>{followingUser.length} <span className='fw-normal'>siguiendo</span></span>
                        <span>{followersUser.length} <span className='fw-normal'>seguidores</span></span>
                    </div>
                </Fragment>
            }
        </Popup>
    )
    
}

export default ProfilePopup;