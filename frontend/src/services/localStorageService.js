function setToken(token){
    localStorage.setItem("ACCESS_TOKEN",token)
}
function setUsername(username){
    localStorage.setItem("USERNAME",username)
}

function getToken(){
    return localStorage.getItem("ACCESS_TOKEN")
}
function getUsername(){
    return localStorage.getItem("USERNAME")
}
function removeToken(){
    localStorage.removeItem("ACCESS_TOKEN")
}
function removeUsername(){
    localStorage.removeItem("USERNAME")
}

export default {
    setToken,getToken,removeToken,setUsername,getUsername,removeUsername
}