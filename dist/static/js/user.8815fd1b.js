(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["user"],{1019:function(e,t,n){},1511:function(e,t,n){"use strict";n.r(t);var r=n("7a23"),a=Object(r["S"])("data-v-0af7a45e");Object(r["C"])("data-v-0af7a45e");var c={class:"user"},u={class:"head"},i={class:"info"},o={class:"name"},s={class:"slogen"},l={class:"content"},d=Object(r["i"])("退出登录");Object(r["A"])();var j=a((function(e,t,n,j,b,f){var O=Object(r["G"])("van-loading"),v=Object(r["G"])("van-image"),m=Object(r["G"])("Circle"),g=Object(r["G"])("van-grid-item"),p=Object(r["G"])("van-grid"),h=Object(r["G"])("van-cell"),k=Object(r["G"])("van-button");return Object(r["z"])(),Object(r["f"])("div",c,[Object(r["j"])("div",u,[Object(r["j"])(v,{class:"avatar",round:"",fit:"cover",src:e.user.avatar},{loading:a((function(){return[Object(r["j"])(O,{type:"spinner",size:"20"})]})),_:1},8,["src"]),Object(r["j"])("div",i,[Object(r["j"])("span",o,Object(r["J"])(e.user.nickName||""),1),Object(r["j"])("span",s,"记账天数："+Object(r["J"])(e.user.ledgerDay||""),1)])]),Object(r["j"])(m,{all:j.allBudget,remain:j.remainBudget},null,8,["all","remain"]),Object(r["j"])(p,{class:"grid",direction:"horizontal","column-num":2},{default:a((function(){return[Object(r["j"])(g,{icon:"bill-o",onClick:j.budgetsList,text:"预算"},null,8,["onClick"]),Object(r["j"])(g,{icon:"friends-o",dot:j.dot,text:"好友",onClick:j.friendsList},null,8,["dot","onClick"])]})),_:1}),Object(r["j"])(p,{class:"grid",direction:"horizontal","column-num":1},{default:a((function(){return[Object(r["j"])(g,{icon:"todo-list-o",to:"/proposal",text:"智能消费分析与建议","is-link":""})]})),_:1}),Object(r["j"])("div",l,[Object(r["j"])(h,{icon:"user-circle-o",title:"修改信息",onClick:j.modifyInfo,"is-link":""},null,8,["onClick"]),Object(r["j"])(h,{icon:"setting-o",to:"/account",title:"账户安全","is-link":""}),Object(r["j"])(h,{icon:"smile-o",to:"/about",title:"关于我们","is-link":""})]),Object(r["j"])(k,{class:"logout",type:"primary",size:"large",onClick:j.logout},{default:a((function(){return[d]})),_:1},8,["onClick"])])})),b=n("5530"),f=(n("433b"),n("d399")),O=(n("96cf"),n("1da1")),v=n("a27e"),m=n("a18c"),g=(n("b680"),Object(r["S"])("data-v-e1fc185c")),p=g((function(e,t,n,a,c,u){var i=Object(r["G"])("van-circle"),o=Object(r["G"])("van-col"),s=Object(r["G"])("van-row");return Object(r["z"])(),Object(r["f"])(s,{justify:"center"},{default:g((function(){return[Object(r["j"])(o,{offset:"",span:"4rem"},{default:g((function(){return[Object(r["j"])(i,{"current-rate":a.currentRate,rate:a.rate,speed:1,color:a.gradientColor,text:a.text,onLoad:a.onload},null,8,["current-rate","rate","color","text","onLoad"])]})),_:1}),Object(r["j"])(o,{class:"budget"},{default:g((function(){return[Object(r["j"])("div",null,"当月已使用预算"+Object(r["J"])((a.all-a.remain).toFixed(2)),1),Object(r["j"])("div",null,"当月总预算"+Object(r["J"])(a.all.toFixed(2)),1)]})),_:1})]})),_:1})})),h=(n("a9e3"),{name:"Circle",props:{all:{type:Number},remain:{type:Number}},setup:function(e){var t=Object(r["E"])(0),n=Object(r["E"])(0),a=Object(r["d"])((function(){return t.value>0?n.value/t.value:0})),c=Object(r["E"])(100),u=a.value<80?{"0%":"#3fecff","100%":"#6149f6"}:"red",i=Object(r["d"])((function(){return"已使用\n"+(a.value<100?a.value.toFixed(0):100)+"%"}));return Object(r["O"])(e,(function(e){t.value=e.all,n.value=e.remain})),{all:t,remain:n,rate:c,currentRate:a,gradientColor:u,text:i,onload:onload}}});n("55ba");h.render=p,h.__scopeId="data-v-e1fc185c";var k=h,x=n("0efd"),y=(n("4362"),{name:"User",components:{Circle:k},setup:function(){var e=Object(r["D"])({user:{avatar:"",userID:null,nickName:"",registerTime:"",sex:"",birthday:"",ledgerCount:null,ledgerDay:null}}),t=Object(r["E"])(0),n=Object(r["E"])(0),a=Object(r["E"])([]),c=Object(r["E"])(!1);Object(r["w"])(Object(O["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:u(),o(),Object(x["a"])(),a.value=localStorage.getItem("friendReq"),a.value?c.value=0!==JSON.parse(a.value).length:c.value=!1;case 5:case"end":return e.stop()}}),e)}))));var u=function(){var t=Object(O["a"])(regeneratorRuntime.mark((function t(){var n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,v["a"].get("/HNBC/userinfo/getuserinfo");case 2:n=t.sent,r=n.data,e.user.userID=r.userid,e.user.nickName=r.nickname,e.user.registerTime=r.create_time,e.user.sex=r.sex,e.user.birthday=r.birthday,e.user.ledgerCount=r.numrecord,e.user.ledgerDay=r.numactivateday,e.user.avatar=r.icon,localStorage.setItem("user",JSON.stringify(r)),r.nickname&&r.birthday&&r.sex||f["a"].fail("请您尽快填写个人信息");case 14:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),i=function(){m["a"].push({name:"Info",query:{icon:e.user.avatar}})},o=function(){var e=Object(O["a"])(regeneratorRuntime.mark((function e(){var r,a,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,v["a"].get("/HNBC/userbudget/all");case 2:for(r=e.sent,a=r.data,c=0;c<a.length;c++)"进行中"===a[c].state&&(t.value=a[c].amount,n.value=a[c].residual);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),s=function(){m["a"].push("/budgets")},l=function(){e.user.nickName&&e.user.birthday&&e.user.sex?m["a"].push("/friends"):f["a"].fail("完成个人信息后方可使用")},d=function(){var e=Object(O["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,v["a"].get("/HNBC/userinfo/logout");case 2:t=e.sent,f["a"].success({message:t.msg+"\n即将跳转至登录页面",duration:1e3}),localStorage.clear(),setTimeout((function(){m["a"].push({path:"/login"})}),1500);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(b["a"])(Object(b["a"])({},Object(r["K"])(e)),{},{logout:d,allBudget:t,remainBudget:n,friendsList:l,budgetsList:s,friendReq:a,dot:c,modifyInfo:i})}});n("5797"),n("d993");y.render=j,y.__scopeId="data-v-0af7a45e";t["default"]=y},"55ba":function(e,t,n){"use strict";n("71ff")},5797:function(e,t,n){"use strict";n("7296")},"71ff":function(e,t,n){},7296:function(e,t,n){},d993:function(e,t,n){"use strict";n("1019")}}]);