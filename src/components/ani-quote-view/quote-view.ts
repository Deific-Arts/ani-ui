import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IComment, IQuote } from '../../shared/interfaces';
import quoteStore, { IQuoteStore } from '../../store/quote';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-quote/quote';
import '../ani-comment/comment';
import { switchRoute } from '../../shared/utilities';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-quote-view')
export default class AniQuoteView extends LitElement {
  static styles = [styles, sharedStyles];

  @property()
  documentId: string = '';

  @state()
  quote!: IQuote;

  @state()
  hasFetchedQuote: boolean = false;

  @state()
  comments: IComment[] = [];

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  constructor() {
    super();
    quoteStore.subscribe((state) => {
      this.quoteState = state;
      this.comments = state.comments;
    });
  }

  firstUpdated() {
    this.getQuote();
  }

  render() {
    return html`
      <hr />
      ${this.quote && this.hasFetchedQuote ?
        html `
          <ani-quote .quote=${this.quote}></ani-quote>
          <ul>${this.makeComments()}</ul>
        `
        : html`
          <p>Could not find the requested quote.</p>
          <kemet-button variant="rounded" @click=${() => switchRoute('home', 'Ani | Home')}>Go home</kemet-button>
        `
      }
    `
  }

  async getQuote() {
    const path = location.pathname.split('/');
    this.documentId = !!this.documentId ? this.documentId : path[path.length - 1];
    const response = await fetch(`${API_URL}/api/quotes/${this.documentId}?populate=user.avatar&populate=book`);
    const { data } = await response.json();
    this.hasFetchedQuote = true;
    this.quote = data;
    // we need quote data before we get comments
    this.getComments();
  }

  async getComments() {
    const commentsResponse = await fetch(`${API_URL}/api/comments?filters[quoteId][$eq]=${this.quote.id}&populate=user.avatar`);
    const { data } = await commentsResponse.json();
    this.quoteState.addInitialComments(data);
  }

  makeComments() {
    if (this.comments.length > 0) {
      return this.comments.map((comment: IComment) => html`<li><ani-comment .comment=${comment}></ani-comment></li>`);
    }
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-quote-view': AniQuoteView
  }
}
