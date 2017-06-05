/**
 * Created by yaoyao on 2016/4/13.
 */
requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib'], function ($,lib) {
        lib = new lib();
        var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var dPath="/g?"+lib.getMid()+'&gId=';
    $(function($){
        var showGoodsUrl=reqUrl.ser+"goodsBase/proprietaryGoodsBaseList.action",//商品列表
            offGoodsUrl=reqUrl.ser+"goodsBase/upGoodsBaseList.action",//下架商品
            editPriceStockUrl=reqUrl.ser+"goodsBase/upGoodsBaseByGoodsId.action";//修改价格和库存
        var rows=4;//每页条数
        var allPages=2;//总页数
        var pageNo=1;//页数
        var indexH=sessionStorage.indexH?sessionStorage.indexH:0;//0-下架的 1-上架 已售 2:待审核
        selectAfter(indexH);
        roll();//下滑
        preventFun();
        //筛选状态
        $("#titword").on("click",function(){
            if($("#select_box").is(":visible")===true){
                $("#select_box").hide();
                $("#trianglered").hide();
                $("#triangle").show();
            }else{
                $("#select_box").show();
                $("#trianglered").show();
                $("#triangle").hide();
            }
        });

        $("#itemcon li").on("click",function(){
            var ind=$(this).index();
            selectAfter(ind);
        });

        //筛选调取数据
        function selectAfter(ind){
            var con=$("#itemcon li").eq(ind).html();
            var dealgoods=$("#off_goods");
            if(ind===0){//出售中
                status=1;
                dealgoods.html("下架已选商品");
            }else if(ind==1){//已下架
                status=0;
                dealgoods.html("上架已选商品");
            }else{//审核中
                status=2;
                dealgoods.html("修改选中商品");
            }
            $("#goods_wrap").html("");
            $("#noneList").show();
            sessionStorage.indexH=ind;//写到session
            pageNo=1;
            showGoodsFun();//加载列表

            $("#itemcon li").eq(ind).addClass("cur").siblings().removeClass("cur");

            $("#itemcon li").eq(ind).siblings().find("span").remove();
            $('<span class="radioimg"></span>').appendTo($("#itemcon li").eq(ind));

            $("#select_box").hide();
            $("#titword_text").html(con);
            $("#trianglered").hide();
            $("#triangle").show();
        }

        //添加商品
        $("#add_goods").on("click",function(){
            $(this).parent().prev().show();
            $("#coverbox").show();
        });
        $("#coverbox").on("click",function(){
            $(".dealBtn ol").hide();
            $("#coverbox").hide();
        });
        function clickFun(){
            //文本框输入数字
            $("#goods_wrap").find("input").on("keyup",function(){
                  $(this).val($(this).val().replace(/\D/gi,''));
            });
            //二维码
            var qrcodeBox = $("#ui-seller_qr_code");
            $("#goods_wrap .ui-show-qr").unbind("click");
            $("#goods_wrap .ui-show-qr").on("click", function () {
                clickFun();
                var qrImg = reqUrl.imgPath + $(this).html(),
                    goodsImg = reqUrl.imgPath + $(this).attr("imglink");

                $("#qrImg").attr("src", qrImg);
                $("#goodsImg").attr("src", goodsImg);
                qrcodeBox.show();
            });
            qrcodeBox.unbind("click");
            qrcodeBox.on("click", function () {
                qrcodeBox.hide();
            });

            //单选按钮
            $("#goods_wrap .orderunit dt").unbind("tap");
            if(status==2){//待审核
                $("#goods_wrap .orderunit dt").on("tap", function () {
                    var dtEle = $(this);
                        dtEle.addClass("on");
                        $(this).parents('.orderunit').siblings().find("dt").removeClass("on");
                });
            }else{
                $("#goods_wrap .orderunit dt").on("tap", function () {
                    var dtEle = $(this);
                    dtEle.hasClass("on") ? dtEle.removeClass("on") : dtEle.addClass("on");
                });
            }
            

            //下架已选商品
            var goodsIdArr = [];
            $("#off_goods").unbind("click");
            $("#off_goods").on("click",function(){
                goodsIdArr = [];
                $("#goods_wrap .orderunit").each(function () {
                    if ($(this).find("dt").hasClass("on")) {
                        goodsIdArr.push($(this).attr("id"));
                    }
                });

                if (goodsIdArr.length === 0) {
                    alert("请选择商品");
                } else {
                    status==2?location='/admin/tianjiasp.html?sgId='+goodsIdArr[0]+'&origin=2':actionFun();
                }

            });

            function actionFun(){
                var updown=status===0?1:0;//0-下架 1-上架
                common.js.ajx(offGoodsUrl, {goodsId: goodsIdArr.join(","),updown:updown}, function (data) {
                    if (data.infocode === "0") {
                        alert(status===0?"上架商品成功！":"下架商品成功");
                        pageNo=1;
                        showGoodsFun();//商品展示
                    } else if (data.infocode == 3) {
                        location ="/login/denglu.html?backUrl="+ common.tools.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("商品上下架失败");
                });
            }

            //修改价格和库存---删除
            $("#goods_wrap .sellPrice").on("blur",function(){
                editPriceStock($(this));
            });
            $("#goods_wrap .stock").on("blur",function(){
                editPriceStock($(this));
            });
            function editPriceStock(_this){
                var price=_this.parents(".orderunit").find(".sellPrice").val(),
                    stock=_this.parents(".orderunit").find(".stock").val(),
                    goodsId=_this.parents(".orderunit").attr("id");
                common.js.ajx(editPriceStockUrl, {goodsId:goodsId,sellingPrice:price,inventoryNum:stock}, function (data) {
                    if (data.infocode === "0") {
                        //alert(data.info);
                    } else if (data.infocode == 2){
                        location ="/login/denglu.html?backUrl="+ common.tools.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function(){
                    alert("修改失败");
                });
            }
        }
        //下滑自动加载
        function roll(){
            $(window).scroll(function (){
                if((pageNo<allPages) && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    ++pageNo;
                    showGoodsFun();//商品展示
                    $(window).scrollTop($(document).height()-$(window).height()-50);
                }
            });
        }
        //阻止默认touchmove事件
        function preventFun(){
            document.body.addEventListener('touchmove', function (event) {//遮罩层出现的情况下，禁止页面滚动
                if( $("#select_box").is(":visible") || $("#coverbox").is(":visible")){
                    event.preventDefault();
                }
            }, false);
        }
        //商品展示
        function showGoodsFun(){
            var obj={statusUpDown:status,page:pageNo,rows:rows};
            $("#noneList").hide();
            common.js.ajx(showGoodsUrl,obj,function(data){
                if(data.infocode==="0"){
                    var dataList=data.info.list_goodsBase,
                        listStr="";
                        allPages=Math.ceil(data.info.count/rows);

                    $.each(dataList,function(i,v){
                        var imgUrl=reqUrl.imgPath+lib.getImgSize(v.mainPictureJPG,"C");
                        if(status==1){//出售中
                           listStr+='<div class="orderunit"  id="'+v.goodsId+'"><div class="goodslist goodslist_now"><div class="ui-show-qr"  imglink="'+v.mainPictureJPG+'">'+v.mainPicture+'</div><dl><dt><a href="javascript:void(0)"><img src="'+imgUrl+'"></a></dt><dd><ul><li><a href="'+dPath+v.goodsId+'">'+v.chName+'</a></li><li><a href="'+dPath+v.goodsId+'">'+v.enName+'</a></li><li class="inputli"><span>单价：</span><input type="tel" value="'+v.sellingPrice+'" class="sellPrice"/></li><li class="inputli"><span>库存：</span><input type="tel" value="'+v.inventoryNum+'" class="stock" /></li></ul></dd></dl></div></div>';
                        }else if(status===0){//下架
                            listStr+='<div class="orderunit"  id="'+v.goodsId+'"><div class="goodslist"><div><a href="/admin/tianjiasp.html?sgId='+v.goodsId+'&origin=2">修改</a></div><dl><dt><a href="javascript:void(0)"><img src="'+imgUrl+'"></a></dt><dd><ul><li><a href="'+dPath+v.goodsId+'">'+v.chName+'</a></li><li><a href="'+dPath+v.goodsId+'">'+v.enName+'</a></li> <li class="ui-goods-p">￥'+v.sellingPrice+' <span>库存：'+v.inventoryNum+'</span></li></ul></dd></dl></div></div>';
                        }else{
                            if(v.auditStatus==3){//审核不通过
                                listStr+='<div class="orderunit"  id="'+v.goodsId+'"><div class="goodslist"><div><p>未通过</p></div><dl><dt><a href="javascript:void(0)"><img src="'+imgUrl+'"></a></dt><dd><ul><li><a href="'+dPath+v.goodsId+'">'+v.chName+'</a></li><li><a href="'+dPath+v.goodsId+'">'+v.enName+'</a></li> <li class="ui-goods-p">￥'+v.sellingPrice+' <span>库存：'+v.inventoryNum+'</span></li></ul></dd></dl></div></div>';
                            }else if(v.auditStatus==1){//审核中
                                listStr+='<div class="orderunit noSelectBtn"  id="'+v.goodsId+'"><div class="goodslist"><div><p>审核中</p></div><dl><dt><a href="javascript:void(0)"><img src="'+imgUrl+'"></a></dt><dd><ul><li><a href="'+dPath+v.goodsId+'">'+v.chName+'</a></li><li><a href="'+dPath+v.goodsId+'">'+v.enName+'</a></li> <li class="ui-goods-p">￥'+v.sellingPrice+' <span>库存：'+v.inventoryNum+'</span></li></ul></dd></dl></div></div>';
                            }

                        }
                    });
                    pageNo == 1 ? $("#goods_wrap").html(listStr) : $("#goods_wrap").append(listStr);//获取数据追加到列表
                }else if(data.infocode==2){
                    location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                }else if(data.infocode==3){
                    if(pageNo == 1){
                        $("#goods_wrap").html("");
                        $("#noneList").show();
                    }
                }else{
                    alert(data.info);
                }
                clickFun();//点击事件
            },function(){
                alert("商品列表失败");
            });
        }
    });
});