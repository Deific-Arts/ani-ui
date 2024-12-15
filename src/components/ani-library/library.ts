import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user.ts';
import styles from './styles.ts';
import sharedStyles from '../../shared/styles.ts';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';

import '../ani-book/book.ts';
import { IBook } from '../../shared/interfaces.ts';

@customElement('ani-library')
export default class aniLibrary extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  searchID: number = 0;

  @state()
  books: IBook[] = [];

  @state()
  myBooks: IBook[] = [];

  @state()
  hasSearch: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();


  @query('[name="search"]')
  search!: KemetInput;

  constructor() {
    super();
    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  updated() {
    this.myBooks = this.userState.profile.books;
  }

  render() {
    return html`
      <kemet-tabs placement="top" divider>
        <kemet-tab slot="tab"><kemet-icon icon="bookmark" size="24"></kemet-icon>&nbsp;&nbsp;My Books</kemet-tab>
        <kemet-tab slot="tab"><kemet-icon icon="bookmark-plus" size="24"></kemet-icon>&nbsp;&nbsp;Add Books</kemet-tab>
        <kemet-tab-panel slot="panel">
          ${this.makeMyBooks()}
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <br />
          <form method="get" action="" @submit=${() => this.handleBookSearch()}>
            <kemet-field slug="search" label="Search by author or book title">
              <kemet-input type="search" slot="input" name="search" rounded filled @keypress=${() => this.handleBookSearch()} @kemet-input-focused=${(event: CustomEvent) => this.handleBookSearchFocus(event)}></kemet-input>
            </kemet-field>
            ${this.makeBooks()}
          </form>
        </kemet-tab-panel>
      </kemet-tabs>
    `;
  }

  handleBookSearch() {
    clearTimeout(this.searchID);
    if (this.search) this.searchID = setTimeout(() => this.fetchBooks(), 500);
  }

  handleBookSearchFocus(event: CustomEvent) {
    const focused = event.detail;
    !focused && this.fetchBooks();
  }

  async fetchBooks() {
    if (this.search.value) {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.search.value}&key=${import.meta.env.VITE_BOOKS_API_KEY}`);
      const { items } = await response.json();
      this.hasSearch = true;
      this.books = items;
    }
  }

  makeBooks() {
    if (this.books && this.books.length > 0) {
      return html`
        <ul>
          ${this.books.map((book: IBook) => html`
            <li><ani-book identifier="${book.id}" selectable ?selected=${this.hasBook(book.id.toString())}></ani-book></li>
          `)}
        </ul>
      `;
    }

    if (this.hasSearch && this.books && this.books.length === 0) {
      return html`<p>Uh oh. We couldn't find any books. Try searching again.</p>`;
    }

    return null;
  }

  hasBook(identifier: string) {
    return this.userState.profile.books.some((book: any) => book.identifier === identifier);
  }

  makeMyBooks() {
    if (this.myBooks && this.myBooks.length > 0) {
      return html`
        <ul>
          ${this.myBooks.map((book: IBook) => html`
            <li><ani-book identifier="${book.identifier}"></ani-book></li>
          `)}
        </ul>
      `;
    }

    if (this.myBooks && this.myBooks.length === 0) {
      return html`<p>Looks like you haven't added any books yet.</p>`;
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-library': aniLibrary
  }
}
