require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', 'uploadImg'], function($, lib, uploadImg){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var kunbang = {};
    uploadImg();
    $.extend(kunbang, {
        inputObj: {"kunbang_bindCNName": "请输入捆绑商品名称", "kunbang_bindPrice": "请输入正确的商品售价", "kunbang_remain": "请输入正确的商品数量", "kunbang_slogan": "请输入广告语"},
        init: function(){
            var _t = this;
            sessionStorage.backUrl = common.tools.getBackUrl();
            sessionStorage.bindId = common.tools.getUrlParam("oId");
            sessionStorage.avtivityFlag = 'kunbang';
            sessionStorage.goodsNum ? "" : sessionStorage.goodsNum = JSON.stringify({});
            sessionStorage.bindInfo ? "" : sessionStorage.bindInfo = JSON.stringify({});
            _t.getYFTF();
            _t.bindEvent();
            if(common.tools.getUrlParam("oId") && sessionStorage.first !== '1'){
                sessionStorage.first = 1;
                _t.selectBindAndGoodsInfo();
            }
        },
        selectBindAndGoodsInfo: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser+"/bind/selectBindAndGoodsInfo.action",{bindId: common.tools.getUrlParam("oId")},function(data){
                if(data.infocode === "0"){
                    sessionStorage.exGoodsNum = data.info.goods_bind.length - 2;
                    var  goodsNum = {},goodsInfos= "";
                    $.each(data.info.goods_bind, function(k, v){
                        goodsNum[k+2] = v.goodsNum;
                        goodsInfos +=  (k+2) + "_" + v.goodsId + "_" + v.goodsName + "^";
                    });
                    sessionStorage.divAndGoodsInfo = goodsInfos;
                    sessionStorage.goodsNum = JSON.stringify(goodsNum);
                    var bindInfo = {"kunbang_bindCNName": data.info.bindCNName,"kunbang_bindPrice": data.info.bindPrice,"kunbang_remain": data.info.remain,"kunbang_slogan": data.info.slogan};
                    sessionStorage.bindInfo = JSON.stringify(bindInfo);
                    sessionStorage.playPicture = data.info.descImg;
                    sessionStorage.couponPay = data.info.couponPay;
                    if(data.info.couponPay === 0){
                        $(".not_pass3 i").addClass("cur");
                    }
                    //运费初始化
                    $.each(data.info.list_DeliveryPriceType, function(k, v){
                        if(v.select !== ""){
                            $(".ui-yunfei-list select").val(v.deliveryPriceTypeId);
                            sessionStorage.deliveryPriceTypeId = v.deliveryPriceTypeId ;
                            return false;
                        }
                            
                    });
                    //推手返利初始化
                    $.each(data.info.list_backRebate, function(k, v){
                        if(v.select !== ""){
                            $(".ui-fanli-list select").val(v.backRebateId );
                            sessionStorage.backRebateId = v.backRebateId ;
                            return false;
                        }
                            
                    });
                    /*平台返佣初始*/
                    sessionStorage.platformMoney = data.info.platformMoney;
                    $.each($(".add_scale2 li"), function(k, v){
                        if($(v).attr("value") === data.info.platformMoney){
                            $(v).addClass("cur").siblings().removeClass("cur");
                        }
                    });
                    _t.initData();
                }else{
                    sessionStorage.first = 0;
                }
            });
        },
        initData: function(){
            var _t = this;
            if(!isNaN(Number(sessionStorage.exGoodsNum))){
                for(var i=0; i<Number(sessionStorage.exGoodsNum); i++){
                    $("#add_goods_button").before('<div class="add_goods"> <ul class="ul"> <li class="ui-choose-goods"><span>添加商品：</span>请选择添加的商品</li> <li><span>商品数量：</span><input type="tel" value="" class="txt ui-goods-num" placeholder="请输入商品数量" /> </li> </ul> </div>');       
                }
            }
            if(sessionStorage.divAndGoodsInfo){
                var goodsInfos = sessionStorage.divAndGoodsInfo.split("^");
                var goodsNum = JSON.parse(sessionStorage.goodsNum);
                $.each(goodsInfos, function(k, v){
                    var vs = v.split("_");
                    if(vs.length === 3){
                        $(".main > div.add_goods:eq("+ (Number(vs[0])-2) +")").attr("data-goodsId", vs[1]).find(".ui-choose-goods").html('<span>添加商品：</span>' + vs[2]);
                        if(goodsNum[vs[0]])
                            $(".main > div.add_goods:eq("+ (Number(vs[0])-2) +")").find(".ui-goods-num").val(goodsNum[vs[0]]);
                    }
                });
            }
            if(sessionStorage.playPicture){
                $(".ui-add-button").addClass("ui-wc");
                $("input[name=playPicture_input]").after('<div name="playPicture" id="playPicture" class="playPicture" data-url="'+sessionStorage.playPicture+'"><img src="'+ reqUrl.imgPath + sessionStorage.playPicture +'"></div>');
            }
            
            $.each(JSON.parse(sessionStorage.bindInfo), function(k, v){
                $("input[name="+ k +"]").val(v);
            });
            
            if(sessionStorage.couponPay){
                if(sessionStorage.couponPay === "0"){
                    $(".not_pass3 i").addClass("cur");
                }
            }
            if(sessionStorage.deliveryPriceTypeId){
                $(".ui-yunfei-list select").val(sessionStorage.deliveryPriceTypeId);
            }
            if(sessionStorage.backRebateId){
                $(".ui-fanli-list select").val(sessionStorage.backRebateId);
            }
            if(sessionStorage.platformMoney){
               $.each($(".add_scale2 li"), function(k, v){
                   if($(v).attr("value") === sessionStorage.platformMoney){
                       $(v).addClass("cur").siblings().removeClass("cur");
                   }
                });
            }
            
        },
        getYFTF: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "bind/getBackRebateInfo.action", {}, function(data){
                if(data.infocode === "0"){
                    $.each(data.info.list_backRebate, function(k, v){
                        $(".ui-fanli-list select").append("<option value='"+ v.backRebateId +"'>"+ v.typeName +"</option>");
                    });
                    
                    $.each(data.info.list_DeliveryPriceType, function(k, v){
                        $(".ui-yunfei-list select").append("<option value='"+ v.deliveryPriceTypeId +"'>"+ v.deliveryPriceTypeName +"</option>");
                    });
                    _t.initData();
                }else{
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, _t.errFn);
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", "#add_goods_button", function(){
                $(this).before('<div class="add_goods"> <ul class="ul"> <li class="ui-choose-goods"><span>添加商品：</span>请选择添加的商品</li> <li><span>商品数量：</span><input type="tel" value="" class="txt ui-goods-num" placeholder="请输入商品数量" /> </li> </ul> </div>');
                isNaN(Number(sessionStorage.exGoodsNum)) ? sessionStorage.exGoodsNum = 1 : sessionStorage.exGoodsNum = Number(sessionStorage.exGoodsNum) + 1;
            });
            $(document).on("tap", ".ui-choose-goods", function(){
                sessionStorage.divIndex = $(this).parents('.add_goods').index();
                if($("div[name=playPicture]").length > 0){
                    sessionStorage.playPicture = $("div[name=playPicture]").attr("data-url");
                }
                location.href = "xuanzhehuodongsp.html";
            });
            
            $(document).on("tap", ".not_pass3 i", function(){
                $(this).hasClass("cur") ?  sessionStorage.couponPay = 1 : sessionStorage.couponPay = 0;
                $(this).hasClass("cur") ? $(this).removeClass("cur") : $(this).addClass("cur");
                    
            });
            
            $(document).on("tap", ".add_scale2 li", function(){
                $(this).addClass("cur").siblings().removeClass("cur");
            });
            
            $(document).on("tap", ".wd_btn", function(){
                $("input").parent().removeAttr("style");
                $("input").parents(".add_goods").removeAttr("style");
                _t.saveBindAndGoods(); 
            });
            
            $(document).on("focus", "input", function(){
                $(this).parent().removeAttr("style");
                $(this).parents(".add_goods").removeAttr("style");
            });
            
            $(document).on("blur", "input.txt.ui-goods-num", function(){
                if(isNaN(Number($(this).val().trim()))){
                    $(this).val(1);
                }
                var goodsNum = JSON.parse(sessionStorage.goodsNum);
                goodsNum[$(this).parents('.add_goods').index()] = $(this).val().trim();
                sessionStorage.goodsNum = JSON.stringify(goodsNum);  
            });
            
            $(document).on("blur", "input[name^=kunbang]", function(){
                if(isNaN(Number($(this).val().trim())) && ['kunbang_remain', 'kunbang_bindPrice'].indexOf($(this).attr('name')) > -1){
                    $(this).val(1);
                }
                var bindInfo = JSON.parse(sessionStorage.bindInfo);
                bindInfo[$(this).attr('name')] = $(this).val().trim();
                sessionStorage.bindInfo = JSON.stringify(bindInfo);  
            });
        },
        saveBindAndGoods: function(){
            var _t = this, flag = true;
            var param = "";
            $.each($(".add_goods input.ui-goods-num"), function(k, v){
                if(!$(this).parents(".add_goods").attr("data-goodsid")){
                    $('body').scrollTop($(this).parents(".add_goods")[0].offsetTop);
                    $(this).parents(".add_goods").css("border", "1px solid red");
                    alert("请输入选择商品");
                    flag = false;
                    return false;
                }else if("" === $(this).val().trim() || isNaN(Number($(this).val().trim()))){
                    $('body').scrollTop($(this).parents(".add_goods")[0].offsetTop);
                    $(this).parents(".add_goods").css("border", "1px solid red");
                    alert("填写商品数量");
                    flag = false;
                    return false;
                }
                param += "goodsIds=" + $(this).parents(".add_goods").attr("data-goodsid") +"&goodsNums=" + $(this).val().trim() + '&';
                
            });
            if(!flag){
                return;
            }
            if($("#playPicture").length === 0){
                $('body').scrollTop($(".add_deil")[0].offsetTop);
                alert("请上传图片");
                return;
            }
            param += "descImg=" + $("#playPicture").attr("data-url") + "&";
            $.each(_t.inputObj, function(k, v){
                if("" === $("input[name="+ k +"]").val().trim() || (['kunbang_remain', 'kunbang_bindPrice'].indexOf($(this).attr('name')) > -1 && isNaN(Number($("input[name="+ k +"]"),val().trim())))){
                    $("input[name="+ k +"]").parent().css("border", "1px solid red");
                    $('body').scrollTop($("input[name="+ k +"]").parent()[0].offsetTop);
                    alert(v);
                    return false;
                }
                param += k.split("_")[1] + "=" + $("input[name="+ k +"]").val() + '&';
            });
            if(!flag){
                return;
            }
            //推手返佣比例
            param += "backRebateId=" + $(".ui-fanli-list option:selected").val() + '&';
            //运费模板选择
            param += "deliveryPriceTypeId=" + $(".ui-yunfei-list option:selected").val() + '&';
            //平台返佣比例
            param += "platformMoney=" + $(".add_scale2 li.cur").attr("value") + '&';
            
            param += "couponPay=" + ($(".not_pass3 i").hasClass("cur") ? 0 : 1);
            
            var url = "bind/saveBindAndGoods.action";
            if(sessionStorage.bindId){
                param +="&bindId=" + sessionStorage.bindId;
                url = "bind/updateBindAndGoods.action";
            }
            common.js.ajx(reqUrl.ser + url + "?" + param, {}, function(data){
                alert(data.info);
                if(data.infocode === "2")
                    location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                else if(data.infocode === "0")
                    location.href = "kunbang.html";
                    
            }, _t.errFn);
        },
        errFn: function(){
            alert("数据请求失败");
        }
    });
    kunbang.init();
});