requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib',"rememberThePosition"], function ($,lib,remosition) {
	lib = new lib();
	var dPath="/g?"+lib.getMid()+'&gId=';
    $(function () {
        var rows = 10,
		noMore = true,
		page = 1;
			remosition.init(false); 
		$(function(){
			getFalsh(rows,page);
			roll();
		});
		function getFalsh(rows,page){
			lib.ajx(lib.getReq().ser + "/flashSale/getFlashSaleList.action",{'page':page,'rows':rows},setFalsh,errorFn);
		}
		function setFalsh(data){
			var list = data.info.flashSaleList;
			if(data.infocode === '0'){
				var htmlStr = "";
				for(var i=0;i<list.length;i++){
					var herflink='href="'+dPath+list[i].goodsId+'"';
					htmlStr= '<div class="ui-collect-show" id="shangou_'+list[i].flashSaleId+'">'+
							        '<div class="ui-img"><a '+herflink+'><img src="'+lib.getReq().imgPath+lib.getImgSize(list[i].mainPictureJPG, "B")+'"></a></div>'+
							        '<div class="ui-desc">'+
							            '<p><a '+herflink+'><span>'+list[i].chName+'</span></a></p><p></p>'+
							            /*'<p><a '+herflink+'>'+list[i].enName+'</a></p>'+*/
							            '<p>距结束仅剩：<span class="ui-last-time">'+list[i].endTime+'</span></p>'+
							            '<p>￥'+list[i].flashPrice+'<em>'+(list[i].limitcoupon  ? "红包立减" + list[i].limitcoupon  + "元" : "")+'</em></p>'+
							            '<p class="button" data-Id="'+list[i].goodsId+'">加入购物车</p>'+
							        '</div>'+
							    '</div>';
				    $(".ui-body").append(htmlStr);
				    countDown(list[i].endTime, $("#shangou_" + list[i].flashSaleId+" .ui-last-time"));
				}
				if(list.length<rows){
                    noMore = false;
                }
				$(".button").off().on("tap",function(){
					var goodsId = $(this).attr("data-Id");
		    		lib.ajx(lib.getReq().ser + "/shoppingCart/addToCart.action",{'goodsId':goodsId,'goodsNum':1},function(data){
		    			alert(data.info);
		    		},errorFn);
		    	});
			}else if(data.infocode === '1'){
				alert("请求失败，请检查网络连接");
			}
			else if(data.infocode === '2'){
				$(".ui-nothing-find").show();
			}
		}
		function errorFn(){
	    	alert("请求失败，请检查网络连接");
	    }
	    function countDown(sTime, obj){
	    	//console.log(sTime)
	    	var oDate = new Date(sTime.replace(/-/g,"/"));
	    	//console.log(oDate);
	    	var timer = null;
	    	clearInterval(timer);
	    	t();
	    	timer = setInterval(function(){
	    		t();
	    	}, 1000);
	    	function t(){
	    		var t = oDate - new Date();
	    		if(t<=0){
	    			clearInterval(timer);
	    			$(obj).text("已结束");
	    			$(obj).parent().siblings(".button").addClass("ui-btn");
	    			return;
	    		}
	    		var s = parseInt(t/1000);
	    		var h = parseInt(s/3600);
	    		s%=3600;
	    		var m = parseInt(s/60);
	    		s%=60;
	    		$(obj).text(h+':'+m+':'+s);
	    	}
	    }
	    function roll(){
	    	$(window).scroll(function (){
	    		if(noMore && $(window).scrollTop() > $(document).height() - $(window).height() - 10){
	    			getFalsh(rows, ++page);
	    		}
	    	});
	    }

	});
});
