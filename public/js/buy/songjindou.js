/**
 * Created by liusiyu on 2017/3/13.
 */
require.config({baseUrl: '/js/lib', urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function ($, lib) {
    lib = new lib();
    var bool1, bool2, bool3, psd, mobile, number, jindouMax_num;
    var songjindou = {};
    var reqUrl = lib.getReq().ser;
    $.extend(songjindou, {
        showAlert: function (content, obj) {
            obj.text(content);
        },
        alertText1: function () {
            var _t = this;

            if (sessionStorage.logName!=undefined && sessionStorage.jindou!=undefined) {
                $('.login_tel').val(sessionStorage.logName);
                $('.jindou_num').val(sessionStorage.jindou);
                mobile = $('.login_tel').val().trim();
                number = $('.jindou_num').val().trim();
                psd = $('.password').val().trim();
                bool1 = bool2 = true;
            };
            lib.ajx(reqUrl + '/virtualMoney/getUnusedVirtualMoney.action', {}, function (data) {
                if (data.infocode == 3) {
                    jindouMax_num = data.info.virtualMoneyBalance;
                    $('#num').text(jindouMax_num);
                } else if (data.infocode == 1) {
                    alert("请先登录");
                    location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                } else {
                    alert(data.info);
                }
            }, function (err) {
                if (err) {
                    alert(err);
                }
            });
            $('.login_tel').on('blur', function () {
                mobile = $(this).val().trim();
                var numReg = /^1[34578]\d{9}$/;
                bool1 = numReg.test(mobile);
                if (!bool1) {
                    _t.showAlert("请输入正确的手机号", $('.alert1'));
                    _t.makesure();
                    return;
                } else {
                    lib.ajx(reqUrl + '/member/isRegisted.action', {mobile: mobile}, function (data) {
                        if (data.infocode == "0") {
                            _t.showAlert("该用户不存在", $('.alert1'));
                            _t.makesure();
                            return;
                        } else {
                            _t.showAlert('', $('.alert1'));
                            _t.makesure();
                        }
                    }, function (err) {
                        if (err) {
                            alert(err);
                        }
                    });
                }
            });
        },
        alertText2: function () {
            var _t = this;
            $('.jindou_num').on('blur', function () {
                number = $(this).val().trim();
                bool2 = number ? number <= jindouMax_num : false;
                if (!bool2) {
                    _t.showAlert('您输入的金豆数量已超限', $('.alert2'));
                    _t.makesure();
                } else {
                    _t.showAlert('', $('.alert2'));
                    _t.makesure();
                }
            })
        },
        makesure: function () {
            bool3 = $('.password').val().trim();
            if (bool1 && bool2 && bool3) {
                $('.button_give').css('background', "#E61E1E");
                $('.button_give').off().on('click', function () {
                    psd = $('.password').val().trim();
                    lib.ajx(reqUrl + '/virtualMoney/sendVirtualMoney.action', {
                        phone: mobile,
                        virtualMoneyNum: number,
                        pass: psd
                    }, function (data) {
                        if (data.infocode == "4") {
                            songjindou.showAlert('密码错误', $('.alert3'));
                            $('.psd_setting a').text('忘记密码?');
                            return;
                        } else if (data.infocode == "2") {
                            alert(data.info);
                            sessionStorage.logName = '';
                            sessionStorage.jindou = '';
                            setTimeout(function () {
                                location.href = '/buyer/home/bean/jindoumxview.html';
                            }, 1000);
                        } else {
                            alert(data.info);
                        }
                    }, function (err) {
                        if (err) {
                            alert(err);
                        }
                    });
                })
            } else {
                $('.button_give').css('background', "#DDDDDD").attr('href', 'javascript:;');
                $('.suc').css('display', 'none');
            }
        }

    });
    songjindou.alertText1();
    songjindou.alertText2();
    $('.password').on('blur', function () {
        songjindou.makesure();
    });
    $('.inp>input').each(function () {
        $(this).on('focus', function () {
            $(this).next().text('');
        })
    });
    $('.psd_setting').on('click', function () {
        sessionStorage.logName = mobile;
        sessionStorage.jindou = number;
    });
});