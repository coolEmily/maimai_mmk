requirejs.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib', 'hhSwipe'], function($, lib,hhswiper){
	lib = new lib();
	var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
	var noMore = false;
	var adLocationId = common.tools.getUrlParam('adLocationId');
	var rows = 8,
		page = 1;
	var dakaguan = {};	
	$(function(){
		$.extend(dakaguan,{
			init:function(){
				var _t = this;
				_t.fixed();
				_t.slider(); //轮播图滚动
				_t.getShufflingAdPlanInfo();/*轮播图*/
				_t.getNewGoods(rows,page);
				_t.roll();	
			},
			fixed:function(){
				if($.cookie("member_memberTypeId") === "3"){
					$(".daka_fixed").hide();
				}else{
					$(".daka_fixed").show();
					$("body").css("overflow","hidden");
				}
				$(".button").on("touchend",function(event){
					event.preventDefault();
					$(".daka_fixed").hide();
					$("body").css("overflow","");
				});
			},
			slider:function(){
              	var _t=this;
	            var slider = Swipe(document.getElementById('slider_Img'),{
                    auto: 3000,
                    continuous: true,
                    callback: function(pos){
                      $("#serial_number span").eq(pos).addClass('selected').siblings().removeClass('selected');
                    }
                });	
            },
	        getShufflingAdPlanInfo: function(){/*轮播图*/
	        	var _t = this;
	            common.js.ajx(reqUrl.ser+"adPlan/getAdPlanInfo.action", {adLocationId: adLocationId}, function(data){
	            	var list = data.info.List_adSource;
	                if(data.infocode === "0"){
	                	for(var i=0; i<list.length;i++){
				            var liStr = "";
							var conStr = "";
							liStr += '<li class="swiper-slide">'+
										'<a href="'+list[i].adLink+'">'+
											'<img src="'+lib.getReq().imgPath+list[i].pictureUrl+'" />'+
										'</a>'+
									'</li>';//广告位
							var clas = i==0?' class="point selected"':' class="point"';
							conStr += '<span' + clas + '></span>'; 
							$("#slider_Img ul").append(liStr); 
							$("#serial_number").append(conStr);  
							$("#slider_Img img").css({"height": (document.documentElement.clientWidth / 640 * 300) + "px","max-height": "300px"});
			                $("#slider_Img").css({"height": (document.documentElement.clientWidth / 640 * 300) + "px","max-height": "300px"});                  
			            }
			            _t.slider();
			        }
	            },function(){
	                alert("系统错误");
	            });
	        },
			getNewGoods:function(){
				var _t = this;
				lib.ajx(lib.getReq().ser + "/priceReduce/priceReduceGoodsInfo.action",{'rows':rows,'page':page},function(data){
					var list = data.info.list_priceReduceGoods;
					if(data.infocode === '0'){
						var imgH = (document.documentElement.clientWidth * 0.8 * 0.495) + "px",
			    		maxImgH = (640* 0.8 * 0.495) + "px";
						for(var i=0;i<list.length;i++){
							var url = '/g?mId=' + common.tools.getUrlParam('mId') +"&gId="+list[i].goodsId;
							var sImg = list[i].activeSignImg ? '<img src="/images/buy/list_' +  + list[i].activeSignImg + '.png" />' : "";
							htmlStr = '<div class="ind_sx_h_l">'+
										'<a href="'+url+'" class="ind_sx_img">'+
											'<div class="ind_sx_lo">' + sImg + '</div>'+
									        '<div class="ind_sx_l_img">'+
									        	'<img src="'+lib.getReq().imgPath+lib.getImgSize(list[i].mainPictureJPG, "C")+'" style="height:'+ imgH +';max-height:'+ maxImgH +'" />'+
									        	'<div class="buy_none" style="'+(list[i].inventoryNum==0?'display:block':'')+'"><img src="/images/buy/dk_none.png" /></div>'+
									        '</div>'+
									        '<h3>'+list[i].chName+'</h3>'+
									        /*'<h4><a href="'+url+'"><nobr>'+list[i].enName+'</nobr></a></h4>'+*/
									        '<p class="dred">￥'+list[i].sellingPrice+'<span>'+(list[i].limitcoupon  ? "红包立减" + list[i].limitcoupon  + "元" : "")+'</span></p>'+
								        '</a>'+
								      '</div>';
							$("#ui-new-goods").append(htmlStr);
							

						}		
					}else if(data.infocode === '1'){
						alert(data.info);
					}else if(data.infocode === '2'){
						//alert("暂无更多商品");
						_t.noMore = true;
					}
					
				},function(){
    				alert("系统错误");
    			});
			},
			roll: function(){
	            var _t = this;
	            $(window).scroll(function (){
	                if(!_t.noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
	                	page++;
	                    _t.getNewGoods();
	                }
	            });
	        }
		});
		dakaguan.init();
	});
	
});