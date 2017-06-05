requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib'], function ($,lib) {
	lib = new lib();
	var rows = 10,
		noMore = true,
		page = 1;
   $(function(){	   
		getNews(rows, page);
		roll();
   	});
	function getNews(rows,page){
		lib.ajx(lib.getReq().ser + "/platformMessages/getMessageInfo.action",{"rows":rows,"page":page},setNews, errorFn);  
	} 		      
    function setNews(data){
    	if(data.infocode === '0'){
    		var list = data.info;
    		if(list.length === 0){
    			noMore = false;
    			if(page === 1){
    				$(".ui-nothing-find").show();
    			}    			
    		}
    		var htmlStr = "";
    		for(var i=0;i<list.length;i++){
    			htmlStr += '<div class="ui-message-detail">'+
						        '<div class="ui-detail-icon">'+list[i].messageTitle+'</div>'+
						        '<div class="ui-detail-icon">'+list[i].publishTime+'</div>'+
						        '<div class="ui-detail-icon">'+list[i].messageDetails+'</div>'+
						    '</div>';
    		}
    		$('.ui-body').append(htmlStr);        		
    	}if(data.infocode == 1){
    		$(".ui-nothing-find").show();
    		alert(data.info);
    	}if(data.infocode == 2){
    		$(".ui-nothing-find").show();
    	}if(data.infocode == 3){
    		window.location.href="/login/denglu.html?backUrl="+lib.getBackUrl();
    	}
    }
    function errorFn(){
    	alert("请求失败，请检查网络连接");
    }
     
    
    function roll(){
    	$(window).scroll(function (){
    		if(noMore && $(window).scrollTop() > $(document).height() - $(window).height() - 10){
    			getNews(rows, ++page);
    		}
    	});
    }
});