import Login from './views/other/Login.vue'
import NotFound from './views/other/404.vue'
import Home from './views/other/Home.vue'
import Main from './views/Main.vue'
import UserManagement from './views/user/UserManagement.vue'
import UserAnalysis from './views/user/UserAnalysis.vue'
import User from './views/user/user.vue'
import ArticlePublish from './views/article/ArticlePublish.vue'
import ArticleManagement from './views/article/ArticleManagement.vue'
import ArticleAnalysis from './views/article/ArticleAnalysis.vue'
import CommentManagement from './views/comment/CommentManagement.vue'
import CommentAnalysis from './views/comment/CommentAnalysis.vue'
import ResourceManagement from './views/webResource/ResourceManagement.vue'
import ResourceAnalysis from './views/webResource/ResourceAnalysis.vue'
import AddSource from './views/webResource/AddSource.vue'
import RecommendationManagement from './views/recommendation/RecommendationManagement.vue'
import RecommendationAnalysis from './views/recommendation/RecommendationAnalysis.vue'
import DataAnalysis from './views/dataAnalysis/dataAnalysis.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '用户模块',
        iconCls: 'fa fa-user-circle',//图标样式class
        children: [
            //{ path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/userManagement', component: UserManagement, name: '用户管理' },
            { path: '/userAnalysis', component: UserAnalysis, name: '用户分析', hidden: true },
            //{ path: '/user', component: User, name: '列表' , hidden: true},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '文章模块',
        iconCls: 'fa fa-archive',
        children: [
            // {path: '/articlePublish', component: ArticlePublish, name: '发表文章'},
            { path: '/articleManagement', component: ArticleManagement, name: '文章管理' },
            { path: '/articleAnalysis', component: ArticleAnalysis, name: '文章分析' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '资源模块',
        iconCls: 'fa fa-cloud-upload',
        children: [
            { path: '/addSource', component: AddSource,  name: '新增资源' },
            { path: '/resourceManagement', component: ResourceManagement,  name: '资源管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '评论模块',
        iconCls: 'fa fa-comment',
        children: [
            { path: '/commentManagement', component: CommentManagement,  name: '评论管理' },
            { path: '/commentAnalysis', component: CommentAnalysis,  name: '评论分析' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '文章推荐',
        iconCls: 'fa fa-heart',
        leaf: false,//只有一个节点
        children: [
            { path: '/recommendationManagement', component: RecommendationManagement, name: '推荐管理' },
            { path: '/recommendationAnalysis', component: RecommendationAnalysis, name: '推荐分析' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据统计',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/dataAnalysis', component: DataAnalysis, name: '数据分析' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;