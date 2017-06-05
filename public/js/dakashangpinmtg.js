require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var dakaguan = {};
    $.extend(dakaguan, {
        data: {page: 1, rows: 1, priceReduceGoodsId: common.tools.getUrlParam('id'), auditStatus: 1},
        noMoreGoods: false,
        init: function(){
            var _t = this;
            _t.initData(_t.data);
            _t.bindEvent();
            _t.roll();
        },
        initData: function(data){
            var _t = this;
            common.js.ajx(reqUrl.ser + "priceReduce/getPriceReduceList.action", data, function(data){
                if(data.infocode === "0"){
                    if(data.info.priceReduceGoodsList.length === 0 ){
                        _t.noMoreGoods = true;
                        if(_t.data.page === 1){
                            alert("没有审核未通过的商品");
                            location.href = 'dakaguan.html';
                        }
                        return;
                    }
                    _t.data.page++;
                    var h = "";
                    $.each(data.info.priceReduceGoodsList, function(k, v){
                        h += '<div class="goodslist"><dl><span class="select_btn"></span>' + 
                            '<dt><a href="javascript:;"><img src="'+ reqUrl.imgPath + _lib.getImgSize(v.mainPictureJPG, "A") +'"></a></dt>' +
                            '<dd><ul><li><a href="javascript:;">'+ v.chName +'</a></li>' +
                            '<li><a href="javascript:;">'+ v.enName +'</a></li>' +
                            '<li class="ui-goods-p">大咖价<input type="tel" value="'+ v.sellingPrice +'" data-goodsId="'+ v.goodsId +'" data-priceReduceGoodsId="'+ v.priceReduceGoodsId +'" data-org="'+ v.sellingPrice +'" class="txt" /> <span>库存：</span><span class="ys">'+ v.inventoryNum +'件</span></li>' +
                            '</ul></dd></dl></div>';
                        v.auditOpinion ? $(".orderunit.not_pass").text(v.auditOpinion) : "";
                    });
                    $(".orderunit:not(.not_pass)").append(h);
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
                    console.log(k);
                    param += "priceReduceGoodsId=" + $(v).parents().find(".txt").attr("data-priceReduceGoodsId");
                    param += "&goodsIds=" + Number($(v).parents().find(".txt").attr("data-goodsId"));      
                    param += "&prices=" + $(v).parents().find(".txt").val()+"&";
                });
                if(param === ""){
                    alert("请选择相应商品");
                    retrun;
                }
                common.js.ajx(reqUrl.ser + "priceReduce/saveAllPriceReduceGoods.action?" + param, {}, function(data){
                    if(data.infocode === "0"){
                        location.href = 'dakaguan.html';
                    }else{
                        alert(data.info);
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                }, _t.errFn);
            });
            
            $(document).on("tap", ".select_btn", function(){
                $(this).hasClass("cur") ? $(this).removeClass("cur") : $(this).addClass("cur");
            });
            
            $(document).on("blur", "input.txt", function(){
                isNaN(Number($(this).val())) ? $(this).val($(this).attr("data-org")) : "";
            });
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
            alert("数据请求失败");
        }
    });
    dakaguan.init();
});