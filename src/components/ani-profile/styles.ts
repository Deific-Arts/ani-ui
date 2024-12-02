import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  button.image {
    width: 100%;
  }

  button.close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
  }

  button.delete {
    margin-top: 1rem;
  }

  legend {
    text-align: center;
  }

  fieldset {
    text-align: center;
    margin-top: 1rem;
  }

  .profile {
    display: block;
    margin: 0;
    border: var(--app-border);
  }

  .profile-image {
    text-align: center;
    max-width: 320px;
    position: relative;
    margin: auto;
  }

  .profile-image + div {
    display: flex;
    gap: 1px;
    flex-direction: column;
    width: 100%;
  }
`;
