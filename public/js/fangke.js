require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var fangke = {};
        $.extend(fangke, {
            type: 1,
            pageNo: 1,
            pageSize: 20,
            noMore: false,
            init: function(){
                this.initData();
                this.bindEvent();
                this.getPageForVisit();
                this.roll();
            },
            initData: function(){
                var _t = this;
                common.js.ajx(reqUrl.ser + "/visitLog/getVisitCount.action", {type: _t.type}, function(data){
                    if(data.infocode === "0"){
                        if(Number(data.info.allCount) === 0){
                            $(".ui-body.main").hide();
                            $(".ui-nothing-find").show();
                        }
                        $(".ui-visitor-num-total").text(data.info.allCount);
                        $(".ui-visitor-num-today").text(data.info.count);
                    }else{
                        alert(data.info);
                        if(data.infocode === "2"){
                            location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                        } 
                    }
                },function(){
                    alert("数据请求失败");
                });
            },
            bindEvent: function(){
                var _t = this;
                $(document).on("tap", ".ui-num-cycle", function(){
                    $(".ui-jin-fang").text($(this).text() + "访客:");
                    $(this).addClass("active").siblings().removeClass("active");
                    if(_t.type === $(this).index() + 1) return;
                    _t.type = $(this).index() + 1;
                    _t.initData();
                    _t.pageNo = 1;
                    _t.noMore = false;
                    _t.getPageForVisit();
                    _t.initData();
                });
                
            },
            getPageForVisit: function(){
                var _t = this;

                common.js.ajx(reqUrl.ser + "visitLog/getPageForVisit.action", {type: _t.type, pageNo: _t.pageNo, pageSize: _t.pageSize}, function(data){
                    if(data.infocode === "0"){
                        if(data.info.length === 0){
                            if(_t.pageNo === 1) $(".ui-visitor-info.ui-show-history .ui-list").remove();
                            _t.noMore = true;
                            return;
                        }
                        if(_t.pageNo++ === 1) $(".ui-visitor-info.ui-show-history .ui-list").remove();
                        var h = "";
                        $.each(data.info, function(k, v){
                           h += '<div class="ui-list"><div class="ui-visitor-num ui-visitor-detail">'+ v.username +'</div>' + 
                            '<div class="ui-visitor-num ui-visitor-detail">'+ v.visitDate +'</div></div>'; 
                        });
                        $(".ui-visitor-info.ui-show-history").append(h);
                        
                    }else if(data.infocode !== "2"){
                        alert(data.info);
                    } 
                },function(){
                    alert("数据请求失败");
                });
            },
            roll: function(){
                var _t = this;
                $(window).scroll(function (){
                    if(!_t.noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                        _t.getPageForVisit();
                    }
                });
            }
            
        });
        fangke.init();
    })();
});