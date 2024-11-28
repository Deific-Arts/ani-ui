import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';
import { IQuote } from '../../shared/interfaces';

import '../ani-quote/quote';

@customElement('ani-feed')
export default class AniFeed extends LitElement {
  static styles = [styles];

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
