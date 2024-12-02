import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IQuote } from '../../shared/interfaces';
import { formatDistance } from 'date-fns';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-like/like';
import '../ani-comments/comments';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-quote')
export default class AniQuote extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  quote!: IQuote;

  @state()
  isSingle = location.pathname.includes('quote');

  render() {
    return this.quote ? html`
      <div>
        ${this.quote.user.avatar
          ? html`<img src="${API_URL}/${this.quote.user.avatar.url}" alt="${this.quote.user.username}" />`
          : html`<img src="https://placehold.co/80x80?text=${this.quote.user.username}" alt="${this.quote?.user?.username}" />`
        }
      </div>
      <div>
        <header>
          <strong>${this.quote.user.username}</strong> <span>quoted ${this.displayDate()} ago</span>
        </header>
        <figure>
          <blockquote>${this.quote.quote}</blockquote>
          <cite>&mdash;&nbsp;${this.quote.book.title}, ${this.quote.page && html`page: ${this.quote.page}`}</cite>
        </figure>
      </div>
      <footer>
        <div>
          <ani-comments .quote=${this.quote}></ani-comments>
        </div>
        <div>
          <kemet-icon icon="arrow-clockwise" size="24"></kemet-icon>
          <span>${this.quote.requote}</span>
        </div>
        <div>
          <ani-like .quote=${this.quote}></ani-like>
        </div>
        ${!this.isSingle ? html`
          <div>
            <a href="/quote/${this.quote.documentId}"><kemet-icon icon="link" size="24"></kemet-icon></a>
          </div>
        ` : null}
        ${this.quote.note ? html`
          <div>
            <kemet-tooltip distance="24" strategy="absolute">
              <button slot="trigger" aria-label="Show note"><kemet-icon icon="journal" size="24"></kemet-icon></button>
              <div slot="content"><strong>Note:</strong> ${this.quote.note}</div>
            </kemet-tooltip>
          </div>
        ` : null}
      </footer>
    ` : null
  }

  displayDate() {
    const now = new Date();
    const then = new Date(this.quote.createdAt);
    return formatDistance(now, then);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-quote': AniQuote
  }
}
