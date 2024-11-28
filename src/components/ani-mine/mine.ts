import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles'


@customElement('ani-mine')
export default class AniMine extends LitElement {
  static styles = [styles, sharedStyles];

  render() {
    return html`
      <h2>Hello Mine</h2>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-mine': AniMine
  }
}
