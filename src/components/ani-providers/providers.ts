import { LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-providers')
export class AniProviders extends LitElement {
  @state()
  provider: string = location.pathname.split('/')[2];

  @state()
  token: string = new URLSearchParams(window.location.search).get("id_token") || '';

  @state()
  userState: IUserStore = userStore.getInitialState();

  firstUpdated(){
    !!this.token && this.login();
  }

  render() {
    return null;
  }

  async login() {
    const response = await fetch(`${API_URL}/api/auth/${this.provider}/callback?access_token=${this.token}`)
    const userdata = await response.json();

    if (userdata.jwt) {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userdata.jwt}`
        }
      };
      const userProfile = await fetch(`${API_URL}/api/users/me?populate=*`, options).then((response) => response.json());
      this.userState.updateProfile(userProfile);
      this.userState.login(userdata);
      window.location.href = '/';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-providers': AniProviders
  }
}
