function loadComponent(componentName) {
    return () => `./components/${componentName}.vue`;
}

// 注册路由的函数
function registerRoutes(routes) {
    // 用于保存所有路由配置
    const registeredRoutes = [];

    routes.forEach(route => {
        const routeConfig = {
            path: route.path,
            component: loadComponent(route.component),
            children: route.children ? registerRoutes(route.children) : []
        };
        registeredRoutes.push(routeConfig);
    });

    return registeredRoutes;
}


let routes = [
    {
        "path": "/dashboard",
        "component": "Dashboard",
        "children": [
            {
                "path": "stats",
                "component": "DashboardStats"
            },
            {
                "path": "reports",
                "component": "DashboardReports",
                "children": [
                    {
                        "path": "daily",
                        "component": "DailyReports"
                    },
                    {
                        "path": "monthly",
                        "component": "MonthlyReports"
                    }
                ]
            }
        ]
    },
    {
        "path": "/profile",
        "component": "UserProfile"
    }
]

const res = registerRoutes(routes);
export {res};