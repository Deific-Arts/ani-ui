
import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user.ts';
import modalsStore, { IModalsStore } from '../../store/modals.ts';
import alertStore, { IAlertStore } from '../../store/alert.ts';
import { ENUM_ALERT_STATUS } from '../../shared/enums.ts';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import quoteStore, { IQuoteStore } from '../../store/quote.ts';
import 'kemet-ui/dist/components/kemet-field/kemet-field';
import 'kemet-ui/dist/components/kemet-textarea/kemet-textarea';
import 'kemet-ui/dist/components/kemet-count/kemet-count';
import KemetTextarea from 'kemet-ui/dist/components/kemet-textarea/kemet-textarea';
import { switchRoute } from '../../shared/utilities.ts';


const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-post-comment')
export default class AniPostComment extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @query('form')
  commentForm!: HTMLFormElement

  constructor() {
    super();
    modalsStore.subscribe((state) => {
      this.modalsState = state;
    });
  }

  render() {
    const isMember = this.userState.profile.memberFreePass || !!this.userState.profile.memberId;

    if (isMember) {
      return html`
        <button aria-label="Close" @click=${() => this.modalsState.setCommentOpened(false)}><kemet-icon icon="x-lg" size="24"></kemet-icon></button>
        <form method="post" action="api/comments" @submit=${(event: SubmitEvent) => this.handlePost(event)}>
          <kemet-field slug="comment" label="What do you have to say?" message="Your comment cannot be blank">
            <kemet-textarea slot="input" name="comment" rows="5" rounded required filled></kemet-textarea>
            <kemet-count slot="component" message="characters remaining." limit="1000" validate-immediately></kemet-count>
          </kemet-field>
          ${this.modalsState.currentQuote && html`<p>Commenting on <em>${this.modalsState.currentQuote.book.title}</em>, ${this.modalsState.currentQuote.page && html`page: ${this.modalsState.currentQuote.page}`}</p>`}
          <kemet-button variant="circle" aria-label="Comment">
            <kemet-icon icon="send" size="24"></kemet-icon>
          </kemet-button>
        </form>
      `
    }

    return html`
      <section>
        <p>Have something to say about this quote? Become a member to join the discussion.</p>
        <p><kemet-button variant="rounded" @click=${() => this.becomeAMemberButton()}>Become a member today</kemet-button></p>
      </section>
    `;
  }

  becomeAMemberButton() {
    switchRoute('/membership/checkout');
    this.modalsState.setCommentOpened(false);
  }

  async handlePost(event: SubmitEvent) {
    event.preventDefault();

    const form = this.commentForm;
    const formData = new FormData(form);
    const endpoint = this.commentForm.getAttribute('action');
    const user = this.userState.user.user;
    const commentTextarea = this.commentForm.querySelector('kemet-textarea') as KemetTextarea;

    delete user.documentId;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
      body: JSON.stringify({
        data: {
          quoteId: this.modalsState.currentQuote?.id,
          comment: formData.get('comment'),
          user: user,
        }
      })
    }

    setTimeout(async () => {
      if (!commentTextarea.invalid) {
        const commentResponse = await fetch(`${API_URL}/${endpoint}?populate=user`, options);
        const { error, data } = await commentResponse.json();

        if (!error) {
          this.modalsState.setCommentOpened(false);
          this.alertState.setStatus(ENUM_ALERT_STATUS.PRIMARY);
          this.alertState.setMessage('Your comment has been posted!');
          this.alertState.setOpened(true);
          this.quoteState.addComment(data);
        } else {
          this.alertState.setStatus(ENUM_ALERT_STATUS.ERROR);
          this.alertState.setMessage(error.message);
          this.alertState.setOpened(true);
        }
      }
    }, 1);

  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-post-comment': AniPostComment
  }
}
