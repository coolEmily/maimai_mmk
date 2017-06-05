require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var pingtaishangpintjsp = {};
    $.extend(pingtaishangpintjsp, {
        data: {page: 1, rows: 20, orderReduceId: common.tools.getUrlParam('oId') ? common.tools.getUrlParam('oId') : sessionStorage.mmjOId},
        noMoreGoods: false,
        init: function(){
            var _t = this;
            _t.initPage();
            _t.bindEvent();
            _t.roll();
            sessionStorage.backUrl = common.tools.getBackUrl();
            sessionStorage.avtivityFlag = 'manjian';
            common.tools.getUrlParam('oId') ? sessionStorage.mmjOId = common.tools.getUrlParam('oId') : "";
            $(".wd_btn").attr("href", "xuanzhehuodongsp.html?oId=" + sessionStorage.mmjOId);
        },
        initPage: function(){
            $(".ui-nothing-find").hide();
            var _t = this;
            common.js.ajx(reqUrl.ser + 'orderReduce/getReduceGoodsDetailList.action', _t.data, function(data){
                if(data.infocode === '0'){
                    if(_t.data.page === 1){
                        $(".orderunit").empty();
                        if(data.info.reduceGoodsList.length === 0) $(".ui-nothing-find").show();
                    }
                    _t.data.page++;
                    var h = "";
                    $.each(data.info.reduceGoodsList, function(k, v){
                        h += '<div class="goodslist"><dl><dt style="min-height:50px"><a href="#"><img src="'+ reqUrl.imgPath + _lib.getImgSize(v.mainPictureJPG, "A") +'"></a></dt>'+
                             '<dd><ul><li><a href="#">'+ v.chName +'</a></li>'+
                             '<li><a href="#">'+ v.enName +'</a></li><li class="ui-goods-p" style="color:#ff3c3c;bottom:10px">促销价：￥'+ v.marketPrice +' <span>库存：'+ v.inventoryNum +'件</span></li>'+
                             '</ul></dd></dl><div class="sg_list"><span '+ (v.auditStatus === '审核通过' ? 'class="hs"' : '') +'>'+ v.auditStatus +'</span>'+
                              (v.auditStatus === "审核不通过" ? '<a href="dakashangpinmtg.html?id='+ v.priceReduceGoodsId +'">查看</a>' : v.auditStatus === "审核通过" ? '<a href="javascript:;" class="ui-del" data-priceReduceGoodsId="'+ v.priceReduceGoodsId +'">移除</a>' : '')+
                             '</div></div>';
                    });
                    $(".orderunit").append(h);
                }else{
                    alert(data.info);
                    if(data.infocode) location.href = "/login/denglu.html?backUrl=" +　common.tools.getBackUrl();
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
                _t.initPage();
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
            $(".search1_btn").removeClass("ui-ing");
            alert("数据请求失败");
        }
    });
    pingtaishangpintjsp.init();
});