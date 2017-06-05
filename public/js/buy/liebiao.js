require.config({baseUrl: '/js/lib', paths:{swiper: "swiper.min"}});
require(['zepto', 'lib', 'swiper'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    $(function(){
        var liebiao = {};
        var noMoreGoods = false;
        window.data = {
            'classId': common.tools.getUrlParam('id'),
            'page': 1,
            'rows': 20,
            'goodsKeywords': common.tools.getUrlParam('goodsKeywords'),
            'memberId': common.tools.getUrlParam('sId') || $.cookie("maimaicn_s_id") || 1,
            orderReduceId: common.tools.getUrlParam("aId")
            };
        $.extend(liebiao, {
            slider1: "",
            isflash: sessionStorage.getItem("mm_cp20160824")  ===  "mm_detail_20160824" ? false : true,
            id: common.tools.getUrlParam('id'),
            sName: 'collectNum',
            sList: ['collectNum', 'sellShowNumber', 'newGoods', 'price'],
            gKeys: lib.getUrlParam("gk") ? lib.getUrlParam("gk") : common.tools.getUrlParam('goodsKeywords'),
            rows: window.data.rows,
            imgH: (document.documentElement.clientWidth * 0.8 * 0.495) + "px",
            maxImgH: (640* 0.8 * 0.495) + "px",
            aId: common.tools.getUrlParam('aId'),
            memberId: common.tools.getUrlParam('sId') || $.cookie("maimaicn_s_id") || 1,
            url: common.tools.getUrlParam("aId") && $('.lieb_search_cen input').val().trim() === "" ? "goodsBase/goodsBaseListInfoByActive.action" : "goodsBase/goodsBaseListInfo.action",
            init: function(){
                var _t = this;
                if(!history.state){
                    //初始化history
                    history.pushState({'page': window.data.page, 'scrollTop': 0}, '', "?id=" + _t.id + "&collectNum=0&gk=" + _t.gKeys + '&aId=' + _t.aId);
                }else if(!_t.isflash){
                    window.data.rows = history.state.page * _t.rows;
                }else{
                    history.replaceState({'page': window.data.page, 'scrollTop': 0}, '', "?id=" + _t.id + "&collectNum=0&gk=" + _t.gKeys + '&aId=' + _t.aId);
                }

                $.each(_t.sList, function(k, v) {
                    if(common.tools.getUrlParam(v) !== ""){
                        _t.sName = v;
                        window.data[v] = common.tools.getUrlParam(v);
                        $(".mall_tab > a:eq("+ k +")").addClass("active").siblings().attr("class", "");
                        if(common.tools.getUrlParam(v) === "1"){
                            $(".mall_tab > a:eq("+ k +")").addClass("up");
                        }
                        return false;
                    }
                });

                if(_t.gKeys){
                    $("#searchForm input").val(_t.gKeys);
                    window.data["goodsKeywords"] = _t.gKeys;
                    _t.url = "goodsBase/goodsBaseListInfo.action";

                }

                common.tools.getUrlParam("aId") ? window.data.orderReduceId = common.tools.getUrlParam("aId") : "";
                _t.slider();
                _t.tabClick();//选项卡
                //_t.getMemberGoodsClassInfo();
                _t.getGoodsList(window.data, true);
                _t.roll();
                $('.lieb_search_cen input').val(window.data['goodsKeywords']);
                $(".swiper-container").css("height", (document.documentElement.clientHeight - 92) + 'px');
                 //common.tools.fixedFooter(1);//分类
                                 var Oheight=$("body").height()/2;
                                     this.click();//回到顶部
                                     this.scroll(Oheight);



            },
						//*******zetpo*****************
						click:function(){
							$.fn.scrollTo =function(options){
						var defaults = {
								toT : 0,    //滚动目标位置
								durTime : 500,  //过渡动画时间
								delay : 30,     //定时器时间
								callback:null   //回调函数
						};
						var opts = $.extend(defaults,options),
								timer = null,
								_this = this,
								curTop = _this.scrollTop(),//滚动条当前的位置
								subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
								index = 0,
								dur = Math.round(opts.durTime / opts.delay),
								smoothScroll = function(t){
										index++;
										var per = Math.round(subTop/dur);
										if(index >= dur){
												_this.scrollTop(t);
												window.clearInterval(timer);
												if(opts.callback && typeof opts.callback == 'function'){
														opts.callback();
												}
												return;
										}else{
												_this.scrollTop(curTop + index*per);
										}
								};
						timer = window.setInterval(function(){
								smoothScroll(opts.toT);
						}, opts.delay);
						return _this;
				};
									$("#return_top").on("click",function(){
								$("body").scrollTo({toT:0});

									});
									},
                        scroll:function(Oheight){
                            $(window).on("scroll",function () {
															if($(this).scrollTop()>Oheight){
			                            $("#return_top").css({"opacity":1});
			                        }else{
			                            $("#return_top").css({"opacity":0});
			                        }
                            });
                        },
            slider: function(){
                var _t=this;
                _t.slider1 = new Swiper('.swiper-container', {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    onTouchStart: function(swiper){
                        _t.sTP = swiper.translate;
                    },
                    onTouchEnd: function(swiper){
                        _t.eTP = swiper.translate;
                    }
                });
            },
            tabClick: function(){
                var curObj, _t = this;
                $(document).on("tap", ".fixed_r ul li", function(e){
                    var target = e.srcElement ? e.srcElement : e.target;
                    if(!(target.getAttribute("href") === "javascript:;" || target.className.indexOf("ui-transd-999") > -1)){
                        return;
                    }
                    if(_t.eTP !== _t.sTP) return;
                    var n = $(this).index();
                    $(this).addClass("active").siblings().removeClass("active");
                    $(".fixed_chlid").removeClass("on");
                    if(curObj == n){
                        $(this).removeClass("active");
                        curObj=null;
                    }else{
                        $(".fixed_chlid").eq(n).addClass("on");
                        curObj = n;
                    }
                    if($(this).children("div").length <= 0){
                        var data = {classId: $(this).attr("data-id")};
                        if("" !== _t.memberId)
                            data['memberId'] = _t.memberId;
                        common.js.ajx(reqUrl.ser+"goodsClass/getMemberGoodsClassInfo.action", data, function(data){
                            if(data.infocode === "0"){
                                var h = '<div class="fixed_chlid on">';
                                $.each(data.info.list_goodsClass, function(k, v) {
                                    h += '<a href="/buyer/liebiao.html?id='+ v.classId + '&sId=' + _t.memberId +'">'+ v.className +'</a>';
                                });
                                h += '</div>';

                                $(".ui-type-list li.active").append(h);
                                _t.slider1.onResize();
                            }
                        }, _t.errFn);
                    }
                });
                $('.mall_tab a').off().on("touchstart", function(){
                    noMoreGoods = false;
                    var data = {
                        'classId': window.data.classId,
                        'page': 1,
                        'rows': window.data.rows,
                        'goodsKeywords': $('.lieb_search_cen input').val().trim(),
                        'memberId': common.tools.getUrlParam('sId') || $.cookie("maimaicn_s_id") || 1,
                    };
                    data[$(this).data('name')] = 0;
                    if($(this).hasClass("active")){
                        if($(this).hasClass("up"))
                            $(this).removeClass("up");
                        else{
                            $(this).addClass("up");
                            data[$(this).data('name')] = 1;
                        }
                    }
                    $(this).addClass('active').siblings().attr("class", "");
                    window.data = data;
                    _t.sName = $(this).data('name');
                    history.replaceState({'page': 1, 'scrollTop': 0}, '', "?id=" + _t.id + "&"　+ (_t.sName + "=" + (window.data[_t.sName] ? window.data[_t.sName] : 0) + "&gk=" + _t.gKeys + '&aId=' + _t.aId));
                    common.tools.getUrlParam("aId") && $('.lieb_search_cen input').val().trim() === "" ? window.data.orderReduceId = common.tools.getUrlParam("aId") : "" ;
                    _t.url = common.tools.getUrlParam("aId") && $('.lieb_search_cen input').val().trim() === "" ? "goodsBase/goodsBaseListInfoByActive.action" : "goodsBase/goodsBaseListInfo.action";
                    _t.getGoodsList(data, true);
                });

                $(document).on("tap", '.lieb_search_r', function(){
                    searchFun();
                });
                $("#searchForm").on("submit",function(){//手机搜索按钮
                    searchFun();
                });
                function searchFun(){
                    var k = $('.lieb_search_cen input').val().trim();
                    if(k === ""){
                        alert("请输入关键字");
                        return;
                    }
                    window.data['goodsKeywords'] = k;
                    _t.url = "goodsBase/goodsBaseListInfo.action";
                    _t.getGoodsList(window.data, true);
                    $('.lieb_search_cen input').blur();
                    _t.gKeys = k;
                    history.replaceState({'page': 1, 'scrollTop': 0}, '', "?id=" + _t.id + "&"　+ (_t.sName + "=" + (window.data[_t.sName] ? window.data[_t.sName] : 0) + "&gk=" + _t.gKeys + '&aId=' + _t.aId));
                }

                $(".ind_search_list").tap(function(){
                    $("body").scrollTop(0);
                    if($(".swiper-container").hasClass("fadeInR")){
                        $("body").css({"overflow": "auto"});
                        $(".swiper-container").addClass("fadeOutR");
                        $(".swiper-container").removeClass("fadeInR");
                        setTimeout(function(){
                            $(".swiper-container").hide();
                        }, 200);
                    }else{
                         $("body").css({"overflow": "hidden"});
                         $(".swiper-container").show();
                         $(".swiper-container").addClass("fadeInR");
                         _t.slider1.onResize();
                    }
                });
            },
            getGoodsList: function(data, flag){
                var _t = this;
                common.js.ajx(reqUrl.ser + _t.url, data, function(data){
                    if(data.infocode === '2' && !flag){
                        noMoreGoods = true;
                    }else if(data.infocode === '2' || data.infocode === '1'){
                        if(flag) $("#ui-goods-list").empty();
                        alert(data.info);
                        history.back();
                    }else{
                        var gList = data.info.list_goodsBase;
                        if(flag) $("#ui-goods-list").empty();
                        var html = "";
                        $.each(gList, function(v){
                            var sImg = gList[v].activeSignImg && gList[v].activeSignImg !== '8' ? '<img src="/images/buy/list_' +  + gList[v].activeSignImg + '.png" />' : "";
                            var url = '/g?sId=' + ($.cookie("maimaicn_s_id") ||　1) +"&gId="+gList[v].goodsId;
                             html += '<div class="ind_sx_h_l">'+
                                            '<a href="'+url+'">'+
                                                 '<div class="ind_sx_lo">' + sImg + '</div>'+
                                                 '<div class="ind_sx_l_img"><img src="' + reqUrl.imgPath + lib.getImgSize(gList[v].mainPictureJPG, "C") + '" style="height:'+ _t.imgH +';max-height:'+ _t.maxImgH +'" /></div>'+
                                                 '<h3>' +  gList[v].chName + '</h3>'+
                                                 '<p class="dred"><em style="font-size:12px">￥</em>' +  gList[v].sellingPrice + '<span>' + (gList[v].limitcoupon ? "红包立减" + gList[v].limitcoupon + "元" : "") + '</span></p>'+
                                             '</a>'+
                                         '</div>' ;


                        });
                        $("#ui-goods-list").append(html);

                        if(flag && history.state){
                            $(window).scrollTop(history.state.scrollTop);
                            window.data.page = history.state.page;
                            window.data.rows = _t.rows;
                        }
                    }
                },function(){
                    alert("系统繁忙");
                });
            },
            getMemberGoodsClassInfo: function(){
                var data = {}, _t = this;
                if("" !== _t.classId)
                    data['classId'] = _t.classId;
                if("" !== _t.memberId)
                    data['memberId'] = _t.memberId;
                common.js.ajx(reqUrl.ser + "goodsClass/getMemberGoodsClassInfo.action", data, function(data){
                    if(data.infocode === '0'){
                        var h = '';
                        /*$("meta[name=keywords]").content(data.infocode.mallName);
                        $("meta[name=description]").content(data.infocode.mallName);*/
                        if(data.info.list_goodsClass.length === 0) _t.noMore = true;
                        $.each(data.info.list_goodsClass, function(k, v) {
                            //if(v.useStatus === 1)
                            h += '<li class="ui-transd-999" data-id="'+ v.classId +'"><a href="javascript:;">'+ v.className +'</a></li>';
                        });
                        $(".ui-type-list").html(h);
                    }else if(data.infocode === '2'){
                        //$(".ind_search_list").hide();
                    }
                }, _t.errFn);
            },
            roll: function(){
                var _t = this;
                $(window).scroll(function (){
                    if(!noMoreGoods &&　$(window).scrollTop() >= $(document).height() - $(window).height()){
                        window.data.page ++ ;
                        _t.getGoodsList(window.data, false);
                    }

                    history.replaceState({'page': window.data.page, 'scrollTop': $(window).scrollTop()}, '', location.search);
                });
            },
            errFn: function(){
                console.log('数据请求失败');
            }

        });
        liebiao.init();
        window.onpopstate = function(){
            if(!(navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 1))
                history.back();
        }
        window.onunload = function(){
            sessionStorage.removeItem("mm_cp20160824");
        }
        window.onresize = function(){
            $(".ind_sx_h_l .ind_sx_l_img img").css("height", (document.documentElement.clientWidth * 0.8 * 0.495) + "px");
            history.replaceState({'page': window.data.page, 'scrollTop': $(window).scrollTop()}, '', location.search);
        }
        document.addEventListener("orientationchange", function(){
            $(".ind_sx_h_l .ind_sx_l_img img").css("height", (document.documentElement.clientWidth * 0.8 * 0.495) + "px");
            history.replaceState({'page': window.data.page, 'scrollTop': $(window).scrollTop()}, '', location.search);
        });
    });
});
