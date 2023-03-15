
const API_URL = 'https://programacion-web-2.herokuapp.com/api/auth';

export const signIn = async (email, password) => {

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    
    let data = null
    try {

        let body = JSON.stringify({
            "emailUserAuth": email,
            "passwordUserAuth": password
        });

        const response = await fetch(API_URL + '/signin', {
            method: 'POST',
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

export const signUp = async (fields) => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    
    
    let data = null
    try {
        
        let body = JSON.stringify({
            "emailUserAuth": fields.email,
            "passwordUserAuth": fields.password,
            "nameUser": fields.name,
            "apPaternoUser": fields.lastname,
            "apMaternoUser": fields.secondlastname,
        });

        const response = await fetch(API_URL + '/signup', {
            method: 'POST',
            headers,
            body,   
        })

        data = await response.json()
        data.statusCode = response.status
    } catch(error) {
        console.log('error', error)
    }

    console.log(data);

    return data
}