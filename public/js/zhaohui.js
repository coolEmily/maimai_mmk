require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "phone_code"], function($, lib, bindPhone){
    bindPhone.init();
    bindPhone.bindPhone($("#bindPhone"), "xinmima.html", "member/getBackPass_checkSmsCode.action");
    bindPhone.isUsing(true);
});