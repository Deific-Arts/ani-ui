import { css } from 'lit';

export default css`
  :host([hidden]) {
    display: none;
  }

  a {
    color: var(--app-link-color)
  }

  button {
    cursor: pointer;
    color: inherit;
    font-size: inherit;
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
  }

  fieldset {
    border: none;
    padding: 0;
  }

  h2 {
    font-size: 2rem;
    font-weight: 400;
    width: 100%;
    padding: 0;
    margin: 0;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: var(--app-border);
  }

  h3 {
    font-size: 1.75rem;
    font-weight: 400;
  }

  legend {
    font-size: 2rem;
    width: 100%;
    padding: 0;
    margin: 0;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: var(--app-border);
  }

  cite {
    font-size: 0.9rem;
  }

  figure {
    margin: 0;
    padding: 0;
  }

  hr {
    opacity: 0.25;
  }

  a[href*='lostpassword'] {
    display: none;
  }

  kemet-button {
    --kemet-button-padding: 0.75rem 1rem;
  }

  kemet-tooltip {
    --kemet-popper-width: 80vw;
    position: relative;
  }

  kemet-toggle {
    --kemet-toggle-track-shadow: none;
    --kemet-toggle-track-color: transparent;
    --kemet-toggle-track-border: var(--app-border);
  }

  kemet-alert {
    pointer-events: none;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 9999;
    width: 96%;
    margin-top: 2%;
    transform: translateX(-50%);
    background: var(--app-background-color);
  }

  kemet-alert[opened] {
    pointer-events: auto;
  }

  kemet-alert > div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  kemet-alert[status=error] * {
    color: rgb(var(--kemet-color-error));
  }

  kemet-alert[status=success] * {
    color: rgb(var(--kemet-color-success));
  }

  kemet-tabs {
    --kemet-tabs-divider-color: rgb(var(--kemet-color-gray-700));
  }

  kemet-card {
    --kemet-card-border: none;
    --kemet-card-background-color: none;

    display: block;
    margin: 2rem auto;
  }

  kemet-avatar {
    color: rgb(var(--app-background-color));
    padding: 8px;
  }

  kemet-field {
    color: var(--app-color);
    text-align: left;
  }

  kemet-input {
    --kemet-input-background-color-filled: var(--app-input-filled-background-color);
  }

  kemet-select {
    --kemet-select-background-color-filled: var(--app-input-filled-background-color);
  }

  kemet-textarea {
    --kemet-textarea-background-color-filled: var(--app-input-filled-background-color);
    width: 80vw;
    max-width: 768px;
  }

  kemet-count {
    text-align: right;
  }

  kemet-modal {
    position: absolute;
    z-index: -1;
  }

  kemet-modal[opened] {
    position: relative;
    z-index: 10;
  }

  ::part(input) {
    outline-offset: 6px;
  }

  ::part(input):-internal-autofill-selected {
    background-color: red !important;
  }

  ::part(overlay) {
    width: 1000vw;
    height: 1000vh;
    left: -100vw;
    top: -100vh;
    background: rgb(var(--kemet-color-black) / 40%);
  }

  ::part(textarea) {
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    line-height: 1.5;
    font-size: 1rem;
    font-weight: 400;
    font-synthesis: none;
  }

  .profile-picture {
    aspect-ratio: 1 / 1;
    min-width: 48px;
    border-radius: 50%;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  @media (min-width: 768px) {
    kemet-tooltip {
      --kemet-popper-width: 480px;
    }
  }
`;
