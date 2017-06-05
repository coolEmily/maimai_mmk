/**
 * Created by liuhh on 2016/6/20.
 */
require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "visitor-logs"], function($, libjs ,vl){
    var lib = new libjs(),
        reqUrl = lib.getReq().ser,
        imgUrl = lib.getReq().imgPath,
        gIndex = 'k0';
    
    $(function(){
        if(sessionStorage.getItem("maihaohuo")){
            var id1=sessionStorage.getItem("maihaohuo").split("__")[0];
            var id2=sessionStorage.getItem("maihaohuo").split("__")[1];
            var index=sessionStorage.getItem("maihaohuo").split("__")[2];
            getData(id1, id2);
            $(".clearfix>li").eq(index).addClass("cur").siblings().removeClass("cur");
        }else{
            getData(8, 22);
        }
        initEvent();

        function initEvent(){
            $(document).on('tap','.nav_li:not(.cur)',function(){
                var arg=[{id1:8,id2:22},{id1:17,id2:27},{id1:9,id2:28},{id1:10,id2:29}];
                var id1=arg[$(this).index()].id1,id2=arg[$(this).index()].id2;
                sessionStorage.setItem("maihaohuo",id1+'__'+id2+'__'+$(this).index());
                $(this).addClass('cur').siblings().removeClass('cur');
                gIndex = 'k'+$(this).index().toString();
                if(sessionStorage.getItem(gIndex)){
                    $('#content').empty().append(sessionStorage.getItem(gIndex));
                }
                else {
                    $('#content').empty();
                    getData(id1,id2);
                }
            });
        }

        function getData(id1, id2){
            $('#content').empty();
            getRLocationInfo(id1, id2);
        }
        function getRLocationInfo(Id,adId){
            lib.ajx(reqUrl+'/rLocation/getRLocationInfo.action',{rLocationId:Id},function(data){

                if (data.infocode == "0") {
                    var appendHtml = '<div class="pro_box clearfix">',
                        dataList = data.info.List_rLg;
                    for(var i = 0;i< dataList.length; i++){
                        var tmp = '<div class="swiper-slide swiper-slide-left">'+
                                '<div class="img_wrapper">'+
                                '<a href="'+'/g?mId=' + lib.getUrlParam('mId') +'&gId='+dataList[i].goodsId+'" class="img_wrapper_link">'+
                                '<img src="'+imgUrl+dataList[i].mainPictureJPG+'"></a></div>'+
                                '<h3><a href="">'+dataList[i].chName+'</a></h3>'+
                                '<p class="price"><span class="now_price"><a href=""><i style="font-size:12px">￥</i>'+dataList[i].sellingPrice+'</a></span>'+
                                '<span class="marketing_price" style="text-decoration: initial;"><a href="" style="color:#ff3c3c;">'+(dataList[i].limitcoupon  ? "红包立减" + dataList[i].limitcoupon  + "元" : "")+'</a></span>'+
                                ' </p></div>';
                        appendHtml += tmp;
                    }
                    appendHtml +='</div>';
                    $('#content').append(appendHtml);
                    sessionStorage.setItem(gIndex,appendHtml);
                }else {
                    console.log("广告暂无");
                }
                getAdPlanInfo(adId);

            },function(){alert("调取推荐位排期信息失败");});
        }

        function getAdPlanInfo(Id){
            lib.ajx(reqUrl+'adPlan/getAdPlanInfo.action',{adLocationId:Id},function(data){

                if (data.infocode == "0") {
                    var appendHtml = "",
                        dataList = data.info.List_adSource;
                    for(var i = 0;i< dataList.length; i++){
                        var tmp = '<div class="ad_pos">'+
                            ' <a href="'+dataList[i].adLink+'">'+
                            '<img src="'+imgUrl+dataList[i].pictureUrl+'" alt=""></a></div>';
                        appendHtml += tmp;
                    }
                    $('#content').append(appendHtml);
                    sessionStorage.setItem(gIndex,sessionStorage.getItem(gIndex)+appendHtml);
                }else {
                    console.log("广告暂无");
                }
            },function(){alert("调取广告位排期信息失败");});
        }
    });
});