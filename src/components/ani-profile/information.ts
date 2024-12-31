import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user.ts';
import alertStore, { IAlertStore } from '../../store/alert.ts';
import { informationStyles } from './styles.ts';
import sharedStyles from '../../shared/styles.ts';

import * as FilePond from 'filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondStyles from 'filepond/dist/filepond.min.css';
import FilePondImagePreviewStyles from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { switchRoute } from '../../shared/utilities.ts';

const API_URL = import.meta.env.VITE_API_URL;

FilePond.registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

@customElement('ani-information')
export default class aniInformation extends LitElement {
  static styles = [sharedStyles, informationStyles, FilePondStyles, FilePondImagePreviewStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @state()
  filePond: any;

  @state()
  showUploadProfileImage: boolean = false;

  @query('form[action*=user]')
  userForm!: HTMLFormElement;

  @query('input[name=filepond]')
  profileInput!: HTMLInputElement;

  @query('.filepond--root')
  filePondRoot!: any;

  constructor() {
    super();
    alertStore.subscribe((state) => {
      this.alertState = state;
    });
  }

  updated(changedProperties: any) {
    if (changedProperties.has('showUploadProfileImage') && this.showUploadProfileImage) {
      this.initFilePond();
    }
  }

  render() {
    return html`
      <kemet-card>
        <form method="post" action="api/users" @submit=${(event: SubmitEvent) => this.updateProfile(event)}>
          <fieldset>
            <legend>Welcome, ${this.userState?.profile?.username}</legend>
            <section class="profile">
              <br />
              <div class="profile-image">${this.makeProfileImage()}</div>
              <hr />
              <p>
                <kemet-button variant="text" @click=${() => switchRoute(`user/${this.userState?.profile?.id}`, `Ani | ${this.userState?.profile?.username}`)}>View Profile</kemet-button>
                &nbsp;|&nbsp;
                <kemet-button variant="text" @click=${() => this.logout()}>Log Out</kemet-button>
              </p>
              <hr /><br />
              <div>
                <p>
                  <kemet-field label="First Name" slug="first-name">
                    <kemet-input slot="input" name="firstName" rounded filled value=${this.userState?.profile?.firstName}></kemet-input>
                  </kemet-field>
                </p>
                <p>
                  <kemet-field label="Last Name" slug="last-name">
                    <kemet-input slot="input" name="lastName" rounded filled value=${this.userState?.profile?.lastName}></kemet-input>
                  </kemet-field>
                </p>
                <p>
                  <kemet-field label="Email" slug="email">
                    <kemet-input slot="input" name="email" rounded filled value=${this.userState?.profile?.email}></kemet-input>
                  </kemet-field>
                </p>
                <p>
                  <kemet-field label="Bio" slug="bio">
                    <kemet-textarea slot="input" name="bio" rounded filled value=${this.userState?.profile?.bio}></kemet-textarea>
                    <kemet-count slot="component" message="characters remaining." limit="300" validate-immediately></kemet-count>
                  </kemet-field>
                </p>
              </div>
            </section>
            <br /><hr /><br />
            <kemet-button variant="rounded">
              Update Profile <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
            </kemet-button>
          </fieldset>
        </form>
      </kemet-card>
    `;
  }

  initFilePond() {
    this.filePond = FilePond.create(this.profileInput, {
      labelIdle: `Drag & Drop your picture or <span class="filepond--label-action">Browse</span>`,
      imagePreviewHeight: 170,
      imageCropAspectRatio: '1:1',
      imageResizeTargetWidth: 200,
      imageResizeTargetHeight: 200,
      stylePanelLayout: 'compact circle',
      styleLoadIndicatorPosition: 'center bottom',
      styleButtonRemoveItemPosition: 'center bottom'
    });
  }

  makeProfileImage() {
    const profileImage = this.userState.profile?.avatar?.url;

    if (profileImage && !this.showUploadProfileImage) {
      return html`
        <button class="image" @click=${() => this.showUploadProfileImage = true}>
          <div class="profile-picture" style="background-image: url('${API_URL}${profileImage}')"></div>
        </button>
        <kemet-button variant="circle" class="delete" aria-label="delete" title="Delete profile image" outlined @click=${(event: SubmitEvent) => this.deleteProfileImage(event)}>
          <kemet-icon icon="trash" size="24"></kemet-icon>
        </kemet-button>
      `;
    }

    this.showUploadProfileImage = true;

    return html`
      ${profileImage ? html`<button class="close" @click=${() => this.showUploadProfileImage = false} aria-label="delete"><kemet-icon icon="x-lg" size="32"></kemet-icon></button>` : ''}
      <input type="file" class="filepond" name="filepond" accept="image/png, image/jpeg, image/gif"/>
    `;
  }

  async updateProfile(event: SubmitEvent) {
    event.preventDefault();

    if (!this.userState.user) {
      return;
    }

    // Profile Information
    // -------------------
    const formData = new FormData(this.userForm) as any;

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
      body: JSON.stringify(Object.fromEntries(formData))
    };

    const endpoint = this.userForm.getAttribute('action');

    const profile = await fetch(`${API_URL}/${endpoint}/${this.userState.user.user.id}`, options)
      .then((response) => response.json())
      .catch((error) => console.error(error));

    this.userState.updateProfile({
      ...profile,
      ...Object.fromEntries(formData)
    });

    // Upload Media
    // ---------------

    const hasFile = !!this.filePond?.getFile()?.file;
    const uploadFormData = new FormData();

    if (hasFile) {
      uploadFormData.append('files', this.filePond.getFile().file);
    }

    const uploadOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
      body: uploadFormData
    }

    let avatar;

    if (hasFile) {
      avatar = await fetch(`${API_URL}/api/upload`, uploadOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));

      const avatarOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState.user.jwt}`
        },
        body: JSON.stringify({ avatar })
      };

      await fetch(`${API_URL}/${endpoint}/${this.userState.user.user.id}`, avatarOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
    }
  }

  async deleteProfileImage(event: SubmitEvent) {
    event.preventDefault();
    this.showUploadProfileImage = true;
    this.userState.profile.avatar.url = '';

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
      body: JSON.stringify({
        avatar: null,
      })
    }

    await fetch(`${API_URL}/api/users/${this.userState.user.user.id}`, options);

    const deleteOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
    }

    await fetch(`${API_URL}/api/upload/files/${this.userState.profile.avatar.id}`, deleteOptions);
  }

  logout() {
    this.userState.logout();
    window.location.href = "/";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-information': aniInformation
  }
}
