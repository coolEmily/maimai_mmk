/**
 * Created by yaoyao on 2016/4/18.
 */
requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib'], function ($,lib) {
        lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var dPath="/g?"+lib.getMid()+"&gId=";
    $(function(){
        var addGoods={};
        var htmlType=$(".main_head").attr("headId"),//页面类型
            goodsClassUrl = reqUrl.ser+'goodsClass/getGoodsClassPublicInfo.action',//商品分类
            goodsListUrl = reqUrl.ser+'goodsBasePublic/goodsBasePublicListInfo.action',//商品列表
            selectItemUrl = reqUrl.ser+'goodsBasePublic/goodsBasePublicInit.action';//筛选的下拉
        var sortId=1;
        $.extend(addGoods,{
            goodsClass:function(){
                //筛选条件切换
                $("#project div").on("tap", function () {
                    $(this).addClass("redColor").siblings().removeClass("redColor");
                    sortId=$(this).index()+1;
                    $("#selectWrap").html("");
                    sortList();
                });
                function selectEvent(){
                    $("#selectWrap select").unbind("change");
                    $("#selectWrap select").on("change",function(){
                        var val=$(this).val();
                        var tIndex=$(this).parent().index();
                        var headerLen=$("#selectWrap .header").length;
                        $.each($("#selectWrap .header"),function(i,v){
                           $(v).index()>tIndex?$(v).remove():"";
                        });

                        if(val!==""){
                           if(sortId==2 && (headerLen>2 ||headerLen==2)){
                              //控制第三方商品，只展示两级分类
                           }else{
                               sortList(val);
                           }
                        }
                    });
                }
                sortList();
                function sortList(classId){
                     common.js.ajx(goodsClassUrl,{classId:classId},function(data){
                         if(data.infocode==="0"){
                             var optionStr="<option value=''>全部</option>";
                             $.each(data.info.list_goodsClass,function(i,v){
                                 optionStr+="<option value='"+v.classId+"'>"+v.className+"</option>";
                             });
                             var selectStr='<div class="header ui-transd-999"><div>商品分类：</div><select>'+optionStr+'</select></div>';
                             $("#selectWrap").append(selectStr);
                             selectEvent();//选择事件
                         }else if(data.infocode==2){
                             //没有分类信息了;
                         }else{
                             alert(data.info);
                         }
                     },function(){
                         alert("分类加载失败！");
                     });
                }
                //点击筛选按钮--跳转页面
                $("#select_btn").on("tap",function(){
                    var optionId=$("#selectWrap .header:last").find("select").val();

                    sessionStorage.optionId=optionId;//商品的分类Id
                    sessionStorage.sortId=sortId;//区分官方商品库和第三方

                    optionId?location="/admin/tianjiaspk_list.html":alert("请选择商品分类！");
                });
            },
            goodsList:function(){
                var optionId=sessionStorage.optionId;
                var sortId=sessionStorage.sortId;
                var pageNo= 1,
                    rows=10,
                    allPages= 1,
                    trademarkId="",
                    globalAreaId="";

                 loadList();//加载列表
                 roll();//下滑

                //下滑自动加载
                function roll() {
                    $(window).scroll(function () {
                        if(pageNo>allPages || pageNo==allPages){
                           $("#noneMore").show();
                        }else{
                            if(($(window).scrollTop() > $(document).height() - $(window).height() - 10)) {
                                ++pageNo;
                                loadList();//获取数据
                                $(window).scrollTop($(document).height() - $(window).height() - 50);
                            }
                        }
                    });
                }

                //筛选条件
                common.js.ajx(selectItemUrl,{classId:optionId},function(data){
                     if(data.infocode==="0"){
                         var areaStr="<option value=''>全部</option>",
                             brandStr="<option value=''>全部</option>";
                         $.each(data.info.list_areaList,function(i,v){
                             areaStr+='<option value="'+v.globalAreaId+'">'+ v.areaName+'</option>';
                         });
                         $.each(data.info.list_classTrademark,function(i,v){
                             brandStr+='<option value="'+v.trademarkId+'">'+ v.trademarkName+'</option>';
                         });
                         $("#brandSelect").html(brandStr);
                         $("#areaSelect").html(areaStr);
                         selectList();
                     }else{
                         alert(data.info);
                     }
                },function(){
                    alert("商品筛选条件加载失败！");
                });

                //点击筛选条件，筛选商品
                function selectList(){
                    $("#brandSelect").on("change",function(){
                        trademarkId=$(this).val();
                        pageNo=1;
                        $("#goodsWrap").html("");
                        loadList();
                    });
                    $("#areaSelect").on("change",function(){
                        globalAreaId=$(this).val();
                        pageNo=1;
                        $("#goodsWrap").html("");
                        loadList();
                    });
                }

                //商品列表加载
                function loadList(){
                    $("#noneList").hide();
                    var obj={classId:optionId,goodsOrigin:sortId,page:pageNo,rows:rows,trademarkId:trademarkId,globalAreaId:globalAreaId};
                    common.js.ajx(goodsListUrl,obj,function(data){
                        if(data.infocode==="0"){
                            var listStr="";
                                allPages=Math.ceil(data.info.count/rows);
                            $.each(data.info.list_goodsBasePublic,function(i,v){
                                listStr+='<dl><dt><a href="'+dPath+v.goodsId+'"><img src="'+reqUrl.imgPath+v.mainPictureJPG+'_C"alt=""></a></dt><dd><a href="'+dPath+v.goodsId+'">'+v.chName+'</a><div class="button"><a  href="/admin/tianjiasp.html?sgId='+v.goodsId+'&origin=1">我要售卖</a></div></dd></dl>';
                            });
                            pageNo==1?$("#goodsWrap").show().html(listStr):$("#goodsWrap").append(listStr);
                        }else if(data.infocode==2){
                            $("#noneList").show();
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("商品列表加载失败！");
                    });
                }

            }

        });

        if(htmlType=="goods_sort"){
           return addGoods.goodsClass();
        }else{
           return addGoods.goodsList();
        }

    });
});