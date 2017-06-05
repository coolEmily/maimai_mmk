require.config({baseUrl: '/js/lib'});
require(["jquery", "bootstrap-datetimepicker-zh-CN"],function($){
    $("input[name=startTime]").datetimepicker({
        language:  'zh-CN',
        format: "yyyy-mm-dd hh:ii:ss",
        autoclose: true,
        todayBtn: true,
        minuteStep: 2
    }).on('changeDate', function(ev){
        $("input[name=endTime]").datetimepicker('setStartDate', $("input[name=startTime]").val());
    });
    
    $("input[name=endTime]").datetimepicker({
        language:  'zh-CN',
        format: "yyyy-mm-dd hh:ii:ss",
        autoclose: true,
        todayBtn: true,
        minuteStep: 2
        
    }).on('changeDate', function(ev){
        $("input[name=startTime]").datetimepicker('setEndDate', $("input[name=endTime]").val());
    });
});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var maizengtj = {};
    $.extend(maizengtj, {
        data: {page: 1, rows: 20, goodsGiveId: common.tools.getUrlParam("id")},
        init: function(){
            var _t = this;
            sessionStorage.avtivityFlag = "maizeng";
            sessionStorage.backUrl = common.tools.getBackUrl();
            if(common.tools.getUrlParam("id") &&　sessionStorage.first !== "1"){
                sessionStorage.goodsGiveId = common.tools.getUrlParam("id");
                sessionStorage.first = "1";
                _t.getMemberGoodsList();
            }
            _t.bindEvent();
            _t.initPage();
        },
        getMemberGoodsList: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "goodsGive/getMemberGoodsList.action", _t.data, function(data){
                if(data.infocode === "0"){
                    $.each(data.info.giveGoodsList, function(k, v) {
                        sessionStorage.giftNum = v.giveGoodsNum;
                        sessionStorage.activityTime = JSON.stringify({startTime: v.startTime,endTime: v.endTime});
                        sessionStorage.divAndGoodsInfo = v.goodsId + "_" + v.chName;
                        sessionStorage.giftInfo = v.giveGoodsId + "_" + v.giveGoodsName;
                        sessionStorage.auditOpinion = v.auditOpinion ? sessionStorage.auditOpinion : "尊敬的用户，审核未通过，请重新修改后提交";
                        sessionStorage.auditStatus = v.auditStatus;
                    });
                    _t.initPage();
                }else{
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, _t.errFn);
        },
        initPage: function(){
            //初始化起始时间
            if("审核通过" === sessionStorage.auditStatus){
                $(".wd_btn").remove();
                
            }
            if(sessionStorage.auditOpinion && "审核不通过" === sessionStorage.auditStatus){
                $("header").after('<div class="orderunit not_pass"><p style="margin:0">'+ sessionStorage.auditOpinion +'</p></div>');
            }
            if(sessionStorage.activityTime && "undefined" !== sessionStorage.activityTime){
                $.each(JSON.parse(sessionStorage.activityTime), function(k, v){
                    $("input[name="+ k +"]").val(v);
                });
            }
            
            if(sessionStorage.giftNum && "undefined" !== sessionStorage.giftNum){
                $("input[name=giftNum]").val(sessionStorage.giftNum);
            }
            
            if(sessionStorage.divAndGoodsInfo && "undefined" !== sessionStorage.divAndGoodsInfo){
                $("li[name=goodsInfo]").html("<span>请选择主商品：</span>" + sessionStorage.divAndGoodsInfo.split("_")[1]).attr("data-goodsId", sessionStorage.divAndGoodsInfo.split("_")[0]);
            }
            
            if(sessionStorage.giftInfo && "undefined" !== sessionStorage.giftInfo){
                $("li[name=giftInfo]").html("<span>请选择主商品：</span>" + sessionStorage.giftInfo.split("_")[1]).attr("data-goodsId", sessionStorage.giftInfo.split("_")[0]);
            }
        },
        bindEvent: function(){
            var _t = this;
            //选择活动的起始时间
            $(".ui-date").on("tap", function(){
                $("li[name=goodsInfo]").html('<span>请选择主商品：</span>请选择主商品');
                $("li[name=giftInfo]").html('<span>请选择赠品：</span>请选择赠品');
            });
            
            $(document).on("blur", "input[name=giftNum]", function(){
                if(isNaN(Number($(this).val().trim()))){
                    $(this).val(1);
                }
                sessionStorage.giftNum = $(this).val().trim();
            });
            //选择商品和赠品
            $(document).on("tap", "li[name=goodsInfo], li[name=giftInfo]", function(){
                var startTime = $("input[name=startTime]").val();
                var endTime = $("input[name=endTime]").val();
                if('' === startTime){
                    alert("请选择开始时间");
                    return;
                }
                if('' === endTime){
                    alert("请选择结束时间");
                    return;
                }
                if(new Date(startTime).getTime() - new Date(endTime).getTime() > 0){
                    alert("活动的开始时间不能早于结束时间");
                    return;
                }
                sessionStorage.activityTime = JSON.stringify({startTime: startTime,endTime: endTime});
                
                if("goodsInfo" === $(this).attr("name")){
                    sessionStorage.avtivityFlag = "maizeng";
                    location.href = "xuanzhehuodongsp.html";
                }else{
                    if(!sessionStorage.divAndGoodsInfo || "undefined" === sessionStorage.divAndGoodsInfo){
                        alert("请先选择主商品");
                        return;
                    }
                    sessionStorage.avtivityFlag = "gift";
                    location.href = "xuanzhehuodongsp.html?gId=" + sessionStorage.divAndGoodsInfo.split("_")[0];
                }
                
            });
            
            $(document).on("tap", ".not_pass3 i", function(){
                $(this).hasClass("cur") ? $(this).removeClass("cur") : $(this).addClass("cur");
            });
            
            $(document).on("tap", ".wd_btn", function(){
                _t.saveMemberGoodsGive(); 
            });
        },
        saveMemberGoodsGive: function(){
            var data = {},  _t = this, param = "";
            data.startTime = $("input[name=startTime]").val();
            if("" === data.startTime){
                alert("请输入活动开始时间");
                return;
            }
            data.endTime = $("input[name=endTime]").val();
            if("" === data.endTime){
                alert("请输入活动截止时间");
                return;
            }
            data.mainGoodsId = $("li[name=goodsInfo]").attr("data-goodsId");
            if(null === data.mainGoodsId){
                alert("请选择主商品");
                return;
            }
            data.followGoodsId = $("li[name=giftInfo]").attr("data-goodsId");
            if(null === data.followGoodsId){
                alert("请选择赠品");
                return;
            }
            data.followGoodsNum = $("input[name=giftNum]").val();
            if("" === data.followGoodsNum || isNaN(Number(data.followGoodsNum))){
                alert("请输入正确的赠品数量");
                return;
            }
            data.couponPay = $(".not_pass3 i").hasClass("cur") ? 0 : 1;
            $.each(data, function(k, v){
                param += k + "=" + v + "&";    
            });
            if(sessionStorage.goodsGiveId && "undefined" !== sessionStorage.goodsGiveId){
                param += "goodsGiveId=" + sessionStorage.goodsGiveId;
            }
            common.js.ajx(reqUrl.ser + "goodsGive/saveMemberGoodsGive.action?" + param, {}, function(data){
                alert(data.info);
                if(data.infocode === '0') location.href = "maizeng.html";
            }, _t.errFn);
        },
        errFn: function(){
            $(".search1_btn").removeClass("ui-ing");
            alert("数据请求失败");
        }
    });
    maizengtj.init();
});