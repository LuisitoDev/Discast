import React, { useState, useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as UserService from '../../../services/user.service'
import AuthContext from "../../Utils/auth-context";

import ProfileInfo from "./ProfileInfo";
import ProfileFriends from "./ProfileFriends";

import "./ModalEditProfile.css";
import ProfileRequests from "./ProfileRequests";
import AvatarPlaceholder from "../../../images/avatar_placeholder_user.png";

const ModalEditProfile = (props) => {
  const authContext = useContext(AuthContext);

  const [srcImage, setSrcImage] = useState(
    AvatarPlaceholder
  );

  const [isUserImage, setIsUserImage] = useState(false);

  const [tabSelected, setTabSelected] = useState("info");

  let navigate = useNavigate();

  const logoutHandler = () => {
    authContext.onLogout();
    navigate("/home");
    window.location.reload();
  };

  const changeImageHandler = (e) => {
    // TODO: Validate file extension then upload
    const [file] = e.target.files;
    UserService.updateImage(authContext.getAuthHeader(), file).then(result => {
      
      const src = URL.createObjectURL(file);
      setIsUserImage(true);
      setSrcImage(src);
    })
  };

  const infoTabHandler = () => {
    setTabSelected("info");
  };

  const friendsTabHandler = () => {
    setTabSelected("friends");
  };

  const requestsTabHandler = () => {
    setTabSelected("requests");
  };


  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const deleteFriendHandler = (userId) => {
    
    UserService.toggleFriend(authContext.getAuthHeader(),userId).then(result => {
        console.log(result)
        if(result.status === 'SUCCESS') {
            setUser(oldUser => {
                oldUser.friendsUser = oldUser.friendsUser.filter(x => x._id !== userId)
                return {
                  ...oldUser
                }
            })
            console.log(user);
           
        }
    })
  }

  const deleteFriendRequestHandler = (userId) => {
    
    UserService.declineFriendRequest(authContext.getAuthHeader(), userId).then(result => {
      if(result.status === 'SUCCESS') {
          setUser(oldUser => {
            oldUser.friendRequestsUser = oldUser.friendRequestsUser.filter(x => x._id !== userId)
            return {
              ...oldUser
            }
          })
      }
    })

  }

  const addFriendHandler = (user) => {
       
    UserService.toggleFriend(authContext.getAuthHeader(),user.userId).then(result => {
      if(result.status === 'SUCCESS') {
       
          setUser(oldUser => {
              oldUser.friendRequestsUser = oldUser.friendRequestsUser.filter(x => x._id !== user.userId)
              if(!oldUser.friendsUser.find(friend => friend._id === user.userId)){
                oldUser.friendsUser = [
                  ...oldUser.friendsUser,
                  {
                    _id:user.userId,
                    nameUser: user.userNames.name,
                    apPaternoUser: user.userNames.lastname,
                    apMaternoUser: user.userNames.secondLastName,
                    imageFileUser: user.userImage
                  }
                ]
              }


              return {
                ...oldUser
              }
          })
        
         
      }
  })
  }

  
  useEffect(()=>{
    
    if(authContext.isLoggedIn()){
      UserService.getUserProfile(authContext.getAuthHeader()).then(result => {
        if(result.imageFileUser) {
          setIsUserImage(true);
          setSrcImage(`https://programacion-web-2.herokuapp.com/api/file/${result.imageFileUser}`)
        }
        
        setUser(result)
        setIsLoading(false);
        console.log(result);
      }).catch(()=> {
        setIsLoading(false)
      })
    }
    
  },[authContext])


  return (
    <React.Fragment>
      <div className="mb-4">
      {isLoading && 
        <div className="text-center">
          <div className="spinner-border text-primary fs-2" style={{ width: "120px", height: "120px" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}
        {!isLoading && 
        <>

          <div className="userImageContainer">
            <img src={srcImage} className={`${isUserImage ?  "userImage" : "userPlaceholder"}`} alt="" />
            <label
              htmlFor="formFile"
              className="paragraphContainer d-none d-lg-flex justify-content-center align-items-center"
            >
              <p className="uploadPhoto fs-4 text-white text-center p-2 m-0">
                Subir Foto
              </p>
            </label>
            <div className="overlay d-none d-lg-block">
              <input
                className="form-control d-none"
                type="file"
                id="formFile"
                accept="image/*"
                onChange={changeImageHandler}
              />
            </div>
          </div>
          <div className="fileButton d-lg-none mt-4 row justify-content-center">
            <label
              htmlFor="formFile"
              className="form-label btn btn-primary text-center text-white col-5 col-md-3 p-2"
            >
              Subir Foto
            </label>
          </div>
        </>
        }
      </div>
      <div className="text-center mb-2">
        <button className="btn btn-primary text-white" onClick={logoutHandler}>
          Cerrar Sesion
        </button>
      </div>
      <hr />
      <ul className="nav nav-pills mb-3 nav-fill">
        <li className="nav-item">
          <span
            className={`nav-link ${tabSelected === "info" && "active"}`}
            onClick={infoTabHandler}
            style={{ cursor: "pointer" }}
          >
            Info. perfil
          </span>
        </li>
        <li className="nav-item">
          <span
            className={`nav-link ${tabSelected === "friends" && "active"}`}
            onClick={friendsTabHandler}
            style={{ cursor: "pointer" }}
          >
            Amigos
          </span>
        </li>
        <li className="nav-item">
          <span
            className={`nav-link ${tabSelected === "requests" && "active"}`}
            onClick={requestsTabHandler}
            style={{ cursor: "pointer" }}
          >
            Solicitudes
          </span>
        </li>
      </ul>
      <hr />
      {isLoading && 
        <div className="text-center">
          <div className="spinner-border text-primary">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}
                    
      {(tabSelected === "info" && !isLoading)  && <ProfileInfo userInfo={user}/>}
      {(tabSelected === "friends" && !isLoading) && <ProfileFriends userFriends={user.friendsUser} onDeleteUser={deleteFriendHandler}/>}
      {(tabSelected === "requests" && !isLoading) && <ProfileRequests userFriendRequests={user.friendRequestsUser} onConfirmUser={addFriendHandler} onDeleteUser={deleteFriendRequestHandler}/>}
    </React.Fragment>
  );
};

export default ModalEditProfile;
