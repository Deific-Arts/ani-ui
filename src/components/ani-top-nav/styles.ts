import { css } from 'lit';

export default  css`
  :host {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }

  svg {
    width: 56px;
  }

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid var(--app-color);
  }

  [aria-label="Home"] {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }


`;
