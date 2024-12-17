import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user.ts';
import alertStore, { IAlertStore } from '../../store/alert.ts';
import { ENUM_ALERT_STATUS } from '../../shared/enums.ts';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';
import sharedStyles from '../../shared/styles.ts';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-change-password')
export default class aniChangePassword extends LitElement {
  static styles = [sharedStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('form[action*=change-password]')
  changePasswordForm!: HTMLFormElement;

  render() {
    return html`
      <kemet-card>
        <form method="post" action="api/auth/change-password" @submit=${(event: SubmitEvent) => this.changePassword(event)}>
          <fieldset>
            <legend>Change Password</legend>
            <p>
              <kemet-field label="Current Password">
                <kemet-input required rounded slot="input" type="password" name="current_password" validate-on-blur></kemet-input>
              </kemet-field>
            </p>
            <p>
              <kemet-field slug="new_password" label="New Password">
                <kemet-input slot="input" rounded type="password" name="new_password" required validate-on-blur></kemet-input>
                <kemet-password slot="component" message="Please make sure you meet all the requirements."></kemet-password>
              </kemet-field>
            </p>
            <p>
              <kemet-field label="Confirm Password">
                <kemet-input required rounded slot="input" type="password" name="confirm_password" validate-on-blur></kemet-input>
              </kemet-field>
            </p>
            <br /><hr /><br />
            <kemet-button variant="rounded">
              Change Password <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
            </kemet-button>
          </fieldset>
        </form>
      </kemet-card>
    `;
  }

  changePassword(event: SubmitEvent) {
    event.preventDefault();

    setTimeout(async () => {
      const fields = this.changePasswordForm.querySelectorAll('kemet-input');
      const hasErrors = Array.from(fields).some((field) => field.status === 'error');

      const currentPasswordInput = this.changePasswordForm.querySelector('[name="current_password"]') as KemetInput;
      const newPasswordInput = this.changePasswordForm.querySelector('[name="new_password"]') as KemetInput;
      const confirmPasswordInput = this.changePasswordForm.querySelector('[name="confirm_password"]') as KemetInput;

      if (hasErrors) {
        this.alertState.setStatus('error');
        this.alertState.setMessage('Please correct any errors in the fields.');
        this.alertState.setOpened(true);
        this.alertState.setIcon('exclamation-circle');
        return;
      }

      if (newPasswordInput.value !== confirmPasswordInput.value) {
        this.alertState.setStatus('error');
        this.alertState.setMessage('Your passwords do not match.');
        this.alertState.setOpened(true);
        this.alertState.setIcon('exclamation-circle');
        return;
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState.user.jwt}`
        },
        body: JSON.stringify({
          user_id: this.userState.user.user_id,
          currentPassword: currentPasswordInput.value,
          password: newPasswordInput.value,
          passwordConfirmation: confirmPasswordInput.value
        })
      }

      await fetch(`${API_URL}/api/auth/change-password`, options)
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData)
          this.alertState.setOpened(true);

          if (responseData.error) {
            this.alertState.setStatus(ENUM_ALERT_STATUS.ERROR);
            this.alertState.setMessage(responseData.error.message);
            this.alertState.setIcon('exclamation-circle');
          }

          if (responseData.jwt) {
            this.alertState.setStatus(ENUM_ALERT_STATUS.PRIMARY);
            this.alertState.setMessage('Password changed successfully.');
            this.alertState.setIcon('check-circle');
          }
        })
        .catch((error) => console.error(error));
    }, 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-change-password': aniChangePassword
  }
}
