import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { svgLogo } from '../../shared/svgs';
import userStore, { IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { switchRoute } from '../../shared/utilities';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-top-nav')
export default class AniTopNav extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  render() {
    return html`
      <nav>
        <button aria-label="Menu">
          <kemet-icon icon="list" size="32"></kemet-icon>
        </button>
      </nav>
      <button aria-label="Home">
        <a href="/">${svgLogo}</a>
      </button>
      <div>${this.makeProfileImage()}</div>
    `
  }

  makeProfileImage() {
    const profileImage = this.userState.profile?.avatar?.url;

    if (this.userState.isLoggedIn) {
      return html`<a href="/profile"><img src="${API_URL}/${profileImage}" alt="${this.userState.profile.username}" /></a>`
    }

    return html`
      <button @click=${() => switchRoute('login', 'aniCards | Login')} aria-label="Login">
        <kemet-icon icon="door-open" size="24"></kemet-icon>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-top-nav': AniTopNav;
  }
}
