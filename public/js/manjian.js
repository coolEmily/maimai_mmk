require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var manjian = {};
    $.extend(manjian, {
        data: {page: 1, rows: 20},
        fn: {0: manjian.getReduceActivityList, 1: manjian.getMemberReduceList},
        url: ["orderReduce/getReduceActivityList.action", "orderReduce/getMemberReduceList.action"],
        aUrl: ["pingtaimanjiantjsp.html", "manjiantj.html"],
        removeItems: ["goodsIds", "oId", "backUrl", "exGoodsNum","goodsInfo","pageInfo","rule","activityImg","first"],
        index: (common.tools.getUrlParam("i") === "1" ? 1 : 0),
        noMoreGoods: false,
        init: function(){
            var _t = this;
            _t.bindEvent();
            if(common.tools.getUrlParam("i") === "1"){
                $(".ui-nothing-find dt").text('您还没有创建任何任何满减活动');
                $(".main").after('<a href="manjiantj.html" class="wd_btn" style="position: fixed;bottom: 0;width: 100%;">创建活动</a>').css("padding-bottom", "40px");
                $(".pt_list a:eq(1)").addClass("on").siblings().removeClass("on");   
            }
                
            _t.getReduceActivityList(_t.url[_t.index], _t.aUrl[_t.index]);
            _t.roll();
            $.each(_t.removeItems, function(k, v){
                sessionStorage.removeItem(v);
            });
        },
        getReduceActivityList: function(url, aUrl){
            var _t = this;
            $(".ui-nothing-find").hide();
            common.js.ajx(reqUrl.ser + url, _t.data, function(data){
                if(_t.data.page === 1){
                    $(".sg_list3").empty();
                }
                if(data.infocode === "0"){
                    if(data.info.orderReduceList.length === 0 && _t.data.page === 1){
                        $(".ui-nothing-find").show();
                        return;
                    }
                    _t.data.page++;
                    var h = "";
                    $.each(data.info.orderReduceList, function(k, v) {
                        h += '<a href="'+(v.returnStr !== '已截止报名' ? aUrl + '?oId='+ v.orderReduceId : "#") +'" class="sg_list1"><div><img src="'+ reqUrl.imgPath + v.activePicture +'" /></div>' + 
                            '<p '+ (v.returnStr === '参加活动' ? 'class="bmimg"' : v.returnStr === '已截止报名' ? 'class="jzhi"' : '') +'>'+ v.returnStr +'</p></a>';    	
                    });
                    $(".sg_list3").append(h);
                }else{
                    alert(data.info);
                    if(data.infocode) location.href = "/login/denglu.html?backUrl=" +　common.tools.getBackUrl();
                }
            }, _t.errFn);
        },
        bindEvent: function(){
            var _t = this;
            $(".pt_list a").tap(function(){
                $(this).addClass('on').siblings().removeClass("on");
                _t.data.page = 1;
                if($(this).index() === 1){
                    $(".ui-nothing-find dt").text('您还没有创建任何任何满减活动');
                    $(".main").after('<a href="manjiantj.html" class="wd_btn" style="position: fixed;bottom: 0;width: 100%;">创建活动</a>').css("padding-bottom", "40px");
                }else{
                    $(".ui-nothing-find dt").text('您还没有参加平台满减活动');
                    $(".wd_btn").remove();
                    $(".main").removeAttr("style");
                }
                _t.getReduceActivityList(_t.url[$(this).index()], _t.aUrl[$(this).index()]);
                
            });
            
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                if(!_t.noMoreGoods &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                    _t.getReduceActivityList(_t.url[$(".pt_list a.on").index()], _t.aUrl[$(".pt_list a.on").index()]);
                }
            });
        },
        errFn: function(){
            $(".search1_btn").removeClass("ui-ing");
            alert("数据请求失败");
        }
    });
    manjian.init();
});