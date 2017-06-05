requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib',"Sortable"], function ($,lib,Sortable){
  lib = new lib();
   var show,list,common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
   $(function(){
        var detail={};
        var oId="";
        var arrnum="";
        $.extend(detail,{
            flag:true,
            //按钮第一次
            fir:true,
            init:function(){
               var _t=this;
                //禁止微信会弹效果
               _t.bound();
               //展示数据
               _t.showhsop();
               //保存按钮
               _t.compile();
           

            },
            //禁止微信会弹效果
            bound:function(){
            //    去掉iphone 手机默认行为
            $("body").on("touchmove",function(e){
                if(arrnum<=16){
                    e.preventDefault();
                }
            })
            },
            //加载页面，展示数据
            showhsop:function(){
                	lib.ajx(reqUrl.ser + "/mainPage/getMyChannel.action",{memberId:lib.getUrlParam("sId") || $.cookie("maimaicn_s_id"),flag:lib.getUrlParam("flag")},function(data){
                        oId=data.info.memberMainPageLocationId;
                        var html="",htm="";
                        arrnum="";
                        arrnum=(data.info.memberList.length || 0)+ (data.info.allChanneList.length || 0);
                        data.info.memberList.forEach(function(value,index){
                            html+='<div data-index="'+value.mainPageSourceId+'" style="background:url('+reqUrl.imgPath+value.imgAUrl+') no-repeat center center;background-size:cover;"><span class="js-remove"></span></div>';
                        })
                        data.info.allChanneList.forEach(function(value,index){
                            htm+='<div data-index="'+value.mainPageSourceId+'" style="background:url('+reqUrl.imgPath+value.imgAUrl+') no-repeat center center;background-size:cover;"><span class="js-remove"></span></div>';
                        })
                        $(".showsort").html(html);
                        $(".list").html(htm);
                    },function(err){
                          if(err){
                            alert("网络错误");
                         }
                      });
            },
            //排序拖拽插件api调用
            sort:function(){
                 [].forEach.call(document.querySelectorAll('.sort'), function (el,index){
                    if(index==0){
                       show=Sortable.create(el, {
                        group: {
                        name: 'advanced',
                        pull: false,
                        put: true
                        },
                        animation: 150,
                        ghostClass: 'ghost',
                        filter: '.js-remove',
                        onFilter: function (evt) {
                            document.querySelector(".list").appendChild(evt.item);
                        }
                    })
                    }else{
                        list=Sortable.create(el, {
                        group:{
                            name: 'advanced',
                            pull: true,
                            put: false
                        },
                        ghostClass: 'ghost',
                        animation: 150,
                        filter: '.js-remove',
                        onFilter: function (evt) {
                            $(evt.item).find("span").addClass("iconx");
                            document.querySelector(".showsort").appendChild(evt.item);
                            
                        },
                        onMove:function(e){
                         $(e.dragged).find("span").addClass("iconx");
                        }
                        })
                    }
                });
            },
            //保存数据
            savedata:function(){
                    //加载ajax
                        var odata={
                            memberMainPageLocationId:oId,
                        }
                        //
                       var cont=$(".showsort div");
                       if(cont.length>0){
                        $(".showsort div").each(function(index,value){
                           odata["channelList["+index+"].mainPageSourceId"]=$(value).data("index")
                        })
                       lib.ajx(reqUrl.ser + "/mainPage/changeChannel.action",odata,function(data){

                          if(data.infocode=="0"){
                          }else{
                              alert(data.info);
                          }
                        },function(err){
                                if(err){
                                    alert("网络错误");
                                }
                        });
                       }else{
                           alert("保存失败，至少选一个频道");
                       }
            },
            //调用ajax
            showLogin:function(){
                 var _t=this;
                 if(_t.fir){
                     lib.ajx(reqUrl.ser+'memberTotalMessage/getOrderNumWithType.action',{},function(data){
        		if(data.infocode == 1){
        			alert(data.info);
        		}else if(data.infocode == 2){
                    alert("请先登录");
                }else if(data.infocode == 0){
                    _t.fir=false;
                    _t.Odiv();
                }
        	},function(){
        		alert("请求失败，请检查网络连接");
        	});
                 }else{
                    _t.Odiv();
                 }
               
            },
            //点击保存按钮
            compile:function(){
                var _t=this;
                 $(".border").click(function(){
                        _t.showLogin();   
                })
            },
            //代码块
            Odiv:function(){
                var _t=this;
                if(_t.flag){
                       _t.sort();
                       _t.flag=false;
                        $(".border").text("完成");
                        $(".Btitle").text("拖拽排序");
                        $(".showbold").removeClass("hide"); 
                         $(".showsort .js-remove").addClass("iconx");
                    }else{
                        var state = show.option("disabled"),state1 =list.option("disabled");  // get
                        show.option("disabled", !state); // set
                        list.option("disabled", !state1); // set
                    if(!state){
                        //保存时，调用接口
                        $(".border").text("排序删除");
                        $(".Btitle").text("我的频道");   
                         $(".showbold").addClass("hide");
                        $(".showsort .js-remove").removeClass("iconx");    
                        //加载保存数据的ajax
                        _t.savedata();
                    }else{
                        $(".border").text("完成");
                        $(".Btitle").text("拖拽排序");
                         $(".showbold").removeClass("hide");
                        $(".showsort .js-remove").addClass("iconx");
                    }
                    }
            }




        })
         detail.init();
   });
});
