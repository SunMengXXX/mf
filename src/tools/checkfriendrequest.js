import axios from "../utils/axios";
export async function checkFriendRequest() {
    const { data } = await axios.get('/HNBC/friend/getrequest')
    const arr = Object.entries(data)
    const store = []
    for (let i = 0; i < arr.length; i++) {
        store.push({
            'nickname':arr[i][0],
            'info':arr[i][1]
        })
    }
    localStorage.setItem('friendReq',JSON.stringify(store))
}
