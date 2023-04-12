import axios from "../utils/axios";
import { Toast } from "vant";
export function getCAPTCHA(state, target, disabledController) {
    //验证码发送
    const check = (target) => {
        if (state.userName === null || state.userName === '' || state.userName.trim() === '') {
            Toast({
                message: "手机号或邮箱不能为空！",
                position: "bottom",
            });
        } else if (state.userName.includes("@") && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(state.userName)) {
            Toast({
                message: "邮箱格式错误，请重新输入！",
                position: "bottom",
            });
        } else if (!state.userName.includes("@") && !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(state.userName)) {
            Toast({
                message: "手机号格式错误，请重新输入！",
                position: "bottom",
            });
        } else {
            getCAPTCHA(target);
        }
    };
    //从后端获取验证码
    const send = async (target) => {
        try {
            if (state.userName.includes("@")) {
                const data = await axios.post("/HNBC/user/emailcaptcha", {
                    email: state.userName
                });
                if (data.state === "200") {
                    Toast.success(data.msg);
                    disabledController.value = true;
                    timeLock(target, disabledController);
                }
            } else {
                const data = await axios.post("/HNBC/user/phonecaptcha", {
                    phone: state.userName
                });
                if (data.state === "200") {
                    Toast.success(data.msg);
                    disabledController.value = true;
                    timeLock(target, disabledController);
                }
            }

        } catch (e) { }
    };
    check(target)
    return {
        check,
        send,
    };
}
//定时器
function timeLock(target, disabledController) {
    let timer = new Date(new Date().getTime() + 61 * 1000);
    let lock = setInterval(() => {
        const time = ((timer - new Date().getTime()) / 1000).toFixed(0);
        target.target.innerHTML = "(" + time + "s)";
        if (time < 1) {
            clearInterval(lock);
            disabledController.value = false;
            target.target.innerHTML = "发送验证码";
        }
    }, 1000);
    return lock;
}
