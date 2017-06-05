require.config({baseUrl: '/js/lib',urlArgs: "v0.0.4"});
require(['zepto', 'lib', 'wxshare','wapshare'], function($, lib, wxshare,wapshare) {
    var l = new lib();
    wapshare  = new wapshare();
    var common = {"js": l, "tools": l}, reqUrl = l.getReq(), yqmaika = {};
    $.extend(yqmaika, {
        memberId: $.cookie("member_memberId") ? $.cookie("member_memberId") : 1,
        init: function(){
        	l.onLoading();
            var _t = this;
            _t.bindEvent();
            _t.getMemberStoreInfo();
        },
        bindEvent: function(){
            var _t = this;
            $(".fixed").on("tap",function(){
                $(".fixed").css('display','none');
            });
            
            $(".tjian_btn").on("tap",function(){
                $(".fixed").css('display','block');
            });
        },
        getMemberStoreInfo: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser+"/member/getMemberStoreInfo.action", {}, function(data){
                if(data.infocode === "0"){
                    var headPicture = data.info.memberPicture ? reqUrl.imgPath + data.info.memberPicture : "http://m.maimaicn.com/images/MMKlogo.jpg";
                    $(".tjian_mmk img").attr("src", headPicture);
                    if(l.checkWeiXin()){
                        dataForWeixin.imgUrl = headPicture;
                        if(location.pathname.indexOf("yqmaika") > -1){
                            dataForWeixin.title = "诚邀买咖";
                            dataForWeixin.desc = "让资源动起来才叫资源。让资源变现才叫资源。加入买咖日赚3000，不是问题。";
                            dataForWeixin.link = location.protocol + "//" + location.host + "/login/yaoqing.html?mId=" + _t.memberId + "&upgradeTypeId=0";
                        }else{
                            dataForWeixin.title = "诚邀买买大咖";
                            dataForWeixin.desc = "让资源动起来才叫资源。让资源变现才叫资源。升级大咖，秒赚10000，不是问题。";
                            dataForWeixin.link = location.protocol + "//" + location.host + "/login/yaoqingdk.html?mId=" + _t.memberId + "&upgradeTypeId=2";
                        }

                        wxshare();
                    }
                    else{
                        wapshare.setting.pic = headPicture;
                        if(location.pathname.indexOf("yqmaika") > -1){
                            wapshare.setting.title = "诚邀买咖";
                            wapshare.setting.summary = "让资源动起来才叫资源。让资源变现才叫资源。加入买咖日赚3000，不是问题。";
                            wapshare.setting.url = location.protocol + "//" + location.host + "/login/yaoqing.html?mId=" + _t.memberId + "&upgradeTypeId=0";
                        }else{
                            wapshare.setting.title = "诚邀买买大咖";
                            wapshare.setting.summary = "让资源动起来才叫资源。让资源变现才叫资源。升级大咖，秒赚10000，不是问题。";
                            wapshare.setting.url = location.protocol + "//" + location.host + "/login/yaoqingdk.html?mId=" + _t.memberId + "&upgradeTypeId=2";
                        }
                        wapshare.loadScript();
                    }

                }else{
                    alert(data.info);
                    if(data.infocode === "2") location.href="/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            },function(){
                
            });
        }
    });
    yqmaika.init();
});