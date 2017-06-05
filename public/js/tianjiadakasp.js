require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var tianjiadakasp = {};
    $.extend(tianjiadakasp, {
        data: {goodsName: "", page: 1, rows: 20},
        noMoreGoods: false,
        init: function(){
            var _t = this;
            _t.initData(_t.data);
            _t.bindEvent();
            _t.roll();
        },
        initData: function(data){
            var _t = this;
            common.js.ajx(reqUrl.ser + "priceReduce/getGoodsByMemberId.action", data, function(data){
                $(".search1_btn").removeClass("ui-ing");
                if(data.infocode === "0"){
                    if(data.info.goodsList.length === 0 ){
                        _t.noMoreGoods = true;
                        if(_t.data.page === 1){
                            alert("没查询到任何商品");
                            $(".wd_btn").hide();
                        }
                        return;
                    }
                    _t.data.page++ === 1 ? $(".orderunit:not(.search)").empty() : '';
                    var h = "";
                    $.each(data.info.goodsList, function(k, v){
                        h += '<div class="goodslist"><dl><span class="select_btn cur"></span>'+
                             '<dt><a href="javascript:;"><img src="'+ reqUrl.imgPath + _lib.getImgSize(v.mainPictureJPG, "A") +'"></a></dt>'+
                             '<dd><ul><li><a href="javascript:;">'+ v.chName +'</a></li>'+
                             '<li><a href="javascript:;">'+ v.enName +'</a></li>'+
                             '<li class="ui-goods-c">￥'+ v.sellingPrice +'<span>库存：'+ v.inventoryNum +'件</span></li>'+
                             '<li class="ui-goods-p" style="color: #999">大咖价<input type="tel" disabled="disabled" value="'+ v.sellingPrice +'" data-goodsId="'+ v.goodsId +'" data-org="'+ v.sellingPrice +'" class="txt" /</li>'+
                             '</ul></dd></dl></div>';
                    });
                    $(".orderunit:not(.search)").append(h);
                }else{
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, _t.errFn);
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", ".wd_btn", function(){
                var param = "";
                $.each($(".select_btn:not(.cur)"), function(k, v){
                    param += "goodsIds=" + Number($(v).parents().find(".txt").attr("data-goodsId"));      
                    param += "&prices=" + $(v).parents().find(".txt").val()+"&";      
                });
                if(param === ""){
                    alert("请选择相应商品");
                    return;
                }
                common.js.ajx(reqUrl.ser + "priceReduce/saveAllPriceReduceGoods.action?" + param, {}, function(data){
                    if(data.infocode === "0"){
                        alert(data.info);
                        location.href = "dakaguan.html";
                    }else{
                        alert(data.info);
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                }, _t.errFn);
            });
            
            $(document).on("tap", ".select_btn", function(){
                if($(this).hasClass("cur")){
                    $(this).removeClass("cur");
                    $(this).parent().find("input").removeAttr("disabled");
                }else{
                    $(this).addClass("cur");
                    $(this).parent().find("input").attr("disabled", "disabled");
                }
            });
            
            $(document).on("blur", ".goodslist input.txt", function(){
                isNaN(Number($(this).val())) ? $(this).val($(this).attr("data-org")) : "";
            });
            
            
            $(document).on("tap", ".search1_btn:not(.ui-ing)", function(){
                $(this).addClass("ui-ing");
                _t.data.goodsName = $(".search1_txt input").val().trim();
                if("" === _t.data.goodsName){
                    _t.showErrorMessage($(".ui-message"), "请输入商品名称");
                    return;
                }
                _t.data.page = 1;
                _t.initData(_t.data);
            });
            
        },
        showErrorMessage: function(obj, message, flag){
            obj.text(message);
            obj.removeClass('login_error').removeClass('login_succ');
            var timeOut = setTimeout(function(){
                flag ? obj.addClass('login_succ') : obj.addClass('login_error');
                obj.show();
            },10);
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                if(!_t.noMoreGoods &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                    _t.initData(_t.data);
                }
            });
        },
        errFn: function(){
            $(".search1_btn").removeClass("ui-ing");
            alert("数据请求失败");
        }
    });
    tianjiadakasp.init();
});