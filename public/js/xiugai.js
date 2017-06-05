require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "log"], function($, lib, log){
    $(document).on("tap", ".login_bott .button", function(){
        new log.updatePassword($("input[name=oldPassword]"), $("input[name=newPassword]"), $("input[name=rNewPassword]")).updatePass();
    });
});