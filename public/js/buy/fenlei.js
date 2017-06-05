require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1",paths:{swiper: "swiper.min"}});
require(['zepto', 'lib', "swiper"], function($, lib){
  lib = new lib();
  lib.fixedFooter(1);
  var sort = {}, sTP, eTP, leftSwiper, rightSwiper;
    $.extend(sort, {
      mId: $.cookie("maimaicn_s_id") ? $.cookie("maimaicn_s_id") : 1,
      sl: 1,
      cH: document.documentElement.clientHeight || document.body.clientHeight,
      init: function(){
        var _t = this;
        
       _t.getClassInfoMember(); //加载一级分类
       _t.bindEvent(); //
      },
      bindEvent: function(){
        var _t = this;
        $("#ui-left-type").on("tap", "#ui-goods-type > div:not(.active)", function(){
          if(sTP === eTP){
            $(this).addClass("active").siblings().removeClass("active");
            _t.getClassInfoMemberAll(); //加载二级分类
          }
        });
      },
      getClassInfoMember: function(){
        var _t = this, data = _t.mId ? {memberId: _t.mId} : {};
        lib.ajx(lib.getReq().ser + 'goodsClass/getClassInfoMember.action', data, function(data){
          if(data.infocode === "0"){
            var h = "";
            _t.sl = data.info.list_goodsClass.length;
            if(data.info.list_goodsClass.length < 5){
              $.each(data.info.list_goodsClass, function(k, v) {
                h += '<div data-class="'+ v.classId +'" class="swiper-slide '+ (k == 0 && 'active') + ' ui-col">'+ v.className +'</div>';
              });
              $(".ui-body").css("height", (_t.cH - 90) + 'px');
              $("#ui-left-type").css({"width": "100%",'min-height': "40px"});
              $("#ui-goods-type").append(h);
              leftSwiper = new Swiper('#ui-left-type', {
                freeMode : true,
                slidesPerView : data.info.list_goodsClass.length,
                onTouchStart: function(swiper){
                    sTP = swiper.translate;
                },
                onTouchEnd: function(swiper){
                    eTP = swiper.translate;
                }
              });
              
              data.info.list_goodsClass.length === 1 && $("#ui-left-type").hide();
            }else{
              $.each(data.info.list_goodsClass, function(k, v) {
                h += '<div data-class="'+ v.classId +'" class="swiper-slide '+ (k == 0 && 'active') +'">'+ v.className +'</div>';
              });
              $(".ui-body, #ui-left-type").css("height", (_t.cH - 90) + 'px');
              $("#ui-goods-type").append(h);
              leftSwiper = new Swiper('#ui-left-type', {
                direction: 'vertical',
                freeMode : true,
                slidesPerView : 'auto',
                onTouchStart: function(swiper){
                    sTP = swiper.translate;
                },
                onTouchEnd: function(swiper){
                    eTP = swiper.translate;
                }
              });
              
            }
            
            _t.getClassInfoMemberAll(); //加载二级分类
          }else{
            alert(data.info);
          }
        }, _t.errorFN);
        
      },
      getClassInfoMemberAll: function(){
        var _t = this, h = '', data = _t.mId ? {memberId: _t.mId, classId: $("#ui-left-type .active").attr("data-class")} : {classId: $("#ui-left-type .active").attr("data-class")};
        lib.ajx(lib.getReq().ser + 'goodsClass/getClassInfoMemberAll.action', data, function(data){
          if(data.infocode === "0"){
            $.each(data.info.list_goodsClass, function(K, V){
              if(_t.sl > 4){
                h += "<div><p style='background-color:#f1f1f1'>"+ V.className +"</p><div>";
                $("#ui-right-detail").css("height", (_t.cH - 90) + 'px');
              }else{
                h += "<div><p style='line-height: 1.6rem;text-align:center;color:#ff3c3c;border-bottom:1px solid #f1f1f1;margin-top:10px;'><i class='ui-hua'>"+ V.className +"</i></p><div class='" + (_t.sl < 5 ? 'ui-col-4-div' : '')  + "'>";
                $("#ui-right-detail").css({"padding": "0","width":"100%"});
                
                
                _t.sl === 1 ? $("#ui-right-detail").css("height", (_t.cH - 50) + 'px') : $("#ui-right-detail").css("height", (_t.cH - 130) + 'px');;
              }
              $.each(V.classTwo, function(k, v){
                h += '<a href="liebiao.html?id='+ v.classId +'" class="'+ (_t.sl < 5 ? 'ui-col-4' : '') +'"><img src="http://image.maimaicn.com/'+ (v.classPicture ? v.classPicture : 'png/20160418/default/162240468618484') +'"><p>'+ v.className +'</p></a>';
              });
              h += "<div style='clear:both'></div></div></div>";
            });
            
            $("#ui-goods-list").html(h);
            if(!rightSwiper) rightSwiper = new Swiper('#ui-right-detail', {direction: 'vertical',freeMode : true,slidesPerView : 'auto',onTouchStart:function(swiper){swiper.onResize()}});
            rightSwiper.onResize();
            rightSwiper.slideTo(0, 500);
          }else{
            alert(data.info);
          }
        }, _t.errorFN);
      },
      errorFN: function(){
        alert("请求失败");
      }
    });
   
  sort.init();
  var _htmlFontSize = function(){
      var clientWidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
      if(clientWidth > 750) clientWidth = 750;
      document.documentElement.style.fontSize = clientWidth * 1/15+"px";
      return clientWidth * 1/16;
  };
  _htmlFontSize();
  window.onresize = function(){
    _htmlFontSize();
    console.log('here')
  }
});