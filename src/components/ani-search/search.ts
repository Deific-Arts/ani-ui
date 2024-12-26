import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import appStore, { IAppStore } from '../../store/app';
import quoteStore, { IQuoteStore } from '../../store/quote';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';

@customElement('ani-search')
export class AniSearch extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Boolean, reflect: true })
  opened: boolean = appStore.getState().isDrawerOpened;

  @state()
  appState: IAppStore = appStore.getState();

  @state()
  quoteState: IQuoteStore = quoteStore.getState();

  @query('kemet-input')
  searchInput!: KemetInput;

  constructor() {
    super();

    appStore.subscribe((state) => {
      this.appState = state;
      this.opened = state.isDrawerOpened;
    })
  }

  render() {
    return html`
      <form>
        <kemet-field label="Search Quotes" slug="search">
          <kemet-input
            id="search"
            slot="input"
            name="search"
            rounded
            filled
            @kemet-input-focused=${(event: CustomEvent<any>) => this.handleSearchFocus(event)}
            @kemet-input-input=${(event: CustomEvent<any>) => this.handleSearch(event)}></kemet-input>
        </kemet-field>
      </form>
    `;
  }

  handleSearch(event: CustomEvent) {
    this.quoteState.setSearchQuery(event.detail);
  }

  handleSearchFocus(event: CustomEvent) {
    !event.detail && this.quoteState.setSearchQuery(this.searchInput.value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-search': AniSearch
  }
}
