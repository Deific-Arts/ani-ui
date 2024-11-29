import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { svgLogo } from '../../shared/svgs';

@customElement('ani-top-nav')
export default class AniTopNav extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  render() {
    return html`
      <nav>
        <button aria-label="Menu">
          <kemet-icon icon="list" size="32"></kemet-icon>
        </button>
      </nav>
      <button aria-label="Home">
        ${svgLogo}
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-top-nav': AniTopNav;
  }
}
