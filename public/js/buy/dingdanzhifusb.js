require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    
    if(!lib.checkMobile()){
        if(location.href.indexOf("m.maimaicn.com") > -1){
            location.href = "http://www.maimaicn.com/order/payfail.html";
            return;
        }else{
            location.href = "http://pc.maimaicn.com/order/payfail.html";
            return;
        }
    }
    
    $("#pay_err").show();
    $(".bott40").show();
    var error_mess = lib.getUrlParam('error_mess');
    if(error_mess){
        $('#pay_err').append('订单支付失败（' + error_mess + '）');
    }else{
        $('#pay_err').append('订单支付失败（网络出错）');
    }
});