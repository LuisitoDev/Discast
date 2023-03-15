const API_URL = 'https://programacion-web-2.herokuapp.com/api/clip_response';

export const getClipResponsesByPodcast = async (podcastId, page) => {
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

export const voteClipResponse = async (headers, clipResponseId) => {
    headers["Content-Type"] = "application/json"
    let data = null
    try {
        

        const response = await fetch(API_URL + '/likes_clip_response/' + clipResponseId, {
            method: 'PUT',
            headers
        })
        
        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }
    return data
}