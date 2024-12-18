import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import modalsStore, { IModalsStore } from '../../store/modals';
import userStore, { IUserStore } from '../../store/user';
import { IQuote } from '../../shared/interfaces';
import styles from './styles';

import '../ani-feed/feed';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-home')
export default class AniHome extends LitElement {
  static styles = [styles];

  @state()
  quotes: IQuote[] = [];

  @state()
  myQuotes: IQuote[] = [];

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  firstUpdated() {
    this.getQuotes();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('quotes')) {
      this.myQuotes = this.quotes.filter(quote => quote.user.id === this.userState.user.user.id);
    }
  }

  render() {
    return html`
      <kemet-tabs divider>
        <kemet-tab slot="tab">All</kemet-tab>
        <kemet-tab slot="tab">Following</kemet-tab>
        <kemet-tab slot="tab">Mine</kemet-tab>
        <kemet-tab-panel slot="panel">
          <br />
          <ani-feed .quotes=${this.quotes}></ani-feed>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">Following</kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          ${this.myQuotes.length > 0
            ? html`<ani-feed .quotes=${this.myQuotes}></ani-feed>`
            : html`<p>Looks like you haven't added any quotes yet.</p>`
          }
        </kemet-tab-panel>
      </kemet-tabs>

      ${this.userState.isLoggedIn ? html`
        <kemet-fab pill @click=${() => this.modalsState.setNewQuoteOpened(true)}>
          <kemet-icon slot="icon" icon="pencil-square" size="24"></kemet-icon>
          New Quote
        </kemet-fab>` : null
      }
    `
  }

  async getQuotes() {
    const response = await fetch(`${API_URL}/api/quotes?sort[0]=createdAt:desc&populate=user.avatar&populate=book`);
    const { data } = await response.json();
    this.quotes = data;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-home': AniHome
  }
}
