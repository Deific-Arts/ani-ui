import { css } from 'lit';

export default css`
  :host {
    display: grid;
    gap: 1rem;
    grid-template-columns: auto 1fr;
    padding: 2rem 2rem 0 2rem;
  }

  a {
    color: inherit;
  }

  img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 50%;
  }

  header span {
    opacity: 0.75;
    font-size: 0.85rem;
  }
`;
