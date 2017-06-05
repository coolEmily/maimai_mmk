requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib'], function ($,lib) {
	lib = new lib();
	if(lib.getUrlParam("payPath")){
		$(".ui-oneKey-buy").attr("href", lib.getUrlParam("payPath"));
		return;
	}
	if(lib.checkWeiXin()){
		var dUrl = lib.getIsOnline() ? "http://m.maimaicn.com/login/bangding.html" : "http://"+location.host+"/login/bangding.html";
		var redirect_uri = lib.getReq().ser+'member/wxAccredit.action';
		var appid = lib.getReq().appid;
		var param = "^directId="+ (lib.getUrlParam("mId") && "null" !== lib.getUrlParam("mId")  ? lib.getUrlParam("mId") : 1) + "^upgradeTypeId="+ (lib.getUrlParam("upgradeTypeId") ? lib.getUrlParam("upgradeTypeId") : 0);
		if(location.pathname.indexOf("yaoqingdk") > -1){
			param = "^directId="+ (lib.getUrlParam("mId") && "null" !== lib.getUrlParam("mId")  ? lib.getUrlParam("mId") : 1)  + "^upgradeTypeId="+ (lib.getUrlParam("upgradeTypeId") ? lib.getUrlParam("upgradeTypeId") : 2);
		}
		$(".ui-oneKey-buy").attr("href", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri="+ redirect_uri +"&response_type=code&scope=snsapi_userinfo&state="+ dUrl + param + "#wechat_redirect");
	}else{
		$(".ui-oneKey-buy").attr("href", "/login/bangding.html?directId=" + (lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1) + "&upgradeTypeId="+ (lib.getUrlParam("upgradeTypeId") ? lib.getUrlParam("upgradeTypeId") : 0));
		if(location.pathname.indexOf("yaoqingdk") > -1){
			$(".ui-oneKey-buy").attr("href", "/login/bangding.html?directId=" + (lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1) + "&upgradeTypeId="+ (lib.getUrlParam("upgradeTypeId") ? lib.getUrlParam("upgradeTypeId") : 2));
		}
	}
});
