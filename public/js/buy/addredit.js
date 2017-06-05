/**
 * Created by liuhh on 2016/4/13.
 */
requirejs.config({baseUrl: '/js/lib'});
require(['zepto','lib'], function ($,lib) {
    //全局变量
    lib = new lib();
    var gDetail="";
    var zoneId=['','','',''];//当前省市县zId
    var zoneLv = 0; //记录上次选择类别
    var zoneList = ["province","city","county"];
    var zoneO = null;

    var addr = {
        reqUrl: lib.getReq().ser,
        saveAddr : function (saveData){
            var reqUrl ='';
            if(saveData.addressId)
                reqUrl = this.reqUrl+ "/receiveAddr/updateAddress.action";
            else
                reqUrl = this.reqUrl+ "/receiveAddr/saveAddress.action";

            lib.ajx(reqUrl,saveData,function(data){
                if(data.infocode == "0"){
                    if($("#isDefault").hasClass("on")){
                        window.location.href = lib.getUrlParam("backUrl") ? lib.getUrlParam("backUrl") : "/buyer/home/dizhi.html";
                        return;
                    }
                    //console.log(data.info);
                    if(lib.getUrlParam("backUrl"))
                        window.location.href = "./dizhi.html?backUrl="+lib.getUrlParam("backUrl");
                    else
                        window.location.href = "./dizhi.html";
                }else{
                    alert(data.info);
                    if(data.infocode === '3') location.href = "../../login/denglu.html?backUrl=" + lib.getBackUrl();
                }
            },function(){alert("地址保存失败!");});
            },
        getProv : function (index,args){
            //oData:ajax请求参数对象， provId:省份下拉框ID -> zoneId 索引
            lib.ajx(this.reqUrl+ "/receiveAddr/getKVAreaByPId.action",args,function(data){
                if(data.infocode == "0"){
                    addr.setProv(data, index);
                }else{
                    alert(data.info);
                }
            },function(){alert("地址信息获取失败!");});


        },
        setProv : function (provData, index){
            var flag = provData.infocode;
            if(flag == "0"){
                var list = provData.info;
                var h = '';
                for(var i=0; i < list.length; i++){
                    h +='<li class="ar-zone" zid="'+list[i].chinaAreaId+'">'+list[i].areaName+'</li>';
                }
                $('#ar-zones').html(h);
                if(zoneId[index+1])
                    $('.ar-zone[zid="'+zoneId[index+1]+'"]').addClass('cur');
            }else{
                alert(provData.info);
            }
        },
        len : function (s) {
            //获取中英文字符串长度
            if(s == ""){return 0;}
            var l = 0;
            var a = s.split("");
            for (var i=0;i<a.length;i++) {
                if (a[i].charCodeAt(0)<299) {
                    l++;
                }else{
                    l+=2;
                }
            }
            return l;
        },
        stringCheck : function (str){
            if(str==null||str=="") return false;
            var result=str.match(/^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/);
            if(result==null)return false;
            return true;
        } ,
        checkName : function (inptVal, errObj, maxLen){
            //校验收货人
            var retFlag = false;
            errObj.show();
            var strLen = addr.len(inptVal);
            console.log("name:",strLen);
            maxLen = parseInt(maxLen);
            if(strLen > 0 && strLen < maxLen && addr.stringCheck(inptVal)){
                errObj.hide();
                retFlag = true;
            }
            return retFlag;
        },
        checkNull : function (val, errObj){
            //var cVal = $("#county").val();
            var retFlag = false;
            errObj.show();
            if(val != ""){
                errObj.hide();
                retFlag = true;
            }
            return retFlag;
        },
        checkDet : function (val, errObj, maxLen){
            //var isDet = $("#detail").val();
            var strLen = addr.len(val);
            var retFlag = false;
            console.log("checkDet:",strLen);
            maxLen = parseInt(maxLen);
            errObj.show();
            if(strLen > 0 && (strLen < maxLen)){
                errObj.hide();
                retFlag = true;
            }
            return retFlag;
        },
        isPhone : function (str){
            return /^(1[3,4,5,7,8])\d{9}$/.test(str);
        },
        checkTel : function (telNo, errObj){
            var retFlag = false;
            errObj.show();
            if(telNo.length > 0 && addr.isPhone(telNo)){
                errObj.hide();
                retFlag = true;
            }
            return retFlag;
        },
        //保存收货地址
        addAddress:function(){
            var a = addr.checkName($("#consignee").val(), $("#consiErr"), 25),//校验 收货人

                b = addr.checkNull(zoneId[1], $("#provErr")),//校验 省
                c = addr.checkNull(zoneId[2], $("#cityErr")),//校验 市
                d = addr.checkNull(zoneId[3], $("#countyErr")),//校验 县

                e = addr.checkDet($("#detail").val(), $("#detailErr"), 125),//校验 详细地址
                f = addr.checkTel($("#mobile").val(), $("#mobileErr"));//校验 手机
            if(!(a && b && c && d && e && f)){
                alert('请填写完整的地址信息');
                return;
            }

            var  obj = {
                chinaAreaId:zoneId[3],
                receiverName:$("#consignee").val(),
                detailAddress:$("#detail").val(),
                mobile:$("#mobile").val(),
                isDefault:$("#isDefault").hasClass("on")?1:0
            };
            if(window.sessionStorage && typeof sessionStorage.addr_edit_id != "undefined"){
                obj.addressId = sessionStorage.addr_edit_id;
            }

            addr.saveAddr(obj);
        },
        getAddrInfo :function(){
            lib.ajx(this.reqUrl+ "/receiveAddr/getAddressById.action",{"addressId":sessionStorage.addr_edit_id},function(data){
                if(data.infocode == "0"){
                    addr.setAddr(data);
                }else{
                    alert(data.info);
                }
            },function(){alert("地址获取失败!");});
        },
        setAddr :function(data){
            var flag = data.infocode;
            if(flag == "0"){
                var list = data.info.addressList;
                var msg = list[0];
                $("#consignee").val(msg.receiverName);//收货人
                $("#detail").val(msg.detailAddress);//详细地址
                $("#mobile").val(msg.mobile);//手机
                if(msg.isDefault)
                    $("#isDefault").addClass("on");

                var selVal = msg.map_now_address;

                zoneLv = 0;
                zoneId[1] = selVal[2].code;
                zoneId[2] = selVal[1].code;
                zoneId[3] = selVal[0].code;

                $('#province').html(selVal[2].areaName);
                $('#city').html(selVal[1].areaName);
                $("#county").html(selVal[0].areaName);

            }else{
                alert(data.info);
            }
        },
         doDetail:function(){
             if(addr.len($('#detail').val())>120){
                 $('#detail').val(gDetail);
             }else{
                 gDetail = $('#detail').val();
             }
         }
    };

    $(function () {
        var time = null;
        $("#detail").on('focus',function(){
            time =  setInterval(addr.doDetail, 100);
        });

        $('#detail').on('blur',function(){
            clearInterval(time);
        });
        addr.getProv("province","");

        $(".ui-add-address").on('tap',function(){
            addr.addAddress();
        });
        $("#isDefault").on('tap',function(){
            $(this).hasClass("on")?$(this).removeClass("on"):$(this).addClass("on");
        });

        //如果是编辑地址，根据id获取相应的信息
        if(window.sessionStorage && typeof sessionStorage.addr_edit_id != "undefined"){
            $("#addr_title").html("修改地址");
            document.title="修改地址";
            addr.getAddrInfo();

        }

        //初始化地址弹框
        $('.ar-box').css('height',document.documentElement.clientHeight * 0.6 +'px');
        $('.ar-box .ar-zones').css('height',document.documentElement.clientHeight * 0.6 -66 +'px');

        $('#province,#city,#county').on('tap',function(){
            zoneO = $(this);
            var lv = parseInt(zoneO.attr('lv'));
            //确保按顺序选择 #province -> #city -> #county
            if(lv > 0 && $('#'+zoneList[lv-1]).text() === '请选择' ){
                alert('请先选择上级地区');
                return;
            }
            if(lv != zoneLv){
                //加载地区信息 填充到地址弹框
                addr.getProv(lv,{pid : zoneId[lv]});
            }
            zoneLv = lv;
            $('.ar-zone').each(function(){
                //地区列表显示当前选中项
                if($(this).attr('zid') == zoneId[lv+1]){
                    $(this).addClass('cur').siblings().removeClass('cur');
                    return false;
                }
            });
            //$('.ar-zone[zid="'+zoneId[lv+1]+'"]').addClass('cur').siblings().removeClass('cur');
            $('.ar-bk').show();
        });
        //关闭地址弹框
        $(document).on("tap", ".ar-bk", function(e){
            var target = e.srcElement ? e.srcElement : e.target;
            var triTarget = ['ar-bk','ar-close','ar-zone']
            for(var i =0; i <triTarget.length;i++){
                if(target.className.indexOf(triTarget[i]) != -1){
                    $(".ar-bk").hide();
                    break;
                }
            }
        });
        //选择地区
        $(document).on('tap','.ar-zone',function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            var index = parseInt(zoneO.attr('lv')) +1;
            zoneO.html($(this).text());
            zoneId[index] = $(this).attr('zid'); //存放上级zid
            for(var i =index; i <zoneId.length -1; i++){ //清空下级zid
                $('#'+zoneList[i]).html('请选择');
                zoneId[i+1] = '';
            }
        })

    });
});