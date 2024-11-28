import { html } from 'lit';
import { switchRoute } from '../../shared/utilities';

export default html`
  <button @click=${() => switchRoute('home', 'Businesses | Ani')}>Home</button>
  <button @click=${() => switchRoute('mine', 'My Businesses | Ani')}>My Business</button>
  <button @click=${() => switchRoute('add', 'Add Business | Ani')}>Add Business</button>
`;
