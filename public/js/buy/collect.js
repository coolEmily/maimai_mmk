/*收藏页面和浏览记录页面公用的js*/
requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib','guesslike',"rememberThePosition"], function ($,lib,guesslike,remosition){
     lib = new lib();
    var  common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var dPath="/g?"+lib.getMid();
    $(function(){
        var empty=false;
        var rows=10;//每页条数
        var allPages=2;//总页数
        var pageNo=1;//页数
        var cancelUrl = reqUrl.ser + "goodsCollect/updateGoodsCollectAll.action",//取消收藏
            collectUrl=reqUrl.ser+"goodsCollect/goodsCollectInfo.action";//近期收藏
        var browseUrl = reqUrl.ser+"visitLog/getMyScanHistory.action",//浏览记录
            browseDelUrl=reqUrl.ser+"visitLog/deleteScanHistory.action";//删除记录
        $("#collect").length===1?collectFun():browseFun();
        remosition.init(true);
        //下滑自动加载
        function roll(ajaxFun){
            $(window).scroll(function (){
               if((pageNo<allPages) && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    ++pageNo;
					// 更改属性
                    ajaxFun();//商品展示
                    $(window).scrollTop($(document).height()-$(window).height()-50);
                 }
				remosition.replace({page:pageNo});
            });
        }
        //收藏数据
        function collectFun(){
            var ajaxFun=function(obj){
                 common.js.ajx(collectUrl,{pageNo:pageNo,pageSize:rows},function(data){
                     if(data.infocode==="0"){
                         allPages=Math.ceil(data.info.count/rows);
                         var goodsCollect=data.info.list_goodsCollect;
                         var goodsCollectStr="";
                         $.each(goodsCollect,function(index,item){
                             goodsCollectStr+='<a data-href="'+dPath+'&gId='+item.goodsId+'" class="ui-collect-show"><div class="ui-img" id="'+item.goodsId+'"><img src="'+reqUrl.imgPath+lib.getImgSize(item.mainPictureJPG,"C")+'"/></div> <div class="ui-desc"><p>'+item.chName+'</p><p>'+item.enName+'</p><p>￥'+item.sellingPrice+'</p></div></a>';
                         });
                         pageNo == 1? $("#collect_list").html(goodsCollectStr) : $("#collect_list").append(goodsCollectStr);//获取数据追加到列表
                     }else if(data.infocode==3){//近期无收藏
                         guesslike("近期无收藏");
                     }else if(data.infocode==2){//会员未登录
                         location="/buyer/login/dlzc.html?backUrl="+common.tools.getBackUrl();
                     }else{
                         alert(data.info);
                     }
                 },function(){
                     alert("近期收藏失败！");
                 });
             }
          
              if(remosition.page){
				rows=(remosition.page)*rows;
				}else{
                    ajaxFun();
                }
						remosition.renderPage(ajaxFun);
						 roll(ajaxFun);

            deleteFun(cancelUrl);/*删除*/
        };

        //浏览记录
        function browseFun(){
            var ajaxFun=function(){
                common.js.ajx(browseUrl,{pageNo:pageNo,pageSize:rows},function(data){
                    if(data.infocode==="0"){
                        allPages=Math.ceil(data.info.count/rows);
                        var goodsCollect=data.info.dataList;
                        var goodsCollectStr="";
                        $.each(goodsCollect,function(index,item){
                            goodsCollectStr+='<a data-href="'+dPath+'&gId='+item.goodsId+'" class="ui-collect-show"><div class="ui-img" id="'+item.visitGoodsLogId+'"><span><img src="'+reqUrl.imgPath+lib.getImgSize(item.goodsPic,"C")+'"/></span></div> <div class="ui-desc"><p>'+item.chName+'</p><p>'+item.enName+'</p><p>￥'+item.goodsPrice+'</p></div></a>';
                        });
                        pageNo == 1 ?$("#collect_list").html(goodsCollectStr) : $("#collect_list").append(goodsCollectStr);//获取数据追加到列表
												//
												pageNo=rows/10;
												rows=10;
                    }else if(data.infocode==4){//无浏览记录
                        guesslike("近期无浏览");
                    }else if(data.infocode==2){//会员未登录
                        location="/buyer/login/dlzc.html?backUrl="+common.tools.getBackUrl();
                    }else{
                        alert(data.info);
                    }

                },function(){
                    alert("获取记录失败！");
                });
            }
            ajaxFun();
            deleteFun(browseDelUrl);/*删除*/
        }

        //删除数据
        function deleteFun(delUrl){
            $(document).on("tap", ".ui-del", function () {
                var goodsIdArr = [];
                $("#collect_list .ui-img").each(function () {
                    if ($(this).hasClass("on")) {
                        goodsIdArr.push($(this).attr("id"));
                    }
                });
              
                if (goodsIdArr.length === 0) {
                    alert("没有选中商品！");
                } else {
                    var r = confirm("确定要删除吗？");
                    var paramObj=delUrl==browseDelUrl?{historyIds:goodsIdArr.join(",")}:{goodsId:goodsIdArr.join(",")};
                    if (!r) {
                        completeOp(".ui-collect-op");
                    } else {
                        common.js.ajx(delUrl,paramObj, function (data) {
                            if (data.infocode === "0") {
                                alert(data.info);
                                location.reload();//页面重新加载
                            } else if (data.infocode == 2) {//未登录
                                location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                            } else {
                                alert(data.info);
                            }
                        }, function () {
                            alert("删除记录失败！");
                        });
                    }
                }
            });
        }
        /*编辑或完成*/
        $(document).on("tap", ".ui-collect-op", function () {
            if (empty) return;
            if ($(this).hasClass("on")) {
                completeOp(this);
            } else {
                editeOp(this);
            }
        });

        /*去掉*/
        $(document).on("tap", ".ui-quit", function () {
            completeOp(".ui-collect-op");
        });

        /*全选*/
        $(document).on("tap", ".ui-show-diff.on", function () {
            if ($(this).hasClass("all")) {
                $(this).removeClass("all");
                $(".ui-img").removeClass("on");
            } else {
                $(this).addClass("all");
                $(".ui-img").addClass("on");
            }
        });

        /*全选*/
        $(document).on("tap", ".ui-collect-show.on", function () {
            if ($(this).children().eq(0).hasClass("on")) {
                $(this).children().eq(0).removeClass("on");
            } else {
                $(this).children().eq(0).addClass("on");
            }
            if ($(".ui-collect-show.on > .ui-img.on").length == $(".ui-collect-show.on").length) {
                $(".ui-show-diff.on").addClass("all");
            } else {
                $(".ui-show-diff.on").removeClass("all");
            }
        });
        
        /*全选*/
        $(document).on("tap", ".ui-collect-show:not(.on)", function () {
            location.href = $(this).attr("data-href");
        });

        /*点击完成 或取消*/
        function completeOp(obj){
            $(obj).removeClass("on");
            $(obj).text("编辑");
            $(".ui-collect-show").removeClass("on");
            $("body").removeClass("on");
            $(".ui-show-diff").removeClass("on");
            $(".ui-show-diff").removeClass("all");
            $(".ui-show-diff").addClass("off");
            $(".ui-img").removeClass("on");
            $(".ui-delandquit").removeClass("on");
        }

        /*点击编辑*/
        function editeOp(obj){
            $(obj).addClass("on");
            $(obj).text("完成");
            $("body").addClass("on");
            $(".ui-collect-show").addClass("on");
            $(".ui-show-diff").addClass("on");
            $(".ui-delandquit").addClass("on");
            $(".ui-show-diff").removeClass("off");
        }

    });
});
