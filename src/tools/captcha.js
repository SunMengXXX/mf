import axios from "../utils/axios";
import { Toast } from "vant";
export function getCAPTCHA(state, target, disabledController) {
    //验证码发送
    const check = (target) => {
        if (state.userName!=null) {
            getCAPTCHA(target);
        } else {
            Toast.fail({
                message: "手机号或邮箱不能为空！",
                position: "bottom",
            });
        }
    };
    //从后端获取验证码
    const send = async (target) => {
        try {
            const user = {
                phone: state.userName.includes("@") ? null : state.userName,
                email: state.userName.includes("@") ? state.userName : null,
            };
            const data = await axios.post("/captcha", user);
            if (data.state === "200") {
                Toast.success(data.msg);
                disabledController.value = true;
                timeLock(target, disabledController);
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
