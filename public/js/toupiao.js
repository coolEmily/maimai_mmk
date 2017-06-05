require.config({baseUrl: '/js/lib', urlArgs: "v0.0.1"});
require(['zepto', 'lib'],function ($, lib) {
    var lib = new lib();
    var reqUrl = lib.getReq();
    $(function () {
        var toupiao = {},vote =null,flag="";
        var isFirst =true;
        $.extend(toupiao,{
            init:function () {
                this.playerList=[];
                this.activeVoteTypeId = lib.getUrlParam("activeVoteTypeId") || 1;
                this.activeVoteUrl=reqUrl.ser + "/vote/getVoteInfo.action";
                this.voteUrl = reqUrl.ser +"/vote/votePlayer.action";
                //获取投票信息
                this.activeVote();
                this.isLogin();
                this.goLogin();
                this.voted(); //投票
            },
            //获取投票信息
            activeVote:function () {
                var _this =this;
                lib.ajx(_this.activeVoteUrl, {activeVoteTypeId: _this.activeVoteTypeId},
                    function (data) {
                       if(data.infocode == "3"){
                           var playerList = data.info.playerList;
                           $("#title").html(data.info.activeVoteName);
                           $(".head_a").css({"background":"url("+reqUrl.imgPath+playerList[0].imgUrl+") no-repeat center center","background-size":"cover"})
                           $(".head_b").css({"background":"url("+reqUrl.imgPath+playerList[1].imgUrl+") no-repeat center center","background-size":"cover"})
                           _this.playerList=playerList;
                       }else{
                           alert(data.info)
                       }
                })
            },
            isLogin:function () {
                var _this =this;
                $(".v_b1").on("tap",function () {
                     if(!isFirst){
                         $(".b4").css("display","block")
                         $('.shade').css("display","block");
                         setTimeout(function () {
                             $(".b4").css("display","none")
                             $('.shade').css("display","none");
                         },2000)
                         return
                     }

                    if ($.cookie("member_loginName") && ($.cookie("member_loginName").length === 11)) {
                        var playerName1 = _this.playerList[0].playerName
                        var text= "你确定为A队"+playerName1+"投票?"
                        flag="a"
                        $(".b2>span").text(text);
                        $('.shade').css("display","block");
                        $(".b2").css("display","block");
                    }else{
                        $(".b1").css("display","block");
                        $('.shade').css("display","block");
                    }
                })
                $(".v_b2").on("tap",function () {
                    if(!isFirst){
                        $(".b4").css("display","block")
                        $('.shade').css("display","block");
                        setTimeout(function () {
                            $(".b4").css("display","none")
                            $('.shade').css("display","none");
                        },2000)
                        return
                    }
                    if ($.cookie("member_loginName") && ($.cookie("member_loginName").length === 11)) {
                        var playerName2 = _this.playerList[1].playerName
                        var text= "你确定为B队"+playerName2+"投票?"
                        flag="b"
                        $(".b2>span").text(text);
                        $(".b2").css("display","block");
                        $('.shade').css("display","block");
                    }else{
                        $(".b1").css("display","block");
                        $('.shade').css("display","block");
                    }
                })
            },
            goLogin:function () {
                $(".go-denglu").on("tap",function () {
                    location.href = "/buyer/login/dlzc.html?backUrl=/tv/toupiao.html?" + location.search.substring(1)
                    $('.shade').css("display","none");
                })
            },
            voted:function () {
                var _this=this;
                 $(".cancel").on("tap",function () {
                     $(".b2").css("display","none")
                     $('.shade').css("display","none");
                 })
                $(".confirm").on("tap",function () {
                    var activeVotePlayerId ="";
                    var activeVotePlayerId1 = _this.playerList[0].activeVotePlayerId
                    var activeVotePlayerId2 = _this.playerList[1].activeVotePlayerId

                    if(flag == "a"){
                        activeVotePlayerId=activeVotePlayerId1;

                    }else if(flag == "b"){
                        activeVotePlayerId=activeVotePlayerId2;
                    }
                    lib.ajx(_this.voteUrl,{
                        activeVoteTypeId:_this.activeVoteTypeId,
                        activeVotePlayerId:activeVotePlayerId
                    },function (data) {
                        if(data.infocode == "3"){
                            isFirst = false
                            $(".b3").css("display","block");
                            $(".b2").css("display","none");
                            $('.shade').css("display","block");
                            setTimeout(function () {
                                $(".b3").css("display","none")
                                $('.shade').css("display","none");
                            },2000)
                        }else if(data.infocode == "6"){
                            $(".b2").css("display","none");
                            $(".b4").css("display","block");
                            setTimeout(function () {
                                $(".b4").css("display","none")
                                $('.shade').css("display","none");
                            },2000)
                        }else {
                            alert(data.info)
                        }
                    });
                })
            }
        })
        toupiao.init()
    })

})
