require.config({baseUrl: '../js/lib'});
require(['zepto', 'lib', 'visitor-logs'], function($, lib, vl){
    lib = new lib();
    $(function(){
        var info={};
        var htmlT=$("#container").attr("htmlT");//0--egghit.html;1--egghit_rule.html;
        $.extend(info,{
            init:function(){
                var _t=this;
                _t.mId=lib.getUrlParam('mId')?lib.getUrlParam('mId'):1;//推荐人ID
                _t.yId=lib.getUrlParam('luckyId')?lib.getUrlParam('luckyId'):5;//活动ID

                sessionStorage.mm_mId=_t.mId;//会员id写入session--给登录注册用

                _t.rewardUrl=lib.getReq().ser+"draw/getDrawMemberInfo.action?activeDrawId="+_t.yId;
                _t.selectEggUrl=lib.getReq().ser+"draw/getDrawGetInfo2.action?activeDrawId="+_t.yId;//砸金蛋

                if(_t.yId == 37){//luckyId=37--“立即使用”按钮--跳转不同链接
                    $("#dialogWrap .atOnce").attr("href","http://m.maimaicn.com/buyer/cuxiaoxq.html?rLocationId=136&mId=321237");
                }else if(_t.yId == 41){//41
                    $("#dialogWrap .atOnce").attr("href","http://m.maimaicn.com/buyer/cuxiaoxq.html?rLocationId=137&mId=321237");
                }

                _t.activityFun();
                _t.marqueeReward();

                $("#dialogWrap > div > img").on("click",function(){
                    $("#dialogWrap").hide();
                });

                $(".egg_list li").click(function() {
                    _t.eggClick($(this));
                });

                $("#go-login").on("click",function(){
                    location="/buyer/login/dlzc.html?backUrl="+lib.getBackUrl();
                });

                $("#back").on("click",function(){//页面返回
                    if(window.history.length > 1){
                        window.history.go( -1 );
                    }else{
                        window.location="/";
                    }
                });
                vl.setLog(window.location.href, 2);//会员访问日志
            },
            initRule:function(){
                var ruleImg=sessionStorage.ruleImg?lib.getReq().imgPath+sessionStorage.ruleImg:"../images/eggImg/eggrule.png";
                $("#imgBg").attr("src",ruleImg);
            },
            initEntrance:function(){
                var _t=this;
                _t.qr=lib.getUrlParam('id')?lib.getUrlParam('id'):"X001";//活动ID
                _t.analysisQrUrl=lib.getReq().ser+"twoDimensionCode/getInfoByTwoDimensionCodeNo.action";

                lib.ajx(_t.analysisQrUrl,{twoDimensionCodeNo:_t.qr},function(data){
                    if(data.infocode==="0"){
                        var d=data.info[0];
                        if(d){
                            var imgbg=d.imgPath?lib.getReq().imgPath+d.imgPath:"../images/eggImg/entrance.png";
                            $("#container").css({"background":"url("+imgbg+")","background-size":"100% 100%"});//背景图片

                            bindMemberId=d.bindMemberId?d.bindMemberId:1;
                            $("#redEnvelope").tap(function(){
                                location='/buyer/egghit.html?luckyId='+d.activeDrawId+'&mId='+bindMemberId;
                            });
                            $("#freeBuy").tap(function(){
                                location='/buyer/lingyuangouzq.html?activeId='+d.freeSaleId+'&mId='+bindMemberId;
                            });

                            _t.rewardUrl=lib.getReq().ser+"draw/getDrawMemberInfo.action?activeDrawId="+d.activeDrawId;
                            _t.marqueeReward();
                        }else{
                            alert("二维编码不正确")
                        }
                    }

                },function(){
                    alert("解析二维码ajax fail");
                });
            },
            eggClick:function(obj) {
                var _t=this;
                dEle=$("#dialogWrap");
                if (obj.hasClass("current")){
                    var usedLen=$(".egg_list").find(".current").length;
                    if(usedLen>2){
                        dEle.find("img").attr("src","/images/eggImg/dialogn.png");
                        dEle.find(".atOnce").css({"top":"66%"});
                        dEle.find(".checkWallet").css({"top":"81%"});
                        dEle.find("span").html("");
                        dEle.show();
                    }
                    return false;
                }else{
                    if($.cookie("member_loginName")){
                        if(lib.checkWeiXin() && $.cookie("member_loginName").length === 7){
                            location = "/login/bangding.html?backUrl=" + lib.getBackUrl();
                            return;
                        }
                    }

                    lib.ajx(_t.selectEggUrl,{issueMemberId:_t.mId},function(data){

                        if(data.infocode === "10") {//10：领取成功返回数据（已登录领取成功）
                            obj.children("span").hide();
                            obj.addClass("current"); //蛋碎效果
                            obj.find("sup").show(); //金花四溅

                            $('.result_tip').animate({}, 500, function() {//--延迟500
                                if(data.info.goodsType===0){//0---抽中红包
                                    dEle.find("span").css("top","45%").html(data.info.goodsName);
                                    dEle.show();
                                }else{//1、2---抽中商品或谢谢惠顾
                                    alert(data.info.goodsName);
                                }
                            });
                        }else if(data.infocode === "13"){//13: 登录后可再次赠送3次抽奖机会哦（未登录第二次领取）
                            dEle.find("span").html("");
                            sessionStorage.removeItem('linkUrl');
                            dEle.find("div").css("margin-top","50%");
                            dEle.find("img").attr("src","/images/eggImg/login_ts.png");
                            dEle.find("#go-login").css({"height":"19%","top":"65%"}).show().siblings("a").hide();
                            dEle.show();
                        }else if(data.infocode === "11"){// 11：领取成功返回数据（未登录首次领取）
                            sessionStorage.linkUrl="/buyer/home/hongbao.html";//首次领取跳到红包页面
                            dEle.find("img").attr("src","/images/eggImg/dialog_1.png");
                            dEle.find("#go-login").css({"top":"66%"}).show().siblings("a").hide();
                            dEle.find("span").css({'top': '45%',
                            'color': '#a9a9a9',
                            'line-height': '20px',
                            'width': '69%',
                            'margin-left': '15%',
                            'font-size': '15px',
                         }).html('手气不错哦～抽中最高可减免'+data.info.goodsName.replace(/[^0-9]/ig,"")+'元的全品类红包，登录后 领取使用');
                            dEle.show();
                        }else if(data.infocode === "12"){// 12: 您的抽奖次数已用完（已登录领完）
                            dEle.find("img").attr("src","/images/eggImg/dialogn.png");
                            dEle.find(".atOnce").css({"top":"66%"});
                            dEle.find(".checkWallet").css({"top":"81%"});
                            dEle.find("span").html("");
                            dEle.show();
                        }else{
                            alert(data.info);
                        }

                    },function(){
                        alert("抽取红包fail");
                    });
                }
            },
            activityFun:function(){//活动奖项
                var con=$("#container");
                var bgImg=con.attr("bg-img"),
                    ruleImg=con.attr("rule-img");
                window.sessionStorage.ruleImg=ruleImg;//活动规则图片
                bgImg=bgImg?lib.getReq().imgPath+bgImg:'../images/eggImg/n_egg.gif';
                con.css({"background":"url("+bgImg+") no-repeat","background-size":"100% 100%"});
            },
            marqueeReward:function(){//跑马灯--获奖人员
               var _t=this;
               var data={"infocode":"0","info":{"list_Enty":[{"memberPicture":"","goodsName":"恭喜,182****9667抽中了100元红包"},{"memberPicture":"","goodsName":"恭喜,182****9667抽中了100元红包"},{"memberPicture":"","goodsName":"恭喜,182****9667抽中了300元红包"},{"memberPicture":"png/20170209/default/72809047491152","goodsName":"恭喜,138****5939抽中了200元红包"},{"memberPicture":"png/20170209/default/72809047491152","goodsName":"恭喜,138****5939抽中了100元红包"},{"memberPicture":"png/20170209/default/72809047491152","goodsName":"恭喜,138****5939抽中了10元红包"},{"memberPicture":"png/20161209/default/16222654243987488","goodsName":"恭喜,135****3179抽中了200元红包"},{"memberPicture":"png/20161209/default/16222654243987488","goodsName":"恭喜,135****3179抽中了100元红包"},{"memberPicture":"png/20161209/default/16222654243987488","goodsName":"恭喜,135****3179抽中了200元红包"},{"memberPicture":"","goodsName":"恭喜,188****1379抽中了10元红包"}],"activeDrawName":"红包商城","activeDrawNo":"160927964566101"}};

//                lib.ajx(_t.rewardUrl,{},function(data){//暂时将获奖人员数据写死
                    if(data.infocode==="0"){
                        var liStr="";
                        $.each(data.info.list_Enty,function(i,v){
                            var imgSrc=v.memberPicture?lib.getReq().imgPath+v.memberPicture:'/images/default.png';
                            liStr+='<li><img src="'+imgSrc+'" alt=""/><span>'+v.goodsName+'</span></li>';
                        });
                        $("#marquee").html(liStr);
                        margueeFun();
                    }
//                },function(){
//                    alert("获奖人员fail")
//                });

                function margueeFun(){//跑马灯效果
                    var w=0;//ul宽度
                    var wWin=$(window).width();
                    $("#marquee li").each(function(i,v){
                        w+=$(v).width()+1;
                    });
                    $("#marquee").width(w+"px");
                    //
                    var mLeft=0;
                    var repeat=setInterval(function(){
                        if(mLeft==-w){
                            mLeft=wWin/2;
                        }
                        mLeft--;
                        $("#marquee").css("margin-left",mLeft)
                    },15)
                }

            }


        });
        if(htmlT==="0"){
            info.init();
        }else if(htmlT==="1"){
            info.initRule();//金蛋活动规则页面
        }else if(htmlT==="2"){
            info.initEntrance();//金蛋活动入口

        }

    });
});