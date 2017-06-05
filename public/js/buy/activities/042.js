require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib','visitor-logs'], function($, lib, vl){
    lib = new lib();
    $(function(){
        vl.setLog(window.location.href, 2);//会员访问日志
        $(document).on("touchstart", "#ui-getRPB", function(){
            var pocketId = lib.getUrlParam('rptId')?lib.getUrlParam('rptId'):99;
            lib.ajx(lib.getReq().ser + '/redPacket/takeRedPacket.action', {redPacketTypeId: pocketId}, function(data){
                if(data.infocode === "0"){
                    alert("您已抢到999元红包");
                }else{
                    if(data.infocode === "3"){
                        alert("您还没有登录，登录成功后即刻开抢");
                        location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                        return;
                    }else if(data.infocode === "5"){
                        alert("您今天已抢，明天再来呦！");
                        return;
                    }
                    alert(data.info);
                }
            });
        });
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
                subTop = opts.toT - curTop,//滚动条目标位置和当前位置的差值
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
        $(".goto-top").click(function () {
            $('body').scrollTo({toT:0});
        });
    });
});
