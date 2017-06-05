require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "log"], function($, lib, log){
    $(document).on("tap", ".login_bott .button", function(){
        new log.resetPassword($("input[name=password]"), $("input[name=rpassword]")).resetPass(null, 'denglu.html');
    });
});