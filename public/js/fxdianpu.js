require.config({baseUrl: '/js/lib',urlArgs: "v0.0.3"});
require(['zepto', 'lib', 'wxshare','wapshare'], function($, lib, wxshare,wapshare) {
    var l = new lib();
    wapshare  = new wapshare();

    var common = {"js": l, "tools": l}, reqUrl = l.getReq(), fxdianpu = {};
    $.extend(fxdianpu, {
        memberId: $.cookie("member_memberId"),
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
            
            $(".button").on("tap",function(){
                 $(".fixed").css('display','block');
            });
        },
        getMemberStoreInfo: function(){
            var _t = this;    console.log(wapshare);
            common.js.ajx(reqUrl.ser+"/member/getMemberStoreInfo.action", {}, function(data){
                if(data.infocode === "0"){
                    var headPicture = data.info.memberPicture ? reqUrl.imgPath + data.info.memberPicture : "http://m.maimaicn.com/images/MMKlogo.jpg";
                    var mallName = data.info.mallName ? data.info.mallName : data.info.nickName;
                    $(".tjian_l img").attr("src", headPicture);
                    $(".tjian_r h2").text(mallName);
                    if(l.checkWeiXin()){
                        dataForWeixin.imgUrl = headPicture;
                        dataForWeixin.title = mallName;
                        dataForWeixin.desc = "我在买买发现了一家不错的店铺，赶紧过来看看吧。";
                        dataForWeixin.link = location.protocol + "//" + location.host + "/buyer/shouye.html?mId=" + _t.memberId;
                        wxshare();
                    }
                    else{
                        wapshare.setting.pic = headPicture;
                        wapshare.setting.title = mallName;
                        wapshare.setting.summary = "我在买买发现了一家不错的店铺，赶紧过来看看吧。";
                        wapshare.setting.url = location.protocol + "//" + location.host + "/buyer/shouye.html?mId=" + _t.memberId;
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
    fxdianpu.init();
});