import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import modalsStore,{ IModalsStore } from '../../store/modals';
import styles from './styles';
import sharedStyles from '../../shared/styles';


const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-new-quote')
export default class AniNewQuote extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  render() {
    return html`
      <form>
        <kemet-field slug="quote" label="The quote">
          <kemet-textarea slot="input" name="quote" filled rounded required></kemet-textarea>
          <kemet-count slot="component" message="characters remaining." limit="300"></kemet-count>
        </kemet-field>
        <div>
          <kemet-field slug="book" label="Book">
            <kemet-select slot="input" name="book" required filled rounded>
              <kemet-option label="Item 1" value="1"></kemet-option>
              <kemet-option label="Item 2" value="2" selected=""></kemet-option>
              <kemet-option label="Item 3" value="3"></kemet-option>
              <kemet-option label="Item 4" value="4" disabled=""></kemet-option>
            </kemet-select>
          </kemet-field>
          <kemet-field slug="page" label="Page">
            <kemet-input slot="input" name="page" rounded filled></kemet-input>
          </kemet-field>
        </div>
        <kemet-field slug="note" label="Enter any notes you may have about this quote">
          <kemet-textarea slot="input" name="note" filled rounded></kemet-textarea>
          <kemet-count slot="component" message="characters remaining." limit="300"></kemet-count>
        </kemet-field>
        <footer>
          <kemet-button type="submit" variant="rounded" @click=${() => this.modalsState.setNewQuoteOpened(false)}>
            Cancel
          </kemet-button>
          <kemet-button variant="circle">
            <kemet-icon icon="send" size="24"></kemet-icon>
          </kemet-button>
        </footer>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-new-quote': AniNewQuote
  }
}
