import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Utils/auth-context";

const Register = ()=> {
    const authContext = useContext(AuthContext);

    const [registerInfo, setRegisterInfo] = useState({
        success:true
    });
    const [userRegister, setUserRegister] = useState({
        email: "",
        password: "",
        name: "",
        lastname: "",
        secondlastname: ""
    })

    const [validations, setValidations] = useState({
        isEmailValid: null,
        isNameValid: null,
        isLastNameValid: null,
        isSecondLastNameValid: null,
        isPasswordValid: null
    })


    let navigate = useNavigate();

    const submitHandler = (e)=>{
        e.preventDefault();

        if(!userRegister.email)
            setValidations(old => {return {...old, isEmailValid:false}})
        else
            setValidations(old => {return {...old, isEmailValid:true}})

        if(!userRegister.name)
            setValidations(old => {return {...old, isNameValid:false}})
        else 
            setValidations(old => {return {...old, isNameValid:true}})


        if(!userRegister.lastname)
            setValidations(old => {return {...old, isLastNameValid:false}})
        else
            setValidations(old => {return {...old, isLastNameValid:true}})
            

        if(!userRegister.secondlastname)
            setValidations(old => {return {...old, isSecondLastNameValid:false}})
        else
            setValidations(old => {return {...old, isSecondLastNameValid:true}})


        if(!userRegister.password)
            setValidations(old => {return {...old, isPasswordValid:false}})
        else
            setValidations(old => {return {...old, isPasswordValid:true}})


        if(userRegister.email && userRegister.name && userRegister.lastname && userRegister.secondlastname && userRegister.password){
            
            authContext.onSignUp(userRegister).then( (result) => {
                if(result.success){
                    navigate('/home');
                    window.location.reload();
                    setRegisterInfo(result)
                } else {
                    setRegisterInfo(result)
                }
            });
        }            
    }


    
    const fieldsHandler = (e) => {
        const {name, value} = e.target;

        setUserRegister(old => {
            return {
                ...old,
                [name]: value
            }
        })

    }

    return (
        <form onSubmit={submitHandler}>
            <h1 className="text-center display-3 mb-4 border-bottom border-1 pb-4">
                Registro
            </h1>
            <div className="mb-3">
                <label htmlFor="emailSignUp" className="form-label">Correo electronico</label>
                <input type="text" className="form-control w-100" id="emailSignUp" name="email" onChange={fieldsHandler}/>
                { validations.isEmailValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mb-3">
                <label htmlFor="personNameSignUp" className="form-label">Nombre</label>
                <input type="text" className="form-control w-100" id="personNameSignUp" name="name" onChange={fieldsHandler}/>
                { validations.isNameValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mb-3">
                <label htmlFor="personLastNameSignUp" className="form-label">Apellido Paterno</label>
                <input type="text" className="form-control w-100" id="personLastNameSignUp" name="lastname" onChange={fieldsHandler}/>
                { validations.isLastNameValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mb-3">
                <label htmlFor="personSecondLastNameSignUp" className="form-label">Apellido Materno</label>
                <input type="text" className="form-control w-100" id="personSecondLastNameSignUp" name="secondlastname" onChange={fieldsHandler}/>
                { validations.isSecondLastNameValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="password" name="password" onChange={fieldsHandler}/>
                { validations.isPasswordValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            {!registerInfo.success && <div className="text-danger w-100 mb-3 text-center"><i className="fa-solid fa-circle-exclamation"></i> {registerInfo.message}</div>}
            <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary w-50 text-white">
                    Registrarse
                </button>
            </div>
        </form>
    );
}

export default Register;