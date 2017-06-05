/**
 * Created by yangfei on 17/5/25.
 */
require.config({baseUrl: '/js/lib', urlArgs: "v0.0.1"});
require(['zepto','lib'], function ($, lib) {
    var lib = new lib();
    var reqUrl = lib.getReq();
    var isFirst= true;
    $(function () {
        var ranking ={};
        $.extend(ranking, {
            init: function () {
                this.activeMissVoteTypeId = lib.getUrlParam("activeMissVoteTypeId");
                this.getPlayerRankingsUrl = reqUrl.ser + "/missplayer/getPlayerRankings.action";
                //获取排名数据
                this.getPlayerRankings(1);
                //tab切换
                this.toggle()
            },
            /**
             * 获取排名数据
             * @param n   1:鲜花排行 2:票数排行
             */
            getPlayerRankings:function (n) {
                var _this = this;
               lib.ajx(_this.getPlayerRankingsUrl,{
                   activeMissVoteTypeId: _this.activeMissVoteTypeId,
                   rankType: n
               },function (data) {
                   if(data.infocode == "0"){
                         _this.listshow(data,n);
                   }else {
                       alert(data.info);
                   }
                },function () {

               });
            },
            /**
             * 显示页面
             * @param data 获取的数据
             * @param n   1:鲜花排行 2:票数排行
             */
            listshow:function (data, n) {
                if(!data.info.dataList){
                    return;
                }
                if(!isFirst){
                    $(".list").html('')
                }
                var text =''
                if(n== "1"){
                    text = '朵'
                }else{
                    text = '票'
                }
                var arr=data.info.dataList;
                arr.forEach(function(value, index){
                    var Num=null;
                    if(n == "1"){
                        Num = value.flowerNum;
                    }else{
                        Num =value.votedNum;
                    }
                    var sortValue = value.sortValue< 10 ? '0'+ value.sortValue : value.sortValue;
                    var html = '';
                        html+='<li class="item"><div class="icon" style="background:url(/images/tv/miss_world/rank/'+(index+1)+'.png) no-repeat center center;background-size:contain"></div>';
                        html+='<div class="avatar" style="background:url('+reqUrl.imgPath+value.imgUrl+') no-repeat center center; background-size: cover;"></div><span class="num">'+sortValue+'</span><span class="name">'+value.playerName+'</span><span class="poll">'+Num+'</span><span class="unit">'+text+'</span></li>'
                    $(".list").append(html);
                    isFirst= false;
                })
            },
            //tab切换
            toggle: function () {
                var _this = this;
                $('.flower').on("click",function () {
                    _this.getPlayerRankings(1)
                    $(this).addClass("hover").siblings().removeClass("hover");
                })
                $('.vote').on("click",function () {
                    _this.getPlayerRankings(2)
                    $(this).addClass("hover").siblings().removeClass("hover");
                })
            }
        });
        ranking.init();
    })

})