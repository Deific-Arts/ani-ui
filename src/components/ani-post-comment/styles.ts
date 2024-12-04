import { css } from 'lit';

export default css`
  :host {
    color: var(--app-color);
    text-align: left;
    display: block;
    padding: 1rem;
    position: relative
  }

  p {
    font-size: 0.85rem;
    margin-bottom: 0;
  }

  kemet-button {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }
`;
