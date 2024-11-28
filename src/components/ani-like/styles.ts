import { css } from 'lit';

export default css`
  :host {
    --ani-like-color: inherit;
    color: var(--ani-like-color);
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
  }

  :host([liked]) {
    --ani-like-color: rgb(var(--kemet-color-red-600));
  }
`;
