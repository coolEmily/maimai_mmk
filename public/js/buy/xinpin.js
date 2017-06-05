require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
	var noMore = false;
	var rows = 8,
		page = 1;
	var xinpin = {};
	$(function(){
		$.extend(xinpin,{
			init:function(){
				var _t = this;
				_t.getNewGoods(rows,page);
				_t.roll();
			},
			getNewGoods:function(){
				var _t = this;
				var imgH = (document.documentElement.clientWidth * 0.8 * 0.495) + "px",
		    		maxImgH = (640* 0.8 * 0.495) + "px";
				lib.ajx(lib.getReq().ser + "/newGoodsEdit/newGoodsUseEditInfo.action",{'rows':rows,'page':page},function(data){
					var list = data.info.list_newGoodsUseEdit;
					if(data.infocode === '0'){
						var htmlStr = "";
						for(var i=0;i<list.length;i++){
							var url = '/g?mId=' + common.tools.getUrlParam('mId') +"&gId="+list[i].goodsId;
							var sImg = list[i].activeSignImg ? '<img src="/images/buy/list_' + list[i].activeSignImg + '.png" />' : "";
							htmlStr = '<div class="ind_sx_h_l">'+
										'<a href="'+url+'">'+
											'<div class="ind_sx_lo">' + sImg + '</div>'+
									        '<div class="ind_sx_l_img"><img src="'+lib.getReq().imgPath+lib.getImgSize(list[i].mainPictureJPG, "C")+'" style="height:'+ imgH +';max-height:'+ maxImgH +'" /></div>'+
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
	                    _t.getNewGoods();
	                }
	            });
	        }
		});
		xinpin.init();
	});
});