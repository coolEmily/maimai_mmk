require.config({baseUrl: '/js/lib', paths:{swiper: "swiper.min"}});
require(['zepto','lib',"swiper"], function ($,lib) {
	lib = new lib();
    $(function () {
		var _t ={};
		var sldr = null;
        var rows = 8,
		noMore = false,
		page = 1;
		//collectNum sellShowNumber price endTime
		var pageInfo = {
			page:page,
			rows: rows
		};
		var sortInfo = {};

		getSlider();
		getFalsh();
		initEvent();
		function initEvent(){
			$(document).on("tap", ".ind_search_r", function(){
				searchFun();
			});
			$("#searchForm").on("submit",function(){
				searchFun();
			});
			function searchFun(){
				if($(".ind_search_cen input").val().trim() === ""){
					alert("请输入搜索关键字");
					return;
				}
				location.href = "/buyer/liebiao.html?goodsKeywords="+$(".ind_search_cen input").val().trim();
			}
			var scltop=$(".ind_search").offset().top;
			$(window).on("scroll",function () {
				if(!( scltop>$(this).scrollTop())){
					$(".ind_search").css({"position":"fixed","top":"0px"});
				}else{
					$(".ind_search").css({"position":"","top":""});
				}
			});

			$(".mall_tab").on("touchstart", "a", function(){
				sortInfo = {};
				pageInfo.page = 1;
				noMore = false;

				if($(this).hasClass('active')){
					if($(this).hasClass('up')){
						$(this).removeClass('up');
						sortInfo[$(this).attr("data-sortName")] = 0;
					}else{
						$(this).addClass('up');
						sortInfo[$(this).attr("data-sortName")] = 1;
					}
				}else{
					$(this).addClass("active").siblings().removeClass('active up');
				}

				$('#flash-goods-b').empty();
				$('#flash-goods-b').addClass('spinnerX');

				setTimeout(function(){
					getFalsh();
				},200);

			});
			roll();
		}
		function getSlider(){
			lib.ajx(lib.getReq().ser+'/adPlan/getAdPlanInfoAll.action',{mapValue:"180-b"}, function (data) {
				if(data.infocode === "0"){
					var list = data.info['180_b'];
					var h='';
					for(var i =0 ;i < list.length; i++){
						h += '<li class="swiper-slide" ><a href="'+list[i].adLink+'" target="_blank">'+
								'<img src="'+lib.getReq().imgPath +list[i].pictureUrl+'" />'+
								'</a></li>';
					}
					$('.swiper-wrapper').html(h);
					sldr = new Swiper('#slider_Img', {
						autoplay: 5000,//可选选项，自动滑动
						autoplayDisableOnInteraction : false,
						loop: true,
						autoHeight: true,
						pagination: "#serial_number",
						onInit: function (swiper) {
							//1张情况(swiper默认在总数上追加2张)
							swiper.slides.length === 3?swiper.lockSwipes():'';
						},
						onTouchStart: function(swiper){
							_t.sTP = swiper.translate;
						},
						onTouchEnd: function(swiper){
							_t.eTP = swiper.translate;
						}
					});
					$("#slider_Img img").css({"height": (document.documentElement.clientWidth / 640 * 300) + "px","max-height": "300px"});
					$("#slider_Img").css({"height": (document.documentElement.clientWidth / 640 * 300) + "px","max-height": "300px"});
				}
			},function(){alert("请求失败")});
		}
		function getFalsh(){
			lib.ajx(lib.getReq().ser + "/flashSale/getFlashSaleList.action",Object.assign({},pageInfo,sortInfo),setFalsh,errorFn);
		}
		function setFalsh(data){
			var list = data.info.flashSaleList;
			$('#flash-goods-b').removeClass('spinnerX');
			if(data.infocode === '0'){
                var h = "";
				if(list.length == 0){
					noMore = true;
					return;
				}
                for(var i=0;i<list.length;i++){
					h='<li class="flash-goods">'+
							'<div class="goods-time" id="shangou_'+list[i].flashSaleId+'">' +
							'<div class="time"></div><p>距离结束</p><p class="ui-last-time">'+
									list[i].endTime+
							'</p></div>'+
							'<div class="goods-img"><a href="/g?gId='+list[i].goodsId+'" style="min-height:120px;display:block;"><img src="'+lib.getReq().imgPath+list[i].imgUrl+'" alt=""></a></div></li>';
					$('#flash-goods-b').append(h);
				    countDown(list[i].endTime, $("#shangou_" + list[i].flashSaleId+" .ui-last-time"));
                }

			}else if(data.infocode === '1'){
				alert("请求失败，请检查网络连接");
			}
			else if(data.infocode === '2'){
				$(".ui-nothing-find").show();
			}
		}
		function errorFn(){
			$('#flash-goods-b').removeClass('spinnerX');
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
				if(t>= 86400000){
					$(obj).text('仅剩'+Math.ceil(t/86400000)+'天');
					return;
				}
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
	    		if(!noMore && $(window).scrollTop() > $(document).height() - $(window).height() - 10){
					pageInfo.page++;
	    			getFalsh();
	    		}
	    	});
	    }

	});
});