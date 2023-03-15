import React from 'react';
import { AnimatePresence, motion } from "framer-motion";

const UserCard = (props) => {
    

    return (
        <AnimatePresence>
            <motion.div 
            initial={{
                x: -100,
                opacity: 0,
              }}
              animate={{
                x: 0,
                transition: {
                  duration: 0.3,
                },
                opacity: 1,
              }}
              exit={{
                x: 100,
                opacity: 0,
                transition: {duration: 0.9}
              }}
            className='row mb-2'>
                <div className="col-3 text-center">
                    <img
                    src={`https://programacion-web-2.herokuapp.com/api/file/${props.userImage}`}
                    className="img-thumbnail img-fluid"
                    alt=""
                    style={{
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px"
                    }}/>
                </div>
                <div className="col-7 d-flex align-items-center">
                    <span className='h4' >{`${props.userNames.name} ${props.userNames.lastname} ${props.userNames.secondLastName}`}</span>
                </div>
                <div className="col-2 d-flex align-items-center">
                    <div className='d-flex w-100 justify-content-center'>
                        {props.request && <span className='h5' onClick={()=>{props.onConfirmUser({userId :props.userId, userImage: props.userImage,userNames: props.userNames})}}><i className="fa-solid fa-circle-check me-1"></i></span>}
                        <span className='h5' onClick={() => {props.onDeleteUser(props.userId)}}><i className="fa-solid fa-circle-xmark"></i></span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default UserCard;