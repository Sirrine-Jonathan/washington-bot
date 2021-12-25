(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{154:function(n,e){},166:function(n,e,t){},167:function(n,e,t){"use strict";t.r(e);var r,i,c,a,o,l,s,d,u,j,b,f,h,p,x,g,O,v,m,y,k,_,w,C,z,I,R,F=t(0),T=t.n(F),G=t(24),S=t.n(G),P=t(5),E=t(26),N=t(59),A=t(109),B=t.n(A),J=t(6),L=t(115),H=t(36),M=t(186),Q=t(110),U=t(1),q=["children"],D=function(n){var e=n.children,t=Object(Q.a)(n,q);return Object(U.jsx)(K,Object(E.a)(Object(E.a)({},t),{},{children:e}))},K=J.a.div(r||(r=Object(P.a)(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #2a2a3a;\n  padding: 20px;\n  & h1 {\n    color: white;\n    padding: 0;\n    margin: 0;\n  }\n"]))),W=function(n){var e=n.children;return Object(U.jsx)(V,{children:e})},V=J.a.div(i||(i=Object(P.a)([""]))),X=function(n){var e=n.log,t=Object(F.useRef)();return Object(F.useEffect)((function(){t.current.scrollTop=t.current.scrollHeight})),Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(Y,{ref:t,children:e.map((function(n,e){return Object(U.jsx)("div",{children:n},e)}))}),Object(U.jsx)(Z,{})]})},Y=J.a.div(c||(c=Object(P.a)(["\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: start;\n  text-align: center;\n  background: #333;\n  color: #fff;\n  height: 700px;\n  padding: 10px;\n  border-radius: 5px;\n  margin: 20px 0;\n  overflow-y: scroll;\n"]))),Z=J.a.div(a||(a=Object(P.a)(["\n  height: 70px;\n"]))),$=function(n){var e,t,r,i,c=n.tile,a=n.data,o=n.showTileNumbers,l=a.terrain,s=a.armies,d=null===a||void 0===a||null===(e=a.meta)||void 0===e?void 0:e.usernames,u=null===a||void 0===a||null===(t=a.meta)||void 0===t?void 0:t.playerIndex,j=null===a||void 0===a||null===(r=a.meta)||void 0===r?void 0:r.playerColors,b=null===a||void 0===a||null===(i=a.cities)||void 0===i?void 0:i.includes(c),f=null,h=[];if(-1===l[c])h.push("empty");else if(-2===l[c])h.push("mountain");else if(-3===l[c])h.push("fog");else if(-4===l[c])h.push("fog-obstacle");else if(l[c]>=0){if(l[c]===u)h.push("owned"),c===a.general_tile&&h.push("owned-general");else{var p=l[c];h.push("enemy"),h.push("enemy-".concat(p)),h.push(d[p]),h.push("color-".concat(j[p]))}f=Object(U.jsx)(bn,{children:s[c]})}return b&&(h.push("city"),f=Object(U.jsx)(bn,{children:s[c]})),null!==a&&void 0!==a&&a.current_path&&null!==a&&void 0!==a&&a.current_path.includes(c)&&h.push("path-tile"),a.current_target===c&&h.push("current-target"),a.random_from===c&&h.push("random-from"),h.includes("current-target")&&console.log("set class current-target on tile ".concat(c)),Object(U.jsxs)(hn,{className:h.join(" "),"data-tile":c,children:[f,o&&Object(U.jsx)(fn,{children:c})]})},nn=function(n){var e,t,r=n.data,i=n.showTileNumbers,c=void 0===i||i;return Object(U.jsx)(en,{children:r&&r.meta?Object(U.jsxs)(rn,{children:[Object(U.jsxs)(cn,{children:[Object(U.jsx)(an,{children:"Game Information"}),Object(U.jsxs)(on,{children:[Object(U.jsx)(sn,{children:"Player Index:"}),null===r||void 0===r?void 0:r.meta.playerIndex]}),Object(U.jsxs)(on,{children:[Object(U.jsx)(sn,{children:"Replay URL:"}),Object(U.jsx)("a",{href:null===r||void 0===r?void 0:r.meta.replay_url,children:null===r||void 0===r?void 0:r.meta.replay_url})]}),Object(U.jsxs)("div",{children:[Object(U.jsx)(sn,{children:"Players:"}),(null===r||void 0===r||null===(e=r.meta)||void 0===e?void 0:e.usernames)&&(null===r||void 0===r||null===(t=r.meta)||void 0===t?void 0:t.usernames.map((function(n,e){return Object(U.jsxs)(ln,{children:[Object(U.jsxs)(sn,{children:[e,":"]}),n]},n)})))]})]}),Object(U.jsx)(dn,{className:"Board",children:function(){for(var n=[],e=[],t=0,i=0,a=0;a<r.size;a++)e.push(Object(U.jsx)($,{tile:a,data:r,showTileNumbers:c},a)),++t===r.width&&(t=0,i++,n.push(Object(U.jsx)(un,{children:e},"row-".concat(i))),e=[]);return n}()})]}):Object(U.jsx)(tn,{children:Object(U.jsx)(jn,{children:"No Game Running"})})})},en=J.a.div(o||(o=Object(P.a)([""]))),tn=J.a.div(l||(l=Object(P.a)(["\n  width: 100%;\n  display: flex;\n  text-align: center;\n  background: #fefefe;\n  height: 150px;\n  align-items: center;\n  justify-content: center;\n  border-radius: 5px;\n  margin: 20px 0;\n"]))),rn=J.a.div(s||(s=Object(P.a)(["\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  justify-content: center;\n  border-radius: 5px;\n  margin: 20px 0;\n  box-sizing: border-box;\n"]))),cn=J.a.div(d||(d=Object(P.a)(["\n  width: 100%;\n  background: rgba(255, 255, 255, 0.8);\n  color: #000;\n  border-radius: 10px;\n  padding: 15px 30px;\n  font-size: 15px;\n"]))),an=J.a.div(u||(u=Object(P.a)(["\n  font-size: 30px;\n  color: #000;\n  text-shadow: 1px 1px 3px solid #eee;\n  padding: 10px 0 20px;\n"]))),on=J.a.div(j||(j=Object(P.a)(["\n  display: flex;\n"]))),ln=J.a.div(b||(b=Object(P.a)(["\n  display: flex;\n  margin-left: 15px;\n"]))),sn=J.a.div(f||(f=Object(P.a)(["\n  margin-right: 10px;\n  font-weight: bold;\n"]))),dn=J.a.div(h||(h=Object(P.a)(["\n  margin: 20px;\n  background: #f0ead6;\n  border-radius: 10px;\n  overflow: hidden;\n"]))),un=J.a.div(p||(p=Object(P.a)(["\n  display: flex;\n"]))),jn=J.a.div(x||(x=Object(P.a)(["\n  font-size: 30px;\n"]))),bn=J.a.div(g||(g=Object(P.a)(["\n  position: absolute;\n  left: 3px;\n  bottom: 7px;\n  font-size: 25px;\n  font-weight: bold;\n"]))),fn=J.a.div(O||(O=Object(P.a)(["\n  position: absolute;\n  top: 0;\n  right: 5px;\n  font-size: 10px;\n"]))),hn=J.a.div(v||(v=Object(P.a)(['\n  position: relative;\n  width: 50px;\n  height: 50px;\n  margin: 1px;\n  display: flex;\n  justify-content: center;\n  box-sizing: border-box;\n  align-items: center;\n  color: #000;\n  background: #e2d7b1;\n  border-radius: 10px;\n  &.owned {\n    background: #2185d0;\n    color: #fff;\n  }\n  &.owned-general {\n    background: gold;\n    color: #000;\n  }\n  &.empty {\n    background: #f0ead6;\n    box-shadow: 2px 2px 3px #e2d7b1;\n    color: #000;\n  }\n  &.mountain {\n    background: black;\n    color: #fff;\n  }\n  &.enemy {\n    background: red;\n    color: #fff;\n  }\n  &.city {\n    background: purple;\n    color: #fff;\n  }\n  &.path-tile {\n    background: green;\n    color: #fff;\n  }\n  &.current-target {\n    background: gold;\n    color: #000;\n  }\n  &.random-from {\n    background: #feeaee;\n    color: #000;\n  }\n  &.current-path &::before {\n    content: attr("data-tile");\n    position: absolute;\n  }\n']))),pn=t(187),xn=t(184),gn=t(185),On=t(168),vn=t(37),mn=(t(160),function(n){n.bot;var e=Object(F.useState)("sirrine"),t=Object(N.a)(e,2),r=t[0],i=t[1];return Object(U.jsx)(pn.a.Group,{children:Object(U.jsxs)(pn.a,{fluid:!0,children:[Object(U.jsxs)(pn.a.Content,{children:[Object(U.jsxs)(pn.a.Header,{style:{display:"flex",justifyContent:"space-between"},children:[Object(U.jsx)(zn,{children:"Control Panel"}),Object(U.jsxs)(yn,{children:[Object(U.jsx)(_n,{type:"text",value:r,placeholder:"Game ID",onChange:function(n){i(n.target.value)}}),Object(U.jsxs)(wn,{secondary:!0,onClick:function(n){fetch("/invite/".concat(r)).then((function(n){return n.json()})).then((function(n){Object(vn.b)(Object(U.jsx)(Cn,{href:"".concat(n.url),target:"_blank",rel:"noreferrer",children:"Game Starting!"}))}))},children:[Object(U.jsx)(H.a,{name:"envelope"}),Object(U.jsx)("div",{children:"Invite"})]})]})]}),Object(U.jsx)(xn.a,{}),Object(U.jsxs)(kn,{children:[Object(U.jsxs)(wn,{color:"red",onClick:function(){fetch("/quit").then((function(n){return n.json()})).then((function(n){Object(vn.b)(Object(U.jsx)(Cn,{href:"".concat(n.url),target:"_blank",rel:"noreferrer",children:"Quit Game!"}))}))},children:[Object(U.jsx)(H.a,{name:"close icon"}),Object(U.jsx)("div",{children:"Quit"})]}),Object(U.jsxs)(wn,{primary:!0,onClick:function(){fetch("/quickplay").then((function(n){return n.json()})).then((function(n){window.open(n.url,"_blank")}))},children:[Object(U.jsx)(H.a,{name:"game"}),Object(U.jsx)("div",{children:"Quick Play"})]}),Object(U.jsxs)(wn,{primary:!0,onClick:function(){fetch("/1v1").then((function(n){return n.json()})).then((function(n){Object(vn.b)(Object(U.jsx)(Cn,{href:"".concat(n.url),target:"_blank",rel:"noreferrer",children:"Joining 1v1"}))}))},children:[Object(U.jsx)(H.a,{name:"game"}),Object(U.jsx)("div",{children:"1v1"})]}),Object(U.jsxs)(wn,{primary:!0,onClick:function(){fetch("/ffa").then((function(n){return n.json()})).then((function(n){Object(vn.b)(Object(U.jsx)(Cn,{href:"".concat(n.url),target:"_blank",rel:"noreferrer",children:"Joining FFA"}))}))},children:[Object(U.jsx)(H.a,{name:"game"}),Object(U.jsx)("div",{children:"Free-for-All"})]}),Object(U.jsxs)(wn,{secondary:!0,onClick:function(){fetch("/rejoin").then((function(n){return n.json()})).then((function(n){Object(vn.b)(Object(U.jsx)(Cn,{href:"".concat(n.url),target:"_blank",rel:"noreferrer",children:"Rejoined!"}))}))},children:[Object(U.jsx)(H.a,{name:"redo alternate"}),Object(U.jsx)("div",{children:"Ready Up"})]})]})]}),Object(U.jsx)(vn.a,{position:"top-right",autoClose:5e3,hideProgressBar:!0,newestOnTop:!1,closeOnClick:!1,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0})]})})}),yn=J.a.div(m||(m=Object(P.a)(["\n  display: flex;\n  justify-content: start;\n  box-sizing: border-box;\n"]))),kn=J.a.div(y||(y=Object(P.a)(["\n  display: flex;\n  flex: 1;\n  width: 100%;\n  justify-content: center;\n  box-sizing: border-box;\n"]))),_n=Object(J.a)(gn.a)(k||(k=Object(P.a)(["\n  margin-right: 4px;\n"]))),wn=Object(J.a)(On.a)(_||(_=Object(P.a)(["\n  display: flex !important;\n  flex-wrap: no-wrap !important;\n  flex-direction: row !important;\n  justify-content: center;\n  align-items: center;\n  & div {\n    padding-left: 5px;\n  }\n"]))),Cn=J.a.a(w||(w=Object(P.a)(["\n  text-decoration: none;\n  font-size: 16px;\n  color: #000;\n  &:hover {\n    color: #333;\n    text-decoration: underline;\n  }\n"]))),zn=J.a.div(C||(C=Object(P.a)(["\n  font-size: 30px;\n  padding: 10px;\n"]))),In=function(n,e){for(var t=[],r=0;r<e.length;)e[r]&&Array.prototype.push.apply(t,n.slice(t.length,t.length+e[r])),++r<e.length&&e[r]&&(Array.prototype.push.apply(t,e.slice(r+1,r+1+e[r])),r+=e[r]),r++;return t},Rn=function(){var n=Object(F.useState)({meta:null,map:[],width:0,height:0,size:0,generals:[],cities:[],terrain:[],owned:[],enemies:[],perimeter:[]}),e=Object(N.a)(n,2),t=e[0],r=e[1],i=Object(F.useRef)(t);Object(F.useEffect)((function(){i.current=t}));var c=Object(F.useState)([]),a=Object(N.a)(c,2),o=a[0],l=a[1],s=Object(F.useRef)(o);Object(F.useEffect)((function(){s.current=o}));var d=function(n){console.log("game_start",n);var e=Object(E.a)(Object(E.a)({},i.current),{},{meta:Object(E.a)({replay_url:"http://bot.generals.io/replays/".concat(encodeURIComponent(n.replay_id))},n)});r(e)},u=function(n){var e,t,c,a,o,l,s;if(console.log({data:n}),null===n)return!1;if(null===(null===i||void 0===i||null===(e=i.current)||void 0===e?void 0:e.meta))return!1;var d,u,j=n.turn/2,b=Math.ceil(j),f=25-b%25,h=In(null===i||void 0===i||null===(t=i.current)||void 0===t?void 0:t.map,n.map_diff),p=In(null===i||void 0===i||null===(c=i.current)||void 0===c?void 0:c.cities,n.cities_diff),x=n.generals,g=h[0],O=h[1],v=g*O,m=h.slice(2,(null===i||void 0===i||null===(a=i.current)||void 0===a?void 0:a.size)+2),y=h.slice((null===i||void 0===i||null===(o=i.current)||void 0===o?void 0:o.size)+2),k=y.map((function(n,e){var t,r;return n===(null===i||void 0===i||null===(t=i.current)||void 0===t||null===(r=t.meta)||void 0===r?void 0:r.playerIndex)?e:null})).filter((function(n){return null!==n})),_=y.map((function(n,e){var t,r;return function(n,e,t){return e[n]!==t&&e[n]>=0}(e,y,null===i||void 0===i||null===(t=i.current)||void 0===t||null===(r=t.meta)||void 0===r?void 0:r.playerIndex)?e:null})).filter((function(n){return null!==n})),w=Object(E.a)(Object(E.a)({},i.current),{},{internal_tick:j,game_tick:b,ticks_til_payday:f,map:h,cities:p,generals:x,armies:m,terrain:y,owned:k,enemies:_,current_path:n.current_path,current_target:n.current_target,random_from:n.random_from});1!==n.turn&&0!==(null===i||void 0===i||null===(l=i.current)||void 0===l?void 0:l.width)&&0!==(null===i||void 0===i||null===(s=i.current)||void 0===s?void 0:s.height)||(console.log("setting first tick stuff"),w.general_tile=n.generals[null===i||void 0===i||null===(d=i.current)||void 0===d||null===(u=d.meta)||void 0===u?void 0:u.playerIndex],w.width=g,w.height=O,w.size=v,console.log("FIRST TICK GAME",w));r(w)},j=function(){console.log("leave_game_handler"),r({meta:null,internal_tick:0,game_tick:0,ticks_til_payday:25,map:[],generals:[],cities:[],terrain:[],owned:[],enemies:[],perimeter:[]})},b=function(n){l(n)};return Object(F.useEffect)((function(){var n=B()("http://localhost:8080");return n.on("game_update",u),n.on("game_start",d),n.on("leave_game",j),n.on("log",b),function(){n.off("game_update",u),n.off("game_start",d),n.off("leave_game",j),n.off("log",b)}}),[]),Object(U.jsxs)(W,{children:[Object(U.jsx)(D,{children:Object(U.jsxs)(Fn,{children:[Object(U.jsx)(Tn,{href:"https://generals.io/",target:"_blank",rel:"noopener noreferrer",children:Object(U.jsx)(L.a,{src:"/robot.png",style:{width:"50px",marginTop:"-5px"}})}),Object(U.jsx)("a",{href:"https://github.com/Sirrine-Jonathan/generals-bots.git",target:"_blank",rel:"noreferrer",style:{marginRight:"15px"},children:Object(U.jsx)(H.a,{name:"github",style:{color:"#fff"},size:"huge"})}),Object(U.jsxs)(Gn,{children:[Object(U.jsx)("h1",{children:"Washington"}),Object(U.jsx)("h4",{children:"Generals.io Bot"})]})]})}),Object(U.jsxs)(M.a,{children:[Object(U.jsx)(nn,{data:t}),Object(U.jsx)(mn,{}),Object(U.jsx)(X,{log:o})]})]})},Fn=J.a.div(z||(z=Object(P.a)(["\n  display: flex;\n  align-items: center;\n"]))),Tn=J.a.a(I||(I=Object(P.a)(["\n  background: #fff;\n  border-radius: 60px;\n  height: 60px;\n  width: 60px;\n  padding: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-right: 15px;\n  cursor: pointer;\n"]))),Gn=J.a.div(R||(R=Object(P.a)(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  color: white;\n  & * {\n    margin: 0;\n  }\n"]))),Sn=function(){return Object(U.jsx)(Rn,{})},Pn=(t(165),t(166),function(n){n&&n instanceof Function&&t.e(3).then(t.bind(null,189)).then((function(e){var t=e.getCLS,r=e.getFID,i=e.getFCP,c=e.getLCP,a=e.getTTFB;t(n),r(n),i(n),c(n),a(n)}))});S.a.render(Object(U.jsx)(T.a.StrictMode,{children:Object(U.jsx)(Sn,{})}),document.getElementById("root")),Pn()}},[[167,1,2]]]);
//# sourceMappingURL=main.f749e50b.chunk.js.map