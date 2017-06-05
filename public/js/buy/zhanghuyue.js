require.config({baseUrl: '/js/lib',urlArgs: "v0.0.2"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), index = {};
    $.extend(index, {
        init: function(){
        	var _t=this;    		       	    
            _t.order();
            _t.recharge();
          if(lib.getUrlParam("yecz")){
            $("#recharge").trigger("tap");
          }
        },
        order: function(){
        	var _t=this;
        	lib.ajx(reqUrl.ser+'memberTotalMessage/getOrderNumWithType.action',{},function(data){
        		if(data.infocode === '0'){
					_t.balance = data.info.balance;
					$(".m_balance").html(data.info.balance);
        		}if(data.infocode == 1){
        			alert(data.info);
        		}if(data.infocode == 2){
        			window.location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
        		}
        	},function(){
        		alert("请求失败，请检查网络连接");
        	});
        },
        
        recharge:function(){
        	var _t=this;
        	$("#recharge").on("tap",function(){
        		$(".recharge_bg").css('display','block');
        		$(".recharge_box").css('display','block');        		
        	});
        	$(".close").on("tap",function(){
        		$(".Error").html("");
        		$(".recharge_bg").css('display','none');
        		$(".recharge_box").css('display','none');    
        	});
        	$("#zh_btn").on("tap",function(){
        		
        		_t.giftCardNo = $(".card_num").val();
    			_t.password = $(".card_pass").val(); 
        		if(_t.giftCardNo == '' || _t.password == ''){
    				$(".Error").html("卡号或密码为空");
    				return;
    			}
        		lib.ajx(reqUrl.ser+'/giftCard/bindGiftCard.action',{giftCardNo:_t.giftCardNo,password:_t.password},function(data){        			
        			if(data.infocode == 0){
        				$(".recharge_bg").css('display','none');
        				$(".recharge_box").css('display','none');
        				// _t.balance = Number(_t.balance) + Number(data.info.money);
        				// $(".m_balance").html(_t.balance);
        				alert("充值成功");
						location.reload();
        				$(".Error").html();
        			}else if(data.infocode == '2' || data.infocode == '3' || data.infocode == '4'){
        				$(".Error").html(data.info);
        			}
        		});
        	});
        }
    });
    index.init();
});