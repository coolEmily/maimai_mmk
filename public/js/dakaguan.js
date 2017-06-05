require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var dakaguan = {};
    $.extend(dakaguan, {
        data: {page: 1, rows: 20},
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
                    if(_t.data.page === 1) $(".orderunit").empty();
                    if(data.info.priceReduceGoodsList.length === 0 ){
                        _t.noMoreGoods = true;
                        return;
                    }
                    _t.data.page++;
                    var h = "";
                    $.each(data.info.priceReduceGoodsList, function(k, v){
                        h += '<div class="goodslist"><dl>' +
                            '<dt><a href="#"><img src="'+ reqUrl.imgPath + v.mainPictureJPG +'"></a></dt>' +
                            '<dd><ul><li><a href="#">'+ v.chName +'</a></li><li><a href="#">'+ v.enName +'</a></li>' +
                            '<li><a href="#">促销价: ￥'+ v.sellingPrice +'</a><span class="yshou">已售: '+ v.sellRealNumber +'件</span></li>' +
                            '<li class="ui-goods-p">大咖价: ￥'+ v.price +' <span class="yshou">数量: '+ v.inventoryNum +'件</span></li>' +
                            '</ul></dd></dl><div class="sg_list"><span '+ (v.auditStatus === "审核通过" ? 'class="hs"' : '' )+'>'+ v.auditStatus +'</span>' +
                             (v.auditStatus === "审核不通过" ? '<a href="dakashangpinmtg.html?id='+ v.priceReduceGoodsId +'">查看</a>' : v.auditStatus === "审核通过" ? '<a href="javascript:;" class="ui-del" data-priceReduceGoodsId="'+ v.priceReduceGoodsId +'">移除</a>' : '') +
                            '</div></div>';
                    });
                    $(".orderunit").append(h);
                }else{
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, _t.errFn);
        },
        bindEvent: function(){
            var _t= this;
            $("#titword").on("tap",function(){
                if($("#select_box").is(":visible") === true){
                    $("#select_box").hide();
                    $("#trianglered").hide();
                    $("#triangle").show();  
                }else{
                    $("#select_box").show();
                    $("#trianglered").show();
                    $("#triangle").hide();    
                }         
             });
    
             $("#itemcon li").on("tap",function(){
                $(this).index() > 0 ? _t.data.auditStatus = $(this).index() - 1 : delete _t.data.auditStatus;
                var con=$(this).html();
                $(this).addClass("cur").siblings().removeClass("cur");
    
                $(this).siblings().find("span").remove();
                $('<span class="radioimg"></span>').appendTo($(this));
    
                $("#select_box").hide();
                $("#titword_text").html(con);
                $("#trianglered").hide();
                $("#triangle").show();
                _t.data.page = 1;
                _t.initData(_t.data);
             });
            $(document).on("tap", ".ui-del", function(){
                $(this).parents(".goodslist").hide();
                _t.removePriceReduceGoods($(this).attr("data-priceReduceGoodsId"), this);
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
        removePriceReduceGoods: function(priceReduceGoodsId, obj){
            common.js.ajx(reqUrl.ser + 'priceReduce/removePriceReduceGoods.action', {priceReduceGoodsId:priceReduceGoodsId}, function(data){
                if(data.infocode === "0"){
                    $(obj).parents(".goodslist").remove();
                }else{
                    $(obj).parents(".goodslist").show();
                    alert(data.info);
                }
            },function(){
                $(obj).parents(".goodslist").show();
            });
        },
        errFn: function(){
            alert("数据请求失败");
        }
    });
    dakaguan.init();
});