import axios from "./axios";

const createUserAPI = (username, email, password) => {
    const URL_API = "/api/register";
    const data = {
        username, email, password
    }
    return axios.post(URL_API, data)
}


const handleLogin = (email, password) => {
    const URL_API = "/api/login";
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}

const savePriceGuess = (data) => {
    const URL_API = "/api/guess_bitcoin";
    return axios.post(URL_API, data)
}


const checkPreviousWinner = (userId) => {
    const URL_API = "/api/checkpreviouswinner";
    return axios.post(URL_API, userId);
}

export {
    createUserAPI,
    handleLogin,
    savePriceGuess, checkPreviousWinner
}