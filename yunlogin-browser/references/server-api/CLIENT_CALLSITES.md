# Client Call Sites (Request-Parameter Evidence)

Extracted from the management-center page chunks. The bundle mixes the management-center, local, and local-client surfaces, so a path here does not prove its target; see WORKFLOW.md for the prefix rule. Each entry shows the client function, its method/path, candidate request-field keys parsed from the call arguments, and the raw call context for manual confirmation.

When a call passes a variable instead of an inline literal, the keys are read from that variable's object literal in the surrounding context. Keys are still heuristic: confirm a large expression against the raw context shown for each entry.

- Routes with call sites: 354
- Routes with parsed request keys: 260

## DELETE /v2/plugin/group/deletePluginGroup

- Client name: `deletePluginGroup`
- Candidate request keys: `groupId`

```text
editGroup,"/pluginManage/teamPlugin"),b("clickMenu",l)},M=async()=>{2===m.activeIndex?p(d.plugin_myPlugin_deleteGroup_sure,"/pluginManage/myPlugin"):3===m.activeIndex&&p(r.plugin_teamPlugin_deleteGroup_sure,"/pluginManage/teamPlugin"),v.value=!0;200===(await n.deletePluginGroup({groupId:h.value})).code&&(b("refreshPlguinList",void 0),S(!0),s.success(window.t("deleteSuccess")||"删除成功")),y.value=!1,v.value=!1},U=(e,l)=>{if(3===m.activeIndex&&!o(u.Plugin_EditGroup))return l.isHighlighted=!1,void s.warning(window.t("packagePurchaseTips"));((e,l)=>{n.addPluginGroup({groupId:l,pluginCompanyId:e}).the
```

## DELETE /v2/plugin/uninstallNew

- Client name: `uninstallNew`
- Candidate request keys: _none parsed_

```text
atTypeId=0,ae.value.kernel=0,ue()):4===e.type&&(console.log(ae.value),ae.value.kernel=3===e.ID?0:e.ID,ae.value.catPlatformId=0,ae.value.catTypeId=0,f.value="main",null==(i=I.value)||i.scrollContainerToTop(),ue()))},he=async e=>{var l;let i;n.value=!0,i=await a.uninstallNew(e),n.value=!1,200===i.code?(s.success(window.t("deleteSuccess")||"删除成功"),x.value.gitPluginGroupListFun(),null==(l=C.value)||l.getmyTeamPluginList()):s.error(window.t("serviceException")||"服务异常")},fe=async e=>{var l;n.value=!0;200===(await a.updateTeamVisibility(e,!0)).code?(s.success("操作成功"),x.value.gitPluginGroupListFun(),n
```

## DELETE /v2/retail/deletePromotionLink

- Client name: `deletePromotionLink`
- Candidate request keys: `id`

```text
Click:e=>G(t.link)},[V(e,{name:"extend-share","is-color":!1})],8,Pt),k("button",{class:"custom-link-action pointer",type:"button",onClick:e=>(e=>{b.confirm({title:"确定删除自定义链接/邀请码？",text:"删除后，该推广链接与邀请码不再有效不再重定向跟踪。"},(async(a,t,s)=>{t.value=!0;try{const a=await l.deletePromotionLink({id:e.id},!0);if(200!==a.code)return void d.error(a.msg||"删除推广链接失败");d.success(window.t("deleteSuccess")||"删除成功"),s.value=!1,A()}catch(n){d.error(window.t("serverErrorTimely")||"服务端错误，请联系管理员及时处理")}finally{t.value=!1}}))})(t)},[V(e,{name:"extend-delete","is-color":!1})],8,wt)])))),128))])):M("",!0),k("div",{class:I(["c
```

## DELETE /v2/rpa/deleteRpaCarbonConfig

- Client name: `deleteRpaCarbonConfig`
- Candidate request keys: `configId`

```text
e:"success"}),z()):r({message:window.t("operateFail")||"操作失败",type:"error"})})).catch((e=>{console.log(e),h.value=!1,r({message:window.t("operateFail")||"操作失败",type:"error"})}))},fe=()=>{var e;const a={configId:null==(e=f.value)?void 0:e.configId};h.value=!0,v.deleteRpaCarbonConfig(a).then((e=>{h.value=!1,200===e.code?(r({message:window.t("deleteSuccess")||"删除成功",type:"success"}),z()):r({message:window.t("deleteFail")||"删除失败",type:"error"})})).catch((e=>{console.log(e),h.value=!1,r({message:window.t("deleteFail")||"删除失败",type:"error"})})),S(b.rpa_taskTemplate_delete_sure,c.path)},we=(e,a,l)=>{
```

## DELETE /v2/rpa/deleteRpaGroup

- Client name: `deleteRpaGroup`
- Candidate request keys: `groupId`

```text
"error"})})).catch((()=>{g.value=!1,r({message:window.t("createGroupFail")||"创建分组失败",type:"error"})}))},M=()=>{C.value="",T.value=""},D=(e,a)=>{b.value=a||void 0,m.value=e,d.value=!0},L=()=>{1===m.value?b.value&&(e=>{d.value=!0;const a={groupId:e};g.value=!0,i.deleteRpaGroup(a).then((e=>{g.value=!1,200===e.code?(r({message:window.t("deleteGroupSuccess")||"删除分组成功",type:"success"}),w.value="",s("update"),V()):r({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})})).catch((()=>{g.value=!1,r({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})}))})(b.value.groupId):(()=>{const e
```

## DELETE /v2/rpa/deleteRpaGroupByGroupIds

- Client name: `deleteRpaGroupByGroupIds`
- Candidate request keys: `groupId`

```text
"success"}),w.value="",s("update"),V()):r({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})})).catch((()=>{g.value=!1,r({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})}))})(b.value.groupId):(()=>{const e={groupId:S.value};g.value=!0,i.deleteRpaGroupByGroupIds(e).then((e=>{g.value=!1,200===e.code?(r({message:window.t("deleteGroupSuccess")||"删除分组成功",type:"success"}),w.value="",s("update"),V()):r({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})})).catch((()=>{g.value=!1,r({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})}))})()},z=e=>"-1"!==e.gro
```

## DELETE /v2/rpa/deleteRpaPlanManagementByPlanIds

- Client name: `deleteRpaPlanManagementByPlanIds`
- Candidate request keys: `planId`

```text
])),[[g,G(i).RPA_Start]]),ae((W(),Z(n,{class:"sub-button",onClick:e=>(e=>{const a={title:window.t("tip")||"提示",text:window.t("confirmDeletePlan")||"是否确认删除该计划？"};y.confirm(a,(async(a,t,n)=>{const{planId:l=""}=e,s={planId:[l]};t.value=!0;const{code:o=0}=await xe.deleteRpaPlanManagementByPlanIds(s);t.value=!1,200===o&&(m.success(window.t("deleteSuccess")||"删除成功"),n.value=!1,Le()),_(f.rpa_planManage_delete_sure,z.path)})),h(f.rpa_planManage_delete,z.path)})(a)},{default:J((()=>[te(ne(e.$t("delete")),1)])),_:2},1032,["onClick"])),[[g,G(i).RPA_DeletePlan]])])),_:1},8,["label"])])),_:2},[Se.value?{na
```

## DELETE /v2/rpa/destroyRpaCarbonConfigByAll

- Client name: `destroyRpaCarbonConfigByAll`
- Candidate request keys: _none parsed_

```text
sg:i(l.Recycle_Delete)}));0!==re.value.length&&(ue.value=!0,pe.value.title=window.t("clearRecycleBin")||"清空回收站",pe.value.content=window.t("confirmDeleteClearRPAIrrecoverable")||"清空后RPA模板将不可恢复，确认要删除么？",pe.value.sbmitFunc=()=>{(async()=>{const{code:e=0}=await ae.destroyRpaCarbonConfigByAll();200===e&&(y(window.t("clearRecycleBinSuccess")||"清空回收站成功","success"),de())})(),u(p.recycle_rpaTemplate_clear_sure,j.path)},d(p.recycle_rpaTemplate_clear,j.path))},fe=e=>{const{configId:a="",rpaName:t=""}=e;ue.value=!0,pe.value.title=window.t("recover")||"恢复",pe.value.content=window.t("confirmRestoreNamedItem
```

## DELETE /v2/rpa/destroyRpaCarbonConfigByConfigIds

- Client name: `destroyRpaCarbonConfigByConfigIds`
- Candidate request keys: `configId`

```text
Template_restore,j.path)},he=e=>{const{configId:a=""}=e;ue.value=!0,pe.value.title=window.t("delete")||"删除",pe.value.content=window.t("confirmDeleteRPAIrrecoverable")||"删除RPA模板后无法恢复，确认删除么？",pe.value.sbmitFunc=()=>{(async e=>{const a=[e||""],{code:t=0}=await ae.destroyRpaCarbonConfigByConfigIds({configId:a});f.getInstance().subscribe(h.RPADel),200===t&&(y(window.t("deleteRPASuccess")||"删除RPA成功","success"),f.getInstance().removeSub(h.RPADel.type),de())})(a),u(p.recycle_rpaTemplate_delete_sure,j.path)},d(p.recycle_rpaTemplate_delete,j.path)},ye=e=>{let a="";e.forEach((e=>{a+=e.search})),le.value=
```

## GET /api/v1/users/dingtalkcallback

- Client name: `userDingtalkcallback`
- Candidate request keys: `code`, `state`

```text
vType&&(Q(),console.log("weixin"))},z=()=>{Q()},U=e=>{e?(t.navType=e,t.typeID=10):t.navType=t.navs[0].code,f()},K=e=>{const o=e.data;var n,r,s;if("qr-ding-iframe"===o.cmd&&(console.log("准备发起dingtalkcallback回调请求",o.params),n=o.params.authCode,r=o.params.state,a.userDingtalkcallback({code:n,state:r}).then((e=>{}))),"wxlogin"===o.cmd&&(console.log(o.params.code,"这是wxlogin"),(async e=>{try{if(vn(),!e)return;const o=await a.newwxinfo({code:e,last_login_port:"client",last_login_device:t.isMobile()?"mobile":"pc"});if(200===o.code)if(o.data.hasOwnProperty("token"))Y("success",o);else{const{identificat
```

## GET /v2/cost/costmanagement/get_user_set_meal

- Client name: `getUsermeal`
- Candidate request keys: _none parsed_

```text
),rN=setTimeout((()=>{(async()=>{const{user:e}=fL(),t=e.companyData.companyId;if(!t)return void console.log("companyId is Empty");const n=await oA.updatePackageStatus({companyId:t});if(200===n.code)if(3===n.data)oN.value=!0;else if(2===n.data){const e=await oA.getUsermeal({});if(200!==e.code)return;const t=await oA.getMembers({pageSize:1,pageIndex:1,leave:3});if(200!==t.code)return;nN.value={num1:e.data.expired?1:e.data.member_number,num2:t.data.count||0,type:1},tN.value=!0}})()}),500)},iN=async()=>{const e=await oA.getpackageinfo({});return 200===e.code&&(nN.value={num1:e.packagenumb,num2:e.u
```

## GET /v2/cost/costmanagement/getCityAgent

- Client name: `getCityAgent`
- Candidate request keys: _none parsed_

```text
default:[]},modelModifiers:{}}),emits:w(["cascaderChange"],["update:modelValue"]),setup(t,{emit:l}){const s=t,o=l,n=C("$api"),u=P(!1),r={value:"name",label:"name"},c=P([]),i=V(t,"modelValue"),d=e=>{o("cascaderChange")};return _((()=>{(async()=>{const e=await n.getCityAgent();console.log("getCityAgent",e),e&&200===e.code&&(c.value=e.data)})()})),(t,l)=>{const o=e,n=a;return k(),T("div",X,[$((k(),T("div",G,[E(o,{modelValue:i.value,"onUpdate:modelValue":l[0]||(l[0]=e=>i.value=e),placeholder:t.$t("selectArea")||"请选择地区",options:D(c),props:r,clearable:"",onChange:d,onClear:d,style:A((p=null==s?void
```

## GET /v2/cost/costmanagement/getcloudcoinsnumb

- Client name: `getcloudcoinsnumb`
- Candidate request keys: `company_id`

```text
ayLimit.length)&&!a.payLimit.includes(e),l=n,{user:d}=fL(),f=Fe(e,"modelValue"),m=s({qrcodeUrl:"",currency:""}),v=s(!1),g=s(!1),y=s(!1),b=s(0),w=s(!1),C=s(!1),S=s(!1);c(S,(e=>{l("popupActuallyShown",e),console.log("popup 是否真正出现在页面上:",e)}));const A=()=>{var e;o.getcloudcoinsnumb({company_id:null==(e=d.companyData)?void 0:e.companyId}).then((e=>{e&&200===e.code&&(b.value=e.data.balance,l("refresh",b.value||0)),w.value||(w.value=!0,l("balanceReady"))})).catch((()=>{w.value||(w.value=!0,l("balanceReady")),oS.error(window.t("serverError")||"服务端错误")})).finally((()=>{}))},E=async()=>{C.value||(C.valu
```

## GET /v2/cost/costmanagement/getOrderDetailByDetailsNo

- Client name: `getOrderDetailByDetailsNo`
- Candidate request keys: `details_no`

```text
rflow-tooltip":""},createSlots({default:withCtx((()=>[createVNode(O,{prop:"orderNo",label:"订单号","min-width":"180"},{default:withCtx((({row:t})=>[createBaseVNode("span",{link:"",class:"invoice-order-number",onClick:l=>(async t=>{if(t.orderNo)try{const l=await i.getOrderDetailByDetailsNo({details_no:t.orderNo});if(200!==(null==l?void 0:l.code))return;w.value=l.data||{},R.value=!0}catch{ElMessage.error("订单详情获取失败")}else ElMessage.error("订单标识缺失，无法获取详情")})(t)},toDisplayString(t.orderNo),9,_hoisted_14$2)])),_:1}),createVNode(O,{prop:"orderType",label:"订单类型",width:"180"},{default:withCtx((({row:t})=>[
```

## GET /v2/cost/costmanagement/getOrderDetailNew

- Client name: `getOrderDetailNew`
- Candidate request keys: `order_no`, `oid`

```text
ctArea)?void 0:t[0],B.value=null==(o=e._selectArea)?void 0:o[1],V.value=null==(n=e._selectArea)?void 0:n[2])})(h),!0)},K=Se(!1),X=async()=>{var e;const a=null==(e=c.value)?void 0:e.orderNo;if(K.value||!a)return;K.value=!0;const l=Date.now();try{const e=await d.getOrderDetailNew({order_no:a});if(200!==(null==e?void 0:e.code)||!e.data)return;const l=Number(e.data.order_status);if(3===l||6===l){return await W(a,e.data)?(G.value="",u(),(e=>{try{const a=w.get(bl),l=Array.isArray(a)?a:[];l.includes(e)||l.push(e),w.set(bl,l)}catch(a){console.log("markOrderBound_error:",a)}})(a),void aa((()=>{pe()})))
```

## GET /v2/cost/costmanagement/getorderinfo

- Client name: `getorderinfo`
- Candidate request keys: _none parsed_

```text
误",e)}))},W=()=>{y.value=!1,setTimeout((()=>{m.value=!0}),1e3)},Q=ae(!1),ee=()=>{Q.value=!0},le=e=>{i.page=e,Y()},oe=e=>{i.per_page=e,localStorage.setItem(P.SizeKey_Order,String(e)),Y()},ye=()=>{i.page=1,Y()},_e=ae([]),ve=ae([]),be=ae([]);return he((()=>{Y(),o.getorderinfo().then((e=>{var a,l,o;if(e&&200===e.code){const t=(null==(a=e.data)?void 0:a.order_type)||{};Object.keys(t).forEach((e=>{_e.value.push({name:t[e],value:e})}));const r=(null==(l=e.data)?void 0:l.pay_type)||{};Object.keys(r).forEach((e=>{ve.value.push({name:r[e],value:e})}));const n=(null==(o=e.data)?void 0:o.order_status)||{}
```

## GET /v2/cost/costmanagement/getOrderManagementNew

- Client name: `getorderlist`
- Candidate request keys: _none parsed_

```text
=d.order_type?void 0:d.order_type,order_status:""===d.order_status?void 0:d.order_status,pay_type:""===d.pay_type?void 0:d.pay_type,...i};d.pay_time&&d.pay_time.length&&(e.startCreatedAt=`${d.pay_time[0]} 00:00:00`,e.endCreatedAt=`${d.pay_time[1]} 23:59:59`),o.getorderlist({...e}).then((e=>{if(e&&200===e.code){i.total=e.data.total,n.value=e.data.data||[];const l=n.value.map((e=>String(e.user_id)));a=l,o.getMembersByIds({userIds:a}).then((e=>{e&&200===e.code&&(e.data||[]).forEach((e=>{h.value[e.userId]=e.username||""}))})).catch((e=>{console.log(e)}))}var a})).catch((()=>{w(window.t("serverErro
```

## GET /v2/cost/costmanagement/getrechargecloudcoin

- Client name: `getrechargeamount`
- Candidate request keys: _none parsed_

```text
sFinite(Number(t.cloud_coin))?Number(t.cloud_coin):Number(e||0);return pn(n+V(e))},z=h((()=>H(A.value))),Z=h((()=>pn(Number(A.value||0)+z.value))),K=e=>S.value?V(e):H(e),q=e=>mn(e),Y=s(dA.ZFB),te=s(St||At?16:0),ne=e=>{A.value=wn(e.target.value),f(B)};D((()=>{l.getrechargeamount().then((e=>{var t,n;e&&200===e.code&&(d.value=v.designCards?_n(e.data||[]):xn(e.data||[]),d.value.length&&(null==(t=d.value[0])?void 0:t.amount)&&(S.value=null==(n=d.value[0])?void 0:n.amount,f((()=>{var e;null==(e=y.value)||e.selectMaxDiscountCoupon()})),setTimeout((()=>{}),330)))})).catch((()=>{_A(window.t("serverErro
```

## GET /v2/cost/costmanagement/getrechargehistory

- Client name: `getrechargehistory`
- Candidate request keys: `uid`, `type`

```text
Id,De()):$e()},xe=()=>{pe.value="",de.value="",De()},Se=()=>{ce.value=!0;const e={uid:de.value||void 0,type:""===me.value?void 0:me.value,...he};ie.value&&ie.value.length&&(e.startCreatedAt=`${ie.value[0]} 00:00:00`,e.endCreatedAt=`${ie.value[1]} 23:59:59`),ue.getrechargehistory(e).then((e=>{var a,l;if(console.log("充值记录数据",e),e&&200===e.code){be.value=(null==(a=null==e?void 0:e.data)?void 0:a.data)||[],he.total=(null==(l=null==e?void 0:e.data)?void 0:l.total)||0;(e=>{ue.getMembersByIds({userIds:e}).then((e=>{e&&200===e.code&&(e.data||[]).forEach((e=>{Ce.value[e.userId]=e.name||""}))})).catch((
```

## GET /v2/cost/costmanagement/getRegionSupportV2

- Client name: `getRegionSupportV2`
- Candidate request keys: _none parsed_

```text
e,()=>o.pay_type,()=>o.selectedCity],(()=>{se((()=>{var e;return null==(e=w.value)?void 0:e.selectMaxDiscountCoupon()}))}),{immediate:!0}),J((async()=>{o.$reset(),await d(),await(async()=>{if(null==a?void 0:a.getRegionSupportV2)try{const{data:e,code:l}=await a.getRegionSupportV2();200===l&&Array.isArray(e)&&(q.value=e,q.value.length&&ia(q.value[0]))}catch(e){console.log("getRegionSupportV2_err_:",e)}})()}));const pa=e=>{B(L.expense_purchaseProxy_buySuccess,v.path),(async()=>{3!==s.companyStatus&&3!==s.userStatus&&Ce.value.includes("1")&&(2===s.companyStatus?n.personAuthDialogShow=!0:(n.enterpr
```

## GET /v2/cost/costmanagement/orderExportNew

- Client name: `orderexport`
- Candidate request keys: _none parsed_

```text
r_status,pay_type:""===l.queryForm.pay_type?void 0:l.queryForm.pay_type};l.queryForm.pay_time&&l.queryForm.pay_time.length&&(e.startCreatedAt=`${l.queryForm.pay_time[0]} 00:00:00`,e.endCreatedAt=`${l.queryForm.pay_time[1]} 23:59:59`),r.value=!0;const a=await o.orderexport(e);r.value=!1,a&&200===a.code&&(t.value=!1,W(a.data.url,"订单导出数据.xlsx"))};return(a,l)=>t.value?(z(),ne(g,{key:0,modelValue:t.value,"onUpdate:modelValue":l[0]||(l[0]=e=>t.value=e),width:"615px",onCancel:l[1]||(l[1]=e=>t.value=!1),onConfirm:n,"ok-loading":de(r)},{default:se((()=>{var a,o,t,r,n;return[X("div",ha,[e.queryForm.orde
```

## GET /v2/cost/costmanagement/set_meal_set

- Client name: `getsetmeal`
- Candidate request keys: `id`

```text
||"分享转移",svg:"shareTransfer",children:JA},{id:8,title:window.t("menu.logManage")||"日志管理",svg:"logManage",children:eE}]}),getters:{menuWidth:e=>e.isFold?"85px":"260px"},actions:{setFromGuide(e){this.fromGuide=e},async getGiftPackage(){var e;try{const t=await oA.getsetmeal({id:3});if(200===t.code){const n=(null==(e=t.data)?void 0:e.gift_member)||0,o=Math.max(0,n-1);this.giftPackage={...t.data,additionalMember:o}}}catch(t){_A((null==t?void 0:t.msg)||window.t("serverError")||"服务端错误","error")}}}}),lE=po("backendConfig",{state:()=>({bgConfigList:[],loginRegisterList:[],topAdList:[],topCarouselList:[
```

## GET /v2/cost/costmanagement/user_coupons_event_list

- Client name: `bindMobilePhoneCoupon`
- Candidate request keys: _none parsed_

```text
nd"],["update:modelValue"]),setup(t,{emit:c}){l(a.home_NewYear2025Dialog);const d=r("$api"),b=u(t,"modelValue"),x=v(!1),k=v(!1),_=l=>{l?localStorage.setItem("NoPhoneNumber",String(Date.now()+6048e5)):localStorage.setItem("NoPhoneNumber","1")},A=v("");m((()=>{d.bindMobilePhoneCoupon().then((l=>{var s;if(200===l.code){const e=((null==(s=null==l?void 0:l.data)?void 0:s.data)||[]).map((l=>null==l?void 0:l.coupon_name));A.value=e.join("、")}})).finally((()=>{x.value=!0}))}));const Y=c,$=()=>{Y("toBind"),b.value=!1};return(l,t)=>{const a=s,c=e;return o(),i("div",B,[h(c,{"align-center":"",modelValue:w
```

## GET /v2/cost/costmanagement/user_coupons_list

- Client name: `userCouponsList`
- Candidate request keys: `type`, `page`, `per_page`

```text
sabled)),t=h.value.filter((e=>e.disabled));e.sort(((e,t)=>Date.parse(t.created_at)-Date.parse(e.created_at))),t.sort(((e,t)=>Date.parse(t.created_at)-Date.parse(e.created_at))),h.value=[...e,...t]},S=async()=>{var e;h.value=[];const{code:t=0,data:n={}}=await o.userCouponsList({type:1,page:1,per_page:10086});if(200===t){let t=n.data;t.forEach((e=>{const{end_time:t="",created_at:n="",start_time:o="",group:r}=e||{};e.created_at=Hp(n).format("YYYY-MM-DD HH:mm:ss"),e.start_time=Hp(o).format("YYYY-MM-DD HH:mm:ss"),e.end_time=Hp(t).format("YYYY-MM-DD HH:mm:ss")})),t=t.filter((e=>a.useModule===fA.YunB
```

## GET /v2/cost/device/cart_find

- Client name: `cartFind`
- Candidate request keys: _none parsed_

```text
:()=>({startupRules:"2",dnsStatus:3,bind_proxy:0,expired_display:0,device_authorities:0,riskControl:0,kernelversion:"10134"})}),NE=po("shoppingCartAnimation",{state:()=>({shoppingCartNumber:0,isAnimating:!1,isTimer:void 0}),actions:{getShoppingCartNumber(e){oA.cartFind({}).then((t=>{var n;if(200===t.code){const o=(null==(n=t.data)?void 0:n.length)||0;e?e(o):this.shoppingCartNumber=o}}))},addToCartAnimation(){this.getShoppingCartNumber((e=>{setTimeout((()=>{this.isAnimating=!0}),500),this.isTimer&&clearTimeout(this.isTimer),this.isTimer=setTimeout((()=>{this.shoppingCartNumber=e,this.isAnimatin
```

## GET /v2/cost/device/findorder

- Client name: `findorder`
- Candidate request keys: `order_no`

```text
=s(""),z={width:240,height:240,color:{dark:"#000000",light:"#ffffff"}},Z=s("30:00"),K=()=>{let e=1800,t=0;d.value&&(clearInterval(d.value),d.value=""),d.value=setInterval((()=>{if(e<=0||!m.value)clearInterval(d.value),f("cancelOrder");else{e-=1,t<5?t+=1:(t=0,o.findorder({order_no:i.info.orderId}).then((e=>{200===e.code&&"TRADE_SUCCESS"===e.data.status&&(clearInterval(d.value),f("submitOrder",e.data.payInfoData),i.showMessage&&_A(window.t("paySuccess")||"支付成功","success"))})));const n=e%60;Z.value=`${Math.floor(e/60)}:${n<10?`0${n}`:n}`}}),1e3)};r((()=>{var e;i.info.qrcodeUrl&&(Ct||an)&&(e=i.inf
```

## GET /v2/cost/device/paypal

- Client name: `notifyPaypal`
- Candidate request keys: `orderId`

```text
?void 0:e.payType)||""]||"")+(window.t("pay")||"支付")})),f=t,m=h({get:()=>i.visible,set:e=>{f("update:visible",e)}}),v=s([{id:19,name:"POLY",pay_type_extra:19},{id:20,name:"TRX",pay_type_extra:20}]);let g=0;const y=async e=>{try{const{code:t=0,msg:n=""}=await o.notifyPaypal({orderId:e});g=0,200===t&&(_A(window.t("paySuccess"),"success"),f("submitOrder"))}catch(t){g+=1,g<5?setTimeout((()=>{y(e)}),100):(g=0,f("submitOrder"))}},b=()=>{const{orderId:e=""}=i.info||{};y(e)},w=e=>{const t=document.createElement("textarea");document.body.appendChild(t),t.style.position="absolute",t.style.clip="rect(0 0
```

## GET /v2/cost/device/repayrecharge

- Client name: `repayrecharge`
- Candidate request keys: `pay_type`, `pay_type_extra`, `order_no`

```text
",class:"table-payment",onClick:e=>(e=>{M.value=!1,console.log("订单数据",e);const a=e.pay_type||0;let t=e.pay_type_extra||0;2!==a&&3!==a||(t=0),0===e.order_type||1===e.order_type?S(e,2):3===e.order_type||4===e.order_type?R(e):[7,8].includes(e.order_type)?S(e,3):o.repayrecharge({pay_type:E[a],pay_type_extra:t,order_no:e.order_no}).then((a=>{if(200===a.code){const{amount:o,qrCode:r,pay_type:n,ext:s}=a.data;p.value={qrcodeUrl:r||"",payType:n||"overseas",payTypeExtra:t,orderId:a.data.order_id,amount:o,ext:s,currency:a.data.currency,created_at:e.created_at},setTimeout((()=>{y.value=!0}),50),setTimeout
```

## GET /v2/newbrowser/getallurilist

- Client name: `getallurilist`
- Candidate request keys: _none parsed_

```text
return ge(t).new_cloud_instances?ge(t).new_cloud_instances[e]:""}return""},getCidrBlocksInfo(e){return 1===this.sectionType&&"{}"!==JSON.stringify(this.numberSectionSelectItem)?this.numberSectionSelectItem[e]??"":""},async getAllPlatformList(){const e=await oA.getallurilist({});200===e.code&&(e.data||[]).forEach((e=>{const{father_label:t,fatherclass:n,child_label:o,childclass:r,grandson_label:a,grandsonclass:i}=e;this.platformLabel[t]=n,this.platformLabel[`${t}-${o}`]=`${r}`,this.platformLabel[`${t}-${o}-${a}`]=`${r}-${i}`}))},splitAndFilter(e){return e?e.split(",").map((e=>this.platformLabel[
```

## GET /v2/news/serviceAgreement.html

- Client name: `getServiceProtocol`
- Candidate request keys: `rettype`, `lang`

```text
90442f4-104.js";import"./prismjs-1791774738143-ba33c641-104.js";const _={class:"service_tip"},f=["innerHTML"],h=o(r({__name:"Protocol",setup(o){const r=i();a(r.path);const h=n("$api"),g=c(""),x=c(""),y=c(!1);return p((()=>{(async()=>{y.value=!0;const a=await h.getServiceProtocol({rettype:"json",lang:e()});y.value=!1,a&&200===a.code&&a.data.content&&(g.value=a.data.title,x.value=a.data.content)})()})),(a,o)=>{const e=s,i=t;return l(),m("div",_,[u(e,{height:"calc(100vh - 140px);"},{default:v((()=>[d(j("div",{innerHTML:x.value,class:"content"},null,8,f),[[i,y.value]])])),_:1})])}}}),[["__scopeId"
```

## GET /v2/news/settings/info

- Client name: `getNewsSettingsInfo`
- Candidate request keys: `key`

```text
rmissionList=e.data||[])},async getAllPermissionList(){const e=await oA.getMenus({});200===e.code&&(this.allPermissionList=e.data||[])}}}),HE=po("settingsInfo",{state:()=>({dataContact:null,dataQrCode:null}),actions:{async reqSettingsContact(){const e=await oA.getNewsSettingsInfo({key:"setting.contact"});200===e.code&&(this.dataContact=e.data)},async reqSettingsQrCode(){const e=await oA.getNewsSettingsInfo({key:"setting.qrcode"});200===e.code&&(this.dataQrCode=e.data)}}}),jE=s(!1);var zE=(e=>(e.alert="alert",e.confirm="confirm",e.prompt="prompt",e))(zE||{});const UE=s("alert"),ZE=s("提示"),WE=s(
```

## GET /v2/plugin/downloadFromWebStore

- Client name: `downloadFromWebStore`
- Candidate request keys: `url`

```text
):2===y.value&&(async()=>{let e="";try{const l=new URL(M.value.appUrl).pathname.split("/");e=M.value.appUrl.includes("google.com")?l[2]:l[4],e=decodeURIComponent(e)}catch(i){return void s.error(window.t("inputRightUrl")||"请输入正确的URL")}$.value=!0;const l=await n.downloadFromWebStore({url:M.value.appUrl},!0);$.value=!1,200===l.code?te({pluginId:a.pluginId,name:e||l.data.crx.name,file:l.data.crx.url,uuid:l.data.crx.uuid,firefoxFile:l.data.crx.firefoxUrl,pluginType:4,version:l.data.crx.Version}):s.error(window.t("serverError")||"服务端错误")})())}))},se=e=>{try{const l=new URL(e).pathname.split("/");if(
```

## GET /v2/plugin/findPluginCompanies

- Client name: `findPluginCompanies`
- Candidate request keys: `pluginId`, `pluginCompanyId`

```text
onsole.log("removeIds",e),ae(),h({pluginId:null==(i=y.pluginInfo)?void 0:i.pluginId,accountIds:s,removeIds:e}),a.success(window.t("disSuccess")||"分配成功")}else a.error(window.t("operateFail")||"操作失败");Y("confirm")},se=async()=>{var e,l;v.value=!0;const i=await p.findPluginCompanies({pluginId:null==(e=y.pluginInfo)?void 0:e.pluginId,pluginCompanyId:null==(l=y.pluginInfo)?void 0:l.pluginCompanyId});v.value=!1,200===i.code?(S.value=i.data.repluginCompanies.accountIds||[],I.value=i.data.repluginCompanies.accountIds||[]):a.error(window.t("serviceException")||"服务异常")};return x((async()=>{await(async()
```

## GET /v2/plugin/findPluginCrx

- Client name: `pluginDetail`
- Candidate request keys: `pluginId`

```text
serverError")||"服务端错误")})())}))},se=e=>{try{const l=new URL(e).pathname.split("/");if(l.length>0){const e=l[l.length-1],a=e.indexOf("_");return e.slice(a+1)}return e}catch(l){return e}};return J((()=>{(async()=>{if(!a.pluginId)return;$.value=!0;const e=await n.pluginDetail({pluginId:a.pluginId},!0);if(console.log("pluginDetail",e),$.value=!1,200===e.code){const l=e.data.repluginCrx;M.value.name=l.name,M.value.icon=l.icon,M.value.brief=l.brief,M.value.kernel=l.kernel,M.value.imgs=l.imgs||[],M.value.file=l.file,M.value.firefoxUrl=l.firefoxFile,M.value.uuid=l.uuid,M.value.card=l.card,M.value.vers
```

## GET /v2/plugin/getAddedAndGlobalplugin

- Client name: `getAddedAndGlobalplugin`
- Candidate request keys: `shopId`, `shopid`

```text
,V=We((()=>{if(d.value)return h.newBrowser_singleAdd_selectPluginGroup})),L=Se(d.value||r.value);Te(L,(e=>u("plugin",e)));const $=()=>{L.value=!L.value};return De((()=>{p.plugin.currentItem=void 0,n.requestDataType===e.OnMounted&&E(),(async()=>{const e=await c.getAddedAndGlobalplugin({shopId:i.query.shopid?i.query.shopid:void 0});if(200===e.code){const a=e.data.distributionPlugin||[],l=e.data.globalPlugin||[];A.value=a.map((e=>({name:e.name,icon:e.icon?e.icon:sd,kernel:e.kernel}))),S.value=l.map((e=>({name:e.name,icon:e.icon?e.icon:sd,kernel:e.kernel}))),console.log("展示-全局插件、单独分配插件")}})(),(d.v
```

## GET /v2/plugin/getPluginCategoryGroupCrxList

- Client name: `getPluginCategoryGroupCrxList`
- Candidate request keys: _none parsed_

```text
ue.kernel=0,Z.value.pageIndex=1,Z.value.pageSize=20,Z.value.total=0,ue(!0)},Ve=async()=>{n.value=!0;const e=await a.getPluginCrxList({orderBy:1}),l={ID:0,title:window.t("hotRecommend")||"热门推荐",crx:e.list.slice(0,20),idSelector:v[0]};p.value=[l];const i=await a.getPluginCategoryGroupCrxList();i.list.forEach(((e,l)=>{e.idSelector=v[l+1]})),p.value=se(p.value).concat(i.list),console.log(p.value,"catePluginList.value"),n.value=!1},$e=()=>{Ve()},Me=()=>{we(!0)},Ue=async()=>{f.value="home",Ve(),await(async()=>{n.value=!0;const{list:e}=await a.getPluginCategoryGroupList();if(e.length>0){const l=e.fin
```

## GET /v2/plugin/getPluginCategoryGroupList

- Client name: `getPluginCategoryGroupList`
- Candidate request keys: _none parsed_

```text
pCrxList();i.list.forEach(((e,l)=>{e.idSelector=v[l+1]})),p.value=se(p.value).concat(i.list),console.log(p.value,"catePluginList.value"),n.value=!1},$e=()=>{Ve()},Me=()=>{we(!0)},Ue=async()=>{f.value="home",Ve(),await(async()=>{n.value=!0;const{list:e}=await a.getPluginCategoryGroupList();if(e.length>0){const l=e.find((e=>1===e.type)),a=e.find((e=>2===e.type));l.list.unshift(S),l.list.forEach(((e,l)=>{e.anchorPoint=v[l]})),console.log("cate1",l),d.value=[V,l,a]}else s.error(window.t("serviceException")||"服务异常");n.value=!1})()},De=(e=void 0)=>{x.value.gitPluginGroupListFun(!1,e)},Le=(e=void 0)=
```

## GET /v2/plugin/getPluginCompaniesPersonageList

- Client name: `getPluginCompaniesPersonageList`
- Candidate request keys: `group_id`, `pageIndex`, `pageSize`, `pluginTeam`, `name`

```text
方应用商店"},{id:"1",name:window.t("ydStore")||"云登商店"},{id:"3",name:window.t("teamPlugin")||"团队插件"}]}),S=D(void 0),V=async()=>{le((async()=>{const e={group_id:S.value,...C.value,pageIndex:1,pageSize:10086,pluginTeam:3===P.activeIndex?1:2};_.value=!0;const l=await s.getPluginCompaniesPersonageList(e);x.value=[],le((()=>{l.list&&l.list.length?x.value=l.list:x.value=[]})),_.value=!1}))},$=()=>{if(2===P.activeIndex){const e=`${g.value.name}-${g.value.pluginId}`;p(d.plugin_myPlugin_allocationEnv_sure,"/pluginManage/myPlugin",e)}else if(3===P.activeIndex){const e=`${g.value.name}-${g.value.pluginId}`;p(r
```

## GET /v2/plugin/getPluginCrxLike

- Client name: `similarPluginList`
- Candidate request keys: `pluginId`

```text
0;try{const e=await r.pluginDetail({pluginId:U.value});200===e.code&&(K.value=e.data.repluginCrx,v.value=e.data.repluginCrx.imgs)}catch(e){a.error(window.t("serviceException")||"服务异常")}finally{m.value=!1}}async function J(){m.value=!0;try{const{list:e}=await r.similarPluginList({pluginId:U.value});c.value=e||[]}catch(e){a.error(window.t("serviceException")||"服务异常")}finally{m.value=!1}}const ee=()=>{d.push({path:"/pluginManage",query:{from:"pluginDetail"}})},te=()=>{Z(),J(),setTimeout((()=>{h.value=!0}),300)},ie=()=>{Z(),J(),setTimeout((()=>{G.value=!0}),300)};return u((()=>{Z(),J()})),e("/plug
```

## GET /v2/plugin/getPluginCrxList

- Client name: `getPluginCrxList`
- Candidate request keys: `onlyInstall`, `catTypeId`, `catPlatformId`, `pageIndex`, `pageSize`, `orderBy`, `name`, `kernel`

```text
ze=20,Z.value.total=0},ue=async(e=!1)=>{const l={...se(ae.value),onlyInstall:ae.value.onlyInstall?"1":"",catTypeId:ae.value.catTypeId||"",catPlatformId:ae.value.catPlatformId||"",pageIndex:Z.value.pageIndex,pageSize:Z.value.pageSize};n.value=!0;const i=await a.getPluginCrxList(l);n.value=!1,e?(g.value=i.list,y.value=0===g.value.length):(r.value=i.list,y.value=0===r.value.length),Z.value.total=i.count},re=e=>{ie(),ae.value.catTypeId=e,ae.value.catPlatformId=0,ae.value.kernel=0;const l=d.value[1].list.find((l=>l.ID===e));l&&(t.value=l),ue(),f.value="main"},pe=()=>{var e;ae.value.name="";const l=
```

## GET /v2/plugin/group/accountGroupList

- Client name: `accountGroupList`
- Candidate request keys: `accountId`

```text
w=Se(!1);let b=!1;const k=async()=>{m.value=!0,n.requestDataType!==e.Clicked||b||(w.value=!0,await Promise.any([E(),Ba(300)]),w.value=!1,b=!0)},P=()=>{m.value=!1},C={[ye.Chrome]:1,[ye.Firefox]:2},A=Se([]),S=Se([]),I=async()=>{if(!r.value)return;const e=await c.accountGroupList({accountId:i.query.shopid},!0);let a;200===e.code&&(e.data.globalPlugin.list&&e.data.globalPlugin.list[0]&&(f.value=0,a=e.data.globalPlugin.list[0]),e.data.userPlugin.list&&e.data.userPlugin.list[0]&&(f.value=1,a=e.data.userPlugin.list[0]),p.$patch((e=>{e.plugin.currentItem=a})))},D=e=>{p.$patch((a=>{a.plugin.currentItem
```

## GET /v2/plugin/group/getPluginGroupId

- Client name: `getPluginGroupId`
- Candidate request keys: `groupId`

```text
(async()=>{const e={name:void 0,pageIndex:1,pageSize:10086,pluginTeam:3===m.activeIndex?1:2};o.value=!0;const l=await u.getPluginCompaniesPersonageList(e);l.list&&l.list.length?g.value=l.list:g.value=[],o.value=!1})(),""!==m.groupId&&(async()=>{const e=await u.getPluginGroupId({groupId:m.groupId});200===e.code&&(w.value.groupName=e.data.groupInfo.groupName,w.value.remark=e.data.groupInfo.remark,v.value=e.data.groupPlugin.map((e=>e.pluginCompanyId)),g.value.forEach((e=>{v.value.includes(e.pluginCompanyId)&&(e.on=!0)})))})()})),(e,l)=>{const u=h,t=_,s=I,d=b,r=C,p=a,m=i,v=k,D=P;return X((L(),G("d
```

## GET /v2/plugin/group/gitGroupPluginList

- Client name: `gitGroupPluginList`
- Candidate request keys: `groupType`, `pageIndex`, `pageSize`

```text
eType,this.proxy.proxyData=t.data[0],this.proxy.deviceType===uE.official&&4===t.data[0].cloud_type&&(this.proxy.proxyData._selectArea=[this.proxy.overseas.zhou,this.proxy.overseas.country,this.proxy.overseas.city]))},async getPluginGroupList(){const e=await oA.gitGroupPluginList({groupType:1,pageIndex:1,pageSize:10086});200===e.code&&(this.plugin.teamPlugin=e.data.globalPlugin.list||[],this.plugin.myPlugin=e.data.userPlugin.list||[])},async getFingerOptionList(){const e={system:this.basic.system,kernel:this.basic.kernel,kernelVersion:this.basic.kernelVersion},t=await oA.getfingerlist(e);if(con
```

## GET /v2/plugin/group/gitPluginGroupList

- Client name: `gitPluginGroupList`
- Candidate request keys: _none parsed_

```text
teamPlugin")):s.warning(window.t("packagePurchaseTips"))},T=(e,l=void 0)=>{k.value=e,b("refreshPlguinList",l)},S=async(e=!1,l=void 0)=>{console.log("gitPluginGroupListFun",l);const a={pageIndex:1,sort:2,pageSize:10086,groupType:3===m.activeIndex?1:2},i=await n.gitPluginGroupList(a);i.list&&i.list.length?(w.value=i.list,w.value.unshift({groupName:window.t("allPlugins")||"所有插件",type:"all"}),l&&w.value.forEach(((e,a)=>{e.pluginGroup&&e.pluginGroup.groupId===l&&(k.value=a)})),e&&(k.value=0)):(e&&(k.value=0),w.value=[{groupName:window.t("allPlugins")||"所有插件",type:"all"}])};Y((()=>m.activeIndex),(e=
```

## GET /v2/plugin/updateTeamVisibilityJurisdiction

- Client name: `updateTeamVisibilityJurisdiction`
- Candidate request keys: `pluginId`

```text
1:2,pluginType:X.isRead3Show?void 0:3});y.value=!1,200===l.code?(P("update:isShow",!1),P("authSuccess"),a.success(window.t("authSuccess")||"授权成功")):a.error(window.t("authError")||"授权失败")};return x((()=>{F((()=>{X.isRead3Show&&(async()=>{var e,l;const a=await n.updateTeamVisibilityJurisdiction({pluginId:null==(e=X.pluginInfo)?void 0:e.pluginId});200===a.code&&1===(null==(l=a.data)?void 0:l.teamStatus)&&(Y.value=!1)})()}))})),(a,s)=>{const o=i,n=G("permission");return R(),D(l,{modelValue:H.value,"onUpdate:modelValue":s[3]||(s[3]=e=>H.value=e),title:"插件授权",width:"680px","destroy-on-close":!0,"clo
```

## GET /v2/proxy/authority/get

- Client name: `proxyAuthList`
- Candidate request keys: `proxyType`, `deviceId`

```text
thorities)return ma.warning("团队未开启代理权限控制，开启入口“设置-团队偏好-代理数据权限”");if(e){if(ee(r.proxy_platformProxy_singleAuth,a.path),![2,3].includes(e.authority))return ma.error("此代理不能授权");Rl.value=[e],(async()=>{const e={proxyType:1,deviceId:Rl.value[0].device_id},a=await Qe.proxyAuthList(e);if(200===a.code){const e=a.data.authorityList||[];yo.value=e.map((e=>e.userId))}})()}else{ee(r.proxy_platformProxy_batchAuth,a.path);const e=Oa.value.filter((e=>[2,3].includes(e.authority)));if(Oa.value.filter((e=>![2,3].includes(e.authority))).forEach((e=>{var a;null==(a=Ma.value)||a.toggleRowSelection(e,!1)})),0===e.le
```

## GET /v2/proxy/device/findDeviceDynamicProxies

- Client name: `findDeviceDynamicProxies`
- Candidate request keys: `trademark`, `proxy_type`, `page`, `per_page`, `serial`, `name`, `isBind`, `ip_place`, `userid`, `companyid`, `status`, `isCycle`

```text
4[3]}`);const t={trademark:e,proxy_type:Re.value.proxyType,page:na.value.currentPage,per_page:na.value.pageSize,serial:ea.serial,name:ea.name,isBind:Re.value.bindEnv,ip_place:l,userid:o.userData.userId,companyid:o.userData.companyId};J.value=!0;const i=await L.findDeviceDynamicProxies(t);J.value=!1,200===i.code&&(O.value=i.data.data||[],na.value.total=i.data.total||0)})("general")},ha=async()=>{var e;Re.value={platType:"",areaCascader4:[],proxyType:"",bindEnv:"",expired:0},we.value=c.All,X.value="ipinfo",await de(),null==(e=W.value)||e.resetDetectResult(),sa(),ye.value=!1,ea.serial="",ea.name=
```

## GET /v2/proxy/device/findDeviceLogs

- Client name: `findDeviceLogs`
- Candidate request keys: `device_type`, `page`, `per_page`

```text
w.t("agentInfo")||"代理信息",relation:"1",relationText:window.t("contain")||"包含"}],Ce=G(!1),Fe=G({title:"",content:"",sbmitFunc:null}),Me=G({}),Ne=G({});G();const Ue=G({}),Ye=async()=>{try{$e.value=!0;const e={...Me.value,...Ne.value},{code:a=0,data:l={}}=await Pe.findDeviceLogs({...e,device_type:"3",page:Ie.value.currentPage,per_page:Ie.value.page_size}),{total:o=0,data:t=[]}=l;t.forEach((e=>{let a=v(e.created_at).format("YYYY-MM-DD HH:mm:ss");"Invalid Date"===a&&(a="-"),e.created_at=a;const{virtual:l="",device_id:o="",proxyu:t="",proxyp:s="",device_info:n="",instance_no:c=""}=e.desc_json_ob,r=`$
```

## GET /v2/proxy/device/findDeviceLogsList

- Client name: `proxyLogs`
- Candidate request keys: _none parsed_

```text
ry{const e=c.value?{company_id:(null==(i=l.proxyRow)?void 0:i.companyid)||(null==(t=l.proxyRow)?void 0:t.company_id),device_own_id:u}:{company_id:null==(n=l.proxyRow)?void 0:n.company_id,device_id:u,page:b.value.currentPage,per_page:b.value.pageSize},a=await d.proxyLogs(e),o=(null==(r=null==a?void 0:a.data)?void 0:r.data)||(null==a?void 0:a.data)||[],p=Array.isArray(o)?o:[];if(c.value||void 0===(null==(s=null==a?void 0:a.data)?void 0:s.total)){const e=(b.value.currentPage-1)*b.value.pageSize;P.value=p.slice(e,e+b.value.pageSize),I.value=p.length}else P.value=p,I.value=a.data.total}catch(p){P.v
```

## GET /v2/proxy/device/findDeviceProxyUserSelves

- Client name: `findDeviceProxyUserSelves`
- Candidate request keys: `status`, `trademark`, `page`, `per_page`, `sortorder`, `company`, `companyid`, `userid`, `isCycle`

```text
expired,trademark:e,proxy_type:Re.value.proxyType,page:na.value.currentPage,per_page:na.value.pageSize,serial:ea.serial,name:ea.name,ip:ea.ip,isBind:Re.value.bindEnv,ip_place:l,userid:o.userData.userId,companyid:o.userData.companyId};J.value=!0;const i=await L.findDeviceProxyUserSelves(t);J.value=!1,200===i.code&&(O.value=i.data.data,na.value.total=i.data.total)})("self"),(async e=>{const a=O.value.map((e=>e.deviceid)),l=await L.getUseCountByProxyId({[e+"id"]:a});if(200===l.code){const a=l[e];a&&a.length>0&&a.forEach((e=>{const a=O.value.find((a=>e.id===a.deviceid));a&&(a.envCount=e.number)}))
```

## GET /v2/proxy/device/findReplaceProxyLogs

- Client name: `findReplaceProxyLogs`
- Candidate request keys: `device_id`, `page`, `per_page`

```text
options:[{value:"NET_001",label:"网络延迟高 / 浏览卡顿严重"},{value:"NET_002",label:"代理连接失败 / 频繁掉线"},{value:"NET_003",label:"打开网页速度过慢，影响效率"}]}],H=async()=>{if(g.value||b.value)return;const e=o.proxyData.device_id||o.proxyData.deviceid;if(e){g.value=!0;try{const a=await c.findReplaceProxyLogs({device_id:e,page:x.value,per_page:10});if(200!==a.code)return;const l=a.data||{},t=l.data||[];h.value.push(...t),w.value=Number(l.total)||0,x.value=(Number(l.current_page)||x.value)+1,b.value=t.length<10||w.value>0&&h.value.length>=w.value}catch(a){u.error(window.t("serviceException")||"服务异常")}finally{g.value=!1}}},
```

## GET /v2/proxy/device/findTags

- Client name: `findTags`
- Candidate request keys: `company`, `companyid`, `userid`, `page`, `per_page`, `keyword`

```text
am={...this.pTeam,...e}},setSecure(e){this.pSecure={...this.pSecure,...e}},setPay(e){this.pPay={...this.pPay,...e}},setUiControl(e){this.pUiControl={...this.pUiControl,...e}}}}),uA=po("tag",{state:()=>({tagList:[]}),actions:{async reqTagList(){const e=await oA.findTags({company:J7().companyData.name,companyid:J7().companyData.companyId,userid:J7().companyData.userId});200===e.code&&(this.tagList=e.data.data||[])},mapTagIds(e){if(!e)return[];return this.tagList.filter((t=>t.name.includes(e))).map((e=>e.labelid))}}});var dA=(e=>(e.YUE="yue",e.WX="wx",e.ZFB="zfb",e.OVERSEAS="overseas",e))(dA||{})
```

## GET /v2/proxy/device/getCloudBrowserProducts

- Client name: `getCloudBrowserProducts`
- Candidate request keys: `cityCode`, `headless`

```text
e)?void 0:e.length)){const e=g.value[1],a=g.value[2];if("中国"===e&&!["香港","澳门","台湾"].includes(a))return!0}return!1})),x=e=>{w(),p("headlessChange",e)},w=async()=>{let e="";i.yunService.area&&3===i.yunService.area.length&&(e=i.yunService.area[2]);const a=await o.getCloudBrowserProducts({cityCode:e,headless:i.yunService.headless});if(200===a.code){const e=a.data||[];0===e.length?(i.payInfo.products=[],i.payInfo.selectProduct=null):(i.payInfo.products=e,i.payInfo.selectProduct=e[0])}},b=Se([]),k=e=>{e&&e.length>0&&(C.value=!1),(e=>{e&&e.length||(g.value=["","",""]);const a=e[0],l=e[1],t=e[2],o=b.v
```

## GET /v2/proxy/device/getCloudBrowserSupport

- Client name: `getCloudBrowserSupport`
- Candidate request keys: _none parsed_

```text
a=e[0],l=e[1],t=e[2],o=b.value.find((e=>e.code===a));if(o){const e=o.children.find((e=>e.code===l));if(e){const a=e.children.find((e=>e.code===t));a&&(g.value=[o.name,e.name,a.name])}}})(e),w(),aa((()=>{p("areaChange",e,g.value)}))},P=async()=>{const e=await o.getCloudBrowserSupport();200===e.code&&(b.value=e.data||[],(()=>{var e,a,l,t,o;if((null==(e=b.value)?void 0:e.length)>0){const e=b.value[0];if((null==(a=e.children)?void 0:a.length)>0){const a=null==(l=e.children)?void 0:l[0];if((null==(t=a.children)?void 0:t.length)>0){const l=null==(o=a.children)?void 0:o[0];h.value=[e.code,a.code,l.co
```

## GET /v2/proxy/device/vcnplist

- Client name: `getPlatformProxyList`
- Candidate request keys: `page`, `per_page`, `cloud_type`, `is_enable`, `serial`, `device_name`, `publicip`, `isBind`, `ip_place`, `userid`, `companyid`, `status`

```text
4);const t={page:na.value.currentPage,per_page:na.value.pageSize,cloud_type:l,is_enable:1,serial:ea.serial,device_name:ea.name,publicip:ea.ip,isBind:Re.value.bindEnv,ip_place:a,userid:o.userData.userId,companyid:o.userData.companyId};J.value=!0;const i=await L.getPlatformProxyList(t);J.value=!1,200===i.code&&(O.value=i.data.data||[],na.value.total=i.data.total)})(),(async()=>{const e=O.value.map((e=>e.device_id)),a=await L.getUseCountByProxyId({deviceid:e});if(200===a.code){const e=a.device;e&&e.length>0&&e.forEach((e=>{const a=O.value.find((a=>e.id===a.device_id));a&&(a.envCount=e.number)}))}
```

## GET /v2/proxy/device/vcnpsummary

- Client name: `getPlatformProxySummary`
- Candidate request keys: _none parsed_

```text
Error")||"服务端错误","error")})),d.getGiftPackage(),g.getpackageinfo({}).then((e=>{Y.value=(null==e?void 0:e.usednumb)||0})),g.getMembers({pageSize:1,pageIndex:1,leave:3}).then((e=>{200===e.code&&(X.value=Math.max(0,(e.data.count||0)-1))})),a.getcloudcoinsnumb(),g.getPlatformProxySummary().then((e=>{var t;200===e.code&&(te.value=(null==(t=e.data)?void 0:t.all)||0)})).catch((()=>{_A(window.t("serverError")||"服务端错误","error")}))};je((()=>{ne()}));const ae=s(!1),ie=s(1),le=()=>{eL(LP.home_userCenter_rechargeYunCoin_sure,n.path)},se=s(!1),ce=s({companyId:"",name:"",shortName:"",onwer:"",status:0,lockSt
```

## GET /v2/retail/checkPromotionCode

- Client name: `checkPromotionCode`
- Candidate request keys: `code`

```text
Name:"",jumpUrl:u[0].url}),p=/^[0-9a-zA-Z]{6,15}$/,A=G({customContent:[{required:!0,message:"推广链接不能为空",trigger:"blur"},{pattern:p,message:"自定义内容必须为数字或字母，6-15位",trigger:"blur"},{validator:async(e,a,t)=>{const s=(a||"").trim();if(s&&p.test(s))try{const e=await l.checkPromotionCode({code:s},!0);if(200===e.code&&e.data&&!e.data.available)return void t(new Error(e.data.reason||"该邀请码已被使用"));t()}catch(n){t()}else t()},trigger:"blur"}]}),m=async()=>{var e;if(i.value)return;o.value=!0;const a=await(null==(e=d.value)?void 0:e.validate().catch((()=>!1)));o.value=!1,a&&t("submit-form",{...v,linkName:v.lin
```

## GET /v2/retail/findRetailSettleConfig

- Client name: `commissionsConfigInfo`
- Candidate request keys: _none parsed_

```text
)})).code&&(d.success(window.t("applyforSucess")||"申请成功"),p("close"))}catch(t){d.error(window.t("serverErrorTimely")||"Error:服务端错误，请联系管理员及时处理。")}P.value=!1},L=Z((()=>!K&&!H));return B((()=>A.mode),(e=>{3===e&&z()})),F((()=>{(async()=>{try{const{data:e}=await n.commissionsConfigInfo();m.value=e.reretailSettleConfig.minWithdrawalAmount}catch(e){d.error(window.t("serverErrorTimely")||"Error:服务端错误，请联系管理员及时处理。")}})(),3===A.mode&&z()})),(e,l)=>{const t=a,n=c,o=v,d=s;return h(),C("div",Je,[k("div",$e,[k("span",_e,[V(t,{effect:"light",placement:"top","popper-class":"withdrawal-desc-popper"},{content:j
```

## GET /v2/retail/findRetailUserInviteCode

- Client name: `promoInfo`
- Candidate request keys: _none parsed_

```text
>!e.isDefault)).map((e=>({id:e.ID,customContent:e.customContent,linkName:e.linkName||e.invitationCode,link:p(e.invitationCode),code:e.invitationCode})))}catch(t){d.error(window.t("serverErrorTimely")||"服务端错误，请联系管理员及时处理")}},m=async()=>{try{const{data:e}=await l.promoInfo(),a=e.userInvite;Object.entries(a).forEach((([e,l])=>{null!==a[e]&&(a[e]=l.toString())})),t.value=e.userInvite,s.value=p(e.userInvite.invitationCode),n.value=e.userInvite.invitationCode}catch(e){d.error(window.t("serverErrorTimely")||"服务端错误，请联系管理员及时处理")}},f=X(!1),P=()=>{m(),f.value=!f.value},w=X(!1),g=()=>{w.value=!w.value},y=X
```

## GET /v2/retail/frozenList

- Client name: `getPromoFrozenList`
- Candidate request keys: _none parsed_

```text
={pageIndex:n.pageIndex,pageSize:n.pageSize,companyName:s.companyName,startFreezeUntil:(null==(e=s.unfreezeTime)?void 0:e[0])||"",endFreezeUntil:(null==(o=s.unfreezeTime)?void 0:o[1])||""};"0"!==s.settleType&&(t.rebateType=Number(s.settleType));const i=await a.getPromoFrozenList(t);if(i.code&&200!==i.code)return;const r=i.data||i;l.value=r.list||[],n.total=r.count||0}catch(i){d.error(window.t("serverErrorTimely")||"服务端错误，请联系管理员及时处理")}finally{t.value=!1}},g=e=>{n.pageIndex=e,w()},y=e=>{n.pageSize=e,w()},b=()=>{s.companyName="",s.settleType="0",s.unfreezeTime=[]};return F((()=>{w()})),(e,a)=>{co
```

## GET /v2/retail/getPromotionLinkList

- Client name: `getPromotionLinkList`
- Candidate request keys: _none parsed_

```text
,kt=l(Y({__name:"extend",setup(a){const l=E("$api"),t=X(),s=X(""),n=X(""),o=X(!1),i=X(""),r=X(!1),u=X(10),c=X([]),v=Z((()=>c.value.length>=u.value)),p=e=>{const a=K||H?`&lang=${ae()}`:"";return`https://${_}/?c=${e}${a}`},A=async()=>{var e,a;try{const t=await l.getPromotionLinkList();if(200!==t.code)return;const s=(null==(e=t.data)?void 0:e.list)||[];u.value=(null==(a=t.data)?void 0:a.maxCustomCount)||10,c.value=s.filter((e=>!e.isDefault)).map((e=>({id:e.ID,customContent:e.customContent,linkName:e.linkName||e.invitationCode,link:p(e.invitationCode),code:e.invitationCode})))}catch(t){d.error(win
```

## GET /v2/retail/getRetailWithdrawLogList

- Client name: `getPromoWithdrawals`
- Candidate request keys: _none parsed_

```text
{pageIndex:t.pageIndex,pageSize:t.pageSize,mode:l.mode,status:l.status,startCreatedAt:l.created_at[0]?m(l.created_at[0]).format("YYYY-MM-DD HH:mm:ss"):"",endCreatedAt:l.created_at[1]?`${m(l.created_at[1]).format("YYYY-MM-DD")} 23:59:59`:""};try{const l=await a.getPromoWithdrawals(e);s.value=l.list,t.total=l.count}catch(o){d.error(window.t("serverErrorTimely")||"Error:服务端错误，请联系管理员及时处理。")}n.value=!1},i=e=>{t.pageIndex=e,o()},c=e=>{t.pageSize=e,o()},v=()=>{l.mode="0",l.status="0",l.created_at=[],o()};return F((()=>{o()})),(e,a)=>{const d=P;return h(),C("div",yl,[k("div",bl,[k("div",hl,[k("div",Cl
```

## GET /v2/retail/getUserCompanyInviteList

- Client name: `getPromoUser`
- Candidate request keys: `pageIndex`, `pageSize`, `companyName`, `status`, `startCreatedAt`, `endCreatedAt`

```text
paging-box"},Ga=l(Y({__name:"InviteUserDetails",emits:["viewDetailsinfo"],setup(e,{emit:a}){const l=E("$api"),t=a,s=G({pageIndex:1,total:0,pageSize:10}),n=X([]),o=G({companyName:null,status:"0",created_at:[]}),i=X(!0),v=async()=>{i.value=!0;try{const e=await l.getPromoUser({pageIndex:s.pageIndex,pageSize:s.pageSize,companyName:o.companyName,status:o.status,startCreatedAt:o.created_at[0]?`${o.created_at[0]} 00:00:00`:"",endCreatedAt:o.created_at[1]?`${o.created_at[1]} 23:59:59`:""});s.total=e.count,n.value=e.list}catch(e){d.error(window.t("serverErrorTimely")||"Error:服务端错误，请联系管理员及时处理。")}i.value
```

## GET /v2/rpa/findRpaCarbonConfig

- Client name: `findRpaCarbonConfig`
- Candidate request keys: `configId`

```text
ing:a.editLoading,onClick:e=>(async e=>{const{planId:a}=e,t={planId:a};e.editLoading=!0;const{code:n=0,data:l={}}=await xe.findRpaPlanManagement(t);if(e.editLoading=!1,200===n){const a=l.rerpaCarbonConfig||{},{configId:t=""}=a;e.editLoading=!0;const n=await xe.findRpaCarbonConfig({configId:t});if(e.editLoading=!1,200===n.code){const{rerpaCarbonConfig:e={}}=n.data;Ce.value={...a,rerpaCarbonConfig:e},Te.value=!0}}h(f.rpa_planManage_edit,z.path)})(a)},{default:J((()=>[te(ne(e.$t("edit")),1)])),_:2},1032,["loading","onClick"])),[[g,G(i).RPA_Start]]),ae((W(),Z(n,{class:"sub-button",onClick:e=>(e=>{
```

## GET /v2/rpa/findRpaPlanManagement

- Client name: `findRpaPlanManagement`
- Candidate request keys: `planId`

```text
ESH_SHOPS),Mt.emit(It.CLOSE_SHOPS,e))}}async onRespRPAPlan(e){var t;console.log("onRespRPAPlan",e);const{opType:n="",rpaPlanId:o=[]}=e;if(0===o.length)return;const r=o[0];if(n===u8.RPA_PLAN_OP_TYPE_RUN){const e={planId:r},{code:n=0,msg:o="",data:a={}}=await oA.findRpaPlanManagement(e),{rerpaCarbonConfig:i}=a;if(200===n&&i){this.rpaStore.runTask(JSON.stringify(i));const e=(null==(t=null==i?void 0:i.account)?void 0:t.map((e=>e.shopid)))||[];Az(e)}}else n===u8.RPA_PLAN_OP_TYPE_CREATE?(this.rpaStore.addPlanTask(),this.emitRefreshRpaPlanList()):n===u8.RPA_PLAN_OP_TYPE_UPDATE?(this.rpaStore.putPlanT
```

## GET /v2/rpa/findRpaShop

- Client name: `findRpaShop`
- Candidate request keys: `shopId`

```text
===(null==(a=G.value)?void 0:a.length)}catch(e){r.error(window.t("serviceException")||"服务异常")}},Q=a=>{E.shopGroupId=a,U();const e=O.value.find((e=>e.ID===a));u(p.rpa_templateMarket_templateClassify,t.path,null==e?void 0:e.name)},X=async a=>{try{const e=await s.findRpaShop({shopId:a.shopId});200===e.code?w(e.data.resRpaShop):r.error(window.t("obtainError")||"获取失败")}catch(e){r.error(window.t("serviceException")||"服务异常")}b(!0),u(p.rpa_templateMarket_view,t.path,a.rpaName)},J=async()=>{var a,s;e.push({path:"/taskflow",query:{mid:null==(a=D.value)?void 0:a.shopId}}),b(!1),u(p.rpa_templateMarket_vie
```

## GET /v2/rpa/getRpaCarbonConfigList

- Client name: `getRpaCarbonConfigList`
- Candidate request keys: `groupId`, `rpaName`, `pageIndex`, `pageSize`

```text
askflow"})},M=F([]),D=F([]),L=e=>{const a=t.groupList.find((a=>a.groupId===e&&""!==a.groupId));return a?a.name:window.t("noGroup")||"未分组"},z=()=>{const e={groupId:t.groupId,rpaName:t.rpaName,pageIndex:d.value.currentPage,pageSize:d.value.pageSize};h.value=!0,v.getRpaCarbonConfigList(e).then((e=>{e.list&&(d.value.total=e.count,M.value=e.list.map((e=>({...e,checked:!1})))),h.value=!1,y.value=!1,E.value=!1})).catch((e=>{console.log(e),h.value=!1,y.value=!1}))},U=e=>{d.value.currentPage=e,z()},j=e=>{d.value.pageSize=e,localStorage.setItem(x.SizeKey_TaskTemplate,String(e)),d.value.currentPage=1,z()
```

## GET /v2/rpa/getRpaGroupList

- Client name: `getRpaGroupList`
- Candidate request keys: `pageIndex`, `pageSize`, `name`

```text
e=>{s("update:isShow",e)}}),w=F(""),y=F(""),x=F(1),_=F(10),I=F(0),k=F([{companyId:"",groupId:"-1",name:window.t("noGroup")||"未分组",userId:""}]),S=F([]),b=F(),C=F(""),T=F(""),V=()=>{const e={pageIndex:x.value,pageSize:_.value,name:y.value};g.value||(g.value=!0,i.getRpaGroupList(e).then((e=>{var a,l;e.list&&(I.value=e.count,1===x.value?k.value=[{companyId:(null==(a=e.list[0])?void 0:a.companyId)||"",groupId:"-1",name:window.t("noGroup")||"未分组",userId:(null==(l=e.list[0])?void 0:l.userId)||""}].concat(e.list):k.value=e.list,c.value.setScrollTop(0)),g.value=!1})).catch((e=>{g.value=!1,console.log(e
```

## GET /v2/rpa/getRpaPlanManagementList

- Client name: `getRpaPlanManagementList`
- Candidate request keys: `configId`, `rdeviceId`

```text
ow",e)}}),v=()=>{r("sure"),p.value=!1};return K((()=>u.isShow),(async e=>{if(e){c.value=window.t("noteDeleteRecoverable")||"注意：删除后可在30天内去“回收站”恢复，确认删除吗？";const{configId:e=""}=u.currentDeleteRpa,a={configId:e,rdeviceId:d.getDeviceId},{code:l=0,list:t=[]}=await i.getRpaPlanManagementList(a);200===l&&t.length>0&&(c.value=window.t("taskFlowInSchedule")||"这个任务流程正在任务计划里，确认是否删除？")}})),(e,a)=>{const l=o,i=s,u=n;return H(),q(we,{isShow:p.value,"onUpdate:isShow":a[1]||(a[1]=e=>p.value=e),width:"653px",divider:!0,title:e.$t("setting")},{title:B((()=>[O("div",Ne,[O("span",Pe,X(e.$t("deleteRPATaskFlow")),1)
```

## GET /v2/rpa/getRpaShopGroupList

- Client name: `getRpaShopGroupList`
- Candidate request keys: _none parsed_

```text
pId}}),b(!1),u(p.rpa_templateMarket_view_getItNow,t.path,null==(s=D.value)?void 0:s.rpaName)},Z=a=>{E.pageIndex=a,U()},aa=a=>{E.pageSize=a,localStorage.setItem(o.SizeKey_TemplateMarket,String(a)),E.pageIndex=1,U()};return F((()=>{U(),(async()=>{const a=await s.getRpaShopGroupList();O.value=[...O.value,...a.list]})()})),(a,e)=>{const t=d;return f(),h("div",_a,[C(W,{tabs:O.value,"rpa-count":q.value,onChange:Q},null,8,["tabs","rpa-count"]),B.value?(f(),h("div",{key:0,class:y(["empty-container",{tabLineFeed:V.value}])},[C(n)],2)):P((f(),j(ma,{key:1,"is-tab-line-feed":V.value},{default:S((()=>[(f(!
```

## GET /v2/rpa/getRpaShopList

- Client name: `getRpaShopList`
- Candidate request keys: _none parsed_

```text
!0});const E=T({pageIndex:1,pageSize:Number(localStorage.getItem(o.SizeKey_TemplateMarket))||50,rpaName:"",orderByField:"",shopGroupId:0}),G=g(),q=g(),A=g(!1);g(!1);const O=g([{ID:0,name:window.t("all")||"全部"}]),U=async()=>{var a;try{A.value=!0;const e=await s.getRpaShopList(E);A.value=!1,G.value=e.list||[],q.value=e.count,B.value=0===(null==(a=G.value)?void 0:a.length)}catch(e){r.error(window.t("serviceException")||"服务异常")}},Q=a=>{E.shopGroupId=a,U();const e=O.value.find((e=>e.ID===a));u(p.rpa_templateMarket_templateClassify,t.path,null==e?void 0:e.name)},X=async a=>{try{const e=await s.findR
```

## GET /v2/rpa/getRpaTaskLog

- Client name: `getRpaTaskLogDetail`
- Candidate request keys: `id`

```text
>{const e=[],t=a=>{Array.isArray(a)&&a.forEach((a=>{var s;"error_ws"===a.type&&(a.task={config:{}}),e.push(a),(null==(s=a.logExt)?void 0:s.length)>0&&t(a.logExt)}))};return t(a),e||[]},qs=A(),Ns=async a=>{if(Vs()){const{id:e=""}=a,{code:t=0,data:s={}}=await Cs.getRpaTaskLogDetail({id:e});if(200===t){const{rerpaTaskLog:a={}}=s;a.logExt.sort(((a,e)=>a.sn-e.sn)),a.logExt=Os(a.logExt),qs.value=a,js.value=!0}}else{const e=JSON.parse(JSON.stringify(a));e.logExt=Os(e.logExt),console.log(e,"原始数据22"),qs.value=e,js.value=!0}c(p.rpa_taskLog_viewDetail,h.path)},Us=async()=>{if(Vs()){Is.value=!0;const{code
```

## GET /v2/rpa/getRpaTaskLogList

- Client name: `getRpaTaskLogList`
- Candidate request keys: `status`, `pageIndex`, `pageSize`

```text
a.logExt),qs.value=a,js.value=!0}}else{const e=JSON.parse(JSON.stringify(a));e.logExt=Os(e.logExt),console.log(e,"原始数据22"),qs.value=e,js.value=!0}c(p.rpa_taskLog_viewDetail,h.path)},Us=async()=>{if(Vs()){Is.value=!0;const{code:a=0,count:e=0,list:t=[]}=await Cs.getRpaTaskLogList({status:Ds.value,pageIndex:Hs.value.currentPage,pageSize:Hs.value.pageSize});Is.value=!1,200===a?(Hs.value.total=e,Ms.value=t):m("获取任务列表异常","error")}else Es.getTaskLogList(JSON.stringify({type:Ds.value,pageIndex:Hs.value.currentPage,pageSize:Hs.value.pageSize}))},Bs=a=>{Hs.value.currentPage=a,Us()},Ys=a=>{Hs.value.pageS
```

## GET /v2/rpa/recycleRpaCarbonConfig

- Client name: `recycleRpaCarbonConfig`
- Candidate request keys: `rpaName`, `pageIndex`, `pageSize`

```text
ecycle))||20}),ie=[{value:"username",label:window.t("nameC")||"名称",relation:"1",relationText:window.t("contain")||"包含"}],ue=x(!1),pe=x({title:"",content:"",sbmitFunc:null}),de=async()=>{try{te.value=!0;const{code:e=0,count:a=0,list:t=[],pageIndex:l=0}=await ae.recycleRpaCarbonConfig({rpaName:le.value,pageIndex:ce.value.currentPage,pageSize:ce.value.page_size});re.value=t,ce.value.total=a}finally{te.value=!1}},ve=x(!1),me=()=>{ve.value=!0,setTimeout((()=>{ve.value=!1}),700),de()},ge=()=>{if(!t(l.Recycle_Recover))return I.warning(window.t("noPermissionMsg",{msg:i(l.Recycle_Recover)}));0!==re.val
```

## GET /v2/sso/getNewbieStep

- Client name: `getNewbieStep`
- Candidate request keys: `userId`

```text
重新检测",dialogWidth:"600px"},(async(e,t,n)=>{WE.value="正在检测中...",ZE.value="网络环境",c(),t.value=!0}),(async(e,t,n)=>{a.value=!0,n.value=!1}))};return{officialDeviceCheck:i,getCoreLinkData:async()=>{try{const e={userId:n.userData.userId},{code:o=0,data:r={}}=await t.getNewbieStep(e);if(r.data&&(r.data=JSON.parse(r.data)),200!==o)return;T7.value=r}catch(e){console.log("error",e)}},coreLinkData:T7,initCoreLink:async t=>{var a,s,d,p,h,m,v,g;if(t&&(console.log("options",t),T7.value={...t,clientGreateProxyOk:!0},u(),await((e=500)=>new Promise((t=>{setTimeout((()=>{t()}),e)})))()),On&&(null==(a=T7.value)?
```

## GET /v2/team/authentication/check

- Client name: `authenticationCheck`
- Candidate request keys: _none parsed_

```text
"请输入真实姓名",trigger:"blur"}],noID:[{required:!0,message:window.t("inputCardId")||"请输入身份证号",trigger:"blur"},{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:window.t("inputCorrectCardId")||"请输入正确的身份证号",trigger:"blur"}]}),v=j({name:"",noID:""}),g=()=>{d.authenticationCheck({},!0).then((e=>{const{data:t,code:o}=e;if(200===o){3===((null==t?void 0:t.userStatus)||0)&&(n.userStatus=3,p.value=3,clearTimeout(i.value),"function"==typeof r&&r())}else p.value=4})),i.value=setTimeout((()=>{g()}),3e3)},y=async()=>{o.personAuthDialogShow=!1,o.enterpriseAuthDialogShow=!1,await f(),o.enterpriseAuthDia
```

## GET /v2/team/authentication/companyFourElementsFaceCheck

- Client name: `companyFourElementsFaceCheck`
- Candidate request keys: _none parsed_

```text
])$|^([1-9]\d{7}(?:(0\d)|(1[0-2]))(?:(?:[0-2]\d)|3[0-1])\d{3})$/,message:window.t("inputCorrectCardId")||"请输入正确的身份证号",trigger:"blur"}]}),y=j({epCertName:"",epCertNo:"",legalPersonCertName:"",legalPersonCertNo:"",name:"",noID:""}),b=()=>{clearTimeout(a.value),m.companyFourElementsFaceCheck({},!0).then((e=>{console.log("认证状态",e);const{data:t,code:r}=e;if(200===r){3===((null==t?void 0:t.userStatus)||0)&&(n.companyData.status=2,n.companyStatus=3,v.value=3,"function"==typeof o&&o(),clearTimeout(a.value))}else v.value=4})),a.value=setTimeout((()=>{b()}),3e3)},w=s(),C=s(""),S=s("周浦君"),A={width:200,he
```

## GET /v2/team/authentication/companyFourElementsQRCode

- Client name: `companyFourElementsQRCode`
- Candidate request keys: _none parsed_

```text
anyStatus=3,v.value=3,"function"==typeof o&&o(),clearTimeout(a.value))}else v.value=4})),a.value=setTimeout((()=>{b()}),3e3)},w=s(),C=s(""),S=s("周浦君"),A={width:200,height:200,color:{dark:"#000000",light:"#ffffff"}},E=async()=>{const{code:e=0,data:t={}}=await m.companyFourElementsQRCode();200===e?(C.value="",S.value=t.username,v.value=2,w$(t.url,A,((e,t)=>{if(e)return l.value=!1,_A(window.t("operateFail")||"操作失败","error"),void console.error(e);C.value=t,l.value=!1,b()}))):l.value=!1};c((()=>v.value),(()=>{n.getUserAuthStatus()})),c(d,(e=>{!e||4!==u.companyStatus&&6!==u.companyStatus||R(2)}),{im
```

## GET /v2/team/authentication/get

- Client name: `authenticationGet`
- Candidate request keys: _none parsed_

```text
;if(200===e.code){let t=e.data.environment_number;this.validEnvNum=t}},async getCanOpenEnvList(){const e=await oA.getLatestOpenAccountId({num:this.validEnvNum});200===e.code&&(this.validEnvList=e.data.accountIds||[])},async getUserAuthStatus(){const e=await oA.authenticationGet({});200===e.code&&(this.userStatus=e.data.userStatus,this.companyStatus=e.data.companyStatus)},async registerUser(){var e;const{default:t}=await ko((()=>Promise.resolve().then((()=>hL))),void 0),n=await Promise.all([oA.userInfo({}),oA.curCompanyInfo({})]),o=await oA.myUserinfo({}),r=n[0],a=n[1];if(200===(null==r?void 0:
```

## GET /v2/team/plugin/newestPlugins

- Client name: `newestPlugins`
- Candidate request keys: _none parsed_

```text
/localhost:${localStorage.getItem("appPort")||""}/api/v1/plugins/list_buildins`;try{const o=await fetch(e);return o.ok?Promise.resolve(o.json()):Promise.reject(o.status)}catch(o){return Promise.reject(o)}})();if(0===e.code){const o=e.data.plugins||[],t=await d.newestPlugins({});if(200===t.code){const e=t.data||[];Kt(o,e)}}}catch(e){console.log("获取本地插件失败")}};function Vt(e,o,t=!1,r){let n=null,a=!1;const s=function(...s){return new Promise(((i,l)=>{if(n&&clearTimeout(n),t&&!a){const o=e.apply(this,s);r&&r(o),i(o),a=!0}else n=setTimeout((()=>{const o=e.apply(this,s);r&&r(o),i(o),a=!1,n=null}),o)}
```

## POST /api/v1/client/query_feature_support

- Client name: `queryFeatureSupport`
- Candidate request keys: _none parsed_

```text
ch(e,n);if(!t.ok)throw new Error(`${t.statusText}: ${t.status}`);const o=await t.text(),r=o7(o);return r&&0===r.code?localStorage.setItem(t7,r.data):localStorage.removeItem(t7),r}catch(o){return localStorage.removeItem(t7),o}})(),(async()=>{try{const e=await H.queryFeatureSupport();if(e&&0===e.code){const t=e.data||[];ie(t)}else localStorage.removeItem("ClientFeatures")}catch(e){localStorage.removeItem("ClientFeatures"),console.log("queryFeaturesSupported_error_:",e)}})(),(async()=>{(localStorage.getItem("Authorization")||"").length<64||(xe(),ke())})(),(async()=>{const e=await oA.getEnvSetting
```

## POST /api/v1/settings/download_snapshot

- Client name: `downloadSnapshot`
- Candidate request keys: `fileName`, `accountId`, `isFirefox`, `token`, `fileUrl`, `companyId`, `cdk`

```text
mText"),trigger:"click",onConfirm:e=>(async e=>{try{Qe.value=e;const{filename:a,account_id:t}=e,l={fileName:a,accountId:t,isFirefox:!1,token:Q(),fileUrl:e.file_url,companyId:k.editRowInfo.company_id,cdk:k.editRowInfo.cdk};e.loading=!0,Me.value=!0;let o=await N.downloadSnapshot(l);o&&0===o.code?h.success(window.t("recoverSuccess")):h.error(window.t("recoverFail")),e.loading=!1,Me.value=!1,Qe.value=void 0}catch(a){console.log("restoreCloudCache_error_:",a),e.loading=!1,Me.value=!1,Qe.value=void 0,h.error(window.t("serverError"))}})(a)},{reference:I((()=>[F((x(),S(D(e),{link:"",type:"primary",dis
```

## POST /api/v1/settings/fetch_base_url

- Client name: `fetchBaseUrl`
- Candidate request keys: _none parsed_

```text
name:"线路3",speed:"",id:3,url:"https://capi.yunlogin.com"}]),n=async()=>{const e=performance.now();let t;await o.getSettings({}),t=performance.now()-e;const a=l.value.find((e=>e.id===s.value));a&&(a.speed=t.toFixed(2))};return L((()=>{(async()=>{const e=await a.fetchBaseUrl();if(e&&0===e.code){const t=e.data;localStorage.setItem("baseUrl",t);const o=l.value.filter((e=>e.url===t.toString()));console.log("getBaseUrl_urlItem:",o),o.length&&(s.value=o[0].id,n())}})()})),(e,o)=>{const n=p;return T(),A("div",null,[o[1]||(o[1]=$("h2",null,"线路设置",-1)),$("div",Ee,[$("ul",Ve,[(T(!0),A(Z,null,Q(l.value,((
```

## POST /api/v1/settings/fetch_caches_info

- Client name: `cacheInfo`
- Candidate request keys: `accountId`, `isFirefox`

```text
.editRowInfo.kernel){case"Chrome":return y.Chrome+k.editRowInfo.kernelVersion;case"Firefox":return y.Firefox+k.editRowInfo.kernelVersion;default:return""}},Ze=async()=>{te.value=!0,Ee=[];const e={accountId:k.editRowInfo.shopid,isFirefox:!1};try{const t=await N.cacheInfo(e);t&&0===t.code&&(Ee=t.data||[],a=Ee,Re.value.forEach((e=>{e.size=0,e.timestamp=0})),a.forEach((e=>{for(let a=0;a<Re.value.length;a++)if(e.fileName===Re.value[a].fileName){const{size:t,timestamp:l}=e;Re.value[a].size=t,Re.value[a].timestamp=l}}))),te.value=!1}catch(t){console.log("getCacheInfo_error_:",t),te.value=!1}var a},ea
```

## POST /api/v1/settings/fetch_snapshot_info

- Client name: `snapshotInfo`
- Candidate request keys: `accountId`, `isFirefox`

```text
os-1791774737819-8926ffff-104.js";import"./decimal.js-1791774737827-a90442f4-104.js";import"./prismjs-1791774738143-ba33c641-104.js";function le(){const a=U("$api"),l=U("$capi");return{handleUploadCache:async t=>{const s=await(async e=>{try{const a=e.map((e=>l.snapshotInfo({accountId:e.shopid,isFirefox:!1}))),t=await Promise.all(a),s=[];return t.forEach(((a,l)=>{a&&0===a.code&&a.data&&a.data.length&&s.push({env:e[l],snapshots:a.data})})),s}catch(a){return console.log("getSnapshotByList_err_:",a),[]}})(t);(t=>{try{t.forEach((async t=>{const[s]=t.snapshots.slice(-1),o=await a.getCloudCacheList({
```

## POST /api/v1/settings/remove_caches

- Client name: `removeCache`
- Candidate request keys: `accountId`, `fileName`

```text
t("done",{index:e.index,result:o||!0})})).catch((o=>{this.emit("done",{index:e.index,result:o})})):alert("任务被中断")}shutdown(){this.running=-1,this.resetData()}}const Wr=async(e,o)=>{if(!e)return;const{hasCachePersistenceFeature:t}=i();if(t())try{const t=await b.removeCache({accountId:e,fileName:o});t&&0===t.code&&console.log("removeCache_res_:",e,o,t)}catch(r){console.log("removeCache_error_:",e,o,r)}},Pr=async e=>{if(!e)return;return await Promise.all([Wr(e,"IndexedDB"),Wr(e,"Local Storage"),Wr(e,"ExtensionsSettings"),Wr(e,"History")])},Or=async e=>{const{hasCachePersistenceFeature:o}=i();if(o
```

## POST /api/v1/settings/restore_snapshot

- Client name: `restoreSnapshot`
- Candidate request keys: `token`

```text
),j(D(s),{label:t.$t("operate")||"操作",width:D(q)||D(J)?140:240},{default:I((({row:o,$index:i})=>[z("div",null,[j(le,{content:t.$t("envPop.restoreLocalConfirmText"),trigger:"click",onConfirm:e=>(async e=>{te.value=!0;const a={...e,token:Q()};try{const e=await N.restoreSnapshot(a);e&&0===e.code&&h.success(window.t("recoverSuccess")),te.value=!1}catch(t){console.log("restoreSnapshot_error_:",t),te.value=!1}})(o)},{reference:I((()=>[F((x(),S(D(e),{link:"",type:"primary"},{default:I((()=>[T(P(t.$t("recover")||"恢复"),1)])),_:1})),[[R,D(d).Env_CacheManage_LocalShotRecover]])])),_:2},1032,["content","o
```

## POST /api/v1/settings/switch_base_url

- Client name: `switchBaseUrl`
- Candidate request keys: `url`

```text
ass:"last-child",modelValue:s.value,"onUpdate:modelValue":o[0]||(o[0]=e=>s.value=e),value:e.id,onClick:X((o=>(async(e,o)=>{if(o!==s.value)try{await d.confirm(`确定要切换到线路${o}吗？`,"确认提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"});const l=await a.switchBaseUrl({url:e});l&&0===l.code&&(localStorage.setItem("baseUrl",e),s.value=o,t(window.t("setPlugin.setSuccess")||"设置成功","success"))}catch(l){console.log("switchBaseUrl_error:",l)}})(e.url,e.id)),["prevent"])},null,8,["modelValue","value","onClick"])])))),128))])])])}}}),[["__scopeId","data-v-bcd5719e"]]),De={class:"block"},Ke={clas
```

## POST /api/v1/settings/upload_snapshot

- Client name: `uploadSnapshot`
- Candidate request keys: `remark`, `token`, `companyId`, `cdk`

```text
o=await a.getCloudCacheList({account_id:t.env.shopid,page:1,pageSize:5,md5:s.md5});if(!o||200!==o.code||!o.data||!Array.isArray(o.data.list)||o.data.list.length<1){const{user:a}=e(),o={...s,remark:"",token:$(),companyId:a.companyData.companyId,cdk:t.env.cdk};l.uploadSnapshot(o)}}))}catch(s){console.log("uploadCache_err_:",s)}})(s)}}}const te={class:"main"},se={class:"content"},oe={key:0,class:"technical-assistance-tip"},ie={class:"note-detail-header"},ne=["aria-expanded"],re={class:"full-width"},de={key:0,class:"r tip-list"},ue={class:"tip-item"},pe={class:"tip-content"},ce={class:"tip-link",h
```

## POST /api/v1/users

- Client name: `register`
- Candidate request keys: `read`, `write`, `llseek`

```text
handle)||0,this.oldHandle===this.handle||d9.GL.makeContextCurrent(this.handle))}clearCurrent(){this.isDestroyed||this.oldHandle!==this.handle&&(d9.GL.makeContextCurrent(0),this.oldHandle&&d9.GL.makeContextCurrent(this.oldHandle))}registerTexture(e){return this.register(d9.GL.textures,e)}getTexture(e){return d9.GL.textures[e]}unregisterTexture(e){d9.GL.textures[e]=null}registerRenderTarget(e){return this.register(d9.GL.framebuffers,e)}getRenderTarget(e){return d9.GL.framebuffers[e]}unregisterRenderTarget(e){d9.GL.framebuffers[e]=null}destroy(){this.externallyOwned||d9.GL.deleteContext(this.hand
```

## POST /api/v1/users/login

- Client name: `login`
- Candidate request keys: _none parsed_

```text
}}),{val:i,showPw:A,sendWait:d}=C(t),c=h((()=>{let e;switch(s.type){case"phone":e="Number";break;case"password":e="password";break;default:e="text"}return e})),w=r;m((()=>{t.val=s.modelValue})),p((()=>s.modelValue),(e=>{t.val=e}));const B=()=>{K().parent.proxy.login()},E=e=>{t.val=e.target.value,w("update:modelValue",t.val)},F=()=>{t.sendWait>0&&(t.sendWait-=1,setTimeout((()=>{F()}),1e3))},Q=async()=>{if(!(In.phone(s.sendPhone)||s.sendPhone&&s.sendPhone.includes("@")))return void x("请输入正确的手机号或邮箱","error");if(s.sendPhone&&s.sendPhone.includes("@")&&(e=s.sendPhone,!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9
```

## POST /api/v2/users/wx_callback

- Client name: `newwxinfo`
- Candidate request keys: `code`, `last_login_port`, `last_login_device`

```text
===o.cmd&&(console.log("准备发起dingtalkcallback回调请求",o.params),n=o.params.authCode,r=o.params.state,a.userDingtalkcallback({code:n,state:r}).then((e=>{}))),"wxlogin"===o.cmd&&(console.log(o.params.code,"这是wxlogin"),(async e=>{try{if(vn(),!e)return;const o=await a.newwxinfo({code:e,last_login_port:"client",last_login_device:t.isMobile()?"mobile":"pc"});if(200===o.code)if(o.data.hasOwnProperty("token"))Y("success",o);else{const{identification:e}=o.data;Y("ddQrCodeBind",{identification:e,type:1,ty:"wx"})}else x(o.message,"error")}catch(o){x("服务器错误","error")}finally{zn()}})(o.params.code)),"https://l
```

## POST /v2/collector/track

- Client name: `collectorTrack`
- Candidate request keys: _none parsed_

```text
d:WD().appId,appType:WD().appType,deviceId:WD().deviceId,appVersion:WD().appVersion,os:WD().os,osVersion:WD().osVersion,userId:WD().userId,companyId:WD().companyId,extraParams:o}},XD=e=>{SP===CP.RealTime?(async e=>{if(!GD())return;const t=YD(e);ZD(t)&&await oA.collectorTrack([t],!0)})(e):SP===CP.Scheduled&&(async e=>{if(!GD())return;const t=YD(e);ZD(t)&&WT(t)})(e)},QD=(e,t,n,o)=>{const{pageId:r,lastPageId:a}=qD(e,t),i={eventType:n,eventId:e,elementId:KD(e),sessionId:"",eventTime:Date.now(),closeTime:0,pageId:r,lastPageId:a,appId:WD().appId,appType:WD().appType,deviceId:WD().deviceId,appVersion
```

## POST /v2/cost/costmanagement/coupons_send

- Client name: `sendCoupons`
- Candidate request keys: `company_id`, `uid`, `coupon_id`, `promoter`, `source`

```text
=t,(o=e).length<=r?o:`${o.slice(0,r)}...`)})),{truncatedText:n}}((null==(e=$.value)?void 0:e.name)||"",11)})),j=e=>{const{uuid:t="",promoter:o="",source:r=""}=e||{},i=t.split(",").map((e=>e.trim()))||[];let l=!0,s=0;i.forEach((async e=>{const{code:t=0}=await n.sendCoupons({company_id:a.companyData.companyId,uid:a.userData.userId,coupon_id:e,promoter:o,source:r});200!==t&&(l=!1),++s,s===i.length&&(l&&oS.success(window.t("receiveSuccess")),setTimeout((()=>{g.push("/expense3/couponList")}),200))}))},z=(e,t)=>{var n,o;Z(t);const{optype:r=0,opid:a="",uuid:i="",promoter:l="",source:s="",url:c="",adp
```

## POST /v2/cost/costmanagement/findDevicesByOrderNo

- Client name: `deviceOrderScan`
- Candidate request keys: `orderNo`

```text
id 0:e.device)?void 0:o[0])?void 0:n.device_id)||""}if(!f&&(null==(c=null==(s=null==(r=null==(i=null==a?void 0:a.order_detail_all)?void 0:i[0])?void 0:r.device)?void 0:s[0])?void 0:c.device_id)&&(f=a.order_detail_all[0].device[0].device_id),!f){const a=await d.deviceOrderScan({orderNo:e});if(200!==(null==a?void 0:a.code)||"success"!==(null==(u=a.data)?void 0:u.status))return!1;f=(null==(p=a.data)?void 0:p.device_id)||""}if(!f)return!1;const m=await d.findDevices({device_ids:[f],trademark:b.official}),h=200===m.code&&(null==(y=m.data)?void 0:y.length)?m.data[0]:null;return!!h&&((e=>{var a,l,t,o
```

## POST /v2/cost/costmanagement/getOrderDetailNewByMultiple

- Client name: `getOrderDetailNewByMultiple`
- Candidate request keys: `oids`, `details_nos`

```text
l:.01}else e.final_amount=v}};return{beforeOpen:(l,t)=>{const o=[],n=[],i=[],r=[],s={};l.forEach((e=>{n.includes(e.oid)||n.push(e.oid),i.includes(e.details_no)||i.push(e.details_no),r.includes(e.device_id)||r.push(e.device_id),s[e.device_id]=e.device_name})),e.getOrderDetailNewByMultiple({oids:n,details_nos:i}).then((e=>{const{data:l,code:n}=e;200===n&&l.forEach((e=>{const{order_detail_all:l=[]}=e;l.forEach((e=>{var l,t,n;const i=null==(l=null==e?void 0:e.bundle_info)?void 0:l.proxy_type,u=(e.device||[]).filter((e=>r.includes(e.device_id))),c=((null==(n=null==(t=null==e?void 0:e.cloud)?void 0:
```

## POST /v2/cost/costmanagement/redeemed

- Client name: `getcdkey`
- Candidate request keys: `card_no`

```text
,r=s(!1),a=t,i=mo(),l=s(!1),c=s(""),d=()=>{if(a("submitCDK"),!o.value)return _A(window.t("inputCdkeyCardNum")||"请输入你的CDKEY卡号","warning"),void oL(FT.recharge_error_cdk_submit,i.path,{message:window.t("inputCdkeyCardNum")||"请输入你的CDKEY卡号"});r.value||(r.value=!0,n.getcdkey({card_no:o.value},!0).then((e=>{uV.CdkeyExchange.data.code=e.code,uV.CdkeyExchange.data.error=(null==e?void 0:e.msg)||"服务端错误",iV.getInstance().subscribe(uV.CdkeyExchange),e&&200===e.code?(_A(window.t("exchangeSuccess")||"兑换成功","success"),iV.getInstance().removeSub(uV.CdkeyExchange.type),o.value="",a("close",e.data)):e&&401===e.c
```

## POST /v2/cost/costmanagement/renew_meal_pay

- Client name: `renewMealPay`
- Candidate request keys: _none parsed_

```text
e_day:s?l.selectDayNum:l.buyDayNum,cost:l.displayPayableAmount,pay_type:a,pay_type_extra:z.value,source_type:r.getSourceType,user_packages_id:1,coupon_code:c,...s?{validityPeriod:l.selectDayNum}:{},...n?{old_update:!0,select_day:l.selectDayNum}:{}},u=s?await i.renewMealPay(o,!0):await i.setmealPay(o,!0);if("zfb"===a&&(C.buyPackgeZfb.data.code=u.code,$.getInstance().subscribe(C.buyPackgeZfb)),"wx"===a&&(C.buyPackgeWx.data.code=u.code,$.getInstance().subscribe(C.buyPackgeWx)),200===u.code)if(null==(e=R.value)||e.reqCouponList(),l.coupon=null,"yue"!==a){const{qrCode:e}=u.data;e?(re.value.qrCodePa
```

## POST /v2/cost/costmanagement/set_meal_auto_set

- Client name: `set_meal_auto_set`
- Candidate request keys: `auto_renew`

```text
})),V=()=>{YS().setLogoutInfo("手动点击退出登录");const e=vt(),t={clientType:e.channel||"",device:e.platform||"",clientId:e.deviceId.split("_")[0]||"",clientMac:e.mac||""};g.logout(t),a.logout(),i.quit(),JD(LP.home_userCenter_logOut,n.path)},z=async e=>{200!==(await g.set_meal_auto_set({auto_renew:e?1:0})).code&&(b.value=!e),eL(LP.home_userCenter_packageAutoRenewal,n.path,e?"打开套餐自动续费":"关闭套餐自动续费")},Z=s({day:0,expired:!1}),K=s(!1);h((()=>{var e;const t=null==(e=Z.value)?void 0:e.end_time;if(t){const e=Hp(t),n=Hp(),o=e.diff(n),r=Math.floor(o/1e3);if(r<0)return"--:--:--";const a=`${Math.floor(r/3600)}:${M
```

## POST /v2/cost/costmanagement/set_meal_pay

- Client name: `setmealPay`
- Candidate request keys: _none parsed_

```text
yDayNum,cost:l.displayPayableAmount,pay_type:a,pay_type_extra:z.value,source_type:r.getSourceType,user_packages_id:1,coupon_code:c,...s?{validityPeriod:l.selectDayNum}:{},...n?{old_update:!0,select_day:l.selectDayNum}:{}},u=s?await i.renewMealPay(o,!0):await i.setmealPay(o,!0);if("zfb"===a&&(C.buyPackgeZfb.data.code=u.code,$.getInstance().subscribe(C.buyPackgeZfb)),"wx"===a&&(C.buyPackgeWx.data.code=u.code,$.getInstance().subscribe(C.buyPackgeWx)),200===u.code)if(null==(e=R.value)||e.reqCouponList(),l.coupon=null,"yue"!==a){const{qrCode:e}=u.data;e?(re.value.qrCodePayInfo={qrcodeUrl:e,payType:
```

## POST /v2/cost/device/balance_pay

- Client name: `balancePay`
- Candidate request keys: `order_no`, `auto_renew`

```text
(a=X.value[0])?void 0:a.beginQrCodePay)||l.call(a,t)}else ge(_e.yunEnvCreate_error_submitPay,k.path,{info:JSON.stringify(e),message:JSON.stringify(o)})})(o.data),void Qe(!1);try{await we({amount:be(o.data.final_amount)});const e=await(async e=>{const a=await f.balancePay({order_no:e},!0);if(200===a.code)return"success";4019===a.code&&(pe.value=!0)})(o.data.order_no);if("success"!==e)return ge(_e.yunEnvCreate_error_submitPay,k.path,{info:JSON.stringify(o.data.order_no),message:JSON.stringify(e)}),void Qe(!1);Aa.success("购买成功")}catch{return void Qe(!1)}}else if(B.value){if(200!==(await f.yunBrow
```

## POST /v2/cost/device/batch_cloud_browser

- Client name: `batchCloudBrowser`
- Candidate request keys: _none parsed_

```text
ct.id,cloud_accounts_oid:a.data.oid,cloud_accounts_id:a.data.accountId,period:d.payInfo.selectMonth,source_type:u.getSourceType,coupon_code:d.payInfo.couponCode,pay_type:d.payInfo.payType,pay_type_extra:0,auto_renew:d.payInfo.isAutoRenew?1:0,num:1}]},o=await f.batchCloudBrowser(l);if(200!==o.code)return void Qe(!1);if("yue"!==d.payInfo.payType)return await(async e=>{var a,l;const t={pay_type:d.payInfo.payType,pay_type_extra:0,order_no:e.order_no},o=await f.devicePayScan(t);if(200===o.code){const t={order_no:o.data.order_no,payType:o.data.pay_type,payTypeExtra:o.data.pay_type_extra,orderId:o.da
```

## POST /v2/cost/device/batch_cloud_browser_renew

- Client name: `batchCloudBrowserRenew`
- Candidate request keys: `renew`

```text
=P.selections.map((e=>({cloud_id:Number(e.cloudId),cloud_accounts_oid:e.oid,cloud_accounts_id:e.accountId,period:e._renewal_month,source_type:t.getSourceType,coupon_code:"",pay_type:F.value,pay_type_extra:0,auto_renew:I.value?1:0})));A.value=!0;const a=await T.batchCloudBrowserRenew({renew:e});200===a.code&&("yue"===F.value?"success"===await Y(a.data.order_no)&&(u.success("云环境续费成功"),q("refresh"),O.value=!1):await W(a.data),A.value=!1)})();q("confirm")},ee=e=>{var a;const l=e._renewal_selling_price||0,o=e._renewal_month,t=null==(a=e._renewal_price)?void 0:a.find((e=>e.month===o));if(t){const e=
```

## POST /v2/cost/device/batch_create_order

- Client name: `createOrder`
- Candidate request keys: _none parsed_

```text
type:c,isp_type:d,net_type:u,auto_renew:p,group_no:y}=e;return{cloud_id:t,num:a,period:l,flow:o,isp:i?i.isp:"0",coupon_code:n,band_width:s,ip_type:c,isp_type:d,net_type:u,cidr_blocks:i,pay_type:r.shopCartPayType,auto_renew:p,group_no:y}}))};try{const l=await s.createOrder(t);l&&200===l.code&&(r.shopCartPayType===e.YUE?b({amount:j.value.payable}).then((()=>{var e;e=l.data.order_no,s.balancePay({order_no:e},!0).then((e=>{I.buyProsyYb.data.code=e.code,I.buyProsyYb.data.error=e.msg,C.getInstance().subscribe(I.buyProsyYb),200===e.code?(Y(),$("del",!0),C.getInstance().removeSub(I.buyProsyYb.type)):4
```

## POST /v2/cost/device/batch_create_renew

- Client name: `batchCreateRenew`
- Candidate request keys: `renew`

```text
e:K}=l(),q=pe(),W=()=>{if(F.value){I.value=!0;const e=$.value.map((e=>{var a;return{device_id:e.deviceInfo.device_id,period:e.payMonth,source_type:K.getSourceType,coupon_code:(null==(a=e.coupon)?void 0:a.coupon_code)||"",pay_type:M.value,pay_type_extra:0}}));S.batchCreateRenew({renew:e}).then((e=>{console.log(e);const{code:l,data:t}=e;if(200===l){const e=t.order_no||"";M.value===a.YUE?c({amount:U.value}).then((()=>{((e,a)=>{const{orderNo:l}=e;S.balancePay({order_no:l},!0).then((e=>{f.buyProsyYb.data.code=e.code,f.buyProsyYb.data.error=e.msg,_.getInstance().subscribe(f.buyProsyYb),200===e.code?
```

## POST /v2/cost/device/cancel_order

- Client name: `cancelOrder`
- Candidate request keys: `order_no`

```text
"⚠️ popup 还没显示，可能动画未完成或未渲染"),_(v.buy_error_openPage,l.path,{info:JSON.stringify(e),message:"订单详情弹窗未显示"}))}),5e3)):f(v.buy_error_openPage,l.path,{info:JSON.stringify(o),message:"请求失败，订单详情未获取到"})}))},M=ae(!1),R=async e=>{const{order_no:l=""}=e,{code:t=0}=await o.cancelOrder({order_no:l});200===t&&a.push({path:"/expense3/purchasePackage",query:{order_no:e.oid,order_pay:e.order_no}})},Y=()=>{u.value=!0,y.value=!1;const e={name:""===d.name?void 0:d.name,order_type:""===d.order_type?void 0:d.order_type,order_status:""===d.order_status?void 0:d.order_status,pay_type:""===d.pay_type?void 0:d.pay_type,
```

## POST /v2/cost/device/cart_delete

- Client name: `cartDelete`
- Candidate request keys: `carts`, `oid`

```text
ype&&!0===t.checked))?(e.checked=!0,e.isIndeterminate=!1):e.checked=!1}))},D=async e=>{const t=e?{carts:f.value.filter((e=>e.checked&&1===e.device_status)).map((e=>({oid:e.oid})))}:{carts:f.value.filter((e=>e.checked)).map((e=>({oid:e.oid})))},{code:a}=await s.cartDelete(t);200===a&&(await T(),F(),e||c({type:"success",message:window.t("deleteSuccess")}))},G=async()=>{var e;if(u(d.expense_shoppingCart_batchDeletion,i.path),0===(null==(e=f.value.filter((e=>e.checked)))?void 0:e.length))return;A.confirm({title:window.t("multiDelete"),text:window.t("confirmDeleteIrrecoverable"),confirmText:window.
```

## POST /v2/cost/device/cart_update

- Client name: `cartUpdate`
- Candidate request keys: _none parsed_

```text
ts:[{auto_renew:o.auto_renew?1:0,auto_month:o.period,time_num:o.period,goods_num:o.num,cloud_id:n?0:Re.value.id,group_no:n,coupon_code:Ye(),select_status:1,ip_type:l.ip_type,isp_type:l.isp_type,net_type:l.net_type,band_width:l.band_width}]};try{const l=await a.cartUpdate(i);200===(null==l?void 0:l.code)?(o.coupon=null,null==(e=w.value)||e.reqCouponList(),D({type:"success",message:"加入购物车成功"}),t.addToCart()):D.error((null==l?void 0:l.msg)||"加入购物车失败")}catch(s){console.log("addToCart_err_:",s),D.error("加入购物车失败")}finally{T.value=!1}},da=async()=>{var e,n;if(!g.value)return void D.warning(`${window.
```

## POST /v2/cost/device/pay_scan

- Client name: `devicePayScan`
- Candidate request keys: `pay_type`, `pay_type_extra`, `auto_renew`, `amount`, `order_no`

```text
0${n}`:n}`}}),1e3)};r((()=>{var e;i.info.qrcodeUrl&&(Ct||an)&&(e=i.info.qrcodeUrl,w$(e,z,((e,t)=>{e?console.error(e):j.value=t})),m.value&&K())}));const Y=async e=>{const{amount:t=0,orderId:n="",payType:r=""}=i.info||{},a=Number(t),{code:l=0,data:s={}}=await o.devicePayScan({pay_type:r,pay_type_extra:e,auto_renew:1,amount:a,order_no:n});if(V.value="",200===l){const{qrCode:e=""}=s||{};V.value=e,D(s)}P()},X=()=>{Y($.value)},Q=()=>{f("close"),f("popupActuallyShown",!1)};return H((()=>{clearInterval(d.value),A&&clearTimeout(A);const e=document.getElementById("dropIn");e&&(e.removeEventListener("on
```

## POST /v2/cost/device/scanrecharge

- Client name: `scanrecharge`
- Candidate request keys: `amount`, `coupon_code`, `pay_type`, `pay_type_extra`, `source_type`

```text
CoinRecharge")?e=FT.recharge_error_onlineRecharge_submitPay:(o.path.includes("yunBrowser/yunEnvList")||o.path.includes("proxyManage/platProxy"))&&(e=$T.proxyManage_error_yunCoin_submitPay),void(e&&oL(e,o.path,{message:window.t("inputAmount")||"请选择或输入充值金额"}))}l.scanrecharge({amount:ae.value,coupon_code:(null==(e=ie.value)?void 0:e.coupon_code)||"",pay_type:Y.value,pay_type_extra:te.value,source_type:r.getSourceType},!0).then((e=>{if("wx"===Y.value&&(uV.yunbiWxQrcode.data.code=e.code,iV.getInstance().subscribe(uV.yunbiWxQrcode)),"zfb"===Y.value&&(uV.yunbiZfbQrcode.data.code=e.code,iV.getInstance
```

## POST /v2/logs/auth/options

- Client name: `optionslogs`
- Candidate request keys: _none parsed_

```text
))||20});t();const H=w([]),K=w(!1),O=w(" "),R=w([]),q=e=>{R.value=e.value,D.pageIndex=1,B()},B=()=>{K.value=!0;const e={...D};R.value&&R.value.length>0&&(e.beginTime=`${i(R.value[0],"yyyy-MM-dd")} 00:00:00`,e.endTime=`${i(R.value[1],"yyyy-MM-dd")} 23:59:59`),P.optionslogs(e).then((e=>{200===e.code&&(H.value=e.data.list||[],0===H.value.length&&(O.value=window.t("noneData")||"暂无数据"),D.total=e.data.count)})).catch((()=>{n(window.t("serverError")||"服务端错误","error")})).finally((()=>{K.value=!1}))},J=e=>{D.pageIndex=e,B()},N=e=>{D.pageSize=e,localStorage.setItem(a.SizeKey_OperateLog,String(e)),D.page
```

## POST /v2/logs/auth/perms

- Client name: `permslogs`
- Candidate request keys: _none parsed_

```text
))||20});t();const P=y([]),A=e=>{P.value=e.value,L.pageIndex=1,R()},D=y([]),H=y(!1),K=y(" "),R=()=>{H.value=!0;const e={...L};P.value&&P.value.length>0&&(e.beginTime=`${l(P.value[0],"yyyy-MM-dd")} 00:00:00`,e.endTime=`${l(P.value[1],"yyyy-MM-dd")} 23:59:59`),E.permslogs(e).then((e=>{200===(null==e?void 0:e.code)&&(D.value=e.data.list||[],0===D.value.length&&(K.value=window.t("noneData")||"暂无数据"),L.total=e.data.count||0)})).catch((()=>{n(window.t("getListError")||"获取列表失败","error")})).finally((()=>{H.value=!1}))},q=e=>{L.pageIndex=e,R()},B=e=>{L.pageSize=e,localStorage.setItem(a.SizeKey_Permissi
```

## POST /v2/message/message-type/page

- Client name: `messageTypePage`
- Candidate request keys: _none parsed_

```text
Type:i.value,page:h.value.page,pageSize:h.value.pageSize});200===e.code&&(a.value=e.data.list||[],r.value=e.data.total||0,a.value=a.value.map((e=>Ln(e))))},F=async()=>{await(async()=>{var e;let t=[];if(n.messageCateList)t=n.messageCateList;else{const r=await o.messageTypePage();200===r.code&&(t=(null==(e=r.data)?void 0:e.list)||[]),n.messageCateList=t}0===t.length?(c.value=[m],d.value=[]):t.length<=4?(c.value=[m,...t],d.value=[]):(c.value=[m,...t.slice(0,3)],c.value.push(v),d.value=t.slice(3)),l.value=t||[]})(),l.value.forEach((e=>{e.checked=!0})),M.value=!0;const e=localStorage.getItem("hidde
```

## POST /v2/message/sms-setting/change

- Client name: `changeRenewSmsNotifySetting`
- Candidate request keys: `renewSmsNotifyEnabled`

```text
balStore:h}=u(),{mobilePhones:w}=m.pSecure,b=G({}),y=e=>{navigator.clipboard.writeText(e).then((()=>{a(window.t("copySuccess")||"复制成功","success")}))},g=X((()=>v.personalDetails)),f=G(1),_=G(!1),x=async()=>{const e=1===f.value?2:1;_.value=!0;try{const a=await l.changeRenewSmsNotifySetting({renewSmsNotifyEnabled:e},!0);return null==(null==a?void 0:a.code)||200===a.code}catch(t){return a(window.t("serverError")||"服务端错误","error"),!1}finally{_.value=!1}};xe((()=>g.value.mobile),(e=>{e&&(async()=>{var e;try{const a=await l.getRenewSmsNotifySetting({},!0),t=(null==a?void 0:a.renewSmsNotifyEnabled)??(
```

## POST /v2/message/sms-setting/get

- Client name: `getRenewSmsNotifySetting`
- Candidate request keys: _none parsed_

```text
hangeRenewSmsNotifySetting({renewSmsNotifyEnabled:e},!0);return null==(null==a?void 0:a.code)||200===a.code}catch(t){return a(window.t("serverError")||"服务端错误","error"),!1}finally{_.value=!1}};xe((()=>g.value.mobile),(e=>{e&&(async()=>{var e;try{const a=await l.getRenewSmsNotifySetting({},!0),t=(null==a?void 0:a.renewSmsNotifyEnabled)??(null==(e=null==a?void 0:a.data)?void 0:e.renewSmsNotifyEnabled);null!=(null==a?void 0:a.code)&&200!==a.code||1!==t&&2!==t||(f.value=t)}catch(t){a(window.t("serverError")||"服务端错误","error")}})()}),{immediate:!0});const E=e=>{200===e.code?(b.value.avatar=e.data,v.u
```

## POST /v2/message/user-notice/getNotice

- Client name: `userNoticeGet`
- Candidate request keys: `id`

```text
("searchParams",o.toString());const r=o.get("openDialog");r&&(async(e,o,t)=>{const{user:r,msg:a,globalStore:s}=n();if("newYear2025Dialog"===e)r.NewYear2025Show=!0,console.log("params",o);else if("messageDialog"===e){if("notice"!==t.mType)return;const e=await d.userNoticeGet({id:t.noticeId});200===e.code&&(a.currentData=ot(e.data),a.messageDialogShow=!0,console.log("MessageShow",o))}else"enterpriseAuthDialog"===e&&(s.enterpriseAuthDialogShow=!0)})(r,t,e)},Qo={CallbackClose:()=>{console.log("closecallback调用了"),g(y.home_clientMessage_close,qo.home_clientMessage_pageView)},CallbackClick:e=>{consol
```

## POST /v2/message/user-notice/my

- Client name: `getAllMessage_new`
- Candidate request keys: `companyId`, `userId`, `status`, `noticeType`, `page`, `pageSize`

```text
ate:()=>({unread:0,messageCateList:void 0,messageDialogShow:!1,currentData:{}}),actions:{async getMsgUnread(){var e,t;const n={companyId:null==(e=J7().companyData)?void 0:e.companyId,userId:null==(t=J7().userData)?void 0:t.userId,status:1};try{const e=await oA.getAllMessage_new(n);if(200===e.code&&(this.unread=e.data.total,this.unread=Number(this.unread)>99?"99+":this.unread,this.unread)){1===e.data.list[0].popup&&console.log("通知白骁弹窗")}}catch(o){console.log("获取未读消息失败",o)}}}}),aA=po("search",{state:()=>({envManage:{envGroupId:"",envGroupList:[],envKeywords:[],envSearchFields:[],envSortId:0,envF
```

## POST /v2/message/user-notice/noticeRed

- Client name: `userNoticeNoticeRed`
- Candidate request keys: _none parsed_

```text
).forEach((e=>{const t=l.value.find((t=>t.noticeType===Number(e)));t&&(t.checked=!1,M.value=!1)})),I.value=l.value.some((e=>e.checked))),P(),l.value.forEach((e=>{L(e)})),c.value.forEach((e=>{L(e)})),d.value.forEach((e=>{L(e)})),$()},$=async()=>{const e=await o.userNoticeNoticeRed();200===e.code&&(l.value.forEach((t=>{var n,o;t.red=(null==(o=null==(n=e.data)?void 0:n.find((e=>e.noticeType===t.noticeType)))?void 0:o.red)||!1})),c.value.forEach((t=>{var n,o;t.red=(null==(o=null==(n=e.data)?void 0:n.find((e=>e.noticeType===t.noticeType)))?void 0:o.red)||!1})),d.value.forEach((t=>{var n,o;t.red=(nu
```

## POST /v2/message/user-notice/readAll

- Client name: `userNoticeReadAll`
- Candidate request keys: _none parsed_

```text
))&&(i.value=0,N())},M=s(!1),I=s(!1),B=e=>{console.log(e),e?l.value.forEach((e=>{e.checked=!0})):l.value.forEach((e=>{e.checked=!1})),I.value=!1,P()},D=async()=>{if(0===n.unread)return;dP.confirm({text:"确定将所有消息设为已读吗？"},(async(e,t,r)=>{t.value=!0;200===(await o.userNoticeReadAll()).code&&(n.unread=0,a.value.forEach((e=>{e.status=2})),l.value.forEach((e=>{e.red=!1})),c.value.forEach((e=>{e.red=!1})),d.value.forEach((e=>{e.red=!1})),t.value=!1,r.value=!1)}))},L=e=>{0===e.noticeType?e.svg="allMessage":-99===e.noticeType?e.svg="more":1===e.noticeType?e.svg="bill":2===e.noticeType?e.svg="service":3=
```

## POST /v2/message/user-notice/update

- Client name: `getReadMessage_new`
- Candidate request keys: `companyId`, `userId`, `status`, `id`

```text
let S=!1;const A=e=>{var n;y.value=e,g.value={...a.value[e]},1===(null==(n=g.value)?void 0:n.status)&&(S=!0),b.value=!0,f((()=>{var n;null==(n=w.value)||n.detailOpenType(),(e=>{var n,r,i,l;if(2===(null==(n=g.value)?void 0:n.status))return;a.value[e].status=2,o.getReadMessage_new({companyId:null==(r=t.companyData)?void 0:r.companyId,userId:null==(i=t.userData)?void 0:i.userId,status:2,id:null==(l=g.value)?void 0:l.id}).then((e=>{e.code}))})(e)}))},E=()=>{h.value.pageSize+=10,N()},P=()=>{const e=l.value.filter((e=>e.checked));0===e.length?(c.value=[m],d.value=[]):e.length<=4?(c.value=[m,...e],d.
```

## POST /v2/newbrowser/account-users/get

- Client name: `accountUsers`
- Candidate request keys: `accountIds`

```text
])},tl=da(!1),il=(e,a,l)=>{"deleaccount"===e&&le(a.shopid)||("fingerprints"===e&&j.changeCurrentname(window.t("envManage")||"环境管理",a),_e("openoff",e,a,l))},{openaccount:rl}=J(),cl=_a((()=>rl.value)),dl=da([]),ul=async()=>{try{const{code:e=0,data:a=[]}=await we.accountUsers({accountIds:_.accountlist.map((e=>e.shopid))});if(200===e&&a.length){const e=new Map;for(const s of a)e.has(s.accountId)?e.get(s.accountId).userId.add(s.userId):e.set(s.accountId,{accountId:s.accountId,userId:new Set([s.userId]),userList:[],nameList:""});const l=Array.from(e.values()).map((e=>(e.userId=Array.from(e.userId),e
```

## POST /v2/newbrowser/account-users/update

- Client name: `envUpdate`
- Candidate request keys: `accountIds`

```text
a=dl.value.length-1;a>=0;a--){const e=dl.value[a].accountId;l.some((a=>a.accountId===e))||(dl.value.splice(a,1),console.log("轮询更新去除"))}}else dl.value=[]}catch(e){}};Na((()=>_.accountlist),(e=>{ul()}));const ml=da(null),fl=async()=>{try{const{code:e=0}=await we.envUpdate({accountIds:ee.value.map((e=>e.shopId))},!0);200===e&&ul()}catch(e){}};Na((()=>ee.value),(()=>{fl()}),{deep:!0}),Na((()=>[he.isFold,he.showQuickStart]),(()=>{Ma((()=>{yl()}))}));const hl=da(88),gl=_a((()=>{const e=80+hl.value+56+62;return _.roundBusCount>=3?`calc(100vh - ${e}px - 210px)`:`calc(100vh - ${e}px - ${70*_.roundBusCo
```

## POST /v2/newbrowser/addusershopauthority

- Client name: `addusershopauthority`
- Candidate request keys: `userid`, `shopids`

```text
?void 0:a.companyId,userid:null==(l=i.userData)?void 0:l.userId,shopids:d,touserid:null==(t=I.rowData)?void 0:t.userId})).code||0,200!==u&&n(window.t("cancelEmpowerError")||"取消授权失败","error")}if(s.length>0){const e={userid:I.rowData.userId,shopids:s};u=(await c.addusershopauthority(e)).code||0}200===u&&(n(window.t("operateSuccess")||"操作成功","success"),$.value=!1,r("handleSearch"))}};return(n,o)=>{const s=g,i=w;return B(),H(t,{visible:$.value,"onUpdate:visible":o[4]||(o[4]=e=>$.value=e),title:n.$t("empowerAcc"),class:"auth-account-dialog",width:"1200",onSbmit:N},{default:G((()=>[F("div",He,[F("di
```

## POST /v2/newbrowser/batchCloneShop

- Client name: `batchCloneShop`
- Candidate request keys: `number`, `accountIds`

```text
const t=u,D=m("$api"),S=i,Y=p(u,"modelValue"),$=d(!1),A=d(0),E=d(!1),L=d(0),N=d(0),U=r((()=>L.value-N.value>10?10:L.value-N.value)),q=r((()=>L.value-N.value<0?0:L.value-N.value)),F=()=>{l.push("/expense3/purchasePackage")},M=async()=>{$.value=!0;200===(await D.batchCloneShop({number:A.value,accountIds:[t.editRowInfo.shopid]})).code&&setTimeout((()=>{$.value=!1,Y.value=!1,o.success("克隆成功"),S("success")}),600*A.value)};return v((async()=>{await(async()=>{const a=await D.getpackageinfo({});200===a.code&&(L.value=a.packagenumb,N.value=a.usednumb)})(),L.value-N.value<=0?A.value=0:A.value=1,L.value-
```

## POST /v2/newbrowser/batchCreateShop

- Client name: `batchCreateShop`
- Candidate request keys: _none parsed_

```text
roxyType&&(a.browser.proxy.PublicIP=l.data.ip),s=V.ONLINE),"object"==typeof l&&Object.prototype.hasOwnProperty.call(l,"code")&&-1===l.code&&l.data&&l.data.code&&(s=l.data.code)}if(Q)return}let _;if(P.value||A.value?_=await f.foundaccount(a):C.value&&(_=await f.batchCreateShop(a)),200!==_.code)return Qe(!1),void(16e3===_.code?ke():ne.getInstance().subscribe(oe.createEnvPackgeFail));A.value||(P.value?j(h.newBrowser_singleAdd_sureSuccess,k.path):j(g.newBrowser_batchAdd_sureSuccess,k.path));const x=()=>{var l,t;if(y===Ca.WINDOWS&&_.shopid&&_.shopid.length>0){const e=_.shopid[0]||"",l="local"===d.p
```

## POST /v2/newbrowser/bindingUserPasswordList

- Client name: `bindingUserPasswordList`
- Candidate request keys: `user_password_ids`

```text
={class:"accountPop"},Ho=["src"],zo=d(sa({__name:"accountPop",props:{userPasswordIds:{default:""}},setup(e){const a=ra("$api"),l=e,t=da([]);return ua((()=>{(async()=>{if(l.userPasswordIds.length<10)return;const e={user_password_ids:l.userPasswordIds},o=await a.bindingUserPasswordList(e);200===o.code&&(t.value=o.data)})()})),(e,a)=>{const l=T,o=L;return pa(),ya("div",$o,[ga(o,{data:wa(t),class:"main","empty-text":"暂无数据"},{default:ma((()=>[ga(l,{label:"名称","show-overflow-tooltip":{effect:"light"}},{default:ma((e=>[Ba(ha(e.row.name),1)])),_:1}),ga(l,{label:"平台","show-overflow-tooltip":{effect:"li
```

## POST /v2/newbrowser/clearCookie

- Client name: `clearCookie`
- Candidate request keys: `account_id`

```text
=>{}}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:["update:modelValue"],setup(a){const l=ra("$api"),{settingStore:t}=e(),n=ca(a,"modelValue"),s=da(!1),i=a,c=async()=>{const{shopid:e}=i.currentRow,a={account_id:e};s.value=!0;const t=await l.clearCookie(a);s.value=!1,200==t.code&&(Le("[]",e),r.success(window.t("clearCookieSuccess")||"清除cookie成功"),n.value=!1)};return(e,a)=>(pa(),ya("div",Wo,[n.value?(pa(),va(o,{key:0,modelValue:n.value,"onUpdate:modelValue":a[0]||(a[0]=e=>n.value=e),title:e.$t("clearCookie"),width:"580px",okLoading:wa(s),onCancel:a[1]||(a[1]=e=>n.value=!1),on
```

## POST /v2/newbrowser/cloud-accounts/create

- Client name: `yunBrowserCloudAccountsCreate`
- Candidate request keys: `cloudId`, `productId`, `autoRenew`, `browser`, `headless`

```text
e(t))}else E.value&&(t=await Je(t));if(I.value){t.browser.shopid="";const e={cloudId:String(d.payInfo.selectProduct.id),productId:d.payInfo.selectProduct.product_id,autoRenew:d.payInfo.isAutoRenew?1:0,browser:t.browser,headless:d.yunService.headless},a=await f.yunBrowserCloudAccountsCreate(e);if(200!==a.code)return ge(_e.yunEnvCreate_error_submitPay,k.path,{info:JSON.stringify(t),message:JSON.stringify(a)}),void Qe(!1);d.basic.yunShopid=a.data.accountId;const l={create:[{cloud_id:d.payInfo.selectProduct.id,cloud_accounts_oid:a.data.oid,cloud_accounts_id:a.data.accountId,period:d.payInfo.select
```

## POST /v2/newbrowser/cloud-accounts/finger/get

- Client name: `yunBrowserAccountsFingerGet`
- Candidate request keys: `shopid`

```text
rnelversion;const o=n.system||n.nextsystem.Android||n.nextsystem.MacOS||n.nextsystem.IOS||n.nextsystem.Linux;this.basic.system=o,this.basic.uaVersion=n.UAversion,this.basic.ua=n.ua,this.updateFingerInfo(e)},async getFingerInfo(e,t,n,o=!1){let r;if(n)r=await oA.yunBrowserAccountsFingerGet(e);else{const t=[oA.getfingerprin(e)];e.shopid&&o&&t.push(oA.getCookie({shopid:e.shopid}));const n=await Promise.all(t);r=n[0],n[1]&&200===n[1].code&&(r.browseinfo.accounts.cookie=n[1].data)}return console.log("getFingerInfo-指纹信息是",r,t,e),200===r.code?(t===fE.Refresh_All?this.updateAllFingerInfo(r):t===fE.Refr
```

## POST /v2/newbrowser/cloud-accounts/getauthshopbriefinfolist

- Client name: `getauthshopbriefinfolist_Yun`
- Candidate request keys: `page`, `pageSize`, `name`

```text
y.region?e.proxy.regionArr=e.proxy.region.split("-"):(e.proxy.region="random-random-random",e.proxy.regionArr=["random","random","random"]))})))},Fa=async()=>{const e={page:ne.value.pageIndex,pageSize:ne.value.pageSize,name:ae.value};C.value=!0;const a=await k.getauthshopbriefinfolist_Yun(e);C.value=!1,200===a.code&&(Ie.value=a.data.list||[],ne.value.total=a.data.total||0,Ie.value.forEach((e=>{e._envType="yun",e._serviceArea=(e=>{const a=Number(e),l=Be.value.find((e=>e.id==a));return l?`${l.display_region}-${l.display_area}`:"未知"})(e.cloud_id),"official"===e.proxy.inlie&&4===e.proxy.product&&(
```

## POST /v2/newbrowser/cloud-accounts/getiduserlist

- Client name: `getUseCountByProxyId_Yun`
- Candidate request keys: `deviceid`, `company`, `companyid`, `userid`, `selfid`

```text
a.total)})(),(async()=>{const e=O.value.map((e=>e.device_id)),a=await L.getUseCountByProxyId({deviceid:e});if(200===a.code){const e=a.device;e&&e.length>0&&e.forEach((e=>{const a=O.value.find((a=>e.id===a.device_id));a&&(a.envCount=e.number)}))}const l=await L.getUseCountByProxyId_Yun({deviceid:e});if(200===l.code){const e=l.device;e&&e.length>0&&e.forEach((e=>{const a=O.value.find((a=>e.id===a.device_id));a&&(a.envCount=(a.envCount||0)+Number(e.number))}))}})()):ge.value===u.self?(await(async e=>{var a;let l="";4===(null==(a=Re.value.areaCascader4)?void 0:a.length)&&(l=`${Re.value.areaCascade
```

## POST /v2/newbrowser/cloud-accounts/getshopfromproxy

- Client name: `getshopfromproxy_Yun`
- Candidate request keys: `company`, `companyid`, `userid`, `deviceid`, `offer`, `number`

```text
o;Ce.value=!0;const a={company:y().user.companyData.companyName,companyid:y().user.companyData.companyId,userid:y().user.userData.userId,deviceid:null==(e=ke.editOwnProxyInfo)?void 0:e.deviceid,offer:0,number:1e3},t=await Promise.all([Se.getshopfromproxy(a),Se.getshopfromproxy_Yun(a)]),r=t[0],n=t[1];Ce.value=!1,200===r.code&&(null==(l=null==r?void 0:r.shopinfo)?void 0:l.length)>0&&(De.value=r.shopinfo||[]),200===n.code&&(null==(o=null==n?void 0:n.shopinfo)?void 0:o.length)>0&&(De.value=[...De.value,...n.shopinfo])})(),(()=>{var e,l,o,a,t,r,n,s,p,i,d,u,c,y;Re.deviceId=null==(e=ke.editOwnProxyIn
```

## POST /v2/newbrowser/cloud-accounts/putPublicInfo

- Client name: `putPublicInfoYun`
- Candidate request keys: _none parsed_

```text
Channel||Y.ipinfo,inspect:V.API_FAIL,publicIp:d.proxy.proxyData.publicip,country:"",city:""}]}:{getIpInfos:[{accountId:d.basic.yunShopid,ipChannel:d.proxy.ipChannel||Y.ipinfo,inspect:e.data.code,publicIp:d.proxy.proxyData.publicip,country:"",city:""}]},await f.putPublicInfoYun(a)})(e)}Qe(!1),e&&m.push("/yunBrowser/yunControl")},sa=async(e=!1,a=!1)=>{(()=>{let e;if(P.value)e=h.newBrowser_singleAdd_sure;else if(C.value)e=g.newBrowser_batchAdd_sure;else{if(!E.value)return;e=_.cloud_createEnv_submitPay}j(e,k.path)})(),((e=!1)=>{var a,l,t,o,n,i,r,s,c,u,p,v,y,f,m,h,g,_,x,w;if(!d.basic.name)return co
```

## POST /v2/newbrowser/cloud-accounts/setproxytoshop

- Client name: `deviceBindAccount_Yun`
- Candidate request keys: `proxy`, `shopProxy`

```text
pe)).map((a=>{var l;const o=le(e.params.proxy);return"official"===y.editProxyType&&4===y.editProxyInfo.cloud_type&&(o.socks5=a.proxy.socks5,o.region=a.proxy.region,o.regionArr=null==(l=a.proxy)?void 0:l.regionArr),{proxy:o,shopid:a.shopid}}));if(200===(await k.deviceBindAccount_Yun({proxy:e.params.proxy,shopProxy:a})).code)return"OK"},Pe=async()=>{b("save"),C.value=!0,$.value=!0;const e=await he(),a=await Promise.all([we(e),_e(e)]);C.value=!1,$.value=!1,"OK"===a[0]&&"OK"===a[1]?(A.value=!1,R.success(window.t("bindSuccess")||"绑定成功"),b("success")):"bindEnvPackgeFail"===y.failKey?B.getInstance().
```

## POST /v2/newbrowser/cloud-accounts/update

- Client name: `yunBrowserCloudAccountsUpdate`
- Candidate request keys: `browser`, `restart`

```text
de&&(pe.value=!0)})(o.data.order_no);if("success"!==e)return ge(_e.yunEnvCreate_error_submitPay,k.path,{info:JSON.stringify(o.data.order_no),message:JSON.stringify(e)}),void Qe(!1);Aa.success("购买成功")}catch{return void Qe(!1)}}else if(B.value){if(200!==(await f.yunBrowserCloudAccountsUpdate({browser:t.browser,restart:a?1:0})).code)return void Qe(!1);Aa.success("修改成功")}if(u.getPlatform===Ca.WINDOWS&&d.proxy.proxyType!==b.local){const e=await $a(d.proxy.proxyType,d.proxy.proxyData);await(async e=>{let a={};a=0===(null==e?void 0:e.code)?{getIpInfos:[{accountId:d.basic.yunShopid,ipChannel:d.proxy.i
```

## POST /v2/newbrowser/cloud-browser/visit

- Client name: `cloudBrowserVisit`
- Candidate request keys: `id`

```text
await B.value.newPage()),Tt(),(async()=>{var t,e;W.value&&!(null==(t=W.value)?void 0:t.isClosed())&&(V.value=await(null==(e=W.value)?void 0:e.evaluate((()=>/Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)))))})(),(()=>{const t={id:C.value};p.cloudBrowserVisit(t)})()},Xt=async()=>{Rt(!0),ot.value=!1};r([()=>w.deviceWidth,()=>w.deviceHeight],(()=>{Tt()}));const Et=t=>(t.preventDefault(),t.stopPropagation(),!1),Dt=t=>{const e={sessionId:"",apiKey:"",token:""};return Object.keys(e).forEach((i=>{const n=((t,e)=>{let i="";if(e.indexOf(t)>-1){const n=e.split("?")[2]||"";i=new URLSe
```

## POST /v2/newbrowser/configpersonalsettings

- Client name: `configPersonalSettings`
- Candidate request keys: `batch_start`, `search_engine`, `language`, `starting_env`

```text
={class:"setting-plugin"},pe={class:"content"},Ae={class:"content-box"},me=d({__name:"personalPreference",setup(l){const{settingStore:s}=r(),t=T("$api"),n=H();u(n.path);const i=m([]),o=m([]),d=m([]),p=m(""),A=m(""),V=m(),b=P((()=>e)),I=async e=>{200===(await t.configPersonalSettings({batch_start:A.value})).code?(s.startupRules=A.value,k.success(window.t("setPlugin.setSuccess")||"设置成功")):k.error(window.t("setPlugin.setFail")||"设置失败"),C(e)},C=e=>{let a="";"1"===e?a="依次启动":"2"===e&&(a="并行启动"),c(g.set_personalPreference_selectBatchStartRule,n.path,a)},Q=async()=>{const e=d.value.find((e=>e.site===
```

## POST /v2/newbrowser/configsettings

- Client name: `configSettings`
- Candidate request keys: `device_authorities`, `bind_proxy`, `expired_display`, `storage`, `risk_control`, `monitoring`, `env_multi_open`, `load_image`, `load_image_max_size`, `play_sound`, `enable_gc`, `gc_time`, `enable_clear_storage`

```text
sync(e,a,l)=>{if(a.value=!0,m.value.device_authorities){const{user:e}=F();if(200!==(await t.syncNoAutoAuthority({companyId:e.companyData.companyId})).code)return a.value=!1,l.value=!1,void(m.value.device_authorities=!m.value.device_authorities)}const s=await t.configSettings({device_authorities:m.value.device_authorities?1:2});a.value=!1,l.value=!1,200===s.code?(K.success(window.t("setSuccess")||"设置成功"),n.device_authorities=m.value.device_authorities?1:2,D(R.set_teamPreference_deviceAuthorities,i.path,m.value.device_authorities?"开启":"关闭")):m.value.device_authorities=!m.value.device_authorities
```

## POST /v2/newbrowser/creatbatchaddxlsxuuid

- Client name: `addxlsxuuid`
- Candidate request keys: `import_type`

```text
oe(!1),n=oe(!1),s=oe(["allProxy","name","account","Cookies"]),i=ke(),c=oe({}),d=oe([]),m=ue({usednumb:0,packagenumb:0}),v=oe([]);q((()=>v.value.slice(0,2)));const y=q((()=>v.value.slice(2))),g=e=>{0===e&&(v.value=[],t.value=void 0),l.value=e},w=oe(""),k=()=>{o.addxlsxuuid({import_type:1}).then((e=>{var o;200===e.code&&(w.value=null==(o=null==e?void 0:e.data)?void 0:o.import_key)}))},x=oe([]),b=oe([]),_=e=>{U(e),x.value=e},U=e=>{e.forEach((e=>{e[a.proxy]&&(e[a.proxy]=C(e[a.proxy]))}))},C=e=>e.includes("://")?e.split("://")[1]:e,S=e=>{b.value=e},V=(e,l)=>{o.addxlsxPost({list:e,kernelVersion:l,ke
```

## POST /v2/newbrowser/createUserPassword

- Client name: `createUserPassword`
- Candidate request keys: _none parsed_

```text
me:q.value.name,user_name:q.value.account,password:q.value.password,remark:q.value.remark,user_password_id:q.value.user_password_id,platform_lock:q.value.platform_lock?1:0,tfa:q.value.tfa}]};let l;y.value=!0,l=h.rowData?await k.updateUserPassword(e,!0):await k.createUserPassword(e,!0),y.value=!1,200===l.code?h.rowData?P("editSuccess",l.data[0]):P("addSuccess",l.data[0]):409===l.code&&r.warning("该平台已存在该账号")};return v({checkIsEmpty:()=>!(h.rowData||q.value.platformId||q.value.customPlatformId||q.value.name||q.value.account||q.value.password||q.value.remark||q.value.platform_lock||q.value.tfa),co
```

## POST /v2/newbrowser/deletegroups

- Client name: `delefenzu`
- Candidate request keys: `groupid`

```text
e,I.path):2===e&&d(c.env_groupManage_batchDelete,I.path)},Te=()=>{var e,o;if(1===ne.value){if(ce.value&&(null==(e=ce.value)?void 0:e.system_group)>0)return void t({message:window.t("systemGroupWarn")||"系统分组不能删除",type:"warning"});o=ce.value.gropid,ae.value=!0,Q.delefenzu({groupid:[o]}).then((e=>{ae.value=!1,200===e.code?(t({message:window.t("deleteGroupSuccess")||"删除分组成功",type:"success"}),re.value="",we(),J("deleteSuccess")):t({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})})).catch((()=>{ae.value=!1,t({message:window.t("deleteGroupFail")||"删除分组失败",type:"error"})}))}2===ne.value&&
```

## POST /v2/newbrowser/deleteUserPassword

- Client name: `deleteUserPassword`
- Candidate request keys: `user_password_ids`, `title`, `text`

```text
er:!0,text:`${window.t("confirmDelete2")||"确认删除当前账号吗"}?`,confirmText:window.t("confirm")||"确定"};O.confirm(a,(async(a,l,t)=>{H(L.team_accManage_deleteAccount_sure,m.path),l.value=!0,await(async e=>{const a={user_password_ids:[e.user_password_id]};200===(await x.deleteUserPassword(a)).code&&(K.success(window.t("deleteSuccess")||"删除成功"),Z())})(e),l.value=!1,t.value=!1}))},E=l([]),Y=e=>{const a=E.value.find((a=>a.userId===e));return a?a.name:"-"},Q=l([]),W=l(!1),Z=async()=>{console.log(y.searchInfo),await(async()=>{const e={name:D.value.name,user_name:D.value.account,remark:D.value.remark,platform
```

## POST /v2/newbrowser/getallfonts

- Client name: `getfontlist`
- Candidate request keys: `system`

```text
=>{(async()=>{let e="";a.basic.system.includes("Windows")?e="Windows":a.basic.system.includes("MacOS")?e="MacOS":a.basic.system.includes("Linux")?e="Linux":a.basic.system.includes("Android")?e="Android":a.basic.system.includes("IOS")&&(e="IOS");const t=await i.getfontlist({system:e});if(200===t.code){const e=t.fonts,i=t.randomFonts.filter((t=>!e.includes(t)));r.value=e.map((e=>({name:e,must:!0,checked:!0})));const o=l.selectFontList||[];c.value=i.map((e=>({name:e,must:!1,checked:o.includes(e)}))),p.value=[...r.value,...c.value]}})()})),(e,t)=>{const l=u;return d.value?(M(),R(se,{key:0,modelVal
```

## POST /v2/newbrowser/getalluri

- Client name: `getplatform`
- Candidate request keys: `fatherclass`

```text
.findIndex((e=>e===xe.value));return-1!==e?Ce.value[e]:""})(),O.value=a}else if(e.platform_id){const a=`${e.login_url}`;E.value=e.platform_id,A.value="",pe.value="",O.value=a}ye.value=he,ge("select",e),Se.value="None"},la=async()=>{Ne.value=!0;const e=await me.getplatform({fatherclass:ke.value});Ne.value=!1,200===e.code&&(we.value=e.childclass,Ce.value=e.childicon,xe.value=we.value[0])},ta=async()=>{Ie.value=!0;const e=await me.getplatform({fatherclass:ke.value,childclass:xe.value});Ie.value=!1,200===e.code&&(De.value=e.grandsonclass||[],De.value.forEach((a=>{a.fatherclass=e.fatherclass[0]})),
```

## POST /v2/newbrowser/getalluserselfuri

- Client name: `getalluserself`
- Candidate request keys: `company`, `companyid`, `userid`

```text
therclass=e.fatherclass[0]})),console.log("siteList.value",De.value))},sa=D({}),oa=p([]),ua=(e,a)=>{e&&(oa.value[a]=e)},ia=async()=>{const e={company:fe.companyData.name,companyid:fe.companyData.companyId,userid:fe.userData.userId};Ie.value=!0;const a=await me.getalluserself(e);if(Ie.value=!1,200===a.code){const e=a.self;e.sort(((e,a)=>{const l=new Date(e.created_at),t=new Date(a.created_at);return isNaN(l.getTime())||isNaN(t.getTime())?(console.warn("Invalid date detected"),0):t-l})),be.value=e,P((()=>{oa.value.forEach(((e,a)=>{e&&(sa[a]=e.scrollWidth>e.clientWidth)}))}))}},na=async()=>{var e
```

## POST /v2/newbrowser/getauthshopbriefinfolist

- Client name: `getauthshopbriefinfolist`
- Candidate request keys: `page`, `pageSize`, `groupid`, `name`, `sortorder`

```text
serPasswordList({user_password_ids:e.userPasswordIds});200===l.code&&(e.accList=l.data||[])})(e)}))},Be=a([]),qa=async()=>{const e={page:ne.value.pageIndex,pageSize:ne.value.pageSize,groupid:Ha.value,name:ae.value,sortorder:te.value};C.value=!0;const a=await k.getauthshopbriefinfolist(e);C.value=!1,200===a.code&&(Ie.value=a.data.list||[],ne.value.total=a.data.total||0,Ie.value.forEach((e=>{e._envType="local","official"===e.proxy.inlie&&4===e.proxy.product&&(e.proxy.region?e.proxy.regionArr=e.proxy.region.split("-"):(e.proxy.region="random-random-random",e.proxy.regionArr=["random","random","ra
```

## POST /v2/newbrowser/getautomac

- Client name: `getMac`
- Candidate request keys: _none parsed_

```text
)}))}))},getgroups(e){return new Promise(((t,n)=>{const{groupSort:o}=iA();oA.getgroups(e).then((e=>{this.groupslist=o(e.group),this.groupsStaus=!0,t(e)})).catch((e=>{n(e)}))}))},addslectfingerprint(e){this.slectfingerprint=e},getMac:()=>new Promise(((e,t)=>{oA.getMac().then((t=>{e(t.mac)})).catch((e=>{t(e)}))})),changeaccount(e){this.form=e}}}),sA=po("rpa",{state:()=>({status:!0,connectStatus:!1}),getters:{getStatus(){return this.status},getConnectStatus(){return this.connectStatus}},actions:{initRpa(e,t){if(e){const n=localStorage.getItem(`thread${e.userId+e.companyId}`),o=localStorage.getIte
```

## POST /v2/newbrowser/getbatchaddxlsxlist

- Client name: `getxlsxlist`
- Candidate request keys: `import_key`, `import_status`, `import_type`

```text
,emit:n}){const{useLeftList:o,globalStore:r}=fL(),a=e,i=O("$api"),l=n,c=vo(),d=Fe(e,"modelValue"),f=s("LinkNone"),m=h((()=>"LinkProxy"===f.value?$E.Proxy_Platform:"LinkYunB"===f.value?$E.Expense_YunBRecharge:"LinkSet"===f.value?$E.AccSet:void 0)),v=e=>{var t;i.getxlsxlist({import_key:null==(t=a.currentData)?void 0:t.importKey,import_status:e}).then((t=>{if(200===t.code){const n=(null==t?void 0:t.data)||[];if(0===(null==n?void 0:n.length))oS.error("暂无记录");else{const t=(null==n?void 0:n.length)>0?n[0]:{},o=[];if((null==n?void 0:n.length)>1)n.forEach(((e,n)=>{if(n>0){const n={};Object.keys(e).for
```

## POST /v2/newbrowser/getbatchaddxlsxprocess

- Client name: `getxlsxprocess`
- Candidate request keys: `import_key`

```text
sole.warn("数组中包含非数组元素:",e),!1;if(""===e[a.proxyType]&&""===e[a.proxy])return!0;if("本地"===e[a.proxyType])return!0;const l=e[a.proxyType]+"://"+C(e[a.proxy]);return""===l||!o.has(l)&&(o.set(l,!0),!0)}))},F=ue({timeout:"",successNum:0,failNum:0,total:0}),A=()=>{o.getxlsxprocess({import_key:w.value}).then((e=>{var o,l,a,t,r;if(200===e.code){1!==(null==(o=null==e?void 0:e.data)?void 0:o.finished)?F.timeout=setTimeout((()=>{A()}),2e3):(F.successNum=null==(l=null==e?void 0:e.data)?void 0:l.success,F.failNum=null==(a=null==e?void 0:e.data)?void 0:a.fail,F.total=null==(t=null==e?void 0:e.data)?void 0:t
```

## POST /v2/newbrowser/getBindUserPassword

- Client name: `getBindUserPassword`
- Candidate request keys: `user_password_id`, `pageSize`

```text
){const a=w(e.group||[]);a.unshift({name:window.t("allGroup")||"全部分组",gropid:""}),ee.value=a}})(),await J(),Array.isArray(m.curOperateData)||(await(async()=>{const e={user_password_id:m.curOperateData.user_password_id,pageSize:10086};U.value=!0;const a=await b.getBindUserPassword(e);U.value=!1,200===a.code&&(R.value=(a.shopinfo||[]).map((e=>e.shopid)))})(),O())})),(e,a)=>{const l=le,s=te,m=G,g=z,w=F,h=j;return t(),o("div",ia,[y.value?(t(),d(Q,{key:0,modelValue:y.value,"onUpdate:modelValue":a[2]||(a[2]=e=>y.value=e),width:"800px",title:e.$t("绑定环境"),okLoading:_(I),onClose:P,onCancel:$,onConfirm:
```

## POST /v2/newbrowser/getconditionshops

- Client name: `getaccountlist`
- Candidate request keys: `companyid`, `userid`, `enable`, `offer`, `currentPage`, `number`, `browserid`, `l`, `self`, `transfers`, `share`, `authorities`, `groupid`

```text
尝试重新启动该环境`)}}}else e._envValidReason=D(e.envValid,e)};let gl=da([]);const yl=async()=>{if(2===fl.value&&0===ee.value.length)return gl.value=[],K.value=!0,void(Ka.value.total=0);try{B.shutdownPool();const e=ee.value.map((e=>e.shopId));F.value=!0;const a=await j.getaccountlist({...rl(),companyid:se.companyData.companyId,userid:se.userData.userId,enable:1,offer:0===Ka.value.currentPage?Ka.value.currentPage:Ka.value.page_size*(Ka.value.currentPage-1),number:Ka.value.page_size,browserid:2===fl.value?e:[],self:3===fl.value,transfers:4===fl.value,share:5===fl.value,authorities:6===fl.value,open_by_ot
```

## POST /v2/newbrowser/getCookie

- Client name: `getCookie`
- Candidate request keys: `shopid`

```text
|n.nextsystem.Linux;this.basic.system=o,this.basic.uaVersion=n.UAversion,this.basic.ua=n.ua,this.updateFingerInfo(e)},async getFingerInfo(e,t,n,o=!1){let r;if(n)r=await oA.yunBrowserAccountsFingerGet(e);else{const t=[oA.getfingerprin(e)];e.shopid&&o&&t.push(oA.getCookie({shopid:e.shopid}));const n=await Promise.all(t);r=n[0],n[1]&&200===n[1].code&&(r.browseinfo.accounts.cookie=n[1].data)}return console.log("getFingerInfo-指纹信息是",r,t,e),200===r.code?(t===fE.Refresh_All?this.updateAllFingerInfo(r):t===fE.Refresh_SystemChange?this.updateSystemChangeInfo(r):t===fE.Refresh_PlatChange?this.updatePlat
```

## POST /v2/newbrowser/getdefaultfingerlist

- Client name: `getfingerlist`
- Candidate request keys: `system`, `kernel`, `kernelVersion`, `company`, `companyid`, `userid`

```text
>!!e&&e.toLowerCase().includes(t)}}const lA=po("useLeftList",{state:()=>({fingerprintlist:{},getfingerprinlist:{name:"333"},browseinfo:{},slectfingerprint:{},groupslist:[],form:[],groupsStaus:!1}),actions:{async getfingerprint(e){return new Promise(((t,n)=>{oA.getfingerlist(e).then((e=>{const{code:n=0,kernelversion:o=[]}=e;200===n&&fL(),this.fingerprintlist=e,t(e)})).catch((e=>{n(e)}))}))},async getfingerprin(e,t=!1){return new Promise(((n,o)=>{oA.getfingerprin(e).then((e=>{this.getfingerprinlist=e.defaultfingerprint,t||(console.log("url",e.browseinfo),this.browseinfo=e.browseinfo,this.form&&t
```

## POST /v2/newbrowser/getfingerprinturi

- Client name: `getfingerprin`
- Candidate request keys: `shopid`, `company`, `companyid`, `userid`

```text
:!1}),actions:{async getfingerprint(e){return new Promise(((t,n)=>{oA.getfingerlist(e).then((e=>{const{code:n=0,kernelversion:o=[]}=e;200===n&&fL(),this.fingerprintlist=e,t(e)})).catch((e=>{n(e)}))}))},async getfingerprin(e,t=!1){return new Promise(((n,o)=>{oA.getfingerprin(e).then((e=>{this.getfingerprinlist=e.defaultfingerprint,t||(console.log("url",e.browseinfo),this.browseinfo=e.browseinfo,this.form&&this.form.label&&this.form.label.length>0&&(this.browseinfo.labelid=this.form.label.map((e=>e.id))),this.form&&this.form.group&&this.form.group.name&&(this.browseinfo.categoryid=this.form.grou
```

## POST /v2/newbrowser/getfingerprinturiua

- Client name: `getfingerua`
- Candidate request keys: `kernel`, `kernelversion`, `system`, `UAversion`

```text
else{if(!b.value)return;a=_.cloud_createEnv_selectOperateSys}x(a,d.path)},U=async()=>{if(p.value||b.value)return void(s.basic.ua="");const e={kernel:s.basic.kernel,kernelversion:s.basic.kernelVersion,system:s.basic.system,UAversion:s.basic.uaVersion},a=await n.getfingerua(e);200===a.code&&(s.basic.ua=a.UA)},R=()=>{let e;if(c.value)e=h.newBrowser_singleAdd_selectUaVersion;else if(p.value)e=g.newBrowser_batchAdd_selectUaVersion;else{if(!v.value)return;e=_.cloud_createEnv_selectUaVersion}x(e,d.path)},M=()=>{let e;if(console.log("内核类型改变",s.basic.kernelVersion),s.basic.uaVersion=s.basic.kernelVersi
```

## POST /v2/newbrowser/getgroups

- Client name: `getgroups`
- Candidate request keys: `company`, `companyid`, `userid`

```text
&(this.browseinfo.labelid=this.form.label.map((e=>e.id))),this.form&&this.form.group&&this.form.group.name&&(this.browseinfo.categoryid=this.form.group.groupid)),n(e)})).catch((e=>{o(e)}))}))},getgroups(e){return new Promise(((t,n)=>{const{groupSort:o}=iA();oA.getgroups(e).then((e=>{this.groupslist=o(e.group),this.groupsStaus=!0,t(e)})).catch((e=>{n(e)}))}))},addslectfingerprint(e){this.slectfingerprint=e},getMac:()=>new Promise(((e,t)=>{oA.getMac().then((t=>{e(t.mac)})).catch((e=>{t(e)}))})),changeaccount(e){this.form=e}}}),sA=po("rpa",{state:()=>({status:!0,connectStatus:!1}),getters:{getSta
```

## POST /v2/newbrowser/getgroupusers

- Client name: `getgroupusers`
- Candidate request keys: `groupid`

```text
=>{e(a),xe.value=!1}))})),na=()=>{Ae.value||5!==k.type&&"group"!==Ee.value||(Ve.page+=1,ra())},da=async e=>{let a;a=5!==k.type&&"group"===Ee.value?Re.value.map((e=>e.gropid)):k.form.groupIds||[],e||(Q.value=!0),1===a.length?await Promise.all([Ne((()=>{}),!0),N.getgroupusers({groupid:a[0]}),ra(),qe()]).then((([l,t,s,u])=>{if(console.log("initGroupAuthInfo_:",t),t&&200===t.code){const e=[];a.forEach((a=>{for(let l=0;l<Pe.length;l++)if(Pe[l].gropid===a){e.push(Pe[l]);break}})),Re.value=e;const l=(t.userlist||[]).map((e=>e.userid));Ke=l,Be(l)}Le(),e||(Q.value=!1)})).catch((a=>{console.log("initGro
```

## POST /v2/newbrowser/getiduserlist

- Client name: `getUseCountByProxyId`
- Candidate request keys: `deviceid`, `company`, `companyid`, `userid`, `selfid`

```text
ip_place:a,userid:o.userData.userId,companyid:o.userData.companyId};J.value=!0;const i=await L.getPlatformProxyList(t);J.value=!1,200===i.code&&(O.value=i.data.data||[],na.value.total=i.data.total)})(),(async()=>{const e=O.value.map((e=>e.device_id)),a=await L.getUseCountByProxyId({deviceid:e});if(200===a.code){const e=a.device;e&&e.length>0&&e.forEach((e=>{const a=O.value.find((a=>e.id===a.device_id));a&&(a.envCount=e.number)}))}const l=await L.getUseCountByProxyId_Yun({deviceid:e});if(200===l.code){const e=l.device;e&&e.length>0&&e.forEach((e=>{const a=O.value.find((a=>e.id===a.device_id));a
```

## POST /v2/newbrowser/getLatestOpenAccountIdList

- Client name: `getLatestOpenAccountId`
- Candidate request keys: `num`

```text
serInfo:!1,guideing20250306:!1,NewYear2025Show:!1,portStatus:!1,userHasMobile:!1}),actions:{async getValidEnvNum(){const e=await oA.getUsermeal({});if(200===e.code){let t=e.data.environment_number;this.validEnvNum=t}},async getCanOpenEnvList(){const e=await oA.getLatestOpenAccountId({num:this.validEnvNum});200===e.code&&(this.validEnvList=e.data.accountIds||[])},async getUserAuthStatus(){const e=await oA.authenticationGet({});200===e.code&&(this.userStatus=e.data.userStatus,this.companyStatus=e.data.companyStatus)},async registerUser(){var e;const{default:t}=await ko((()=>Promise.resolve().the
```

## POST /v2/newbrowser/getpackageinfo

- Client name: `getpackageinfo`
- Candidate request keys: _none parsed_

```text
getUsermeal({});if(200!==e.code)return;const t=await oA.getMembers({pageSize:1,pageIndex:1,leave:3});if(200!==t.code)return;nN.value={num1:e.data.expired?1:e.data.member_number,num2:t.data.count||0,type:1},tN.value=!0}})()}),500)},iN=async()=>{const e=await oA.getpackageinfo({});return 200===e.code&&(nN.value={num1:e.packagenumb,num2:e.usednumb,type:2},e.usednumb>=e.packagenumb&&(tN.value=!0)),{upgradesVisible:tN,upgradesInfo:nN}},lN=(e,t)=>{let n=0,o=(null==V7?void 0:V7.path)||"";return p((()=>{n=Date.now()})),H((()=>{const r=Date.now(),a={eventType:DP.PageView,elementId:"",eventId:"",session
```

## POST /v2/newbrowser/getrecycleshoplist

- Client name: `getrecycleshoplist`
- Candidate request keys: `categoryId`, `accountName`, `page`, `pageSize`, `transfers`

```text
"),{user:o}=s(),i=G(!1),r=G(),c=G(),d=G([]),u=G(!1),p=e=>{d.value=e,console.log(d.value)},B=G([]),H=G({currentPage:0,total:0,page_size:Number(localStorage.getItem(A.SizeKey_EnvRecycle))||20}),U=G(!1),F=async()=>{try{i.value=!0;const{code:e=0,data:a={}}=await l.getrecycleshoplist({categoryId:u.value?"":r.value,accountName:c.value||"",page:H.value.currentPage,pageSize:H.value.page_size,transfers:u.value||void 0}),{list:t=[],total:o=0}=a;200===e?(t.forEach((e=>{const a=e.label||[];e.label=a.filter((e=>{const{id:a="",name:t=""}=e;return a&&t}))})),B.value=t,H.value.total=o):(B.value=[],H.value.tot
```

## POST /v2/newbrowser/getsettings

- Client name: `getSettings`
- Candidate request keys: _none parsed_

```text
n))),a=a.filter((e=>!["technical-assistance","rpa-1"].includes(e.icon))),i=i.filter((e=>!["technical-assistance","rpa-1"].includes(e.icon))),a.forEach((e=>{aE(e)})),i.forEach((e=>{aE(e)})),A.headerBtnList_left=a,A.headerBtnList_right=i}})(),(async()=>{await oA.getSettings({}).then((e=>{e&&200===e.code&&P.$patch((t=>{var n,o,r,a,i,l,s,c;t.startupRules=""===(null==(n=e.personalSettings)?void 0:n.batch_start)?"2":e.personalSettings.batch_start,t.dnsStatus=(null==(o=e.globalSettings)?void 0:o.dns)?null==(a=JSON.parse(null==(r=e.globalSettings)?void 0:r.dns))?void 0:a.status:3,t.bind_proxy=null==(i
```

## POST /v2/newbrowser/getShopAndAuthList

- Client name: `getShopAndAuthList`
- Candidate request keys: `shopid`

```text
)).catch((e=>(console.error("Failed to copy text: ",e),!1))),It=(e,o)=>(null==e?void 0:e.shopid)?[e.shopid]:o.map((e=>null==e?void 0:e.shopid)).filter(Boolean),kt=async e=>{const o=[...new Set(e.filter(Boolean))];if(0===o.length)return null;try{const e=await d.getShopAndAuthList({shopid:o});if(200!==(null==e?void 0:e.code))return null;const t=((e,o)=>{if(!Array.isArray(null==o?void 0:o.accountIds))return null;const t=new Set(o.accountIds);return e.filter((e=>!t.has(e)))})(o,e.data);return null===t?null:!(t.length>0)||(go.warning(`环境不存在：${t.join("、")}`),fo.emit(yo.FRESH_SHOPS),!1)}catch{return
```

## POST /v2/newbrowser/getshopbriefinfolist

- Client name: `getshopbriefinfolist`
- Candidate request keys: `page`, `pageSize`

```text
page_size:10}),h=new Set,y=new Set,_=e=>{m.value=e},I=e,D=V(),$=P({get:()=>I.visible,set:e=>{r("update:visible",e)}}),k=()=>{const e={page:f.value.currentPage,pageSize:f.value.page_size};u.value&&(e.name=u.value);const a=p.value||"";a&&"0"!==a&&(e.groupid=a),c.getshopbriefinfolist(e).then((e=>{const{code:a=0,data:l={}}=e;200===a&&(d.value=l.list||[],f.value.total=l.total||0,ae((()=>{(()=>{const{userId:e=""}=I.rowData;d.value.forEach(((a,l)=>{var t;const n=a.shopid||"";y.add(n);const o=a.authorized||[];for(let s=0;s<o.length;s+=1){const{userid:a="",group:i}=o[s];if(0===i&&a.toUpperCase()===e.to
```

## POST /v2/newbrowser/getshopconfigrpa

- Client name: `getaccountinfo`
- Candidate request keys: `shopid`

```text
st[0].userId}].concat(e.list))})).catch((e=>{console.log(e)})),await Te(),z.edit&&(console.log("props.itemData",z.itemData),re.value=JSON.parse(JSON.stringify(z.itemData)),(()=>{const e={},a={shopid:re.value.account.map((a=>(e[a.shopid]=a.serial,a.shopid)))};Z.getaccountinfo(a).then((a=>{console.log("res",a),200===a.code&&(re.value.account=a.shopconfig.map((a=>{const t=a;return t.serial=e[a.shopid]||t.serial,t})))})).catch((e=>{console.log(e)}))})(),E((()=>{(()=>{const{configId:e,rpaName:a}=re.value;fe.value.some((a=>a.configId===e))||fe.value.unshift({configId:e,rpaName:a})})()}))),ie.value=!
```

## POST /v2/newbrowser/getshopfromproxy

- Client name: `getshopfromproxy`
- Candidate request keys: `company`, `companyid`, `userid`, `deviceid`, `offer`, `number`

```text
o&&((async()=>{var e,l,o;Ce.value=!0;const a={company:y().user.companyData.companyName,companyid:y().user.companyData.companyId,userid:y().user.userData.userId,deviceid:null==(e=ke.editOwnProxyInfo)?void 0:e.deviceid,offer:0,number:1e3},t=await Promise.all([Se.getshopfromproxy(a),Se.getshopfromproxy_Yun(a)]),r=t[0],n=t[1];Ce.value=!1,200===r.code&&(null==(l=null==r?void 0:r.shopinfo)?void 0:l.length)>0&&(De.value=r.shopinfo||[]),200===n.code&&(null==(o=null==n?void 0:n.shopinfo)?void 0:o.length)>0&&(De.value=[...De.value,...n.shopinfo])})(),(()=>{var e,l,o,a,t,r,n,s,p,i,d,u,c,y;Re.deviceId=nul
```

## POST /v2/newbrowser/getuserauthshops

- Client name: `getuserauthshops`
- Candidate request keys: `page`, `pageSize`, `userid`

```text
Id:"",phone:"",deptName:"",userId:""})}},emits:["update:visible"],setup(o,{emit:s}){const i=s,r=U("$api"),d=V({currentPage:0,total:0,page_size:10}),u=o,p=P({get:()=>u.visible,set:e=>{i("update:visible",e)}}),c=V([]),m=async()=>{try{const{code:e,data:a}=await r.getuserauthshops({page:d.value.currentPage,pageSize:d.value.page_size,userid:u.currentTableRow.userId});200===e&&(c.value=a.list||[],d.value.total=a.total)}catch(e){n(window.t("groupError")||"获取分组失败","error")}},v=e=>{d.value.currentPage=e,m()},b=e=>{d.value.page_size=e,m()};O((()=>u.visible),(e=>{e&&m()}),{immediate:!0});const g=U("getRo
```

## POST /v2/newbrowser/getUserPasswordList

- Client name: `getUserPasswordList`
- Candidate request keys: `name`, `user_name`, `remark`, `page`, `pageSize`, `platformLock`, `bind`, `platform_name`, `platform_id`

```text
包含"}],ea=V({name:"",account:"",remark:""}),la=V(!1),oa=async()=>{await(async()=>{const a={name:ea.value.name,user_name:ea.value.account,remark:ea.value.remark,page:I.value.pageIndex,pageSize:I.value.pageSize,platformLock:-1,bind:-1};la.value=!0;const e=await u.getUserPasswordList(a);if(la.value=!1,200===e.code){const a=e.data.list||[];f.value=a.map((a=>{const{login_url:e,platform_icon:l,platform_name:o}=a.userPasswordPlatforms||{};return{...a,login_url:a.login_url||e,platform_icon:a.platform_icon||l,platform_name:a.platform_name||o,authority:3}})),I.value.total=e.data.total}})(),(()=>{const a=
```

## POST /v2/newbrowser/getUserPasswordRecycleList

- Client name: `getUserPasswordRecycleList`
- Candidate request keys: _none parsed_

```text
]),p=e=>{d.value=e,console.log(d.value)},v=P([]),R=P({total:0,page:1,pageSize:Number(localStorage.getItem(g.SizeKey_AccountRecycle))||20}),S=P(!0),j=async(e=!1)=>{S.value=e||!1,setTimeout((()=>{S.value=!1}),700);try{r.value=!0;const{code:e=0,data:a={}}=await t.getUserPasswordRecycleList(R.value),{list:l=[],total:s=0}=a;200===e?(v.value=l||[],R.value.total=s):(v.value=[],R.value.total=0)}finally{r.value=!1}},I=[{value:"name",label:window.t("nameC")||"名称",relation:"1",relationText:window.t("contain")||"包含"},{value:"platform_name",label:window.t("platformInformation")||"平台信息",relation:"1",relatio
```

## POST /v2/newbrowser/migrate/generateuuid

- Client name: `generateuuid`
- Candidate request keys: `platform_id`, `custom_platform_id`, `name`, `num`

```text
0/60),s=a%60;e<0&&(e=0),l<0&&(l=0),s<0&&(s=0),da.value=e,va.value=l,pa.value=s},ba=async()=>{if(0===ta.value.length)return void i(window.t("inputName")||"请输入名称","warning");if(!ia.value)return void i(window.t("pleaseSetNum")||"请设置数量","warning");const a=await sa.generateuuid({platform_id:ga.value,custom_platform_id:fa.value,name:ta.value,num:ia.value});if(200===a.code){ua.value.length>0&&(ua.value=[]),na.value=a.data,a.data.forEach((a=>{ua.value.push(a.uuid)}));let e=a.data[0].remainder;0===e&&(e=86400),ha(e),ra.value&&clearInterval(ra.value),ra.value=setInterval((()=>{ha(e),e--}),1e3),console.l
```

## POST /v2/newbrowser/migrate/searchuuid

- Client name: `searchuuid`
- Candidate request keys: `uuids`, `pageSize`

```text
ata,a.data.forEach((a=>{ua.value.push(a.uuid)}));let e=a.data[0].remainder;0===e&&(e=86400),ha(e),ra.value&&clearInterval(ra.value),ra.value=setInterval((()=>{ha(e),e--}),1e3),console.log("生成的链接"),console.log(a),ca.value=setInterval((async()=>{const a=await sa.searchuuid({uuids:ua.value,pageSize:30});200===a.code&&(console.log("查到的状态是"),console.log(a),a.data.forEach((a=>{na.value.find((e=>a.uuid===e.uuid)).status=a.status})))}),3e3)}};return a(m.path),k((()=>{clearInterval(ca.value),clearInterval(ra.value)})),(a,o)=>{const c=n,r=u,d=w("tracking");return h(),b("div",V,[j("div",C,[y(e,{class:"ic
```

## POST /v2/newbrowser/newbieStepCreateShop

- Client name: `newbieStepCreateShop`
- Candidate request keys: _none parsed_

```text
ew Error(e.msg||"保存新手流程失败");return e},E=async()=>{if(!d.value)if(Mte(l.value))if(y.value)_A(y.value,"warning");else{d.value=!0;try{await Promise.all([S(),A()]);const e={skip:0,step:2,data:{platformId:"",platformType:1,accountId:(await(async()=>{const e=await n.newbieStepCreateShop();if(200!==e.code)throw new Error(e.msg||"本地环境创建失败");return e})()).accountId,cloudId:0,couponNo:"",officialDeviceId:"",selfDeviceId:"",orderNo:"",auth:"",startBrowserTime:""}};r(e),On?window.parent.location.href="https://www.yunlogin.com/download":o.showProgress=!0}catch(e){_A((null==e?void 0:e.message)||"配置提交失败","er
```

## POST /v2/newbrowser/postBatchAddUserPassword

- Client name: `postBatchAccount`
- Candidate request keys: `list`, `kernelVersion`, `key`

```text
?void 0:e.length)){let e=M.value;w.value?b.value.forEach((a=>{const l=Le[a];e="account"===a?O(e):we(e,l)})):e=M.value;const a=he(y),l=(e=>{const a=[];return e.forEach((e=>{const l={};e.forEach(((e,a)=>{let t=xl[a];l[t]=String(e)})),a.push(l)})),a})(e);return u.postBatchAccount({list:l,kernelVersion:a,key:L.value}).then((e=>{if(200===e.code)Y();else if(4015===e.code)F.value=!1,B();else{F.value=!1;const a=_e(e.code)||window.t("errorCodeKey.FileUploadFailed");K({type:"error",message:a})}})).catch((e=>{F.value=!1,K({type:"error",message:window.t("errorCodeKey.FileUploadFailed")})})),""}return K({t
```

## POST /v2/newbrowser/postbatchaddxlsx

- Client name: `addxlsxPost`
- Candidate request keys: `list`, `kernelVersion`, `key`

```text
ar o;200===e.code&&(w.value=null==(o=null==e?void 0:e.data)?void 0:o.import_key)}))},x=oe([]),b=oe([]),_=e=>{U(e),x.value=e},U=e=>{e.forEach((e=>{e[a.proxy]&&(e[a.proxy]=C(e[a.proxy]))}))},C=e=>e.includes("://")?e.split("://")[1]:e,S=e=>{b.value=e},V=(e,l)=>{o.addxlsxPost({list:e,kernelVersion:l,key:w.value}).then((e=>{if(200===e.code)A();else if(4015===e.code)k(),R.value=!1;else{R.value=!1;const o=O(e.code)||window.t("errorCodeKey.FileUploadFailed");$.error(o)}})).catch((e=>{R.value=!1,$.error(window.t("errorCodeKey.FileUploadFailed"))}))},R=oe(!1),B=async()=>{var e;if(R.value=!0,Se(y.value,d
```

## POST /v2/newbrowser/proxy-batch-import

- Client name: `proxyBatchImport`
- Candidate request keys: `browsers`

```text
控安全，确定将环境的代理信息批量更新吗？")]),K("div",{},[K("span",{style:"font-size: 12px; color: #e6a23c;"},"如果无需此提醒，可至 设置-团队偏好-环境安全监控-高风险操作提醒 进行关闭。")])]},a=async(o,a,t)=>{t.value=!1,Ee(e,l)},t=async(e,l,o)=>{o.value=!1};u.confirm(o,a,t,t)}},Ee=(e,l)=>{je.value=!0,Be.value=!0,_e.proxyBatchImport({browsers:e}).then((e=>{200===e.code&&setTimeout((()=>{(async(e,l)=>{Ue.value=setInterval((async()=>{const o=await _e.proxyBatchImportRes({taskId:e});if(200===o.code&&!0===o.data.done){if(!Ae.value)return;clearInterval(Ue.value),je.value=!1,Be.value=!1,Ae.value=!1,p.success(window.t("modifySuccess")||"修改成功"),ge("success"
```

## POST /v2/newbrowser/proxy-batch-import-res

- Client name: `proxyBatchImportRes`
- Candidate request keys: `taskId`

```text
,a=async(o,a,t)=>{t.value=!1,Ee(e,l)},t=async(e,l,o)=>{o.value=!1};u.confirm(o,a,t,t)}},Ee=(e,l)=>{je.value=!0,Be.value=!0,_e.proxyBatchImport({browsers:e}).then((e=>{200===e.code&&setTimeout((()=>{(async(e,l)=>{Ue.value=setInterval((async()=>{const o=await _e.proxyBatchImportRes({taskId:e});if(200===o.code&&!0===o.data.done){if(!Ae.value)return;clearInterval(Ue.value),je.value=!1,Be.value=!1,Ae.value=!1,p.success(window.t("modifySuccess")||"修改成功"),ge("success",l.filter((e=>e.ischange)))}}),1300)})(e.data.taskId,l)}),1500)}))},Ne=j((()=>Ce.value.some((e=>{var l;return e.name!==e.oldName||"self
```

## POST /v2/newbrowser/putaddlabel

- Client name: `batchlabel`
- Candidate request keys: `info`, `id`, `shopid`, `label`

```text
alue.find((e=>e.labelid===a));if(e)return e.name},ba=a=>{const e=pa.value.find((e=>e.labelid===a));if(e)return F(e.color)},ha=a=>{const e=pa.value.find((e=>e.labelid===a));if(e)return U(e.color)},La=async()=>{ta("save"),da.value=!0,na.value=!0;const a=await sa.batchlabel((()=>{var a,e;const l={info:[]},s=null==(a=ra.value)?void 0:a.map((a=>({id:a})));return null==(e=la.selectedItemList)||e.forEach((a=>{l.info.push({shopid:a.shopid,label:s})})),l})());da.value=!1,na.value=!1,200===a.code&&(c(window.t("modifySuccess")||"修改成功","success"),ua.value=!1,ta("refresh"))},wa=async()=>{ta("save"),da.valu
```

## POST /v2/newbrowser/putaddnotes

- Client name: `BatchRemarks`
- Candidate request keys: `notes`, `shopid`

```text
p(l){const t=r("$api"),i=r("getaccount"),y=l,$=d(l,"modelValue"),B=n(y.editRowInfo.notes),A=n(!1),C=n(!1),S=()=>{if(B.value===y.editRowInfo.notes)return e.warning("请输入修改后的备注");A.value=!0,C.value=!0;const a={notes:B.value,shopid:[y.editRowInfo.shopid]};return t.BatchRemarks(a).then((a=>{200===a.code&&(i(),e.success(window.t("editSuccess")),$.value=!1)})).finally((()=>{A.value=!1,C.value=!1})),""};return(e,l)=>{const t=o,i=s;return m(),u(a,{modelValue:$.value,"onUpdate:modelValue":l[1]||(l[1]=a=>$.value=a),title:e.$t("editRemark"),width:"650px","ok-loading":C.value,onCancel:l[2]||(l[2]=a=>$.valu
```

## POST /v2/newbrowser/putalluri

- Client name: `foundaccount`
- Candidate request keys: _none parsed_

```text
=!0),v=l.data.ip,"local"!==d.proxy.proxyType&&(a.browser.proxy.PublicIP=l.data.ip),s=V.ONLINE),"object"==typeof l&&Object.prototype.hasOwnProperty.call(l,"code")&&-1===l.code&&l.data&&l.data.code&&(s=l.data.code)}if(Q)return}let _;if(P.value||A.value?_=await f.foundaccount(a):C.value&&(_=await f.batchCreateShop(a)),200!==_.code)return Qe(!1),void(16e3===_.code?ke():ne.getInstance().subscribe(oe.createEnvPackgeFail));A.value||(P.value?j(h.newBrowser_singleAdd_sureSuccess,k.path):j(g.newBrowser_batchAdd_sureSuccess,k.path));const x=()=>{var l,t;if(y===Ca.WINDOWS&&_.shopid&&_.shopid.length>0){con
```

## POST /v2/newbrowser/putchangegroup

- Client name: `changputchang`
- Candidate request keys: `company`, `companyid`, `userid`, `groupid`, `shopid`

```text
()?ae||(ae=r.service({target:".el-dialog",lock:!0}),Promise.all((()=>{const e={};se.value.forEach((a=>{Object.prototype.hasOwnProperty.call(e,a.gropid)?e[a.gropid].push(a.shopid):e[a.gropid]=[a.shopid]}));const a=[];return Object.keys(e).forEach((l=>{a.push(ee.changputchang({company:W.companyData.name,companyid:W.companyData.companyId,userid:W.userData.userId,groupid:l,shopid:e[l]}))})),a})()).then((e=>{ae&&(ae.close(),ae=null);-1!==e.findIndex((e=>200!==e.code))?I.error(window.t("editFail")||"编辑失败"):(I.success(window.t("editSuccess")||"编辑成功"),te.value=!1,le())})).catch((e=>{console.log("trans
```

## POST /v2/newbrowser/putdeleteallauthority

- Client name: `putdeleteallauthority`
- Candidate request keys: `userid`

```text
pids:i,usered:null==(o=v.rowData)?void 0:o.userId,touserid:s}).then((e=>{200===(null==e?void 0:e.code)&&$()})).catch((()=>{n(window.t("transferError")||"转移失败","error")})).finally((()=>{b.value=!1}))}else{const e=null==(s=v.rowData)?void 0:s.userId;b.value=!0,g.putdeleteallauthority({userid:e}).then((e=>{200===(null==e?void 0:e.code)&&$()})).catch((()=>{n(window.t("clearError")||"清空授权失败","error")})).finally((()=>{b.value=!1}))}return _.value=!0,!0};return(a,l)=>{const n=d,o=u,s=p,v=c,g=m;return B(),Q("div",null,[X(t,{visible:f.value,"onUpdate:visible":l[2]||(l[2]=e=>f.value=e),title:a.$t("delMe
```

## POST /v2/newbrowser/putdeleteauthority

- Client name: `putdeleteauthority`
- Candidate request keys: `company`, `companyid`, `userid`, `shopids`, `touserid`

```text
ue.map((e=>e.shopid))||[];const d=o.filter((e=>!s.includes(e)));s=s.filter((e=>!h.has(e)));let u=0;if(0===d.length&&0===s.length)return n(window.t("operateSuccess")||"操作成功","success"),void($.value=!1);if(!(s.length>0&&!0!==await pe(s))){if(d.length){u=(await c.putdeleteauthority({company:null==(e=i.companyData)?void 0:e.companyName,companyid:null==(a=i.companyData)?void 0:a.companyId,userid:null==(l=i.userData)?void 0:l.userId,shopids:d,touserid:null==(t=I.rowData)?void 0:t.userId})).code||0,200!==u&&n(window.t("cancelEmpowerError")||"取消授权失败","error")}if(s.length>0){const e={userid:I.rowData.u
```

## POST /v2/newbrowser/putdeletegroupauthority

- Client name: `putdeletegroupauthority`
- Candidate request keys: `groupid`

```text
5===k.type||(2===k.type||3===k.type)&&"group"===Ee.value?(Q.value=!0,await(async e=>{Re.value.forEach((a=>{e.share.push({companyid:"",userid:be.value.map((e=>e.userId)),groupid:a.gropid})}));let a={};a=be.value.length>0?await N.putusergroupauthority(e):await N.putdeletegroupauthority({groupid:Re.value.map((e=>e.gropid))}),200===a.code?(M&&M(),v(window.t("authSuccess")||"授权成功","success"),I.value=!1):v(window.t("authError")||"授权失败","warning")})(e)):($("sbmit",be.value),I.value=!1):(Q.value=!0,await(async e=>{2===k.type?e.share=[{companyid:"",userid:be.value.map((e=>e.userId)),shopid:k.form.shopi
```

## POST /v2/newbrowser/putdeleteshop

- Client name: `deleaccountlist`
- Candidate request keys: `company`, `companyid`, `userid`, `shopid`

```text
ue=n.map((e=>({shopid:e.shopid,company_id:e.company_id,serial:e.serial,name:e.name,reason:e.reason}))),H.value=!0,G.value=!1):s=null==(l=g.multipleSelection)?void 0:l.map((e=>e.shopid))}if(0===s.length)return;if(T.value)return;T.value=!0;const n=await L((()=>b.deleaccountlist({company:q.companyData.name,companyid:q.companyData.companyId,userid:q.userData.userId,shopid:s})),window.t("deleteSuccess")||"删除成功",window.t("deleteFail")||"删除失败",!0);if(T.value=!1,200===n.code){y()&&(async e=>{const a=!g.form,o=e.map((e=>{var o;return v(h.cleanEnv,{params:{is_fireFox:!a&&(null==(o=g.form)?void 0:o.kerne
```

## POST /v2/newbrowser/putdeleteshopfromrecycle

- Client name: `getdeleteshop`
- Candidate request keys: `shopid`

```text
cribe(p.recyleRevert),e=await r.getputrestoreshop({...a,shopid:c.multipleSelection.map((e=>e.account_id))}),p.recyleRevert.data.code=e.code,p.recyleRevert.data.error=`环境回收站批量回收失败-${e.msg}`),2===c.editInfo.type&&(u.getInstance().subscribe(p.recyleDel),e=await r.getdeleteshop({...a,shopid:[c.editInfo.id]}),p.recyleDel.data.code=e.code,p.recyleDel.data.error=`环境回收站删除失败-${e.msg}`),4===c.editInfo.type&&(u.getInstance().subscribe(p.recyleDel),e=await r.getdeleteshop({...a,shopid:c.multipleSelection.map((e=>e.account_id))}),p.recyleDel.data.code=e.code,p.recyleDel.data.error=`环境回收站批量删除失败-${e.msg}`),2
```

## POST /v2/newbrowser/putdeleteuserselfuri

- Client name: `delealluserself`
- Candidate request keys: `company`, `companyid`, `userid`, `platformid`

```text
.addalluserself(l)).code&&(s.success(window.t("addSuccess")),Be.value="",ia())},ca=p(!1),da=async e=>{const a=e.platform_id,l={company:fe.companyData.name,companyid:fe.companyData.companyId,userid:fe.userData.userId,platformid:[a]};ca.value=!0;const t=await me.delealluserself(l);if(ca.value=!1,200===t.code){const e=be.value.findIndex((e=>e.platform_id===a));-1!==e&&(be.value.splice(e,1),Pe.value=!1,s.success(window.t("deleteSuccess"))),a===E.value&&(A.value="",E.value="",pe.value="",O.value="",ye.value=he),ge("delCustomUrl",a)}},va=async()=>{if(await(async()=>{Le.value=!0;const e=await me.geta
```

## POST /v2/newbrowser/putmoveauthority

- Client name: `putmoveauthority`
- Candidate request keys: `company`, `companyid`, `userid`, `shopids`, `usered`, `touserid`

```text
","success")})).finally((()=>{b.value=!1}))},k=async()=>{var e,a,t,o,s;const i=(v.rowData.shopList||[]).map((e=>e.shopid));if(1===y.value){if(!h.value.length)return n(window.t("selectHandover")||"请选择交接人","error");const s=h.value.map((e=>e.userId));b.value=!0,g.putmoveauthority({company:null==(e=l.companyData)?void 0:e.companyName,companyid:null==(a=l.companyData)?void 0:a.companyId,userid:null==(t=l.userData)?void 0:t.userId,shopids:i,usered:null==(o=v.rowData)?void 0:o.userId,touserid:s}).then((e=>{200===(null==e?void 0:e.code)&&$()})).catch((()=>{n(window.t("transferError")||"转移失败","error")}
```

## POST /v2/newbrowser/putnewgroup

- Client name: `addgroups`
- Candidate request keys: `group`, `company`, `companyid`, `userid`, `groupid`

```text
,["update:group","update:tags"]),setup(v,{emit:y}){const f=v,m=y,{groupSort:h}=p(),{searchStore:g}=a(),_=Ae("fromPath"),x=Se(!1),w=Se(),b=async()=>{if(!w.value||!w.value.trim())return n.warning(window.t("pleaseGroupName")||"请输入分组名称");x.value=!0;const e=await i.addgroups({group:w.value});x.value=!1,e&&200===e.code&&(n.success(window.t("addSuccess")||"添加成功"),B(),w.value="")},k=Se(""),P=async()=>{if(!k.value||!k.value.trim())return n.warning(window.t("pleaseLabel")||"请输入标签");const e=ma(),a={label:k.value,color:e.type};x.value=!0;const l=await i.updateTag(a);x.value=!1,k.value="",200===l.code&&(n.
```

## POST /v2/newbrowser/putOpenUrl

- Client name: `putOpenUrl`
- Candidate request keys: `shopid`, `url`

```text
n.editRowInfo)?void 0:e.shopid}]};let t=[];if(M.value&&M.value.length>0){t=M.value.split("\n").filter((e=>e.trim().length>0))}const o={shopid:null==(a=n.editRowInfo)?void 0:a.shopid,url:t};m.value=!0,f.value=!0;const s=await Promise.all([d.putUserPassword(l),d.putOpenUrl(o)]);m.value=!1,f.value=!1;const i=s[0],p=s[1];200===i.code&&200===p.code&&(c("editAccountSuccess"),r.success("修改成功"),u.value=!1)},Z=async()=>{var e,a,l;const t=null==(e=B.value)?void 0:e.some((e=>{var a;const l="tiktok小店"===(null==e?void 0:e.platform_name);return"tiktok小店"===(null==(a=null==e?void 0:e.userPasswordPlatforms)?v
```

## POST /v2/newbrowser/putPublicInfo

- Client name: `putPublicInfo`
- Candidate request keys: `getIpInfos`, `publicIp`, `ipChannel`, `accountId`, `inspect`

```text
 e.apiBack({inspect:i,publicIp:l}),e&&e.needApiPut&&await(async e=>{let n=r||o&&(o.proxy&&o.proxy.ipChannel||o.ipChannel)||"";n||(n="中国"!==o.country||n?Q6.ipinfo:Q6.ipdata);const a={getIpInfos:[{publicIp:o.proxyip,ipChannel:n,accountId:o.shopid,...e}]};await t.putPublicInfo(a),o={},r=""})({inspect:i,publicIp:l})}));const l=e=>{if(!e)return{host:"",port:""};const t=e.lastIndexOf(":");if(-1!==t){let n=e.slice(0,t);return-1!==n.indexOf("[")&&(n=n.slice(1,-1)),{host:n,port:e.slice(t+1)}}return{host:e,port:""}},s=e=>{"IP 禁止访问，无法检测！"===e.message?oS.warning({dangerouslyUseHTMLString:!0,message:`<p st
```

## POST /v2/newbrowser/putrestoreshop

- Client name: `getputrestoreshop`
- Candidate request keys: `shopid`

```text
e=>{d("update:isShow",e)}}),A=async()=>{let e;if(d("confirm"),n.value)return;n.value=!0;const a={company:i.companyData.name,companyid:i.companyData.companyId,userid:i.userData.userId};if(1===c.editInfo.type&&(u.getInstance().subscribe(p.recyleRevert),e=await r.getputrestoreshop({...a,shopid:[c.editInfo.id]}),p.recyleRevert.data.code=e.code,p.recyleRevert.data.error=`环境回收站回收失败-${e.msg}`),3===c.editInfo.type&&(u.getInstance().subscribe(p.recyleRevert),e=await r.getputrestoreshop({...a,shopid:c.multipleSelection.map((e=>e.account_id))}),p.recyleRevert.data.code=e.code,p.recyleRevert.data.error=`环
```

## POST /v2/newbrowser/putsortgroup

- Client name: `groupSort`
- Candidate request keys: `groups`

```text
e=!1})).catch((e=>{ye.value=!1}))},ke=()=>{ve.value||(fe.page+=1,Oe())},Ae=({row:e,column:t,rowIndex:o,columnIndex:n})=>de.value===e.gropid&&1===n?"modify-cell":"",Ne=()=>{if(be.value){me=p.service({target:".el-dialog",lock:!0});const e=he.map((e=>e.gropid));Q.groupSort({groups:e}).then((e=>{e&&200===e.code&&(K.value=!1,t({message:window.t("modifySuccess")||"修改成功",type:"success"})),me&&(me.close(),me=null)})).catch((e=>{console.log("groupSort_err_:",e),me&&(me.close(),me=null)}))}else K.value=!1},Pe=e=>{var t,o,n,a,r;return(null==(t=e.system)?void 0:t.toLowerCase().includes("windows"))?"window
```

## POST /v2/newbrowser/putusergroupauthority

- Client name: `putusergroupauthority`
- Candidate request keys: _none parsed_

```text
pe&&3!==k.type||"env"!==Ee.value?5===k.type||(2===k.type||3===k.type)&&"group"===Ee.value?(Q.value=!0,await(async e=>{Re.value.forEach((a=>{e.share.push({companyid:"",userid:be.value.map((e=>e.userId)),groupid:a.gropid})}));let a={};a=be.value.length>0?await N.putusergroupauthority(e):await N.putdeletegroupauthority({groupid:Re.value.map((e=>e.gropid))}),200===a.code?(M&&M(),v(window.t("authSuccess")||"授权成功","success"),I.value=!1):v(window.t("authError")||"授权失败","warning")})(e)):($("sbmit",be.value),I.value=!1):(Q.value=!0,await(async e=>{2===k.type?e.share=[{companyid:"",userid:be.value.map((
```

## POST /v2/newbrowser/putUserPassword

- Client name: `putUserPassword`
- Candidate request keys: _none parsed_

```text
id)),shopid:null==(e=n.editRowInfo)?void 0:e.shopid}]};let t=[];if(M.value&&M.value.length>0){t=M.value.split("\n").filter((e=>e.trim().length>0))}const o={shopid:null==(a=n.editRowInfo)?void 0:a.shopid,url:t};m.value=!0,f.value=!0;const s=await Promise.all([d.putUserPassword(l),d.putOpenUrl(o)]);m.value=!1,f.value=!1;const i=s[0],p=s[1];200===i.code&&200===p.code&&(c("editAccountSuccess"),r.success("修改成功"),u.value=!1)},Z=async()=>{var e,a,l;const t=null==(e=B.value)?void 0:e.some((e=>{var a;const l="tiktok小店"===(null==e?void 0:e.platform_name);return"tiktok小店"===(null==(a=null==e?void 0:e.use
```

## POST /v2/newbrowser/putuserselfuri

- Client name: `addalluserself`
- Candidate request keys: `company`, `companyid`, `userid`, `self`, `login_url`

```text
value.forEach(((e,a)=>{e&&(sa[a]=e.scrollWidth>e.clientWidth)}))}))}},na=async()=>{var e;null==(e=Ve.value)||e.focus();const a={company:fe.companyData.name,companyid:fe.companyData.companyId,userid:fe.userData.userId,self:[{login_url:O.value}]};200===(await me.addalluserself(a)).code&&(s.success(window.t("addSuccess")),O.value="",ke.value="自定义",Se.value="Default",Me.value="Custom",ia())},ra=async()=>{var e,a;if(!Be.value.trim())return null==(e=He.value)||e.focus(),s.warning("请输入网址");null==(a=Ve.value)||a.focus();const l={company:fe.companyData.name,companyid:fe.companyData.companyId,userid:fe.
```

## POST /v2/newbrowser/putusershopauthority

- Client name: `putusershopauthority`
- Candidate request keys: _none parsed_

```text
>{2===k.type?e.share=[{companyid:"",userid:be.value.map((e=>e.userId)),shopid:k.form.shopid,authority:2}]:3===k.type&&k.multipleSelection.forEach((a=>{e.share.push({companyid:"",userid:be.value.map((e=>e.userId)),shopid:a.shopid,authority:2})})),200===(await N.putusershopauthority(e)).code&&(M&&M(),v(window.t("authSuccess")||"授权成功","success"),I.value=!1)})(e))}catch(e){console.error(`sbmit error: ${e}`)}finally{Q.value=!1}oa()},oa=()=>{2===k.type||(3===k.type?f(h.env_batchAuthSure,t.path):5===k.type&&(1===Re.value.length?f(h.env_groupManage_auth_ok,t.path):Re.value.length>1&&f(h.env_groupManag
```

## POST /v2/newbrowser/resetshopproxy

- Client name: `resetshopproxy`
- Candidate request keys: `device_ids`, `remark`

```text
),u.value=!0;const i=await n.batchDelPlatformProxy(t);if(u.value=!1,200===i.code)return"ok"},g=async()=>{let e=[];if(e=i.useModule===v.OfficialProxy?V.value.map((e=>e.device_id)):V.value.map((e=>e.deviceid)),!(e.length>0))return"ok";{u.value=!0;const l=await n.resetshopproxy({device_ids:e,remark:"del"});if(u.value=!1,200===l.code)return"ok"}},b=async()=>{let e=[];if(e=i.useModule===v.OfficialProxy?V.value.map((e=>e.device_id)):V.value.map((e=>e.deviceid)),!(e.length>0))return"ok";{u.value=!0;const l=await n.resetyunshopproxy({device_ids:e,remark:"del"});if(u.value=!1,200===l.code)return"ok"}},
```

## POST /v2/newbrowser/resetyunshopproxy

- Client name: `resetyunshopproxy`
- Candidate request keys: `device_ids`, `remark`

```text
=await n.resetshopproxy({device_ids:e,remark:"del"});if(u.value=!1,200===l.code)return"ok"}},b=async()=>{let e=[];if(e=i.useModule===v.OfficialProxy?V.value.map((e=>e.device_id)):V.value.map((e=>e.deviceid)),!(e.length>0))return"ok";{u.value=!0;const l=await n.resetyunshopproxy({device_ids:e,remark:"del"});if(u.value=!1,200===l.code)return"ok"}},x=async()=>{if(c("delete"),i.useModule===v.OfficialProxy)(async()=>{if(V.value.every((e=>"Stopped"===e.status))){if("ok"!==await g())return;if("ok"!==await b())return;"ok"===await y()&&(a.success(window.t("deleteSuccess")||"删除成功"),d.value=!1,c("success
```

## POST /v2/newbrowser/retsetshopisstartag

- Client name: `getretsetshopisstartag`
- Candidate request keys: `shopid`, `startag`

```text
,-1)),Ba(" "+ha(f.createtime&&f.createtime.split(" ")[1]),1)],512)),[[Ha,Dl(f)]]):xa("",!0),"setStar"===l.dataIndex&&9===o.id&&o.checked?Va((pa(),ya("div",{key:9,class:"pointer",onClick:e=>(async e=>{if(!0===await ze([e.shopid]))try{tl.value=!0,200===(await we.getretsetshopisstartag({shopid:[e.shopid],startag:1===e.isstartag?0:1})).code&&(Ae(),1===e.isstartag?He.success(window.t("cancelStarSuccess")||"取消星标成功"):He.success(window.t("starSuccess")||"设置星标成功"))}catch(a){He.error(window.t("starError")||"设置星标失败")}finally{tl.value=!1}})(f)},[1!==f.isstartag?Va((pa(),ya("img",gs,null,512)),[[E,tl.value
```

## POST /v2/newbrowser/retsetshopistop

- Client name: `setEnvTop`
- Candidate request keys: `shopid`, `top`

```text
||"取消置顶":e.$t("top")||"置顶"},{default:ma((()=>[fa("div",xn,[1!==f.authorization?(pa(),va(a,{key:0,name:"to-top",class:Sa(["icon icon-to-top",{"icon-h":f.topOrder>0}]),onClick:e=>(async e=>{if(!Tl.value&&!0===await ze([e.shopid])){Tl.value=!0;try{200===(await we.setEnvTop({shopid:[e.shopid],top:e.topOrder>0?0:1})).code?(r.success(window.t("setSuccess")||"设置成功"),await Ae(),Tl.value=!1):(r.error(window.t("setFail")||"设置失败"),Tl.value=!1)}catch{r.error(window.t("serviceException")||"服务异常"),Tl.value=!1}}})(f)},null,8,["class","onClick"])):xa("",!0)])])),_:2},1032,["content"]),ga(n,{placement:"top",ef
```

## POST /v2/newbrowser/retsetshopName

- Client name: `retsetshopName`
- Candidate request keys: `shopid`, `accountname`

```text
i=l("getaccount"),x=n(!1),I=o,_=d(o,"modelValue"),y=n(I.editRowInfo.name),R=()=>{if(!y.value)return a.warning("请输入名称");if(y.value===I.editRowInfo.name)return a.warning("请输入修改后的名称");x.value=!0;const e={shopid:[I.editRowInfo.shopid],accountname:y.value};return s.retsetshopName(e).then((e=>{200===e.code&&(i(),a.success(window.t("editSuccess")),_.value=!1)})).finally((()=>{x.value=!1})),""};return(a,o)=>{const s=t;return r(),u(e,{modelValue:_.value,"onUpdate:modelValue":o[1]||(o[1]=e=>_.value=e),title:a.$t("editName"),width:"650px",okLoading:x.value,onConfirm:R,onCancel:o[2]||(o[2]=e=>_.value=!1)}
```

## POST /v2/newbrowser/setCookie

- Client name: `setCookie`
- Candidate request keys: `shopid`, `cookie`

```text
=n(e);if(i.isError)return a(new Error(window.t("formatException")||"Cookie数据格式异常"));L.otherCookie=JSON.stringify(i.cookieArr),a()},trigger:"blur"}]}),z=()=>{$.value=!$.value},F=async o=>{try{U.value=!0;const e={shopid:[p.editRowInfo.shopid],cookie:o},a=await N.setCookie(e);console.log("setCookie_res_:",a),a&&200===a.code?(r.success(window.t("editSuccess")||"编辑成功"),T.value=!1):r.error(window.t("editFail")||"编辑失败"),U.value=!1}catch(e){U.value=!1,console.log("setCookie_err_:")}},H=async()=>{if(p.editRowInfo&&p.editRowInfo.shopid){const o=(()=>{let o=JSON.parse(L.cookieMain);if(o=Array.isArray(o)?
```

## POST /v2/newbrowser/setproxytoshop

- Client name: `deviceBindAccount`
- Candidate request keys: `proxy`, `shopProxy`

```text
,n=t.map((a=>{var l;const o=le(e.params.proxy);return"official"===y.editProxyType&&4===y.editProxyInfo.cloud_type&&(o.socks5=a.proxy.socks5,o.region=a.proxy.region,o.regionArr=null==(l=a.proxy)?void 0:l.regionArr),{proxy:o,shopid:a.shopid}}));if(200!==(await k.deviceBindAccount({proxy:e.params.proxy,shopProxy:n})).code)return;let r;xe();const s=t.map((e=>e.shopid));if("self"===y.editProxyType)r=s.map((a=>{const{host:l}=ye(y.editProxyInfo.proxyaddr);return{publicIp:e.params.proxy.PublicIP||l,ipChannel:y.editProxyInfo&&y.editProxyInfo.ip_query_channel||e.checkRes&&e.checkRes.ipChannel||Z.ip2loca
```

## POST /v2/newbrowser/setShopProxy

- Client name: `setShopProxy`
- Candidate request keys: _none parsed_

```text
>{const{content:t=""}=e||{};R.value=!0,B.value=t},{proxyCheckPopAndNew:re,cancelFetch:ae}=v7({apiBack:e=>{ie(N,F,$,e)}});c(P,(e=>{e||(L=!0,ae(),D.value=!1)}));const ie=async(e,t,n,o)=>{var r,a,i;if(o){const{publicIp:t}=o;t&&(e.proxy.PublicIP=t)}const l=await E.setShopProxy(e);let s=null==(r=t.proxyInfo)?void 0:r.deviceid;if(t.proxyType===uE.official&&(s=null==(a=t.proxyInfo)?void 0:a.device_id),(null==t?void 0:t.proxyInfo)&&s!==M.value.proxyId&&(async e=>{var t,n;if(M.value.proxy&&(M.value.proxy.inlie===uE.self||M.value.proxy.inlie===uE.official)){const e=[null==(t=M.value)?void 0:t.serial],n=
```

## POST /v2/newbrowser/sharerCompanyId

- Client name: `sharerCompanyId`
- Candidate request keys: `shopid`

```text
opover=!0},null,40,Ei))]),fa("ul",Si,[-1!==[1,2,3].indexOf(f.authorization)&&f.share_num>0?(pa(),ya("li",{key:0,onMouseenter:e=>(async e=>{var a;if(!Object.prototype.hasOwnProperty.call(e,"shareInfo"))if(1===e.authorization){console.log("被分享");const a=await we.sharerCompanyId({shopid:e.shopid});if(a&&200===a.code){const{companyId:l,created_at:t}=a.data;if(l){let a=await Nl([l]);console.log("showText",a),a&&(a=window.t("sharedFrom",{showText:a})),e.shareInfo={showText:a,created_at:t}}}}else{const l={accountid:e.shopid,page:1,pageSize:5,status:1},{code:t=0,data:o={}}=await we.shareShopList(l);20
```

## POST /v2/newbrowser/shareShop

- Client name: `shareShop`
- Candidate request keys: `day`, `shopids`, `share`, `storage`, `Remark`, `Url`, `Help`

```text
tion;await je(e)}const d=[];Ae.form?d.push(Ae.form.shopid):Ae.multipleSelection.forEach((e=>{d.push(e.shopid)}));const u={day:De.value.dayNum||0,shopids:d,share:r,storage:Number(Le.value),Remark:De.value.Remark,Url:De.value.Url,Help:Ae.help};if(200===(await _e.shareShop(u)).code){if(Ae.help&&Ue()){const l=String((null==(e=Ae.form)?void 0:e.kernelVersion)||""),t=Number(null==(a=Ae.form)?void 0:a.kernelId),s=we.localKernelList.find((e=>e.id===t));g(b.uploadLogs,{params:{problem_type:Ce.value,problem_text:De.value.Remark,env_id:Ae.form.shopid,core_version:l,core_build_version:(null==s?void 0:s.ve
```

## POST /v2/newbrowser/shareShopClosed

- Client name: `shareShopClosed`
- Candidate request keys: `shopids`

```text
 e=Object.keys(localStorage).filter((e=>{const t=e.startsWith("order-")&&e.endsWith("-shopid1"),n=e.startsWith("order-")&&e.endsWith("-shopid2");return t||n})),t=[];e.forEach((e=>{const n=localStorage.getItem(e)||"";n&&n.length>0&&t.push(n)}));const n=await oA.shareShopClosed({shopids:t});if(200===n.code){const e=n.data,o=[];if(t.forEach((t=>{e.includes(t)&&o.push(t)})),0===o.length)return;const r={action:zz.WebBrowserManagerModule.action.BatchCloseWebBrowser,args:{shopIds:o}};window.tp.sendMessage(r,zz.WebBrowserManagerModule.key)}}onRespLogin(e){const{code:t=0}=e;if(200===t){this.heartTimest
```

## POST /v2/newbrowser/shareShopDel

- Client name: `shareShopDel`
- Candidate request keys: `shopids`, `accountCompanyId`, `ids`

```text
nable"]),-1!==[1,2,3].indexOf(f.authorization)&&f.share_num>0?(pa(),ya("div",{key:7,class:"opts pointer",onClick:e=>(async e=>{if(!0!==await ze([e.shopid]))return;Be.value=e,O.confirm({title:"提示",text:"确认取消分享当前环境吗？"},(async(e,a,l)=>{a.value=!0;const t=await we.shareShopDel({shopids:[Be.value.shopid],accountCompanyId:Be.value.company_id});a.value=!1,200===t.code&&(r.success("取消成功"),l.value=!1,Ae())}))})(f)},[ga(a,{name:"cancelShare",class:"icon"}),fa("span",_i,ha(e.$t("cancelShare")||"取消分享"),1)],8,ki)):xa("",!0),Dl(f)?(pa(),va(vl,{key:8,disabled:wa(le)(f.shopid),content:wa(le)(f.shopid)?e.$t("c
```

## POST /v2/newbrowser/shareShopList

- Client name: `shareShopList`
- Candidate request keys: `accountid`, `page`, `pageSize`, `status`

```text
t{companyId:l,created_at:t}=a.data;if(l){let a=await Nl([l]);console.log("showText",a),a&&(a=window.t("sharedFrom",{showText:a})),e.shareInfo={showText:a,created_at:t}}}}else{const l={accountid:e.shopid,page:1,pageSize:5,status:1},{code:t=0,data:o={}}=await we.shareShopList(l);200===t&&(null==(a=null==o?void 0:o.list)||a.forEach((async e=>{const a=await Nl([e.share.company_id]);e.share.name=a})),e.shareInfo=o.list||[])}})(f)},[fa("div",Pi,[ga(n,{effect:"light",placement:"top-end","show-after":f.shareInfo?200:600,"popper-options":Ne.value,"popper-class":"tooltip-scroll-class tooltip-scroll-clas
```

## POST /v2/newbrowser/shopProxyBound

- Client name: `shopProxyBound`
- Candidate request keys: `shopids`

```text
,"指纹环境")},Ue=()=>{u(r.env_batchTransfer_content,$.path,"缓存数据")},De=()=>{u(r.env_batchTransfer_content,$.path,"Cookie信息")},Ee=()=>{u(r.env_batchTransfer_content,$.path,"账号信息")},ze=async()=>{if(_e.value){const e=Ie.multipleSelection.map((e=>e.shopid)),a=await ve.shopProxyBound({shopids:e});200===a.code&&(1===a.data.status?xe.value=!0:xe.value=!1)}else xe.value=!1;u(r.env_batchTransfer_content,$.path,"代理信息")},Le=async()=>{if(1===$e.value)ke.value=!1;else if(2===$e.value){const e=he.value.trim();if(!e)return void h.warning(window.t("inputTeamId")||"请输入团队ID");if(e===ce.companyData.companyId)return
```

## POST /v2/newbrowser/storage/del

- Client name: `deleteCloudCache`
- Candidate request keys: `account_id`, `file_key`

```text
},1032,["content","onConfirm"]),1!==t.editRowInfo.authorization?(x(),S(le,{key:0,content:t.$t("envPop.deleteCloudConfirmText"),trigger:"click",onConfirm:e=>(async e=>{const a={account_id:k.editRowInfo.shopid,file_key:e.file_key};te.value=!0;try{const e=await C.deleteCloudCache(a);e&&200===e.code?(te.value=!1,oa(0,!0),h.success(window.t("deleteSuccess"))):h.error(window.t("deleteFail"))}catch(t){console.log("deleteCloudCache_error_:",t),te.value=!1}})(a)},{reference:I((()=>[F((x(),S(D(e),{link:"",type:"primary"},{default:I((()=>[T(P(t.$t("button.delete")),1)])),_:1})),[[R,D(d).Env_CacheManage_C
```

## POST /v2/newbrowser/storage/page

- Client name: `getCloudCacheList`
- Candidate request keys: `account_id`, `page`, `pageSize`, `md5`, `companyId`

```text
romise.all(a),s=[];return t.forEach(((a,l)=>{a&&0===a.code&&a.data&&a.data.length&&s.push({env:e[l],snapshots:a.data})})),s}catch(a){return console.log("getSnapshotByList_err_:",a),[]}})(t);(t=>{try{t.forEach((async t=>{const[s]=t.snapshots.slice(-1),o=await a.getCloudCacheList({account_id:t.env.shopid,page:1,pageSize:5,md5:s.md5});if(!o||200!==o.code||!o.data||!Array.isArray(o.data.list)||o.data.list.length<1){const{user:a}=e(),o={...s,remark:"",token:$(),companyId:a.companyData.companyId,cdk:t.env.cdk};l.uploadSnapshot(o)}}))}catch(s){console.log("uploadCache_err_:",s)}})(s)}}}const te={clas
```

## POST /v2/newbrowser/storage/update

- Client name: `updateCloudCache`
- Candidate request keys: `account_id`, `file_key`, `filename`, `remark`

```text
,{modelValue:D(He).remark,"onUpdate:modelValue":l[2]||(l[2]=e=>D(He).remark=e),maxlength:"32",required:!1,onConfirm:a=>(async e=>{const a={account_id:k.editRowInfo.shopid,file_key:e.file_key,filename:e.filename,remark:He.remark};te.value=!0;try{const e=await C.updateCloudCache(a);te.value=!1,e&&200===e.code?(h.success(window.t("modifySuccess")),He.file_key=void 0,oa(0,!0)):h.error(window.t("modifyFail"))}catch(t){console.log("updateCloudCache_error_:",t),te.value=!1,h.error(window.t("serverError"))}})(e),onCancel:ia},null,8,["modelValue","onConfirm"])])):(x(),S(M,{key:1,disabled:!e.remark||e.r
```

## POST /v2/newbrowser/transferCompanyId

- Client name: `transferCompanyId`
- Candidate request keys: `shopid`

```text
)])],40,Vi)):xa("",!0),-1!==[1,2,3].indexOf(f.authorization)&&1===(null==f?void 0:f.isTransfer)?(pa(),ya("li",{key:1,onMouseenter:e=>(async e=>{if(Object.prototype.hasOwnProperty.call(e,"transferInfo")||1!==e.isTransfer);else{console.log("转移");const a=await we.transferCompanyId({shopid:e.shopid});if(a&&200===a.code){const{companyId:l="",created_at:t=""}=a.data;if(l){let a=await Nl([l]);a&&(a=window.t("transferedFrom",{showText:a})),e.transferInfo={showText:a,created_at:t}}}}})(f)},[fa("div",qi,[ga(n,{effect:"light",placement:"top-end","show-after":f.transferInfo?200:600,"popper-options":Ne.val
```

## POST /v2/newbrowser/transferShop

- Client name: `transferShop`
- Candidate request keys: `shopids`, `finger`, `platform`, `cookie`, `proxy`, `companyid`, `storage`

```text
urn void h.warning(window.t("cannotTransferSelfTeam"));$e.value=3}else{const e={shopids:Ie.multipleSelection.map((e=>e.shopid)),finger:ge.value?1:0,platform:ye.value?1:0,cookie:we.value?1:0,proxy:_e.value?1:0,companyid:he.value,storage:be.value?1:0},a=await ve.transferShop(e,!0);if(200===a.code)h.success(window.t("transferSuccess")||"账号转移成功"),je("update:isShow",!1),je("timeToRefresh"),ke.value=!1;else if(16e3===a.code)h.error("被转移团队套餐额度不足，请联系该团队管理员升级套餐");else{const e=g(a.code)||"转移失败";h.error(e)}}c(r.env_batchTransfer_sure,$.path)};return j((async()=>{l.getInstance().removeSub(s.move.type),(as
```

## POST /v2/newbrowser/transferShopList

- Client name: `transferShopList`
- Candidate request keys: `page`, `pageSize`

```text
e().includes("linux"))?"linux":(null==(l=a.system)?void 0:l.toLowerCase().includes("android"))?"android":(null==(s=a.system)?void 0:s.toLowerCase().includes("ios"))?"ios":""},ca=async()=>{oa.value=!0;const a={page:sa.page,pageSize:sa.pageSize,...ia},e=await ta.transferShopList(a);if(console.log("账号转移数据是"),console.log(e),200===e.code){sa.total=e.data.total;const a=e.data.list,t=[],o=[];a.forEach((a=>{t.push(a.company_id),o.push(a.create_by)}));const l=await ta.getCompanyByIds({ids:t}),s=await ta.getMembersByIds({userIds:o});if(200===l.code||200===s.code){const e=l.data,t=s.data;a.forEach((a=>{c
```

## POST /v2/newbrowser/updateProxyShop

- Client name: `updateProxyShop`
- Candidate request keys: `proxy`, `name`, `uuid`, `inlie`, `type`, `zhima`, `Url`, `Interval`, `ipChannel`, `deviceType`, `dynamic`, `Type`

```text
ditOwnProxyInfo?window.t("editFail"):window.t("addFail"));if(ke.editOwnProxyInfo){if(De.value.length>0){const e=await(async e=>{const l={proxy:E(N.self,e)};l.proxy.name=e.name,Ce.value=!0;let o="OKBtn";"Confirm2"===ll.value&&(o="OK2Btn"),Xe(o);const a=await Se.updateProxyShop(l);return Ce.value=!1,Me(o),a})(l);if(200!==e.code)return}const e=await(async e=>{const l={proxy:E(N.self,e)};l.proxy.name=e.name,Ce.value=!0;let o="OKBtn";"Confirm2"===ll.value&&(o="OK2Btn"),Xe(o);const a=await Se.updateYunShopProxy(l);return Ce.value=!1,Me(o),a})(l);if(200!==e.code)return}T.success(ke.editOwnProxyInfo?w
```

## POST /v2/newbrowser/updateUserPassword

- Client name: `updateUserPassword`
- Candidate request keys: _none parsed_

```text
rm_id:q.value.customPlatformId,name:q.value.name,user_name:q.value.account,password:q.value.password,remark:q.value.remark,user_password_id:q.value.user_password_id,platform_lock:q.value.platform_lock?1:0,tfa:q.value.tfa}]};let l;y.value=!0,l=h.rowData?await k.updateUserPassword(e,!0):await k.createUserPassword(e,!0),y.value=!1,200===l.code?h.rowData?P("editSuccess",l.data[0]):P("addSuccess",l.data[0]):409===l.code&&r.warning("该平台已存在该账号")};return v({checkIsEmpty:()=>!(h.rowData||q.value.platformId||q.value.customPlatformId||q.value.name||q.value.account||q.value.password||q.value.remark||q.val
```

## POST /v2/newbrowser/updateUserPasswordRemark

- Client name: `updateUserPasswordRemark`
- Candidate request keys: `user_password_ids`, `remark`

```text
cManage_batchEditRemark_sure:L.team_accManage_editRemark_sure),H(e,b.path)})(),c.value=!0,e=Array.isArray(o.curOperateData)?o.curOperateData.map((e=>e.user_password_id)):[o.curOperateData.user_password_id];const a={user_password_ids:e,remark:m.value},l=await s.updateUserPasswordRemark(a);c.value=!1,200===l.code&&(K.success("编辑成功"),i("success"),u.value=!1)};return(e,a)=>{const l=q,o=G,s=ee;return u.value?(t(),d(Q,{key:0,modelValue:u.value,"onUpdate:modelValue":a[1]||(a[1]=e=>u.value=e),width:"680px",title:e.$t("editRemark"),okLoading:c.value,onClose:h,onCancel:_,onConfirm:k},{default:p((()=>[r(
```

## POST /v2/newbrowser/updateYunShopProxy

- Client name: `updateYunShopProxy`
- Candidate request keys: `proxy`

```text
2Btn"),Xe(o);const a=await Se.updateProxyShop(l);return Ce.value=!1,Me(o),a})(l);if(200!==e.code)return}const e=await(async e=>{const l={proxy:E(N.self,e)};l.proxy.name=e.name,Ce.value=!0;let o="OKBtn";"Confirm2"===ll.value&&(o="OK2Btn"),Xe(o);const a=await Se.updateYunShopProxy(l);return Ce.value=!1,Me(o),a})(l);if(200!==e.code)return}T.success(ke.editOwnProxyInfo?window.t("editSuccess"):window.t("addSuccess")),console.log("confirmType",ll.value),"Confirm1"===ll.value?ke.editOwnProxyInfo?(console.log("editSuccess",t.data.proxies[0]),Oe("editSuccess",t.data.proxies[0])):(Oe("addSuccess",t.data
```

## POST /v2/newbrowser/userPasswordSetAccountId

- Client name: `userPasswordSetAccountId`
- Candidate request keys: `shopid`, `user_password_id`

```text
")&&(e=m.isBatch?L.team_accManage_batchBindEnv_sure:L.team_accManage_bindEnv_sure),H(e,s.path)})(),I.value=!0,Array.isArray(m.curOperateData)){const e=[];return m.curOperateData.forEach((a=>{const l={shopid:R.value,user_password_id:a.user_password_id};e.push(b.userPasswordSetAccountId(l))})),void Promise.all(e).then((e=>{K.success("绑定完成"),A("bindSuccess"),I.value=!1,y.value=!1})).catch((e=>{K.error("批量绑定有失败情况，请检查"),A("bindSuccess"),I.value=!1,y.value=!1}))}const a={user_password_id:null==(e=m.curOperateData)?void 0:e.user_password_id,shopid:R.value},l=await b.userPasswordSetAccountId(a);I.valu
```

## POST /v2/newbrowser/world/closeShareShop

- Client name: `getCloseShareShop`
- Candidate request keys: `shopids`

```text
=Nz(e),Nz=e=>Rz.value.find((t=>t.shopId===e))?"Opening":Bz.value.find((t=>t.shopId===e))?"Opened":"Idle",Fz=e=>{},$z=e=>{Hz(e)},Vz={},Hz=async function(e){if("bus"===JSON.parse(localStorage.getItem("myUserInfo")||"").source&&!Vz[e]){Vz[e]=(Vz[e]||0)+1,await oA.getCloseShareShop({shopids:[e]}),Vz[e]=0;for(const t in localStorage)if(t.startsWith("order")&&(t.endsWith("shopid1")||t.endsWith("shopid2"))){localStorage.getItem(t)===e&&(localStorage.setItem(t,""),Mt.emit(It.FRESH_SHOPS))}}},jz=s([]),zz={AuthModule:{key:"AuthModule",action:{OnTokenExpired:"OnTokenExpired"}},WsAuthModule:{key:"WsAuthMo
```

## POST /v2/newbrowser/world/getUserExpiredTime

- Client name: `getUserExpiredTime`
- Candidate request keys: _none parsed_

```text
r:"white"},class:"text"},A=["onClick"],N={key:3,class:"open"},O={style:{color:"white"},class:"text"},z=i(l({__name:"Round84",emits:["listCount"],setup(i,{emit:l}){const{user:z,configStore:R}=e(),q=p("$api"),F=c([]),J=l,Q=e=>localStorage.getItem(e)||"",U=()=>{q.getUserExpiredTime({}).then((e=>{if(200===e.code){const o=e.data;o.forEach((e=>{const o=new Date(e.expiredTime),s=new Date;e.remainDay=Math.floor(Math.abs(o.getTime()-s.getTime())/1e3/60/60/24)})),F.value=o,J("listCount",F.value.length)}})).catch((e=>{console.log("获取过期时间失败",e)}))};U();const{openaccount:X}=o(),G=u((()=>X.value)),H=e=>s.va
```

## POST /v2/newbrowser/world/shareShop

- Client name: `getShareShop`
- Candidate request keys: `order_no`, `operation`

```text
dule.key),n([e])},L=async(e,o)=>{let r="";const t=localStorage.getItem(`order-${e}-shopid1`),n=localStorage.getItem(`order-${e}-shopid2`);if(1===o&&s.value.some((e=>e.shopId==t))&&(r=t),2===o&&s.value.some((e=>e.shopId==n))&&(r=n),0===r.length){const i=await q.getShareShop({order_no:e,operation:o});if(200===i.code){const d=i.data.shopid;if(0===d.length)return void a.error(window.t("noEnvironmentWarn")||"暂无可启动环境");if(1===o){if(s.value.some((e=>e.shopId==n)))return void a.error(window.t("currenEnvironmenttWarn")||"请先关闭当前已启动环境");r=d,localStorage.setItem(`order-${e}-shopid1`,d),K(r)}else{if(s.valu
```

## POST /v2/news/show/help/categories

- Client name: `getHelpCategories`
- Candidate request keys: `page`, `pageSize`

```text
ml?lang=${l()}`):window.open(`https://www.mtlogin.com/help.html?lang=${l()}`):o?i?window.open(`https://help.sharklogin.com/help/${i}.html?lang=${l()}`):window.open("https://help.sharklogin.com"):null);return h((()=>{(async()=>{const{code:e=0,data:s={}}=await p.getHelpCategories({page:1,pageSize:100});if(200!==e)return;const{list:t=[]}=s;t.forEach((e=>{const{id:s=0,categoryName:t=""}=e;f.value.push({id:s,title:t,icon:"icon-zh",children:[]})})),f.value.forEach((async e=>{const{id:s=0,children:t=[]}=e,{code:a=0,data:l={}}=await p.getHelpList({categoryId:s,page:1,pageSize:5});if(200===a){const{lis
```

## POST /v2/news/show/help/list

- Client name: `getHelpList`
- Candidate request keys: `categoryId`, `page`, `pageSize`

```text
gories({page:1,pageSize:100});if(200!==e)return;const{list:t=[]}=s;t.forEach((e=>{const{id:s=0,categoryName:t=""}=e;f.value.push({id:s,title:t,icon:"icon-zh",children:[]})})),f.value.forEach((async e=>{const{id:s=0,children:t=[]}=e,{code:a=0,data:l={}}=await p.getHelpList({categoryId:s,page:1,pageSize:5});if(200===a){const{list:e=[]}=l;e.forEach((e=>{const{id:s=0,title:a=""}=e;t.push({id:s,title:a})}))}}))})()})),(e,s)=>(d(),m("div",y,[u("div",A,[(d(!0),m(w,null,g(f.value,(t=>(d(),m("div",{key:t.id,class:"box"},[u("div",_,[u("div",k,[u("i",I,[v(i,{name:O(t.id)},null,8,["name"])]),u("span",null
```

## POST /v2/plugin/bindGrouopPlugin

- Client name: `bindGrouopPlugin`
- Candidate request keys: `groupId`, `accountIds`, `kernel`

```text
roxy.uuid,f.createLog(l)})()),(P.value||A.value)&&Ma(d.basic.cookie,k.query.shopid),(P.value||C.value)&&p.getCanOpenEnvList(),P.value&&d.plugin.currentItem||A.value){const e=(null==(t=null==(l=d.plugin.currentItem)?void 0:l.pluginGroup)?void 0:t.groupId)||"";f.bindGrouopPlugin({groupId:[e],accountIds:_.shopid,kernel:d.basic.kernel===ye.Chrome?1:2})}e&&!Q&&(m.push("/"),c.changemate("accoun")),Aa.success(A.value?"编辑成功":"添加成功"),Qe(!1)};setTimeout((()=>{x()}),C.value?1e3*d.basic.number:0)},ta=async e=>{let a=d.formateFingerParameters();if(console.log("params,,,,old,,,,new",fe,a),console.log("userP
```

## POST /v2/plugin/createPluginCrx

- Client name: `uploadPlugin`
- Candidate request keys: _none parsed_

```text
r(window.t("fileJpg")||"文件必须是 JPG 或 PNG 格式！"),!1)},le=e=>{M.value.icon=e.data.crx.url},ae=e=>{M.value.card=e.data.crx.url},ne=e=>{C.value=e.url||"",b.value=!0};async function te(e){$.value=!0;const l=a.pluginId;let u=null;u=l?await n.updatePluginCrx(e):await n.uploadPlugin(e,!0),$.value=!1,200===(null==u?void 0:u.code)?(s.success(l?window.t("editSuccess")||"编辑成功":window.t("uploadSuccess")||"上传成功"),f.value=!1,i("success")):30009===(null==u?void 0:u.code)&&s.error(window.t("hasPluginName")||"插件名称已存在")}const oe=async()=>{d.value&&await d.value.validate((e=>{e&&(1===y.value?(()=>{let e=[];console.
```

## POST /v2/plugin/group/addPluginGroup

- Client name: `addPluginGroup`
- Candidate request keys: `groupId`, `pluginCompanyId`

```text
value})).code&&(b("refreshPlguinList",void 0),S(!0),s.success(window.t("deleteSuccess")||"删除成功")),y.value=!1,v.value=!1},U=(e,l)=>{if(3===m.activeIndex&&!o(u.Plugin_EditGroup))return l.isHighlighted=!1,void s.warning(window.t("packagePurchaseTips"));((e,l)=>{n.addPluginGroup({groupId:l,pluginCompanyId:e}).then((e=>{200===e.code&&(S(),s.success(window.t("addSuccess")||"添加成功"))}))})(e.dataTransfer.getData("text/plain"),l.pluginGroup.groupId),l.isHighlighted=!1},E=()=>{v.value=!0,n.copyPluginGroup({groupId:h.value}).then((e=>{200===e.code&&(s.success(window.t("copySuccess")||"复制成功"),h.value=""),f
```

## POST /v2/plugin/group/copyPluginGroup

- Client name: `copyPluginGroup`
- Candidate request keys: `groupId`

```text
.t("packagePurchaseTips"));((e,l)=>{n.addPluginGroup({groupId:l,pluginCompanyId:e}).then((e=>{200===e.code&&(S(),s.success(window.t("addSuccess")||"添加成功"))}))})(e.dataTransfer.getData("text/plain"),l.pluginGroup.groupId),l.isHighlighted=!1},E=()=>{v.value=!0,n.copyPluginGroup({groupId:h.value}).then((e=>{200===e.code&&(s.success(window.t("copySuccess")||"复制成功"),h.value=""),f.value=!1,v.value=!1})).catch((()=>{s.error(window.t("serviceException")||"服务异常"),v.value=!1})),p(r.plugin_teamPlugin_saveCopyToMe_sure,"/pluginManage/teamPlugin")};return a({gitPluginGroupListFun:S}),J((()=>{S()})),(l,a)=>
```

## POST /v2/plugin/group/createPluginGroup

- Client name: `createPluginGroup`
- Candidate request keys: _none parsed_

```text
pluginCompanyId:g.value.filter((e=>e.on)).map((e=>e.pluginCompanyId||e.pluginId))};if(!e.pluginCompanyId.length)return void s.error(window.t("selectPlugin")||"请选择插件");O.value=!0;const l=""!==m.groupId?await u.updatePluginGroup({...e,groupId:m.groupId}):await u.createPluginGroup(e);O.value=!1,200===l.code&&(s.success(window.t("submitSuccess")||"提交成功"),$())})()}))};return J((async()=>{await(async()=>{const e={name:void 0,pageIndex:1,pageSize:10086,pluginTeam:3===m.activeIndex?1:2};o.value=!0;const l=await u.getPluginCompaniesPersonageList(e);l.list&&l.list.length?g.value=l.list:g.value=[],o.valu
```

## POST /v2/plugin/install

- Client name: `installPlugin`
- Candidate request keys: `pluginId`, `IsTeam`, `pluginType`

```text
file.yunlogin.com/file/uploads/2023-08-12/default.png",h=U(!0),k=U(!0),C=U(!1),y=U(!1),Y=U(!0),X=s,P=o,H=b({get:()=>X.isShow,set:e=>{P("update:isShow",e)}}),K=()=>{P("update:isShow",!1)},N=async()=>{var e;if(!h.value||!k.value)return;y.value=!0;const l=await n.installPlugin({pluginId:null==(e=X.pluginInfo)?void 0:e.pluginId,IsTeam:C.value?1:2,pluginType:X.isRead3Show?void 0:3});y.value=!1,200===l.code?(P("update:isShow",!1),P("authSuccess"),a.success(window.t("authSuccess")||"授权成功")):a.error(window.t("authError")||"授权失败")};return x((()=>{F((()=>{X.isRead3Show&&(async()=>{var e,l;const a=await
```

## POST /v2/plugin/updateGlobalVisibility

- Client name: `updateGlobalVisibility`
- Candidate request keys: `pluginCompanyId`

```text
53-597fff49-104.png",P=()=>{f("clickDistributionOrAdd")},_=()=>{!i.teamPlugin||o(u.Plugin_EditTeam)?f("showEditPlugin"):s.warning(window.t("packagePurchaseTips"))},I=()=>{f("showDeleteConfirm")},b=()=>{f("setTeamVisible")},C=async()=>{p.value=!0;200===(await a.updateGlobalVisibility({pluginCompanyId:r.value.pluginCompanyId})).code?(r.value.isGlobal=2===r.value.isGlobal?1:2,f("searchChange"),s.success("操作成功"),h.value=!1):s.error(window.t("serviceException")||"服务异常"),p.value=!1,f("globalConfirm",r.value)};return(e,l)=>{var a,m,x,T,S,V,$,M,U,D,E,A,N,q,K,Y,J,le,ae,ie,ne,ue,te,oe;const se=y,de=g,re
```

## POST /v2/plugin/updateTeamVisibility

- Client name: `updateTeamVisibility`
- Candidate request keys: _none parsed_

```text
wait a.uninstallNew(e),n.value=!1,200===i.code?(s.success(window.t("deleteSuccess")||"删除成功"),x.value.gitPluginGroupListFun(),null==(l=C.value)||l.getmyTeamPluginList()):s.error(window.t("serviceException")||"服务异常")},fe=async e=>{var l;n.value=!0;200===(await a.updateTeamVisibility(e,!0)).code?(s.success("操作成功"),x.value.gitPluginGroupListFun(),null==(l=C.value)||l.getmyTeamPluginList()):s.error(window.t("serviceException")||"服务异常"),n.value=!1},we=(e=!1)=>{ue(e)},_e=()=>{var e;1===N.value?t.value={ID:-1,title:window.t("uploadedPlugin")||"上传的插件",type:3}:null==(e=C.value)||e.getmyTeamPluginList()}
```

## POST /v2/proxy/authority/deal

- Client name: `proxyAuthDeal`
- Candidate request keys: `proxyType`, `companyId`, `deviceIds`, `userIds`, `content`

```text
{1===Rl.value.length?C(r.proxy_platformProxy_singleAuth_OK,a.path):C(r.proxy_platformProxy_batchAuth_OK,a.path);const o={proxyType:1,companyId:n.companyData.companyId,deviceIds:Rl.value.map((e=>e.device_id)),userIds:e,content:$l(e)};l.value=!0;const i=await Qe.proxyAuthDeal(o);l.value=!1,200===i.code&&(u.success(window.t("authSuccess")||"授权成功"),t.value=!1,No())},El=pe(!1),Rl=pe([]),yo=pe([]),fo=e=>{if(qa.value=e,1!==s.device_authorities)return ma.warning("团队未开启代理权限控制，开启入口“设置-团队偏好-代理数据权限”");if(e){if(ee(r.proxy_platformProxy_singleAuth,a.path),![2,3].includes(e.authority))return ma.error("此代理不能授
```

## POST /v2/proxy/authority/syncNoAutoAuthority

- Client name: `syncNoAutoAuthority`
- Candidate request keys: `companyId`

```text
ice_authorities?"确认开启":"确认关闭",text:e,confirmText:window.t("confirm")||"确定"},l=(e,a,l)=>{l.value=!1,m.value.device_authorities=!m.value.device_authorities};L.confirm(a,(async(e,a,l)=>{if(a.value=!0,m.value.device_authorities){const{user:e}=F();if(200!==(await t.syncNoAutoAuthority({companyId:e.companyData.companyId})).code)return a.value=!1,l.value=!1,void(m.value.device_authorities=!m.value.device_authorities)}const s=await t.configSettings({device_authorities:m.value.device_authorities?1:2});a.value=!1,l.value=!1,200===s.code?(K.success(window.t("setSuccess")||"设置成功"),n.device_authorities=m.v
```

## POST /v2/proxy/device/batchautorenew

- Client name: `autoRenewProxy`
- Candidate request keys: _none parsed_

```text
))}));Ye(d,(e=>{var a;c.value=(null==(a=e[0])?void 0:a.id)??1}),{immediate:!0});const p=async()=>{l.isBatch?C(r.proxy_platformProxy_batchAutomaticRenewal_sure,i.path):C(r.proxy_platformProxy_automaticRenewal_sure,i.path),await async function(e){const a=await n.autoRenewProxy(e,!0);if(200===(null==a?void 0:a.code))return u.success(window.t("operateSuccess")||"操作成功"),o.value=!1,void t("success");4019===(null==a?void 0:a.code)&&t("balance-not-enough"),t("failed")}({status:2,num:c.value,device_ids:l.proxyList.map((e=>e.device_id))})};return(e,a)=>(me(),ye(s,{modelValue:o.value,"onUpdate:modelValue
```

## POST /v2/proxy/device/batchcloserenew

- Client name: `closeAutoRenew`
- Candidate request keys: _none parsed_

```text
()},bo=()=>{qa.value&&!Array.isArray(qa.value)&&(qa.value.auto_renew=0)};const ko=async(e,l)=>{e||(a.path.includes("proxyManage/platProxy")&&ee(r.proxy_platformProxy_renewal_cancelAutomaticRenewal,a.path),qa.value=l,await async function(e){try{const a=await Qe.closeAutoRenew(e);200!==(null==a?void 0:a.code)?u.error(window.t("operateFail")||"操作失败"):u.success(window.t("operateSuccess")||"操作成功"),clearInterval(nl.value),await bl()}catch(a){u.error(window.t("serviceException")||"服务异常")}}({status:3,device_ids:[l.device_id]}))},Po=pe([]),So=pe(!0),Co=()=>{if(!B(x.Proxy_Platform_AutoRenew))return ma.w
```

## POST /v2/proxy/device/batchdelete

- Client name: `batchDelPlatformProxy`
- Candidate request keys: `status`, `device_ids`, `user_id`

```text
teSuccess")||"删除成功"),d.value=!1,o.value=!1,c("success"))},y=async(e,l=0)=>{var a;const t={status:1,device_ids:V.value.map((e=>e.device_id)),user_id:(null==(a=s().user.companyData)?void 0:a.onwer)||""};e&&(t.code=e),l&&(t.user_type=l),u.value=!0;const i=await n.batchDelPlatformProxy(t);if(u.value=!1,200===i.code)return"ok"},g=async()=>{let e=[];if(e=i.useModule===v.OfficialProxy?V.value.map((e=>e.device_id)):V.value.map((e=>e.deviceid)),!(e.length>0))return"ok";{u.value=!0;const l=await n.resetshopproxy({device_ids:e,remark:"del"});if(u.value=!1,200===l.code)return"ok"}},b=async()=>{let e=[];if
```

## POST /v2/proxy/device/batchtag

- Client name: `batchTag`
- Candidate request keys: `tags`, `device_ids`

```text
electedItemList)||e.forEach((a=>{l.info.push({shopid:a.shopid,label:s})})),l})());da.value=!1,na.value=!1,200===a.code&&(c(window.t("modifySuccess")||"修改成功","success"),ua.value=!1,ta("refresh"))},wa=async()=>{ta("save"),da.value=!0,na.value=!0;const a=await sa.batchTag((()=>{var a;const e=null==(a=la.selectedItemList)?void 0:a.map((a=>a.device_id));return{tags:ra.value,device_ids:e}})());da.value=!1,na.value=!1,200===a.code&&(p.success(window.t("setSuccess")||"设置成功"),ua.value=!1,ta("refresh"))},Ia=async()=>{la.tagDialogType===z.ENV?La():la.tagDialogType===z.PLATFORM_PROXY&&wa(),_a()},_a=()=>{l
```

## POST /v2/proxy/device/creatingDeviceLogs

- Client name: `createLog`
- Candidate request keys: `device_own_id`, `device_id`, `device_name`, `company_id`, `device_type`, `content`, `public_ip`

```text
vice_id:void 0,device_name:M.value.proxy.name,company_id:m.companyData.companyId,device_type:jn.UNBIND,content:`${e?e.toString():""}->`,public_ip:M.value.proxyip};M.value.proxy.inlie===uE.self?n.device_own_id=M.value.proxy.uuid:n.device_id=M.value.proxy.uuid,E.createLog(n)}if(e.proxyType===uE.self||e.proxyType===uE.official){const t=[null==(n=M.value)?void 0:n.serial],o={device_own_id:void 0,device_id:void 0,device_name:e.proxyInfo.name,company_id:m.companyData.companyId,device_type:jn.ALLOCATION,content:`->${t?t.toString():""}`,public_ip:e.proxyInfo.proxyaddr};e.proxyType===uE.self?o.device_o
```

## POST /v2/proxy/device/delAllDeviceLogs

- Client name: `delAllDeviceLogs`
- Candidate request keys: _none parsed_

```text
msg:_(t.Recycle_Delete)}));0!==Se.value.length&&(Ce.value=!0,Fe.value.title=window.t("clearRecycleBin")||"清空回收站",Fe.value.content=window.t("confirmDeleteClearProxyIrrecoverable")||"清空后代理将不可恢复，确认要删除么？",Fe.value.sbmitFunc=()=>{(async()=>{const{code:e=0}=await Pe.delAllDeviceLogs(!0);200===e&&($(window.t("clearRecycleBinSuccess")||"清空回收站成功","success"),Ye())})(),f(w.recycle_platProxy_clear_sure,T.path)},y(w.recycle_platProxy_clear,T.path))},Te=e=>{console.log("deleteProxy",e);const{id:a=0}=e;Ce.value=!0,Fe.value.title=window.t("delete")||"删除",Fe.value.content=window.t("confirmDeleteProxyIrrecovera
```

## POST /v2/proxy/device/delDeviceDynamicProxies

- Client name: `delDeviceDynamicProxies`
- Candidate request keys: `device_ids`

```text
&(a.success(window.t("deleteSuccess")||"删除成功"),d.value=!1,c("success"))}else if(i.useModule===v.ProxyAPI){if("ok"!==await g())return;if("ok"!==await b())return;const e=await(async()=>{const e={device_ids:V.value.map((e=>e.deviceid))};u.value=!0;const l=await n.delDeviceDynamicProxies(e);if(u.value=!1,200===l.code)return"ok"})();"ok"===e&&(a.success(window.t("deleteSuccess")||"删除成功"),d.value=!1,c("success"))}},_=P((()=>i.useModule===v.OfficialProxy?"删除代理后无法恢复，确认删除吗？":"删除代理后可在30天内去“回收站”恢复，确认删除吗？")),w=e=>{var l,a,s,t,i;return(null==(l=e.system)?void 0:l.toLowerCase().includes("windows"))?"windows
```

## POST /v2/proxy/device/delDeviceLogs

- Client name: `delDeviceLogs`
- Candidate request keys: `ids`

```text
h))},Te=e=>{console.log("deleteProxy",e);const{id:a=0}=e;Ce.value=!0,Fe.value.title=window.t("delete")||"删除",Fe.value.content=window.t("confirmDeleteProxyIrrecoverable")||"删除代理后无法恢复，确认删除么？",Fe.value.sbmitFunc=()=>{(async e=>{const a=[e||""],{code:l=0}=await Pe.delDeviceLogs({ids:a});j.getInstance().subscribe(P.platFormDel),200===l&&($(window.t("deletePlatformProxySuccess")||"删除平台代理成功","success"),j.getInstance().removeSub(P.platFormDel.type),Ye())})(a),f(w.recycle_platProxy_delete_sure,T.path)},y(w.recycle_platProxy_delete,T.path)},Be=G(!1),Ge=()=>{Be.value=!0,setTimeout((()=>{Be.value=!1}),700
```

## POST /v2/proxy/device/delDeviceProxyUserSelves

- Client name: `delDeviceProxyUserSelves`
- Candidate request keys: `company`, `company_id`, `user_id`, `device_ids`

```text
t g())return;if("ok"!==await b())return;const e=await(async()=>{const e=V.value.map((e=>e.deviceid)),l={company:s().user.companyData.companyName,company_id:s().user.companyData.companyId,user_id:s().user.userData.userId,device_ids:e};u.value=!0;const a=await n.delDeviceProxyUserSelves(l);if(u.value=!1,200===a.code)return"ok"})();"ok"===e&&(a.success(window.t("deleteSuccess")||"删除成功"),d.value=!1,c("success"))}else if(i.useModule===v.ProxyAPI){if("ok"!==await g())return;if("ok"!==await b())return;const e=await(async()=>{const e={device_ids:V.value.map((e=>e.deviceid))};u.value=!0;const l=await n
```

## POST /v2/proxy/device/delTag

- Client name: `delTag`
- Candidate request keys: `company`, `companyid`, `labelid`

```text
ermissionMsg",{msg:u(s.Env_TagManage_Delete)}));if(!x.value.length)return;m.confirm(window.t("sureToDeleteTags"),(async(a,e,l)=>{e.value=!0;const o=x.value.map((a=>a.labelid)),s={company:i.companyData.name,companyid:i.companyData.companyId,labelid:o},t=await y.delTag(s);e.value=!1,200===t.code?(_.success(window.t("deleteSuccess")||"删除成功"),aa(),z.value=!0):_.warning(window.t("serviceError")||"服务器错误"),l.value=!1}))},Z=a=>{const e=E.value.find((e=>e.userId===a));return e?e.name||e.realName||e.mobile||e.email||"":"-"},aa=async()=>{if(!T.value)try{T.value=!0;const a={company:i.companyData.name,comp
```

## POST /v2/proxy/device/dynamics/in/userPkg

- Client name: `dynamicsUserPkg`
- Candidate request keys: `vtype`, `password`, `orderId`

```text
===l.code&&l.data&&(I.value[a]={total_flow:new Za(l.data.total_flow).div(new Za(1024)).toDecimalPlaces(2),use_flow:new Za(l.data.use_flow).div(new Za(1024)).toDecimalPlaces(2)})}))}if("zmdc"===e.virtual){const l=(e.device_info||"").split("-"),t=l[l.length-3];v.dynamicsUserPkg({vtype:e.virtual,password:e.proxyp,orderId:t}).then((l=>{200===l.code&&(console.log("芝麻使用情况",e),I.value[a]={package_all:l.data.package_all,package_balance:l.data.package_balance})}))}}))})),(e,a)=>{const l=R,p=s,m=S,b=u,I=M;return Be(),Ve("div",Jl,[Le(I,{"max-height":400,data:e.dataList,class:"main",ref_key:"tableRef",ref
```

## POST /v2/proxy/device/dynamics/proxy

- Client name: `postDynamicsProxy`
- Candidate request keys: `city`, `username`, `instance_id`, `num`

```text
?void 0:o.country:null==o?void 0:o.zhou;if(e.proxyInfo&&"1"===e.proxyInfo.Proxytype&&e.proxyInfo.instance_no&&""!==e.proxyInfo.instance_no&&"official"===e.proxyType&&4===e.proxyInfo.cloud_type){const n=await(async(e,t)=>{D.value=!0;const{code:n,data:o}=await E.postDynamicsProxy({city:t,username:fL().user.companyData.companyId,instance_id:e.proxyInfo.cloud.instance_id,num:1});if(D.value=!1,200===n&&o.list&&o.list[0]){const t=o.list[0].list[0].split("-").slice(0,5);return{Addr:`${o.list[0].proxyUrl}`,User:t.join("-"),Passwd:e.proxyInfo.proxyp}}})(e,t);n&&(a=n,r.proxy.socks5=n,r.proxy.region=`${o
```

## POST /v2/proxy/device/dynamics/userinfo

- Client name: `dynamicsUserinfo`
- Candidate request keys: `vtype`, `username`

```text
=(e=p.dataList)||e.forEach((e=>{e.expired_time=B(e.expired_time).format("YYYY-MM-DD HH:mm:ss");const a=`${e.virtual}${e.device_id}`;if(!I.value[a]&&"ipidea"===e.virtual){const l={vtype:e.virtual,username:e.proxyu};e.instance_no&&(l.instance_no=e.instance_no),v.dynamicsUserinfo(l).then((e=>{const l=e.data;l&&200===l.code&&l.data&&(I.value[a]={total_flow:new Za(l.data.total_flow).div(new Za(1024)).toDecimalPlaces(2),use_flow:new Za(l.data.use_flow).div(new Za(1024)).toDecimalPlaces(2)})}))}if("zmdc"===e.virtual){const l=(e.device_info||"").split("-"),t=l[l.length-3];v.dynamicsUserPkg({vtype:e.vi
```

## POST /v2/proxy/device/findDesignateDevices

- Client name: `findDesignateDevices`
- Candidate request keys: _none parsed_

```text
er_id:ce.userData.userId};if(t.device_ids=Ie.multipleSelection.filter((e=>["official","self","general"].includes(e.device_type))).map((e=>({device_id:e.proxy.uuid,trademark:e.proxy.deviceType}))),t.device_ids.length&&1===pe.device_authorities){const e=await ve.findDesignateDevices(t);200===e.code&&e.data.length&&e.data.some((e=>![2,3].includes(e.authority)))&&(Ve.value=!0)}Ve.value&&(_e.value=!1)})()})),(e,a)=>{const l=p;return ke.value?C((P(),U(d,{key:0,modelValue:ke.value,"onUpdate:modelValue":a[6]||(a[6]=e=>ke.value=e),width:2===$e.value?800:520,title:2===$e.value?e.$t("envPop.migrateEnv")|
```

## POST /v2/proxy/device/findDevices

- Client name: `findDevices`
- Candidate request keys: `device_ids`, `trademark`

```text
],mem:[]}}),actions:{async getProxyListItemData(){if(!this.proxy.deviceType||this.proxy.deviceType===uE.local)return this.proxy.proxyType=uE.local,void(this.proxy.proxyData=null);const e={device_ids:[this.proxy.uuid],trademark:this.proxy.deviceType},t=await oA.findDevices(e);200===t.code&&t.data.length>0&&(this.proxy.proxyType=this.proxy.deviceType,this.proxy.proxyData=t.data[0],this.proxy.deviceType===uE.official&&4===t.data[0].cloud_type&&(this.proxy.proxyData._selectArea=[this.proxy.overseas.zhou,this.proxy.overseas.country,this.proxy.overseas.city]))},async getPluginGroupList(){const e=awa
```

## POST /v2/proxy/device/findNotAuthDesignateDevices

- Client name: `findNotAuthDesignateDevices`
- Candidate request keys: `device_ids`, `device_id`, `trademark`

```text
})(o)),t},Et=async(e,o)=>{if(e===h.local){const t=o;if(!t)throw new Error("查询渠道不能为空");return await At(e,t)}if("string"==typeof e&&"string"==typeof o){if(!e||!o)throw new Error("proxyType或deviceId不能为空");const t={device_ids:[{device_id:o,trademark:e}]},r=await d.findNotAuthDesignateDevices(t);if(200===r.code&&r.data.length>0){const o=r.data[0].data;return await At(e,o)}}else if("object"==typeof o){const t=o;return await At(e,t)}},Lt=async(e,o=0)=>{if(!e)return;let t=null,r=String(o);"0"===r&&(r=m(5));const n={id:`${(new Date).getTime()}_${r}`,url:e};console.log("extractProxyLink",n.id);const a=e
```

## POST /v2/proxy/device/findRandDeviceList

- Client name: `findRandDeviceList`
- Candidate request keys: `num`, `trademark`, `isBind`, `inspect`, `ip_place`

```text
t.value)?void 0:e.length)&&(o=`${null==t?void 0:t.value[1]}-${null==t?void 0:t.value[3]}`);const n={num:u.randomNum,trademark:T.value,isBind:(null==a?void 0:a.value)?2:0,inspect:(null==l?void 0:l.value)?1:0,ip_place:o};console.log(n),I.value=!0;const i=await v.findRandDeviceList(n);if(I.value=!1,200===i.code){const e=i.data||[];m("randomSuccess",T.value,e),w.value=!1}};return(e,a)=>{const l=k,t=P,n=C,i=A,r=S,s=Ee("permission");return Be(),Ve("div",Dl,[Le(r,{placement:e.placement,effect:"light",visible:w.value},{content:Ne((()=>[$e("div",El,[a[6]||(a[6]=$e("div",{class:"title"},"随机选择规则",-1)),$e
```

## POST /v2/proxy/device/findVcnpList

- Client name: `findVcnpList`
- Candidate request keys: `device_ids`

```text
..b,...c(i)},f){case uE.local:b.uuid=void 0,b.db=v,b.isLocal=!0,b.type="",b.host="",b.port="",b.user="",b.pwd="";break;case uE.official:{d&&u&&(b={...b,...l(u.Addr),user:u.User||"",pwd:u.Passwd||(null==b?void 0:b.proxyp)||""});let e=s;if(!e)try{const n=await t.findVcnpList({device_ids:[b.uuid]});if(console.log("findVcnpList_:",n),n&&200===n.code&&n.data&&Array.isArray(n.data.data)&&n.data.data.length){e=n.data.data[0].cloud}}catch(_){console.log("findVcnpList_error_:",_),m=_}if(e)try{if(p&&(!d||!u)){let e="";try{e=Array.isArray(p)?p:JSON.parse(p)}catch(_){console.log("bridgeAddr_error_:",_)}Ar
```

## POST /v2/proxy/device/recycleDelAllDeviceDynamicProxies

- Client name: `recycleDelAllDeviceDynamicProxies`
- Candidate request keys: `trademark`

```text
sg",{msg:p(s.Recycle_Delete)}));0!==ne.value.length&&(de.value=!0,ve.value.title=window.t("clearRecycleBin")||"清空回收站",ve.value.content=window.t("confirmDeleteClearRecycleBin")||"清空后通用API将不可恢复，确认要删除么？",ve.value.sbmitFunc=()=>{(async()=>{const{code:e=0}=await te.recycleDelAllDeviceDynamicProxies({trademark:"general"});200===e&&(b(window.t("clearRecycleBinSuccess")||"清空回收站成功","success"),we())})(),d(v.recycle_proxyApi_clear_sure,S.path)},m(v.recycle_proxyApi_clear,S.path))},_e=e=>{console.log("deleteProxy",e);const{deviceid:a=""}=e;de.value=!0,ve.value.title=window.t("delete")||"删除",ve.value.conte
```

## POST /v2/proxy/device/recycleDelAllDeviceProxyUserSelves

- Client name: `recycleDelAllDeviceProxyUserSelves`
- Candidate request keys: _none parsed_

```text
msg:d(s.Recycle_Delete)}));0!==fe.value.length&&(ge.value=!0,_e.value.title=window.t("clearRecycleBin")||"清空回收站",_e.value.content=window.t("confirmDeleteClearProxyIrrecoverable")||"清空后代理将不可恢复，确认要删除么？",_e.value.sbmitFunc=()=>{(async()=>{const{code:e=0}=await ue.recycleDelAllDeviceProxyUserSelves();200===e&&(b(window.t("clearRecycleBinSuccess")||"清空回收站成功","success"),xe())})(),p(v.recycle_selfProxy_clear_sure,$.path)},y(v.recycle_selfProxy_clear,$.path))},Ie=e=>{console.log("deleteProxy",e);const{deviceid:a=""}=e;ge.value=!0,_e.value.title=window.t("delete")||"删除",_e.value.content=window.t("confi
```

## POST /v2/proxy/device/recycleDelDeviceProxyUserSelves

- Client name: `recycleDelDeviceProxyUserSelves`
- Candidate request keys: `device_ids`

```text
=e=>{console.log("deleteProxy",e);const{deviceid:a=""}=e;ge.value=!0,_e.value.title=window.t("delete")||"删除",_e.value.content=window.t("confirmDeleteProxyIrrecoverable")||"删除代理后无法恢复，确认删除么？",_e.value.sbmitFunc=()=>{(async e=>{const a=[e||""],{code:l=0}=await ue.recycleDelDeviceProxyUserSelves({device_ids:a});g.getInstance().subscribe(_.selfDel),200===l&&(b(window.t("deleteOwnProxySuccess")||"删除自有代理成功","success"),g.getInstance().removeSub(_.selfDel.type),xe())})(a),p(v.recycle_selfProxy_delete_sure,$.path)},y(v.recycle_selfProxy_delete,$.path)},ke=e=>{const{deviceid:a="",name:l=""}=e;ge.value=!0
```

## POST /v2/proxy/device/recycleRecoverAllDeviceProxyUserSelves

- Client name: `recycleRecoverAllDeviceProxyUserSelves`
- Candidate request keys: _none parsed_

```text
("noPermissionMsg",{msg:d(s.Recycle_Recover)}));0!==fe.value.length&&(ge.value=!0,_e.value.title=window.t("restoreAll")||"全部恢复",_e.value.content=window.t("confirmRestoreAllProxies")||"确认恢复回收站中的所有代理吗？",_e.value.sbmitFunc=()=>{(async()=>{const{code:e=0}=await ue.recycleRecoverAllDeviceProxyUserSelves();200===e&&(b(window.t("restoreAllSuccess")||"全部恢复成功","success"),xe())})(),p(v.recycle_selfProxy_allRestore_sure,$.path)},y(v.recycle_selfProxy_allRestore,$.path))},De=()=>{if(!t(s.Recycle_Delete))return k.warning(window.t("noPermissionMsg",{msg:d(s.Recycle_Delete)}));0!==fe.value.length&&(ge.value=
```

## POST /v2/proxy/device/recycleRecoveryAllDeviceDynamicProxies

- Client name: `recycleRecoveryAllDeviceDynamicProxies`
- Candidate request keys: `trademark`

```text
ermissionMsg",{msg:p(s.Recycle_Recover)}));0!==ne.value.length&&(de.value=!0,ve.value.title=window.t("restoreAll")||"全部恢复",ve.value.content=window.t("confirmRestoreAllCommonAPI")||"确认恢复回收站中的所有通用API吗？",ve.value.sbmitFunc=()=>{(async()=>{const{code:e=0}=await te.recycleRecoveryAllDeviceDynamicProxies({trademark:"general"});200===e&&(b(window.t("restoreAllSuccess")||"全部恢复成功","success"),we())})(),d(v.recycle_proxyApi_allRestore_sure,S.path)},m(v.recycle_proxyApi_allRestore,S.path))},ge=()=>{if(!t(s.Recycle_Delete))return D.warning(window.t("noPermissionMsg",{msg:p(s.Recycle_Delete)}));0!==ne.value
```

## POST /v2/proxy/device/recycleRecoveryDeviceDynamicProxies

- Client name: `recycleRecoveryDeviceDynamicProxies`
- Candidate request keys: `device_ids`

```text
=e=>{console.log("deleteProxy",e);const{deviceid:a=""}=e;de.value=!0,ve.value.title=window.t("delete")||"删除",ve.value.content=window.t("confirmDeleteProxyIrrecoverable")||"删除代理后无法恢复，确认删除么？",ve.value.sbmitFunc=()=>{(async e=>{const a=[e||""],{code:l=0}=await te.recycleRecoveryDeviceDynamicProxies({device_ids:a});g.getInstance().subscribe(_.commonApiDel),200===l&&(b(window.t("deleteCommonAPISuccess")||"删除通用API成功","success"),g.getInstance().removeSub(_.commonApiDel.type),we())})(a),d(v.recycle_proxyApi_delete_sure,S.path)},m(v.recycle_proxyApi_delete,S.path)},be=e=>{const{deviceid:a="",name:l=""}
```

## POST /v2/proxy/device/recycleRecoveryDeviceProxyUserSelves

- Client name: `recycleRecoveryDeviceProxyUserSelves`
- Candidate request keys: `device_ids`

```text
xy_delete,$.path)},ke=e=>{const{deviceid:a="",name:l=""}=e;ge.value=!0,_e.value.title=window.t("recover")||"恢复",_e.value.content=window.t("confirmRestoreNamedItem",{name:l})||`确认恢复“${l}”吗？`,_e.value.sbmitFunc=()=>{(async e=>{const a=[e||""],{code:l=0}=await ue.recycleRecoveryDeviceProxyUserSelves({device_ids:a});g.getInstance().subscribe(_.selfRevert),200===l&&(b(window.t("restoreOwnProxySuccess")||"恢复自有代理成功","success"),g.getInstance().removeSub(_.selfRevert.type),xe())})(a),p(v.recycle_selfProxy_restore_sure,$.path)},y(v.recycle_selfProxy_restore,$.path)},je=e=>{const a=[];e.forEach((e=>{cons
```

## POST /v2/proxy/device/replaceProxy

- Client name: `replaceProxy`
- Candidate request keys: `device_id`, `reason_code`, `reason_platform`

```text
ning(1===l?"手机号不存在":"邮箱不存在");const t=await c.verifyCode({username:a,code:e});if(200!==(null==t?void 0:t.code))return;y.value=!1}catch(t){return void u.error(window.t("serviceException")||"服务异常")}finally{m.value=!1}await(async()=>{m.value=!0;try{const e=await c.replaceProxy({device_id:o.proxyData.device_id||o.proxyData.deviceid,reason_code:L.reason,reason_platform:L.platform},!0);200===(null==e?void 0:e.code)?(u.success("更换代理提交成功"),a.value=!1):u.warning((null==e?void 0:e.msg)||"更换失败")}catch(t){u.error(window.t("serviceException")||"服务异常")}finally{m.value=!1}})()}};return ve((()=>{(async()=>{con
```

## POST /v2/proxy/device/resetname

- Client name: `resetDeviceName`
- Candidate request keys: `device_type`, `device_id`, `name`

```text
us)?void 0:l.call(a))||null==(o=null==(t=p.value)?void 0:t.focus)||o.call(t)}))},k=async()=>{var e,a,t;if(!c.value||v.value)return;const i=null==(e=d.value)?void 0:e.trim();if(i)if(i!==(null==(a=l.proxyRow)?void 0:a.device_name)){v.value=!0;try{const e=await n.resetDeviceName({device_type:1,device_id:null==(t=l.proxyRow)?void 0:t.device_id,name:i});200===(null==e?void 0:e.code)?(u.success(window.t("modifySuccess")||"修改成功"),l.proxyRow.device_name=i,c.value=!1,o("updated")):u.error(window.t("modifyFail")||"修改失败")}catch(r){u.error(window.t("error")||"Error: 服务异常，请及时联系管理员解决")}v.value=!1}else c.val
```

## POST /v2/proxy/device/updateDeviceDynamicProxies

- Client name: `updateDeviceDynamicProxies`
- Candidate request keys: `deviceid`, `trademark`, `name`, `type`, `autoswitch`, `url`, `ip_query_channel`

```text
.value.time="",E.value.detectResult=null},M=()=>{y("cancel")},Y=async()=>{const e={deviceid:k.deviceid||"",trademark:"general",name:k.proxyName,type:k.proxyType,autoswitch:k.extractType,url:k.extractLink,ip_query_channel:k.ipChannel};m.value=!0;const a=await v.updateDeviceDynamicProxies(e);if(m.value=!1,oe.saveApi.data.code=a.code,ne.getInstance().subscribe(oe.saveApi,{leftMenu:ie.THIRD_PROXY}),200===a.code)return ne.getInstance().removeSub(oe.saveApi.type),k.deviceid=a.data.deviceid,"success"},F=async()=>{"success"===await Y()&&(E.value.detectResult||await $(!0),await N(),await(async()=>{cons
```

## POST /v2/proxy/device/updateDeviceProxyUserSelves

- Client name: `updateDeviceProxyUserSelves`
- Candidate request keys: `company`, `companyid`, `userid`, `non_repeat`, `proxy`, `notes`, `trademark`

```text
rget_url:[Re.proxyUrl]},o={company:y().user.companyData.companyName,companyid:y().user.companyData.companyId,userid:y().user.userData.userId,non_repeat:Ve.value?1:0,proxy:[l]};Ce.value=!0;let a="OKBtn";"Confirm2"===ll.value&&(a="OK2Btn"),Xe(a);const t=await Se.updateDeviceProxyUserSelves(o);if(Ce.value=!1,Me(a),200===t.code){if(0===t.data.success)return Ve.value&&1===t.data.repeat?T.error("检测到您要添加的代理与“自有代理列表中”存在重复，禁止添加！若想添加，请不要勾选“校验重复项”！"):T.error(ke.editOwnProxyInfo?window.t("editFail"):window.t("addFail"));if(ke.editOwnProxyInfo){if(De.value.length>0){const e=await(async e=>{const l={proxy:E
```

## POST /v2/proxy/device/updateIPAddressSegment

- Client name: `ipDetect`
- Candidate request keys: `ip`, `approach`, `deviceId`, `ip_channel`, `inspect`

```text
de)&&(a.data&&a.data.db||a.ipChannel)||e.ip_query_channel||Y.ipinfo};e.inspect=r(a),e.updated_at=B().format("YYYY-MM-DD HH:mm:ss"),0===a.code&&a.data.country&&a.data.city&&(e.publicip=a.data.ip,e.ip_place=`${a.data.country}-${a.data.city}`);try{const a=await v.ipDetect(t);e.checking=!1,a&&200===a.code&&y("refresh")}catch(l){n.error(window.t("serviceException")||"服务异常")}finally{o(e)}}else o(e)})(a)),["stop"])},{default:Ne((()=>[Le(Ue(U))])),_:2},1032,["class","onClick"])])),_:2},1024)):Xe("",!0)])])),_:1},8,["label"]),Le(l,{label:"地域","min-width":"120"},{default:Ne((e=>{var a,l,t,o;return[4===e
```

## POST /v2/proxy/device/updateIPAddressSegmentBatch

- Client name: `updateIPAddressSegmentBatch`
- Candidate request keys: `ip`, `approach`, `deviceId`, `inspect`, `ip_channel`

```text
"extractFail"})(e);let l;l="extractFail"===a?[{ip:"",approach:2,deviceId:e.deviceid,ip_channel:e.ip_query_channel,inspect:666}]:[{ip:a.ip,approach:2,deviceId:e.deviceid,ip_channel:e.ip_query_channel,inspect:n(a.detectResult)}],await(async e=>{if(200===(await c.updateIPAddressSegmentBatch(e)).code)return"success"})(l),e.loading=!1},k=Se();return l({handleDefaultCheck:()=>{var e,a;const l=null==(e=tempAllProxyList.value)?void 0:e.map((e=>e.deviceid));null==(a=u.dataList)||a.forEach((e=>{var a;(null==l?void 0:l.includes(e.deviceid))&&(null==(a=k.value)||a.toggleRowSelection(e,!0))}))}}),(e,a)=>{c
```

## POST /v2/proxy/device/updateTag

- Client name: `updateTag`
- Candidate request keys: `label`, `color`, `company`, `companyid`, `labelid`

```text
;x.value=!1,e&&200===e.code&&(n.success(window.t("addSuccess")||"添加成功"),B(),w.value="")},k=Se(""),P=async()=>{if(!k.value||!k.value.trim())return n.warning(window.t("pleaseLabel")||"请输入标签");const e=ma(),a={label:k.value,color:e.type};x.value=!0;const l=await i.updateTag(a);x.value=!1,k.value="",200===l.code&&(n.success(window.t("addSuccess")||"添加成功"),L())},C=Ie(v,"group"),A=Ie(v,"tags"),S=Se([]),I=()=>{const e=S.value.length?S.value:g.envManage.envGroupList;let[a]=e.filter((e=>2===e.system_group));const l=a&&a.gropid;"/accoun"===_.value&&g.envManage.envGroupId?g.envManage.envGroupId!==l?C.valu
```

## POST /v2/retail/createPromotionLink

- Client name: `createPromotionLink`
- Candidate request keys: `customContent`, `linkName`, `idempotencyKey`

```text
ue=!U.value},L=async e=>{if(v.value)return U.value=!1,void d.warning(`一个用户最多只能创建${u.value}个自定义链接/邀请码`);const a=e.customContent.trim();N.value=!0;try{const t={customContent:a,linkName:e.linkName.trim()||a,idempotencyKey:`${a}-${(new Date).getTime()}`},s=await l.createPromotionLink(t,!0);if(200!==s.code)return void d.error(s.msg||"创建推广链接失败");d.success(window.t("submitSuccess")||"提交成功"),U.value=!1,A()}catch(t){d.error(window.t("serverErrorTimely")||"服务端错误，请联系管理员及时处理")}finally{N.value=!1}},Q=e=>{Y.value=e,w.value=!1,setTimeout((()=>{y.value=!0}),500)},J=(e,a)=>{ee(e,(()=>{d.success(a)}))};return F
```

## POST /v2/retail/createRetailWithdrawLog

- Client name: `applywithdrawals`
- Candidate request keys: `amount`

```text
ror(window.t("pleaseSelectTeam")||"请选择团队!"),!1;return!0})())return;P.value=!0;let l=!0;if(1===A.mode?l=await S():3===A.mode&&(A.accountName=(null==(a=null==(e=f.value)?void 0:e.filter((e=>e.companyId===A.companyId))[0])?void 0:a.name)||""),l)try{200===(await n.applywithdrawals({...A,amount:Number(A.amount)})).code&&(d.success(window.t("applyforSucess")||"申请成功"),p("close"))}catch(t){d.error(window.t("serverErrorTimely")||"Error:服务端错误，请联系管理员及时处理。")}P.value=!1},L=Z((()=>!K&&!H));return B((()=>A.mode),(e=>{3===e&&z()})),F((()=>{(async()=>{try{const{data:e}=await n.commissionsConfigInfo();m.value=e
```

## POST /v2/rpa/copyRpaCarbonConfig

- Client name: `copyRpaCarbonConfig`
- Candidate request keys: `configId`

```text
e:"error"})})),S(b.rpa_taskTemplate_delete_sure,c.path)},we=(e,a,l)=>{if(a.noPermission)r.warning(window.t("packagePurchaseTips"));else switch(p.value[e].hide(),a.type){case"copy":(e=>{C(b.rpa_taskTemplate_copyTemplate,c.path);const a={configId:e};h.value=!0,v.copyRpaCarbonConfig(a).then((e=>{h.value=!1,200===e.code?(r({message:window.t("copySuccess")||"复制成功",type:"success"}),z()):r({message:window.t("copyError")||"复制失败",type:"error"})})).catch((e=>{console.log(e),h.value=!1,r({message:window.t("copyError")||"复制失败",type:"error"})}))})(l);break;case"top":he(l);break;case"del":(e=>{const a=M.val
```

## POST /v2/rpa/createRpaGroup

- Client name: `createRpaGroup`
- Candidate request keys: `name`

```text
anyId)||"",groupId:"-1",name:window.t("noGroup")||"未分组",userId:(null==(l=e.list[0])?void 0:l.userId)||""}].concat(e.list):k.value=e.list,c.value.setScrollTop(0)),g.value=!1})).catch((e=>{g.value=!1,console.log(e)})))},R=()=>{const e={name:w.value};g.value=!0,i.createRpaGroup(e,!0).then((e=>{g.value=!1,200===e.code?(r({message:window.t("createGroupSuccess")||"创建分组成功",type:"success"}),w.value="",s("update"),V()):50005===e.code?r({message:window.t("Groupexists")||"分组名称已存在",type:"error"}):r({message:window.t("createGroupFail")||"创建分组失败",type:"error"})})).catch((()=>{g.value=!1,r({message:window.t(
```

## POST /v2/rpa/createRpaPlanManagement

- Client name: `createRpaPlanManagement`
- Candidate request keys: _none parsed_

```text
count:o,configId:s,group:n,endTime:i,executeFrequency:u,executeType:c,executionMonth:d,executionTime:be(p),executionWeek:v,intervalTime:m,priorityExecute:g,runNum:h,startTime:f,status:1,cdeviceId:l,rdeviceId:t,rerpaCarbonConfig:w,planName:y},{code:_=0}=await A.createRpaPlanManagement(x);200===_?r({message:window.t("addTaskSucess")||"添加计划任务成功",type:"success"}):r.error(window.t("addTaskError")||"添加计划任务失败"),me.value=!1},fe=J((()=>{var e;return!!(null==(e=b.value)?void 0:e.length)&&b.value.some((e=>"Firefox"===e.kernel))})),we=F([]),ye=e=>{1===e||2===e&&(K.value.planName=`plan_${c().format("YYYY-M
```

## POST /v2/rpa/getRpaPlanManagementList

- Client name: `getRpaPlansPost`
- Candidate request keys: `userId`, `executeType`, `accountIds`, `pageIndex`, `pageSize`, `executeFrequency`, `rdeviceId`, `executeTypes`

```text
anOpen)}));await Promise.all(e)})()}}finally{ue.value="",ie.changeaccount({}),F.value=!1}},wl=async()=>{await yl(),se.getCanOpenEnvList()},Al=async e=>{if(Array.isArray(e)&&e.length)try{const a={userId:se.userData.userId,executeType:11,accountIds:e},l=(await j.getRpaPlansPost(a)).list||[];for(let e=0;e<l.length;e++){const[a]=l[e].account;if(a&&a.shopid)for(let t=0;t<gl.value.length;t++)if(a.shopid===gl.value[t].shopid){gl.value[t].cookieRobot||(gl.value[t].cookieRobot=l[e]);break}}}catch(a){console.log("getCookieRobotList_:",a)}},kl=async e=>{var a;try{const l=ee.value.map((e=>e.shopId)),t=awa
```

## POST /v2/sso/auth/bind

- Client name: `bindPhoneEmail`
- Candidate request keys: _none parsed_

```text
l(v.value),m.value=60)}),1e3)})()})).catch((()=>{a(window.t("serverError")||"服务端错误","error")})).finally((()=>{setTimeout((()=>{h.value=!1}),1500)}))}else a(window.t("inputCorrectPhoneNum")||"请输入正确的手机号","error")},b=G(),y=()=>{b.value&&b.value.validate((e=>{e&&n.bindPhoneEmail(p).then((e=>{200===e.code&&(a(window.t("bindSuccess")||"绑定成功","success"),r("submit",p))})).catch((()=>{a(window.t("serverError")||"服务端错误","error")}))}))},g=()=>{},f=[{title:window.t("scanQrCodes"),index:1},{title:window.t("enterCode"),index:2}],C=G(""),k=G(1);return(a,s)=>{const o=l,n=t,r=$,u=i;return O(),H(e,{visible:te(d
```

## POST /v2/sso/auth/bindThirdLogin

- Client name: `bindThirdAccount`
- Candidate request keys: `scene`, `types`, `code`, `state`

```text
Account",props:{bind:{default:()=>({mp:0,ding:0,mini:0,wechat:0})}},setup(t){const l=qe(),i=L("$api"),s=R(),o=[{icon:"setupw",key:"mp",title:window.t("weChat")},{icon:"setupd",key:"ding",title:window.t("dingtalk")}],n=G(0),r=G(),c=G(""),p=G(!1),m=G(""),v=e=>{i.bindThirdAccount({scene:e,types:3},!0).then((t=>{200===t.code?(a("绑定成功","success"),p.value=!1,s.registerUser(),clearTimeout(r.value)):10054===t.code?(a(window.t("bindWeChatTip1"),"error"),h()):n.value<100?r.value=setTimeout((()=>{v(e),n.value+=1}),3e3):(n.value=0,c.value="")}))},h=async()=>{clearTimeout(r.value);try{const e=await i.getwx
```

## POST /v2/sso/auth/changePwd

- Client name: `changePwd`
- Candidate request keys: `newPassword`

```text
ta.password=s.password,we.setPwd.data.error="首次登录设置密码-前端密码校验不通过",we.setPwd.data.reportType="web",s.passwordValidate(we.setPwd)),void x(window.t("loginModu.set624Password"),"error");oe();const e={newPassword:s.password};s.recomCode&&(e.inviteCode=s.recomCode),a.changePwd(e).then((e=>{we.setPwd.data.password=s.password,we.setPwd.data.code=e.code,we.setPwd.data.error=`首次登录设置密码失败-${e.msg}`,we.setPwd.data.reportType="server",Ce.subscribe(we.setPwd),200===e.code?(x(window.t("loginModu.registrationSuccess"),"success"),p("success"),Ce.removeSub(we.setPwd)):(ne(),x(window.t(ue(e.code)),"error"))})).cat
```

## POST /v2/sso/auth/modifyMobileEmail

- Client name: `modifyMobileEmail`
- Candidate request keys: `username`, `modifyCode`, `code`

```text
idate((e=>{e&&(1===w.value?(console.log("校验 原手机号验证码"),n.verifyModifyCode({username:g.value,modifyCode:S.value,code:y.code}).then((e=>{200===e.code&&(S.value=e.data,y.code="",w.value=2,k.value=!1,clearInterval(C.value),f.value=60)}))):(console.log("提交更换联系方式"),n.modifyMobileEmail({username:y.username,modifyCode:S.value,code:y.code}).then((e=>{200===e.code&&(a(window.t("bindSuccess")||"绑定成功","success"),r("submit",y))})).catch((()=>{a(window.t("serverError")||"服务端错误","error")}))))}))},I=()=>{};return(a,s)=>{const o=l,n=t,r=$,u=i;return O(),H(e,{visible:te(c),"onUpdate:visible":s[2]||(s[2]=e=>le(c)
```

## POST /v2/sso/auth/myUserinfo

- Client name: `getuserinfo`
- Candidate request keys: _none parsed_

```text
utInfo(e),GS.set(Un.token,e.token,86400*zn.expireTime),this.SET_TOKEN(e.token)},drlogin(e){YS().setLogoutInfo("user=》 drlogin"),YS().setLogoutInfo(e),GS.set(Un.token,e.token,86400*zn.expireTime),this.SET_TOKEN(e.token)},GetInfo(){return new Promise(((e,t)=>{oA.getuserinfo({}).then((t=>{200===t.code&&(GS.set(Un.userInfo,t.data.userinfo),YS().setLogoutInfo("user=》 GetInfo"),YS().setLogoutInfo(t),this.SET_TOKEN(t.data)),e(t.data)})).catch((e=>{t(e)}))}))},getcloudcoinsnumb(){return oA.getcloudcoinsnumb({}).then((e=>{e&&200===e.code&&(this.balance=e.data.balance||"0.00")}))}}});var e8=(e=>(e.HEART
```

## POST /v2/sso/auth/sendModifyCode

- Client name: `sendModifyCode`
- Candidate request keys: `checkExist`, `code`, `uuid`, `username`, `modifyCode`, `types`

```text
tEmail")||"请输入正确的邮箱":"")(e||"");if(t)return void a(t,"error");k.value=!0;const l=(new Date).getTime(),i={checkExist:1!==w.value,code:Me.hashAsciiStr(l+"Adf3d31d"+e),uuid:l.toString(),username:e,modifyCode:S.value,types:1===u.type?"ChangePhone":"ChangeEmail"};n.sendModifyCode(i,!0).then((e=>{if(200===e.code)S.value=e.data,(()=>{let e=60;C.value=setInterval((()=>{e-=1,f.value=e,e<=0&&(clearInterval(C.value),f.value=60,k.value=!1)}),1e3)})();else if(k.value=!1,10011===e.code){const e={1:window.t("errorCodeKey.getCaptchaPhoneFail"),2:window.t("errorCodeKey.getCaptchaEmailFail")}[u.type];a(e||windo
```

## POST /v2/sso/auth/setIndustryInfo

- Client name: `setIndustryInfo`
- Candidate request keys: `industry_label`

```text
l.value)&&!y.value)),w={"cross-border-ecommerce":vte,"social-media-operation":yte,"affiliate-marketing":wte,"data-analysis":xte,"software-testing":Cte,"brand-protection":Ate,other:Pte},C=e=>l.value.length>=3&&!l.value.includes(e.id),S=async()=>{const e=await n.setIndustryInfo(((e,t)=>e.some((e=>e.isUncertain))?{industry_label:""}:{industry_label:e.map((e=>e.isOther?t.trim():e.name)).filter(Boolean).join(",")})(f.value,c.value));if(200!==e.code)throw new Error(e.msg||"平台配置提交失败")},A=async()=>{const e=await n.setNewbieStep({skip:0,step:1,data:{platformId:"",platformType:1,accountId:"",cloudId:0,c
```

## POST /v2/sso/auth/setNewbieStep

- Client name: `setNewbieStep`
- Candidate request keys: `data`, `skip`, `step`, `platformId`, `platformType`, `accountId`, `cloudId`, `couponNo`, `officialDeviceId`, `selfDeviceId`, `orderNo`, `auth`, `startBrowserTime`

```text
 0:t.hideTour()}}const T7=s({});function M7(){const{showTour:e}=P7(),t=O("$api"),{user:n,autoCreateProxyStore:o,globalStore:r}=fL(),a=s(!1),i=async()=>{if(2===n.companyData.status)return o.setShow(!1),o.setShowProgress(!1),void e();c()},l=(e=T7.value.step)=>{t.setNewbieStep({data:T7.value.data,skip:1,step:e})},c=async()=>{const t=T7.value.data.officialDeviceId?T7.value.data.officialDeviceId:T7.value.data.selfDeviceId,{code:n,data:r}=await Vn(T7.value.data.officialDeviceId?uE.official:uE.self,t);a.value||(console.log("coreLink-checkProxy",n,r),0===n||200===n?(jE.value=!1,document.querySelector(
```

## POST /v2/sso/auth/tokenRefresh

- Client name: `tokenRefresh`
- Candidate request keys: _none parsed_

```text
nt(o)}},jo=async()=>{if(!localStorage)return;const e=localStorage.getItem("Authorization")||"",o=P(e)||{},{expire:t=0,value:r=""}=o;if(console.log("checkAuthorizationValid",t),t&&r)if(c.unix(t).subtract(3,"day").isBefore(c())){const{code:e=0,data:o={}}=await d.tokenRefresh({});if(console.log("token will expired",e,o),200===e){const{expire:e="",token:t=""}=o,r={expire:c(e).unix(),value:`Bearer ${t}`};u().setLogoutInfo("checkAuthorizationValid"),localStorage.setItem("Authorization",JSON.stringify(r));zo().setToken(JSON.stringify(r),p.RefreshToken)}else console.error("token refresh fail",e)}else
```

## POST /v2/sso/auth/ubind

- Client name: `unbindAuth`
- Candidate request keys: `ubind`, `userId`, `companyId`

```text
dow.t("unbindDDInfo")):"mp"===e&&(t=3,o=window.t("unbindWXTitle"),n=window.t("unbindWX"),r=window.t("unbindWXInfo"));const d={title:o,h:()=>[_e("p",{style:"font-size:18px;color:#000"},n),_e("p",{style:"margin-top:10px"},r)]};B.confirm(d,((o,n,r)=>{n.value=!0,i.unbindAuth({ubind:t,userId:a.userData.userId,companyId:a.companyData.companyId}).then((a=>{200===a.code&&(s.registerUser(),r.value=!1,"ding"===e?S(k.accSet_unbindDD_sure,l.path):"mp"===e&&S(k.accSet_unbindWx_sure,l.path))})).finally((()=>{n.value=!1}))})),"ding"===e?C(k.accSet_unbindDD,l.path):"mp"===e&&C(k.accSet_unbindWx,l.path)})(e.ke
```

## POST /v2/sso/auth/user/info/get

- Client name: `getUserIdinfo`
- Candidate request keys: `userId`

```text
)return!0;u.error("代理ID不存在")},G=async()=>{if(m.value)return;await W()&&(y.value=!0)},Q=async(e,l=0)=>{if(m.value)return;if(await W()){m.value=!0;try{const a=await(async e=>{var a;const l=(null==(a=d.companyData)?void 0:a.onwer)||"",{code:t=0,data:o={}}=await c.getUserIdinfo({userId:l});return 200!==t?"":1===e?o.mobile||"":o.email||""})(l);if(!a)return void u.warning(1===l?"手机号不存在":"邮箱不存在");const t=await c.verifyCode({username:a,code:e});if(200!==(null==t?void 0:t.code))return;y.value=!1}catch(t){return void u.error(window.t("serviceException")||"服务异常")}finally{m.value=!1}await(async()=>{m.valu
```

## POST /v2/sso/auth/verifyModifyCode

- Client name: `verifyModifyCode`
- Candidate request keys: `username`, `modifyCode`, `code`

```text
chaFail"),"error")}else{const t=Te(e.code)||window.t("errorCodeKey.getCaptchaFail");a(t,"error")}})).catch((()=>{k.value=!1,a(window.t("serverError")||"服务端错误","error")}))},_=G(),x=()=>{_.value&&_.value.validate((e=>{e&&(1===w.value?(console.log("校验 原手机号验证码"),n.verifyModifyCode({username:g.value,modifyCode:S.value,code:y.code}).then((e=>{200===e.code&&(S.value=e.data,y.code="",w.value=2,k.value=!1,clearInterval(C.value),f.value=60)}))):(console.log("提交更换联系方式"),n.modifyMobileEmail({username:y.username,modifyCode:S.value,code:y.code}).then((e=>{200===e.code&&(a(window.t("bindSuccess")||"绑定成功","su
```

## POST /v2/sso/forgetPwd

- Client name: `getforgepwd`
- Candidate request keys: `username`, `code`, `password`

```text
ssword,we.forget.data.regName=s.email,we.forget.data.error="重置密码-前端密码校验不通过",we.forget.data.reportType="web",s.passwordValidate(we.forget)),void x(window.t("loginModu.set624Password"),"error");const e={username:s.email,code:s.varCode,password:s.password};oe(),a.getforgepwd(e).then((e=>{we.forget.data.code=e.code,we.forget.data.password=void 0,we.forget.data.regName=s.email,we.forget.data.error=`重置密码失败-${e.msg}`,we.forget.data.reportType="server",Ce.subscribe(we.forget),200===e.code?(Ce.removeSub(we.forget),x(window.t("loginModu.changedSuccess"),"success"),c("change","userLogin",s.email)):(ne(),
```

## POST /v2/sso/getDingCfg

- Client name: `getddinfo`
- Candidate request keys: _none parsed_

```text
s://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${n}`,F(r),Rn.removeSub(jn.getWxQr)}else x(e.msg,"error")}catch(e){jn.getWxQr.data.code=e.status,jn.getWxQr.data.error=`获取微信二维码失败-${e.data&&e.data.msg||e.data||""}`,Rn.subscribe(jn.getWxQr)}finally{zn()}},M=()=>{a.getddinfo().then((e=>{jn.getDingQr.data.code=e.code,jn.getDingQr.data.error=`获取钉钉二维码失败-${e.msg}`,Rn.subscribe(jn.getDingQr),200===e.code&&Rn.removeSub(jn.getDingQr),t.state=e.data.state,t.redirectUrl=e.data.redirectUrl,t.appid=e.data.appid,((e,o,n)=>{var r,a;r=window,a=document,r.DDLogin=function(e){var o,n=a.createElement("iframe");let
```

## POST /v2/sso/login

- Client name: `getuserlogin`
- Candidate request keys: `os`, `source`, `last_login_port`, `last_login_device`, `cl`, `username`, `code`, `uuid`

```text
Authorization",""),Hn?$7.push("/"):Pt&&(GS.remove("myUserInfo"),$7.push("/login"))},SET_TOKEN(e){this.token=`Bearer ${e.token}`,GS.set("Authorization",this.token,86400*zn.expireTime)},Login(e){return new Promise(((t,n)=>{const o=Q7(),r=X7(),{channel:a=""}=r;oA.getuserlogin({...e,os:q7(),source:`${o}`,last_login_port:"client",last_login_device:"pc",cl:a},!0).then((e=>{console.log(e),200===e.code&&(YS().setLogoutInfo("user=》login"),YS().setLogoutInfo(e),this.SET_TOKEN(e.data)),t(e)})).catch((e=>{n(e)}))}))},DdQrCodeLogin(e){YS().setLogoutInfo("user=》DdQrCodeLogin"),YS().setLogoutInfo(e),this.SET
```

## POST /v2/sso/loginDing

- Client name: `ddlogin`
- Candidate request keys: `code`, `state`

```text
,o);else{const{identification:e}=o.data;Y("ddQrCodeBind",{identification:e,type:1,ty:"wx"})}else x(o.message,"error")}catch(o){x("服务器错误","error")}finally{zn()}})(o.params.code)),"https://login.dingtalk.com"===e.origin){const o=e.data;console.log("调用了几次"),s=o,a.ddlogin({code:s,state:t.state}).then((e=>{200===e.code?Y("success",{...e,type:0}):x(e.msg,"error")}))}};return m((()=>{"number"==typeof s.typeId&&(t.navType=t.navs[s.typeId].code,t.typeID=s.typeId),f(),window.addEventListener("message",K)})),I((()=>{clearTimeout(t.clearTimeout)})),(e,r)=>(o(),n("div",pr,[w(Bn,{navs:l(d),active:l(p),class
```

## POST /v2/sso/loginGoogle

- Client name: `loginGoogle`
- Candidate request keys: `credential`, `channel`, `os`, `source`, `last_login_port`, `last_login_device`, `cl`, `code`, `data`, `msg`, `email`

```text
.data||{},{method:n="",data:r={}}=o||{};"loginGoogle"===n&&(async e=>{console.log("loginGoogleFun",e);const{credential:o=""}=e||{},n=k(),r=O(),{channel:i=""}=r,g={os:H(),source:`${n}`,last_login_port:"client",last_login_device:"pc",cl:i,credential:o},A=await a.loginGoogle(g),{code:l=0,data:d={},msg:c=""}=A||{},{email:u=""}=d;200===l&&s.SET_TOKEN(d),t("loginCallback",{code:l,data:d,msg:c,email:u})})(r)};return m((()=>{const e=(()=>{let e="zh";return be?e="en":We&&(e="ru"),e})();i.googleLoginUrl=`${Xo}?locale=${e}`,window.addEventListener("message",d)})),I((()=>{window.removeEventListener("messa
```

## POST /v2/sso/mp/login

- Client name: `getwxlogin`
- Candidate request keys: `scene`

```text
,typeID:B}=C(t),Y=r;h((()=>({"qr-wechat":"微信登录暂未开放","qr-ding":"点击二维码刷新","qr-google":"google登录暂未开放"}[t.navType]||""))),h((()=>({"qr-wechat":"已注册账号才能绑定微信，进行扫码登录","qr-ding":"已注册账号才能绑定钉钉，进行扫码登录","qr-google":"已注册账号才能绑定google，进行扫码登录"}[t.navType]||"")));const F=e=>{a.getwxlogin({scene:e}).then((o=>{console.log(o),200===o.code?Y("success",{...o,type:1}):t.statenuber<100?t.clearTimeout=setTimeout((()=>{F(e),t.statenuber+=1}),3e3):(t.statenuber=0,t.url="")}))},Q=async()=>{vn();try{const e=await a.getwxinfo();if(jn.getWxQr.data.code=e.code,jn.getWxQr.data.error=`获取微信二维码失败-${e.msg}`,Rn.subscribe(jn.getWxQ
```

## POST /v2/sso/mp/qrCode

- Client name: `getwxinfo`
- Candidate request keys: _none parsed_

```text
navType]||"")));const F=e=>{a.getwxlogin({scene:e}).then((o=>{console.log(o),200===o.code?Y("success",{...o,type:1}):t.statenuber<100?t.clearTimeout=setTimeout((()=>{F(e),t.statenuber+=1}),3e3):(t.statenuber=0,t.url="")}))},Q=async()=>{vn();try{const e=await a.getwxinfo();if(jn.getWxQr.data.code=e.code,jn.getWxQr.data.error=`获取微信二维码失败-${e.msg}`,Rn.subscribe(jn.getWxQr),200===e.code){const{url:o,ticket:n,scene:r}=e.data;t.url=`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${n}`,F(r),Rn.removeSub(jn.getWxQr)}else x(e.msg,"error")}catch(e){jn.getWxQr.data.code=e.status,jn.getWxQr.data.error=
```

## POST /v2/sso/register

- Client name: `getuserregister`
- Candidate request keys: `username`, `inviter`, `code`, `password`, `rePassword`, `contact`, `type`, `source`, `last_login_port`, `last_login_device`, `os`, `cl`

```text
:o=""}=e,n=k(),r={username:A.email,inviter:A.recomCode,code:A.varCode,password:A.password,rePassword:A.password,contact:A.phone,type:"reg",source:`${n}`,last_login_port:"client",last_login_device:re()?"mobile":"pc",os:H(),cl:o};console.log("register",r),oe(),s.getuserregister(r).then((e=>{we.register.data.password=void 0,we.register.data.code=e.code,we.register.data.regName=A.email,we.register.data.moduleType="600002",we.register.data.error=`注册失败-${e.msg}`,we.register.data.reportType="server",Ce.subscribe(we.register),200===e.code?(i.SET_TOKEN(e.data),f("success",e),Ce.removeSub(we.register)):
```

## POST /v2/sso/sendCode

- Client name: `getusercaptcha`
- Candidate request keys: `code`, `uuid`, `username`, `checkExist`, `type`

```text
log("sendCode",A.email),!A.email||!de.email(A.email))return x(window.t("loginModu.emailAddressError"),"error"),void J();const e=(new Date).getTime(),o=`${A.email}`,n={code:R(`${e}Adf3d31d${o}`),uuid:`${e}`,username:o,checkExist:!0};let r=!1;try{const e=await s.getusercaptcha(n);we.getCode.data.code=e.code,we.getCode.data.regName=o,we.getCode.data.error=`注册获取验证码失败-${e.msg}`,Ce.subscribe(we.getCode),200===e.code?(Ce.removeSub(we.getCode),r=!0):205===e.code||10011===e.code?(x(window.t(ue(e.code)),"error"),setTimeout((()=>{f("login",o)}),1e3)):x(window.t(ue(e.code)),"error")}catch(a){x(window.t("l
```

## POST /v2/sso/verify/code

- Client name: `verifyCode`
- Candidate request keys: `username`, `code`

```text
{const a=await(async e=>{var a;const l=(null==(a=d.companyData)?void 0:a.onwer)||"",{code:t=0,data:o={}}=await c.getUserIdinfo({userId:l});return 200!==t?"":1===e?o.mobile||"":o.email||""})(l);if(!a)return void u.warning(1===l?"手机号不存在":"邮箱不存在");const t=await c.verifyCode({username:a,code:e});if(200!==(null==t?void 0:t.code))return;y.value=!1}catch(t){return void u.error(window.t("serviceException")||"服务异常")}finally{m.value=!1}await(async()=>{m.value=!0;try{const e=await c.replaceProxy({device_id:o.proxyData.device_id||o.proxyData.deviceid,reason_code:L.reason,reason_platform:L.platform},!0);20
```

## POST /v2/team/access/approvals

- Client name: `approvalsList`
- Candidate request keys: `pageIndex`, `pageSize`, `status`

```text
]}]}}),Yo=async()=>{const{useLeftList:e}=n(),{code:o=0,data:t={}}=await d.getApprovals({approvalStatus:1,pageIndex:1,pageSize:10086});if(200===o){const{count:o=0}=t;e.setApprovalApplyCount(o)}},Xo=async()=>{const{useLeftList:e}=n(),{code:o=0,data:t={}}=await d.approvalsList({pageIndex:1,pageSize:10086,status:1});if(200===o){const{count:o=0}=t;e.setReqLoginCount(o)}},jo=async()=>{if(!localStorage)return;const e=localStorage.getItem("Authorization")||"",o=P(e)||{},{expire:t=0,value:r=""}=o;if(console.log("checkAuthorizationValid",t),t&&r)if(c.unix(t).subtract(3,"day").isBefore(c())){const{code:e
```

## POST /v2/team/auth/myRights

- Client name: `myRights`
- Candidate request keys: _none parsed_

```text
rn(null==t?void 0:t.rightName)||""}if(Array.isArray(e)&&e.length>0){let n="every"===t?window.t("and"):window.t("or");return this.allPermissionList.filter((t=>e.includes(t.id))).map((e=>e.rightName)).join(`${n}`)}},async getUserPermissionList(){const e=await oA.myRights({});200===e.code&&(this.userPermissionList=e.data||[])},async getAllPermissionList(){const e=await oA.getMenus({});200===e.code&&(this.allPermissionList=e.data||[])}}}),HE=po("settingsInfo",{state:()=>({dataContact:null,dataQrCode:null}),actions:{async reqSettingsContact(){const e=await oA.getNewsSettingsInfo({key:"setting.conta
```

## POST /v2/team/authentication/insertAuthentication

- Client name: `insertAuthentication`
- Candidate request keys: `authenticationType`, `name`, `companyIdCard`, `userIdCard`

```text
.value,"onUpdate:visible":t[3]||(t[3]=e=>d.value=e),width:"680px",title:e.$t("enterpriseCertification"),"footer-visible":1===f.value,"padding-about":"83px",okLoading:l.value,onSbmit:t[4]||(t[4]=e=>(async e=>{y.value?e&&(l.value=!0,await e.validate(((e,t)=>{e?p.insertAuthentication({authenticationType:2,name:v.name,companyIdCard:v.companyIdCard}).then((e=>{console.log("认证",e),200===e.code&&("function"==typeof r&&r(),f.value=2,n.companyStatus=2)})).finally((()=>{l.value=!1})):(l.value=!1,console.log("error submit!",t))}))):_A(window.t("confirmCompletion")||"请确认完成对公打款","warning")})(m.value))},{de
```

## POST /v2/team/authentication/insertAuthenticationCompanyFourElementsVerification

- Client name: `insertAuthenticationCompanyFourElementsVerification`
- Candidate request keys: `epCertName`, `epCertNo`, `legalPersonCertName`, `legalPersonCertNo`

```text
e=e,f((()=>{2===v.value?E():(async()=>{try{await m.resetAuthentication(!0),"function"==typeof o&&o()}catch(e){_A(window.t("operateFail")||"操作失败","error")}})()}))};p((()=>{}));const B=()=>{1===v.value?(async e=>{e&&await e.validate((async(e,t)=>{e?(l.value=!0,m.insertAuthenticationCompanyFourElementsVerification({epCertName:y.epCertName.replace(/\s+/g,""),epCertNo:y.epCertNo.replace(/\s+/g,""),legalPersonCertName:y.legalPersonCertName.replace(/\s+/g,""),legalPersonCertNo:y.legalPersonCertNo.replace(/\s+/g,"")}).then((async e=>{if(console.log("认证",e),200===e.code)v.value=2,await E(),"function"==
```

## POST /v2/team/authentication/resetAuthentication

- Client name: `resetAuthentication`
- Candidate request keys: _none parsed_

```text
nyFourElementsFaceCheck({},!0),"function"==typeof o&&o(),2===n.companyData.status&&r("corporateVerificationSuccessful")},M=s(!1),I=s(!1);H((()=>{clearTimeout(a.value)}));const R=e=>{clearTimeout(a.value),v.value=e,f((()=>{2===v.value?E():(async()=>{try{await m.resetAuthentication(!0),"function"==typeof o&&o()}catch(e){_A(window.t("operateFail")||"操作失败","error")}})()}))};p((()=>{}));const B=()=>{1===v.value?(async e=>{e&&await e.validate((async(e,t)=>{e?(l.value=!0,m.insertAuthenticationCompanyFourElementsVerification({epCertName:y.epCertName.replace(/\s+/g,""),epCertNo:y.epCertNo.replace(/\s+/
```

## POST /v2/team/company/approvalJoin

- Client name: `approvalJoin`
- Candidate request keys: _none parsed_

```text
ow.t("inputCorrectContact")||"请输入正确联系方式"}]});return(e,t)=>{const s=Iu,c=wu,u=bu;return _(),q(OL,{visible:a.value,"onUpdate:visible":t[3]||(t[3]=e=>a.value=e),width:"680px",title:e.$t("addTeam"),onSbmit:t[4]||(t[4]=e=>(async e=>{e&&await e.validate(((e,t)=>{e?n.approvalJoin(i).then((e=>{200===(null==e?void 0:e.code)&&(_A(window.t("operateSuccess")||"操作成功","success"),o("submitForm",i))})).catch((()=>{_A(window.t("serverError")||"服务端错误","error")})):console.log("error submit!",t)}))})(r.value))},{default:G((()=>[W(u,{ref_key:"queryFormRef",ref:r,"label-width":"94px",model:i,rules:l,"padding-about"
```

## POST /v2/team/company/approveMember

- Client name: `approveMember`
- Candidate request keys: `approvalId`, `approvalStatus`, `refuseType`

```text
(i){if(!(d&&d.length>0))return e(window.t("pleaseLoginDate")||"请选择可登录时间","error");l.beginTime=u(d[0],"hh:mm:ss"),l.endTime=u(d[1],"hh:mm:ss")}if(!i&&!a)return e(window.t("selectLoginDate")||"请选择可登录时间或可登录日期","error");b.usetimeLimit=l}if(1===le.type)Q.value=!0,y.approveMember({...b,approvalId:X.value.approvalId,approvalStatus:2},!0).then((l=>{if(200===l.code)e(window.t("operateSuccess")||"操作成功","success"),pe(),E();else if(1030===l.code){const{mealCount:e=0,memberCount:a=0}=l.data;de("fail",{mealCount:Math.max(0,e-1),memberCount:Math.max(0,a-1)})}else{const a=`${window.t("serviceException")}, ${w
```

## POST /v2/team/company/change

- Client name: `editCompanies`
- Candidate request keys: `name`

```text
",trigger:"blur"}]}),m=G({phoneEmail:""}),v=async()=>{if(!m.value.phoneEmail.trim())return a(window.t("pleaseTeamName")||"请输入团队名称","warning");if(m.value.phoneEmail===d.info.name)return a(window.t("modifyAfterName")||"请输入修改后的名称","warning");200===(await n((()=>r.editCompanies({name:m.value.phoneEmail})),"修改失败, 请重新修改",!0,window.t("modifySuccess")||"修改成功")).code&&(c.value=!1),u("confirm")},h=()=>{m.value.phoneEmail=d.info.name};return J((()=>{m.value.phoneEmail=d.info.name})),(a,s)=>{const o=t,n=l,r=i;return O(),H(e,{visible:te(c),"onUpdate:visible":s[1]||(s[1]=e=>le(c)?c.value=e:null),width:"680p
```

## POST /v2/team/company/getApprovals

- Client name: `getApprovals`
- Candidate request keys: `approvalStatus`, `pageIndex`, `pageSize`

```text
t.push(t),this.tokenList.length>20){const e=this.tokenList.length-20;this.tokenList.splice(0,e)}}},persist:{enabled:!0,strategies:[{key:"testToken",storage:localStorage,paths:["tokenList"]}]}}),Yo=async()=>{const{useLeftList:e}=n(),{code:o=0,data:t={}}=await d.getApprovals({approvalStatus:1,pageIndex:1,pageSize:10086});if(200===o){const{count:o=0}=t;e.setApprovalApplyCount(o)}},Xo=async()=>{const{useLeftList:e}=n(),{code:o=0,data:t={}}=await d.approvalsList({pageIndex:1,pageSize:10086,status:1});if(200===o){const{count:o=0}=t;e.setReqLoginCount(o)}},jo=async()=>{if(!localStorage)return;const e
```

## POST /v2/team/company/getRoleDepartmentMeal

- Client name: `getRoleDepartmentMeal`
- Candidate request keys: _none parsed_

```text
Zj=()=>{oA.myCompanies({}).then((e=>{if(200===(null==e?void 0:e.code)){const t=e.data||[];Uj.value=[];const{user:n}=fL(),o=n.companyData.companyId;t.forEach((e=>{e.companyId===o?Uj.value.unshift({...e,checked:!0}):Uj.value.push({...e,checked:!1})})),f((()=>{oA.getRoleDepartmentMeal({}).then((e=>{200===e.code&&(e.data.forEach((e=>{zj[e.companyId]=e})),Uj.value=Uj.value.map((e=>{const t=zj[e.companyId]||{};return{...e,...t,rolesIds:(t.rolesId||"").split(",").filter(Boolean),rolesName:t.rolesName||[]}})))})).catch((()=>{_A(window.t("getCompListError")||"获取企业列表失败","error")}))}))}})).catch((()=>{_A
```

## POST /v2/team/company/ids

- Client name: `getCompanyByIds`
- Candidate request keys: `ids`

```text
e.device_type)(e),l=e.device_type&&!U(w.Env_Start),t=!e.device_type&&!U(w.Proxy_BindEnv);return a||l||t},Ml=e=>{const{flag:a=0,device_type:l="",authorization:t=0}=e||{};return(1===a&&0===l.length||""===l)&&1===t},Nl=async e=>{const{code:a=0,data:l=[]}=await we.getCompanyByIds({ids:e}),t=[];return l.forEach((e=>{const{name:a=""}=e;a&&t.push(`${a}`)})),t.join(",")},Tl=da(!1);ua((()=>{Al.value=me.getVersionCode,kl.value=me.getPlatform,Ue.emit(je.accmainMounted),fl(),ml.value&&clearInterval(ml.value),ml.value=setInterval((()=>{fl()}),12e4),$.getCanOpenEnvList(),document.addEventListener("click",qe
```

## POST /v2/team/company/user/devices

- Client name: `getUserDevices`
- Candidate request keys: _none parsed_

```text
,et={style:{"font-size":"14px"}},at=["onMouseenter"],tt={class:"tooltip-span"},lt={class:"time"},it=n(K({__name:"index",setup(e){const t=qe(),{configStore:l}=u(),i=L("$api"),s=G([]),o=G(!1),n=(e=!1)=>{o.value&&e||(o.value=e,setTimeout((()=>{o.value=!1}),700),i.getUserDevices().then((e=>{var a;if(e&&200===e.code){const t=((null==(a=e.data)?void 0:a.list)||[]).slice(0,200);s.value=[],t.forEach((e=>{e.deviceId===l.deviceId?s.value.unshift(e):s.value.push(e)}))}})).catch((()=>{a(window.t("serverError")||"服务端错误","error")})))},r=()=>{setTimeout((()=>{n()}),500)};J((()=>{n()}));const p=e=>{switch(e){
```

## POST /v2/team/company/user/updatePackageStatus

- Client name: `updatePackageStatus`
- Candidate request keys: `companyId`, `reset`, `userIds`

```text
])}}}),[["__scopeId","data-v-757a5c1a"]]),tN=s(!1),nN=s({}),oN=s(!1);let rN=null;const aN=()=>{rN&&clearTimeout(rN),rN=setTimeout((()=>{(async()=>{const{user:e}=fL(),t=e.companyData.companyId;if(!t)return void console.log("companyId is Empty");const n=await oA.updatePackageStatus({companyId:t});if(200===n.code)if(3===n.data)oN.value=!0;else if(2===n.data){const e=await oA.getUsermeal({});if(200!==e.code)return;const t=await oA.getMembers({pageSize:1,pageIndex:1,leave:3});if(200!==t.code)return;nN.value={num1:e.data.expired?1:e.data.member_number,num2:t.data.count||0,type:1},tN.value=!0}})()}),
```

## POST /v2/team/curCompanyInfo

- Client name: `curCompanyInfo`
- Candidate request keys: _none parsed_

```text
wait oA.authenticationGet({});200===e.code&&(this.userStatus=e.data.userStatus,this.companyStatus=e.data.companyStatus)},async registerUser(){var e;const{default:t}=await ko((()=>Promise.resolve().then((()=>hL))),void 0),n=await Promise.all([oA.userInfo({}),oA.curCompanyInfo({})]),o=await oA.myUserinfo({}),r=n[0],a=n[1];if(200===(null==r?void 0:r.code)){const n=((null==(e=r.data)?void 0:e.roles)||"").split(",").filter(Boolean);this.userData={...r.data||{},rolesId:n};const o=JSON.stringify(r.data);localStorage.setItem("userinfo",o);const{rpaStore:a,configStore:i}=t();a.getConnectStatus&&a.initR
```

## POST /v2/team/dept/change

- Client name: `updateDept`
- Candidate request keys: `pid`, `departmentName`, `deptId`, `uids`

```text
st e={pid:(null==(t=D.value)?void 0:t.level)&&D.value.pid||"",departmentName:D.value.departmentName},l={pid:(null==(d=D.value)?void 0:d.level)<2?"":D.value.pid||"",departmentName:D.value.departmentName,deptId:D.value.deptId,uids:D.value.uids};(D.value.deptId?y.updateDept(l):y.createDept(e)).then((e=>{200===e.code&&(S.value=!1,V("success"),a(window.t("operateSuccess")||"操作成功","success"))})).catch((()=>{a(window.t("serverError")||"服务端错误","error")})),V("confirm",D.value.departmentName)}else console.log("error submit!",l)}))};return(a,r)=>{const o=l,u=t,m=d,i=p,n=s;return v(),c(e,{visible:S.value,
```

## POST /v2/team/dept/create

- Client name: `createDept`
- Candidate request keys: _none parsed_

```text
=(t=D.value)?void 0:t.level)&&D.value.pid||"",departmentName:D.value.departmentName},l={pid:(null==(d=D.value)?void 0:d.level)<2?"":D.value.pid||"",departmentName:D.value.departmentName,deptId:D.value.deptId,uids:D.value.uids};(D.value.deptId?y.updateDept(l):y.createDept(e)).then((e=>{200===e.code&&(S.value=!1,V("success"),a(window.t("operateSuccess")||"操作成功","success"))})).catch((()=>{a(window.t("serverError")||"服务端错误","error")})),V("confirm",D.value.departmentName)}else console.log("error submit!",l)}))};return(a,r)=>{const o=l,u=t,m=d,i=p,n=s;return v(),c(e,{visible:S.value,"onUpdate:visibl
```

## POST /v2/team/dept/del

- Client name: `deleteDept`
- Candidate request keys: `id`

```text
e:"index",props:{visible:{type:Boolean,default:!1},deptInfo:{default:()=>{}}},emits:["update:visible","success","confirm"],setup(t,{emit:l}){const d=t,n=N("$api"),i=l,p=k({get:()=>d.visible,set:e=>{i("update:visible",e)}}),o=()=>{d.deptInfo.count?p.value=!1:(n.deleteDept({id:d.deptInfo.deptId}).then((e=>{200===(null==e?void 0:e.code)&&(i("success"),p.value=!1,a(window.t("deleteSuccess")||"删除成功","success"))})).catch((e=>{a(null==e?void 0:e.message,"error")})),i("confirm",d.deptInfo.departmentName))},m=k((()=>d.deptInfo.count?window.t("myKnow"):window.t("confirm")));return(a,t)=>{const l=s;retur
```

## POST /v2/team/env-settings/get

- Client name: `getEnvSettings`
- Candidate request keys: `tags`

```text
=e.img,a.value=e,o.value=!0}})),[o,r,a]}(),{upgradesVisible:ye,upgradesInfo:be,memberVisible:we}=($7.afterEach((e=>{["/setting","/mall"].find((t=>e.path.includes(t)))||aN()})),{upgradesVisible:tN,upgradesInfo:nN,memberVisible:oN}),xe=async()=>{const e=await oA.getEnvSettings({tags:[AE.Menu3Key]});if(200===e.code&&e.data.length>0){const t=e.data.find((e=>e.tag===AE.Menu3Key));if(t){(e=>{var t;const n=e.find((e=>7===e.id));if((null==(t=vt().platform)?void 0:t.toUpperCase())!==gt.WINDOWS){const e=n.children.filter((e=>1!==e.id));n.children=e}else{let e=n.children.find((e=>1===e.id));e||(e={svg:"w
```

## POST /v2/team/env-settings/update

- Client name: `updateEnvSettings`
- Candidate request keys: `tag`, `content`, `left`, `right`

```text
:d}=kP(r),{globalStore:p}=fL(),f=t,m=h((()=>{const e=a.value||i.value||l.value||s.value||c.value||d.value,t=!mL($E.Browser_New);return e||t})),v=async()=>{f("newBrowserClicked")},g=e=>{f("menu1Clicked",e)},y=e=>{f("menu2Clicked",e)},b=()=>{p.isFold=!p.isFold,o.updateEnvSettings({tag:kE.Fold,content:p.isFold?"1":"0"})};return(e,t)=>{const o=yS,a=Ie("permission"),i=Ie("tracking");return _(),x("div",FL,[re((_(),x("div",{class:U(["newBrowser",{disabled:u(m)}]),onClick:v},[W(CS,{name:"newBrowser"}),t[0]||(t[0]=k("span",null,J("新建环境"),-1))],2)),[[a,u($E).Browser_New],[i,u(LP).home_menu_newBrowser]])
```

## POST /v2/team/getDepts

- Client name: `getDepts`
- Candidate request keys: `name`

```text
orEach((e=>{e.children=M.value.filter((l=>l.rolesArr.includes(e.id)))}))),Q((()=>{ne()})))},pe=e=>{var l;(null==(l=e.children)?void 0:l.length)>0&&e.children.forEach((e=>{pe(e)})),e.members=M.value.filter((l=>l.deptId===e.deptId))},he=async()=>{const e=await i.getDepts({});200===e.code&&(Z.value=e.data||{})},fe=async()=>{const e=await i.getRolesList({pageIndex:1,pageSize:100861});200===e.code&&(A.value=(e.data.list||[]).filter((e=>0!==e.count)))},ke=()=>{var e;console.log("默认勾选成员",a.defaultUserIds),(null==(e=a.defaultUserIds)?void 0:e.length)&&M.value.forEach((e=>{e.checked=a.defaultUserIds.in
```

## POST /v2/team/getMembers

- Client name: `getMembers`
- Candidate request keys: `pageSize`, `pageIndex`, `leave`, `name`

```text
companyData.companyId;if(!t)return void console.log("companyId is Empty");const n=await oA.updatePackageStatus({companyId:t});if(200===n.code)if(3===n.data)oN.value=!0;else if(2===n.data){const e=await oA.getUsermeal({});if(200!==e.code)return;const t=await oA.getMembers({pageSize:1,pageIndex:1,leave:3});if(200!==t.code)return;nN.value={num1:e.data.expired?1:e.data.member_number,num2:t.data.count||0,type:1},tN.value=!0}})()}),500)},iN=async()=>{const e=await oA.getpackageinfo({});return 200===e.code&&(nN.value={num1:e.packagenumb,num2:e.usednumb,type:2},e.usednumb>=e.packagenumb&&(tN.value=!0)
```

## POST /v2/team/invite/getCode

- Client name: `getInviteCode`
- Candidate request keys: `reset`

```text
oolean,default:!1}},emits:["update:visible"],setup(e,{emit:t}){const n=t,o=O("$api"),r=e,a=h({get:()=>r.visible,set:e=>{console.log(e),n("update:visible",e)}}),i=s(""),l={width:100,height:100,color:{dark:"#000000",light:"#ffffff"}},c=s(""),d=e=>{const t=_t();o.getInviteCode({reset:e}).then((e=>{var n;200===e.code&&(c.value=`https://${Sn}/invite.html?code=${e.data}&lang=${t}`,(an||St||At)&&(c.value=`https://${Sn}/invitation/?code=${e.data}&lang=${t}`),n=c.value,w$(n,l,((e,t)=>{e?console.error(e):i.value=t})))})).catch((()=>{_A(window.t("serviceException")||"服务异常","error")}))},f=()=>{An(c.value,
```

## POST /v2/team/loginlogs

- Client name: `loginlogs`
- Candidate request keys: _none parsed_

```text
r(localStorage.getItem(a.SizeKey_LoginLog))||20});t();const q=b([]),D=b(!1),H=b(" "),K=b([]),P=()=>{D.value=!0;const e={...N};K.value&&K.value.length>0&&(e.beginTime=`${o(K.value[0],"yyyy-MM-dd")} 00:00:00`,e.endTime=`${o(K.value[1],"yyyy-MM-dd")} 23:59:59`),E.loginlogs(e).then((e=>{200===e.code&&(q.value=e.data.list||[],0===q.value.length&&(H.value=window.t("noneData")||"暂无数据"),N.total=e.data.count||0)})).catch((()=>{s(window.t("serverError")||"服务端错误","error")})).finally((()=>{D.value=!1}))},R=e=>{K.value=e.value,N.pageIndex=1,P()},B=e=>{N.pageIndex=e,P()},O=e=>{N.pageSize=e,localStorage.setI
```

## POST /v2/team/member/accessApply

- Client name: `loginApply`
- Candidate request keys: _none parsed_

```text
it"},Fo=W(a({__name:"result",props:{info:{default:()=>({msg:window.t("loginModu.afterSubmission"),user:{}})},type:{default:""}},emits:["change"],setup(e,{emit:r}){const a=v("$api"),i=e,A=r,d=u({timeNow:new Date,loginApply:!1}),{loginApply:c}=C(d),m=()=>{oe(),a.loginApply({code:i.info.user.code},!0).then((e=>{200===e.code?(d.loginApply=!0,d.timeNow=new Date):x(window.t("loginModu.serviceError"),"error")})).finally((()=>{ne()}))};return(e,r)=>{const a=y;return o(),n("div",io,[g("div",go,[g("div",{class:"fotlinks",onClick:r[0]||(r[0]=e=>{var o;A("change","userLogin",o)})},[r[1]||(r[1]=g("img",{sr
```

## POST /v2/team/member/accessApproval

- Client name: `accessApproval`
- Candidate request keys: `id`, `grantType`, `status`, `usetimeLimit`

```text
beginDate=s(c.value[0],"yyyy-MM-dd"),a.endDate=s(c.value[1],"yyyy-MM-dd")}if(y.value){if(!m.value||0===m.value.length)return void t(window.t("pleaseLogin")||"请选择可登录时间","error");a.limit=2,a.beginTime=s(m.value[0],"HH:mm:ss"),a.endTime=s(m.value[1],"HH:mm:ss")}n.accessApproval({id:null==(e=r.applyInfo)?void 0:e.id,grantType:1,status:2,usetimeLimit:a}).then((e=>{200===e.code&&(t(window.t("operateSuccess")||"操作成功","success"),u("close"),u("submit"))})).catch((()=>{t(window.t("operateFail")||"操作失败","error")}))};return(t,s)=>(_(),k(l,{visible:U(d),"onUpdate:visible":s[6]||(s[6]=e=>D(d)?d.value=e:null
```

## POST /v2/team/member/change

- Client name: `editMember`
- Candidate request keys: `deptId`, `userId`, `companyId`, `leave`

```text
mber,default:0}},emits:["update:visible","handleSearch"],setup(e,{emit:a}){const l=e,o=P((()=>({2:window.t("enableMember")||"启用成员",1:window.t("disabledMember")||"禁用成员"}[l.type]))),s=U("$api"),i=a,r=P({get:()=>l.visible,set:e=>{i("update:visible",e)}}),d=()=>{s.editMember({deptId:l.currentTableRow.deptId,userId:l.currentTableRow.userId,companyId:l.currentTableRow.companyId,leave:l.type}).then((e=>{200===e.code&&(n(window.t("operateSuccess")||"操作成功","success"),i("handleSearch"),r.value=!1)})).catch((e=>{console.log(e)}))};return(a,n)=>(B(),H(t,{visible:r.value,"onUpdate:visible":n[0]||(n[0]=e=>r
```

## POST /v2/team/member/ids

- Client name: `getMembersByIds`
- Candidate request keys: `userIds`

```text
(null==e?void 0:e.username)||(null==e?void 0:e.mobile)||(null==e?void 0:e.email)||"";if(e.forEach((e=>{var t;const n=e.last_login_user||e.lastLoginUser,r=null==(t=l.memberList)?void 0:t.find((e=>e.userId===n));r?a[n]=i(r):o.add(n)})),o.size)try{const e=await r.getMembersByIds({userIds:[...o]});200===(null==e?void 0:e.code)&&(e.data||[]).forEach((e=>{a[e.userId]=i(e)}))}catch(t){console.log("getMembersByIds_err_:",t)}e.forEach((e=>{const l=e.last_login_user||e.lastLoginUser;a[l]&&(e._lastLoginUserName=a[l])}))})()}catch(t){I.value=[],b.value=0}P.value=!1},R=e=>{k.value.currentPage=e,N()},B=e=>{
```

## POST /v2/team/member/move

- Client name: `moveDeptMember`
- Candidate request keys: `srcDeptId`, `destDeptId`

```text
tInfo.deptId?t(new Error(window.t("thisPartment")||"目标部门不能和本部门相同")):t():t(new Error(window.t("selectTargetDepart")||"请选择目标部门"))},trigger:"blur"}]}),c=S(),v=async()=>{c.value&&await c.value.validate((e=>{if(e){const e=m.destDeptId.at(-1),{deptId:t}=s.deptInfo;i.moveDeptMember({srcDeptId:"-1"===t?"":t,destDeptId:"-1"===e?"":e}).then((e=>{200===e.code&&(a(window.t("transferSuccess")||"转移成功","success"),p("success"),o.value=!1)})).catch((()=>{a(window.t("serverError")||"服务端错误","error")})),p("confirm")}}))},f={checkStrictly:!0,value:"deptId",label:"departmentName"},b=S([]),_=()=>{m.destDeptId=[],i.g
```

## POST /v2/team/member/myInfo

- Client name: `userInfo`
- Candidate request keys: _none parsed_

```text
atus(){const e=await oA.authenticationGet({});200===e.code&&(this.userStatus=e.data.userStatus,this.companyStatus=e.data.companyStatus)},async registerUser(){var e;const{default:t}=await ko((()=>Promise.resolve().then((()=>hL))),void 0),n=await Promise.all([oA.userInfo({}),oA.curCompanyInfo({})]),o=await oA.myUserinfo({}),r=n[0],a=n[1];if(200===(null==r?void 0:r.code)){const n=((null==(e=r.data)?void 0:e.roles)||"").split(",").filter(Boolean);this.userData={...r.data||{},rolesId:n};const o=JSON.stringify(r.data);localStorage.setItem("userinfo",o);const{rpaStore:a,configStore:i}=t();a.getConnec
```

## POST /v2/team/member/myInfo/change

- Client name: `myInfoChange`
- Candidate request keys: _none parsed_

```text
rn J((()=>{m.name=n.name||""})),(s,o)=>{const n=t,v=l,h=i;return O(),H(e,{visible:c.value,"onUpdate:visible":o[1]||(o[1]=e=>c.value=e),width:"680px",title:s.$t("modifyUser"),"padding-about":"120px",onSbmit:o[2]||(o[2]=e=>{d.value.validate((e=>{if(!e)return!1;r.myInfoChange(m).then((e=>{200===e.code?(a(window.t("modifySuccess")||"修改成功","success"),u("submitForm")):a(window.t("modifyFail")||"修改失败","success")})).catch((()=>{a(window.t("serverError")||"服务端错误","success")}))}))})},{default:Z((()=>[ee(h,{ref_key:"queryFormRef",ref:d,model:m,rules:p,"hide-required-asterisk":!0},{default:Z((()=>[ee(v,{l
```

## POST /v2/team/myCompanies

- Client name: `getCompanuIfo`
- Candidate request keys: _none parsed_

```text
e=>{x(window.t("loginModu.loginSuccess"),"success"),r.Storetoken(e.data.token),await r.registerUser(),t.push("/"),setTimeout((()=>{ne()}),180)},K=e=>{d.type="resultType",d.loginAuthInfo={...e}},V=()=>{console.log("多公司切换"),j().setLogoutInfo("多公司切换shark 退出登录"),a.getCompanuIfo().then((e=>{var o;200===e.code?1===e.data.length?(o=e.data,a.toggleCompany({clientType:"client",device:"pc",source:"1",os:"windows",id:o[0].companyId},!0).then((e=>{200===e.code?U(e):1026===e.code?(K({msg:window.t("loginModu.contactSuperiors"),user:{...e.data,typeCode:e.code}}),ne()):1031===e.code?(K({msg:window.t("loginMod
```

## POST /v2/team/ownerCompanies

- Client name: `getMyTeam`
- Candidate request keys: _none parsed_

```text
",accountName:"",companyId:""}),m=X(10),f=X(),P=X(!1),w=X(!1);let g=X(!K&&!H),y=X(!(!K&&!H));const b=e=>{A.amount=e.replace(/\D/g,"")},Y=e=>{A.mode=e,1===A.mode&&(g.value=!0,y.value=!1),3===A.mode&&(g.value=!1,y.value=!0)},z=async()=>{try{const{data:e}=await n.getMyTeam();f.value=e}catch(e){d.error(window.t("serverErrorTimely")||"Error:服务端错误，请联系管理员及时处理。")}},S=()=>new Promise(((e,a)=>{n.authenticationGet({}).then((a=>{const{code:l,data:t}=a;if(200===l){const{userStatus:a}=t;3===a?e(!0):(w.value=!0,e(!1))}else d.error(window.t("serverError")||"服务端错误"),e(!1)})).catch((a=>{d.error(window.t("server
```

## POST /v2/team/right/list

- Client name: `getMenus`
- Candidate request keys: _none parsed_

```text
"or");return this.allPermissionList.filter((t=>e.includes(t.id))).map((e=>e.rightName)).join(`${n}`)}},async getUserPermissionList(){const e=await oA.myRights({});200===e.code&&(this.userPermissionList=e.data||[])},async getAllPermissionList(){const e=await oA.getMenus({});200===e.code&&(this.allPermissionList=e.data||[])}}}),HE=po("settingsInfo",{state:()=>({dataContact:null,dataQrCode:null}),actions:{async reqSettingsContact(){const e=await oA.getNewsSettingsInfo({key:"setting.contact"});200===e.code&&(this.dataContact=e.data)},async reqSettingsQrCode(){const e=await oA.getNewsSettingsInfo({
```

## POST /v2/team/right/listTemplate

- Client name: `getMenusTemplate`
- Candidate request keys: _none parsed_

```text
ndeterminate=e.checkedList.length>0&&e.checkedList.length<e.childIds.length,l.checkedList&&(l.isIndeterminate=l.checkedList.length>0&&l.checkedList.length<l.childIds.length)},Ae=V({}),Ne=V([]),Pe=V({}),je=V(a.query.roleEditType),Ve=V(!1);C((async()=>{var e,t;l.getMenusTemplate().then((e=>{if(200===e.code){const l={};(e.data||[]).forEach((e=>{const a=e.templateType;l[a]||(l[a]={templateType:a,templateName:e.templateName,items:[]}),l[a].items.push(e)})),Ne.value=Object.values(l)}})).catch((()=>{u(window.t("serverError")||"服务端错误","error")})),await(async()=>{var e,t,i;try{const s=await l.getRoleGr
```

## POST /v2/team/role-group/del

- Client name: `deleteRoleGroup`
- Candidate request keys: `ids`

```text
s","confirm"],setup(e,{emit:l}){const a=e,t=T("$api"),o=l,i=H({get:()=>a.visible,set:e=>{o("update:visible",e)}}),n=H((()=>{var e,l;return(null==(e=a.groupInfo)?void 0:e.children)&&(null==(l=a.groupInfo)?void 0:l.children.length)})),r=()=>{n.value?i.value=!1:t.deleteRoleGroup({ids:[a.groupInfo.id]}).then((e=>{200===e.code&&(d(window.t("operateSuccess")||"操作成功","success"),o("success"),i.value=!1)})),o("confirm")},u=H((()=>!a.groupInfo.count)),p=H((()=>a.groupInfo.count?window.t("myKnow"):window.t("confirm")));return(l,a)=>{const t=m;return V(),U(s,{visible:i.value,"onUpdate:visible":a[0]||(a[0]
```

## POST /v2/team/role-group/page

- Client name: `getRoleGroup`
- Candidate request keys: _none parsed_

```text
p(a,{emit:t}){const i=f("$api"),d=a,o=t,n=h({}),r=w({get:()=>(d.value||[]).map((e=>{if(n.value[e])return[n.value[e],e]})).filter(Boolean),set:e=>{const l=(e||[]).map((e=>e[1]||void 0)).filter(Boolean);o("update:value",l)}}),u=()=>{o("change")},s=h([]),m=()=>{i.getRoleGroup().then((l=>{var a;200===l.code&&(s.value=((null==(a=l.data)?void 0:a.list)||[]).map((e=>({...e,children:e?[]:void 0,disabled:!0}))),i.getRolesList({pageIndex:1,pageSize:999}).then((e=>{if(200===e.code){o("allRoleList",e.data.list||[]);const l={};s.value.forEach(((e,a)=>{l[e.id]=a,e.children=[]})),(e.data.list||[]).forEach((e
```

## POST /v2/team/role-group/role/move

- Client name: `roleGroupMigrateRole`
- Candidate request keys: `toId`, `fromId`

```text
pdate:visible",e)}}),n=H((()=>(a.roleGroup||[]).filter((e=>2!==e.isDefault)))),r=F(),u=F({toId:""}),v=P({toId:[{required:!0,message:window.t("placeRoleGroup"),trigger:"blur"}]}),m=async()=>{r.value&&await r.value.validate(((e,l)=>{if(e){const{toId:e}=u.value;t.roleGroupMigrateRole({toId:e,fromId:a.groupInfo.id}).then((e=>{200===e.code&&(d(window.t("operateSuccess")||"操作成功","success"),o("success"),i.value=!1)})).catch((e=>{console.log(e)})),o("confirm")}}))},g=()=>{u.value={toId:""}};return(l,a)=>{const t=h,o=b,d=p,f=c;return V(),U(s,{visible:i.value,"onUpdate:visible":a[1]||(a[1]=e=>i.value=e)
```

## POST /v2/team/role/change

- Client name: `editRole`
- Candidate request keys: `rightIds`, `gid`, `roleDesc`, `roleSlug`

```text
f.value))||e.resetFields(),v.value.forEach((e=>{e.check=[],e.list=[]})),r.value=!1},S=()=>{f.value&&f.value.validate((e=>{if(e){const e=v.value.reduce(((e,l)=>e.concat(l.check)),[]),l={...w,rightIds:e.join(",")};o.roleInfo.id&&(l.id=o.roleInfo.id),n.value=!0,t.editRole(l).then((e=>{200===e.code&&(d(`${o.roleInfo.id?window.t("edit")||"编辑":window.t("add1")||"新增"}${window.t("success")||"成功"}`,"success"),i("success"),r.value=!1,a.getUserPermissionList())})).catch((()=>{d(window.t("serverError")||"服务端错误","error")})).finally((()=>{n.value=!1})),i("confirm")}}))},M=()=>{var e,l;null==(e=L(f.value))||
```

## POST /v2/team/role/del

- Client name: `deleteRole`
- Candidate request keys: `id`

```text
s:{visible:{type:Boolean,default:!1},roleInfo:{type:Object,default:()=>({})}},emits:["update:visible","success","confirm"],setup(e,{emit:l}){const a=e,t=T("$api"),o=l,i=H({get:()=>a.visible,set:e=>{o("update:visible",e)}}),n=()=>{a.roleInfo.count?i.value=!1:(t.deleteRole({id:a.roleInfo.id}).then((e=>{200===e.code&&(d(window.t("operateSuccess")||"操作成功","success"),o("success"),i.value=!1)})).catch((e=>{console.log(e)})),o("confirm"))},r=H((()=>!a.roleInfo.count)),u=H((()=>a.roleInfo.count?window.t("myKnow"):window.t("confirm")));return(l,a)=>{const t=m;return V(),U(s,{visible:i.value,"onUpdate:v
```

## POST /v2/team/role/great

- Client name: `addRoleAccount`
- Candidate request keys: `userIds`, `RoleId`

```text
(e,{emit:a}){const t={checkStrictly:!0,value:"deptId",label:"departmentName"},n=T("$api"),r=e,p=a,c=H({get:()=>r.visible,set:e=>{p("update:visible",e)}}),v=F(""),m=F([]),h=F([]),b=e=>{h.value=e},w=F([]),_=F(),y=()=>{const e=h.value.map((e=>String(e.userId)));n.addRoleAccount({userIds:e,RoleId:String(r.editInfo.id)}).then((e=>{200===e.code&&(g.success(window.t("memberSuccess")||"配置成员成功"),c.value=!1,p("success"))})),p("confirm")},I=F({1:window.t("authorizedFounder")||"创始人"}),R=F([]),k=F(),S=()=>{n.getMembers({pageSize:999,pageIndex:1,deptId:R.value?R.value.at(-1):void 0,name:v.value,leave:3}).th
```

## POST /v2/team/role/members

- Client name: `getRoleMembers`
- Candidate request keys: `id`

```text
eptId:R.value?R.value.at(-1):void 0,name:v.value,leave:3}).then((e=>{if(200===e.code){const l=e.data.list||[];l.forEach((e=>{const{roles:l=""}=e,a=l.split(",").map((e=>Number(e.trim()))).filter((e=>e&&2!==e));e.roleIds=a})),m.value=l,(async()=>{const e=await n.getRoleMembers({id:String(r.editInfo.id)});200===(null==e?void 0:e.code)&&(w.value=(e.data||[]).map((e=>e.userId)),Y((()=>{m.value.forEach((e=>{e.userId&&w.value.includes(e.userId)&&_.value.toggleRowSelection(e,!0)}))})))})()}})).catch((()=>{d(window.t("serverError")||"服务端错误","error")}))},M=()=>{setTimeout((()=>{k.value&&k.value.togglePo
```

## POST /v2/team/roles

- Client name: `getRolesList`
- Candidate request keys: `pageIndex`, `pageSize`, `name`, `roleId`

```text
)=>{ne()})))},pe=e=>{var l;(null==(l=e.children)?void 0:l.length)>0&&e.children.forEach((e=>{pe(e)})),e.members=M.value.filter((l=>l.deptId===e.deptId))},he=async()=>{const e=await i.getDepts({});200===e.code&&(Z.value=e.data||{})},fe=async()=>{const e=await i.getRolesList({pageIndex:1,pageSize:100861});200===e.code&&(A.value=(e.data.list||[]).filter((e=>0!==e.count)))},ke=()=>{var e;console.log("默认勾选成员",a.defaultUserIds),(null==(e=a.defaultUserIds)?void 0:e.length)&&M.value.forEach((e=>{e.checked=a.defaultUserIds.includes(e.userId)}))};W((()=>a.defaultUserIds),(e=>{ke()}));const ye=async()=>{
```

## POST /v2/team/select/company

- Client name: `toggleCompany`
- Candidate request keys: `clientType`, `id`, `device`, `source`, `os`

```text
=u({selected:"",loginApply:!1,name:null==(a=c.companys[0])?void 0:a.name,showList:!1,uid:null==(s=c.companys[0])?void 0:s.companyId}),{selected:p,loginApply:h,name:B,showList:M,uid:z}=C(m),I=r,G=()=>{m.showList=!m.showList},U=async()=>{oe();try{const e=await d.toggleCompany({clientType:"client",id:m.uid,device:"pc",source:"1",os:"windows"},!0);console.log("切换公司",e),200===e.code?I("login",e):1026===e.code?(I("needAuth",{msg:window.t("loginModu.afterSubmission"),user:{...e.data,typeCode:e.code}}),ne()):1031===e.code?(I("needAuth",{msg:window.t("loginModu.afterSubmission"),user:{...e.data,typeCod
```

## POST /v2/team/version/get

- Client name: `getVersion`
- Candidate request keys: `appId`, `versionCode`, `bitness`

```text
000200].includes(r)?"arm"===(await navigator.userAgentData.getHighEntropyValues(["platform","platformVersion","architecture","model"])).architecture?"arm64":"x86_64":t.bitness:n===gt.LINUX&&(a="x86_64");const i={...t,appId:e,versionCode:r,bitness:a},l=await oA.getVersion(i,!0);return console.log("NewYeargetClientList ",l),l})()),kP=e=>{const t=h((()=>"/newBrowser/local_single"===e.path)),n=h((()=>"/newBrowser/local_batch"===e.path)),o=h((()=>"/newBrowser/local_edit"===e.path)),r=h((()=>t.value||n.value||o.value)),a=h((()=>"/newBrowser/yun_single"===e.path)),i=h((()=>"/newBrowser/yun_batch"===e
```

## POST /v2/team/version/getCore

- Client name: `getCoreVersion`
- Candidate request keys: `appId`, `versionCode`, `bitness`

```text
0100,1000101,1000200].includes(r)){a="arm"===(await navigator.userAgentData.getHighEntropyValues(["platform","platformVersion","architecture","model"])).architecture?"arm64":"x86_64"}else a=t.bitness;else n===gt.LINUX&&(a="x86_64");return await Promise.all([oA.getCoreVersion({...t,appId:e,versionCode:Number(t.versionCode||"0"),bitness:a}),oA.getCoreVersion({...t,browser:"firefox",appId:e,versionCode:Number(t.versionCode||"0"),bitness:a})])},_P=h((()=>{const{hasFeature:e}=gP();return e(pP.SupportStaticUpdate)})),xP=()=>(console.log("知否支持静默更新客户端",_P.value),_P.value?(async()=>{const{apiRes:e}=awa
```

## POST /v2/tg/browser/store/ip

- Client name: `normalIp`
- Candidate request keys: `appId`, `companyId`, `userId`, `shopId`, `deviceId`

```text
=(c=e.globalSettings)?void 0:c.risk_control,t.kernelversion="10"+e.kernelversion}))}))})(),F.getUserAuthStatus(),(async()=>{await F.getValidEnvNum(),F.getCanOpenEnvList()})(),(()=>{const e={appId:Dt(),companyId:"",userId:"",shopId:"",deviceId:w.getDeviceId};oA.normalIp(e).then((e=>{}))})(),M.getAllPermissionList(),ro(),setInterval((()=>{ro()}),12e4)})),p((async()=>{await F.registerUser(),_ne(),aN(),$.getMsgUnread(),S.reqTagList(),le(),await U();const{userId:e,skip:t,step:n}=z.value||{};e&&(0===t||On&&n<2)?j():((()=>{var e;const t=localStorage.getItem("Authorization")||"",n=localStorage.getItem
```

## POST /v2/tg/r/error

- Client name: `errReport`
- Candidate request keys: `appId`, `ext`, `code`

```text
rtStatus:h}=this.userStore,m={pos:u,companyId:d,userId:p,shopId:a,kernelversion:i,username:f,portStatus:h};this.list[e.type]=setTimeout((()=>{e.data.appver=rV.appVersion,e.data.platform=rV.platform,e.data.deviceId=rV.deviceId,e.data.code=String(e.data.code),oA.errReport({...e.data,appId:c,ext:m})}),r)}removeSub(e){clearTimeout(this.list[e])}};n(aV,"report");let iV=aV;const lV={NEW_BROWSER:"NEW_BROWSER",ACCOUNT_MANAGER:"ACCOUNT_MANAGER",QUICK_START:"QUICK_START",TRANSFER_SHARE:"TRANSFER_SHARE",RECYCLE:"RECYCLE",PLATFORM_PROXY:"PLATFORM_PROXY",SELF_PROXY:"SELF_PROXY",THIRD_PROXY:"THIRD_PROXY",CO
```

## POST /v2/yun/ads-space/ad

- Client name: `adsSpaceInfo`
- Candidate request keys: `appid`, `page`, `pageSize`, `adpos`, `lang`

```text
t:[],purchasePackageList:[],couponList:[],accountSettingList:[],homeList:[],openWindowTopAdv:[],expenseBuyProxyVip:[],expense_icon:void 0,expense_buyProxy_icon:void 0,expense_buyPackage_icon:void 0,mallAdList:[]}),actions:{async reqAllAdList(){const e=await oA.adsSpaceInfo({appid:3,page:1,pageSize:100});console.log("reqAllAdList",e),200===e.code&&(this.bgConfigList=e.data||[],this.loginRegisterList=this.bgConfigList.filter((e=>1===e.adpos)),this.topAdList=this.bgConfigList.filter((e=>2===e.adpos)),this.proxyTipList=this.bgConfigList.filter((e=>3===e.adpos)),this.cloudCoinList=this.bgConfigList
```

## PUT /v2/plugin/bind

- Client name: `bindAccount`
- Candidate request keys: `accountIds`, `pluginId`, `isTeam`, `pluginCompanyId`, `accountIdsCompanyId`

```text
rk")||"工作台",group:{name:"",groupid:""}};S.value=[e,...W(S.value)]}else S.value=S.value.filter((e=>"-1"!==e.shopid))},ae=()=>{Y("update:isShow",!1)},ie=async()=>{var e,l,i;const s=S.value.map((e=>e.shopid));console.log("accountIds",s),v.value=!0;const o=await p.bindAccount({accountIds:s,pluginId:null==(e=y.pluginInfo)?void 0:e.pluginId,isTeam:y.isTeam,pluginCompanyId:null==(l=y.pluginInfo)?void 0:l.pluginCompanyId,accountIdsCompanyId:w.value.filter((e=>!(null==s?void 0:s.includes(e))))});if(v.value=!1,200===o.code){const e=I.value.filter((e=>!(null==s?void 0:s.includes(e))));console.log("remove
```

## PUT /v2/plugin/group/updatePluginGroup

- Client name: `updatePluginGroup`
- Candidate request keys: `groupId`

```text
const e={...w.value,groupType:3===m.activeIndex?1:2,pluginCompanyId:g.value.filter((e=>e.on)).map((e=>e.pluginCompanyId||e.pluginId))};if(!e.pluginCompanyId.length)return void s.error(window.t("selectPlugin")||"请选择插件");O.value=!0;const l=""!==m.groupId?await u.updatePluginGroup({...e,groupId:m.groupId}):await u.createPluginGroup(e);O.value=!1,200===l.code&&(s.success(window.t("submitSuccess")||"提交成功"),$())})()}))};return J((async()=>{await(async()=>{const e={name:void 0,pageIndex:1,pageSize:10086,pluginTeam:3===m.activeIndex?1:2};o.value=!0;const l=await u.getPluginCompaniesPersonageList(e);l.
```

## PUT /v2/plugin/updatePluginCrx

- Client name: `updatePluginCrx`
- Candidate request keys: _none parsed_

```text
文件大小不能超过 2MB！"),!1):(s.error(window.t("fileJpg")||"文件必须是 JPG 或 PNG 格式！"),!1)},le=e=>{M.value.icon=e.data.crx.url},ae=e=>{M.value.card=e.data.crx.url},ne=e=>{C.value=e.url||"",b.value=!0};async function te(e){$.value=!0;const l=a.pluginId;let u=null;u=l?await n.updatePluginCrx(e):await n.uploadPlugin(e,!0),$.value=!1,200===(null==u?void 0:u.code)?(s.success(l?window.t("editSuccess")||"编辑成功":window.t("uploadSuccess")||"上传成功"),f.value=!1,i("success")):30009===(null==u?void 0:u.code)&&s.error(window.t("hasPluginName")||"插件名称已存在")}const oe=async()=>{d.value&&await d.value.validate((e=>{e&&(1===y.va
```

## PUT /v2/rpa/recoverRpaCarbonConfigByAll

- Client name: `recoverRpaCarbonConfigByAll`
- Candidate request keys: _none parsed_

```text
t("noPermissionMsg",{msg:i(l.Recycle_Recover)}));0!==re.value.length&&(ue.value=!0,pe.value.title=window.t("restoreAll")||"全部恢复",pe.value.content=window.t("confirmRestoreAllRPA")||"确认恢复回收站中的所有RPA模板吗？",pe.value.sbmitFunc=()=>{(async()=>{const{code:e=0}=await ae.recoverRpaCarbonConfigByAll();200===e&&(y(window.t("restoreAllSuccess")||"全部恢复成功","success"),de())})(),u(p.recycle_rpaTemplate_allRestore_sure,j.path)},d(p.recycle_rpaTemplate_allRestore,j.path))},we=()=>{if(!t(l.Recycle_Delete))return I.warning(window.t("noPermissionMsg",{msg:i(l.Recycle_Delete)}));0!==re.value.length&&(ue.value=!0,pe.v
```

## PUT /v2/rpa/recoverRpaCarbonConfigByConfigIds

- Client name: `recoverRpaCarbonConfigByConfigIds`
- Candidate request keys: `configId`

```text
clear,j.path))},fe=e=>{const{configId:a="",rpaName:t=""}=e;ue.value=!0,pe.value.title=window.t("recover")||"恢复",pe.value.content=window.t("confirmRestoreNamedItem",{name:t})||`确认恢复“${t}”吗？`,pe.value.sbmitFunc=()=>{(async e=>{const a=[e||""],{code:t=0}=await ae.recoverRpaCarbonConfigByConfigIds({configId:a});f.getInstance().subscribe(h.RPARevert),200===t&&(y(window.t("restoreRPASuccess")||"恢复RPA成功","success"),f.getInstance().removeSub(h.RPARevert.type),de())})(a),u(p.recycle_rpaTemplate_restore_sure,j.path)},d(p.recycle_rpaTemplate_restore,j.path)},he=e=>{const{configId:a=""}=e;ue.value=!0,pe.v
```

## PUT /v2/rpa/topRpaCarbonConfig

- Client name: `topRpaCarbonConfig`
- Candidate request keys: `configId`

```text
ge.setItem(x.SizeKey_TaskTemplate,String(e)),d.value.currentPage=1,z()},Q=F(),le=()=>{S(b.rpa_taskTemplate_start_sure,c.path)},ge=e=>{u.push({path:"/taskflow",query:{id:e}}),C(b.rpa_taskTemplate_editTaskProcess,c.path)},he=e=>{const a={configId:e};h.value=!0,v.topRpaCarbonConfig(a).then((e=>{h.value=!1,200===e.code?(r({message:window.t("operateSuccess")||"操作成功",type:"success"}),z()):r({message:window.t("operateFail")||"操作失败",type:"error"})})).catch((e=>{console.log(e),h.value=!1,r({message:window.t("operateFail")||"操作失败",type:"error"})}))},fe=()=>{var e;const a={configId:null==(e=f.value)?void
```

## PUT /v2/rpa/updateRpaCarbonConfigGroupId

- Client name: `updateRpaCarbonConfigGroupId`
- Candidate request keys: `groupId`, `configId`

```text
),g=F({groupId:""}),f=le({groupId:[{required:!0,message:window.t("pleaseSelectGroup")||"请选择分组",trigger:"change"}]}),w=Y("$api"),y=()=>{d.value.validate((e=>{if(e){console.log("moveTask");const e={groupId:g.value.groupId,configId:u.value.map((e=>e.configId))};w.updateRpaCarbonConfigGroupId(e).then((e=>{200===e.code?(r({message:window.t("operateSuccess")||"操作成功",type:"success"}),o("update"),c.value=!1):r({message:window.t("operateFail")||"操作失败",type:"error"})})).catch((()=>{r({message:window.t("operateFail")||"操作失败",type:"error"})}))}}))};return K((()=>t.isShow),(e=>{e&&(g.value.groupId="",u.val
```

## PUT /v2/rpa/updateRpaGroup

- Client name: `updateRpaGroup`
- Candidate request keys: `groupId`, `name`

```text
a,[C.value===e.row.groupId?(H(),se(ce,{key:0},[O("div",{class:W([{disabled:""===T.value},"finish fs-xs"]),onClick:a=>(e=>{if(!T.value)return void r({message:window.t("groupNameEmptyWarn")||"分组名称不能为空",type:"error"});const a={groupId:e,name:T.value};g.value=!0,i.updateRpaGroup(a).then((e=>{g.value=!1,200===e.code?(r({message:window.t("modifyGroupSuccess")||"修改分组名称成功",type:"success"}),T.value="",C.value="",s("update"),V()):50005===e.code?r({message:window.t("Groupexists")||"分组名称已存在",type:"error"}):r({message:window.t("modifyGroupError")||"修改分组名称失败",type:"error"})})).catch((()=>{g.value=!1,r({mess
```

## PUT /v2/rpa/updateRpaPlanManagement

- Client name: `updateRpaPlanManagement`
- Candidate request keys: _none parsed_

```text
Week:g,intervalTime:v,priorityExecute:f,runNum:w,startTime:h,status:1,cdeviceId:o,rdeviceId:l,planName:T};if(console.log("edit",a,e.planId,e.planName),a){y.planId=e.planId,y.planName=e.planName,y.status=e.status,console.log("reqData",y);const{code:a=0}=await Z.updateRpaPlanManagement(y);200===a?(r({message:window.t("modifyTaskSuccess")||"修改计划任务成功",type:"success"}),K("reloadList")):r.error(window.t("modifyTaskFailed")||"修改计划任务失败")}else{const{code:e=0}=await Z.createRpaPlanManagement(y);200===e?r({message:window.t("addTaskSucess")||"添加计划任务成功",type:"success"}):r.error(window.t("addTaskError")||"添
```

## PUT /v2/rpa/updateRpaPlanManagementStatus

- Client name: `updateRpaPlanManagementStatus`
- Candidate request keys: `planId`, `status`

```text
:modelValue":e=>a.status=e,disabled:!je.value,"active-value":1,"inactive-value":2,style:{"--el-switch-on-color":"var(--el-color-primary)","margin-right":"10px"},onChange:e=>(async(e,a)=>{const{status:t=1,planId:n=""}=a,l={planId:n,status:t},{code:s=0}=await xe.updateRpaPlanManagementStatus(l);200===s?(m({message:window.t("operateSuccess")||"操作成功",type:"success"}),Le()):m.error(window.t("modifyPlanTaskFailure")||"修改计划任务失败"),1===e?h(f.rpa_planManage_switch,z.path,"开启"):2===e&&h(f.rpa_planManage_switch,z.path,"关闭")})(e,a)},null,8,["modelValue","onUpdate:modelValue","disabled","onChange"]),[[g,G(i
```
