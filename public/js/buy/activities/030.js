require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib','visitor-logs'], function($, lib, vl){
  lib = new lib();
  $(function(){
    vl.setLog(window.location.href, 2);//会员访问日志
    
    $(document).on("touchstart", "#ui-getRPB", function(){
      lib.ajx(lib.getReq().ser + '/redPacket/takeRedPacket.action', {redPacketTypeId: lib.getUrlParam("rptId")}, function(data){
        if(data.infocode === "0"){
          alert("您已抢到1314元约会红包");
        }else{
          if(data.infocode === "3"){
            alert("您还没有登录，登录成功后即刻开抢");
            location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
            return;
          }else if(data.infocode === "5"){
            alert("您今天已抢，明天再来呦！");
            return;
          }
          alert(data.info);
        }
      });
    });
	});
});
