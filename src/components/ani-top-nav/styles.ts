import { css } from 'lit';

export default  css`
  :host {
    display: block;
    padding: 1rem;
  }

  svg {
    width: 56px;
  }

  [aria-label="Home"] {
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;
