//name:微信自动注册js,param:会员ID(无ID传'0')、商品ID(无ID传'0'),return:none,author:lichengyu,Date:20160516
define(['lib'], function (lib) {
    lib = new lib();
    return {
        reg: function (mId, gId, activityId, type) {
            if (lib.checkWeiXin()) {//是否为微信浏览器
                if (!$.cookie('member_loginName') || !$.cookie('member_memberId')) {//是否没有登陆状态
                    var domain = location.protocol + "//" + location.host;
                    var appid = lib.getReq().appid;
                    var base = "snsapi_base";
                    var pathname = location.pathname;
                    if(lib.getIsOnline()){
                        domain = 'http://m.maimaicn.com';
                    }
                    if (type) {
                        base = "snsapi_userinfo";
                        //domain = 'http://wximg.gtimg.com';
                        pathname = '/buyer/wxshake_main.html';
                    }
                    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid +
                        '&redirect_uri='+lib.getReq().ser+'member/wxAccredit.action' +
                        '&response_type=code&scope='+base +
                        '&state=' + domain + pathname;
                    mId = $.cookie('maimaicn_f_id') || mId;
                    if (!mId || mId == '0') mId = '1';
                    url += '^mId=' + mId;
                    if (gId != '0' && gId != '') url += '^gId=' + gId;
                    if (activityId) url += '^acId=' + activityId;
                    url += '#wechat_redirect';
                    location.href = url
                }else{
                    var isFollowMaimai = lib.getUrlParam('subscribe');
                    if(isFollowMaimai == '0'){
                        console.log('no follow maimaicn');
                        //弹出二维码
                    }
                }
            }
        }
    };
});