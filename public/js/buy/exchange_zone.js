requirejs.config({baseUrl: '/js/lib', urlArgs: "v0.0.1", paths: {swiper: "swiper.min"}});
require(['zepto', 'lib','swiper'], function( $, lib, swiper){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
	var remai = {};
    var flag=true;
    var mySwiper2;
	$(function(){
		$.extend(remai,{
            //数量
            amount:0,
            //价格
            price:0,
            //scrolltop
            sctop:0,
            //登陆状态
            lgstuse:0,
            //是否加载果
            ifjz:true,
            memberId: lib.getUrlParam('sId') || $.cookie("maimaicn_s_id") || 1,
            goodstring:[],
            goodstrings:{},
            goodsStr:{},
		    init:function(){
               this.addswiper();
               this.addshop();
               this.showdata();
               this.payorlg();
            },
            //导航图
            rollSwiper:function(){
                var mySwiper1 = new Swiper('#nav',{
                    freeMode : true,
                    slidesPerView : 'auto',
                    onTap: function(swiper){
                        $(swiper.clickedSlide).addClass("active").siblings().removeClass("active");
                        mySwiper2.slideTo(swiper.clickedIndex);
                     },
                     onTouchEnd:function(swiper){
                         if(swiper.isEnd){
                             $(".alert").hide();
                         }else{
                             $(".alert").show();
                         }
                     }
                });
            },
            roolSwiper2:function(){
                mySwiper2 = new Swiper('#list',{
                speed:500,
                noSwiping : true,
                noSwipingClass : 'swiper-slide'
                });
            },
            showdata:function(){
               var _t=this;
                //接口 /virtualMoneyGoods/getVirtualMoneyGoodsList.action
                 lib.ajx(reqUrl.ser + '/virtualMoneyGoods/getVirtualMoneyGoodsList.action',{}, function (data) {
                  var defaultdata=JSON.parse(sessionStorage.getItem("goodstrings"));
                    var h="";
                    var l="";
                    if(data.infocode==0){
                        var lgs=data.info.loginStatus;
                        if(lgs==0){
                            $(".dright").data("lgs",lgs).text("请登录");
                            $(".d_pay p:eq(1)").addClass("active").text("你还没有登陆哦~");
                        }else{
                            $(".dright").data("lgs",lgs);
                            $(".d_pay p:eq(1)").html("你<i class='dhs'>只</i>有<em>"+(data.info.virtualMoneyBalance?data.info.virtualMoneyBalance:"0")+"</em>个金豆哦~");
                        }
                       var judge=data.info.classAndInfoList;
                         if(judge){
                            judge.forEach(function(value,index) {
                                var arr=value.virtualMoneyGoodsList;
                                h+='<div class="swiper-slide '+(index==0?"active":" ")+'">'+value.className+'</div>';
                                l+='<ul class="swiper-slide">';
                 
                              arr.forEach(function(val,ind){
                                l+='<li class="list_item clearfix" data-cid="'+val.classId+'" data-oid="'+val.goodsId+'"><a href="/g?gcoin=1&sid='+_t.memberId+'&gId='+val.goodsId+'" class="li_img" style="background:url('+reqUrl.imgPath+val.mainPictureJPG+') no-repeat center center;background-size:cover;"></a><div class="li_right"><a href="/g?gcoin=1&sid='+_t.memberId+'&gId='+val.goodsId+'" class="li_pa">'+val.chName+'</a><div class="pric_bottom"><div class="pric_sh"><p>售价：<strong>'+val.virtualMoneyprice+'</strong>金豆</p><p>参考价：￥'+val.sellingPrice+'</p></div><div class="pric_do"><button class="icon dh_hide icon_del"></button><span class="dh_num dh_hide">0</span><button class="icon icon_add"></button></div></div></div><a class="dh_alert" href="/g?gcoin=1&sid='+_t.memberId+'&gId='+val.goodsId+'" data-bg="url('+reqUrl.imgPath+val.mainPictureJPG+') no-repeat center center"></a></li>'
                                });
                                 l+='</ul>';
                            });
                            $('#nav .swiper-wrapper').append(h);
                            $("#list .list").append(l);
                             var wid=$(window).width();
                            if(judge.length<=4){
                                $("#nav .swiper-slide").css({"width": (wid/judge.length)+'px'});
                                $(".alert").hide();
                            }else{
                                 $("#nav .swiper-slide").css({"width": (wid/(4.5))+'px'});
                            }
                            _t.rollSwiper(); 
                            _t.roolSwiper2();
                         }else{
                             $("#nav").remove();
                             var Arr=data.info.virtualMoneyGoodsList;
                              l+='<ul class="swiper-slide">';
                             Arr.forEach(function(val,ind){
                                l+='<li class="list_item clearfix" data-cid="'+val.classId+'" data-oid="'+val.goodsId+'"><a href="/g?gcoin=1&sid='+_t.memberId+'&gId='+val.goodsId+'" class="li_img" style="background:url('+reqUrl.imgPath+val.mainPictureJPG+') no-repeat center center;background-size:cover;"></a><div class="li_right"><a href="/g?gId='+val.goodsId+'" class="li_pa">'+val.chName+'</a><div class="pric_bottom"><div class="pric_sh"><p>售价：<strong>'+val.virtualMoneyprice+'</strong>金豆</p><p>参考价：￥'+val.sellingPrice+'</p></div><div class="pric_do"><button class="icon dh_hide icon_del"></button><span class="dh_num dh_hide">0</span><button class="icon icon_add"></button></div></div></div><a class="dh_alert" href="/g?gId='+val.goodsId+'" data-bg="url('+reqUrl.imgPath+val.mainPictureJPG+') no-repeat center center"></a></li>'
                                });
                                 l+='</ul>';
                                 $("#list .list").append(l); 
                                 _t.roolSwiper2();
                               
                         }
                          _t.defaultdt(defaultdata);
                    }
                 });
                //  *************************
               
            },
            //轮播图
            lunswipre:function(){
                 var _t = this;
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                loop: true,
                speed: 800,
                autoplay: 9000,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                onInit: function(swiper){
                   var len= $('.swiper-container .swiper-slide').length;
                    if(len<=3) {
                        swiper.stopAutoplay();
                        swiper.lockSwipeToNext();
                        swiper.lockSwipeToPrev();
                    }
                },
                onTouchStart: function (swiper) {
                    _t.sTP = swiper.translate;
                },
                onTouchEnd: function (swiper) {
                    _t.eTP = swiper.translate;
                }
            })
            },
            //轮播图添加数据
            addswiper:function(){
                var _t=this;
                  var h = '';
                lib.ajx(reqUrl.ser + '/adPlan/getAdPlanInfo.action', {adLocationId: 187}, function (data) {
                    if (data.infocode == 0) {
                        $.each(data.info.List_adSource, function (k, v) {
                            h += '<a class="swiper-slide" href="' + v.adLink + '"><img src="' +reqUrl.imgPath + v.pictureUrl + '"></a>'
                        });
                        $('.swiper-container .swiper-wrapper').append(h);
                        _t.lunswipre();
                    } else {
                        alert('请求数据失败')
                    }
                }, function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
            },
            //添加商品操作
            addshop:function(){
                var _t=this;
                $("#list").on("tap",".icon",function(){
                    
                     var num= $(this).siblings(".dh_num").text();
                      var oid=$(this).parents(".list_item").data("oid");
                    if($(this).hasClass("icon_add")){
                        ++num;
                         $(".list_item").each(function(index,value){
                             if(oid===$(value).data("oid")){
                                    $(value).find(".dh_num").text(num);
                                    $(value).find(".dh_hide").addClass("dh_show").removeClass("dh_hide");
                             }
                         })
                        // **********获取位置
                        if(flag){
                            var item=$(this).parents(".list_item").children(".dh_alert");
                            var y=($(".dcicle").offset().top-item.offset().top);
                            var x=($(".dcicle").offset().left-item.offset().left);
                            if(flag){
                                _t.sports(x,y,item);
                            }    
                        }
                       
                    }else if($(this).hasClass("icon_del")){
                        --num;
                         $(".list_item").each(function(index,value){
                             if(oid===$(value).data("oid")){
                              if(num<=0){
                                  num=0;
                                 $(value).find(".dh_show").addClass("dh_hide").removeClass("dh_show");
                              }
                             $(value).find(".dh_num").text(num);
                             }
                         })
                    }
                     //操作金币
                 _t.dogolad();
                })
                 
            },
            //运动
            sports:function(x,y,item){
                var obj={
                "transform":"translate("+x+"px,"+y+"px) rotate(0deg) scale(0.3)",
                '-webkit-transform':"translate("+x+"px,"+y+"px) rotate(0deg) scale(0.3)",
                "opacity":"1"
                };
                obj["background-size"]="cover";
                obj["background"]=item.data("bg");
                item.addClass("sports").css(obj);
                 flag=false;
                item.on("webkitTransitionEnd transitionend",function(e){
                e.stopPropagation();
                item.removeClass("sports").removeAttr("style");
                flag=true;
                })
            },
            //操作金币
            dogolad:function(){
                 var _t=this;
                 _t.amount=0;
                 _t.price=0;
                 _t.goodstring=[];
                  _t.goodsStr={};
                sessionStorage.setItem("goodstrings",JSON.stringify(_t.goodsStr));
                sessionStorage.setItem("goodstr",JSON.stringify(_t.goodstring));
                 //数量
                $("#list ul:eq(0)").find(".dh_num").each(function(ind,val){
                    var prc=Number($(val).parents(".list_item").find(".pric_sh strong").text());
                    var goodstrings=$(val).parents(".list_item").data("oid");
                    var num=Number($(val).text());
                    _t.amount+=num;
                    _t.price+=num*prc;
                    if(num>0){
                        _t.goodstring.push(goodstrings+"^"+num);
                         _t.goodstrings={};
                        _t.goodstrings.num=num;
                        _t.goodstrings.price=_t.price;
                        _t.goodsStr[goodstrings]=JSON.stringify(_t.goodstrings);
                     sessionStorage.setItem("goodstrings",JSON.stringify(_t.goodsStr));
                     sessionStorage.setItem("goodstr",JSON.stringify(_t.goodstring));
                    }
                })
                 if(String(_t.price).indexOf(".")!="-1"){
                         _t.price=Number(_t.price).toFixed(2);
                }
                if($(".dright").data("lgs")!=0){
                      $(".dright").removeAttr("style");
                      $(".d_pay p:eq(1)").removeClass("active");
                    if(_t.price>$.trim($(".d_pay em").text())){
                    $(".d_pay p:eq(1)").addClass("active").find(".dhs").show();
                    _t.lgstuse=3;
                    $(".dright").css({"background":"#999"}).data("lgs",3);
                    }else{
                        $(".dhs").hide();
                        _t.lgstuse=1;
                        $(".dright").data("lgs",1);
                    }
                }
                $(".dcicle p:eq(0)").text(_t.amount);
                $(".d_pay strong").text(_t.price);
                 if($(".dright").data("lgs")!="0"){
                    if($.trim($(".dcicle p:eq(0)").text())=="0"){
                        _t.lgstuse=4;
                         $(".dright").css({"background":"#999"}).data("lgs",4);
                    }
                 }
            },
            //购买或登录
           payorlg:function(){
               var _t=this;
                $(".dright").on("click",function(e){
                    if(!_t.lgstuse){
                      _t.lgstuse=$(this).data("lgs");
                    }
                    if(_t.lgstuse=="0"){
                        window.location.href="/buyer/login/dlzc.html?backUrl="+lib.getBackUrl();
                    }else if(_t.lgstuse=="1"){
                        var strz=_t.goodstring.join("_");
                         window.location.href='/buyer/order/dingdanqr_dh.html?goodsStr='+strz;
                    }else if(_t.lgstuse=="3"){
                        alert("金豆不足");
                    }else if(_t.lgstuse=="4"){
                        alert("请选购商品");
                    }
                })
            },
            //默认数据
            defaultdt:function(data){  
                var _t=this; 
                var dharr=[0];              
                  if(data){
                $(".list_item").each(function(ind,val){
                   var oid=$(val).data("oid");  
                    Object.keys(data).forEach(function(value,index){
                        if(value==oid){
                            var obj=JSON.parse(data[oid]);
                            $(val).find(".dh_hide").addClass("dh_show").removeClass("dh_hide");
                            $(val).find(".dh_num").text(obj.num);
                            _t.amount+=obj.num;
                            dharr.push(obj.price);
                        }
                    })
                })
                _t.price=Math.max.apply(Math,dharr);
                $(".d_pay strong").text(_t.price);
                if($(".dright").data("lgs")!=0){
                    if(_t.price>$.trim($(".d_pay em").text())){
                    $(".d_pay p:eq(1)").addClass("active");
                    $(".dright").css({"background":"#999"}).data("lgs",3);
                }else{
                    $(".dhs").hide();
                }
                }
                 $(".dcicle p:eq(0)").text(parseInt(_t.amount/2));
                _t.goodstring=JSON.parse(sessionStorage.getItem("goodstr"));
                }
                 if($(".dright").data("lgs")!="0"){
                    if($.trim($(".dcicle p:eq(0)").text())=="0"){
                         $(".dright").css({"background":"#999"}).data("lgs",4);
                    }
                 }
            }
            //ios端
            // iosd:function(){
            //     var _t=this;
            //     $('.list').on("touchmove",function (e) {
            //         var top=e.touches[0].clientY;
            //         var bool=Number(top)-Number(_t.sctop)<=0?true:false;
            //         _t.sctop=top;
            //         if(bool){
            //             if ((top> $(document).height() - $(window).height() - 100)) {
            //                 e.preventDefault();
            //             }
            //         }
                   
            //     });
            // }
		});
		remai.init();
	});
});