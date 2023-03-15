import React, {useState, useContext} from 'react';
import AuthContext from "../../Utils/auth-context";
import * as UserService from '../../../services/user.service'
import { AnimatePresence, motion } from 'framer-motion';

const ProfileInfo = (props) =>{
    const authContext = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
        email : props.userInfo.emailUser.emailUserAuth,
        name :  props.userInfo.nameUser ,
        lastname :props.userInfo.apPaternoUser,
        secondlastname : props.userInfo.apMaternoUser
    })

    const [validations, setValidations] = useState({
        isNameValid: null,
        isLastNameValid: null,
        isSecondLastNameValid: null,
    })

    const [isSucceed, setIsSucceed] = useState(null)

    const submitHandler = (e)=>{
        e.preventDefault();
        if(!profileData.name)
            setValidations(old => {return {...old, isNameValid:false}})
        else 
            setValidations(old => {return {...old, isNameValid:true}})


        if(!profileData.lastname)
            setValidations(old => {return {...old, isLastNameValid:false}})
        else
            setValidations(old => {return {...old, isLastNameValid:true}})
            

        if(!profileData.secondlastname)
            setValidations(old => {return {...old, isSecondLastNameValid:false}})
        else
            setValidations(old => {return {...old, isSecondLastNameValid:true}})

        if(profileData.name && profileData.lastname && profileData.secondlastname){
            
            UserService.updateProfile(authContext.getAuthHeader(), profileData).then( (result) => {
                
                if(result?.status !== "SUCCESS"){
                  //TODO: SI HUBO UN ERROR IMPRIMIR UN MENSAJE EN PANTALLA
                  setIsSucceed(false)
                  setTimeout(() => {
                      setIsSucceed(null);
                  }, 5000);
                } else {
                  setIsSucceed(true)
                  setTimeout(() => {
                    setIsSucceed(null);
                }, 5000);
                }
            });
        }
        
    }

    const fieldsHandler = (e) => {
        const {name, value} = e.target;

        setProfileData(old => {
            return {
                ...old,
                [name]: value
            }
        })

    }


    return (
        <React.Fragment>
            <AnimatePresence>
            { isSucceed === true && (
                <motion.div 
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        transition: {
                            duration: .5,
                        },
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: .5,
                        },
                    }}
                    className="text-success mb-3 w-100 text-center text-primary fw-bold"
                >
                    <i className="fa-solid fa-circle-exclamation"></i> ¡Informacion actualizada correctamente!
                </motion.div>
            )}
            { isSucceed === false && (
                <motion.div  
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: .5,
                    },
                }}
                exit={{
                    opacity: 0,
                    transition: {
                        duration: .5,
                    },
                }}
                className="text-danger mb-3 w-100 text-center"
                >
                    <i className="fa-solid fa-circle-exclamation"></i> ¡Ha ocurrido un error al actualizar la informacion!
                </motion.div>
            )}
                </AnimatePresence>  
            <div className="mb-3 px-md-4">
                <label htmlFor="emailInputProfile" className="form-label">Correo Electronico</label>
                <input type="text" name="email" className="form-control w-100" id="emailInputProfile" value={profileData.email}  readOnly/>
            </div>
            <div className="mb-3 px-md-4">
                <label htmlFor="namesInputProfile" className="form-label">Nombres</label>
                <input type="text" name="name" className="form-control w-100" id="namesInputProfile" value={profileData.name} onChange={fieldsHandler}/>
                { validations.isNameValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mb-3 px-md-4">
                <label htmlFor="firstLastNameInputProfile" className="form-label">Apellido Paterno</label>
                <input type="text" name="lastname" className="form-control w-100" id="firstLastNameInputProfile" value={profileData.lastname} onChange={fieldsHandler}/>
                { validations.isLastNameValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mb-3 px-md-4">
                <label htmlFor="secondLastNameInputProfile" className="form-label">Apellido Materno</label>
                <input type="text" name="secondlastname" className="form-control w-100" id="secondLastNameInputProfile" value={profileData.secondlastname} onChange={fieldsHandler}/>
                { validations.isSecondLastNameValid === false &&
                    <div className="text-danger w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡No dejes el campo vacio!</div>
                }
            </div>
            <div className="mt-4 text-center">
                <button onClick={submitHandler} type="button" className="btn btn-primary text-white px-5 py-2">Guardar</button>
            </div>
        </React.Fragment>
    );
}

export default ProfileInfo;