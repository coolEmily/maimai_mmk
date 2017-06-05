define(function(require) {
    var $ = require('zepto');
    var libC = require('lib');
    var lib = new libC();
    var lrz=require('lrzallbundle');
    function uploadImg() {
        $(document).on('tap', '.ui-add-button.ui-wc > div', function () {
            if (!confirm("此次上传图片会覆盖原始的图片，您确定继续执行")) {
                console.log("取消上传");
                return false;
            }
            $(this).prev().click();
        });
        $(document).on('change', 'input[type=file]', function () {
            lib.onLoading();
            // this.files[0] 为用户选择的文件
            //width:宽度 宽度自适应
            //quality：清晰度 范围0-1
            var _t = this;
            var _w = $(_t).data("width") ? $(_t).data("width") : 640;
            var _targetObj = $(_t).data("target");
            var _o = $(_t).data("opacity") ? $(_t).data("opacity") : 0.7;
            
            lrz(_t.files[0], {width: _w, quality: _o})
                .then(function (rst) {

                    var img = new Image();
                    img.src = rst.base64;
                    img.onload = function () {
                        //document.body.appendChild(img);
                    };
                    return rst;
                })

                .then(function (rst) {
                    
                    $.ajax({
                        type: "post",
                        url: lib.getReq().image + "pu",
                        data: {file: encodeURIComponent(rst.base64)},
                        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                        async: false,
                        dataType: "JSON",
                        success: function (data) {
                             lib.offLoading();
                            if (typeof(data) != "object")
                                data = $.parseJSON(data);
                            if (data.status == "1") {
                                $(_t).parent().addClass("ui-wc");
                                if ($(_targetObj).length > 0) {
                                    $(_targetObj).empty().append("<img src='" + lib.getReq().imgPath + data.path + "'>").attr("data-url", data.path);
                                } else {
                                    $(_t).after('<div name="' + _targetObj.substring(1, _targetObj.length) + '" id="' + _targetObj.substring(1, _targetObj.length) + '" class="' + _targetObj.substring(1, _targetObj.length) + '"></div>');
                                    $(_targetObj).empty().append("<img src='" + lib.getReq().imgPath + data.path + "'>").attr("data-url", data.path);
                                }

                            } else {
                                alert("因网络原因图片上传失败，请稍后再试！");
                            }
                        },
                        error: function (data, e) {
                            lib.offLoading();
                            alert(e);
                        }
                    });
                })

                .catch(function (err) {
                    alert(err);
                })
                .always(function () {
                    lib.offLoading();
                });
        });
    }
    return uploadImg;
});