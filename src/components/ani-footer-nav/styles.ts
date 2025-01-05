import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid var(--app-border-color);
    background: var(--app-background-color);
  }

  nav {
    display: flex;
    gap: var(--kemet-spacer-md);
    justify-content: space-between;
    margin: 0 auto;
    padding: var(--kemet-spacer-md);
    width: 100%;
    max-width: var(--app-page-width);
  }
`;
