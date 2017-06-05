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

require(['zepto', 'lib', "uploadImg"], function($, lib, uploadImg){
    var _lib = new lib();
    uploadImg();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var manjian = {};
    $.extend(manjian, {
        init: function(){
            var _t = this;
            _t.bindEvent();
            _t.initPage();
            sessionStorage.backUrl = common.tools.getBackUrl();
            if(common.tools.getUrlParam("oId") && (!sessionStorage.first || sessionStorage.first === "0")){
                _t.getMemberReduceGoodsList(common.tools.getUrlParam("oId"));
                sessionStorage.first = 1;
            }
        },
        getMemberReduceGoodsList: function(id){
            var _t = this;
            common.js.ajx(reqUrl.ser + "orderReduce/getMemberReduceGoodsList.action", {rows: 20, page: 1, orderReduceId: id}, function(data){
                if(data.infocode === "0"){
                    $("input[name=activePicture_input]").after('<div name="activePicture" id="activePicture" class="activePicture" data-url="'+ data.info.activePicture +'"><img src="'+ reqUrl.imgPath + data.info.activePicture +'"></div>');
                    sessionStorage.orderReduceId = data.info.orderReduceId;
                    $("input[name=ui-activity-name]").val(data.info.orderReduceName);
                    $("input[name=startTime]").val(data.info.startTime);
                    $("input[name=endTime]").val(data.info.endTime);
                    if(data.info.firstReach){
                        $(".ui-activity-rule:eq(0)").find("input:eq(0)").val(data.info.firstReach);
                        $(".ui-activity-rule:eq(0)").find("input:eq(1)").val(data.info.firstReduce);
                    }
                    if(data.info.secondReach){
                        $(".add_goods").before('<div class="not_pass1 ui-activity-rule"><div class="add_kunb"><span>购买总额：</span><input type="text" value="" class="txt" placeholder="请输入所购商品总金额数目"> </div><div class="add_kunb"><span>减免金额：</span><input type="text" value="" class="txt" placeholder="请输入减免金额"> </div></div>');   
                        $(".ui-activity-rule:eq(1)").find("input:eq(0)").val(data.info.secondReach);
                        $(".ui-activity-rule:eq(1)").find("input:eq(1)").val(data.info.secondReduce);
                        sessionStorage.exGoodsNum = 1;
                    }
                    if(data.info.thirdReach){
                        $(".add_goods").before('<div class="not_pass1 ui-activity-rule"><div class="add_kunb"><span>购买总额：</span><input type="text" value="" class="txt" placeholder="请输入所购商品总金额数目"> </div><div class="add_kunb"><span>减免金额：</span><input type="text" value="" class="txt" placeholder="请输入减免金额"> </div></div>');   
                        $(".ui-activity-rule:eq(2)").find("input:eq(0)").val(data.info.thirdReach);
                        $(".ui-activity-rule:eq(2)").find("input:eq(1)").val(data.info.thirdReduce);
                        sessionStorage.exGoodsNum = 2;
                    }
                    var h = "";
                    var d = {};
                    $.each(data.info.map_for_goodsList, function(k, v) {
                        h += '<div class="goodslist" data-goodsId="'+ v.goodsId +'"><dl style="margin: 0;"><dt><a href="#"><img src="'+ reqUrl.imgPath + v.mainPictureJPG+'"></a></dt>'+
                            '<dd><ul><li><a href="#">'+v.chName+'</a></li><li><a href="#">'+v.enName+'</a></li>'+
                            '<li class="ui-goods-p" style="bottom: 10px;"><span>促销价：</span><span class="ys">￥'+v.marketPrice+'</span> <span>库存：</span><span class="ys">'+v.inventoryNum+'件</span></li>'+
                            '</ul></dd></dl><div class="sg_list"  style="margin-top: -8.5px;"><a href="javascript:;" class="ui-del-this">移除</a></div></div>';
                        d[v.goodsId] = v.mainPictureJPG + '_' + v.chName + '_' + v.enName + '_' + (v.marketPrice ? v.marketPrice : v.price) + '_' + (v.inventoryNum ? v.inventoryNum : 0);
                    });
                    
                    sessionStorage.goodsInfo = JSON.stringify(d);
                    $(".orderunit").html(h);
                    _t.saveDataTosessionstorge();
                }else{
                    sessionStorage.first = 0;
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, _t.errFn);
        },
        initPage: function(){
            if(sessionStorage.exGoodsNum){
                for(var i=0; i<Number(sessionStorage.exGoodsNum); i++){
                    $(".add_goods").before('<div class="not_pass1 ui-activity-rule"><div class="add_kunb"><span>购买总额：</span><input type="text" value="" class="txt" placeholder="请输入所购商品总金额数目"> </div><div class="add_kunb"><span>减免金额：</span><input type="text" value="" class="txt" placeholder="请输入减免金额"> </div></div>');   
                }
            }
            
            if(sessionStorage.goodsInfo){
                $(".wd_btn").remove();
                $(".hd_btn").show();
                var h = "";
                $.each(JSON.parse(sessionStorage.goodsInfo), function(k, v) {
                	h += '<div class="goodslist" data-goodsId="'+ k +'"><dl style="margin: 0;"><dt><a href="#"><img src="'+ reqUrl.imgPath + v.split("_")[0]+'"></a></dt>'+
                        '<dd><ul><li><a href="#">'+v.split("_")[1]+'</a></li><li><a href="#">'+v.split("_")[2]+'</a></li>'+
                        '<li class="ui-goods-p" style="bottom: 10px;"><span>促销价：</span><span class="ys">￥'+v.split("_")[3]+'</span> <span>库存：</span><span class="ys">'+v.split("_")[4]+'件</span></li>'+
                        '</ul></dd></dl><div class="sg_list" style="margin-top: -8.5px;"><a href="javascript:;" class="ui-del-this">移除</a></div></div>';
                });
                $(".orderunit").html(h);
            }
            
            if(sessionStorage.pageInfo){
                $.each(JSON.parse(sessionStorage.pageInfo), function(k, v){
                    $("input[name="+ k +"]").val(v);
                });
            }
            if(sessionStorage.activityImg && "undefined" !== sessionStorage.activityImg){
                $("input[name=activePicture_input]").after('<div name="activePicture" id="activePicture" class="activePicture" data-url="'+ data.info.activePicture +'"><img src="'+ reqUrl.imgPath + sessionStorage.activityImg +'"></div>');
            }
            
            if(sessionStorage.rule){
                $.each(JSON.parse(sessionStorage.rule), function(k, v){
                    $(".ui-activity-rule:eq("+ k +")").find("input:eq(0)").val(v.split("_")[0]);
                    $(".ui-activity-rule:eq("+ k +")").find("input:eq(1)").val(v.split("_")[1]);
                });
            }
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("blur", ".ui-activity-rule input", function(){
                if(isNaN(Number($(this).val().trim()))){
                    $(this).val(0);
                }
            });
            $(document).on("tap", ".saveInfo", function(){
                _t.saveActivityAndGoods(); 
            });
            $(document).on("tap", ".add_goods", function(){
                if(sessionStorage.exGoodsNum === '2'){
                    alert("最多设置三个");
                    return;
                }
                $(this).before('<div class="not_pass1 ui-activity-rule"><div class="add_kunb"><span>购买总额：</span><input type="text" value="" class="txt" placeholder="请输入所购商品总金额数目"> </div><div class="add_kunb"><span>减免金额：</span><input type="text" value="" class="txt" placeholder="请输入减免金额"> </div></div>');
                sessionStorage.exGoodsNum = sessionStorage.exGoodsNum ? Number(sessionStorage.exGoodsNum) + 1 : 1;
            });
            $(document).on("tap", ".ui-date", function(){
                sessionStorage.removeItem("goodsInfo");
                $(".orderunit").empty();
                 
            });
            $(document).on("tap", ".ui-del-this", function(){
                var d = JSON.parse(sessionStorage.goodsInfo);
                delete d[$(this).parents(".goodslist").attr("data-goodsId")];
                sessionStorage.goodsInfo = JSON.stringify(d);
                $(this).parents(".goodslist").remove();
            });
            $(document).on("tap", ".wd_btn, .hd_btn_add", function(){
                if(!_t.saveDataTosessionstorge()){
                    return;
                }
                sessionStorage.avtivityFlag = "zymanjian";
                location.href = "xuanzhehuodongsp.html";
            });
            
        },
        saveDataTosessionstorge: function(){
            var inputNames = ["ui-activity-name","startTime", "endTime"];
            var d = {};
            $.each(inputNames, function(k, v) {
                d[v] = $("input[name="+ v +"]").val().trim();
            });
            if(d["startTime"] === "" ||  d["endTime"] === ""){
                alert("请选择开始时间或结束时间");
                return false;
            }
            if(new Date(d["startTime"]).getTime() - new Date(d["endTime"]).getTime() > 0){
                alert("开始时间要早于结束时间");
                return false;
            }
            sessionStorage.pageInfo = JSON.stringify(d);
            sessionStorage.activityImg = $('div[name=activePicture]').attr("data-url");
            d = {};
            $.each($(".ui-activity-rule"), function(k, v){
                d[k] = $(v).find("input:eq(0)").val().trim() + "_" +  $(v).find("input:eq(1)").val().trim();       
            });
            sessionStorage.rule = JSON.stringify(d);
            return true;
        },
        saveActivityAndGoods: function(){
            var data = {}, _t = this;
            data.activePicture = $('div[name=activePicture]').attr("data-url");
            if(!data.activePicture || data.activePicture === null){
                $("body").scrollTop($('div[name=activePicture] img')[0].offsetTop);
                alert("请上传活动图片");
                return;
            }
            data.orderReduceName = $("input[name=ui-activity-name]").val().trim();
            if(data.orderReduceName === ""){
                $("body").scrollTop($('input[name=ui-activity-name]').parent()[0].offsetTop);
                alert("请输入活动名称");
                return;
            }
            data.startTime = $("input[name=startTime]").val().trim();
            if(data.startTime === ""){
                $("body").scrollTop($('input[name=startTime]').parent()[0].offsetTop);
                alert("请输入活动开始时间");
                return;
            }
            data.endTime = $("input[name=endTime]").val().trim();
            if(data.endTime === ""){
                $("body").scrollTop($('input[name=endTime]').parent()[0].offsetTop);
                alert("请输入活动结束时间");
                return;
            }
            var rules = '', flag = true, goodsIds = "", param = '';
            $.each($(".ui-activity-rule"), function(k, v){
                if($(v).find("input:eq(0)").val() === ""){
                    $("body").scrollTop($(v).find("input:eq(0)").parent()[0].offsetTop);
                    alert("请输入购买总额");
                    flag = false;
                    return false;
                }
                if($(v).find("input:eq(1)").val() === ""){
                    $("body").scrollTop($(v).find("input:eq(1)").parent()[0].offsetTop);
                    alert("请输入减免金额");
                    flag = false;
                    return false;
                }
                rules += 'reachMoneys=' + $(v).find("input:eq(0)").val() + "&reduceMoneys=" + $(v).find("input:eq(1)").val() + "&";
            });
            if(!flag){
                return;
            }
            if($(".goodslist").length === 0){
                $("body").scrollTop($(".orderunit")[0].offsetTop);
                alert("请选择商品");
                return;
            }
            $.each($(".goodslist"), function(k, v){
                goodsIds += "goodsIds=" + $(v).attr("data-goodsId") + "&";
            });
            
            $.each(data, function(k ,v){
                param += k + "=" + v + "&"; 
            });
            param += rules + goodsIds;
            if(sessionStorage.orderReduceId){
                param += "orderReduceId=" + sessionStorage.orderReduceId;
            }
            common.js.ajx(reqUrl.ser + "orderReduce/saveActivityAndGoods.action?" + param, {}, function(data){
                alert(data.info);
                if(data.infocode === "0") location.href = "manjian.html?i=1";
                if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
            }, _t.errFn);
            
            
        },
        errFn: function(){
            sessionStorage.first = 0;
            alert("数据请求失败");
        }
    });
    manjian.init();
});