import React, {useState, useEffect, useRef} from 'react';
import * as authService from '../../services/auth.service'
import * as UserService from '../../services/user.service';


const AuthContext = React.createContext({
    user: {},
    userInfo: {},
    isLoggedIn: () => {},
    getAuthHeader: () => {},
    onLogin: async (email, password) => {},
    onSignUp: async (fields) => {},
    onLogout: () => {}
});


export const AuthContextProvider = (props) => {
    const isInitialMount = useRef(true);
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    
    
    useEffect(()=> {
        
        if (isInitialMount.current) {
            const userLocalStorage = localStorage.getItem('user');
            if(userLocalStorage){
                setUser(JSON.parse(userLocalStorage));
            }
            isInitialMount.current  = false
        }
        else{
            setUserProfileInfo()
        }

    }, [user]);

    
    const setUserProfileInfo = () => {
        if(isLoggedIn())
            UserService.getUserProfile(getAuthHeader()).then(result => {
                
                if(result.statusCode === 200) {
                    let userInfoResult = result;
                    setUserInfo(userInfoResult);
                } else {
                    logoutHandler()
                }
            }).catch((e)=> {
                console.log(e);
            })
    }
    

    const logoutHandler = () => {
        localStorage.removeItem('user')
        setUser(null)
        setUserInfo(null)
    }

    const authHandler = (result)=> {
        if(result == null || (result != null && result.statusCode === 422)) {
            return {success: false, message: 'Something got wrong'}
        }

        if(result.status === 'SUCCESS') {
            const userInfo = {token:result.token}
            localStorage.setItem('user', JSON.stringify(userInfo))
            setUser(userInfo);
            return {success: true, message:'Successfull'}
        }

        if(result.status === 'ERROR') {
            return {success: false, message:result.message}
        }

        return {success: false, message: 'Something got wrong'}
    }

    const loginHandler = async (email, password) => authHandler(await authService.signIn(email,password))
  

    const signUpHandler = async (fields) => authHandler(await authService.signUp(fields))
  

    const isLoggedIn = () => {
        return user && user.token != null && user.token !== '';
    }

    const getAuthHeader = () => {
        if(isLoggedIn()){
            return {"x-access-token":user.token};
        }
        return null
    }


    return <AuthContext.Provider value={{
        user,
        userInfo,
        onLogin: loginHandler,
        onLogout: logoutHandler,
        onSignUp:signUpHandler,
        isLoggedIn,
        getAuthHeader
    }}>{props.children}</AuthContext.Provider>
}


export default AuthContext;