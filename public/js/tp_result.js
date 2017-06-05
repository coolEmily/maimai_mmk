requirejs.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    $(function(){
        var voteId=lib.getUrlParam('vId')?lib.getUrlParam('vId'):1;
        dataCall();
        setInterval(function(){//每秒刷新接口
            dataCall();
        },1000)
        //数据调取
        function dataCall(){
            lib.ajx( lib.getReq().ser+"vote/diagramBarPic.action", {activeVoteTypeId:voteId}, function(data){
               if(data.infocode == 2){
                   var df=data.info;
                   var str="";
                   $.each(df.playerList,function(i,v){
                       var img = v.imgUrl?lib.getReq().imgPath+v.imgUrl:"/images/tv/face.png";
                       str+='<div class="columnar"><span>'+v.votedNum+'</span><div class="col" rate='+v.perNum+'><div><img src="'+img+'" alt=""></div></div><span>'+v.playerName+'</span></div>'
                   })
                   $("#con_box").html(str);
                   $("#con_box .columnar:eq(1)").addClass("columnar_right");
                   setHeight();
                   df.imgUrl!==""?$(".container").css("background","url("+lib.getReq().imgPath+df.imgUrl+")"):"";
               }else{
                console.log(data.info);
               }
            },function(){
                console.log("ajax error");
            });
        }
         //设置柱状高度
        function setHeight(){
           $(".col").each(function(){
             var h= $(this).attr("rate")*485/100+160+"px";
                 $(this).find("div").height(h);
                 $("#con_box").show();
           })
        }
    });
});