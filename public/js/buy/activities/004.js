require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib','visitor-logs','swiper', 'lazyLoad'], function($, lib, vl, swiper){
    lib = new lib();
    var tabsSwiper;
    $(function(){
      vl.setLog(window.location.href, 2);//会员访问日志
      var h = (document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth )/ 750 * 2765 + 44;
      var _scrollTop = Number(sessionStorage.scrollTop);
      $("img.lazy").lazyload({skip_invisible:false,threshold:10,effect:"fadeIn",effectspeed:500});
      
      var mySwiper = new Swiper('.swiper-nav', {
        freeMode : true,
        slidesPerView: 3,
      })
      
      
      tabsSwiper = new Swiper('#tabs-container',{
        speed:500,
        onSlideChangeStart: function(){
          $(".swiper-nav span").css({'border-bottom-color': "white",color: "#333"});
          $(".swiper-nav span").eq(tabsSwiper.activeIndex).css({'border-bottom-color': $(".swiper-nav span").eq(tabsSwiper.activeIndex).attr("data-color"),color: $(".swiper-nav span").eq(tabsSwiper.activeIndex).attr("data-color")});
          sessionStorage.activeIndex = tabsSwiper.activeIndex;
        },
        onSlideChangeEnd: function(swiper){
          $("img.lazy").show().lazyload();
          $(window).scrollTop(h);
        }
      })
      tabsSwiper.params.control = mySwiper;
      
      $(".swiper-nav span").on('touchstart mousedown',function(e){
        if($(this).parent().index() === 8){
          location.href="/buyer/hongbaoshangpin.html";
          return;
        }
        e.preventDefault();
        $(".swiper-nav span").css({'border-bottom-color': "white",color: "#333"});
        $(this).css({'border-bottom-color': $(this).attr("data-color"),color: $(this).attr("data-color")});
        tabsSwiper.slideTo( $(this).parent().index() );
      })
      $(".tabs a").click(function(e){
        e.preventDefault();
      })
      
      $(window).scroll(function(){
        if(window.sessionStorage){
          sessionStorage.scrollTop = $(window).scrollTop();
        }
        if($(window).scrollTop() >= h){
          $(".swiper-nav").css("position","fixed");
          $(".ui-null-d").length || $(".swiper-nav").after("<div class='ui-null-d' style='height:40px'></div>");
        }else{
          $(".ui-null-d").length && $(".ui-null-d").remove();
          $(".swiper-nav").css("position","relative");
        }
      });
    
    sessionStorage.activeIndex && tabsSwiper.slideTo( Number(sessionStorage.activeIndex) );
    setTimeout(function(){
      if(window.sessionStorage){
        sessionStorage.scrollTop && ($(window).scrollTop(_scrollTop));
      }
    }, 1000)
    
	 });
	
});
