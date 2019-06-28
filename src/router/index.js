import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const LoginPage = () => import('@/page/login');
const MainPage = () => import('@/page/main');
const HomePage = () => import('@/page/home');
const UserListPage = () => import('@/page/userList');
import UserGw from '@/api/user.client.gw';

const routes = [
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/',
    component: MainPage,
    name: '',
    children: [
      {
        path: '',
        component: HomePage,
        meta: []
      },
      {
        path: '/userList',
        component: UserListPage,
        meta: ['用户管理', '用户列表']
      }
    ]
  }
];

const router = new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
});

router.beforeEach(async (to, from, next) => {
  // console.log(`store.state.loginUser: ${JSON.stringify(store.state.loginUser)}, to.path: ${to.path}`);
  if (to.path === '/login') {
    return next();
  }

  if (!store.state.loginUser || !store.state.loginUser.username) {
    const res = await UserGw.checkSession();
    if (res.data.status == 'success') {
      return next();
    }

    return next('/login');
  }

  return next();
});

export default router;
