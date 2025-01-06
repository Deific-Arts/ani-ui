import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import alertStore, { IAlertStore } from '../../store/alert';
import appStore, { IAppStore } from '../../store/app';
import userStore, { IUserStore } from '../../store/user';
import modalsStore, { IModalsStore } from '../../store/modals';
import { ENUM_ALERT_STATUS } from '../../shared/enums';
import { commentModalTemplate, signInModalTemplate, newQuoteModalTemplate } from './templates';

import styles from './styles';
import sharedStyles from '../../shared/styles';
import routes from '../../routes';
import KemetAlert from 'kemet-ui/dist/components/kemet-alert/kemet-alert';

import '../ani-top-nav/top-nav';
import '../ani-footer-nav/footer-nav';
import '../ani-home/home';
import '../ani-profile/profile';
import '../ani-login/login';
import '../ani-quote-view/quote-view';
import '../ani-user-view/user-view';
import '../ani-search/search';
import '../ani-providers/providers';
import '../ani-legal/legal';

@customElement('ani-app')
export class AniApp extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  @state()
  signModalOpened: boolean = false;

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

    modalsStore.subscribe((state) => {
      this.modalsState = state;
    });
  }

  firstUpdated() {
    const router = new Router(this.main);
    router.setRoutes(routes);
    this.handlePolarity();
  }

  render() {
    const { status, message, opened, icon } = this.alertState;
    const { signInOpened, commentOpened, newQuoteOpened } = this.modalsState;

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
      <section>
        <div class="wrapper">
          <ani-top-nav></ani-top-nav>
          <main></main>
          <ani-footer-nav></ani-footer-nav>
        </div>
      </section>
      <kemet-modal id="modal-sign-in" close-on-click rounded effect="fadein-scaleup" .opened=${signInOpened} @kemet-modal-closed=${() => modalsStore.setState({ signInOpened: false })}>
        ${signInModalTemplate}
      </kemet-modal>
      ${this.userState.isLoggedIn ? html`
        <kemet-modal id="modal-comment" rounded effect="fadein-scaleup" .opened=${commentOpened} @kemet-modal-closed=${() => modalsStore.setState({ commentOpened: false })}>
          ${commentModalTemplate}
        </kemet-modal>
        <kemet-modal id="modal-new-quote" rounded effect="fadein-scaleup" .opened=${newQuoteOpened} @kemet-modal-closed=${() => modalsStore.setState({ newQuoteOpened: false })}>
          ${newQuoteModalTemplate}
        </kemet-modal>
      ` : null}
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
