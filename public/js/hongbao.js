requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib','wxshare','wapshare','guesslike'], function ($,lib,wxshare,wapshare,guesslike){
    lib = new lib();
    wapshare = new wapshare();
    var  common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    //红包页
    var hbid=document.referrer.indexOf('dingdanqr')!==-1 ? true:false;
    $(function(){
        var dealWay={};
        var htmlType=$(".main_head").attr("headId"),//页面类型
            getRedPocketUrl=reqUrl.ser+'coupon/takeCoupon.action',//领取红包
            shareRedPocketUrl=reqUrl.ser+'coupon/getCouponGroupList.action',//分享红包
            myRedPocketUrl=reqUrl.ser+'redPacket/getRedPacketByMember.action',//我的红包
            balanceItemUrl=reqUrl.ser+'redPacket/redPacketCostDetail.action',//红包明细
            activePocketUrl=reqUrl.ser+'redPacket/bindRedPacket.action';//红包激活
        var mId = $.cookie('member_memberId')?$.cookie('member_memberId'):"";//分享红包、短信用到

        $.extend(dealWay,{
            getRedPocket:function(){//领取红包-买
                var cgId=lib.getUrlParam('cgId')?lib.getUrlParam('cgId'):13;//红包组Id
                var mId=lib.getUrlParam('mId')?lib.getUrlParam('mId'):"";//mId
                sessionStorage.cgId=cgId;//红包Id写入session
                sessionStorage.mm_mId=mId;//会员id写入session
                $("#getBtn").on("click",function(){
                    var phoneNum=$("#tel_input").val();
                    var numReg = /^1[3,4,5,7,8]\d{9}$/;
                    if(phoneNum===""){
                        alert("手机号不可为空！");
                    }else if(!numReg.test(phoneNum)){
                        alert("请输入正确的手机号！");
                    }else{
                        sessionStorage.phoneNum=phoneNum;//phoneNum写入session
                        common.js.ajx(getRedPocketUrl,{couponGroupId:cgId,phone:phoneNum},function(data){
                            if(data.infocode==="0"){//成功--跳转成功页面
                                location="/buyer/lqhongbaocg.html";
                            }else if(data.infocode==1){//没有注册--跳注册
                                location = "/buyer/login/dlzc.html?&zc=1&backUrl=/buyer/lqhongbaocg.html";
                            }else if(data.infocode==2){//注册没有登录--跳登录
                                location = "/buyer/login/dlzc.html?backUrl=/buyer/lqhongbaocg.html";
                            }else{
                                alert(data.info);
                            }
                        },function(){
                            alert("领取红包失败");
                        });
                    }
                });
            },
            getSuccess:function(){//领取红包成功-买
                var cgId=sessionStorage.cgId,
                    phoneNum=$.cookie('member_loginName');

                common.js.ajx(getRedPocketUrl,{couponGroupId:cgId,phone:phoneNum},function(data){
                    if(data.infocode==="0"){//成功--加载数据
                        $("#container").show();
                        createHTML(data);
                    }else if(data.infocode==1){//没有注册--跳注册
                        location = "/buyer/login/dlzc.html?&zc=1&backUrl=/buyer/lqhongbaocg.html";
                    }else if(data.infocode==2){//注册没有登录--跳登录
                        location = "/buyer/login/dlzc.html?backUrl=/buyer/lqhongbaocg.html";
                    }else{
                        guesslike(data.info);
                    }
                },function(){
                    alert("领取红包失败");
                });

                function createHTML(data){
                    var pocketStr="";
                    $("#member_name").html(data.info.memberName);
                    $.each(data.info.couponList,function(i,v){
                        var sdate=v.startDate.substr(0,10);
                        var edate=v.endDate.substr(0,10);
                        //console.log(sdate+'—'+edate)
                        pocketStr+='<div class="packet_unit"><div class="first_d"><span>'+v.faceValue+'<em>元</em></span> <span>'+v.title+'</span></div><div class="second_d"><span>满'+v.useFor+'元可用</span><span>'+sdate+'—'+edate+'</span></div></div>';
                    });
                    $("#packet_list").html(pocketStr);

                }
            },
            sharePocket:function(){//分享红包-卖
                common.js.ajx(shareRedPocketUrl,{},function(data){
                    if(data.infocode==="0"){//成功--加载数据
                        if(data.info.list_couponGroup.length!==0){
                            createHTML(data);
                        }else{
                            $("#noneList").show();
                        }
                    }else if(data.infocode==2){//无红包信息
                        $("#noneList").show();
                    }else{
                        alert(data.info);
                    }
                },function(){
                    alert("加载红包失败");
                });

                function createHTML(data){
                    var pocketStr="";
                    $.each(data.info.list_couponGroup,function(i,v){
                        pocketStr+='<li id="'+v.couponGroupId+'" title="'+v.groupName+'"><img src="'+reqUrl.imgPath+ v.pictureUrl+'" alt="'+ v.remark+'" data-url="'+reqUrl.imgPath+ v.imgUrl+'"/></li>';
                    });
                    $("#pocket_pic").html(pocketStr);
                    $("#pocket_pic li").eq(0).addClass("cur");
                    initWXShare($("#pocket_pic li").eq(0));
                    eventFun();
                }

                //事件
                function eventFun(){
                    //单选
                    $("#pocket_pic li").on("click",function(){
                        $(this).addClass("cur").siblings().removeClass("cur");
                        initWXShare($(this));
                    });

                    //二维码
                    $("#createQR").on("click",function(){
                        var groupId=$("#pocket_pic li.cur").attr("id"),
                            groupName=$("#pocket_pic li.cur").attr("title"),
                            qrCodeImg='http://api.qrserver.com/v1/create-qr-code/?data='+location.protocol+ '//' +location.host+'/buyer/lqhongbao.html?cgId='+groupId+'%26mId='+mId;
                        $("#qrImg").attr("src",qrCodeImg);
                        $("#groupName").html(groupName);
                        $("#ui-seller_qr_code").show();

                    });
                    $("#ui-seller_qr_code").on("click",function(){
                        $("#ui-seller_qr_code").hide();
                    });

                    //点击分享
                    $("#shareBtn").on("click",function(){
                        var curLi=$("#pocket_pic li.cur");
                        if(!curLi.length){
                            alert("无红包可分享");
                            return;
                        }
                        $("#fixed").css('display','block');
                    });

                    $("#fixed").on("click", function (e) {
                        if(lib.checkWeiXin())
                            $("#fixed").css('display','none');
                        else{
                            var target = e.srcElement ? e.srcElement : e.target;
                            if(target.className.indexOf("fixed") != -1){
                                $("#fixed").hide();
                            }
                        }
                    });
                }

                //分享函数
                function initWXShare(obj){
                    var objId=obj.attr("id");
                    if(lib.checkWeiXin()){
                        dataForWeixin.imgUrl = $(obj).find("img").attr("data-url");
                        dataForWeixin.title = $(obj).attr("title");
                        dataForWeixin.desc =  $(obj).find("img").attr("alt");
                        dataForWeixin.link =location.protocol+ '//' +location.host+'/buyer/lqhongbao.html?cgId='+objId+'&mId='+mId;
                        wxshare();

                    }else{
                        wapshare.setting.pic = $(obj).find("img").attr("data-url");
                        wapshare.setting.title =$(obj).attr("title");
                        wapshare.setting.summary = $(obj).find("img").attr("alt");
                        wapshare.setting.url =location.protocol+ '//' +location.host+'/buyer/lqhongbao.html?cgId='+objId+'&mId='+mId;
                        wapshare.loadScript();
                    }
                }

            },
            messageShare:function(){//短信分享红包--卖
                common.js.ajx(shareRedPocketUrl,{},function(data){
                    if(data.infocode==="0"){//成功--加载数据
                        if(data.info.list_couponGroup.length!==0){
                            createHTML(data);
                        }else{
                            guesslike("暂无信息");
                        }
                    }else if(data.infocode==2){//无信息
                        guesslike("暂无信息");
                    }else{
                        alert(data.info);
                    }
                },function(){
                    alert("加载短信失败");
                });

                function createHTML(data){
                    var messageStr="";
                    $.each(data.info.list_couponGroup,function(i,v){
                        var getUrlHref=location.protocol+ '//' +location.host+'/buyer/lqhongbao.html?cgId='+v.couponGroupId+'&mId='+mId;
                        messageStr+='<div class="template templatexq"><p class="sms_txt">'+v.remark+'</p><a href="'+getUrlHref+'">'+getUrlHref+'</a></div><div id="hint" class="hint">长按短信内容复制</div>';
                    });
                    $("#messageList").html(messageStr);
                }
            },
            myPocket:function(){//我的红包列表--买
                var pageNo= 1,
                    pageSize= 10,
                    keepLoad=true,
                    status=1;//1未使用 2已使用 3已过期
                showPocket();
                roll();
                activePocket();

                $("#tab_item li").on("click",function(){
                    $("#packet_list").html("");
                    keepLoad=true;
                    $(this).addClass("cur").siblings().removeClass("cur");
                    var index=$(this).index();
                    if(index===0){
                        status=1;
                    }else if(index==1){
                        status=3;
                    }else{
                        status=2;
                    }
                    pageNo=1;
                    showPocket();
                });
                //下滑自动加载
                function roll(){
                    $(window).scroll(function (){
                        if((keepLoad) && ($(window).scrollTop() > $(document).height() - $(window).height() - 50)){
                            ++pageNo;
                            showPocket();//红包展示
                            $(window).scrollTop($(document).height()-$(window).height()-50);
                        }
                    });
                }

                //展示红包列表
                function showPocket(){
                    var obj={status:status,page:pageNo,rows:pageSize};
                    var grayClass=status!=1?"gray":"";
                    $("#noMore").hide();
                    $(".guess_like").remove();
                    common.js.ajx(myRedPocketUrl,obj,function(data){
                        if(data.infocode==="0"){//成功
                            if(data.info.list_redPacket.length>0){
                                createHTML(data);
                            }else{//红包列表为空
                                keepLoad=false;
                                if(pageNo==1){
                                    $("#packet_list").html('');
                                    guesslike("暂无红包");
                                }else{
                                    $("#noMore").show();
                                }
                            }
                        }else if(data.infocode==2){//未登录
                            location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                        }else if(data.infocode==3){//无信息
                            keepLoad=false;
                            if(pageNo==1){
                                guesslike("暂无红包");
                            }else{
                                $("#noMore").show();
                            }
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("加载红包列表失败");
                    });

                    function createHTML(data){
                        var pocketStr="";
                        $("#available").html('('+data.info.unused+'元)');
                        $("#expire").html('('+data.info.invalid+'元)');
                        $("#used").html('('+data.info.used+'元)');

                        $.each(data.info.list_redPacket,function(i,v){
                            pocketStr+='<div class="packet_unit '+grayClass+'"><div class="first_d"><span>￥'+v.faceValue+'</span> <span>余额：￥'+v.balance+'</span></div><div class="second_d">红包编号：'+v.redPacketNo+'</div><div class="second_d">有效日期：'+v.createTime+'至'+v.effectiveTime+'</div><div class="use-now"><a href="/buyer/hongbaoshangpin.html">立即使用</a></div></div>';
                        });
                        pageNo==1?$("#packet_list").html(pocketStr):$("#packet_list").append(pocketStr);
                        if(hbid){
                            $("#activeInput").show();
                            $("#activeInput input").val("");
                        }
                    }
                }

                //红包激活
                function activePocket(){
                    $("#activeBtn").click(function(){//弹出激活弹窗
                        $("#activeInput").show();
                        $("#activeInput input").val("");

                    });
                    $(".close").click(function(){//关闭弹窗
                        if(hbid && $(this).parents("div").hasClass("box_btn")){
                            history.back();
                            return false;
                        }
                        $(".dialog_wrap").hide();
                        if($(this).attr("check")) location.reload();//领取成功查看红包的时候，刷新页面
                    });

                    $("#go_mall").click(function(){//进入红包商城，先关闭弹窗再跳转
                        $("#active_s").hide();
                        location="/buyer/hongbaoshangpin.html";
                    });
                    $("#qud").click(function(){
                        history.back();
                    })
                    $("#active_btn").click(function(){//点击激活
                        var val=$("#activeInput input").val();
                        $("#activeInput").hide();
                        if(val===""){
                            $("#dialog_err").show().find(".text").html("请输入兑换码");
                        }else{
                            common.js.ajx(activePocketUrl,{redPacketNo:val},function(data){
                                if(data.infocode==="0"){//成功
                                    if(hbid){
                                        $("#dialog_sss .text").html(data.info+'元红包已存入您的账户');
                                        $('#dialog_sss').show();
                                        return false ;
                                    }
                                    $("#facevalue").html(data.info);
                                    $('#active_s').show();
                                }else if(data.infocode==="1"){//未登录
                                    location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                                }else{
                                    $("#dialog_err").show().find(".text").html(data.info);
                                }
                            },function(){
                                alert("激活红包fail");
                            });
                        }
                    });
                }
                //

            },
            balanceItem:function(){
                var pageNo= 1,
                    pageSize= 20,
                    keepLoad=true,
                    status=1;//0-支出 1-收入

                showItem();
                roll();

                $("#tab_item li").on("click",function(){
                    $("#item_list").html("");
                    keepLoad=true;
                    $(this).addClass("cur").siblings().removeClass("cur");
                    var index=$(this).index();
                    if(index===0){
                        status=1;
                    }else{
                        status=0;
                    }
                    pageNo= 1;
                    showItem();
                });

                //下滑自动加载
                function roll(){
                    $(window).scroll(function (){
                        if((keepLoad) && ($(window).scrollTop() > $(document).height() - $(window).height() - 50)){
                            ++pageNo;
                            showItem();//红包明细展示
                            $(window).scrollTop($(document).height()-$(window).height()-50);
                        }
                    });
                }

                function showItem(){
                    var obj={costType:status,pageNo:pageNo,pageSize:pageSize};
                    $(".guess_like").remove();
                    $("#noMore").hide();
                    common.js.ajx(balanceItemUrl,obj,function(data){
                        if(data.infocode==="0"){
                            if(data.info.list.length===0){
                                keepLoad=false;
                                if(pageNo==1){
                                    guesslike("暂无明细");
                                }else{
                                    $("#noMore").show();
                                }
                            }else{
                                var itemStr="";
                                $.each(data.info.list,function(i,v){
                                    if(status===1){
                                        itemStr+='<li><p><span>红包收入</span><span>'+v.time+'</span></p><p>+ ￥'+ v.money+'</p></li>';
                                    }else{
                                        itemStr+='<li><p><span>红包支出</span><span>'+v.time+'</span></p><p>- ￥'+ v.money+'</p></li>';
                                    }

                                });
                                pageNo==1?$("#item_list").html(itemStr):$("#item_list").append(itemStr);

                            }
                        }else if(data.infocode==1){//未登录
                            location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("加载红包明细失败");
                    });
                }
                //
            }
        });

        if(htmlType=="lqhongbao"){
            return dealWay.getRedPocket();
        }else if(htmlType=='lqhonbaocg'){
            return dealWay.getSuccess();
        }else if(htmlType=='wxhongbao'){
            return dealWay.sharePocket();
        }else if(htmlType=='hongbao'){
            return dealWay.myPocket();
        }else if(htmlType=='dxhongbao'){
            return dealWay.messageShare();
        }else if(htmlType=='hongbaoitem'){
            return dealWay.balanceItem();
        }
    });
});
