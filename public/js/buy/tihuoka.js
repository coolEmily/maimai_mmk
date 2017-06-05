require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanzhifucg = {};
    $.extend(dingdanzhifucg, {
        realCardNo: sessionStorage.rcNo || common.tools.getUrlParam("rcNo"),
        password: sessionStorage.pass || common.tools.getUrlParam("pass"),
        timeout: null,
        init: function(){
            var _t = this;
            sessionStorage.removeItem('rcNo');
            sessionStorage.removeItem('pass');
            _t.bindEvent();
            
            _t.realCardNo && $(".thk_btn").addClass('thk_btn_r');
            $("#userCardNo").val(_t.realCardNo);
            $("#userPass").val(_t.password);
            $("html,body").css("height", document.documentElement.clientHeight + "px");
            if(document.documentElement.clientHeight < 400){
              $(".tihuoka").next().hide();
            }
        },
        bindEvent: function(){
          $(document).on("focus", ".tihuoka > input", function(){
            $(this).addClass("txt");
          });
          
          $(".tihuoka > input:eq(0)").change(function(){
            if(lib.trim($(this).val()) !== ""){
              $(".thk_btn").addClass('thk_btn_r');
            }else{
              $(".thk_btn").removeClass('thk_btn_r');
            }
          });
          
          $(document).on("blur", ".tihuoka > input", function(){
            $(this).removeClass("txt");
          });
          
          /*我要提货*/
          $(document).on("touchstart", '.thk_btn.thk_btn_r', function(){
            var _t = this;
            var realCardNo = $("#userCardNo").val(), pass = $("#userPass").val();
            
            if(realCardNo === "" ||  pass === ""){
              clearTimeout(_t.imeout);
              $(".thk_prompt").text("请输入卡号或密码");
              $(".thk_prompt").show();    
              _t.timeout = setTimeout(function(){
                $(".thk_prompt").hide();
              }, 3000);
              return;
            }
            common.js.ajx(reqUrl.ser+'shoppingCart/toBalanceForRealCard.action', {realCardNo: realCardNo, password: pass},function(data){
                if(data.infocode === "0"){
                  location.href = "tihuokaddqr.html?rcNo="+ realCardNo +"&&pass="+ pass;
                }else{
                  $(".thk_prompt").text(data.info);
                  $(".thk_prompt").show();
                  clearTimeout(_t.imeout);
                  
                  _t.timeout = setTimeout(function(){
                    $(".thk_prompt").hide();
                    if(data.infocode === "1"){
                      sessionStorage.rcNo = realCardNo;
                      sessionStorage.pass = pass;
                      location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                    }  
                  }, 3000);
                }
            });
          });
        }
    });
    dingdanzhifucg.init();
});