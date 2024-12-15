import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './styles.ts';
import sharedStyles from '../../shared/styles.ts';
import userStore,{ IUserStore } from '../../store/user.ts';
import { IGoogleBook } from '../../shared/interfaces.ts';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-book')
export default class aniBook extends LitElement {
  static styles = [sharedStyles, styles];

  @property()
  identifier: string = '';

  @property({ type: Boolean })
  selectable: boolean = false;

  @property({ type: Boolean, reflect: true })
  selected: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  book!: IGoogleBook;

  constructor() {
    super();
    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  firstUpdated() {
    this.selectable && this.handleSelected();
  }

  updated(changedProperties: Map<string, unknown>) {
    changedProperties.has('identifier') && this.fetchBook();
  }

  render() {
    return html`
      <figure>
        <div>
          <img slot="media" src="${this.book?.volumeInfo?.imageLinks?.thumbnail}" alt="${this.book?.volumeInfo.title}" />
        </div>
        <header>${this.book?.volumeInfo.title}</header>
        <footer>${this.book?.volumeInfo?.authors ? this.book.volumeInfo.authors[0] : ''}</footer>
      </figure>
    `;
  }

  async fetchBook() {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${this.identifier}?key=${import.meta.env.VITE_BOOKS_API_KEY}`);
    this.book = await response.json();
  }

  handleSelected() {
    this.addEventListener('click', () => {
      this.selected = !this.selected;
      this.selected ? this.addBook() : this.removeBook();
    });
  }

  async addBook() {
    let book;
    const getResponse = await fetch(`${API_URL}/api/books?filters[identifier][$eq]=${this.identifier}`).then(response => response.json());

    if (getResponse.data.length > 0) {
      book = getResponse.data[0];
    } else {
      // if there are no books, added a new one
      const createOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState.user.jwt}`
        },
        body: JSON.stringify({ data: { title: this.book.volumeInfo.title, identifier: this.book.id } })
      };
      const createResponse = await fetch(`${API_URL}/api/books`, createOptions).then(response => response.json())
      book = createResponse.data;
    }

    this.userState.updateProfile({
      ...this.userState.profile,
      books: [...this.userState.profile.books, book]
    })

    const updateBooksOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
      body: JSON.stringify({ books: this.userState.profile.books })
    };

    const endpoint = 'api/users';

    await fetch(`${API_URL}/${endpoint}/${this.userState.user.user.id}`, updateBooksOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  async removeBook() {
    this.userState.updateProfile({
      ...this.userState.profile,
      books: this.userState.profile.books.filter((book: any) => book.identifier !== this.identifier)
    });

    const updateBooksOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
      body: JSON.stringify({ books: this.userState.profile.books })
    };

    const endpoint = 'api/users';

    await fetch(`${API_URL}/${endpoint}/${this.userState.user.user.id}`, updateBooksOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-book': aniBook
  }
}
