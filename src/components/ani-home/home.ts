import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import modalsStore, { IModalsStore } from '../../store/modals';
import userStore, { IUserStore } from '../../store/user';
import styles from './styles';

import '../ani-feed/feed';
import AniFeed from '../ani-feed/feed';


@customElement('ani-home')
export default class AniHome extends LitElement {
  static styles = [styles];

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  currentTab: string = 'all';

  constructor() {
    super();

    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  render() {
    return this.userState.isLoggedIn
      ? this.makeLoggedIn()
      : this.makeLoggedOut();
  }

  makeLoggedIn() {
    return html`
      <kemet-tabs divider @kemet-tab-selected=${(event: CustomEvent<any>) => this.handleTabSelected(event)}>
        <kemet-tab slot="tab">All</kemet-tab>
        <kemet-tab slot="tab">Following</kemet-tab>
        <kemet-tab slot="tab">Mine</kemet-tab>
        <kemet-tab slot="tab">Liked</kemet-tab>
        <kemet-tab-panel slot="panel">
          <br />
          <ani-feed feed="all" current=${this.currentTab}></ani-feed>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          <ani-feed feed="following" current=${this.currentTab}></ani-feed>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          <ani-feed feed="mine" current=${this.currentTab}></ani-feed>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          <ani-feed feed="liked" current=${this.currentTab}></ani-feed>
        </kemet-tab-panel>
      </kemet-tabs>

      <kemet-fab pill @click=${() => this.modalsState.setNewQuoteOpened(true)}>
        <kemet-icon slot="icon" icon="pencil-square" size="24"></kemet-icon>
        New Quote
      </kemet-fab>
    `
  }

  makeLoggedOut() {
    return html`
      <kemet-tabs divider>
        <kemet-tab slot="tab">All</kemet-tab>
        <kemet-tab-panel slot="panel">
          <br />
          <ani-feed></ani-feed>
        </kemet-tab-panel>
      </kemet-tabs>
    `
  }

  handleTabSelected(event: CustomEvent) {
    this.currentTab = event.detail.innerText.toLowerCase();
    const currentFeedElement = this.shadowRoot?.querySelector('ani-feed') as AniFeed;
    currentFeedElement.current = this.currentTab;
    currentFeedElement.currentPage[this.currentTab] = 1;
    if (!currentFeedElement.hasFetched[this.currentTab]) console.log('get quote from home'); currentFeedElement.getQuotes();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-home': AniHome
  }
}
