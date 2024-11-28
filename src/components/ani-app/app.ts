import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import alertStore, { IAlertStore } from '../../store/alert';
import appStore, { IAppStore } from '../../store/app';
import userStore, { IUserStore } from '../../store/user';
import { setGeoLocation, switchRoute } from '../../shared/utilities';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import routes from '../../routes';
import KemetAlert from 'kemet-ui/dist/components/kemet-alert/kemet-alert';

import '../ani-top-nav/top-nav';
import '../ani-home/home';
import '../ani-profile/profile';
import '../ani-login/login';
import '../ani-mine/mine';


export enum ENUM_ALERT_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
  STANDARD = 'standard',
  WARNING = 'warning',
  PRIMARY = 'primary',
}

@customElement('ani-app')
export class AniApp extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  @query('main')
  main!: HTMLElement;

  @query('kemet-alert')
  kemetAlert!: KemetAlert;

  constructor() {
    super();

    alertStore.subscribe((state) => {
      this.alertState = state;
    });

    appStore.subscribe((state) => {
      this.appState = state;
    });

    userStore.subscribe((state) => {
      this.userState = state;
    });

    setGeoLocation();
  }

  firstUpdated() {
    const router = new Router(this.main);
    router.setRoutes(routes);
    this.handlePolarity();
  }

  render() {
    const { status, message, opened, icon } = this.alertState;

    return html`
      <kemet-alert
        closable
        overlay=""
        status="${status as ENUM_ALERT_STATUS}"
        ?opened=${opened}
        @kemet-alert-closed=${() => alertStore.setState({ opened: false })}
      >
        <div>
          <kemet-icon icon="${icon}" size="24"></kemet-icon>&nbsp;
          <div>${message}</div>
        </div>
      </kemet-alert>
      <kemet-drawer overlay side="left" effect="push" ?opened=${this.appState.isDrawerOpened}>
        <aside slot="navigation">
          ${this.userState.isLoggedIn ? html`
            <figure>
              <button @click=${() => switchRoute('profile', 'Ani | Profile')}>
                <img src="https://i.ytimg.com/vi/N3YE2gH3QC0/mqdefault.jpg" alt="Profile picture" style="max-width:100%; border-radius:50%; object-fit:cover;" />
              </button>
              <figcaption>Hello [user].</figcaption>
              <p><button @click=${() => this.userState.logout()}>Log Out</button>.</p>
            </figure>
            [nav here]
          ` : html`
            <figure>
              <kemet-button variant="rounded" @click=${() => switchRoute('login', 'Login')}>Login</kemet-button>
            </figure>
          `}
        </aside>
        <section slot="content">
          <ani-top-nav></ani-top-nav>
          <main></main>
        </section>
      </kemet-drawer>
    `
  }

  switchRoute(route: string, title: string) {
    document.title = title;
    Router.go(`/${route}`);
  }

  handlePolarity() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    isDark && document.documentElement.setAttribute("polarity", "dark");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-app': AniApp
  }
}
