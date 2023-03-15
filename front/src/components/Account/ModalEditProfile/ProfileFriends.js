import React, {useState, useEffect} from 'react';
import UserCard from './UserCard';


const ProfileFriends = (props) => {
    const [userFriends, setUserFriends] = useState(props.userFriends); 

    useEffect(()=> {
        setUserFriends(props.userFriends)
    }, [props.userFriends])


    
    return (
        <div className='row align-items-start justify-content-center' style={{
            height: "400px",
            overflowY: 'scroll',
            width: "100%"
        }}>
            {userFriends.length === 0 && <p className='text-center h5 fw-bold'>No tienes amigos agregados.</p>}
            {userFriends.map(friend => (
                <UserCard key={friend._id}
                        userId={friend._id}
                        userNames={{name:friend.nameUser, lastname:friend.apPaternoUser, secondLastName:friend.apMaternoUser}}
                        userImage={friend.imageFileUser}
                        onDeleteUser={props.onDeleteUser}/>
            ))}
        </div>
    );
}

export default ProfileFriends;