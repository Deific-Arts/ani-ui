import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IQuote } from '../../shared/interfaces';
import { formatDistance } from 'date-fns';
import userStore, { IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-like/like';
import '../ani-comments/comments';
import '../ani-requotes/requotes';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-quote')
export default class AniQuote extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Object })
  quote!: IQuote;

  @state()
  originalQuote!: IQuote;

  @state()
  isSingle = location.pathname.includes('quote');

  @state()
  userState: IUserStore = userStore.getInitialState();

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('quote')) {
      this.quote.requote && this.fetchOriginalQuote();
    }
  }

  render() {
    return this.quote ? html`
      <header>
        <div>
          ${this.quote.user.avatar
            ? html`<img src="${API_URL}/${this.quote.user.avatar.url}" alt="${this.quote.user.username}" />`
            : html`<img src="https://placehold.co/80x80?text=${this.quote.user.username}" alt="${this.quote?.user?.username}" />`
          }
        </div>
        <div>
          ${this.originalQuote
            ? html`<strong>${this.userState.user.user.username}</strong> <span>requoted ${this.originalQuote.user.username} ${this.displayDate()} ago</span>`
            : html`<strong>${this.quote.user.username}</strong> <span>quoted ${this.displayDate()} ago</span>
          `}
        </div>
      </header>
      <figure>
        <blockquote>${this.quote.quote}</blockquote>
        <cite>&mdash;&nbsp;${this.quote.book.title}${this.quote.page && html`, page: ${this.quote.page}`}</cite>
      </figure>
      <footer>
        <div>
          <ani-comments .quote=${this.originalQuote ? this.originalQuote : this.quote}></ani-comments>
        </div>
        ${!this.originalQuote ? html`<div><ani-requotes .quote=${this.quote}></ani-requotes></div>` : null}
        </div>
        <div>
          <ani-like .quote=${this.originalQuote ? this.originalQuote : this.quote}></ani-like>
        </div>
        ${this.makeLink()}
        ${this.quote.note ? html`
          <div>
            <kemet-tooltip distance="24" strategy="absolute">
              <button slot="trigger" aria-label="Show note"><kemet-icon icon="journal-text" size="24"></kemet-icon></button>
              <div slot="content"><strong>Note:</strong> ${this.quote.note}</div>
            </kemet-tooltip>
          </div>
        ` : html `
          <div>
            <kemet-icon icon="journal" size="24"></kemet-icon>
          </div>
        `}
      </footer>
    ` : null
  }

  displayDate() {
    const now = new Date();
    const then = new Date(this.quote.createdAt);
    return formatDistance(now, then);
  }

  makeLink() {
    if (!this.isSingle) {
      const documentId = this.originalQuote ? this.originalQuote.documentId : this.quote.documentId;
      return html`
        <div>
          <a href="/quote/${documentId}"><kemet-icon icon="link" size="24"></kemet-icon></a>
        </div>
      `
    }
    return null;
  }

  async fetchOriginalQuote() {
    const { data } = await fetch(`${API_URL}/api/quotes/${this.quote.requote}?populate=*`)
      .then(response => response.json());
    this.originalQuote = data;
    // console.log('original quote: ',this.originalQuote);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-quote': AniQuote
  }
}
