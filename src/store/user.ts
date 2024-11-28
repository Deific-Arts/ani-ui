import { createStore } from 'zustand/vanilla';
import Cookies from 'js-cookie';

export interface IUserStore {
  user: any;
  profile: any;
  updateProfile: (profile: any) => void;
  isLoggedIn: boolean;
  login: (loginData: any) => void;
  logout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const getProfile = async () => {
  const user = Cookies.get('ani-user') ? JSON.parse(Cookies.get('ani-user') || '') : undefined;

  if (!user) {
    return;
  }

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.jwt}`
    }
  };

  const userProfile = await fetch(`${API_URL}/api/users/me`, options)
    .then((response) => response.json());

  if (userProfile) {
    return { profile: userProfile };
  }

  return;
}

const profileResponse = await getProfile();

const store = createStore<IUserStore>(set => ({
  user: Cookies.get('ani-user') ? JSON.parse(Cookies.get('ani-user') || '') : {},
  profile: profileResponse?.profile,
  updateProfile: (profile: any) => set(() => { return { profile } }),
  isLoggedIn: !!Cookies.get('ani-user'),
  login: (loginData) => set(() => {
    Cookies.set('ani-user', JSON.stringify(loginData), { expires: 7 });
    return { isLoggedIn: true, user: loginData };
  }),
  logout: () => set(() => {
    Cookies.remove('ani-user');
    return { isLoggedIn: false };
  })
}));

export default store;
