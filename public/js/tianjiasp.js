/**
 * Created by yaoyao on 2016/4/18.
 */
requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib','uploadImg'], function ($,lib,loadimg) {
           lib = new lib();
       var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
        loadimg();//运行图片加载
    $(function(){
        //保存时：白板--来源2；修改--来源2,goodsId必有；公共：来源1，goodsId无;
        //页面加载时：修改--来源2,goodsId必有；公共：来源1，goodsId必有;
        var sgId=common.tools.getUrlParam("sgId")?common.tools.getUrlParam("sgId"):10008;
        var origin=common.tools.getUrlParam("origin")?common.tools.getUrlParam("origin"):"";
        var initUrl=reqUrl.ser+"goodsBase/memberGoodsInit.action";//初始化数据
        var editAllUrl=reqUrl.ser+"goodsBase/memberGoodsBaseInfo.action",//?goodsId
            areaUrl=reqUrl.ser+"goodsBase/globalAreaListAll.action",//世界地区
            goodsClassUrl=reqUrl.ser+"goodsClass/getGoodsClassInfo.action",//获取商品二级分类
            specificUrl=reqUrl.ser+"goodsClass/gClassParametersInfo.action",//点击二级分类获取详细下拉
            saveDataUrl=reqUrl.ser+"goodsBase/memberGoodsSave.action";//保存数据
        var editId="";//编辑时传goosId;添加时传空
        if(window.location.href.indexOf("sgId")==-1){
            origin=2;
            initFun();//添加商品函数
            $("#navtext").html("添加新的商品");
             $("<title>添加新的商品</title>").appendTo($("head"));
        }else{
            if(origin==2){
                editId=sgId;
                $("#navtext").html("修改自营商品");
                $("<title>修改自营商品</title>").appendTo($("head"));
            }else if(origin==1){
                $("<title>添加商品库商品</title>").appendTo($("head"));
            }
            initEditFun();//修改商品函数
        }
        //页面数据初始化---修改
        function initEditFun(){
            //alert('initEditFun');
            common.js.ajx(editAllUrl,{goodsId:sgId,goodsOrigin:origin},function(data){
                if (data.infocode === "0"){
                    addEditData(data.info);
                    onchangeFun();
                }else if(data.infocode==2){
                    location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                }else{
                    alert(data.info);
                }
            }, function(){
                alert("页面整体数据");
            });
        }
        //页面数据初始化---添加
        function initFun(){
           // alert('initFun');
            common.js.ajx(initUrl,{},function(data){
                if (data.infocode === "0"){
                    addData(data.info);
                    onchangeFun();
                }else if(data.infocode==2){
                    location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                }else{
                    alert(data.info);
                }
            }, function(){
                alert("初始化数据失败");
            });
        }

        //控制数字输入
        $(".inputNum").on('keyup', function (event) {
            var $amountInput = $(this);
            //响应鼠标事件，允许左右方向键移动
            event = window.event || event;
            if (event.keyCode == 37 || event.keyCode == 39) {
                return;
            }
            //先把非数字的都替换掉，除了数字和.
            $amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
            //只允许一个小数点
            replace(/^\./g, "").replace(/\.{2,}/g, ".").
            //只能输入小数点后两位
            replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
        });
        $(".inputNum").on('blur', function () {
            var $amountInput = $(this);
            //最后一位是小数点的话，移除
            $amountInput.val(($amountInput.val().replace(/\.$/g, "")));
        });

        //数据填充---添加
        function addData(dInfo){
            eachFun(dInfo.list_goodsClass,"goods_sort");//商品分类1级
            eachFun(dInfo.list_areaList,"world_sort");//地区分类1级
            eachFun(dInfo.list_DeliveryPriceType,"delivery_model");//推手返利
            eachFun(dInfo.list_backRebate,"benefit");//推手返利
            eachFun(dInfo.list_backRebate_type,"benefit_plat");//平台返利
            clickli();
            //遍历函数
            function eachFun(d,selectId){
                var sebe=selectId=="benefit_plat";//判断是平台返利
                var optionStr=sebe?"":'<option value="">请选择</option>';
                $.each(d,function(i,v){
                    if(i===0 && sebe){
                        optionStr+='<li value="'+v.id+'" class="cur">'+ v.name+'%</li>';
                    }else{
                        optionStr+=sebe?'<li value="'+v.id+'">'+ v.name+'%</li>':'<option value="'+v.id+'">'+ v.name+'</option>';
                    }

                });
                $("#"+selectId).html(optionStr);
            }
        }
        //数据填充--修改
        function addEditData(dInfo){
            //商品相册图
            $.each(dInfo.list_photo,function(i,v){
                var imgCon=$("#list_photo").find(".ui-add-img-button").eq(i);
                imgCon.html('<div class="ui-add-button ui-wc"><input id="" data-width="640" data-target=".playPicture'+i+'" type="file" accept="image/*"><div id="playPicture'+i+'" name="playPicture'+i+'" class="playPicture'+i+'" data-url="'+v.albumURL+'"><img src="'+reqUrl.imgPath+v.albumURL+'"></div></div>');
            });

           //图文详情
            if(dInfo.list_goodsRich.length<7){
                $.each(dInfo.list_goodsRich,function(i,v){
                    var imgCon=$("#goodsRich").find(".ui-add-img-button").eq(i);
                    imgCon.html('<div class="ui-add-button ui-wc"><input id="" data-width="640" data-target=".detailPicture'+i+'" type="file" accept="image/*"><div id="detailPicture'+i+'"  name="detailPicture'+i+'"  class="detailPicture'+i+'" data-url="'+v.pictureUrl+'"><img src="'+reqUrl.imgPath+v.pictureUrl+'"></div></div>');
                });
            }else{
                var imgconStr="";
                $.each(dInfo.list_goodsRich,function(i,v){
                    imgconStr+='<div class="ui-input ui-add-img-button"><div class="ui-add-button ui-wc"><input id="" data-width="640" data-target=".detailPicture'+i+'" type="file" accept="image/*"><div id="detailPicture'+i+'"  name="detailPicture'+i+'"  class="detailPicture'+i+'" data-url="'+v.pictureUrl+'"><img src="'+reqUrl.imgPath+v.pictureUrl+'"></div></div></div>';
                });
                $("#goodsRich").html(imgconStr);
            }


            /*---------------*/
            selectFun(dInfo.list_goodsClass_one,$("#goods_sort"),"goods");//分类一级
            selectFun(dInfo.list_goodsClass_two,$("#goods_sort2"),"goods");//分类二级
            selectFun(dInfo.list_areaList_one,$("#world_sort"),"area");//地区一级
            selectFun(dInfo.list_areaList_two,$("#world_sort2"),"area");//地区二级
            selectFun(dInfo.list_DeliveryPriceType,$("#delivery_model"),"delivery");//运费模板
            selectFun(dInfo.list_backRebate,$("#benefit"),"benefit");//商品佣金类型
            selectFun(dInfo.list_backRebate_type,$("#benefit_plat"),false);//平台返利
            clickli();
            function selectFun(dataInfo,conEle,mark){
                var optionStr="<option value=''>请选择</option>";
                var liStr="";
                $.each(dataInfo,function(i,v){
                    var name="", id="";
                    if(mark=="goods"){
                       name= v.className;id=v.classId;
                    }else if(mark=="area"){
                       name= v.areaName;id=v.globalAreaId;
                    }else if(mark=="benefit"){
                        name= v.typeName;id=v.backRebateId;
                    }else if(mark=="delivery"){
                        name= v.deliveryPriceTypeName;id=v.deliveryPriceTypeId;
                    }else{
                        name=v.rebateValue;id=v.backTypeId;
                    }
                    optionStr+=v.select=="select"?'<option selected="selected" value="'+id+'">'+name+'</option>':'<option value="'+id+'">'+name+'</option>';
                    liStr+=v.select=="select"?'<li value="'+id+'"class="cur">'+name+'%</li>':'<li value="'+id+'">'+name+'%</li>';
                });
                mark?conEle.html(optionStr):conEle.html(liStr);
            }

            /*-----不同商品有不同的下拉信息----------*/
            var infoSelect="";
             $.each(dInfo.list_result,function(i,v){
                 infoSelect+='<div class="ui-add-t ui-add-t2"><div class="ui-color-333" id="'+v.parametersId+'">'+v.parametersName+'</div><div' +
                 ' class="ui-transd-999"><select><option value="">请选择</option>';
                 $.each(v.list_classParametersValue,function(i,v){
                     infoSelect+=v.select=="select"?'<option selected="selected" value="'+ v.classParametersValueId+'">'+ v.parametersValue+'</option>':'<option value="'+ v.classParametersValueId+'">'+ v.parametersValue+'</option>';
                 });
                 infoSelect+='</select></div></div>';
             });
             $("#specificSelect").html(infoSelect);

            /*--------商品文本框的一些信息------------*/
            $("#chName").val(dInfo.chName);
            $("#enName").val(dInfo.enName);
            $("#weight").val(dInfo.weight);
            $("#sellUnit").val(dInfo.sellUnit);
            $("#sellingPrice ").val(dInfo.sellingPrice);
            $("#marketPrice ").val(dInfo.marketPrice);
            $("#storage").val(dInfo.inventoryNum);
            $("#slogan").val(dInfo.slogan);//广告语

        }
        //保存函数
        saveFun();
        function saveFun(){
            $("#ifagree").on("tap",function(){
                var that=$(this);
                that.hasClass("on")?that.removeClass("on"):that.addClass("on");
            });
            $("#savebtn").on("tap",function(){
                var obj={};
                obj.goodsId=editId;
                obj.goodsOrigin=origin;
                obj.classId=$("#goods_sort2").val()!==""?$("#goods_sort2").val():$("#goods_sort").val();//商品二级分类id,无二去一级
                obj.globalAreaId=$("#world_sort2").val()!==""?$("#world_sort2").val():$("#world_sort").val();//地区二级id,无二取一
                obj.deliveryPriceTypeId=$("#delivery_model").val();//运费模板
                obj.chName=$("#chName").val();//商品中文名称
                obj.enName=$("#enName").val();//商品英文名称
                obj.weight=$("#weight").val();//商品重量
                obj.marketPrice=$("#marketPrice").val();//商品市场价
                obj.sellingPrice=$("#sellingPrice").val();//商品售价
                obj.sellUnit=$("#sellUnit").val();//销售单位
                obj.backRebateId=$("#benefit").val();//推手返佣比例id
                obj.slogan=$("#slogan").val();//广告语
                obj.inventoryNum=$("#storage").val();//库存

                var pfs=$("#benefit_plat li.cur").html();
                    pfs?pfs = pfs.substring(0,pfs.length - 1):"";
                obj.platformMoney=pfs;//平台返佣的值
                //图片相册和图片详情
                var photoArr=[],goodsRichArr=[],mapValueArr=[];
                $.each($("#list_photo .ui-add-img-button"),function(i,v){
                    $(v).find("img").length!==0?photoArr.push($(v).find("img").parent().attr('data-url')):"";
                });
                $.each($("#goodsRich .ui-add-img-button"),function(i,v){
                    $(v).find("img").length!==0?goodsRichArr.push($(v).find("img").parent().attr('data-url')):"";
                });
                //二级菜单带出的几个不定项
                $.each($("#specificSelect .ui-color-333"),function(i,v){
                    var cId=$(v).next().find("select").val();
                        cId?mapValueArr.push(v.id+"-"+cId):"";
                });
                obj.photo=photoArr.join(",");
                obj.goodsRich=goodsRichArr.join(",");
                obj.mapValue=mapValueArr.join(",");

                var ifture=true;
                $.each(obj,function(k,v){
                    if(v==="" && k!=="enName" && k!=="mapValue" && k!=="goodsId"){ifture=false;}
                });

                if(!ifture){
                  alert("请完善必填信息！");
                }else if(!$("#ifagree").hasClass("on")){
                   alert("请勾选页面底部，同意将商品分享到买买酒库");
                }else{
                    common.js.ajx(saveDataUrl,obj,function(data){
                        if(data.infocode==="0"){
                            alert(data.info);
                            sessionStorage.indexH=2;
                            location="/admin/shangpin.html";
                        }else if(data.infocode==2) {
                            location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("保存商品失败");
                    });
                }

            });
        }
        //平台返佣点击
        function clickli(){
            $("#benefit_plat li").on("tap",function(){//平台返利切换
                $(this).addClass("cur").siblings().removeClass("cur");
            });
        }
        //点击下拉菜单，获取菜单二级
        function onchangeFun(){
            $("#goods_sort").on("change",function(){
                var valId=$(this).val();
                valId!==""?secondListFun(goodsClassUrl,{classId:valId},"goods_sort2"):$("#goods_sort2").html('<option' +
                    ' value="">请选择</option>');//商品
            });
            $("#world_sort").on("change",function(){
                var valId=$(this).val();//地区id
                var areaName=$(this).find("option:selected").html();//地区名称
                valId!==""?secondListFun(areaUrl,{globalAreaId:valId,areaName:areaName},"world_sort2"):$("#world_sort2").html('<option' +
                    ' value="">请选择</option>');//地区
            });
            //二级
            function secondListFun(dataUrl,parameter,selectId) {
                $("#" + selectId).html("");
                common.js.ajx(dataUrl, parameter, function (data) {
                    if (data.infocode === "0") {
                        var optionStr = '<option value="">请选择</option>';
                        var d = data.info.list_goodsClass ? data.info.list_goodsClass : data.info.list_areaList;
                        $.each(d, function (i, v) {
                            var id = v.classId ? v.classId : v.globalAreaId,
                                name = v.className ? v.className : v.areaName;
                            optionStr += '<option value="' + id + '">' + name + '</option>';
                        });
                        $("#" + selectId).html(optionStr);
                        onchangeSecond();
                    }else if(data.infocode == 2){
                        $("#" + selectId).html('<option value="">请选择</option>');
                        $("#specificSelect").html("");
                    }else{
                        alert(data.info);
                    }
                }, function(){
                    alert("请求失败");
                });
            }
        }
        //点击二级商品分类，调取详细信息下拉
        function onchangeSecond(){
            $("#goods_sort2").unbind("change");
            $("#goods_sort2").on("change",function(){
                var valId=$(this).val();
                valId!==""?specificInfoFun({classId:valId}):"";//点击二级商品，改变下方详细信息

            });
            function specificInfoFun(parameter){
                common.js.ajx(specificUrl, parameter, function (data){
                    if (data.infocode === "0") {
                        var conStr = '';
                        var d = data.info.list_result;
                        $.each(d, function (i, v) {
                            conStr+='<div class="ui-add-t ui-add-t2"><div class="ui-color-333" id="'+v.parametersId+'">'+v.parametersName+':</div><div class="ui-transd-999"><select><option value="">请选择</option>';
                            $.each(v.list_classParametersValue,function(ic,vc){
                                conStr+='<option value="'+vc.classParametersValueId+'">'+vc.parametersValue+'</option>';
                            });
                            conStr+='</select></div></div>';
                        });
                        $("#specificSelect").html(conStr);
                    }else if(data.infocode == 3){//无信息
                       $("#specificSelect").html("");
                    }else if(data.infocode == 2){
                        location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                    }else{
                        alert(data.info);
                    }
                }, function () {
                    alert("请求失败");
                });
            }
        }
    });
});