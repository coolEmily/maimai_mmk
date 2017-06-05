require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
	(function(){
			var leb = new lib();
			var Url = leb.getReq().ser;
			//正则定义
			var res={
				//密码正则
				pass:/^\w{6,18}$/
			}
			var payUrl="member/updatePass.action";
			$(".safety").on("blur","input",function () {
					if($(this).val()===""){
							$(this).parents("li").addClass("border");
							$(".message").show().text("请输入密码");
							return false;
					}
					if(!res.pass.test($(this).val())){
						$(this).parents("li").addClass("border");
						$(".message").show().text("密码是6~18位的字符、数字和下划线");
						return false;
					}
					if($(this).data("index")===2){
						if($(".formList li").eq(1).find("input").val()!==$(".formList li").eq(2).find("input").val()){
							$(this).parents("li").addClass("border");
							$(".message").show().text("两次密码请输入相同");
								$(".address").attr("index",false);
						}else{
							$(".address").attr("index",true);
						}
					}
			});
			$(".safety").on("focus","input",function () {
				if($(this).parents("li").hasClass("border")){
						$(".formList>li").removeClass("border");
						$(".message").hide();
				}
			});

			//点击按钮
			$(".address").click(function(){
				if($(".address").data("page")){
					location.href = '/buyer/login/dlzc.html';
					return false;
				}
				if($(this).attr("index") && !($(".formList li").hasClass("border"))){
					//调用ajax
					var old=$(".formList li").eq(0).find("input").val();
					var news=$(".formList li").eq(0).find("input").val();
					function successfn(data) {
							if(data.infocode=="0"){
								//执行动作
								$(".safetyIcon").css({"background":"url('/images/safetyCenter/loginPass2.png') no-repeat center center;","backgroundSize": "80%"});
								$(".formList").hide();
								$(".safetyFrom").css({"background":"url('/images/safetyCenter/win.png') no-repeat center center;","backgroundSize": "50%"});
								$(".title").css({"display":"block"});
								$(".address").data("page",true);
								$(".address").text("去登录");
							}else{
									$(".message").show().text(data.info);
									$(".formList li").addClass("border");
									$(".address").attr("index",false);
							}
					}
					//失败语句
					function errorfn() {
					}
					leb.ajx(Url+payUrl,{
						oldPass:$(".formList li").eq(0).find("input").val(),
						newPass:$(".formList li").eq(2).find("input").val()
					},successfn,errorfn);
				}


			});
			})();
});
