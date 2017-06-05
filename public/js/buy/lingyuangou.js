require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "log" , 'wxshare', 'wxReg', 'visitor-logs'], function($, lib, log ,wxshare, wxReg, vl){
    var lingyuangou = {}, lib = new lib(), gImg = '';
    $.extend(lingyuangou, {
        activeId: lib.getUrlParam("acId"),
        goodsId: lib.getUrlParam("gId"),
        init: function(){
            var _t = this;
            _t.getGoodsInfo();
            _t.bindEvent();
            sessionStorage.mm_mId = lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1;
            $("#ui-new-goods a").attr("href", "lingyuangouzq.html?activeId=" + _t.activeId + "&mId=" + sessionStorage.mm_mId);
            vl.setLog(window.location.href, 2);//会员访问日志
            setTimeout(function () {
                _t.setWxShare();
            }, 1000);
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", "img#ui-lingyuangou", function(){
                _t.goodsId = $(this).attr("data-goodsId");
                _t.toBalanceForFree();
            });
        },
        getGoodsInfo: function(){
            var _t = this;
           lib.ajx(lib.getReq().ser + "shoppingCart/getGoodsForFree.action", {'activeId': _t.activeId}, function(data){
                if(data.infocode === "0"){
                    gImg = lib.getReq().imgPath + data.info.descImg;
                    _t.goodsId = data.info.mainGoodsId;
                    $("body").append('<img id="ui-lingyuangou" data-goodsId="'+ _t.goodsId +'" style="width: 100%;max-width:640px" src='+ gImg +' />');
                }else{
                    if(lib.checkWeiXin() && data.infocode === "1")
                        wxReg.reg(sessionStorage.mm_mId, _t.goodsId, _t.activeId);
                    else{
                        alert(data.info);
                    }
                }
            }, function(){
                alert("数据请求失败")
            })
        },
        toBalanceForFree: function(){
            var _t = this;
            if(lib.checkWeiXin() && (!$.cookie("member_loginName") ||  $.cookie("member_loginName").length !== 11)){
                location = "/login/bangding.html?backUrl=" + lib.getBackUrl();
                return;
            }
            location.href = "/g?mId=" + sessionStorage.mm_mId + "&gId=" + _t.goodsId + "&acId=" + _t.activeId;
            /*lib.ajx(lib.getReq().ser + "shoppingCart/toBalanceForFree.action", {activeId: _t.activeId, goodsId: _t.goodsId}, function(data){
                if(data.infocode === '0'){
                    location.href = "/buyer/order/dingdanqr_n.html?acId=" + _t.activeId + "&gId=" + _t.goodsId;
                }else{
                    alert(data.info);
                    if(data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                }
            });*/
        },
        setWxShare: function () {
            if (lib.checkWeiXin()) {
                var _t = this;
                var memberId = $.cookie("member_memberId");
                var memberTypeId = $.cookie("member_memberTypeId");
                if(!memberTypeId){
                    memberId = lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1;
                }else if (Number(memberTypeId) < 2) {
                    memberId = 1;
                }
                dataForWeixin.imgUrl = gImg;
                dataForWeixin.title = "面膜0元购 - 无需砍价-买买";
                dataForWeixin.desc = "生活用品0元既得，无需砍价，推荐给你赶紧来订";
                dataForWeixin.link = location.protocol + "//" + location.host + "/buyer/lingyuangou.html?acId="+_t.activeId+"&gId=" + _t.goodsId+"&mId="+memberId;
                wxshare();
            }
        }
    });
    lingyuangou.init();
});