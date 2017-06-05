require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var shouye = {};
        $.extend(shouye, {
            baseBalance: 100, /*保底金额*/
            minA: 0, /*每次体现的下限*/
            init: function(){
                this.initPage();
            },
            initPage: function(){
                var _t = this;
                
                /*初始化余额*/
                common.js.ajx(reqUrl.ser + "memberBalance/getBalanceInfo.action", {}, function(data){
                    if(data.infocode === "0"){
                        $("#ui-yue").attr("data-balance", data.info.balance).text("￥" + data.info.balance);
                        _t.baseBalance = Number(data.info.reserveMoney);
                        if(Number(data.info.balance) > (_t.baseBalance + _t.minA)){
                            $(".ui-balance-op.button.ui-undo").removeClass("ui-undo");
                        }
                    }else{
                        alert(data.info);
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                },function(){
                   alert("请求失败");
                });
                
                /*提现按钮*/
                $(document).on("tap", ".ui-balance-op.button:not(.ui-undo)", function(){
                    var tixianP = $("input[name=tixian]").val().trim();
                    /*体现金额验证*/
                    if(tixianP === ""){
                        $(".ui-message").addClass("login_error").text("请先填入需提现金额");
                        return;
                    }else if(tixianP !== "" && !/^[0-9]+(.[0-9]{1,2})?$/.test(tixianP)){
                        $(".ui-user-mobile").addClass("ui-err-p");
                        $(".ui-message").addClass("login_error").text("请输入正确的金额");
                        return;
                    }else if(/^[0-9]+(.[0-9]{1,2})?$/.test(tixianP) && tixianP < _t.minA){
                        $(".ui-user-mobile").addClass("ui-err-p");
                        $(".ui-message").addClass("login_error").text("每次提现最少为"+_t.baseBalance);
                        return;
                    }else if(/^[0-9]+(.[0-9]{1,2})?$/.test(tixianP) && (Number(tixianP) + _t.baseBalance) > Number($("#ui-yue").data("balance"))){
                        $(".ui-user-mobile").addClass("ui-err-p");
                        $(".ui-message").addClass("login_error").text("账户余额不足,账户保底金额" + _t.baseBalance);
                        return;
                    }
                    
                    sessionStorage.balance = tixianP;
                    location.href = 'tixian.html';
                });
                    
                /*input获取焦点*/
                $(document).on("focus", "input[name=tixian]", function(){
                    $(".ui-user-mobile").removeClass("ui-err-p");
                    $(".ui-message").removeClass("login_error");
                });
                    
                    
                /*初始化奖金明细*/
                common.js.ajx(reqUrl.ser + "memberBalance/getPageForBalanceItems.action", {pageNo:1,pageSize:10000000}, function(data){
                    if(data.infocode === "0"){
                        var html = "",
                        status = {'0': '编辑中', '1': '待审核', '2': '通过', '3': '审核未通过', '4': '拒绝'},
                        color = {'0': 'ui-ing',  '1': 'ui-ing', '2': '', '3': 'ui-err', '4': 'ui-err'},
                        balanceType = {'0': '会员升级返佣','1': '会员购买返佣', '2': '提现', '3': '余额支付退回', '4': "货款", '5': "返还运费", "6": "充值", "7": "订单支付消费", "8": "提现失败返回"};
                        $.each(data.info.dataList.reverse(), function(k,v){
                            html += '<div class="ui-acc-cash">' +
                                    '<div>'+ balanceType[v.balanceType] +'<span class="' + color[v.status] + '">' + status[v.status] + '</span><br><span>'+ v.operateTime +'</span></div>' +
                                    '<div class="'+ (v.status === "2" ? "" : "ui-err") +'">' + v.addSubStatus +  '￥'+ v.balance +'</div></div>';
                        });
                        $(".ui-account-history").append(html);
                        
                    }
                },function(){
                   alert("请求失败");
                });
            }
            
        });
        shouye.init();
    })();
});