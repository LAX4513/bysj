(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-40655f12"],{"1e9b":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"image-page"},[a("el-card",[a("div",{attrs:{slot:"header"},slot:"header"},[a("my-bread",[e._v("素材管理")])],1),a("el-radio-group",{attrs:{size:"small"},on:{change:e.changeCollect},model:{value:e.reqParams.collect,callback:function(t){e.$set(e.reqParams,"collect",t)},expression:"reqParams.collect"}},[a("el-radio-button",{attrs:{label:!1}},[e._v("全部")]),a("el-radio-button",{attrs:{label:!0}},[e._v("收藏")])],1),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success",size:"small"},on:{click:function(t){return e.openDialog()}}},[e._v("添加素材")]),a("ul",{staticClass:"img-list"},e._l(e.images,(function(t){return a("li",{key:t.id,staticClass:"img-item"},[a("img",{attrs:{src:t.url,alt:""}}),e.reqParams.collect?e._e():a("p",{staticClass:"action"},[a("span",{staticClass:"el-icon-star-off",class:{active:t.is_collected},on:{click:function(a){return e.toggleStatus(t)}}}),a("span",{staticClass:"el-icon-delete",on:{click:function(a){return e.deleteImage(t.id)}}})])])})),0),a("el-pagination",{attrs:{background:"",layout:"prev, pager, next","current-page":e.reqParams.page,"page-size":e.reqParams.per_page,total:e.total},on:{"current-change":e.togglePage}})],1),a("el-dialog",{attrs:{title:"添加素材","append-to-body":"",visible:e.dialogVisible,width:"300px"},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-upload",{staticClass:"avatar-uploader",attrs:{action:e.uploadUrl,headers:e.uploadHeaders,name:"image","show-file-list":!1,"on-success":e.handleUploadSuccess}},[e.imageUrl?a("img",{staticClass:"avatar",attrs:{src:e.imageUrl}}):a("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1)],1)},r=[],i=(a("96cf"),a("1da1")),n={name:"ImagePage",data:function(){return{reqParams:{collect:!1,page:1,per_page:12},images:[],total:0,dialogVisible:!1,imageUrl:"",uploadUrl:this.$http.defaults.baseURL+"/mp/v1_0/user/images",uploadHeaders:{Authorization:"Bearer "+window.localStorage.getItem("token")}}},created:function(){this.getImages()},methods:{handleUploadSuccess:function(e){var t=this;this.$message.success("上传素材成功"),this.imageUrl=e.data.url,window.setTimeout((function(){t.dialogVisible=!1,t.getImages()}),3e3)},openDialog:function(){this.imageUrl="",this.dialogVisible=!0},deleteImage:function(e){var t=this;this.$confirm("此操作将永久删除该素材, 是否继续?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){try{t.$http.delete("/mp/v1_0/user/images/".concat(e)),t.$message.success("删除素材成功"),t.getImages()}catch(a){t.$message.error("删除素材失败")}})).catch((function(){}))},toggleStatus:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var s,r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,t.$http.put("/mp/v1_0/user/images/".concat(e.id),{collect:!e.is_collected});case 3:s=a.sent,r=s.data.data,t.$message.success(r.collect?"添加收藏成功":"取消收藏成功"),e.is_collected=r.collect,a.next=12;break;case 9:a.prev=9,a.t0=a["catch"](0),t.$message.error("操作失败");case 12:case"end":return a.stop()}}),a,null,[[0,9]])})))()},getImages:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http.get("/mp/v1_0/user/images",{params:e.reqParams});case 2:a=t.sent,s=a.data.data,e.images=s.results,e.total=s.total_count;case 6:case"end":return t.stop()}}),t)})))()},togglePage:function(e){this.reqParams.page=e,this.getImages()},changeCollect:function(){this.reqParams.page=1,this.getImages()}}},c=n,l=(a("78f2"),a("2877")),o=Object(l["a"])(c,s,r,!1,null,"bdc42862",null);t["default"]=o.exports},4084:function(e,t,a){},"78f2":function(e,t,a){"use strict";a("4084")}}]);
//# sourceMappingURL=chunk-40655f12.6d6fd1bb.js.map