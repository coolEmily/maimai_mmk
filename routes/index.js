var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var mail = require('../tools/mail');
var channel_ids = require('../tools/channel_ids');

//默认跳转到首页

router.get(/^\/(buyer\/shouye.html)?$/, function (req, res, next) {
    var _domain = 'http://mmkyf.maimaicn.com/mmjmanager/';
    if (global.__isOnline) {
        _domain = 'http://api.maimaicn.com/mmjmanager/';
    }
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    var memberId = req.query.sId || Cookies.maimaicn_s_id;
    request.get(_domain + '/mainPage/getMallName.action?memberId=' + memberId, {timeout: 10000}, function(error, response, body){
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        if(body.infocode === "0"){
          res.render('buyer/shouye.html', {title: body.info.mallName});
        }else{
          res.render('buyer/shouye.html', {title: '买买商城-全品类商城,品牌直采,正品超级低价'});
        }
      }else{
        res.render('buyer/shouye.html', {title: '买买商城-全品类商城,品牌直采,正品超级低价'});
      }
    });
});

//详情页分发路由
router.get('/g', function (req, res, next) {
    var params = req.query;
    var _domain = 'http://mmkyf.maimaicn.com/mmjmanager/';
    var obj = JSON.stringify(params);
    var gId = params.gId;
    if (!gId) {
        next();
        return;
    }
    if (global.__isOnline) {
        _domain = 'http://api.maimaicn.com/mmjmanager/';
    }
    var reqUrl = _domain + 'goodsBase/goodsBaseTypeInfo.action?goodsId=' + params.gId;
    var onePath = 'buyer/xiangqing.html';
    var morePath = 'buyer/kunbang.html';
    request.get(reqUrl, {timeout: 10000}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            if (result.infocode == '0') {
                var pageType = result.info.goodsBaseType;
                if (pageType == 1) {
                    res.render(onePath, {params: obj});
                } else if (pageType == 2) {
                    res.render(morePath, {params: obj});
                }
            } else {
                res.render(onePath, {params: obj});
            }
        } else {
            if (error && error.code === 'ETIMEDOUT') {//如果请求超时
                if (global.__isOnline) {
                    mail.send('vipisy@qq.com,254894243@qq.com', 'from: ' + (global.__isOnline ? 'online' : 'offline') + '<br/>api: /goodsBase/goodsBaseTypeInfo.action <br/>info: goods api timeout.');
                }
                res.render(onePath, {params: obj});
            } else {
                console.log(error);
            }
        }
    })
});

//砸金蛋分发路由--(静态添加title)
router.get('/buyer/egghit.html', function (req, res, next) {
    var params = req.query;
    var _domain = 'http://mmkyf.maimaicn.com/mmjmanager/';
    var obj = JSON.stringify(params);

    if (global.__isOnline) {
        _domain = 'http://api.maimaicn.com/mmjmanager/';
    }
    var reqUrl = _domain + 'draw/getDrawInfo.action?activeDrawId=' + params.luckyId;
    var curPath = 'buyer/egghit.html';
    request.get(reqUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (JSON.parse(body).infocode == 0) {
                res.render(curPath, {
                    params: obj,
                    result: JSON.parse(body).info
                });
            } else {
                res.render(curPath, {result: {list_Enty: [], activeDrawName: '砸金蛋', signImgUrl: ""}});
            }
        } else {
            res.render(curPath, {result: {list_Enty: [], activeDrawName: '砸金蛋', signImgUrl: ""}});
        }
    });

});

//频道页分发路由
router.get('/buyer/channel/*.html', function (req, res, next) {
    var maId = req.query.maId + ""; //如果连接活动Id则使用该Id  否则在配置读取
    var curPath = req.originalUrl.split("?")[0].replace("/", "");
    var modelActiveId = channel_ids;
    if (global.__pagesArr.indexOf(path.resolve(__dirname, '../views/',curPath)) !== -1 && maId) {
        var _domain = 'http://mmkyf.maimaicn.com/mmjmanager/';
        if (global.__isOnline) {
            _domain = 'http://api.maimaicn.com/mmjmanager/';
        }
        var reqUrl = _domain + 'modelActive/getActiveModuleInfo.action?modelActiveId=' + maId;
        request.get(reqUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (JSON.parse(body).infocode == 0) {
                    var data = JSON.parse(body).info;
                    //搜索+轮播 = topMap, 滚动图片 = rollImgMap, 滚动商品 = rollItemMap, 广告 = adMap, 可排序商品 = itemListMap, 推荐商品 = recomMap
                    return res.render(curPath, {
                        modelActiveId: maId,
                        title: modelActiveId[maId],
                        topMap: data.topMap,
                        rollImgMap: data.rollImgMap.rollImgMapList,
                        rollItemMap: data.rollItemMap.rollItemsList,
                        adMap: data.adMap.adMapList,
                        itemListMap: data.itemListMap,
                        recomMap: data.recomMap.recomList
                    });
                } else {
                    return res.render(curPath, {result: {}});
                }
            } else {
                return res.render(curPath, {result: {}});
            }
        });
    } else {
        next();
    }
});
//信用卡详情页
router.get('/buyer/bank/credit_detail.html', function (req, res, next) {
    var params = req.query;
    var _domain = 'http://mmkyf.maimaicn.com/mmjmanager/';
    var obj = JSON.stringify(params);
    if (global.__isOnline) {
        _domain = 'http://api.maimaicn.com/mmjmanager/';
    }
    var reqUrl = _domain + '/cardType/getTypeInfo.action?creditCardTypeId=' + params.creditCardTypeId;
    var curPath = 'buyer/bank/credit_detail.html';
    request.get(reqUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (JSON.parse(body).infocode == 0) {
                res.render(curPath, {
                    params:obj,
                    data: JSON.parse(body).info
                });
            } else {
                res.render(curPath, {data: {list_cardTypeImg: [], creditCardName: '信用卡申请', linkUrl: "",remark:"",detailImgUrl:"",imgUrl:""}});
            }
        } else {
            res.render(curPath, {data: {list_cardTypeImg: [], creditCardName: '信用卡申请', linkUrl: "",remark:"",detailImgUrl:"",imgUrl:""}});
        }
    });

});

//自动路由  在指定路由顺序之下
router.get('*', function (req, res, next) {
    var _reqUrl = req.path.substring(1);
    var viewsFolder = path.resolve(__dirname, '../views/',_reqUrl);
    if (global.__pagesArr.indexOf(viewsFolder) !== -1) {//判断请求地址是否存在
        res.render(_reqUrl, {title: '买买商城'});
    } else {
        next();//如果视图目录无匹配视图，向下传递继续处理
    }
});

module.exports = router;