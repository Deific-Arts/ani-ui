import { html } from "lit";
import { svgLogo } from "../../shared/svgs";
import { switchRoute } from "../../shared/utilities";
import modalsStore from "../../store/modals";

import '../ani-post-comment/post-comment';

export const signInModalTemplate = html`
  <section>
    ${svgLogo}
    <p>Want to join in on the fun? Login now!</p>
    <kemet-button
      variant="rounded"
      @click=${() => {
        modalsStore.setState({ signInOpened: false });
        switchRoute('login', 'Login');
      }}>
      Login
    </kemet-button>
  </section>
`;

export const commentModalTemplate = html`
  <ani-post-comment></ani-post-comment>
`;
