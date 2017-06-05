define(["lib","rememberThePosition"], function(lib,remosition){
    var goodsListModal = {};
    lib = new lib();
    $.extend(goodsListModal,{
        noMoreGoods: false,
        touchFlag: false,
        classId: $(".sort_tab .active").attr("data-classId"),
        page: parseInt(history.state && history.state.page ? history.state.page : 1),
        rows: 10,
        sortName: "collectNum",
        upOrDown: 0,
        idType: $("#ui-goods-list > div:eq(0)").attr("data-idTYpe"),
        init: function(){
            var _t=this;
            _t.bindEvent();
            _t.slideFun();
            _t.roll();
						var c=_t.getGoodsListByPage1;
						remosition.init(true);
						remosition.renderPage(c);
            if(!history.state){
              $(".mall_tab a:eq(0)").removeClass("up");
              _t.getGoodsListByPage();
            }
            
        },
        slideFun:function(){
            var _t=this;
            if($(".sort_tab .swiper-slide").length > 6){
                new Swiper(".sort_tab", {
                    slidesPerView: 6,
                    paginationClickable: true,
                    direction: "horizontal",
                    freeMode: true
                });
            }
        },
        bindEvent: function(){
            var _t = this;
            /*分类选择*/
            $(".sort_tab").off().on("tap", "a:not(.active)", function(){
                $(this).addClass("active").siblings().removeClass("active");
                _t.classId = $(this).attr("data-classId");
                _t.page = 1;
								var data= {page: _t.page, rows: _t.rows, idType: _t.idType, modelActiveId: modelActiveId};
								data[_t.sortName] = _t.upOrDown;
								if($(".sort_tab").length > 0){
										data["classId"] = _t.classId;
								}
									remosition.replace(data);
                _t.getGoodsListByPage();
            });
            /*排序选择*/
            $(".mall_tab").off().on("tap", "a", function(){

                if($(this).hasClass("up")){
                    $(this).removeClass("up");
                    _t.upOrDown = 0;
                }else if($(this).hasClass("active")){
                    $(this).addClass("up");
                    _t.upOrDown = 1;
                }else{
                    $(this).addClass("active").siblings().attr("class", "swiper-slide");
                    _t.upOrDown = 0;
                }
                _t.sortName = $(this).attr("data-sortName");
                _t.page = 1;
								var data= {page: _t.page, rows: _t.rows, idType: _t.idType, modelActiveId: modelActiveId};
								data[_t.sortName] = _t.upOrDown;
								if($(".sort_tab").length > 0){
										data["classId"] = _t.classId;
								}
									remosition.replace(data);
                _t.getGoodsListByPage();
            });
            /*加入购物车*/
            $("#ui-goods-list").on("tap", ".ind_sx_cart i", function(){
                lib.ajx(lib.getReq().ser+"shoppingCart/addToCart.action", {goodsNum: 1, goodsId: $(this).attr("data-goodsId")}, function(data){
                    if(data.infocode === "0"){
                        lib.getCartNum();
                        alert("成功添加购物车");
                    }else{
                        alert(data.info);
                    }
                });
            });


        },
        getGoodsListByPage: function(){
            var _t = this;
            var data = {page: _t.page, rows: _t.rows, idType: _t.idType, modelActiveId: modelActiveId};
            data[_t.sortName] = _t.upOrDown;
            if($(".sort_tab").length > 0){
                data["classId"] = _t.classId;
            }
            lib.ajx(lib.getReq().ser + "modelActive/getGoodsPageInfo.action", data, function(data){
                if(data.infocode === "0" && data.info && data.info.itemsList){
                    if(data.info.itemsList.length < 10){
                      _t.noMoreGoods = true;
                    }
                    if(data.info.itemsList.length === 0){
                      _t.page = (data.info.count % _t.rows === 0 ? data.info.count / _t.rows : parseInt(data.info.count / _t.rows) + 1);
                    }
                    var h = "";
                    if(listType === 1){
                        $.each(data.info.itemsList, function(k, v){
                            h   +=  '<div class="ind_sx_list clearfix">'+
                                        '<a href="/g?gId='+ v.goodsId +'">' +
                                            '<div class="ind_sx_img"><img src="http://image.maimaicn.com/'+ lib.getImgSize(v.mainPictureJPG, "C") +'"></div>'+
                                            '<div class="ind_sx_r">'+
                                                '<h3>'+ v.chName +'</h3>'+
                                                '<p class="dred"><em>￥</em>'+ v.sellingPrice + (v.limitcoupon ? "<span>红包立减"+ v.limitcoupon+ "元</span>" : "") + '</p>'+
                                            '</div>'+
                                        '</a>'+
                                        '<a href="javascript:;" class="ind_sx_cart"><i data-goodsId="'+ v.goodsId +'"></i></a>'+
                                    '</div>';
                        });
                    }else if(listType === 2){
                        $.each(data.info.itemsList, function(k, v){
                            h += '<div class="ind_sx_h_l">'+
                                    '<a href="/g?gId='+ v.goodsId +'">'+
                                        '<div class="ind_sx_lo"></div>'+
                                        '<div class="ind_sx_l_img">'+
                                            '<img src="http://image.maimaicn.com/'+ lib.getImgSize(v.mainPictureJPG, "C") +'">'+
                                        '</div>'+
                                        '<h3>'+ v.chName +'</h3>'+
                                        '<div>'+
                                            '<p class="dred">'+
                                                '<em>￥</em>'+ v.sellingPrice +
                                                (v.limitcoupon ? "<span>红包立减"+ v.limitcoupon+ "元</span>" : "") +
                                            '</p>'+
                                        '</div>'+
                                   ' </a>'+
                                '</div>';
                        });
                    }
                    if(_t.page === 1){
                        $("#ui-goods-list").empty();
                    }
                    $("#ui-goods-list").append(h);
                }
                $("body").css("overflow", "auto");
                $("#ui-16-goodslist").show();
            }, function(){
                $("body").css("overflow", "auto");
            });
        },
				//加载
				getGoodsListByPage1: function(msg){
						var _t = this;
						if(msg && msg.page && msg.rows){
							msg["rows"]=parseInt(msg.page)*parseInt( msg.rows);
							msg["page"]=  1;
							sessionStorage.setItem("page",	msg["rows"]/10);
							sessionStorage.setItem("classId",msg["classId"]);
							$(".mall_tab>a").each(function(){
								if(Object.keys(msg).indexOf($(this).data("sortname"))!==-1){
								  $(this).addClass("active").siblings().removeClass("active");
									if(msg[$(this).data("sortname")]){
										    $(this).addClass("up").siblings().removeClass("up");
												 _t.upOrDown=$(this).data("sortname");
									}
								}
							})
							$(".sort_tab a").each(function(){
								if($(this).data("classid")==msg["classId"]){
									$(this).addClass("active").siblings().removeClass("active");
							}
							})
							var data=msg;
						}else{
							return false;
							var data = {page: _t.page, rows: _t.rows, idType: _t.idType, modelActiveId: modelActiveId};
							data[_t.sortName] = _t.upOrDown;
							if($(".sort_tab").length > 0){
									data["classId"] = _t.classId;
							}
						}
						lib.ajx(lib.getReq().ser + "modelActive/getGoodsPageInfo.action", data, function(data){
								if(data.infocode === "0" && data.info && data.info.itemsList){
									$("#ui-goods-list").html("");
										var h = "";
										if(listType === 1){
												$.each(data.info.itemsList, function(k, v){
														h   +=  '<div class="ind_sx_list clearfix">'+
																				'<a href="/g?gId='+ v.goodsId +'">' +
																						'<div class="ind_sx_img"><img src="http://image.maimaicn.com/'+ lib.getImgSize(v.mainPictureJPG, "C") +'"></div>'+
																						'<div class="ind_sx_r">'+
																								'<h3>'+ v.chName +'</h3>'+
																								'<p class="dred"><em>￥</em>'+ v.sellingPrice + (v.limitcoupon ? "<span>红包立减"+ v.limitcoupon+ "元</span>" : "") + '</p>'+
																						'</div>'+
																				'</a>'+
																				'<a href="javascript:;" class="ind_sx_cart"><i data-goodsId="'+ v.goodsId +'"></i></a>'+
																		'</div>';
												});
										}else if(listType === 2){
												$.each(data.info.itemsList, function(k, v){
														h += '<div class="ind_sx_h_l">'+
																		'<a href="/g?gId='+ v.goodsId +'">'+
																				'<div class="ind_sx_lo"></div>'+
																				'<div class="ind_sx_l_img">'+
																						'<img src="http://image.maimaicn.com/'+ lib.getImgSize(v.mainPictureJPG, "C") +'">'+
																				'</div>'+
																				'<h3>'+ v.chName +'</h3>'+
																				'<div>'+
																						'<p class="dred">'+
																								'<em>￥</em>'+ v.sellingPrice +
																								(v.limitcoupon ? "<span>红包立减"+ v.limitcoupon+ "元</span>" : "") +
																						'</p>'+
																				'</div>'+
																	 ' </a>'+
																'</div>';
												});
										}
										if(_t.page === 1){
												$("#ui-goods-list").empty();
										}
										$("#ui-goods-list").append(h);
								}
								$("body").css("overflow", "auto");
								$("#ui-16-goodslist").show();
						}, function(){
								$("body").css("overflow", "auto");
						});
				},
        roll: function(){
            var _t = this;
							var data;
							//_t.page=history.state.rows;
            $(window).scroll(function (){
                if(!_t.noMoreGoods &&　$(window).scrollTop() >= $(document).height() - $(window).height()){
                    $("body").css("overflow", "hidden");
                    _t.page++;
                    _t.getGoodsListByPage();
                }
								data= {page: _t.page, rows: _t.rows, idType: _t.idType, modelActiveId: modelActiveId};
								data[_t.sortName] = _t.upOrDown;
								if($(".sort_tab").length > 0){
										data["classId"] = _t.classId;
								}
									remosition.replace(data);
                //history.replaceState({'page': window.data.page, 'scrollTop': $(window).scrollTop()}, '', location.search);
            });
						// ****************
						  $(window).on("touchstart",function(){
								if(!(_t.touchFlag)){
									_t.page=sessionStorage.getItem("page")?sessionStorage.getItem("page"):1;
									_t.classId=sessionStorage.getItem("classId")?sessionStorage.getItem("classId"):77;
								}
									_t.touchFlag=true;
							})
        }

    });
    goodsListModal.init();
    /*window.onpopstate = function(){
        if(!(navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 1))
            history.back();
    }
    window.onunload = function(){
        sessionStorage.removeItem("mm_cp20160824");
    }
    window.onresize = function(){
        history.replaceState({'page': window.data.page, 'scrollTop': $(window).scrollTop()}, '', location.search);
    }
    document.addEventListener("orientationchange", function(){
        history.replaceState({'page': window.data.page, 'scrollTop': $(window).scrollTop()}, '', location.search);
    });*/
});
