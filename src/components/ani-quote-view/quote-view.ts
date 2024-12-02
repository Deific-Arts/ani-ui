import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IQuote } from '../../shared/interfaces';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-quote/quote';
import '../ani-comment/comment';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-quote-view')
export default class AniQuoteView extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  quote!: IQuote;

  @state()
  documentId: string = '';

  @state()
  comments: any = [];

  firstUpdated() {
    this.getQuote();
  }

  render() {
    return html`
      <hr />
      <ani-quote .quote=${this.quote}></ani-quote>
      <ul>${this.makeComments()}</ul>
    `
  }

  async getQuote() {
    const path = location.pathname.split('/');
    this.documentId = path[path.length - 1];
    const response = await fetch(`${API_URL}/api/quotes/${this.documentId}?populate=user.avatar&populate=book&populate=author`);
    const { data } = await response.json();
    this.quote = data;
    // we need quote data before we get comments
    this.getComments();
  }

  async getComments() {
    const commentsResponse = await fetch(`${API_URL}/api/comments?filters[quoteId][$eq]=${this.quote.id}&populate=user.avatar`);
    const { data } = await commentsResponse.json();
    this.comments = data;
  }

  makeComments() {
    if (this.comments.length > 0) {
      return this.comments.map((comment: any) => html`<li><ani-comment .comment=${comment}></ani-comment></li>`);
    }
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-quote-view': AniQuoteView
  }
}
