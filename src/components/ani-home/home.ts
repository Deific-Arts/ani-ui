import { LitElement, PropertyValues, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './styles';
import { IQuote } from '../../shared/interfaces';

import '../ani-feed/feed';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-home')
export default class AniHome extends LitElement {
  static styles = [styles];

  @state()
  quotes: IQuote[] = [];

  firstUpdated() {
    this.getQuotes();
  }

  render() {
    return html`
      <kemet-tabs divider>
        <kemet-tab slot="tab">All</kemet-tab>
        <kemet-tab slot="tab">Following</kemet-tab>
        <kemet-tab slot="tab">Mine</kemet-tab>
        <kemet-tab-panel slot="panel">
          <ani-feed .quotes=${this.quotes}></ani-feed>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">Following</kemet-tab-panel>
        <kemet-tab-panel slot="panel">Mine</kemet-tab-panel>
      </kemet-tabs>
    `
  }

  async getQuotes() {
    const response = await fetch(`${API_URL}/api/quotes?populate=user.avatar&populate=book&populate=author&populate=comments`);
    const { data }= await response.json();
    this.quotes = data;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-home': AniHome
  }
}
