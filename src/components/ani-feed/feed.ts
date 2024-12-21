import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IQuote } from '../../shared/interfaces';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-quote/quote';

@customElement('ani-feed')
export default class AniFeed extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Array })
  quotes: IQuote[] = [];

  render() {
    return html`
      <ul>${this.makeFeed()}</ul>
    `
  }

  makeFeed() {
    if (this.quotes.length > 0) {
      return this.quotes.map(quote => html`<li><ani-quote .quote=${quote}></ani-quote></li>`);
    }
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-feed': AniFeed
  }
}
