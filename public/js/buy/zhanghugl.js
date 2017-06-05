require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib','uploadImg1'],function($,lib){
    lib = new lib();
    $(function(){
        var account = {
            init: function(){
                var _t = this;
                var mHead = $.cookie('member_headPic'); //
                var mNick = $.cookie('member_nickname');
                $('.field-img > img').attr('src',mHead?lib.getReq().imgPath+mHead:"/images/default.png");
                $('.field-name').html(mNick);
                _t.initEvent();
            },
            initEvent: function(){
                //解决click延迟现象
                // $('#acc-page  ._goback').off('click').on("tap", function () {
                //     window.history.back(-1);
                // });

                $('#nick-go').off('click tap').on('click',function(){
                    $('#acc-page').show();
                    $('#nick-page').hide();
                });
                $('#nick').on('tap',function(){
                    $('#acc-page').hide();
                    $('#nick-page').show();
                    $('#nick-name').val($.cookie('member_nickname'));
                    $('#nick-name').focus();
                });
                $('#nick-clear').on('tap',function(){
                   $('#nick-name').val('');
                   $('#nick-name').focus();
                });
                $('#nick-save').on('tap',function(){
                    if($.trim($('#nick-name').val()) === ''){
                        alert("请填写昵称");
                        return;
                    }
                    lib.ajx(lib.getReq().ser +'/member/updateNickname.action',{nickname:$.trim($('#nick-name').val())},function(data){
                        if(data.infocode === "0"){
                            window.location.reload();
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("修改昵称失败");
                    });
                });
            }
        };
        account.init();
    });
});
