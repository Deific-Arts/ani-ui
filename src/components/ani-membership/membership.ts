import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { loadStripe } from '@stripe/stripe-js';

import styles from './styles';
import sharedStyles from '../../shared/styles';
import { isLocalhost } from '../../shared/utilities';

const API_URL = import.meta.env.VITE_API_URL;
const STRIPE_PUBLIC_KEY_LIVE = import.meta.env.VITE_STRIPE_PUBLIC_KEY_LIVE;
const STRIPE_PUBLIC_KEY_TEST = import.meta.env.VITE_STRIPE_PUBLIC_KEY_TEST;
const stripe = await loadStripe(isLocalhost ? STRIPE_PUBLIC_KEY_TEST : STRIPE_PUBLIC_KEY_LIVE);
@customElement('ani-membership')
export class AniMembership extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  slug: string = location.pathname.split('/')[2];

  @query('#checkout')
  pageCheckout!: HTMLSelectElement;

  firstUpdated() {
    this.slug === 'checkout' && this.initCheckout();
  }

  updated() {
    this.slug = location.pathname.split('/')[2];
  }

  render() {
    if (this.slug === 'checkout') {
      return this.makeCheckout();
    }

    // if (this.slug === "privacy") {
    //   return privacy
    // }

    return null;
  }

  makeCheckout() {
    return html`
      <hr />
      <section id="checkout"></section>
    `;
  }

  async initCheckout() {
    const fetchClientSecret = async () => {
      const response = await fetch(`${API_URL}/api/qenna/create-checkout-session`, {
        method: "POST",
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    };

    const checkout = await stripe?.initEmbeddedCheckout({
      fetchClientSecret,
    });

    // Mount Checkout
    checkout && checkout.mount(this.pageCheckout);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-membership': AniMembership
  }
}
