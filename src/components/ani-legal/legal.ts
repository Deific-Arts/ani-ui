import { LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { privacy, terms } from './templates';

@customElement('ani-legal')
export class AniLegal extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  slug: string = location.pathname.split('/')[2];

  render() {
    if (this.slug === 'terms') {
      return terms;
    }

    if (this.slug === "privacy") {
      return privacy
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-legal': AniLegal
  }
}
