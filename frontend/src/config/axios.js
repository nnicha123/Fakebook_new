import axios from 'axios';
import LocalStorageService from '../services/localStorageService'

axios.interceptors.request.use(
    config => {
        // if(config.url.includes("/login") || config.url.includes("/register")) return config;
        const token = LocalStorageService.getToken()
        if(token){
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    err => {
        Promise.reject(err)
    }
)

export default axios;