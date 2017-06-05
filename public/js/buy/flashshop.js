requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib'], function ($,lib){
  lib = new lib();
   var show,list,common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
   $(function(){
        var detail={};
        var oId="";
        var arrnum="";
        $.extend(detail,{
            init:function(){
                this.show();
                this.btnclick();
            },
            //展示数据
            show:function(){
                var that=this;
                lib.ajx(reqUrl.ser + "mainPageSource/getFlashSaleGoodsList.action",{
                    flashSaleId:lib.getUrlParam("flashSaleId"),
                    memberId:lib.getUrlParam("sId"),
                    memberMainPageLocationId:lib.getUrlParam("memberMainPageLocationId"),
                    flag:lib.getUrlParam("flag")
                },function(data){
                    if(data.infocode==0){
                          //头部尾部广告位展示
                    that.bannershow(data);
                    //列表展示
                    that.listshow(data);
                    //倒计时展示
                    that.timeshows(data);
                    }else{
                        alert(data.info);
                    }
                   
                     },function(err){
                          if(err){
                            alert("网络错误");
                         }
                      });
                   
            },
            //头部尾部广告位展示
            bannershow:function(data){
                if(!data.info.picList){
                     $(".banner").hide();
                    $(".footer").hide();
                    return;
                }
                  $(".banner").css({"background":"url("+reqUrl.imgPath+data.info.picList[0].imgAUrl+") no-repeat center center","backgroundSize":"cover"}).attr("href",data.info.picList[0].linkUrl);
                    $(".footer h3").text(data.info.picList[1].mainPageSourceName);
                    $(".footer").attr("href",data.info.picList[1].linkUrl)
                    $(".footer .box").css({"background":"url("+reqUrl.imgPath+data.info.picList[1].imgAUrl+") no-repeat center center","backgroundSize":"cover"});
                    $(".footer .num").text(data.info.picList[1].readNumber+"次浏览");
            },
            //列表展示
            listshow:function(data){
                if(!data.info.goodsList){
                    return;
                }
                  var arr=data.info.goodsList;
                    arr.forEach(function(value, index){
                       var lang=parseInt(((value.flashSaleNum-value.remain+value.baseSaleNum)/(value.flashSaleNum+value.baseSaleNum))*100);
                       var html='<a class="listitem" data-hrf="'+value.goodsId+'" href="javascript:void(0);"><div class="img" style="background:url('+reqUrl.imgPath+value.mainPictureJPG+') no-repeat center center;background-size:contain;"></div><div class="box"><p class="top">'+value.chName+'</p><h5><strong class="tuan">￥'+value.flashPrice+'</strong><strong class="yuan">￥'+value.sellingPrice+'</strong></h5><div class="name"><div class="rang"><div class="rangitem" style="width:'+lang+'%"></div></div><span class="test">已售'+(lang>=100?"完":lang+"%")+'</span></div></div><div class="btn"><span data-hrf="'+value.goodsId+'" class='+(lang>=100?"colorp":" ")+'>立即抢购</span></div></a>';
                       $(".list").append(html);
                    })
            },
            //倒计时展示
            timeshows:function(data){
                var browser = {
            versions: function () {
                var ua = navigator.userAgent.toLowerCase();
                return {
                    weixin: ua.indexOf('micromessenger') != -1,
                    android: ua.indexOf('android') != -1,
                    iPhone: ua.indexOf('iphone') != -1,
                    iPad: ua.indexOf('ipad') != -1
                };
            }()
    };  
                     var times=Date.parse(browser.versions.iPhone || browser.versions.iPad?data.info.endTime.replace(/-/g,"/"):data.info.endTime)-new Date().getTime();
                    var hours=parseInt(times/(1000*60*60));
                    var mins=parseInt(times%(60*60*1000)/(60*1000));
                    var seson=parseInt(times%(60*60*1000)%(60*1000)/1000);
                    if(times<=0){
                        $(".boxborder").text("00");
                    }else{
                         $(".boxborder").eq(0).text(hours);
                         $(".boxborder").eq(1).text(mins);
                         $(".boxborder").eq(2).text(seson);
                    }
                     this.times(hours,mins,seson);
                   
            },
            //倒计时操作
            times:function(hours,mins,seson){
                var time=setInterval(function(){
                    seson--;
                    if(seson<0){
                        mins--;
                        seson=59;
                    }
                    if(mins<0){
                        hours--;
                        mins=59
                    }
                    if(hours<0){
                    clearInterval(time);
                       hours=00;
                       mins=00;
                       seson=00;
                    }
                    hours=hours<=9?"0"+Number(hours):hours;
                    mins=mins<=9?"0"+Number(mins):mins;
                    seson=seson<=9?"0"+Number(seson):seson;
                    $(".boxborder").eq(0).text(hours);
                    $(".boxborder").eq(1).text(mins);
                    $(".boxborder").eq(2).text(seson);
                },1000);
            },
            //按钮点击
            btnclick:function(){
                $(".list").on("click",".listitem",function(){
                    if(!$(this).hasClass("colorp")){
                         var id=$(this).data("hrf");
                        window.location.href='/g?gId='+id;
                    }else{
                        alert("抢购完成");
                     }
                })
            }
        });
         detail.init();
   });
});
