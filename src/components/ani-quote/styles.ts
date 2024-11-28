import { css } from 'lit';

export default css`
  :host {
    display: grid;
    gap: 1rem;
    grid-template-columns: auto 1fr;
    padding: 1rem;
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

  blockquote {
    font-style: italic;
    display: flex;
    align-items: flex-start;
    position: relative;
    margin: 1rem 0 1.5rem 0;
    opacity: 0.75;
    line-height: 1.5;
  }

  blockquote::before {
    content: '❝';
    left: -0.5rem;
  }

  blockquote::after {
    content: '❞';
  }

  blockquote::before,
  blockquote::after {
    position: relative;
    top: -1rem;
    font-size: 3rem;
    opacity: 0.33;
  }

  footer {
    display: flex;
    justify-content: space-between;
    grid-column: span 2;
  }

  footer > * {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 1rem 1.5rem;
  }

  ani-note {
    color: var(--ani-color-info);
    padding: 1rem;
    margin-left: 1.5rem;
    border-radius: var(--kemet-border-radius-md);
    border-left: 3px solid var(--ani-color-info);
    background-color: var(--ani-color-info-light);
  }

  [aria-label="Show note"][active] {
    color: var(--ani-color-success);
  }

  [aria-label="Like"][active],
  [aria-label="Like"][active] + * {
    color: var(--ani-quote-color-like);
  }
`;
