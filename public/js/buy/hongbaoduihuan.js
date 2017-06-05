require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanzhifucg = {};
    $.extend(dingdanzhifucg, {
        interval: null,
        backTF: false,
        init: function(){
            var _t = this;
            
            _t.bindEvent();
        },
        bindEvent: function(){
          var _t = this;
          $(document).on("focus", ".tihuoka > input", function(){
            $(this).addClass("txt");
            _t.interval = setInterval(function(){
              if(lib.trim($(".tihuoka > input:eq(0)").val()) !== ""){
                $(".thk_btn").addClass('thk_btn_r');
              }else{
                $(".thk_btn").removeClass('thk_btn_r');
              }
            }, 100);
          });
          
          
          $(document).on("touchstart", ".ui-close-dialog",function(){
            $("#thk_prompt").hide();
            _t.backTF && (location.href = '/buyer/order/dingdanqr.html');
            //history.back();
          });
          
          $(document).on("blur", ".tihuoka > input", function(){
            $(this).removeClass("txt");
            clearInterval( _t.interval);
          });
          
          /*我要提货*/
          $(document).on("tap", '.thk_btn.thk_btn_r', function(){
            var redPacketNo = $("#userCardNo").val();
            
            if(redPacketNo === ""){
              $(".ui-message-show").text("请输入红包兑换码！！！！");
              $("#thk_prompt").show();
              return;
            }
            common.js.ajx(reqUrl.ser+'redPacket/bindRedPacket.action', {redPacketNo: redPacketNo},function(data){
              if(data.infocode === "0"){
                $(".ui-message-show").text("兑换码兑换成功，可抵现金"+ data.info +"元");
                _t.backTF = true;
                
              }else if(data.infocode === "1"){
                  location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
              }else if(data.infocode === "3"){
                  $(".ui-message-show").text("红包兑换码已经被使用");
              }else if(data.infocode === "4" || data.infocode === "5"){
                  $(".ui-message-show").text("红包兑换码已过期");
              }else{
                $(".ui-message-show").text(data.info);
              }
               
                $("#thk_prompt").show();
            });
          });
        }
    });
    dingdanzhifucg.init();
});