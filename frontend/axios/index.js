import axios from "axios";

// ✨ implement axiosWithAuth
export default function axiosWithAuth(){
    return axios.create({
        headers:{
            Authorization:window.localStorage.getItem('token')
        }
    })
}