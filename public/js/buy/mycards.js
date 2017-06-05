/**
 * Created by yaoyao on 2017/4/25.
 */
require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib) {
    lib = new lib();
    $(function(){
        var cardsList= lib.getReq().ser+'/activeTvCard/getCardList.action',//卡列表
            cardsShow= lib.getReq().ser+'/activeTvCard/getCardInfo.action',//卡展示
            cardsInfo= lib.getReq().ser+'/activeTvCard/getCardDetail.action';//卡信息

        var cardTypeId=lib.getUrlParam("id")?lib.getUrlParam("id"):"";//卡片Id

        var headId=$(".main_head").attr("headId");
        if(headId === "mycards"){//卡片列表
            var rows=10,//每页条数
                allPages=2,//总页数
                pageNo=1;//页数
                getCardList();
                roll();  //下滑自动加载
         }else if(headId === "mycards_show"){//卡片展示
            getCardShow();
         }else if(headId === "mycards_box"){//卡包

            var redBalance=lib.getUrlParam("b")?lib.getUrlParam("b"):"";//红包余额
            var goldCoin=lib.getUrlParam("g")?lib.getUrlParam("g"):"";//金豆

            $("#redBalance").html(redBalance);
            $("#goldCoin").html(goldCoin);

         }else{//卡片信息
            getCardInfo();
         }



        function roll(){
            $(window).scroll(function (){
                if((pageNo<allPages) && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    ++pageNo;
                    // 更改属性
                    getCardList();//商品展示
                    $(window).scrollTop($(document).height()-$(window).height()-50);
                }
            });
        }

        function getCardList() {
            lib.ajx(cardsList,{page:pageNo,rows:rows}, function (data) {
                if (data.infocode === "0") {
                    allPages=Math.ceil(data.info.count/rows);
                    if (data.info.length === 0) {
                        $("#nocards").show();
                    } else {
                        createHtml(data.info);
                    }
                }else{
                    alert(data.info);
                }
            }, function () {
                alert("列表加载失败！");
            });
        }

        function createHtml(dataInfo){
            var cardstr="";
            $.each(dataInfo,function(i,v){
                cardstr+=' <dl><a href="/buyer/home/mycards_show.html?id='+v.cardTypeId+'"><dt><img src="'+lib.getReq().imgPath+v.logoPicture+'" alt=""></dt><dd><span>'+v.mallName+'</span><span>'+v.cardName+'</span></dd></a></dl>';
            });
            pageNo == 1? $("#cards-list").html(cardstr) : $("#cards-list").append(cardstr);//获取数据追加到列表
        }

        function getCardShow(){
            lib.ajx(cardsShow,{cardTypeId:cardTypeId}, function (data) {
                if (data.infocode === "0") {
                  var d=data.info;
                  var useLink = d.cardType === 1?d.linkUrl :'/g?sId=1&gId='+d.goodsId;

                   $("#cards-detail").html('<div><img src="'+lib.getReq().imgPath+d.logoPicture+'" alt=""></div><div>'+d.mallName+'</div><div>'+d.cardName+'</div><div>'+d.slogan+'</div><a href="'+useLink+'" class="useImmediately" id="useImmediately">立即使用</a><div class="date">有效期:'+d.startTime.substr(0,10)+' - '+d.endTime.substr(0,10)+'</div><a href="/buyer/home/mycards_info.html?id='+ d.cardTypeId+'" class="to-detail"><span></span>卡券详情</a>');
                }
            },function(){
                alert("卡券信息加载失败！");
            });
        }

        function getCardInfo(){
            lib.ajx(cardsInfo,{cardTypeId:cardTypeId}, function (data) {
                if (data.infocode === "0"){
                    var d=data.info;
                    $("#mark").html(d.mark);
                    $("#valid").html(d.startTime.substr(0,10)+'至'+d.endTime.substr(0,10));
                    $("#useDays").html(d.useDateType);
                    $("#rules").html(d.rule);
                }
            },function(){
                alert("卡券信息加载失败！");
            });
        }

    });
});