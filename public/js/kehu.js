require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var kehu = {};
        $.extend(kehu, {
            type: 1,
            pageNo: 1,
            pageSize: 20,
            noMore: false,
            searchType: 1,
            init: function(){
                this.initData();
                this.searchMyConsumer();
                this.bindEvent();
                this.getPageForMyConsumer();
                this.roll();
            },
            initData: function(){
                common.js.ajx(reqUrl.ser + "member/getConsumerCount.action", {}, function(data){
                    if(data.infocode === "0"){
                        $("span[name=directMemberNum]").text(data.info.directMemberNum);
                        $("span[name=indirectMemberNum]").text(data.info.indirectMemberNum);
                    }else{
                        alert(data.info);
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                },function(){
                    alert("数据请求失败");
                });
            },
            searchMyConsumer: function(){
                $(document).on("tap", ".button", function(){
                    var mobile = $("input[name=mobile]").val().trim();
                    if(!/^1[3,4,5,7,8]\d{9}$/.test(mobile)){
                        alert("请输入正确的手机号");
                        return;
                    }
                    common.js.ajx(reqUrl.ser + "member/searchMyConsumer.action", {mobile:mobile}, function(data){
                        if(data.infocode === "0" && "object" === typeof(data.info)){
                            $(".ui-show-info").html("用户：" + data.info.loginName + "<span style='padding: 0 20px'></span>受邀时间：" + data.info.registerDate).show();
                        }else{
                            alert(data.info);
                            if(data.infocode === "2"){
                                location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                            }
                        } 
                    },function(){
                        alert("数据请求失败");
                    });
                });
            },
            bindEvent: function(){
                var _t = this;
                $(document).on("tap", ".numbox .number", function(){
                    $(this).addClass("cur").siblings().removeClass("cur");
                    if(_t.searchType === $(this).index() + 1) return;
                    _t.searchType = $(this).index() + 1;
                    _t.pageNo = 1;
                    _t.noMore = false;
                    _t.getPageForMyConsumer();
                });
                
                $(document).on("tap", ".ui-date-list li", function(){
                    $(this).addClass("cur").siblings().removeClass("cur");
                    if(_t.type === $(this).index() + 1) return;
                    _t.type = $(this).index() + 1;
                    _t.pageNo = 1;
                    _t.noMore = false;
                    _t.getPageForMyConsumer();
                });
                
            },
            getPageForMyConsumer: function(){
                var _t = this;
                if(_t.pageNo === 1) $(".listul ul").empty();
                common.js.ajx(reqUrl.ser + "member/getPageForMyConsumer.action", {type: _t.type, pageNo: _t.pageNo, pageSize: _t.pageSize,searchType: _t.searchType}, function(data){
                    if(data.infocode === "0"){
                        $(".ui-num-total").text("(" + data.info.count + ")");

                        if(data.info.memberList.length === 0){
                            _t.noMore = true;
                            return;
                        }
                        if(data.info.memberList.length < _t.pageSize){
                            _t.noMore = true;
                        }
                        var h = "";
                        $.each(data.info.memberList, function(k, v){
                           h += "<li><span>"+ v.loginName +"</span><span>"+ v.registerDate +"</span><span>"+ v.memberType +"</span></li>"; 
                        });
                        $(".listul ul").append(h);
                        
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
            roll: function(){
                var _t = this;
                $(window).scroll(function (){
                    if(!_t.noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                        _t.pageNo++; //控制同步调用
                        _t.getPageForMyConsumer();
                    }
                });
            }
            
        });
        kehu.init();
    })();
});