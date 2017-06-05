require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
	var noMore = false;
	var rows = 8,
		page = 1;
	var remai = {};
	$(function(){
		$.extend(remai,{
			init:function(){
				var _t = this;
				_t.getHotSale(rows,page);
				_t.roll();
			},
			getHotSale:function(){
				var _t = this;
				lib.ajx(lib.getReq().ser + "newGoodsHotEdit/newGoodsHotUseEditInfo.action",{'rows':rows,'page':page},function(data){
					var list = data.info.list_newGoodsHotUseEdit;
					if(data.infocode === '0'){
						var htmlStr = "";
						for(var i=0;i<list.length;i++){
							var url = '/g?mId=' + common.tools.getUrlParam('mId') +"&gId="+list[i].goodsId;
							htmlStr = '<div class="ind_sx_list clearfix">'+
							    '<a href="'+url+'" class="ind_sx_img"><img src="'+lib.getReq().imgPath+lib.getImgSize(list[i].mainPictureJPG, "E")+'" style="height:120px" /></a>'+
							    '<div class="ind_sx_r">'+
							    	'<a href="'+url+'">'+
								        '<h3>'+list[i].chName+'</h3>'+
								        /*'<h4><a href="'+url+'"><nobr>'+list[i].enName+'</nobr></a></h4>'+*/
								        '<p class="dred">￥'+list[i].sellingPrice+'<span>'+(list[i].limitcoupon  ? "红包立减" + list[i].limitcoupon  + "元" : "")+'</span></p>'+
							        '</a>'+
							    '</div>'+
							    '<a href="javascript:;" class="ind_sx_cart" data-Id="'+list[i].goodsId+'"><i></i></a>'+
							'</div>';
							$(".ind_sx").append(htmlStr);
						}
						$(".ind_sx_cart").off().on("tap",function(){
							var goodsId = $(this).attr("data-Id");
				    		lib.ajx(lib.getReq().ser + "/shoppingCart/addToCart.action",{'goodsId':goodsId,'goodsNum':1},function(data){
				    			alert(data.info);
				    		},function(){
			    				alert("系统错误");
			    			});
				    	});	
					}else if(data.infocode === '1'){
						alert(data.info);
					}else if(data.infocode === '2'){
						alert("暂无更多商品");
						_t.noMore = true;
					}
				},function(){
    				alert("系统错误");
    			});
			},
			roll:function(){
	            var _t = this;
	            $(window).scroll(function (){
	                if(!_t.noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
	                	page++;
	                    _t.getHotSale();
	                }
	            });
	        }
		});
		remai.init();
	});
});