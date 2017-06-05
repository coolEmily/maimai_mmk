require.config({baseUrl: '../js/lib'});
require(['zepto', 'lib', "log"], function($, lib, log){
    lib = new lib();
    var login1 = new log.login($("input[name=userName]"), $("input[name=password]"));
    //showResult.isUsing(login1, $("input[name=userName]"), true);
    $(document).on("tap", ".login_bott .button", function(){
        login1.login(lib.getUrlParam("backUrl")? lib.getUrlParam("backUrl") : "/mjzhongxin.html");
    });
});