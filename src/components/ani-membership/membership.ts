import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { loadStripe } from '@stripe/stripe-js';
import userStore, { IUserStore } from '../../store/user';
import alertStore, { IAlertStore } from '../../store/alert';
import { isLocalhost } from '../../shared/utilities';

import styles from './styles';
import sharedStyles from '../../shared/styles';

const API_URL = import.meta.env.VITE_API_URL;
const STRIPE_PUBLIC_KEY_LIVE = import.meta.env.VITE_STRIPE_PUBLIC_KEY_LIVE;
const STRIPE_PUBLIC_KEY_TEST = import.meta.env.VITE_STRIPE_PUBLIC_KEY_TEST;
const stripe = await loadStripe(isLocalhost ? STRIPE_PUBLIC_KEY_TEST : STRIPE_PUBLIC_KEY_LIVE);
@customElement('ani-membership')
export class AniMembership extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  slug: string = location.pathname.split('/')[2];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('form#checkout')
  formCheckout!: HTMLFormElement;

  @query('#checkout-embed')
  pageCheckout!: HTMLSelectElement;

  firstUpdated() {
    this.slug === 'checkout' && this.initCheckout();
    this.slug === 'success' && this.initSuccess();
  }

  updated() {
    this.slug = location.pathname.split('/')[2];
  }

  render() {
    if (this.slug === 'checkout') {
      return this.makeCheckout();
    }

    if (this.slug === 'success') {
      return this.makeSuccess();
    }

    return null;
  }

  makeCheckout() {
    return html`
      <hr />
      <form id="checkout">
        <input type="hidden" name="lookup_key" value="standard_monthly" />
        <input type="hidden" name="email" value="${this.userState?.profile?.email}" />
      </form>
      <section id="checkout-embed"></section>
    `;
  }

  async initCheckout() {
    const fetchClientSecret = async () => {
      const formData = new FormData(this.formCheckout);
      const response = await fetch(`${API_URL}/api/qenna/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify(formData),
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

  makeSuccess() {
    return html`
      <hr />
      <h1>Congratulations</h1>
      <p>You are now a member of Ani Book Quotes.</p>
    `;
  }

  async initSuccess() {
    const params = new URLSearchParams(window.location.search);

    const response = await fetch(`${API_URL}/api/qenna/create-membership`, {
      method: "POST",
      body: JSON.stringify({
        session_id: params.get('session_id') || '',
        user_id: this.userState?.profile?.id,
        jwt: this.userState?.user?.jwt,
      }),
    });

    const data = await response.json();

    if (data.error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(data.error.message);
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-membership': AniMembership
  }
}
