import { switchRoute } from './shared/utilities';
import userStore from './store/user';

const redirectHomeWhenLoggedIn = () => {
  if (userStore.getState().isLoggedIn) {
    switchRoute('home');
  }
  return;
}

const redirectHomeWhenNotLoggedIn = () => {
  if (!userStore.getState().isLoggedIn) {
    switchRoute('home');
  }
  return;
}

export default [
  { path: '/', component: 'ani-home' },
  { path: '/home', component: 'ani-home' },
  { path: '/quote/:id', component: 'ani-quote-view' },
  { path: '/add', component: 'ani-add', action: redirectHomeWhenNotLoggedIn },
  { path: '/profile', component: 'ani-profile', action: redirectHomeWhenNotLoggedIn },
  { path: '/login', component: 'ani-login', action: redirectHomeWhenLoggedIn },
  { path: '/mine', component: 'ani-mine', action: redirectHomeWhenNotLoggedIn },
];
