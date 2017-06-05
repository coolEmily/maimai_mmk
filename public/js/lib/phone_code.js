/**
 * 手机获取验证码
 * */
define(["zepto", "lib"], function($, lib){
    lib = new lib();
    var bindPhone = {};
    $.extend(bindPhone,{
      init:function(){
         var _t=this;
             _t.storage=window.sessionStorage?window.sessionStorage:"";
             _t.sendPhoneUrl=lib.getReq().ser+"/verifyCode/sendSmsCode.action";//发送手机短信
             _t.BindPhoneUrl=lib.getReq().ser+"/member/bindMobile.action";//绑定手机提交
    
             _t.getCode();//图片验证码
             _t.getPhoneCode();//获取手机验证码
             _t.getFocus();//input获得焦点的时候
             _t.isUsing(false);// 根据false或true 去判断手机状态的正确与否
            // _t.bindPhone();//绑定手机
       },
      getCode:function(){//获取验证码
        $("#imgNum").attr("src",lib.getReq().ser+"/verifyCode/getImage.action?timestamp="+new Date().getTime());
        $("#imgNum").on("tap",function(){
            $(this).attr("src",lib.getReq().ser+"/verifyCode/getImage.action?timestamp="+new Date().getTime());
        });
      },
      getPhoneCode:function(){
          var _t=this;
          var time = 0;
          $(document).on("tap", "#phone_code", function(){
                if(time > 0) return;
                if($("#phoneval").prev('.login_hd_i').length > 0){
                    return;
                }
               var numReg = /^1[3,4,5,7,8]\d{9}$/,
                   phoneVal=$("#phoneval").val(),
                   imgVal=$("#imgval").val();
                   $(".login_hd_i").remove();
    
                  if(phoneVal === "" && imgVal === ""){
                     _t.dealVerify({phone:$("#phoneval"),img:$("#imgval"),text:"手机和图片验证码为空"});
                   }else if(phoneVal === ""){
                     _t.dealVerify({phone:$("#phoneval"),img:"",text:"手机为空"});
                   }else if(imgVal === ""){
                     _t.dealVerify({phone:"",img:$("#imgval"),text:"图片验证码为空"});                           
                   }else if(!numReg.test(phoneVal)){
                      $("#login_error").show().html("请输入正确的手机号");   
                   }else{
                      sendPhoneCode();
                   }
                  //发送短信验证码
                 function sendPhoneCode(){
                    time = 120; 
                    $("#phone_code").html(time-- + "s");
                    var timeI = setInterval(function(){
                        $("#phone_code").html((time >= 0 ? time : 0) + "s");
                        time--;
                        if(time < 0){
                            clearInterval(timeI);
                            $("#phone_code").html("获取验证码");
                        } 
                    }, 1000);
                    lib.ajx(_t.sendPhoneUrl,{verifyCode:imgVal,phone:phoneVal},function(data){
                        if(data.infocode === '3'){
                           _t.dealVerify({phone:"",img:$("#imgval"),text:data.info});
                           clearInterval(timeI);
                           time = 0;
                           $("#phone_code").html("获取验证码");
                        }else if(data.infocode !== '0'){
                           alert(data.info);
                           time = 0;
                           clearInterval(timeI);
                           $("#phone_code").html("获取验证码");
                        }
                    },function(){
                        clearInterval(timeI);
                        time = 0;
                        $("#phone_code").html("获取验证码");
                        alert("发送短信失败");
                    });
                }
          });
      },
      bindPhone:function(obj, url, rUrl, fn){
        var _t=this;
        obj.on("tap",function(){
            if($("#phoneval").prev('.login_hd_i').length > 0){
                return;
            }
            var phoneVal=$("#phoneval").val(),
                verifyCode=$("#verify_code").val();
                $(".login_hd_i").remove();
    
                if(phoneVal === "" && verifyCode === ""){
                     _t.dealVerify({phone:"",img:"",text:"请填写信息"});  
                }else{
                  bindFun();
                }
    
                function bindFun(){
                    var directId = $.cookie('maimaicn_f_id');
                    if (!directId){
                        directId = sessionStorage.mm_mId ? sessionStorage.mm_mId :　1;
                    }
                    var data = {verifyCode:verifyCode,mobile:phoneVal,directId:directId};
                    if (rUrl){
                        _t.BindPhoneUrl = lib.getReq().ser + rUrl;
                        data = {smsCode:verifyCode, phone:phoneVal};  
                   }
                    lib.ajx(_t.BindPhoneUrl, data,function(data){
                        if(data.infocode === '0'){
                            if (url)
                                location.href = url;
                            if(fn)
                                fn();
                           _t.storage.bindPhone=phoneVal;
                        }else if(data.infocode==2||data.infocode==3||data.infocode==4){
                           _t.dealVerify({phone:"",img:"",verify:$("#verify_code"),text:data.info});                           
                        }else{
                           alert(data.info);
                        }
                     },function(){
                       alert("绑定手机失败");
                    });
                }
        });
      },
      dealVerify:function(_o){
         $("input").blur();
         $(".login_form").addClass("login_form_w");
         $("#login_error").show().html(_o.text); 
          _o.phone?_o.phone.before('<i class="login_hd_i"></i>'):"";
          _o.img && _o.img.prev('.login_hd_i').length === 0 ?_o.img.before('<i class="login_hd_i"></i>'):""; 
          _o.verify?_o.verify.before('<i class="login_hd_i"></i>'):"";            
      },
      getFocus:function(){
        $("#wrapbox input").on("focus",function(){
             $("#login_error").hide();
             $(this).prev(".login_hd_i").remove();
             if($(".login_hd_i").length <= 0)
                $("#wrapbox").removeClass("login_form_w");
        });
      },
      flag: false,
      isUsing: function(flag){
          var _t = this;
          $("#phoneval").off("blur").on("blur", function(){
            $(this).prev(".login_hd_i").remove();
            var mobile = $(this).val().trim();
            var numReg = /^1[3,4,5,7,8]\d{9}$/;
            if(!numReg.test(mobile)){
                _t.dealVerify({phone:$("#phoneval"),img:"",text:"请输入正确的手机号"});
                return;
            }
            lib.ajx(lib.getReq().ser + "member/isRegisted.action", {mobile:mobile},function(data){
                if(flag){    
                    if(data.infocode === '0'){
                        _t.dealVerify({phone:$("#phoneval"),img:"",text:"该手机号不存在"});
                        _t.flag = false;
                    }else if(data.infocode === '2' || data.infocode === '3'){
                        _t.flag = true;
                    }else{
                        _t.showMessage(data.info, false);
                    }
                }else{
                    if(data.infocode === '0'){
                        _t.flag = false;
                    }else if(data.infocode === '2' || data.infocode === '3'){
                        _t.dealVerify({phone:$("#phoneval"),img:"",text:"该手机号已被使用"});
                        _t.flag = true;
                    }else{
                        _t.showMessage(data.info, false);
                    }
                }
            },function(){
               _t.dealVerify({phone:"",img:"",text:"请求失败请重试"});
            });
        });
      }
      
    });
    return bindPhone;
});

