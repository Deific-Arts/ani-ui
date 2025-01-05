import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { switchRoute } from '../../shared/utilities';

@customElement('ani-footer-nav')
export class AniFooterNav extends LitElement {
  static styles = [sharedStyles, styles];

  render() {
    return html`
      <nav>
        <div>
          Created by <a href="https://deificarts.com" target="_blank">Deific Arts LLC</a>
        </div>
        <div>
          <button title="Terms & Conditions" @click=${() =>switchRoute('legal/terms', 'Ani | Terms & Conditions')}>Terms & Conditions</button>
          &nbsp;&nbsp;
          <button title="Privacy Policy" @click=${() => switchRoute('legal/privacy', 'Ani | Privacy Policy')}>Privacy Policy</button>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-footer-nav': AniFooterNav;
  }
}
