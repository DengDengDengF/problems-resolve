export const dataList={
    "code": 0,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 5,
                "name": "Root",
                "path": "\/",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "首页",
                    "icon": "home-2-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 0,
                "children": [
                    {
                        "id": 6,
                        "name": "Index",
                        "path": "index",
                        "component": "@views\/index",
                        "redirect": "",
                        "parent": 5,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "概览",
                            "icon": "home-2-line",
                            "hidden": false,
                            "no_closable": true,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 0
                    }
                ]
            },
            {
                "id": 41,
                "name": "Marketing",
                "path": "\/marketing",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "营销",
                    "icon": "line-chart-fill",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 20,
                "children": [
                    {
                        "id": 42,
                        "name": "Ads",
                        "path": "ads",
                        "component": "@views\/marketing\/ads",
                        "redirect": "",
                        "parent": 41,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "广告投放",
                            "icon": "surround-sound-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 85,
                        "name": "Comments",
                        "path": "comments",
                        "component": "@views\/marketing\/comments",
                        "redirect": "",
                        "parent": 41,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "评论管理",
                            "icon": "message-3-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 15
                    },
                    {
                        "id": 43,
                        "name": "Batch",
                        "path": "batch",
                        "component": "@views\/marketing\/batch",
                        "redirect": "",
                        "parent": 41,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "批量创建",
                            "icon": "checkbox-multiple-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20
                    },
                    {
                        "id": 53,
                        "name": "Ad",
                        "path": "ad\/:id",
                        "component": "@views\/marketing\/ads\/detail",
                        "redirect": "",
                        "parent": 41,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "账户详情",
                            "icon": "asterisk",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false,
                            "dynamicNewTab": true
                        },
                        "sort": 30
                    },
                    {
                        "id": 58,
                        "name": "BatchAdd",
                        "path": "batch\/detail\/:id",
                        "component": "@views\/marketing\/batch\/detail",
                        "redirect": "",
                        "parent": 41,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "新增批量任务",
                            "icon": "add-line",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false,
                            "dynamicNewTab": true
                        },
                        "sort": 40
                    }
                ]
            },
            {
                "id": 44,
                "name": "Asset",
                "path": "\/asset",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "资产",
                    "icon": "creative-commons-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 30,
                "children": [
                    {
                        "id": 50,
                        "name": "ClickId",
                        "path": "cid",
                        "component": "@views\/asset\/cid",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "CID链接库",
                            "icon": "links-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 1
                    },
                    {
                        "id": 63,
                        "name": "Landing",
                        "path": "landing",
                        "component": "@views\/asset\/landing",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "落地页",
                            "icon": "pages-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 5
                    },
                    {
                        "id": 64,
                        "name": "LandingDetail",
                        "path": "landing\/detail\/:id",
                        "component": "@views\/asset\/landing\/detail",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "落地页详情",
                            "icon": "pages-line",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false,
                            "dynamicNewTab": true
                        },
                        "sort": 5
                    },
                    {
                        "id": 78,
                        "name": "HealthPage",
                        "path": "healthPage",
                        "component": "@views\/asset\/health",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "大健康自研页",
                            "icon": "medicine-bottle-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 6
                    },
                    {
                        "id": 79,
                        "name": "HealthDetail",
                        "path": "health\/:id\/:token",
                        "component": "@views\/asset\/health\/detail",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "自研页搭建",
                            "icon": "",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false,
                            "dynamicNewTab": true
                        },
                        "sort": 7
                    },
                    {
                        "id": 45,
                        "name": "AssetsVideo",
                        "path": "video",
                        "component": "@views\/asset\/video",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "视频库",
                            "icon": "movie-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 46,
                        "name": "AssetsImage",
                        "path": "image",
                        "component": "@views\/asset\/image",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "图片库",
                            "icon": "image-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20
                    },
                    {
                        "id": 47,
                        "name": "AssetsTitle",
                        "path": "title",
                        "component": "@views\/asset\/title",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "标题库",
                            "icon": "file-text-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30
                    },
                    {
                        "id": 48,
                        "name": "Audience",
                        "path": "audience",
                        "component": "@views\/asset\/audience",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "定向包",
                            "icon": "group-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 50
                    },
                    {
                        "id": 57,
                        "name": "AudienceDetail",
                        "path": "audience\/detail\/:id",
                        "component": "@views\/asset\/audience\/detail",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "定向包详情",
                            "icon": "group-line",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false,
                            "dynamicNewTab": true
                        },
                        "sort": 50
                    },
                    {
                        "id": 49,
                        "name": "Application",
                        "path": "application",
                        "component": "@views\/asset\/app",
                        "redirect": "",
                        "parent": 44,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "应用包",
                            "icon": "apps-2-line",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": true
                        },
                        "sort": 60
                    }
                ]
            },
            {
                "id": 22,
                "name": "Store",
                "path": "\/store",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "电商",
                    "icon": "store-2-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 140,
                "children": [
                    {
                        "id": 30,
                        "name": "Ali",
                        "path": "\/ali",
                        "component": "Layout",
                        "redirect": "",
                        "parent": 22,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "阿里系",
                            "icon": "taobao-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10,
                        "children": [
                            {
                                "id": 23,
                                "name": "Taobao",
                                "path": "taobao",
                                "component": "@views\/store\/taobao\/indexUser",
                                "redirect": "",
                                "parent": 30,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "淘系店铺",
                                    "icon": "taobao-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 10
                            },
                            {
                                "id": 31,
                                "name": "TaobaoOrders",
                                "path": "taobaoOrders",
                                "component": "@views\/order\/taobao",
                                "redirect": "",
                                "parent": 30,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "淘系店铺订单",
                                    "icon": "shopping-bag-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 20
                            },
                            {
                                "id": 24,
                                "name": "AlimamaSys",
                                "path": "alimamaSys",
                                "component": "@views\/store\/alimama",
                                "redirect": "",
                                "parent": 30,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "系统淘宝联盟",
                                    "icon": "c_alimama",
                                    "hidden": true,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": true
                                },
                                "sort": 30
                            },
                            {
                                "id": 25,
                                "name": "Alimama",
                                "path": "alimama",
                                "component": "@views\/store\/alimama",
                                "redirect": "",
                                "parent": 30,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "淘宝联盟",
                                    "icon": "c_alimama",
                                    "hidden": true,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": true
                                },
                                "sort": 40
                            },
                            {
                                "id": 32,
                                "name": "AlimamaOrders",
                                "path": "alimamaOrders",
                                "component": "@views\/order\/alimama",
                                "redirect": "",
                                "parent": 30,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "联盟订单",
                                    "icon": "shopping-bag-line",
                                    "hidden": true,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": true
                                },
                                "sort": 50
                            }
                        ]
                    },
                    {
                        "id": 33,
                        "name": "Pdd",
                        "path": "\/pdd",
                        "component": "Layout",
                        "redirect": "",
                        "parent": 22,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "拼多多",
                            "icon": "c_pinduoduo",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20,
                        "children": [
                            {
                                "id": 26,
                                "name": "PinduoduoSys",
                                "path": "pinduoduoSys",
                                "component": "@views\/store\/pinduoduo\/indexSys",
                                "redirect": "",
                                "parent": 33,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "系统拼多多联盟",
                                    "icon": "c_pinduoduo",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 10
                            },
                            {
                                "id": 27,
                                "name": "Pinduoduo",
                                "path": "pinduoduo",
                                "component": "@views\/store\/pinduoduo\/indexUser",
                                "redirect": "",
                                "parent": 33,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "拼多多联盟",
                                    "icon": "c_pinduoduo",
                                    "hidden": true,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 20
                            },
                            {
                                "id": 34,
                                "name": "PddOrders",
                                "path": "pddOrders",
                                "component": "@views\/order\/pinduoduo",
                                "redirect": "",
                                "parent": 33,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "拼多多订单明细",
                                    "icon": "shopping-bag-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 30
                            },
                            {
                                "id": 93,
                                "name": "PinduoduoShop",
                                "path": "pddShop",
                                "component": "@views\/store\/pinduoduo\/indexShop",
                                "redirect": "",
                                "parent": 33,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "拼多多店铺",
                                    "icon": "c_pinduoduo",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 35
                            }
                        ]
                    },
                    {
                        "id": 35,
                        "name": "Jd",
                        "path": "\/jd",
                        "component": "Layout",
                        "redirect": "",
                        "parent": 22,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "京东",
                            "icon": "c_jingdong",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30,
                        "children": [
                            {
                                "id": 28,
                                "name": "JingdongSys",
                                "path": "jingdongSys",
                                "component": "@views\/store\/jingdong\/indexSys",
                                "redirect": "",
                                "parent": 35,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "系统京东联盟",
                                    "icon": "c_jingdong",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 10
                            },
                            {
                                "id": 29,
                                "name": "Jingdong",
                                "path": "jingdong",
                                "component": "@views\/store\/jingdong\/indexUser",
                                "redirect": "",
                                "parent": 35,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "京东联盟",
                                    "icon": "c_jingdong",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 20
                            },
                            {
                                "id": 36,
                                "name": "JdOrders",
                                "path": "jdOrders",
                                "component": "@views\/order\/jingdong",
                                "redirect": "",
                                "parent": 35,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "京东订单明细",
                                    "icon": "shopping-bag-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 30
                            }
                        ]
                    },
                    {
                        "id": 60,
                        "name": "Wechat",
                        "path": "\/wechat",
                        "component": "Layout",
                        "redirect": "",
                        "parent": 22,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "微信",
                            "icon": "wechat-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 40,
                        "children": [
                            {
                                "id": 61,
                                "name": "WechatMall",
                                "path": "wechatMall",
                                "component": "@views\/store\/wechat\/indexUser",
                                "redirect": "",
                                "parent": 60,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "微信商城",
                                    "icon": "wechat-2-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 10
                            },
                            {
                                "id": 62,
                                "name": "WcOrders",
                                "path": "wcOrders",
                                "component": "@views\/order\/wechat",
                                "redirect": "",
                                "parent": 60,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "微信商城订单",
                                    "icon": "wechat-pay-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 20
                            }
                        ]
                    },
                    {
                        "id": 89,
                        "name": "MT",
                        "path": "\/mt",
                        "component": "Layout",
                        "redirect": "",
                        "parent": 22,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "美团",
                            "icon": "takeaway-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 41,
                        "children": [
                            {
                                "id": 90,
                                "name": "MeituanShop",
                                "path": "meituanShop",
                                "component": "@views\/store\/meituan\/shop",
                                "redirect": "",
                                "parent": 89,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "美团店铺",
                                    "icon": "takeaway-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 1
                            },
                            {
                                "id": 91,
                                "name": "Meituan",
                                "path": "meituan",
                                "component": "@views\/store\/meituan\/indexUser",
                                "redirect": "",
                                "parent": 89,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "系统美团联盟",
                                    "icon": "takeaway-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 2
                            },
                            {
                                "id": 92,
                                "name": "MeituanOrders",
                                "path": "mtOrders",
                                "component": "@views\/order\/meituan",
                                "redirect": "",
                                "parent": 89,
                                "interface": [],
                                "method": [],
                                "meta": {
                                    "title": "美团订单",
                                    "icon": "shopping-bag-line",
                                    "hidden": false,
                                    "no_closable": false,
                                    "no_keep_alive": false,
                                    "badge": "",
                                    "dot": false
                                },
                                "sort": 3
                            }
                        ]
                    }
                ]
            },
            {
                "id": 65,
                "name": "Fans",
                "path": "\/fans",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "私域",
                    "icon": "wechat-2-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": true
                },
                "sort": 150,
                "children": [
                    {
                        "id": 71,
                        "name": "Promo",
                        "path": "promo",
                        "component": "@views\/fans\/promo",
                        "redirect": "",
                        "parent": 65,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "推广链接管理",
                            "icon": "links-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 5
                    },
                    {
                        "id": 69,
                        "name": "WxFans",
                        "path": "wxFans",
                        "component": "@views\/fans\/wxFans",
                        "redirect": "",
                        "parent": 65,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "微信粉丝列表",
                            "icon": "user-follow-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 67,
                        "name": "WxFansService",
                        "path": "wxFansService",
                        "component": "@views\/fans\/wxFansService",
                        "redirect": "",
                        "parent": 65,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "加粉客服号",
                            "icon": "service-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20
                    },
                    {
                        "id": 66,
                        "name": "WxBizService",
                        "path": "wxBizService",
                        "component": "@views\/fans\/wxBizService",
                        "redirect": "",
                        "parent": 65,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "企微客服应用",
                            "icon": "customer-service-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30
                    },
                    {
                        "id": 68,
                        "name": "Replies",
                        "path": "replies",
                        "component": "@views\/fans\/replies",
                        "redirect": "",
                        "parent": 65,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "消息回复模板",
                            "icon": "message-3-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 40
                    }
                ]
            },
            {
                "id": 94,
                "name": "Assistant",
                "path": "\/assistant",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "获客助手",
                    "icon": "wechat-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": true
                },
                "sort": 151,
                "children": [
                    {
                        "id": 95,
                        "name": "WxGrantService",
                        "path": "WxGrantService",
                        "component": "@views\/assistant\/wxGrantService",
                        "redirect": "",
                        "parent": 94,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "企微授权",
                            "icon": "customer-service-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 1
                    },
                    {
                        "id": 96,
                        "name": "WxGrantPromo",
                        "path": "WxGrantPromo",
                        "component": "@views\/assistant\/wxGrantPromo",
                        "redirect": "",
                        "parent": 94,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "链接管理",
                            "icon": "share-forward-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 2
                    },
                    {
                        "id": 97,
                        "name": "WxGrantFans",
                        "path": "WxGrantFans",
                        "component": "@views\/assistant\/wxGrantFans",
                        "redirect": "",
                        "parent": 94,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "好友管理",
                            "icon": "user-voice-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 3
                    }
                ]
            },
            {
                "id": 37,
                "name": "Tool",
                "path": "\/tool",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "工具",
                    "icon": "settings-6-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 160,
                "children": [
                    {
                        "id": 72,
                        "name": "PreAudit",
                        "path": "preAudit",
                        "component": "@views\/tool\/preAudit",
                        "redirect": "",
                        "parent": 37,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "素材预审",
                            "icon": "shield-check-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 5
                    },
                    {
                        "id": 39,
                        "name": "Smart",
                        "path": "smart",
                        "component": "@views\/tool\/smart",
                        "redirect": "",
                        "parent": 37,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "智能监控",
                            "icon": "robot-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 59,
                        "name": "SmartDetail",
                        "path": "smart\/detail\/:id",
                        "component": "@views\/tool\/smart\/detail",
                        "redirect": "",
                        "parent": 37,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "新增监控任务",
                            "icon": "eye-2-line",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false,
                            "dynamicNewTab": true
                        },
                        "sort": 10
                    },
                    {
                        "id": 40,
                        "name": "Comment",
                        "path": "optimize",
                        "component": "@views\/tool\/comment",
                        "redirect": "",
                        "parent": 37,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "优化模板",
                            "icon": "chat-settings-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30
                    },
                    {
                        "id": 55,
                        "name": "CommentTask",
                        "path": "optimizeTask",
                        "component": "@views\/tool\/commentTask",
                        "redirect": "",
                        "parent": 37,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "优化任务列表",
                            "icon": "chat-new-line",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 40
                    },
                    {
                        "id": 87,
                        "name": "OptimizeTaskReport",
                        "path": "optimizeTaskReport",
                        "component": "@views\/tool\/optimizeTaskReport",
                        "redirect": "",
                        "parent": 37,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "优化任务报表",
                            "icon": "file-list-line",
                            "hidden": true,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 45
                    },
                    {
                        "id": 70,
                        "name": "Development",
                        "path": "development",
                        "component": "@views\/tool\/development",
                        "redirect": "",
                        "parent": 37,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "开发工具",
                            "icon": "tools-fill",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 50
                    }
                ]
            },
            {
                "id": 19,
                "name": "Report",
                "path": "\/report",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "报表",
                    "icon": "bar-chart-2-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 180,
                "children": [
                    {
                        "id": 20,
                        "name": "AdsReport",
                        "path": "adsRept",
                        "component": "@views\/report\/ads",
                        "redirect": "",
                        "parent": 19,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "广告报表",
                            "icon": "bubble-chart-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 54,
                        "name": "PerformanceReport",
                        "path": "performanceRept",
                        "component": "@views\/report\/performance",
                        "redirect": "",
                        "parent": 19,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "绩效报表",
                            "icon": "file-chart-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20
                    },
                    {
                        "id": 21,
                        "name": "MaterialReport",
                        "path": "materialRept",
                        "component": "@views\/report\/material",
                        "redirect": "",
                        "parent": 19,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "广告主素材报表",
                            "icon": "bar-chart-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30
                    },
                    {
                        "id": 86,
                        "name": "VideosRept",
                        "path": "videosRept",
                        "component": "@views\/report\/videos",
                        "redirect": "",
                        "parent": 19,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "视频素材报表",
                            "icon": "film-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 40
                    },
                    {
                        "id": 83,
                        "name": "GoodsReport",
                        "path": "goodsRept",
                        "component": "@views\/report\/goods",
                        "redirect": "",
                        "parent": 19,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "商品报表",
                            "icon": "gift-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 50
                    }
                ]
            },
            {
                "id": 73,
                "name": "Idea",
                "path": "\/idea",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "灵感",
                    "icon": "lightbulb-flash-line",
                    "hidden": true,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 190,
                "children": [
                    {
                        "id": 74,
                        "name": "DouyinIndex",
                        "path": "douyinIndex",
                        "component": "@views\/idea\/douyinIndex",
                        "redirect": "",
                        "parent": 73,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "抖音拼多多指数",
                            "icon": "music-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 75,
                        "name": "DouyinTopMaterial",
                        "path": "douyinTopMaterial",
                        "component": "@views\/idea\/douyinTopMaterial",
                        "redirect": "",
                        "parent": 73,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "抖音素材榜单",
                            "icon": "music-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20
                    },
                    {
                        "id": 76,
                        "name": "DouyinTopProduct",
                        "path": "douyinTopProduct",
                        "component": "@views\/idea\/douyinTopProduct",
                        "redirect": "",
                        "parent": 73,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "抖音选品指南",
                            "icon": "music-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30
                    },
                    {
                        "id": 77,
                        "name": "DouyinTopSales",
                        "path": "douyinTopSales",
                        "component": "@views\/idea\/douyinTopSales",
                        "redirect": "",
                        "parent": 73,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "抖音小店榜单",
                            "icon": "music-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 40
                    }
                ]
            },
            {
                "id": 98,
                "name": "Finance",
                "path": "\/finance",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "财务管理",
                    "icon": "money-cny-circle-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 195,
                "children": [
                    {
                        "id": 99,
                        "name": "FinanceAccount",
                        "path": "financeAccount",
                        "component": "@views\/finance\/account",
                        "redirect": "",
                        "parent": 98,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "账号管理",
                            "icon": "user-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 100,
                        "name": "CheckAmount",
                        "path": "checkAmount",
                        "component": "@views\/finance\/check-amount",
                        "redirect": "",
                        "parent": 98,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "对账管理",
                            "icon": "money-cny-circle-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20
                    },
                    {
                        "id": 101,
                        "name": "FinanceWithdraw",
                        "path": "financeWithdraw",
                        "component": "@views\/finance\/withdraw",
                        "redirect": "",
                        "parent": 98,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "提现管理",
                            "icon": "money-cny-box-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30
                    }
                ]
            },
            {
                "id": 7,
                "name": "Setting",
                "path": "\/setting",
                "component": "Layout",
                "redirect": "",
                "parent": 0,
                "interface": [],
                "method": [],
                "meta": {
                    "title": "配置",
                    "icon": "settings-2-line",
                    "hidden": false,
                    "no_closable": false,
                    "no_keep_alive": false,
                    "badge": "",
                    "dot": false
                },
                "sort": 200,
                "children": [
                    {
                        "id": 13,
                        "name": "Personal",
                        "path": "personal",
                        "component": "@views\/setting\/personal",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "个人中心",
                            "icon": "user-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 10
                    },
                    {
                        "id": 14,
                        "name": "Media",
                        "path": "media",
                        "component": "@views\/setting\/media",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "媒体账号",
                            "icon": "drive-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 20
                    },
                    {
                        "id": 18,
                        "name": "Product",
                        "path": "product",
                        "component": "@views\/setting\/product",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "产品管理",
                            "icon": "product-hunt-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 30
                    },
                    {
                        "id": 8,
                        "name": "User",
                        "path": "user",
                        "component": "@views\/setting\/user",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "用户管理",
                            "icon": "user-settings-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 40
                    },
                    {
                        "id": 80,
                        "name": "Group",
                        "path": "group",
                        "component": "@views\/setting\/group",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "小组管理",
                            "icon": "group-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 45
                    },
                    {
                        "id": 17,
                        "name": "Department",
                        "path": "department",
                        "component": "@views\/setting\/department",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "部门管理",
                            "icon": "group-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 50
                    },
                    {
                        "id": 84,
                        "name": "Roles",
                        "path": "roles",
                        "component": "@views\/setting\/roles",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "权限管理",
                            "icon": "admin-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 52
                    },
                    {
                        "id": 16,
                        "name": "Company",
                        "path": "company",
                        "component": "@views\/setting\/company",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "企业管理",
                            "icon": "building-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 60
                    },
                    {
                        "id": 88,
                        "name": "OperationLog",
                        "path": "operationLog",
                        "component": "@views\/setting\/operationLog",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "操作日志",
                            "icon": "file-list-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 61
                    },
                    {
                        "id": 81,
                        "name": "Domain",
                        "path": "domain",
                        "component": "@views\/setting\/domain",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "域名管理",
                            "icon": "global-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": false
                        },
                        "sort": 65
                    },
                    {
                        "id": 82,
                        "name": "Broadcast",
                        "path": "broadcast",
                        "component": "@views\/setting\/broadcast",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "消息推送",
                            "icon": "send-plane-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": true
                        },
                        "sort": 68
                    },
                    {
                        "id": 15,
                        "name": "App",
                        "path": "app",
                        "component": "@views\/setting\/app",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "应用管理",
                            "icon": "apps-2-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": true
                        },
                        "sort": 70
                    },
                    {
                        "id": 12,
                        "name": "Role",
                        "path": "role",
                        "component": "@views\/setting\/role",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "角色管理",
                            "icon": "admin-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": true
                        },
                        "sort": 80
                    },
                    {
                        "id": 51,
                        "name": "Interface",
                        "path": "interface",
                        "component": "@views\/setting\/interface",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "接口管理",
                            "icon": "equalizer-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": true
                        },
                        "sort": 90
                    },
                    {
                        "id": 52,
                        "name": "Column",
                        "path": "column",
                        "component": "@views\/setting\/column",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "指标管理",
                            "icon": "layout-column-line",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": true
                        },
                        "sort": 100
                    },
                    {
                        "id": 9,
                        "name": "Menu",
                        "path": "menu",
                        "component": "@views\/setting\/menu",
                        "redirect": "",
                        "parent": 7,
                        "interface": [],
                        "method": [],
                        "meta": {
                            "title": "菜单管理",
                            "icon": "menu-2-fill",
                            "hidden": false,
                            "no_closable": false,
                            "no_keep_alive": false,
                            "badge": "",
                            "dot": true
                        },
                        "sort": 110
                    }
                ]
            }
        ],
        "total": 93,
        "level": 0
    }
}