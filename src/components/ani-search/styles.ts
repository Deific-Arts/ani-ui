import { css } from 'lit';

export default css`
  :host {
    display: block;
    height: 1px;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
  }

  :host([opened]) {
    height: 120px;
  }

  form {
    padding: var(--kemet-spacer-md);
  }
`;
