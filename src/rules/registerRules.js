const registerRules = {
    userEmail: [
      { required: true, message: "请输入邮箱" },
      {
        pattern:
          /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        message: "邮箱格式错误",
      },
    ],
    userPhone: [
      { required: true, message: "请输入手机号" },
      {
        pattern:
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
        message: "手机号格式错误",
      },
    ],
    userPwd: [
      { required: true, message: "请输入密码" },
      {
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/,
        message: "密码格式错误",
      },
    ],
    usercaptcha: [{ required: true, message: "请输入验证码" }],
  };
  export default registerRules