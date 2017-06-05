requirejs.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib','visitor-logs'], function($, lib, vl){
	lib = new lib();
	var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
	var rLocationId = common.tools.getUrlParam('rLocationId');
	var cuxiaoxq = {};	
	$(function(){
		$.extend(cuxiaoxq,{
			init:function(){
				var _t = this;
				_t.cuxiao();
                vl.setLog(window.location.href, 2);//会员访问日志
			},
			cuxiao:function(){
				common.js.ajx(reqUrl.ser+"rLocation/getRLocationInfo.action", {rLocationId: rLocationId}, function(data){
					var list = data.info.List_rLg;
					if(data.infocode === '0'){
						var imgH = (document.documentElement.clientWidth * 0.8 * 0.495) + "px",
			    		maxImgH = (640* 0.8 * 0.495) + "px";
			    		if(data.info.pictureUrl_rL){
			    		    bannerStr = '<div class="cx_ban">'+
                                            '<a href="javascript:;">'+
                                                '<img src="'+lib.getReq().imgPath+data.info.pictureUrl_rL+'" />'+
                                            '</a>'+
                                          '</div>';
                            $(".cxiao").append(bannerStr);//广告图
			    		}
    						
    					for(var i=0; i<list.length; i++){
    						var url = '/g?mId=' + common.tools.getUrlParam('mId') +"&gId="+list[i].goodsId;
							var sImg = list[i].activeSignImg ? '<img src="/images/buy/list_' + list[i].activeSignImg + '.png" />' : "";
							listStr = '<div class="ind_sx_h_l">'+
										'<a href="'+url+'">'+
											/*'<div class="ind_sx_lo">' + sImg + '</div>'+*/
									        '<div class="ind_sx_l_img"><img src="'+lib.getReq().imgPath+lib.getImgSize(list[i].mainPictureJPG,"E")+'" style="height:'+ imgH +';max-height:'+ maxImgH +'" /></div>'+
									        '<h3>'+list[i].chName+'</h3>'+
									        /*'<h4><a href="'+url+'"><nobr>'+list[i].enName+'</nobr></a></h4>'+*/
									        '<p class="dred">￥'+list[i].sellingPrice+'<span>'+ (list[i].limitcoupon  ? "红包立减" + list[i].limitcoupon  + "元" : "")  +'</span></p>'+
								        '</a>'+
								      '</div>';
							$("#ui-new-goods").append(listStr);//列表
    					}
					}else if(data.infocode === '1'){
						alert(data.info);
					}else if(data.infocode === '2'){
						alert("暂无更多商品");
					}
				},function(){
    				alert("系统错误");
    			});
			}
		});
		cuxiaoxq.init();
	});
});