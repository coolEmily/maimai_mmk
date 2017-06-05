require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib', 'wxReg'], function($, lib, wxReg){    
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var cart = {};
    $.extend(cart, {
        noPassList: [],
        scrollTop: 0,
        orderReduceMoney: 0,/*记录满减*/
        removeItem: ['coupon', 'couponForOrder', 'giftCard', 'giftCardForOrder'],
        _imgH: (document.documentElement.clientWidth > 640) ? "160px" : (document.documentElement.clientWidth * 0.25) + "px",
        init: function(){
            var _t = this;
            wxReg.reg(mId,_t.igoods);
            _t.getCartNum(); /*获取购物车数量*/
            _t.roll();
            $.each(_t.removeItem, function(k, v){
                sessionStorage.removeItem(v);
            });
            var mId = common.tools.getUrlParam('mId') === '' ? '0' : common.tools.getUrlParam('mId');
        },
        getCartNum: function(){
            /*获取购物车商品的数量*/
            var _t = this;
            common.js.ajx(reqUrl.ser+"shoppingCart/getCartNum.action", {}, function(data){
                if(data.infocode === '0'){
                    if(data.info === 0){
                        $('.ui-cart').hide();
                        $('.cart_none').show();
                        return;
                    }
                    _t.listCart();   /*获取购物车详情*/
                }else{
                    alert(data.info);
                }
            },_t.errorFn);
        },
        listCart: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser+"shoppingCart/listCart.action", {}, function(data){
                if(data.infocode === '0') _t.initCart(data);
                else alert(data.info);
            },_t.errorFn);
        },
        bindEvent: function(){
            var _t = this;
            /*-操作*/
            $(".reduce").off().one("tap", function(){
                $(".reduce").off();
                if(Number($(this).siblings(".num_1").children().val()) != 1){
                    _t.changeGoodsTotal($(this).siblings(".num_1").children(), -1);
                }
                
            });
            /*+操作*/
            $(".plus").off().one("tap", function(){
                $(".plus").off();
                if(Number($(this).siblings(".num_1").children().val()) < 99){
                    _t.changeGoodsTotal($(this).siblings(".num_1").children(), 1);
                }
                    
                
            });
            
            /*输入框失去焦点*/
            $(".txt").off().one("blur", function(){
                if(isNaN(Number($(this).val())) || Number($(this).val()) < 1)
                    $(this).val(1);
                else if(Number($(this).val()) >= 99)
                    $(this).val(99);
                else
                    $(this).val(parseInt($(this).val()));
                _t.changeGoodsTotal(this);
            });
            
            /*全选*/
           $(".cart_check_l i").off().one("tap", function(){
                lib.onLoading();
                if($(this).hasClass("none")){
                    $(".cart_goods_c i").removeClass("none");
                    $(".cart_check_l").html('<i class=""></i>全不选');
                    
                    common.js.ajx(reqUrl.ser+"shoppingCart/updateAllOpt.action", {}, function(data){
                        _t.mjmz(data);
                    }, _t.errorFn);
                }else{
                    $(".cart_goods_c i").addClass("none");
                    $(".cart_check_l").html('<i class="none"></i>全选');
                    common.js.ajx(reqUrl.ser+"shoppingCart/clearOpt.action", {}, function(data){
                        _t.mjmz(data);
                    }, _t.errorFn);
                }
                _t.bindEvent();
                    
            });
            
            /*删除*/
           $(".cart_goods_del i").off().on("tap", function(){
               if(!confirm("您是否要删除该商品？")){
                   return;
               }
                lib.onLoading();
                var _o = this;
                var _oP = $(_o).parents((".ui-maijia-list"));
                common.js.ajx(reqUrl.ser+"shoppingCart/deleteOne.action", {goodsId:$(_o).attr("data-gooodsid")}, function(data){
                    if(data.infocode === "0"){
                        $(_o).parents(".ui-maijia-list").children(".cart_goods.clearfix").length === 1 ? $(_o).parents(".ui-maijia-list").remove() : "";  
                        $(_o).parents(".cart_goods.clearfix").remove();
                        _t.mjmz(data);
                        
                    }else{
                        alert("删除失败");
                    }
                }, _t.errorFn);
            });
            
            /*每个商品是否选中*/
            $(".cart_goods_c i").off().one("tap", function(){
                lib.onLoading();
                $(this).hasClass("none") ? $(this).removeClass("none") : $(this).addClass("none");
                if($(".cart_list .cart_goods_c i").hasClass("none"))
                    $(".cart_check_l i").addClass("none");
                else
                    $(".cart_check_l i").removeClass("none");
                common.js.ajx(reqUrl.ser+"shoppingCart/updateOpt.action", {goodsId: $(this).attr("data-gooodsid")}, function(data){
                    if(data.infocode === "0"){
                        _t.mjmz(data);
                    }
                }, _t.errorFn);
            });
            
            $(".cart_goods_img").off().on("tap", function(){
                lib.onLoading();
                var _this = $(this).prev().children("i");
                $(_this).hasClass("none") ? $(_this).removeClass("none") : $(_this).addClass("none");
                if($(".cart_list .cart_goods_c i").hasClass("none"))
                    $(".cart_check_l i").addClass("none");
                else
                    $(".cart_check_l i").removeClass("none");
                common.js.ajx(reqUrl.ser+"shoppingCart/updateOpt.action", {goodsId: $(_this).attr("data-gooodsid")}, function(data){
                    if(data.infocode === "0"){
                        _t.mjmz(data);
                    }
                }, _t.errorFn);
            });
            
            /*一键清空*/
            $(".cart_check_r").off().on("tap", function(){
                if($(this).prev().children().hasClass("none")){
                    alert("请先选中所有商品");
                    return;
                }
                if(!confirm("您确定清空购物车吗?")){
                    return;
                }
                lib.onLoading();
                common.js.ajx(reqUrl.ser+"shoppingCart/clearCart.action", {}, function(data){
                    if(data.infocode === "0"){
                        $('.ui-cart').hide();
                        $('.cart_none').show();
                    }
                }, _t.errorFn);
                    
            });
           
            /*结算提交*/
            $('.ui-submit-buttom:not(.ui-ing)').off().on("tap", function(){
                if(lib.checkWeiXin() && $.cookie("member_loginName").length !== 11){
                    location = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                    return;
                }
                if($(".cart_goods_c i:not(.none)").length === 0){
                    alert("至少选择一个商品");
                    return;
                }
                var _this = this;
               $(_this).addClass("ui-ing"); /*防止多次提交*/ 
               lib.onLoading();
               common.js.ajx(reqUrl.ser+"shoppingCart/toBalance.action", {}, function(data){
                   if(data.infocode === "0"){
                       location.href = "order/dingdanqr.html";
                   }else{
                       alert(data.info);
                       if(data.infocode === "1"){
                            location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                        }
                       $(_this).removeClass("ui-ing");
                   }
               }, function(){
                   $(_this).removeClass("ui-ing");
               });
            });
        },
        initCart: function(data){
            var _t = this;
            var _sellerInfoList = data.info.sellerInfoList;
            $(".ui-all-goods-price").text("￥"+data.info.goodsPriceTotal); /*总金额*/
            $(".ui-all-goods-num").text("("+data.info.goodsNumTotal+")"); /*选中商品总数量*/
            if(data.info.isAll === "1") $(".cart_check_l i").removeClass("none");
            var h = "";
            _t.noPassList = data.info.noPassList;
            $.each(_sellerInfoList, function(K, V) {
                h += '<div class="ui-maijia-list" '+ (V.normalList.length === 0 && V.bindList.length === 0 && V.priceReduceList.length === 0 && V.manJianList.length === 0 && V.buyGiftList.length === 0 && V.flashList.length ===0 ? 'style="display:none"' : '' ) +' data-seller="'+ V.sellerId +'"><a class="cart_list_d" href="/?mId='+ V.memberId +'">'+ V.sellerName +'</a>';
                
                /*正常商品*/
                $.each(V.normalList, function(k, v){
                    h += '<div class="cart_goods clearfix" id="ui-goods-'+ v.goodsId +'"><div class="cart_goods_c"><i data-gooodsid="'+ v.goodsId +'" class="'+ (v.isOpt === 0 ? 'none' : '') +'"></i></div>'+
                          '<div class="cart_goods_img"><a href="javascript:;"><img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'"/></a></div>'+
                          '<div name="ui-xiaoji-'+ v.goodsId +'" class="cart_goods_del" data-marketPrice="'+ v.marketPrice +'" data-btcPrice="'+ v.btcPrice +'"><p name="ui-per-gooods-total-price" class="red_t">￥'+ v.btcPrice +'</p><p class="through">'+ (v.limitcoupon !== "0.00" ? "红包立减" + v.limitcoupon + "元" : "") +'</p>'+
                          '<a href="javascript:;"><i data-gooodsid="'+ v.goodsId +'"></i></a></div><div class="cart_goods_list">'+
                          '<h2><a href="/g?mId='+ V.sellerId +'&gId='+ v.goodsId +'"><nobr>' + v.goodsName + '</nobr></a></h2>'+
                          /*'<h3><a href="javascript:;"><nobr>'+ v.goodsEnName +'</nobr></a></a></h3>'+*/
                          '<div class="num"><span class="reduce">-</span><span class="plus">+</span><div class="num_1">'+
                          '<input type="text" name="ui-per-goods-num" class="txt" data-goodsid="'+ v.goodsId +'" value="'+ v.goodsNum +'"  data-org="'+ v.goodsNum +'"/></div></div></div></div>';
                });
                /*捆绑*/
                $.each(V.bindList, function(k, v){
                    h += '<div class="cart_goods clearfix"  id="ui-goods-'+ v.goodsId +'"><div class="cart_goods_c"><i data-gooodsid="'+ v.goodsId +'" class="'+ (v.isOpt === 0 ? 'none' : '') +'"></i></div>'+
                          '<div class="cart_goods_img"><a href="javascript:;"><img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></a></div>'+
                          '<div name="ui-xiaoji-'+ v.goodsId +'" class="cart_goods_del" data-marketPrice="'+ v.marketPrice +'" data-btcPrice="'+ v.btcPrice +'"><p name="ui-per-gooods-total-price" class="red_t">￥'+ v.btcPrice +'</p><p class="through">'+ (v.limitcoupon !== "0.00" ? "红包立减" + v.limitcoupon + "元" : "") +'</p>'+
                          '<a href="javascript:;"><i data-gooodsid="'+ v.goodsId +'"></i></a></div><div class="cart_goods_list">'+
                          '<h2><a href="/g?mId='+ V.sellerId +'&gId='+ v.goodsId +'"><nobr>' + v.goodsName + '</nobr></a></h2>'+
                          /*'<h3><a href="javascript:;"><nobr>'+ v.goodsEnName +'</nobr></a></a></h3>'+*/
                          '<div class="num"><span class="reduce">-</span><span class="plus">+</span><div class="num_1">'+
                          '<input type="text" name="ui-per-goods-num" class="txt" data-goodsid="'+ v.goodsId +'" value="'+ v.goodsNum +'" data-org="'+ v.goodsNum +'"/></div></div></div></div>';
                });
                 /*减价*/
                $.each(V.priceReduceList, function(k, v){
                    h += '<div class="cart_goods clearfix"  id="ui-goods-'+ v.goodsId +'"><div class="cart_goods_c"><i data-gooodsid="'+ v.goodsId +'" class="'+ (v.isOpt === 0 ? 'none' : '') +'"></i></div>'+
                          '<div class="cart_goods_img"><a href="javascript:;"><img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></a></div>'+
                          '<div name="ui-xiaoji-'+ v.goodsId +'" class="cart_goods_del" data-marketPrice="'+ v.marketPrice +'" data-btcPrice="'+ v.btcPrice +'"><p name="ui-per-gooods-total-price" class="red_t">￥'+ v.btcPrice +'</p><p class="through">'+ (v.limitcoupon !== "0.00" ? "红包立减" + v.limitcoupon + "元" : "") +'</p>'+
                          '<a href="javascript:;"><i data-gooodsid="'+ v.goodsId +'"></i></a></div><div class="cart_goods_list">'+
                          '<h2><a href="/g?mId='+ V.sellerId +'&gId='+ v.goodsId +'"><nobr>' + v.goodsName + '</nobr></a></h2>'+
                          /*'<h3><a href="javascript:;"><nobr>'+ v.goodsEnName +'</nobr></a></a></h3>'+*/
                          '<div class="num"><span class="reduce">-</span><span class="plus">+</span><div class="num_1">'+
                          '<input type="text" name="ui-per-goods-num" class="txt" data-goodsid="'+ v.goodsId +'" value="'+ v.goodsNum +'"  data-org="'+ v.goodsNum +'"/></div></div></div><div class="ind_sx_lo"><img src="/images/buy/list_5.png"></div></div>';
                });
                
                 /*满减*/
                $.each(V.manJianList, function(k1, v1){
                    h += '<div name="ui-manjian" class="cart_list_mj clearfix" ';
                    if(V.manJianList.length){   /*是否有满减*/
                        h += '>';
                        h += '<a href="/buyer/liebiao.html?aId='+ v1.activeId +'">去凑单&gt;</a><div>【满减】: '+ v1.desc +'</div>';       
                    }else{
                        h += 'style="display:none">';
                    }
                    h += '</div>';
                    
                    /*h += '<div name="ui-manzeng" class="cart_list_mj clearfix"';
                    if(V.orderGiveName && V.orderGiftItemList){   //是否有满赠
                        h += '>';
                        $.each(V.orderGiftItemList, function(i, val) {
                            h += '<div>【满赠】'+ val.freeName +'（订单完成后自动发放） X'+ val.freeNum +'</div>';                             
                        });

                    }else{
                        h += "style='display: none'>";
                    }
                    h += '</div>';*/
                    $.each(v1.goodsList, function(k, v){
                        h += '<div class="cart_goods clearfix"  id="ui-goods-'+ v.goodsId +'"><div class="cart_goods_c"><i data-gooodsid="'+ v.goodsId +'" class="'+ (v.isOpt === 0 ? 'none' : '') +'"></i></div>'+
                              '<div class="cart_goods_img"><a href="javascript:;"><img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></a></div>'+
                              '<div name="ui-xiaoji-'+ v.goodsId +'" class="cart_goods_del" data-marketPrice="'+ v.marketPrice +'" data-btcPrice="'+ v.btcPrice +'"><p name="ui-per-gooods-total-price" class="red_t">￥'+ v.btcPrice +'</p><p class="through">'+ (v.limitcoupon !== "0.00" ? "红包立减" + v.limitcoupon + "元" : "") +'</p>'+
                              '<a href="javascript:;"><i data-gooodsid="'+ v.goodsId +'"></i></a></div><div class="cart_goods_list">'+
                              '<h2><a href="/g?mId='+ V.sellerId +'&gId='+ v.goodsId +'"><nobr>' + v.goodsName + '</nobr></a></h2>'+
                              /*'<h3><a href="javascript:;"><nobr>'+ v.goodsEnName +'</nobr></a></a></h3>'+*/
                              '<div class="num"><span class="reduce">-</span><span class="plus">+</span><div class="num_1">'+
                              '<input type="text" name="ui-per-goods-num" class="txt" data-goodsid="'+ v.goodsId +'" value="'+ v.goodsNum +'"  data-org="'+ v.goodsNum +'"/></div></div></div><div class="ind_sx_lo"><img src="/images/buy/list_3.png"></div></div>';
                    
                    });
                });
                /*买赠*/
                $.each(V.buyGiftList, function(k, v){
                    h += '<div class="cart_goods clearfix"  id="ui-goods-'+ v.goodsId +'"><div class="cart_goods_c"><i data-gooodsid="'+ v.goodsId +'" class="'+ (v.isOpt === 0 ? 'none' : '') +'"></i></div>'+
                          '<div class="cart_goods_img"><a href="javascript:;"><img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></a></div>'+
                          '<div name="ui-xiaoji-'+ v.goodsId +'" class="cart_goods_del" data-marketPrice="'+ v.marketPrice +'" data-btcPrice="'+ v.btcPrice +'"><p name="ui-per-gooods-total-price" class="red_t">￥'+ v.btcPrice +'</p><p class="through">'+ (v.limitcoupon !== "0.00" ? "红包立减" + v.limitcoupon + "元" : "") +'</p>'+
                          '<a href="javascript:;"><i data-gooodsid="'+ v.goodsId +'"></i></a></div><div class="cart_goods_list">'+
                          '<h2><a href="/g?mId='+ V.sellerId +'&gId='+ v.goodsId +'"><nobr>' + v.goodsName + '</nobr></a></h2>'+
                          /*'<h3><a href="javascript:;"><nobr>'+ v.goodsEnName +'</nobr></a></a></h3>'+*/
                          '<div class="num"><span class="reduce">-</span><span class="plus">+</span><div class="num_1">'+
                          '<input type="text" name="ui-per-goods-num" class="txt" data-goodsid="'+ v.goodsId +'" value="'+ v.goodsNum +'"  data-org="'+ v.goodsNum +'"/></div></div></div><div class="ind_sx_lo"><img src="/images/buy/list_2.png"></div></div>';
                         
                    h += '<div name="ui-maizeng" style="text-align: center;" class="cart_list_mj clearfix"';
                    if(v.buyGiftItemList){
                        h += ">";
                        $.each(v.buyGiftItemList, function(i, val){
                                h += '<div style="color:#ff7800">【买赠】'+ val.freeName +'（订单完成后自动发放） X'+ val.freeNum +'</div>';  
                        });
                    }else{
                        h += "style='display: none'>";
                    }
                    h += '</div>';
                            
                });
                /*闪购*/
                $.each(V.flashList, function(k, v){
                    h += '<div class="cart_goods clearfix" id="ui-goods-'+ v.goodsId +'"><div class="cart_goods_c"><i data-gooodsid="'+ v.goodsId +'" class="'+ (v.isOpt === 0 ? 'none' : '') +'"></i></div>'+
                          '<div class="cart_goods_img"><a href="javascript:;"><img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></a></div>'+
                          '<div name="ui-xiaoji-'+ v.goodsId +'" class="cart_goods_del" data-marketPrice="'+ v.marketPrice +'" data-btcPrice="'+ v.btcPrice +'"><p name="ui-per-gooods-total-price" class="red_t">￥'+ v.btcPrice +'</p><p class="through">'+ (v.limitcoupon !== "0.00" ? "红包立减" + v.limitcoupon + "元" : "") +'</p>'+
                          '<a href="javascript:;"><i data-gooodsid="'+ v.goodsId +'"></i></a></div><div class="cart_goods_list">'+
                          '<h2><a href="/g?mId='+ V.sellerId +'&gId='+ v.goodsId +'"><nobr>' + v.goodsName + '</nobr></a></h2>'+
                          /*'<h3><a href="javascript:;"><nobr>'+ v.goodsEnName +'</nobr></a></a></h3>'+*/
                          '<div class="num"><span class="reduce">-</span><span class="plus">+</span><div class="num_1">'+
                          '<input type="text" name="ui-per-goods-num" class="txt" data-goodsid="'+ v.goodsId +'" value="'+ v.goodsNum +'"  data-org="'+ v.goodsNum +'"/></div></div></div><div class="ind_sx_lo"><img src="/images/buy/list_0.png"></div></div>';
                });
                h += '<div class="cart_all clearfix"><p class="money">本店合计:<span class="ui-per-seller-t-p">￥'+ V.goodsPriceOneSeller +'</span></p><p>共有<span class="ui-per-seller-t-n">'+ V.goodsNumOneSeller +'</span>件商品</p></div>';
                h += "</div>";
            });
            $(".cart_list").empty().append(h);
            $(".cart_goods_img img").css("height", _t._imgH);
            _t.bindEvent();
            $("body").scrollTop(_t.scrollTop);
            setTimeout(function(){
                $.each(_t.noPassList, function(k, v){
                    $("body").scrollTop(document.getElementById('ui-goods-'+v.goodsId).offsetTop);
                    $('#ui-goods-'+v.goodsId).css("border", "1px solid red");
                    //alert(v.goodsName + v.desc);
                    //$('#ui-goods-'+v.goodsId).css({"border": "none","border-bottom": "1px solid #ddd"});
                });
            },100);
            
            if($(".cart_goods_c i").length === 0){
                $('.ui-cart').hide();
                $('.cart_none').show();
            }
            
        },
        changeGoodsTotal: function(obj, flag){ /*改变每个商品的总价格*/
            var _t = this;
            var _obj = $(obj);
            var gNum = flag ? Number(_obj.val()) + flag : Number(_obj.val());
            if(!flag && gNum === Number(_obj.attr('data-org'))){
                return;
            }
            var goodsid = _obj.data("goodsid");
            lib.onLoading();
            common.js.ajx(reqUrl.ser+"shoppingCart/updateNum.action?t="+new Date().getTime(), {goodsId: goodsid, goodsNum: gNum}, function(data){
                if(data.infocode === "0"){
                    _t.mjmz(data);
                }else if(data.infocode === "2"){
                    alert("该商品目前最多只能买"+data.info+"件");
                    _obj.val(data.info);
                    gNum = data.info;
                }else{
                    alert(data.info);
                }
                _t.bindEvent();
            },_t.errorFn);
            /*当数量变化时 改变单个商品的总价个*/
        },
        errorFn: function(){
            console.log("数据请求失败");
        },
        mjmz: function(d){
            /*当价格变化时判断是否满足满减满赠*/
            var _t = this;
            _t.initCart(d);
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                _t.scrollTop = $(window).scrollTop();
            });
        }
        
    });
    cart.init();
});