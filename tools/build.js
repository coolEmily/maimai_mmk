({
    //项目根目录
    appDir: '../public/js',
    //引用公用配置文件
    //mainConfigFile: '../public/js/common.js',
    //js目录，相对于appDir
    baseUrl:'.',
    //输出目录
    dir: '../online_public/js',
    //js对应路径 省去.js
    paths: {
        'jquery': 'lib/jquery',
        'lib'   : 'lib/lib',
        'zepto' : 'lib/zepto',
        'swiper': 'lib/swiper.min',
        'swiper.min': 'lib/swiper.min',
        'visitor-logs' : 'lib/visitor-logs',
        'animate' : 'lib/animate',
        'bootstrap' : 'lib/bootstrap',
        'bootstrap-datetimepicker' : 'lib/bootstrap-datetimepicker',
        'bootstrap-datetimepicker-zh-CN' : 'lib/bootstrap-datetimepicker-zh-CN',
        'Chart.min' : 'lib/Chart.min',
        'cropit' : 'lib/cropit',
        'dateSelect' : 'lib/dateSelect',
        'guesslike' : 'lib/guesslike',
        'hhSwipe' : 'lib/hhSwipe',
        'log' : 'lib/log',
        'lrzallbundle' : 'lib/lrzallbundle',
        'mobiscroll' : 'lib/mobiscroll',
        'phone_code' : 'lib/phone_code',
        'uploadImg' : 'lib/uploadImg',
        'uploadImg1' : 'lib/uploadImg1',
        'wapshare' : 'lib/wapshare',
        'wxReg' : 'lib/wxReg',
        'wxshare' : 'lib/wxshare',
        'slideMethod' : 'lib/slideMethod',
        'goodsListModal' : 'lib/goodsListModal',
        'rememberThePosition' : 'lib/rememberThePosition',
        'newShare' : 'lib/newShare',
        'Sortable' : 'lib/Sortable',
        'lazyLoad' : 'lib/lazyLoad',
        'shake' : 'lib/shake'
    },
    //打包文件
    //买家中心
    modules: [
        { name:'buy/addredit',
            exclude: ['jquery','zepto']
        },
        { name:'buy/cainixihuan',
            exclude: ['jquery','zepto']
        },
        { name:'buy/collect',
            exclude: ['jquery','zepto']
        },
        { name:'buy/complaintadd',
            exclude: ['jquery','zepto']
        },
        { name:'buy/complaintlist',
            exclude: ['jquery','zepto']
        },
        { name:'buy/complaintshow',
            exclude: ['jquery','zepto']
        },
        { name:'buy/cuxiao',
            exclude: ['jquery','zepto']
        },
        { name:'buy/cuxiaoxq',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dakaguan',
            exclude: ['jquery','zepto']
        },
        { name:'buy/detail',
            exclude: ['jquery','zepto']
        },
        { name:'buy/detail_kun',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdan',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdanqr',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdanqr_n',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdanqr_new',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdanxq',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdanzhifu',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdanzhifucg',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dingdanzhifusb',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dizhi',
            exclude: ['jquery','zepto']
        },
        { name:'buy/dlzc',
            exclude: ['jquery','zepto']
        },
        { name:'buy/fenlei',
            exclude: ['jquery','zepto']
        },
        { name:'buy/gouwuche',
            exclude: ['jquery','zepto']
        },
        { name:'buy/huiyuanzx',
            exclude: ['jquery','zepto']
        },
        { name:'buy/index',
            exclude: ['jquery','zepto']
        },
        { name:'buy/liebiao',
            exclude: ['jquery','zepto']
        },
        { name:'buy/lingyuangou',
            exclude: ['jquery','zepto']
        },
        { name:'buy/lingyuangouzq',
            exclude: ['jquery','zepto']
        },
        { name:'buy/maihaohuo',
            exclude: ['jquery','zepto']
        },
        { name:'buy/remai',
            exclude: ['jquery','zepto']
        },
        { name:'buy/shangou',
            exclude: ['jquery','zepto']
        },
        { name:'buy/shangpinquan',
            exclude: ['jquery','zepto']
        },
        { name:'buy/tuikuan',
            exclude: ['jquery','zepto']
        },
        { name:'buy/xinkekaidan',
            exclude: ['jquery','zepto']
        },
        { name:'buy/xinpin',
            exclude: ['jquery','zepto']
        },
        { name:'buy/youhui',
            exclude: ['jquery','zepto']
        },
        { name:'buy/spqliebiao',
            exclude: ['jquery','zepto']
        },
        { name:'buy/egghit',
            exclude: ['jquery','zepto']
        },
        { name:'buy/red_packer',
            exclude: ['jquery','zepto']
        },
        { name:'buy/zhanghuyue',
            exclude: ['jquery','zepto']
        },
        { name:'buy/yuemingxi',
            exclude: ['jquery','zepto']
        },
        { name:'buy/channel/channel',
            exclude: ['jquery','zepto']
        },
        { name:'buy/gonglve',
            exclude: ['jquery','zepto']
        },
        { name:'buy/gonggao',
            exclude: ['jquery','zepto']
        },
        { name:'buy/gonggao_detail',
            exclude: ['jquery','zepto']
        },
        { name:'buy/shangounew',
            exclude: ['jquery','zepto']
        },
        { name:'buy/youhuicx',
            exclude: ['jquery','zepto']
        },
        { name:'buy/zhanghugl',
            exclude: ['jquery','zepto']
        },
        { name:'buy/helpcenter',
            exclude: ['jquery','zepto']
        },
        { name:'buy/flashshop',
            exclude: ['jquery','zepto']
        },
        { name:'buy/goodslist',
            exclude: ['jquery','zepto']
        },
        { name:'buy/qianmian',
            exclude: ['jquery','zepto']
        },
        { name:'buy/brand',
            exclude: ['jquery','zepto']
        },
        { name:'buy/search',
            exclude: ['jquery','zepto']
        },
        { name:'buy/activities/003',
            exclude: ['jquery','zepto']
        },
        { name:'buy/activities/004',
            exclude: ['jquery','zepto']
        },
        { name:'buy/activities/014',
            exclude: ['jquery','zepto']
        },
        { name:'buy/activities/030',
            exclude: ['jquery','zepto']
        },
        { name:'buy/xyyh',
            exclude: ['jquery','zepto']
        },
        { name:'buy/xyyhf',
            exclude: ['jquery','zepto']
        },
        { name:'buy/compile',
            exclude: ['jquery','zepto']
        },
        { name:'buy/wxshake'
        },
        { name:'buy/wxshake_main'
        },
        { name:'buy/login',
            exclude: ['jquery','zepto']
        },
        { name:'buy/register',
            exclude: ['jquery','zepto']
        },
        //卖家中心
        { name:'admin_shouquan',
            exclude: ['jquery','zepto']
        },
        { name:'bangding',
            exclude: ['jquery','zepto']
        },
        { name:'chenggong',
            exclude: ['jquery','zepto']
        },
        { name:'dakaguan',
            exclude: ['jquery','zepto']
        },
        { name:'dakashangpinmtg',
            exclude: ['jquery','zepto']
        },
        { name:'denglu',
            exclude: ['jquery','zepto']
        },
        { name:'duanxinxq',
            exclude: ['jquery','zepto']
        },
        { name:'fahuo',
            exclude: ['jquery','zepto']
        },
        { name:'fahuoxq',
            exclude: ['jquery','zepto']
        },
        { name:'fangke',
            exclude: ['jquery','zepto']
        },
        { name:'fanyong',
            exclude: ['jquery','zepto']
        },
        { name:'fanyongdd',
            exclude: ['jquery','zepto']
        },
        { name:'fanyongxq',
            exclude: ['jquery','zepto']
        },
        { name:'flrenzheng',
            exclude: ['jquery','zepto']
        },
        { name:'fxdianpu',
            exclude: ['jquery','zepto']
        },
        { name:'fxduanxin',
            exclude: ['jquery','zepto']
        },
        { name:'fxhuodong',
            exclude: ['jquery','zepto']
        },
        { name:'fxshangpin',
            exclude: ['jquery','zepto']
        },
        { name:'fxzixun',
            exclude: ['jquery','zepto']
        },
        { name:'grant',
            exclude: ['jquery','zepto']
        },
        { name:'h5',
            exclude: ['jquery','zepto']
        },
        { name:'hechengtu',
            exclude: ['jquery','zepto']
        },
        { name:'hongbao',
            exclude: ['jquery','zepto']
        },
        { name:'huokuanmx',
            exclude: ['jquery','zepto']
        },
        { name:'kehu',
            exclude: ['jquery','zepto']
        },
        { name:'kunbang',
            exclude: ['jquery','zepto']
        },
        { name:'kunbangtj',
            exclude: ['jquery','zepto']
        },
        { name:'maizeng',
            exclude: ['jquery','zepto']
        },
        { name:'maizengtj',
            exclude: ['jquery','zepto']
        },
        { name:'manjian',
            exclude: ['jquery','zepto']
        },
        { name:'manjiantj',
            exclude: ['jquery','zepto']
        },
        { name:'mjzhongxin',
            exclude: ['jquery','zepto']
        },
        { name:'money_shezhi',
            exclude: ['jquery','zepto']
        },
        { name:'money_shouye',
            exclude: ['jquery','zepto']
        },
        { name:'money_tixian',
            exclude: ['jquery','zepto']
        },
        { name:'pingtaimanjiantjsp',
            exclude: ['jquery','zepto']
        },
        { name:'shangou',
            exclude: ['jquery','zepto']
        },
        { name:'shangoutj',
            exclude: ['jquery','zepto']
        },
        { name:'shangouwtg',
            exclude: ['jquery','zepto']
        },
        { name:'shangouzt',
            exclude: ['jquery','zepto']
        },
        { name:'shangpin',
            exclude: ['jquery','zepto']
        },
        { name:'shengji',
            exclude: ['jquery','zepto']
        },
        { name:'shenqing',
            exclude: ['jquery','zepto']
        },
        { name:'shop_set',
            exclude: ['jquery','zepto']
        },
        { name:'shouquanzt',
            exclude: ['jquery','zepto']
        },
        { name:'stdrenzheng',
            exclude: ['jquery','zepto']
        },
        { name:'tianjiadakasp',
            exclude: ['jquery','zepto']
        },
        { name:'tianjiasp',
            exclude: ['jquery','zepto']
        },
        { name:'tianjiaspk',
            exclude: ['jquery','zepto']
        },
        { name:'tousu',
            exclude: ['jquery','zepto']
        },
        { name:'tousucl',
            exclude: ['jquery','zepto']
        },
        { name:'tousuxq',
            exclude: ['jquery','zepto']
        },
        { name:'tuiguang',
            exclude: ['jquery','zepto']
        },
        { name:'tuihuo',
            exclude: ['jquery','zepto']
        },
        { name:'tuihuogl',
            exclude: ['jquery','zepto']
        },
        { name:'tuihuojd',
            exclude: ['jquery','zepto']
        },
        { name:'tuihuojj',
            exclude: ['jquery','zepto']
        },
        { name:'tuijian',
            exclude: ['jquery','zepto']
        },
        { name:'xiaoxi',
            exclude: ['jquery','zepto']
        },
        { name:'xinmima',
            exclude: ['jquery','zepto']
        },
        { name:'xiugai',
            exclude: ['jquery','zepto']
        },
        { name:'xuanzhe',
            exclude: ['jquery','zepto']
        },
        { name:'yaoqing',
            exclude: ['jquery','zepto']
        },
        { name:'yqmaika',
            exclude: ['jquery','zepto']
        },
        { name:'yunfei',
            exclude: ['jquery','zepto']
        },
        { name:'yunfeimb',
            exclude: ['jquery','zepto']
        },
        { name:'zhaohui',
            exclude: ['jquery','zepto']
        },
        { name:'ziliao',
            exclude: ['jquery','zepto']
        },
        { name:'ziyingdd',
            exclude: ['jquery','zepto']
        },
        { name:'ziyingxq',
            exclude: ['jquery','zepto']
        },
        { name:'findpwd',
            exclude: ['jquery','zepto']
        },
        { name:'tpstart',
            exclude: ['jquery','zepto']
        },
        { name:'toupiao',
            exclude: ['jquery','zepto']
        },
        { name:'tp_result',
            exclude: ['jquery','zepto']
        },
        { name:'millionRedpocket',
            exclude: ['jquery','zepto']
        }
    ],
    //排除指定文件
    fileExclusionRegExp: /^(r|build)\.js$/,
    //css压缩方式
    //optimizeCss: 'standard',
    //移除打包后的源文件
    //removeCombined: true
    //配置未支持amd规范的模块
    //shim: {
    //    'lib': {
    //        deps: ['jquery.js'],
    //        exports: '_lib'
    //    }
    //},
})