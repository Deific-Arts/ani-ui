import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';

@customElement('ani-top-nav')
export default class AniTopNav extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  render() {
    return html`
      <nav>
        <button aria-label="Menu">
          <kemet-icon icon="list" size="32"></kemet-icon>
        </button>
      </nav>
      <button aria-label="Home">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"viewBox="0 0 1354.5 1022.4">
          <path d="M1044.5 299.6s167.6 67.4 115.3 92.3c-52.3 25-109.4 10.1-115.3-92.3ZM703.9 16.7s-18 79.6 26.9 155.4c0 0-222.2-27-446.9 36 0 0-28.3 60.4 5.1 133.6 0 0-195.3 74.5-289 170.8 0 0 219.6 41.1 197.9 258.2 0 0 232.5-33.4 521.5 251.7C808 547 1145.6 354.1 1344.9 571.6c0 0 60.4-133.6-122-231.2 0 0-19.3-93.7-187.5-132.3 0 0-66.8-28.3-100.2-98.9 0 0-10.3 12.9-14.2 51.4-.1 0-161.8-128.5-217.1-143.9Z" fill="var(--app-color)"></path>
          <path d="M504.8 0s-61.6 77.1-77 129.6l304.4 210.8-1.5 1.3-326.1-154.1s-18 27-29.6 111.7c0 0 186.5 81.4 326.4 96.1-.2 1-.3 2.1-.5 3.1-38 2.1-138.1 2.7-331.1-27.3 0 0-16.7 107.9 27 178.5 0 0 199.8-88.8 306.2-114.8.4 1.4.8 2.9 1.3 4.3-47.2 26.9-213.4 123.3-279.3 183.7 0 0 30.8 89.9 97.7 128.5 0 0 147.5-222.4 199.3-280l2.3 2.5c-18.1 32.4-162 289.5-164.4 317.3 0 0 78.4 69.4 163.1 92.5 0 0-39.4-246.4 63.8-379.3 2.3.2 4.5.3 6.8.3 22.4 0 44.1-8.1 61.1-22.8 8.7-6.7 15.8-15.3 20.7-25.1 16.7-29.8 15.9-66.3-2.1-95.3-11.2-22-32.1-37.3-56.4-41.3-17.4-4.6-35.9-4-52.9 1.9C762.9 321.2 544.5 123 504.8 0Z" fill="var(--app-background-color)" style="display:none;"></path>
          <path d="M1154.9 482.5s-198-10.1-346.9 64.4c0 0-49.1 101.7-34.5 185.3 0 .1 159.7-226.1 381.4-249.7Zm4.5-119.9s-56.3-67.2-137.1-101.7c0 0 19.1 56.3 26.4 74.5l1-30.6c-.1-.1 53.3 15.1 109.7 57.8Z" fill="var(--app-background-color)"></path>
          <path d="M764.1 322.2 470.5 47.5 504.8 0s6.8 53.6 259.3 322.2Zm-33.5 19.7-326-154.3c-8.9 17-15.1 35.4-18.3 54.3l344.3 100ZM701 398.6s-128.4 7.1-331.1-27.3c0 0-8.4 66.4.2 100L701 398.6Zm3.5 40.7S494.3 557.1 425.2 623c0 0 15.3 39.8 27.6 56.6l251.7-240.3Zm19.9 34.6S602.2 689.3 560 791.2c0 0 33 27.9 59.4 44.1l105-361.4Zm83.8-138.4C851 358.6 867 412 844 454.8c-8.2 15.2-20.6 27.6-35.8 35.8 42.8-4 74.3-42 70.2-84.8-3.5-37.3-33-66.8-70.2-70.3Z" fill="var(--app-background-color)" style="display:none;"></path>
          <path d="M-395-27.6h2135.6v1510H-395v-1510Z" fill="none"></path>
        </svg>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-top-nav': AniTopNav;
  }
}
