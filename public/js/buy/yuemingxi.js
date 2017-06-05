require.config({baseUrl: '/js/lib',urlArgs: "v0.0.2"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), index = {};
    var noMore = false;
	
    $.extend(index, {
    	pageSize : 10,
		pageNo : 1,
		balanceType: {'0': '会员升级返佣','1': '会员购买返佣', '2': '提现', '3': '余额支付退回', '4': "货款", '5': "运费返还", "6": "充值卡充值","7":"余额支付"},
		addSubStatus:{'+':'#42be5e','-':"#fc3f43"},
        init: function(){        	
        	var _t=this;    		       	    
			_t.detailed(_t.pageSize,_t.pageNo);
			_t.roll();
        },
		detailed:function(){
			var _t=this;
        	lib.ajx(reqUrl.ser+'/memberBalance/getPageForBalanceItems.action',{'pageSize':_t.pageSize,'pageNo':_t.pageNo},function(data){
        		var list = data.info.dataList;
        		if(data.infocode==0){
        			if(list.length==0 ){
        				_t.noMore = true;
        				_t.pageNo === 1 ? $(".detailed_n").show() : '';
        			}else{
                       $(".detailed_n").hide(); 
                    }
        			var htmlStr = "";
        			for(var i=0; i<list.length; i++){
        				htmlStr += '<div class="detailed_mx">'+
							    		'<p class="sm">'+_t.balanceType[list[i].balanceType]+'</p>'+
							    		'<p class="sj">'+list[i].operateTime+'</p>'+
							    		'<div class="mm" style="color:'+_t.addSubStatus[list[i].addSubStatus]+'"><span">'+list[i].addSubStatus+'</span><span>￥'+list[i].balance+'</span></div>'+
							    	'</div>';
        			}
					$(".detailed").append(htmlStr);
        		}else if(data.infocode==2){
        			window.location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
        		}
        	});
		},
		roll:function(){
            var _t = this;
            $(window).scroll(function (){
                if(!_t.noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                	_t.pageNo++;
                    _t.detailed();
                }
            });
        }
    });
    index.init();
});
