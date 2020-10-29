import { API_URL } from "@env"
export const userService = {
    register,
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    }

    return fetch(`${API_URL}/api/user`, requestOptions).then(handleResponse)
}

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }
}


function handleResponse(response) {
    return response.text()
            .then((data) => {
                data && JSON.parse(data);
                if (!response.ok){
                    if(response.status === 401){
                        console.log(response.status)
                    }

                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error)
                }

                return data
            });
}