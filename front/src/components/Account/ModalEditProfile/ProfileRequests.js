import React, {useState, useEffect} from 'react';
import UserCard from './UserCard';

const ProfileRequests = (props) => {
    const [userRequests, setUserRequests] = useState(props.userFriendRequests)

    useEffect(()=> {
        setUserRequests(props.userFriendRequests);
    }, [props.userFriendRequests])

    return (
        <div className='row align-items-start justify-content-center' style={{
            height: "400px",
            overflowY: 'scroll',
            width: "100%"
        }}>
            {userRequests.length === 0 && <p className='text-center h5 fw-bold'>No tienes solicitudes pendientes.</p>}
            {userRequests.map(request => (
                <UserCard request={true}
                            key={request._id}
                            userId={request._id}
                            userNames={{name:request.nameUser, lastname:request.apPaternoUser, secondLastName:request.apMaternoUser}}
                            userImage={request.imageFileUser}
                            onConfirmUser={props.onConfirmUser}
                            onDeleteUser={props.onDeleteUser}/>
            ))}
           
        </div>
    );
}

export default ProfileRequests;