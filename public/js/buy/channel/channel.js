require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib','visitor-logs' , "wxReg" , "swiper"], function($, lib, vl, wxReg){
    lib = new lib();
    require(['slideMethod', "goodsListModal"]);
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), index = {};
    $.extend(index, {
        adLocationId: [1,2,5,6,7,8,3],
        slider1: "",
        slider: "",
        init: function(){
                        var Oheight=$("body").height()/2;
            this.searchFN(Oheight);//搜索
            this.sliderFN(); //轮播图滚动
                        this.click();//回到顶部
        },
        searchFN:function(Oheight){
            $(document).on("tap", ".ind_search_r", function(){
                searchFun();
           });
            $("#searchForm").on("submit",function(){
                searchFun();
            });
            function searchFun(){
                if($(".ind_search_cen input").val().trim() === ""){
                    alert("请输入搜索关键字");
                    return;
                }
                location.href = "/buyer/liebiao.html?goodsKeywords="+$(".ind_search_cen input").val().trim();
            }
            var scltop=$(".ind_search").offset() && $(".ind_search").offset().top;
            $(window).on("scroll",function () {
							if($(this).scrollTop()>Oheight){
									$("#return_top").css({"opacity":1});
							}else{
									$("#return_top").css({"opacity":0});
							}
                            //*********************
                if(!( scltop>$(this).scrollTop())){
                    $(".ind_search").css({"position":"fixed","top":"0px"});
                }else{
                    $(".ind_search").css({"position":"","top":""});
                }
            });
        },
        sliderFN: function(){
            var _t = this;
            if($("#slider_Img .swiper-slide").length !== 0){
                _t.slider1 = new Swiper('#slider_Img', {
                    autoplay: 5000,//可选选项，自动滑动
                    autoplayDisableOnInteraction : false,
                    loop: true,
                    autoHeight: true,
                    pagination: "#serial_number",
                    onTouchStart: function(swiper){
                        _t.sTP = swiper.translate;
                    },
                    onTouchEnd: function(swiper){
                        _t.eTP = swiper.translate;
                    }
                });
            }

        },
				//*******zetpo*****************
				click:function(){
					$.fn.scrollTo =function(options){
				var defaults = {
						toT : 0,    //滚动目标位置
						durTime : 500,  //过渡动画时间
						delay : 30,     //定时器时间
						callback:null   //回调函数
				};
				var opts = $.extend(defaults,options),
						timer = null,
						_this = this,
						curTop = _this.scrollTop(),//滚动条当前的位置
						subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
						index = 0,
						dur = Math.round(opts.durTime / opts.delay),
						smoothScroll = function(t){
								index++;
								var per = Math.round(subTop/dur);
								if(index >= dur){
										_this.scrollTop(t);
										window.clearInterval(timer);
										if(opts.callback && typeof opts.callback == 'function'){
												opts.callback();
										}
										return;
								}else{
										_this.scrollTop(curTop + index*per);
								}
						};
				timer = window.setInterval(function(){
						smoothScroll(opts.toT);
				}, opts.delay);
				return _this;
		};
							$("#return_top").on("click",function(){
						$("body").scrollTo({toT:0});

							});
							},
    });
    index.init();
});
