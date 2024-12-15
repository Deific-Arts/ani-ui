import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(4, minmax(0px, 1fr));
    gap: var(--kemet-spacer-xl);
    flex-wrap: wrap;
    margin: var(--kemet-spacer-xl) 0;
    padding: 0;
    list-style: none;
  }

  form {
    padding: 0 1rem 1rem 1rem;
  }

  kemet-field {
    padding: 1rem;
  }
`;
