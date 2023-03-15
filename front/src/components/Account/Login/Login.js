import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Utils/auth-context";

const Login = () => {
    const authContext = useContext(AuthContext);
    const [loginInfo, setLoginInfo] = useState({
        success:true
    });
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    })

    const [validations, setValidations] = useState({
        isEmailValid: null,
        isPasswordValid: null
    })

    let navigate = useNavigate();

    const submitHandler = (e)=>{
        e.preventDefault();
        
        if(!userLogin.email){
            setValidations(old => {return {...old, isEmailValid : false}})
        }

        if(!userLogin.password){
            setValidations(old => {return {...old, isPasswordValid: false}})
        }


        if(userLogin.email && userLogin.password){
            setValidations(old => {return {...old, isPasswordValid: true, isEmailValid:true}})

            authContext.onLogin(userLogin.email, userLogin.password).then( (result) => {
                if(result && result.success){
                    navigate('/home');
                    window.location.reload();
                    setLoginInfo(result)
                } else {
                    setLoginInfo(result)
                }
            });
        }
        
    }

    const fieldsHandler = (e) => {
        const {name, value} = e.target;

        setUserLogin(old => {
            return {
                ...old,
                [name]: value
            }
        })

    }

    return (
        <form onSubmit={submitHandler}>
            <h1 className="text-center display-3 mb-4 border-bottom border-1 pb-4">
                Log in
            </h1>
            <div className="mb-3">
                <label htmlFor="emailInputSignUp" className="form-label">Correo electrónico</label>
                <input type="email" className="form-control w-100" id="emailInputSignUp" name="email" value={userLogin.email} onChange={fieldsHandler}/>
                { validations.isEmailValid === false &&
                    <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="password" name="password" value={userLogin.password} onChange={fieldsHandler}/>
                { validations.isPasswordValid === false &&
                    <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            {!loginInfo.success && <div className="text-danger w-100 mb-3 text-center"><i className="fa-solid fa-circle-exclamation"></i> {loginInfo.message}</div>}
            
            <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary w-50 text-white">
                    Ingresar
                </button>
            </div>
        </form>
    );

}

export default Login;