require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
	var lib = new lib();
	var pay={
		init:function(){			
			this.getPhone();//获取手机号
			this.getCode();//获取验证码
			this.getCodeT();//获取验证码
			this.getFocus();//input获得焦点的时候
			this.getNext();//下一步
			this.getCodeImg();//获取图片验证码
			this.Succfinish();//完成
			this.Succlogin();//登录
		},
		//获取手机号
		getPhone:function(){
			lib.ajx(lib.getReq().ser + "/member/getBindMobile.action",{},function(data){
				if(data.infocode=="0"){
					$(".change_p .p3").html(data.info);
				}else if(data.infocode=="2"){
					location.href="/buyer/login/dlzc.html?backUrl="+lib.getBackUrl();
					
				}else if(data.infocode=="3"){
					alert("您还没有绑定手机号");
					location.href="/login/bangding.html";
				}else{
					alert(data.info);
				}
			},function(data){
				console.log(data.info);
			});
		},
		//获取短信验证码
		getCode:function(){
			_t = this;
			$("#get_btn").off().on("tap",function(){	
				if(!$("#get_btn").data("book")){
					alert(1);
		            return false;
		        }
	           lib.ajx(lib.getReq().ser + "/verifyCode/sendSmsCodeForLoginMem.action",{},function(data){
	           		if(data.infocode=="0"){
	           			$("#get_btn").data("book",false);
	           			$("#change_mess").show(); 
	           			$("#next_btn").removeClass("next_btn_h");
	           			var timer = null;
	           			clearTimeout(timer);
	           			timer = setTimeout(function(){
	           				$("#change_mess").hide(); 
	           			},2000);
		               timeOut();
	           		}else if(data.infocode=="1"){
	           			$("#message").show().html("短信验证码发送失败");
	           			$("#next_btn").addClass("next_btn_h");
	           		}else if(data.infocode=="2" || data.infocode=="3" || data.infocode=="6"){
	           			$("#message").show().html(data.info);
	           			$("#next_btn").addClass("next_btn_h");
	           		}else if(data.infocode=="4"){
	           			location.href="/buyer/login/dlzc.html?backUrl="+lib.getBackUrl();
	           		}else if(data.infocode=="5"){
	           			$("#message").show().html("您还没有绑定手机号");
	           			location.href="/buyer/login/bangding.html";
	           		}
	           },function(data){
					console.log(data.info);
				});
               var buttonObj=$("#get_btn"),
                second=120,
                time_out="";
                function timeOut(){
                	$("#get_btn").data("book",false);
                    second--;
                    buttonObj.addClass("get_btn_h");
                    buttonObj.html(second + "s");
                    if(second > 0){
                        _t.time_out = setTimeout(timeOut, 1000);
                    }else{
                        buttonObj.removeClass("get_btn_h");
                        $("#message").html();
                        buttonObj.html("获取校验码");
                        second = 120;
                        $("#get_btn").data("book",true);
                    }
                }
            });
		},
		
		//下一步
		getNext:function(){
			$("#next_btn").off().on("tap",function(){
				var smsCode = $("#get_txt").val();
				lib.ajx(lib.getReq().ser + "/verifyCode/checkSmsCodeForLogin.action",{smsCode:smsCode},function(data){
					if(data.infocode=="0"){
						$("#next_btn").data("token",data.info);
						$(".old_change").hide();
						$(".new_change").show();
					}else if(data.infocode=="5"){
						location.href="/buyer/login/dlzc.html?backUrl="+lib.getBackUrl();						
					}else{
						$("#message").html("手机验证码不正确，请重新输入");
						$("#next_btn").addClass("next_btn_h");
						$("#imgNum").trigger('tap');
					}
				},function(data){
					console.log(data.info);
				});
			});
		},
		//input获得焦点的时候
		getFocus:function(){
			$("#get_txt").on("focus",function(){
                $("#message").html("");
                $("#next_btn").removeClass("next_btn_h");
           });
		},
        //获取图片验证码
        getCodeImg:function(){
            $("#imgNum").attr("src",lib.getReq().ser+"/verifyCode/getImage.action?timestamp="+new Date().getTime());
            $("#imgNum").on("tap",function(){
                $(this).attr("src",lib.getReq().ser+"/verifyCode/getImage.action?timestamp="+new Date().getTime());
            });
        },

        //获取短信验证码
		getCodeT:function(){
			_t = this;									
			$("#get_phone").on("focus",function(){
                $("#phone_error").html("");
		         $("#gt").hide();
            });
            $("#get_code").on("focus",function(){
                $("#code_error").html("");
            });
            $("#succ_txt").on("focus",function(){
                $("#succ_finish").removeClass("next_btn_h");
                $("#succ_mess").html("");
            });
            $("#get_phone").on("blur",function(){
            	var numReg = /^1[3,4,5,7,8]\d{9}$/,
		            phoneVal=$("#get_phone").val();
            	if(phoneVal === "" || !numReg.test(phoneVal)){		        	
		            $("#phone_error").html("手机号格式错误，请重新输入");
		            $("#gt").show();
		            return;
		        }
            });
			
			$("#succ_btn").off().on("tap",function(){	
				
				var numReg = /^1[3,4,5,7,8]\d{9}$/,
		            phoneVal=$("#get_phone").val(),
	            	imgVal=$("#get_code").val();
		        if(phoneVal === "" || !numReg.test(phoneVal)){		        	
		            $("#phone_error").html("手机号格式错误，请重新输入");
		            $("#gt").show();
		            return;
		        }else if(imgVal === ""){
		            $("#code_error").html("图形验证码错误，请重新输入");
		            return;
		        }
				if(!$("#succ_btn").data("book")){
		            return false;
		        }
	           lib.ajx(lib.getReq().ser + "/verifyCode/sendSmsCode.action",{verifyCode:imgVal,phone:phoneVal},function(data){
		           	
	           		if(data.infocode=="0"){
	           			$("#succ_btn").data("book",false);
	           			$("#succ_finish").removeClass("next_btn_h");
	           			$("#new_error").css("display","block"); 
	           			var timer = null;
	           			clearTimeout(timer);
	           			timer = setTimeout(function(){
	           				$("#new_error").css("display","none"); 
	           			},2000);
		               timeOut();
	           		}else if(data.infocode=="2" || data.infocode=="3"){
	           			$("#succ_finish").addClass("next_btn_h");
	           			$("#code_error").html("图形验证码错误，请重新输入");
	           			$("#imgNum").trigger('tap');
	           		}else{
	           			$("#succ_mess").html(data.info);
	           			$("#succ_finish").addClass("next_btn_h");
	           		}
	           },function(data){
					console.log(data.info);
				});
               var buttonObj=$("#succ_btn"),
                second=120,
                time_out="";
                function timeOut(){
                    second--;
                    buttonObj.addClass("get_btn_h");
                    buttonObj.html(second + "s");
                    if(second > 0){
                        _t.time_out = setTimeout(timeOut, 1000);
                    }else{
                        buttonObj.removeClass("get_btn_h");
                        buttonObj.html("获取校验码");
                        $("#succ_btn").data("book",true);
                        second = 120;
                    }
                }
            });
		},
        //完成
        Succfinish:function(){
        	$("#succ_finish").on("tap",function(){
        		var smsCode = $("#succ_txt").val(),
        			token = $("#next_btn").data("token"),
        			mobile = $("#get_phone").val();
        		lib.ajx(lib.getReq().ser + "/memberCenter/updateBindMobile.action",{smsCode:smsCode,token:token,mobile:mobile},function(data){
        			if(data.infocode=="0"){
        				$(".new_change").hide();
        				$(".succ_login").show();
        			}else if(data.infocode=="2"){
        				location.href="/buyer/login/dlzc.html?backUrl="+lib.getBackUrl();	
        			}else if(data.infocode=="5"){
        				$("#succ_mess").html("手机验证码不正确，请重新输入");
        				$("#succ_finish").addClass("next_btn_h");
        			}else{
        				$("#succ_mess").html(data.info);
        				$("#succ_finish").addClass("next_btn_h");
        			}
        		},function(data){
					console.log(data.info);
				});
        	});
        },
        //登录
        Succlogin:function(){
        	$("#succ_login").on("tap",function(){
        		location.href="/buyer/login/dlzc.html";
        	});
        }
	}
	pay.init();
});
