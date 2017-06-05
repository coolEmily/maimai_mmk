require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var maizeng = {};
    $.extend(maizeng, {
        data: {page: 1, rows: 20},
        removeItems: ["divAndGoodsInfo","activityTime","giftNum","backUrl","giftInfo","goodsGiveId","auditOpinion","auditStatus"],
        noMoreGoods: false,
        init: function(){
            var _t = this;
            _t.initData();
            _t.bindEvent();
            _t.roll();
            $.each(_t.removeItems, function(k, v){
                sessionStorage.removeItem(v);
            });
            sessionStorage.first = "0";
        },
        initData: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "goodsGive/getMemberGoodsList.action", _t.data, function(data){
                if(data.infocode === "0"){
                    if(data.info.giveGoodsList.length === 0){
                        _t.noMoreGoods = true;
                        _t.data.page === 1 ? $(".ui-nothing-find").show() : '';
                    }
                    if(_t.data.page++ === 1) $(".orderunit").remove();
                    var h = "";
                    $.each(data.info.giveGoodsList, function(k, v) {
                    	h += '<div class="orderunit"><div class="goodslist"><dl>'+
                            '<dt class="lf" style="min-height: 77px;"><a href="#"><img src="'+ reqUrl.imgPath + v.mainPictureJPG +'"></a></dt>'+
                            '<dd><ul><li><a href="#">'+ v.chName +'</a></li><li><a href="#">'+ v.enName +'</a></li>'+
                            '<li class="ui-goods-c" style="bottom: 50px">促销价：￥'+ v.sellingPrice +'</li><li class="ui-goods-p" style="bottom: 30px">库存：'+ v.inventoryNum +'件</li>'+
                            '<li style="position: absolute;bottom: 10px;margin: 0;"><a href="#">已售：'+ v.sellRealNumber +'件</a></li>'+
                            '</ul></dd></dl><div class="sg_list"><span class="'+ ("审核通过" === v.auditStatus ? 'hs' : '') +'">'+ v.auditStatus +'</span>'+
                            ("审核通过" === v.auditStatus ? '<a href="maizengtj.html?id='+ v.goodsGiveId +'">查看</a>' : '')+
                            ("审核不通过" === v.auditStatus ? '<a href="maizengtj.html?id='+ v.goodsGiveId +'">修改</a>' : '')+
                            ("审核通过" === v.auditStatus ? '<a href="javascript:;" class="ui-del-this" data-goodsGiveId="'+ v.goodsGiveId +'">删除</a>' : '')+
                            '</div></div><div class="zeng">赠：'+ v.giveGoodsName +'×'+ v.giveGoodsNum +'</div>'+
                            '<div class="data">时间：'+ v.startTime +' 至 '+ v.endTime +'</div></div>';
                    });
                    $(".container").append(h);
                }else{
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, _t.errFn);
        },
        bindEvent: function(){
            var _t = this;
            //筛选订单
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
                $(".ui-nothing-find").hide();
                $(this).index() > 0 ? _t.data.auditStatus = $(this).index() : delete _t.data.auditStatus;
                var con=$(this).html();
                $(this).addClass("cur").siblings().removeClass("cur");
    
                $(this).siblings().find("span").remove();
                $('<span class="radioimg"></span>').appendTo($(this));
    
                $("#select_box").hide();
                $("#titword_text").html(con);
                $("#trianglered").hide();
                $("#triangle").show();
                _t.data.page = 1;
                _t.initData();
            }); 
            
            //删除按钮
            $(document).on("tap", ".ui-del-this", function(){
                _t.removeGoodsGiveItem($(this)); 
                $(this).parents(".orderunit").hide();
            });
            
        },
        removeGoodsGiveItem: function(obj){
            common.js.ajx(reqUrl.ser + "goodsGive/removeGoodsGiveItem.action", {goodsGiveId: $(obj).attr("data-goodsGiveId")}, function(data){
                alert(data.info);
                if(data.infocode === "0") $(obj).parents(".orderunit").hide();
                else $(obj).parents(".orderunit").show();
            }, function(){
                $(obj).parents(".orderunit").hide();
            });
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                if(!_t.noMoreGoods &&　$(window).scrollTop() === $(document).height() - $(window).height()){
                    _t.initData(_t.data);
                }
            });
        },
        errFn: function(){
            $(".search1_btn").removeClass("ui-ing");
            alert("数据请求失败");
        }
    });
    maizeng.init();
});