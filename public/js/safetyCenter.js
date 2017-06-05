require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
	var this_=this;
	var leb = new lib();
	var Url = leb.getReq().ser;
//对象
function Safety_center() {
	this.payUrl="/memberCenter/isSetPayPass.action";//验证是否设置验证码
	this.getBindMobile='/member/getBindMobile.action';//获取当前登录用户绑定的手机号
 //执行语句
	this.run=function(){
			//成功语句
			function successfn(data) {
					if(data.infocode=="0"){
							$(".enterText:eq(1)").text("修改");
							$(".enterText:eq(1)").addClass("qiyong");
					}else if(data.infocode=="3"){
								$(".enterText:eq(1)").text("未设置");

					}else if(data.infocode=="2"){
							window.location.href='/member/login.html?backUrl=' + leb.getBackUrl();
					}
			}
			//失败语句
			function errorfn() {
			}
			leb.ajx(Url+this.payUrl,{},successfn,errorfn);
	};
//判断手机是否绑定
this.init=function(){
		//成功语句
			function successfn(data) {
					if(data.infocode=="3"){
							$(".enterText:eq(2)").text("未绑定");
							$(".enterText:eq(2)").addClass("bangding");
					}
			}
			//失败语句
			function errorfn() {
			}
			leb.ajx(Url+this.getBindMobile,{},successfn,errorfn);



}


	//点击事件
	this.clickHref=function(){
		$(".list>li:eq(1)").click(function(){
				if($(this).find(".list_right .enterText").hasClass("qiyong")){
						window.location.href="/buyer/home/payPass.html?qiyong=1";
				}else{
						window.location.href="/buyer/home/payPass.html?qiyong=0";
				}
		});
		$(".list>li:eq(0)").click(function(){
						window.location.href="/buyer/home/loginPass.html";
		});
		$(".list>li:eq(2)").click(function(){
			if($(this).find(".list_right .enterText").hasClass("bangding")){
				window.location.href="/login/bangding.html";
			}else{
				window.location.href="/buyer/home/phoneSurport.html";
			}
					
		});
		$(".back _goback").click(function(){
			 window.history.go(-1);
		})
	};
}
//执行构造函数
var payer= new Safety_center;
payer.run();
payer.init();
payer.clickHref();
});
