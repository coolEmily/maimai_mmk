require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "Chart.min","uploadImg1"], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var zhongxin = {};
        $.extend(zhongxin, {
            data: {
                    labels : ["1天","2天","3天","4天","5天","6天","7天"],
                    datasets : [{fillColor : "rgba(151,187,205,0)",strokeColor : "rgba(151,187,205,1)",pointColor : "rgba(151,187,205,1)",pointStrokeColor : "#fff",data : [0,0,0,0,0,0,0]}]
            },
            init: function(){
                if("1" === $.cookie("member_memberTypeId")){
                    location.href = "/buyer/home/huiyuanzx.html";
                    return;
                }
                if("3" !== $.cookie("member_memberTypeId")){
                    $(".ui-daka-zx").attr("href", "javascript:alert('此功能仅限大咖使用')");
                }
                if("3" === $.cookie("member_memberTypeId")){
                    $(".ui-maika-zx").attr("href", "javascript:alert('您已是大咖无需升级')");
                }
                $("body").css("display", "block");
                this.initPage();
                lib.fixedFooter(0, true);
                this.getShopInfo();
            },
            initChart: function(){
                var _t = this;
                var data = _t.data;
                var chartW = document.documentElement.clientWidth - 20 * 2;
                document.getElementById("myChart").width = chartW > 600 ? 600 : chartW;
                var ctx = document.getElementById("myChart").getContext("2d");
                var myNewChart = new Chart(ctx).Line(data);
                $(function(){
                    /*$('#weixinpay-erweima').qrcode({  
                      width: 140,
                      height: 140,
                      render: !!document.createElement('canvas').getContext ? 'canvas' : 'table', //兼容不同浏览器，因为ie浏览器不兼容canvas渲染模式
                      text: location.href//获取当前链接生成二维码
                    });*/
                    // $.get(reqUrl.image + "mkQrcode?u=" + encodeURI("http://mmk.maim9.com/buyer/shouye.html?mId="+$.cookie("member_memberId")), {}, function(data){
                    //    $('#weixinpay-erweima').append("<img width=140 src='" + reqUrl.imgPath + $.parseJSON(data).source +  "'/>");
                    // });
                    $(document).on("tap", ".ui-show-shop-qr",function(e){
                        $(".ui-seller_qr_code").show();
                    });
                    $(document).on("tap", ".ui-seller_qr_code", function(e){
                        var target = e.srcElement ? e.srcElement : e.target;
                        if(target.className.indexOf("ui-seller_qr_code") != -1){
                            $(".ui-seller_qr_code").hide();
                        }
                    });
                });
            },
            initPage: function(){
                var _t = this;
                common.js.ajx(reqUrl.ser + "member/getSellerIndexInfo.action", {}, function(data){
                   if(data.infocode === "0"){
                       _t.data.datasets[0].data = [data.info["0"],data.info["1"],data.info["2"],data.info["3"],data.info["4"],data.info["5"],data.info["6"]];
                       _t.initChart();
                       var srcImg=data.info.picture?reqUrl.imgPath+data.info.picture: "/images/default.png";
                       $("img[name=picture]").attr("src",srcImg);
                       $("p[name=nickName] span").text(data.info.nickName);
                       $("span[name=directMemberNum]").text(data.info.directMemberNum);
                       $("span[name=indirectMemberNum]").text(data.info.indirectMemberNum);
                       $("div[name=totalRebate]").text(data.info.totalRebate.toFixed(2));
                       $("div[name=balance]").text(data.info.balance.toFixed(2));
                       $('#weixinpay-erweima').append("<img width=140 src='" + reqUrl.imgPath + data.info.mallQRCode +  "'/>");
                    }else{
                       alert(data.info);
                       if(data.infocode === '2') location.href = "login/denglu.html?backUrl=" + common.tools.getBackUrl();
                       if(data.infocode === '3') location.href = "/buyer/home/huiyuanzx.html";
                   }
                }, function(){
                    alert("数据请求失败");
                });
            },
            getShopInfo: function(){
                var _t = this;
                common.js.ajx(reqUrl.ser + "/member/getMemberStoreInfo.action", {}, function(data){
                    if(data.infocode === '0'){
                        $(".ui-seller-name").text(data.info.mallName); 
                    }
                },function(){
                   console.log("请求失败，请刷新页面重试"); 
                });
            }
        });
        zhongxin.init();
    })();
});