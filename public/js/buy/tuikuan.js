requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib','uploadImg'], function ($,lib,loadimg){
        lib = new lib();
       var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    $(function(){
       var dealWay={};
       var htmlType=$(".main_head").attr("headId"),//页面类型
           backApplyUrl=reqUrl.ser+'order/backOrder.action',//退款申请提交
           getDeliverUrl=reqUrl.ser+'deliveryCompany/getDeliveryCompany.action',//获取快递公司列表
           saveNumberUrl=reqUrl.ser+'order/updateBackDeliveryNo.action',//保存运单号
           platformUrl=reqUrl.ser+'disputePlatform/save.action',//平台介入
           processBackUrl=reqUrl.ser+'order/getBackInfoAndLogitics.action',//退款进度
           deliveryUrl=reqUrl.ser+'/order/getLogitcsInfo.action';//物流信息

        var orderId=lib.getUrlParam('oId'),//订单id
            money=lib.getUrlParam('money');//金额
            money?$("#moneyInput").val(money):"";
           $("#moneyInput").removeAttr("readOnly").attr('max',money);

        $.extend(dealWay,{
            platform:function(){//平台介入
                $("#platSubmit").on("tap",function(){
                    var textCon=$("#textCon").val();
                    if(textCon===""){
                       alert("请填写申诉内容！");
                    }else{
                        common.js.ajx(platformUrl,{orderSonId:orderId,applycontent:textCon},function(data){
                            if(data.infocode==="0"){
                                alert("平台已经介入！");
                                if(window.isApp !== 0 || sessionStorage.isApp !== "0"){
                                  push.pushViewController('true');
                                  return;submitNum
                                }
                                location = "/buyer/order/dingdanxq.html?oId="+orderId+'&sflag=1';
                            }else if(data.infocode==2){
                                alert("会员未登录！");
                                location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                            }else{
                                alert(data.info);
                            }
                        },function(){
                            alert("提交失败！");
                        });
                    }
                });
            },
            backApply:function(){//退款申请
                loadimg();//运行图片加载
                $("#backType select").on("change",function(){
                    var tindex=$(this).val();
                    if(tindex==1){//退货
                        $("#backReason").parent().show();
                        $("#moneyInput").attr("readOnly",true);
                        money?$("#moneyInput").val(money):"";
                    }else{//只退款
                        $("#backReason").parent().hide();
                    }
                });
                $("#moneyInput").on("blur",function(){
                    var n=$(this).val(),
                        maxN=$(this).attr("max");
                    if(Number(n)>Number(maxN)){
                        $(this).val(maxN);
                    }else if(Number(n)<0){
                        $(this).val(0);
                    }else{
                        $(this).val(money);
                    }
                });
               $("#submitApply").on("tap",function(){
                   var backType=$("#backType select").val(),
                       backReason=$("#backReason select").val(),
                       explain=$("#explain").val(),
                       backMoney=$("#moneyInput").val(),
                       maxN=$("#moneyInput").attr("max"),
                       picA=$("#playPicture0").attr("data-url"),
                       picB=$("#playPicture1").attr("data-url");

                      if(Number(backMoney)>Number(maxN)){
                          backMoney=maxN;
                      }else if(Number(backMoney)<0){
                          backMoney=0;
                      }else{
                          backMoney=money;
                      }

                   if(explain===""){
                       alert("请填写退款说明！");
                   }else{
                       var applyObj={  orderId:orderId,
                                       backType:backType,
                                       backReason:backReason,
                                       backMoney:backMoney,
                                       backRemark:explain,
                                       pictureA:picA,
                                       pictureB:picB};

                       common.js.ajx(backApplyUrl,applyObj,function(data){
                           if(data.infocode==="0"||data.infocode==="2"){
                                alert("提交申请成功！");
                                if(window.isApp !== 0 || sessionStorage.isApp !== "0"){
                                  push.pushViewController('true');
                                  return;
                                }
                               location = "/buyer/order/dingdanxq.html?oId="+orderId+'&sflag=1';
                           }else if(data.infocode==3){
                               alert("会员未登录！");
                               location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                           }else{
                               alert(data.info);
                           }
                       },function(){
                           alert("提交失败！");
                       });
                   }

               });
            },
            deliverNum:function(){//填写运单号
                common.js.ajx(getDeliverUrl,{},function(data){//获取快递公司
                    if(data.infocode==="0"){
                        var optionStr="";
                        $.each(data.info,function(i,v){
                            optionStr+="<option value='"+v.deliveryCompanyId+"'>"+v.companyName+"</option>";
                        });
                        $("#deliverCom").html(optionStr);
                    }else{
                        alert(data.info);
                    }
                },function(){
                    alert("获取快递公司列表失败！");
                });

                $("#submitNum").on("tap",function(){
                    var sendNumber=$("#sendNumber").val();
                    if(sendNumber===""){
                        alert("请填写快递单号！");
                    }else{
                        var numObj={orderId:orderId,deliveryCompanyId:$("#deliverCom").val(),deliveryNo:$("#sendNumber").val()};
                        common.js.ajx(saveNumberUrl,numObj,function(data){//提交运单号
                            if(data.infocode==="0"){
                               alert("运单号填写成功！");
                               if(window.isApp !== 0 || sessionStorage.isApp !== "0"){
                                  push.pushViewController('true');
                                  return;
                                }
                               location = "/buyer/order/dingdanxq.html?oId="+orderId+'&sflag=1';
                            }else{
                                alert(data.info);
                            }
                        },function(){
                            alert("运单号填写失败！");
                        });
                    }

                });
            },
            processBack:function(){//退款进度
                common.js.ajx(processBackUrl,{orderId:orderId},function(data){
                    if(data.infocode==="0"){
                        $("#backStatus").html(data.info.backStatus);
                        data.info.refuseReason?$("#refund_ex").show().html(data.info.refuseReason):"";//退款原因
                        if(data.info.logitics && data.info.logitics.length!==0){
                            var deliverStr="";
                            $.each(data.info.logitics,function(i,v){
                                if(i===0){
                                    deliverStr+='<li class="new"><i></i><div><p>'+v.context+'</p><p>'+v.time+'</p></div></li>';
                                }else{
                                    deliverStr+='<li><div><p>'+v.context+'</p><p>'+v.time+'</p></div></li>';
                                }
                            });
                            $("#refund_schedule").show().html('<ul>'+deliverStr+'</ul>');
                        }
                    }else{
                        alert(data.info);
                    }
                },function(){
                    alert("获取信息失败！");
                });
            },
            delivery:function(){//物流信息
                common.js.ajx(deliveryUrl,{orderId:orderId},function(data){
                    if(data.infocode==="0"){
                        $("#deliverCom").html(data.info.companyName);
                        $("#dNumber").html(data.info.deliveryNo);
                        $("#goodsPic").attr("src",reqUrl.imgPath+data.info.pic);

                        if(data.info.isOK==1){
                            var deliverStr="";
                            $.each(data.info.logitics,function(i,v){
                                if(i===0){
                                    deliverStr+='<li class="new"><i></i><div><p>'+v.context+'</p><p>'+v.time+'</p></div></li>';
                                }else{
                                    deliverStr+='<li><div><p>'+v.context+'</p><p>'+v.time+'</p></div></li>';
                                }
                            });
                            $("#refund_schedule").html('<ul>'+deliverStr+'</ul>');
                        }else{
                            $("#refund_schedule").html('<ul><div style="line-height:30px;margin-top:-16px;text-align:center">'+data.info.error+'</div></ul>');
                        }

                    }else{
                        alert(data.info);
                    }
                },function(){
                    alert("获取信息失败！");
                });
            }

        });

        if(htmlType=="backApply"){
            return dealWay.backApply();
        }else if(htmlType=="deliverNum"){
            return dealWay.deliverNum();
        }else if(htmlType=="platform"){
            return dealWay.platform();
        }else if(htmlType=="processBack"){
            return dealWay.processBack();
        }else if(htmlType=="delivery"){
            return dealWay.delivery();
        }


    });
});
