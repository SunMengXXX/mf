(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["login"],{"0a7e":function(e,a,t){e.exports=t.p+"static/img/logo.bf4738e6.jpg"},"1a9f":function(e,a,t){"use strict";var r={userEmail:[{required:!0,message:"请输入邮箱"},{pattern:/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,message:"邮箱格式错误"}],userPhone:[{required:!0,message:"请输入手机号"},{pattern:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:"手机号格式错误"}],userPwd:[{required:!0,message:"请输入密码"},{pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/,message:"8到16位，包含大小写、数字、特殊字符"}],usercaptcha:[{required:!0,message:"请输入验证码"}]};a["a"]=r},4193:function(e,a,t){"use strict";t("4b52")},"498a":function(e,a,t){"use strict";var r=t("23e7"),n=t("58a8").trim,s=t("c8d2");r({target:"String",proto:!0,forced:s("trim")},{trim:function(){return n(this)}})},"4b52":function(e,a,t){},a55b:function(e,a,t){"use strict";t.r(a);var r=t("7a23"),n=t("0a7e"),s=t.n(n),u=Object(r["S"])("data-v-9482e2ac");Object(r["C"])("data-v-9482e2ac");var c={class:"auth"},l=Object(r["j"])("img",{class:"logo",src:s.a,round:"",fit:"cover",alt:""},null,-1),o={class:"form"},i={style:{margin:"16px 0"}},m=Object(r["i"])(" 登录 "),d={class:"form"},p=Object(r["i"])("发送验证码"),b={style:{margin:"16px 0"}},g=Object(r["i"])(" 注册 ");Object(r["A"])();var f=u((function(e,a,t,n,s,f){var j=Object(r["G"])("Header"),O=Object(r["G"])("van-field"),v=Object(r["G"])("van-button"),h=Object(r["G"])("van-form");return Object(r["z"])(),Object(r["f"])("div",c,[Object(r["j"])(j,{title:"login"==e.type?"登录":"注册"},null,8,["title"]),l,"login"==e.type?(Object(r["z"])(),Object(r["f"])(h,{key:0,class:"form-wrap",onSubmit:n.onSubmit},{default:u((function(){return[Object(r["j"])("div",o,[Object(r["j"])(O,{clearable:"",modelValue:e.userName,"onUpdate:modelValue":a[1]||(a[1]=function(a){return e.userName=a}),name:"userName",label:"账号",placeholder:"请输入账号",rules:n.loginRules.userName},null,8,["modelValue","rules"]),Object(r["j"])(O,{clearable:"",modelValue:e.userPwd,"onUpdate:modelValue":a[2]||(a[2]=function(a){return e.userPwd=a}),type:"password",name:"userPwd",label:"密码",placeholder:"请输入密码",rules:n.loginRules.userPwd},null,8,["modelValue","rules"])]),Object(r["j"])("div",i,[Object(r["j"])(v,{round:"",block:"",type:"primary","native-type":"submit"},{default:u((function(){return[m]})),_:1}),Object(r["j"])("p",{onClick:a[3]||(a[3]=function(e){return n.chanegType("register")}),class:"change-btn"}," 没有账号，前往注册 ")])]})),_:1},8,["onSubmit"])):Object(r["g"])("",!0),"register"==e.type?(Object(r["z"])(),Object(r["f"])(h,{key:1,class:"form-wrap",onSubmit:n.onSubmit},{default:u((function(){return[Object(r["j"])("div",d,[Object(r["j"])(O,{clearable:"",modelValue:e.userName,"onUpdate:modelValue":a[4]||(a[4]=function(a){return e.userName=a}),name:"userName",label:"账号",placeholder:"请输入账号",rules:[{required:!0,message:"请填写账号"}]},null,8,["modelValue"]),Object(r["j"])(O,{clearable:"",modelValue:e.userPwd,"onUpdate:modelValue":a[5]||(a[5]=function(a){return e.userPwd=a}),type:"password",name:"userPwd",label:"密码",placeholder:"请输入密码",rules:n.registerRules.userPwd},null,8,["modelValue","rules"]),Object(r["j"])(O,{modelValue:e.usercaptcha,"onUpdate:modelValue":a[6]||(a[6]=function(a){return e.usercaptcha=a}),center:"",clearable:"",label:"验证码",placeholder:"输入验证码",rules:n.registerRules.usercaptcha,class:"CAPTCHA"},{button:u((function(){return[Object(r["j"])(v,{size:"small",type:"primary",onClick:e.sendCAPTCHA,disabled:n.disabledController},{default:u((function(){return[p]})),_:1},8,["onClick","disabled"])]})),_:1},8,["modelValue","rules"])]),Object(r["j"])("div",b,[Object(r["j"])(v,{round:"",block:"",loading:e.loading,type:"primary","native-type":"submit"},{default:u((function(){return[g]})),_:1},8,["loading"]),Object(r["j"])("p",{onClick:a[7]||(a[7]=function(e){return n.chanegType("login")}),class:"change-btn"},"登录已有账号")])]})),_:1},8,["onSubmit"])):Object(r["g"])("",!0)])})),j=(t("caad"),t("b680"),t("ac1f"),t("2532"),t("5319"),t("498a"),t("5530")),O=(t("96cf"),t("1da1")),v=(t("433b"),t("d399")),h=t("f0fc"),w=t("a27e"),N=t("a18c"),k={userName:[{required:!0,message:"请输入用户名"}],userPwd:[{required:!0,message:"请输入密码"},{pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/,message:"密码格式错误"}]},y=k,A=t("1a9f");function x(e,a){var t=function(a){null===e.userName||""===e.userName||""===e.userName.trim()?Object(v["a"])({message:"手机号或邮箱不能为空！",position:"bottom"}):e.userName.includes("@")&&!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(e.userName)?Object(v["a"])({message:"邮箱格式错误，请重新输入！",position:"bottom"}):e.userName.includes("@")||/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(e.userName)?r(a):Object(v["a"])({message:"手机号格式错误，请重新输入！",position:"bottom"})},r=function(){var t=Object(O["a"])(regeneratorRuntime.mark((function t(r){var n,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(t.prev=0,!e.userName.includes("@")){t.next=8;break}return t.next=4,w["a"].post("/HNBC/user/emailcaptcha",{email:e.userName});case 4:n=t.sent,"200"===n.state&&(v["a"].success(n.msg),a.value=!0,_(r,a)),t.next=12;break;case 8:return t.next=10,w["a"].post("/HNBC/user/phonecaptcha",{phone:e.userName});case 10:s=t.sent,"200"===s.state&&(v["a"].success(s.msg),a.value=!0,_(r,a));case 12:t.next=16;break;case 14:t.prev=14,t.t0=t["catch"](0);case 16:case"end":return t.stop()}}),t,null,[[0,14]])})));return function(e){return t.apply(this,arguments)}}();return{sendCAPTCHA:t,getCAPTCHA:r}}function _(e,a){var t=new Date((new Date).getTime()+61e3),r=setInterval((function(){var n=((t-(new Date).getTime())/1e3).toFixed(0);e.target.innerHTML="("+n+"s)",n<1&&(clearInterval(r),a.value=!1,e.target.innerHTML="发送验证码")}),1e3);return r}var C={name:"Login",components:{Header:h["a"]},setup:function(){var e=Object(r["D"])({userName:"",userPwd:"",type:"login",usercaptcha:"",loading:!1}),a=Object(r["E"])(!1),t=function(){var a=Object(O["a"])(regeneratorRuntime.mark((function a(t){var r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(a.prev=0,!1!==/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/.test(e.userPwd)){a.next=6;break}return v["a"].fail("密码必须包含大小写、数字、特殊字符，且在8到16位"),a.abrupt("return");case 6:if("login"!=e.type){a.next=19;break}if(!e.userName.includes("@")){a.next=13;break}return a.next=10,w["a"].post("/HNBC/user/emaillogin",{email:e.userName,pass:e.userPwd});case 10:r=a.sent,a.next=16;break;case 13:return a.next=15,w["a"].post("/HNBC/user/phonelogin",{phone:e.userName,pass:e.userPwd});case 15:r=a.sent;case 16:r.data?(v["a"].success(r.msg+"\n即将自动跳转至主页"),localStorage.setItem("token",r.data),setTimeout((function(){N["a"].replace("/")}),1e3)):(v["a"].fail(r.msg),localStorage.setItem("token",null)),a.next=31;break;case 19:if(e.loading=!0,!e.userName.includes("@")){a.next=26;break}return a.next=23,w["a"].post("/HNBC/user/emailregister",{email:e.userName,pass:e.userPwd,usercaptcha:e.usercaptcha});case 23:r=a.sent,a.next=29;break;case 26:return a.next=28,w["a"].post("/HNBC/user/phoneregister",{phone:e.userName,pass:e.userPwd,usercaptcha:e.usercaptcha});case 28:r=a.sent;case 29:r.data?(v["a"].success(r.msg+"\n即将自动跳转至主页"),localStorage.setItem("token",r.data),e.type="login",setTimeout((function(){N["a"].replace("/")}),1200)):(v["a"].fail(r.msg),localStorage.setItem("token",null),e.usercaptcha=""),e.loading=!1;case 31:a.next=36;break;case 33:a.prev=33,a.t0=a["catch"](0),e.loading=!1;case 36:case"end":return a.stop()}}),a,null,[[0,33]])})));return function(e){return a.apply(this,arguments)}}(),n=function(a){e.type=a};return Object(j["a"])(Object(j["a"])(Object(j["a"])({},Object(r["K"])(e)),x(e,a)),{},{disabledController:a,onSubmit:t,chanegType:n,loginRules:y,registerRules:A["a"]})}};t("4193");C.render=f,C.__scopeId="data-v-9482e2ac";a["default"]=C},c8d2:function(e,a,t){var r=t("d039"),n=t("5899"),s="​᠎";e.exports=function(e){return r((function(){return!!n[e]()||s[e]()!=s||n[e].name!==e}))}}}]);