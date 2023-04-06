const loginRules = {
    userName: [{ required: true, message: "请输入用户名" }],
    userPwd: [
      { required: true, message: "请输入密码" },
      {
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/,
        message: "密码格式错误",
      },
    ],
  };
  export default loginRules