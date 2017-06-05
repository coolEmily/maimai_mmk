define(function(){
    var slideMethod = {};
    $.extend(slideMethod,{
        init:function(){
            var _t=this;
            _t.slideFun();
        },
        slideFun:function(){
            var _t=this;
            $.each($('.container-swiper'), function(k, v){
                if($(v).children().children(".swiper-slide").length !== 0){
                    var size=2.5;
                    if($(v).attr("size")!==""){
                        size=$(v).attr("size");
                    }
                    new Swiper("#" + $(v).attr("id"), {
                        slidesPerView:size,
                        paginationClickable: true,
                        direction: "horizontal",
                        spaceBetween: 10,
                        freeMode: true
                    });
                }
                    
            });
            
            $.each($('.container-swiper-1'), function(k, v){
                if($(v).children().children(".swiper-slide").length !== 0){
                    new Swiper("#" + $(v).attr("id"), {
                        autoplay: 5000,//可选选项，自动滑动
                        autoplayDisableOnInteraction : false,
                        loop: true,
                        pagination: "#serial_number_1"
                    });
                }
                    
            });
            
            $.each($('.swiper-container-goods'), function(k, v){
                if($(v).children().children(".swiper-slide").length !== 0){
                    new Swiper("#" + $(v).attr("id"), {
                        slidesPerView:3.5,
                        paginationClickable: true,
                        spaceBetween:10,
                        freeMode: true
                    });
                }
                
            });
            

        }
      
    });
    return slideMethod.init();
});

