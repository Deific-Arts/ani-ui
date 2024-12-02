import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatDistance } from 'date-fns';
import styles from './styles';
import sharedStyles from '../../shared/styles';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-comment')
export default class AniComment extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  comment!: any;

  render() {
    return this.comment ? html`
      <div>
        ${this.comment.user.avatar
          ? html`<img src="${API_URL}/${this.comment.user.avatar.url}" alt="${this.comment.user.username}" />`
          : html`<img src="https://placehold.co/80x80?text=${this.comment.user.username}" alt="${this.comment.user.username}" />`
        }
      </div>
      <div>
        <header>
          <strong>${this.comment.user.username}</strong> <span>commented ${this.displayDate()} ago</span>
        </header>
        <figure>
          <br />
          <div>${this.comment.comment}</div>
        </figure>
      </div>
    ` : null
  }

  displayDate() {
    const now = new Date();
    const then = new Date(this.comment.createdAt);
    return formatDistance(now, then);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-comment': AniComment
  }
}
