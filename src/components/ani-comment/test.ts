import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { page } from '@vitest/browser/context';
import { fixtureUser } from '../ani-user-view/fixtures';
import { fixtureProfile } from '../ani-profile/fixtures';
import { fixtureCommentUser1, fixtureCommentUser2 } from './fixtures';
import './comment';
import 'kemet-ui/dist/components/kemet-icon/kemet-icon';

const loginTestUser = () => {
  const component = document.querySelector('ani-comment');
  component!.userState.isLoggedIn = true;
  component!.userState.user = { user: fixtureUser };
  component!.userState.profile = fixtureProfile;
  component!.comment = fixtureCommentUser1;
}

describe('Home', () => {
  beforeEach(() => {
    render(
      html`<ani-comment></ani-comment>`,
      document.body,
    );
    loginTestUser();
  });

  test('parses markdown in the comment', async () => {
    await expect.element(page.getByText(/google.com/i)).not.toBeInTheDocument();
  });

  test('displays delete button if the comment belongs to the current user', async () => {
    const button = page.getByRole("button", { name: 'Delete'});
    await expect.element(button).toBeInTheDocument();
    const component = document.querySelector('ani-comment');
    component!.comment = fixtureCommentUser2;
    render(
      html`<ani-comment></ani-comment>`,
      document.body,
    );
    await expect.element(button).not.toBeInTheDocument();
  });
});
