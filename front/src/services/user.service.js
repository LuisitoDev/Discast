const API_URL = 'https://programacion-web-2.herokuapp.com/api/user';


export const getUserProfile = async (headers) => {

    headers["Content-Type"] = "application/json"

    let data = null
    try {

        const response = await fetch(API_URL + '/search/profile', {
            method: 'GET',
            headers
        })

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}

export const getFavoriteUser  = async (headers) => {

    headers["Content-Type"] = "application/json"

    let data = null
    try {

        const response = await fetch(API_URL + '/search/favorite_user', {
            method: 'GET',
            headers
        })

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}

export const getUserStats = async (headers) => {
    headers["Content-Type"] = "application/json"

    let data = null
    try {

        const response = await fetch(API_URL + '/search/stats', {
            method: 'GET',
            headers
        })

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}


export const toggleFriend = async(headers, friendId) => {
    headers["Content-Type"] = "application/json"
    
    let data = null
    try {
        

        let body = JSON.stringify({
            "friendsUser": friendId
        });

        const response = await fetch(API_URL + '/add_friend', {
            method: 'PUT',
            headers,
            body
        })
        

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data

}

export const sendFriendRequest = async (headers, friendId) => {
    headers["Content-Type"] = "application/json"
    
    let data = null
    try {
        

        let body = JSON.stringify({
            "friendRequestsUser": friendId
        });

        const response = await fetch(API_URL + '/send_friend_requests', {
            method: 'PUT',
            headers,
            body
        })
        

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}

export const declineFriendRequest = async (headers, friendId) => {
    headers["Content-Type"] = "application/json"
    let data = null
    try {
        

        let body = JSON.stringify({
            "friendsUser": friendId
        });

        const response = await fetch(API_URL + '/decline_friend_request', {
            method: 'PUT',
            headers,
            body
        })
        

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data


}

export const updateImage = async(headers, file) => {
    
    let data = null
    try {
        let formData = new FormData()

        formData.append('imageFileUser', file)

        const response = await fetch(API_URL + '/update_image', {
            method: 'PUT',
            headers,
            body: formData
        })

        data = await response.json()
        data.statusCode = response.status
    }catch(error) {
        console.log('error', error)
    }

    return data
}


export const followUser = async (headers, userFollowed) => {
    headers["Content-Type"] = "application/json"
    
    let data = null
    try {
        

        let body = JSON.stringify({
            "followingUser": userFollowed
        });

        const response = await fetch(API_URL + '/followers', {
            method: 'PUT',
            headers,
            body
        })
        

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}


export const updateProfile = async(headers, userInfo) => {
    
    headers["Content-Type"] = "application/json"
    
    let data = null
    try {
        

        let body = JSON.stringify({
            "nameUser": userInfo.name,
            "apPaternoUser": userInfo.lastname,
            "apMaternoUser": userInfo.secondlastname
        });

        const response = await fetch(API_URL + '/', {
            method: 'PUT',
            headers,
            body
        })
        

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}
