define(function(require) {
    var $ = require('jquery');
    var libC =require('lib');
    var lib=new libC();
    var lrz=require('cropit');
    function uploadImg() {
         var imgbox="";//盛放图片的盒子

            $('#image-cropper').cropit();
            // Handle rotation
            $('.rotate-cw').click(function(){
                $('#image-cropper').cropit('rotateCW');
            });
            $('.rotate-ccw').click(function() {
                $('#image-cropper').cropit('rotateCCW');
            });

            //点击上传
            $("#exportClick").on("click",function(){
                exportClick();
            });
            function exportClick(){
                var imageData = $('#image-cropper').cropit('export',{
                    type: 'image/jpeg'
                });
                if(!imageData){
                    alert("选择图片");
                }else {
                    $.ajax({
                        type: "post",
                        url: lib.getReq().image + "pu",
                        data: {file: encodeURIComponent(imageData)},
                        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                        async: false,
                        dataType: "JSON",
                        success: function (data) {
                            if (typeof(data) != "object")
                                data = $.parseJSON(data);
                            if (data.status == "1") {
                                imgbox.attr("src",lib.getReq().imgPath+data.path);
                                $("#image-cropper-bg").hide();
                                lib.ajx(lib.getReq().ser+'member/updateHeadPic.action',{headPic:data.path},function(data){
                                      if(data.infocode!=="0"){
                                         alert("头像修改失败！");
                                      }
                                },function(){
                                    alert("头像修改失败！");
                                });
                            } else {
                                alert("因网络原因图片上传失败，请稍后再试！");
                            }
                        },
                        error: function (data, e) {
                            alert(e);
                        }
                    });
                }

            }
            //点击弹出剪裁弹框
            $("#img-sel-box").on("click",function(){
                $("#image-cropper-bg").show();
                 imgbox=$(this).find("img");
            });
            //关闭弹窗
            $("#remodal-close").on("click",function(){
                $("#image-cropper-bg").hide();
            });

    }
    return uploadImg();
});
