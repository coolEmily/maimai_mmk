require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var kunbang = {};
    $.extend(kunbang, {
        data: {page: 1, rows: 20, statusUpDown: 0},
        status: {1: "审核中", 2: "审核通过", 3: "审核未通过"},
        noMoreGoods: false,
        removeItem: ["couponPay", "deliveryPriceTypeId", "backRebateId", "platformMoney", "exGoodsNum", "divAndGoodsInfo", "goodsNum", "bindInfo", "playPicture"],
        init: function(){
            var _t = this;
            _t.initData();
            _t.bindEvent();
            _t.roll();
            $.each(_t.removeItem, function(k, v){
                sessionStorage.removeItem(v); 
            });
            sessionStorage.first = 0;
        },
        initData: function(){
            var _t = this;
            $(".ui-nothing-find").hide();
            common.js.ajx(reqUrl.ser + "bind/selectBindBymember.action", _t.data, function(data){
                if(data.infocode === "0"){
                    if(_t.data.page === 1) $(".orderunit").empty();
                    if(data.info.list_bind.length === 0 ){
                        _t.noMoreGoods = true;
                        _t.data.page === 1 ? $(".ui-nothing-find").show() : '';
                        return;
                    }
                    _t.data.page++;
                    var h = "";
                    $.each(data.info.list_bind, function(k, v){
                        h += '<div class="goodslist"><dl><dt class="lf"><a href="#"><img src="'+ reqUrl.imgPath + v.mainPictureJPG +'"></a></dt><dd>'+
                            '<ul><li><a href="#">'+ v.chName +'</a></li><li><a href="#">'+ (v.enName ? enName : "") +'</a></li>'+
                            '<li class="ui-goods-c" style="bottom:40px">促销价：￥'+ v.sellingPrice +'</li><li class="ui-goods-p" style="bottom:25px">库存：'+ v.inventoryNum +'件</li><li style="bottom:10px;position:absolute;margin:0"><a href="#">已售：'+ v.sellRealNumber +'件</a></li>'+
                            '</ul></dd></dl><div class="sg_list">'+
                            '<span class="'+(2 === v.auditStatus ? "hs" : "")+'">'+ _t.status[v.auditStatus] +'</span>'+
                            (3 === v.auditStatus ? '<a href="kunbangtj.html?oId='+ v.bind +'">修改</a>' : "")+
                            (2 === v.auditStatus ? '<a href="javascript:;" data-bindId="'+ v.bind +'" class="ui-del">删除</a>' : "")+
                            (2 === v.auditStatus ? '<a href="kunbangtj.html?oId='+ v.bind +'">查看</a>' : "")+
                             "</div></div>";
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
                if($("#select_box").is(":visible") ===true){
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
                 _t.data.statusUpDown = $(this).index();
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
                _t.removePriceReduceGoods($(this).attr("data-bindId"), this);
            });
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                if(!_t.noMoreGoods &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                    _t.initData();
                }
            });
        },
        removePriceReduceGoods: function(bindId, obj){
            common.js.ajx(reqUrl.ser + 'bind/deleteBind.action', {bindId: bindId}, function(data){
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
    kunbang.init();
});