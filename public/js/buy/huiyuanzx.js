require.config({baseUrl: '/js/lib',urlArgs: "v0.0.2"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), index = {};
    var validate = {
        checkEmpty: function(str){
            if(!str) return false;
            return true;
        }
    };

    $.extend(index, {
        init: function(){
            this.bank();
            if($.cookie("member_loginName") && $.cookie("member_loginName").length === 11){
                $(".ui-bangding").attr("href", "javascript:;");
                $(".ui-bangding > div:eq(1)").text("已绑定").css("color","red");
            }
            if($.cookie("member_headPic")){
                $(".ui-imgbox img").attr("src",reqUrl.imgPath+$.cookie("member_headPic"))
            }
            $(".ui-nickname a").text($.cookie("member_nickname"));
            this.order();
            lib.fixedFooter(3);//底部导航
            $("body").css("visibility", "visible");
            this.initBeanEvent();
            if(lib.getUrlParam("beanS")){
              $('.modal').show();
            }
        },
        showMessage: function(dom,msg,isErr){
            $(dom).html(msg);
        },
        initBeanEvent: function(){
            var _t = this;
          //金豆激活入口
          $('.activate').on('click',function(){
              //reset modal
              _t.showMessage('.card-pass-tip','');
              $('.card-no').val('');
              $('.card-pass').val('')
              $('.modal').show();
          });

            $('.card-no').on('focus',function(){
                _t.showMessage('.card-pass-tip','');
            });
            //查询卡号
            $('.card-no').on('blur',function(){
                if(validate.checkEmpty($.trim($('.card-no').val()))){
                    lib.ajx(lib.getReq().ser+'/virtualMoney/identifyNumberNo.action',{numberNo: $.trim($('.card-no').val())},
                    function(data){
                        _t.showMessage('.card-pass-tip',data.info);
                    },function(){
                        alert("请求失败，请检查网络连接");
                    });
                }
            });
            $('.card-pass').on('focus',function(){
                if(!validate.checkEmpty($.trim($('.card-no').val()))){
                    _t.showMessage('.card-pass-tip','请输入正确的卡号',true);
                    return;
                }
                _t.showMessage('.card-pass-tip','',true);
            });

            //激活
            $(document).on('click','.card-activate:not(.card-activate-disable)',function(){
                var cardNo = $.trim($('.card-no').val());
                var cardPw = $.trim($('.card-pass').val());
                if(!validate.checkEmpty(cardNo)){
                    _t.showMessage('.card-pass-tip','请输入正确的卡号',true);
                    return;
                }
                if(!validate.checkEmpty(cardPw)){
                    _t.showMessage('.card-pass-tip','请输入正确的密码',true);
                    return;
                }

                lib.ajx(lib.getReq().ser+'/virtualMoney/activeVirtualMoney.action',{
                    numberNo: $.trim($('.card-no').val()),pass:$.trim($('.card-pass').val())
                },function(data){
                        //0-“卡号不能为空” 6-成功，1- “密码不能为空” 2-“该卡已被激活” 3-“该卡暂时无法使用” 4-密码不对 5-系统错误 7-请先登录 8-卡号不正确
                        if(data.infocode === '6'){
                            $('.modal').hide();
                            alert('金豆激活成功');
                            window.location.reload();

                        }else if(data.infocode === '7'){
                            location = '/buyer/login/dlzc.html?backUrl='+lib.getBackUrl();
                        }else if(data.infocode === '0' ||data.infocode === '2' ||data.infocode === '3' ||data.infocode === '8'){
                            _t.isValidCard = false;
                            _t.showMessage('.card-pass-tip',data.info,true);
                        }else if(data.infocode === '1' ||data.infocode === '4'){
                            _t.showMessage('.card-pass-tip',data.info);
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("请求失败，请检查网络连接");
                    });
            });
            //隐藏弹框
            $(".modal").on("click",function(e){
                var target = e.srcElement ? e.srcElement : e.target;
                var triTarget = ['modal','card-cancel'];
                for(var i =0; i <triTarget.length;i++){

                    if(target.className === triTarget[i]){
                        $(".modal").hide();
                        break;
                    }
                }
            });

        },
        order: function(){
        	lib.ajx(reqUrl.ser+'memberTotalMessage/getOrderNumWithType.action',{},function(data){
        		if(data.infocode === '0'){
                    if(data.info === null){
                        return;
                    }
                    function fixFloat(d) {
                        var numStr=parseFloat(d).toString();
                        return numStr.indexOf(".") > -1 && numStr.split('.')[1].length > 2 ? parseFloat(d.toFixed(2)):d;
                    }
                    $("#obligation").html(data.info.waitPayOrderNum);
                    $("#receipt").html(data.info.waitGetOrderNum);
                    $("#completed").html(data.info.finishOrderNum);
                    $("#canc").html(data.info.waitCommentOrderNum);
                    $("#balance").html(fixFloat(data.info.balance)+' 元');
                    $("#redBalance").html(fixFloat(data.info.redBalance)+' 元');
                    $("#jindouBalance").html(fixFloat(data.info.virtualMoneyBalance));
                    $("#cardsBox").attr("href",'/buyer/home/mycards_box.html?b='+fixFloat(data.info.redBalance)+'&g='+fixFloat(data.info.virtualMoneyBalance))


        		}if(data.infocode == 1){
        			alert(data.info);
        		}if(data.infocode == 2){
        			window.location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
        		}
        	},function(){
        		alert("请求失败，请检查网络连接");
        	});
        },
        bank:function(){
           lib.ajx(reqUrl.ser+'/bankActive/getBankTag.action',{},function(data){
                if(data.infocode==0){
                    data.info.forEach(function(value,index){
                        var htl='<div class="ui yui"><a href="javascript:void(0)" class="imgs" style="background:url('+reqUrl.imgPath+value.flagImgUrl+') no-repeat center center;background-size:cover;"></a><h3 class="title">'+value.flagName+'</h3><a href="javascript:void(0);"></a></div>';
                        var html='<div class="ui" id="show"><a href="javascript:void(0)" class="imgs" style="background:url('+reqUrl.imgPath+value.flagImgUrl+') no-repeat center center;background-size:cover;"></a><h3 class="title">'+value.flagName+'</h3><a href="javascript:void(0);" class="ui-transd-999" id="book"></a></div>';
                        if(index==0){
                            $("#show").append(html)
                        }else{
                            $("#show").append(htl)
                        }
                    })
                }else{
                    $("#show").hide();
                }
            },function(){
                alert("请求失败，请检查网络连接");
            }); 
        },
        show:function(){
            var flag=true;
            $("#book").click(function(){
                if(flag){
                  $(".yui").show();
                    $("#book").addClass("ui-transt-999").removeClass("ui-transd-999");
                    flag=false;
                }else{
                    $(".yui").hide();
                    $("#book").addClass("ui-transd-999").removeClass("ui-transt-999");
                    flag=true;
                }
                
            });
        }
    });
    index.init();
});