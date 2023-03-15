const API_URL = 'https://programacion-web-2.herokuapp.com/api/clip_request';

export const getClipRequestById = async (clipRequestId) => {
    let data = null
    try {

        const response = await fetch(API_URL + `/${clipRequestId}`, {
            method: 'GET',
        })

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}

export const getClipRequestByPodcast = async (podcastId, page) => {
    let data = null
    try {

        const response = await fetch(API_URL + `/podcast/${podcastId}/page/${page}`, {
            method: 'GET',
        })

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    return data
}

export const voteClipRequest = async (headers, clipRequestId, voteToClip) => {
    headers["Content-Type"] = "application/json"
    let data = null
    try {
        
        let body = JSON.stringify({
            "voteUser": voteToClip
        });

        const response = await fetch(API_URL + '/votes_clip_request/' + clipRequestId, {
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


export const deleteClipRequestByClipOwner = async (headers, clipRequestId) => {

    let data = null
    try {
        
        const response = await fetch(API_URL + `/${clipRequestId}`, {
            method: 'DELETE',
            headers
        })

        if(response.status === 204) {
            data = {
                status: "SUCCESS",
                statusCode: response.status
            }
        } else {
            data = await response.json()
            data.statusCode = response.status
        }

    } catch (error) {
        console.log('error', error);
    }
    
    return data;
}   

export const deleteClipRequestByPodcastOwner = async (headers, clipRequestId, podcastId) => {

    let data = null
    try {
        
        const response = await fetch(API_URL + `/podcast/${podcastId}/clip_request/${clipRequestId}`, {
            method: 'DELETE',
            headers
        })

        if(response.status === 204) {
            data = {
                status: "SUCCESS",
                statusCode: response.status
            }
        } else {
            data = await response.json()
            data.statusCode = response.status
        }

    } catch (error) {
        console.log('error', error);
    }

    return data;
}   