require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    var tianjiadakasp = {};
    $.extend(tianjiadakasp, {
        data: {goodsName: "", page: 1, rows: 20, orderReduceId: common.tools.getUrlParam("oId")},
        avtivityUrl:{'manjian': 'orderReduce/saveAllReduceGoods.action'},
        getGoodsUrl:{"zymanjian": "goodsGive/getMemberMainGoodsList.action",'gift': "goodsGive/getMemberFollowGoodsList.action",'manjian': 'orderReduce/getGoodsByMemberId.action','kunbang': 'goodsBase/proprietaryGoodsBaseList.action', "maizeng": "goodsGive/getMemberMainGoodsList.action"},
        noMoreGoods: false,
        init: function(){
            var _t = this;
            if("kunbang" === sessionStorage.avtivityFlag){
                _t.data = {goodsName: "", page: 1, rows: 20};
                sessionStorage.divAndGoodsInfo ? "" : sessionStorage.divAndGoodsInfo = "";
            }else if("maizeng" === sessionStorage.avtivityFlag || "gift" === sessionStorage.avtivityFlag){
                _t.data = {goodsName: "", page: 1, rows: 20, startTime: JSON.parse(sessionStorage.activityTime).startTime, endTime: JSON.parse(sessionStorage.activityTime).endTime};
                if("gift" === sessionStorage.avtivityFlag){
                    _t.data.mainGoodsId = common.tools.getUrlParam("gId");
                }
                sessionStorage.divAndGoodsInfo ? "" : sessionStorage.divAndGoodsInfo = "";
            }else if("zymanjian" === sessionStorage.avtivityFlag){
                _t.data = {goodsName: "", page: 1, rows: 20, startTime: JSON.parse(sessionStorage.pageInfo).startTime, endTime: JSON.parse(sessionStorage.pageInfo).endTime};
            }else if("h5" === sessionStorage.avtivityFlag){
                _t.data = {goodsKeywords: "", page: 1, rows: 20};
            }
            _t[sessionStorage.avtivityFlag]();
            _t.bindEvent();
            _t.roll();
        },
        doData: function(listName){
            var _t = this;
            common.js.ajx(reqUrl.ser + _t.getGoodsUrl[sessionStorage.avtivityFlag], _t.data, function(data){
                $(".search1_btn").removeClass("ui-ing");
                if(data.infocode === "0"){
                    if(data.info[listName].length === 0){
                        _t.noMoreGoods = true;
                        if(_t.data.page === 1){
                            alert("没查询到任何商品");
                            $(".wd_btn").hide();
                        }
                    } 
                    _t.data.page++ === 1 ? $(".orderunit:not(.search)").empty() : '';
                    var h = "";
                    $.each(data.info[listName], function(k, v){
                        h += '<div class="goodslist" data-goodsId="'+ v.goodsId +'" data-goodsInfo="'+ v.mainPictureJPG + '_' + v.chName + '_' + v.enName + '_' + (v.sellingPrice ? v.sellingPrice : v.price) + '_' + (v.inventoryNum ? v.inventoryNum : 0) +'"><dl><span class="select_btn cur"></span>'+
                            '<dt style="min-height: 50px;margin-left: 22px;"><a href="javascript:;"><img src="'+ reqUrl.imgPath + _lib.getImgSize(v.mainPictureJPG, 'A') +'"></a></dt>'+
                            '<dd><ul><li><a href="javascript:;">'+ v.chName +'</a></li>'+
                            '<li><a href="javascript:;">'+ v.enName +'</a></li>'+
                            '<li class="ui-goods-c" style="bottom: 9px;">￥'+ (v.sellingPrice ? v.sellingPrice : v.price) +'<span>库存：'+ (v.inventoryNum ? v.inventoryNum : 0)+'件</span></li>'+
                            '</ul></dd></dl></div>';
                    });
                    $(".orderunit:not(.search)").append(h);
                }else if(data.infocode !== "3"){
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }else{
                    _t.noMoreGoods = true;
                    return;
                }
            }, _t.errFn);
        },
        h5: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "goodsBase/proprietaryGoodsBaseBymember.action", _t.data, function(data){
                $(".search1_btn").removeClass("ui-ing");
                if(data.infocode === "0"){
                    if(data.info["list_goodsBase"].length === 0){
                        _t.noMoreGoods = true;
                        if(_t.data.page === 1){
                            alert("没查询到任何商品");
                            $(".wd_btn").hide();
                        }
                    } 
                    _t.data.page++ === 1 ? $(".orderunit:not(.search)").empty() : '';
                    var h = "";
                    $.each(data.info["list_goodsBase"], function(k, v){
                        h += '<div class="goodslist" data-goodsId="'+ v.goodsId +'" data-goodsInfo="'+ v.mainPictureJPG + '_' + v.chName + '_' + v.enName + '_' + v.sellingPrice + '_' + v.marketPrice +'"><dl><span class="select_btn cur"></span>'+
                            '<dt style="min-height: 50px;margin-left: 22px;"><a href="javascript:;"><img src="'+ reqUrl.imgPath + _lib.getImgSize(v.mainPictureJPG, 'A') +'"></a></dt>'+
                            '<dd><ul><li><a href="javascript:;">'+ v.chName +'</a></li>'+
                            '<li><a href="javascript:;">'+ v.enName +'</a></li>'+
                            '<li class="ui-goods-c" style="bottom: 9px;">￥'+ (v.sellingPrice ? v.sellingPrice : v.price) +'<span>返利：'+ (v.price ? v.price : 0)+'元</span></li>'+
                            '</ul></dd></dl></div>';
                    });
                    $(".orderunit:not(.search)").append(h);
                }else if(data.infocode !== "3"){
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }else{
                    _t.noMoreGoods = true;
                    return;
                }
            }, _t.errFn);
        },
        maizeng: function(){
            var _t = this;
            _t.doData("mainGoodsList");
        },
        gift: function(){
            var _t = this;
            _t.doData("followGoodsList");
        },
        //获取可以参见满减活动的商品
        manjian: function(){
            var _t = this;
            _t.doData("goodsList");
        },
        //获取可以参见满减活动的商品
        zymanjian: function(){
            var _t = this;
            _t.doData("mainGoodsList");
        },
        kunbang: function(){
            var _t = this;
            _t.doData("list_goodsBase");
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", ".wd_btn", function(){
                if("manjian" === sessionStorage.avtivityFlag){
                    var param = '';
                    $.each($(".select_btn:not(.cur)"), function(k, v){
                        param += "goodsIds=" + $(this).parents(".goodslist").attr("data-goodsId") + "&";
                    });
                    if(param.length === 0){
                        alert("请选择相应商品");
                        return;
                    }
                    param += 'orderReduceId=' + sessionStorage.mmjOId; 
                    common.js.ajx(reqUrl.ser + _t.avtivityUrl[sessionStorage.avtivityFlag] + '?' + param, {},function(data){
                        alert(data.info);
                        if(data.infocode === "0") location.href = sessionStorage.backUrl;
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }, _t.errFn);
                }else if("kunbang" === sessionStorage.avtivityFlag){
                    if($(".select_btn:not(.cur)").length === 0){
                        alert("请选择相应商品");
                        return;
                    }
                    if(sessionStorage.divAndGoodsInfo.indexOf($(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsId")) > -1){
                        alert("该商品已经选中，请选择其他商品");
                        return;
                    }
                    if(sessionStorage.divAndGoodsInfo)
                        sessionStorage.divAndGoodsInfo += '^' ;
                    sessionStorage.divAndGoodsInfo += sessionStorage.divIndex + "_" + $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsId") + "_" +$(".select_btn:not(.cur)").parents(".goodslist").find("dd > ul > li:eq(0)").text();
                    location.href = sessionStorage.backUrl;
                }else if("maizeng" === sessionStorage.avtivityFlag){
                    if($(".select_btn:not(.cur)").length === 0){
                        alert("请选择相应商品");
                        return;
                    }
                    sessionStorage.divAndGoodsInfo = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsId") + "_" +$(".select_btn:not(.cur)").parents(".goodslist").find("dd > ul > li:eq(0)").text();
                    location.href = sessionStorage.backUrl;
                }else if("gift" === sessionStorage.avtivityFlag){
                    if($(".select_btn:not(.cur)").length === 0){
                        alert("请选择相应商品");
                        return;
                    }
                    sessionStorage.giftInfo = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsId") + "_" +$(".select_btn:not(.cur)").parents(".goodslist").find("dd > ul > li:eq(0)").text();
                    location.href = sessionStorage.backUrl;
                }else if("zymanjian" === sessionStorage.avtivityFlag){
                    if($(".select_btn:not(.cur)").length === 0){
                        alert("请选择相应商品");
                        return;
                    }
                    var d = sessionStorage.goodsInfo　?　JSON.parse(sessionStorage.goodsInfo)　:　{};
                    $.each($(".select_btn:not(.cur)"), function(k, v){
                        d[$(v).parents(".goodslist").attr("data-goodsId")] = $(v).parents(".goodslist").attr("data-goodsInfo");
                    });
                    sessionStorage.goodsInfo = JSON.stringify(d);
                    location.href = sessionStorage.backUrl;
                }else if("h5" === sessionStorage.avtivityFlag){
                    if($(".select_btn:not(.cur)").length === 0){
                        alert("请选择相应商品");
                        return;
                    }
                    var flag = true; data = {}, arr = (sessionStorage.goodsInfo && "undefined" !== sessionStorage.goodsInfo) ? JSON.parse(sessionStorage.goodsInfo) : [];
                    data.goodsId = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsId");
                    data.mainPictureJPG = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsInfo").split("_")[0];
                    data.chName = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsInfo").split("_")[1];
                    data.enName = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsInfo").split("_")[2];
                    data.sellingPrice = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsInfo").split("_")[3];
                    data.marketPrice = $(".select_btn:not(.cur)").parents(".goodslist").attr("data-goodsInfo").split("_")[4];
                    $.each(arr, function(k, v){
                        if(v.goodsId === data.goodsId){
                           /*if(!confirm("该商品已经选中,是否再次选择")){
                               flag = false;
                           }*/
                          alert("该商品已经选择,请选择其他商品");
                          flag = false;
                          return false;
                        }
                    });
                    if(flag){
                        arr.push(data);
                        sessionStorage.goodsInfo = JSON.stringify(arr);
                        location.href = "/share/h5.html";
                    }
                        
                }
                    

            });
            //根据不同的活动判断是多选还是单选商品
            $(document).on("tap", ".select_btn", function(){
                if(["kunbang", "maizeng", "gift", "h5"].indexOf(sessionStorage.avtivityFlag) > -1){
                    $(".select_btn").addClass("cur");
                    $(this).removeClass("cur");
                    return;
                }
                $(this).hasClass("cur") ? $(this).removeClass("cur") : $(this).addClass("cur");
            });
            //输入框失去焦点时的操作
            $(document).on("blur", ".goodslist input.txt", function(){
                isNaN(Number($(this).val())) ? $(this).val($(this).attr("data-org")) : "";
            });
            
            //查询按钮
            $(document).on("tap", ".search1_btn:not(.ui-ing)", function(){
                $(this).addClass("ui-ing");
                if("kunbang" === sessionStorage.avtivityFlag || "h5" === sessionStorage.avtivityFlag){
                    _t.data.goodsKeywords = $(".search1_txt input").val().trim();
                }else{
                    _t.data.goodsName = $(".search1_txt input").val().trim();
                }
                
                if((_t.data.goodsName && "" === _t.data.goodsName) && (_t.data.goodsKeywords && "" ===  _t.data.goodsKeywords)){
                    $(".search1_btn").removeClass("ui-ing");
                    _t.showErrorMessage($(".ui-message"), "请输入商品名称");
                    return;
                }
                _t.data.page = 1;
               
                _t[sessionStorage.avtivityFlag](_t.data);
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
                if(!_t.noMoreGoods &&　$(window).scrollTop() === $(document).height() - $(window).height()){
                    _t[sessionStorage.avtivityFlag](_t.data);
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