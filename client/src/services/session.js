import router from '@/router/index'

export default {
    setToken (token) {     
        localStorage.setItem('auth-token', token)  
    },
    getToken () {
        return localStorage.getItem('auth-token')
    },
    deleteToken () {
        localStorage.clear()
    },
    Error (error) {
        if (error.response.status == 401) {
            this.deleteToken()        
            router.push({ name: 'LoginPage' })
        }        
    }
}
