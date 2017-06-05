require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
  var _htmlFontSize = function(){
    var clientWidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
    if(clientWidth > 750) clientWidth = 750;
    document.documentElement.style.fontSize = clientWidth * 1/15+"px";
    document.body.style.display = "block"
  };
  _htmlFontSize();
  window.onresize = function(){
    _htmlFontSize();
  }
  lib = new lib();
  var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanzhifucg = {};
  $.extend(dingdanzhifucg, {
    orderInfo: JSON.parse(sessionStorage.orderInfo),
    init: function(){
      var _t = this;
      if(_t.sId ==  "425160"){
        $("a:contains(关注买买)").text("关注天视商城");
        $("li:contains(买买电商官方公众号)").next().children().attr("src", "/images/buy/tianshishangcheng.jpg");
        $("li:contains(买买电商官方公众号)").text("天视商城官方公众号");
        $("a:contains(下载买买电商APP)").attr("href", "http://a.app.qq.com/o/simple.jsp?pkgname=com.maimaicn.tianshi").text("下载天视商城APP");
      }
      if(!lib.checkMobile()){
        if(location.href.indexOf("m.maimaicn.com") > -1){
          location.href = "http://www.maimaicn.com/order/paysucc.html";
          return;
        }else{
          location.href = "http://pc.maimaicn.com/order/paysucc.html";
          return;
        }
      }
      $(".ui-go-index").attr('href', '/tv/sl_index.html?activeMissVoteTypeId=' + _t.orderInfo.orderType);
      if(_t.orderInfo.orderType === 3){
        $(".ui-order-desc").text("赠送选手"+ _t.orderInfo.playerNo + _t.orderInfo.playerName + _t.orderInfo.flowerNum +"朵鲜花,获得红包" + _t.orderInfo.redValue + "元");
      }else{
        $(".ui-order-desc").text("赠送选手"+ _t.orderInfo.playerNo + _t.orderInfo.playerName + _t.orderInfo.flowerNum +"朵鲜花");
      }
      $(".ui-order-id").text("订单编号: "+ _t.orderInfo.orderNo)
      $(".ui-other-op").html('<li><a href="/buyer/order/dingdan.html">查看订单详情</a></li><li><a href="/tv/sl_buy_flower.html?activeMissVoteTypeId='+ _t.orderInfo.orderType +'&activeMissVotePlayerId='+ _t.orderInfo.playerId +'">继续送花</a></li><li><a href="/tv/sl_shop.html?activeMissVoteTypeId='+ _t.orderInfo.orderType +'&activeMissVotePlayerId='+ _t.orderInfo.playerId +'">逛逛商城</a></li>')
    }
  });
  dingdanzhifucg.init();
});