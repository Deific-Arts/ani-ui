import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import appStore, { IAppStore } from '../../store/app';
import quoteStore, { IQuoteStore } from '../../store/quote';
import userStore, { IUserStore } from '../../store/user';

import styles from './styles';
import sharedStyles from '../../shared/styles';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';
import { switchRoute } from '../../shared/utilities';

@customElement('ani-search')
export class AniSearch extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Boolean, reflect: true })
  opened: boolean = appStore.getState().isDrawerOpened;

  @state()
  appState: IAppStore = appStore.getState();

  @state()
  quoteState: IQuoteStore = quoteStore.getState();

  @state()
  userState: IUserStore = userStore.getState();

  @query('kemet-input')
  searchInput!: KemetInput;

  constructor() {
    super();

    appStore.subscribe((state) => {
      this.appState = state;
    });
  }

  render() {
    const hasFreePass = this.userState.profile?.memberFreePass;
    const isMember = !!this.userState.profile?.memberId;

    if (this.userState.isLoggedIn) {
      if (hasFreePass || isMember) {
      return html`
        <form>
          <kemet-field label="Search Quotes" slug="search">
            <kemet-input
              id="search"
              slot="input"
              name="search"
              rounded
              filled
              @kemet-input-focused=${(event: CustomEvent<KemetInput>) => this.handleSearchFocus(event)}
              @kemet-input-input=${(event: CustomEvent<KemetInput>) => this.handleSearch(event)}></kemet-input>
          </kemet-field>
        </form>
      `;
      } else {
        return html`
          <section>
            <p>Want to be able to easily search quotes by content, author, or book?</p>
            <p><kemet-button variant="rounded" @click=${() => switchRoute('/membership/checkout')}>Become a member today</kemet-button></p>
          </section>
        `;
      }
    }

    return html`
      <section>
        <p>You must be logged in and a member to search quotes.</p>
        <p><kemet-button variant="rounded" @click=${() => switchRoute('/login')}>Login to become a member</kemet-button></p>
      </section>
    `;
  }

  handleSearch(event: CustomEvent) {
    this.quoteState.setSearchQuery(event.detail);
  }

  handleSearchFocus(event: CustomEvent) {
    !event.detail && this.quoteState.setSearchQuery(this.searchInput.value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-search': AniSearch
  }
}
