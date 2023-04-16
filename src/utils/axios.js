import axios from 'axios'
import { Toast } from 'vant'
import router from '../router'
import { error } from 'console'

//axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/api' : '//47.113.218.250:8080/api'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'


axios.interceptors.response.use(res => {
    /*if (typeof res.data != 'object') {
      Toast.fail('服务端异常！')
      return Promise.reject(res)
    } */
    if (res.data.state !== "200") {
        if (res.data.msg) Toast.fail(res.data.msg)
            /* if (res.data.status === 401) {
              //router.push({ path: '/login' })
              router.replace('/login')
              return Promise.reject(res.data)
            } */
    }
    return res.data
}, async error => {
    if (error.response.status === 401) {
        localStorage.clear()
        router.replace('/login')
    }
})

export default axios