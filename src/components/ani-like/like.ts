import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IQuote } from '../../shared/interfaces';
import styles from './styles';
import sharedStyles from '../../shared/styles';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-like')
export default class AniLike extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  quote!: IQuote;

  @property({ type: Boolean, reflect: true })
  liked: boolean = false;

  @property({ type: Number })
  likes: number = 0;

  firstUpdated() {
    this.liked = this.quote.likes.includes(this.quote.user.id);
    this.likes = this.quote.likes.length;
  }

  render() {
    return html`
      <button aria-label="Like"><kemet-icon icon="heart" size="24" @click=${() => this.handleLike()}></kemet-icon></button>
      <span>${this.likes}</span>
    `
  }

  async handleLike() {
    this.likes = this.liked ? this.likes - 1 : this.likes + 1;

    const latestQuoteRequest = await fetch(`${API_URL}/quotes/${this.quote.documentId}`);
    const latestQuoteResponse = await latestQuoteRequest.json();
    const likes = latestQuoteResponse.data.likes || [];

    const addLike = {
      likes: [...likes, this.quote.user.id]
    };

    const removeLike = {
      likes: [...likes.filter((like: number) => like !== this.quote.user.id)]
    }

    const likeRequestBody = this.liked ? removeLike : addLike;

    await fetch(`${API_URL}/api/quotes/${this.quote.documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: likeRequestBody })
    });

    // swap the likes AFTER above logic is complete
    this.liked = !this.liked;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-like': AniLike
  }
}
