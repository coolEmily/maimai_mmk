require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib','visitor-logs'], function($, lib, vl){
    lib = new lib();
    $(function(){        
        var top = ($(window).width() > 640 ? 640 : $(window).width())/750;
        var height = 337*top;        
        var backgroundImage = {24:["01",44526,797],
                                25:["02",44554,1182],
                                26:["03",32563,1546],
                                27:["04",40965,1910],
                                28:["05",39956,2272],
                                29:["06",46201,2635],
                                30:["07",46202,2997],
                                31:["08",40286,3359],
                                01:["09",32254,3724],
                                02:["10",36741,4086]
                               };
        var date = new Date();
        if((date.getMonth() === 11 || date.getMonth() === 0) && backgroundImage[date.getDate()]) {
            $(".Img").attr("src","/images/activities/014/"+backgroundImage[date.getDate()][0]+".jpg");
            $(".aaa").attr("href","/g?gId="+backgroundImage[date.getDate()][1]);
            $(".aaa").css({
                "top":backgroundImage[date.getDate()][2]*top+"px",
                "height":height+"px"
            });
        }else {
            $(".Img").attr("src","/images/activities/014/"+backgroundImage[02][0]+".jpg");
            $(".aaa").attr("href","/g?gId="+backgroundImage[02][1]);
            $(".aaa").css({
                "top":backgroundImage[02][2]*top+"px",
                "height":height+"px"
            });
        }

        
        //回到顶部
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
        // ****************
        $("#return_top").on("click",function(){
           $("body").scrollTo({toT:0});
        });
         $(".return_top").on("click",function(){
            $("body").scrollTo({toT:0});
        });
        var Oheight=$("body").height()/2;
        scroll(Oheight);
        function scroll(Oheight){
            $(window).on("scroll",function () {
                if($(this).scrollTop()>Oheight){
                    $("#return_top").css({"opacity":1});
                }else{
                    $("#return_top").css({"opacity":0});
                }
            });
        }
        vl.setLog(window.location.href, 2);//会员访问日志
        
    });
});
