define(function($){
  $ = require('zepto');
  lib = require('lib');
  lib = new lib();
  var wx = require("http://res.wx.qq.com/open/js/jweixin-1.0.0.js");
  window.dataForWeixin={
    appId: "",
    imgUrl: location.protocol + "//" + location.host + "/images/MMKlogo.jpg",
    TLImg:"",
    link: location.protocol + "//" + location.host + "/buyer/shouye.html?mId=" + $.cookie("member_memberId") ? $.cookie("member_memberId") : 1,
    title: "买买",
    desc: "买买",
    dataUrl: '',
    type: 'link',
    timestamp: '',
    nonceStr: "",
    url: window.location.href,
    signature: '',
    callbackSucc:function(){},
    callbackCancel:function(){},
  };
  function shareInit(callBack){
    (function(callBack){
      $.ajax({
        type: "get",
        async: false,
        url: lib.getReq().ser+"wxjssdk/getSignature.action",
        data: {url:dataForWeixin.url},
        dataType: "jsonp",
        jsonp: "jsonpCallback",
        success: function(data){
          callBack();
          if(data.infocode == "0"){
            dataForWeixin.signature = data.info.signature;
            dataForWeixin.appId = data.info.appId;
            dataForWeixin.nonceStr = data.info.noncestr;
            dataForWeixin.timestamp = data.info.timestamp;
            dataForWeixin.url = 'http://m.maimaicn.com?mId=' + $.cookie("member_memberId") ? $.cookie("member_memberId") : 1;
          }else{
            alert("微信分享初始化失败");
          }
        },
        error: function (e) {
          callBack();
          alert("微信分享初始化失败");
        }
      });
    })(callBack);
  
  }
    
  shareInit.prototype.shareConfig = function(){
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: dataForWeixin.appId, // 必填，公众号的唯一标识
        timestamp: dataForWeixin.timestamp, // 必填，生成签名的时间戳
        nonceStr: dataForWeixin.nonceStr, // 必填，生成签名的随机串
        signature: dataForWeixin.signature,// 必填，签名，见附录1
        jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    
    wx.ready(function(){
      //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      wx.onMenuShareTimeline({
        title: dataForWeixin.title, // 分享标题
        link: dataForWeixin.link, // 分享链接
        imgUrl: dataForWeixin.imgUrl, // 分享图标
        success: function () { 
          dataForWeixin.callbackSucc();
        },
        cancel: function () { 
          dataForWeixin.callbackCancel();
        }
      });
        
      //获取“分享给朋友”按钮点击状态及自定义分享内容接口
      wx.onMenuShareAppMessage({
        title: dataForWeixin.title, // 分享标题
        desc: dataForWeixin.desc, // 分享描述
        link: dataForWeixin.link, // 分享链接
        imgUrl: dataForWeixin.imgUrl, // 分享图标
        type: dataForWeixin.type, // 分享类型,music、video或link，不填默认为link
        dataUrl: dataForWeixin.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          dataForWeixin.callbackSucc();
        },
        cancel: function () { 
          dataForWeixin.callbackCancel();
        }
      });
        
      //获取“分享到QQ”按钮点击状态及自定义分享内容接口
      wx.onMenuShareQQ({
        title: dataForWeixin.title, // 分享标题
        desc: dataForWeixin.desc, // 分享描述
        link: dataForWeixin.link, // 分享链接
        imgUrl: dataForWeixin.imgUrl, // 分享图标
        success: function () { 
          dataForWeixin.callbackSucc();
        },
        cancel: function () { 
          dataForWeixin.callbackCancel();
        }
      });
      
       //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口

      wx.onMenuShareQZone({
        title: dataForWeixin.title, // 分享标题
        desc: dataForWeixin.desc, // 分享描述
        link: dataForWeixin.link, // 分享链接
        imgUrl: dataForWeixin.imgUrl, // 分享图标
        success: function () { 
          dataForWeixin.callbackSucc();
        },
        cancel: function () { 
          dataForWeixin.callbackCancel();
        }
      });

    });
  }
  return shareInit;
});

