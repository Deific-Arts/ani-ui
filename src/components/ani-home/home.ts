import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import modalsStore, { IModalsStore } from '../../store/modals';
import userStore, { IUserStore } from '../../store/user';
import appStore, { IAppStore } from '../../store/app';
import quoteStore, { IQuoteStore } from '../../store/quote';
import { IPagination, IQuote } from '../../shared/interfaces';
import styles from './styles';

import '../ani-feed/feed';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-home')
export default class AniHome extends LitElement {
  static styles = [styles];

  @state()
  searchQuery: string = '';

  @state()
  myQuotes: IQuote[] = [];

  @state()
  followingQuotes: IQuote[] = [];

  @state()
  likedQuotes: IQuote[] = [];

  @state()
  currentPage: number = 1;

  @state()
  pagination!: IPagination;

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getInitialState();

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @query('kemet-tabs')
  tabsElement!: HTMLElement;

  constructor() {
    super();

    appStore.subscribe((state) => {
      this.appState = state;
    });

    userStore.subscribe((state) => {
      this.userState = state;
    });

    quoteStore.subscribe((state) => {
      this.quoteState = state;
      this.searchQuery = state.searchQuery;
      this.myQuotes = this.userState.isLoggedIn ? state.quotes.filter(quote => quote.user.id === this.userState.user.user.id) : [];
      this.followingQuotes = this.userState.isLoggedIn ? state.quotes.filter(quote => this.userState.profile.following?.includes(quote.user.id)) : [];
      this.likedQuotes = this.userState.isLoggedIn ? state.quotes.filter(quote => quote.likes.includes(this.userState.user.user.id)) : [];
    })
  }

  firstUpdated() {
    this.getQuotes();
    window.addEventListener('scroll', () => this.handleScroll());
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('searchQuery')) {
      this.getQuotes();
    }
  }

  render() {
    return this.userState.isLoggedIn
      ? this.makeLoggedIn()
      : this.makeLoggedOut();
  }

  makeLoggedIn() {
    console.log('make logged in');
    return html`
      <kemet-tabs divider>
        <kemet-tab slot="tab">All</kemet-tab>
        <kemet-tab slot="tab">Following</kemet-tab>
        <kemet-tab slot="tab">Mine</kemet-tab>
        <kemet-tab slot="tab">Liked</kemet-tab>
        <kemet-tab-panel slot="panel">
          <br />
          <ani-feed .quotes=${this.quoteState.quotes}></ani-feed>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          ${this.followingQuotes.length > 0
            ? html`<ani-feed .quotes=${this.followingQuotes}></ani-feed>`
            : html`<p>Looks like you haven't added any quotes yet.</p>`
          }
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          ${this.myQuotes.length > 0
            ? html`<ani-feed .quotes=${this.myQuotes}></ani-feed>`
            : html`<p>Looks like you haven't added any quotes yet.</p>`
          }
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          ${this.likedQuotes.length > 0
            ? html`<ani-feed .quotes=${this.likedQuotes}></ani-feed>`
            : html`<p>Looks like you haven't added any quotes yet.</p>`
          }
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
          <ani-feed .quotes=${this.quoteState.quotes}></ani-feed>
        </kemet-tab-panel>
      </kemet-tabs>
    `
  }


  async getQuotes(isPagination: boolean = false) {
    // search by whether or not the user, book, or quote contain the search query
    const searchParams = this.quoteState.searchQuery ?`&filters[$or][0][quote][$contains]=${this.quoteState.searchQuery}&filters[$or][1][book][title][$contains]=${this.quoteState.searchQuery}&filters[$or][2][user][username][$contains]=${this.quoteState.searchQuery}` : '';
    const response = await fetch(`${API_URL}/api/quotes?sort[0]=createdAt:desc&populate=user.avatar&populate=book${searchParams}&pagination[pageSize]=4&pagination[page]=${this.currentPage}`);
    const { data, meta } = await response.json();

    this.pagination = meta.pagination;

    if (isPagination) {
      this.quoteState.addQuotes(data);
    } else {
      this.quoteState.addInitialQuotes(data);
    }
  }

  handleScroll() {
    const tabsOffset = this.tabsElement.offsetTop + this.tabsElement.clientHeight;
    const pageOffset = window.scrollY + window.innerHeight;
    const isAtBottom = pageOffset > tabsOffset;

    if (isAtBottom && this.pagination?.page < this.pagination?.pageCount) {
      this.currentPage++;
      this.getQuotes(true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-home': AniHome
  }
}
