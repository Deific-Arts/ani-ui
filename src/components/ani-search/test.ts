import { page, userEvent } from '@vitest/browser/context';
import { html, render } from 'lit';
import { vi, expect, test, describe, beforeEach } from 'vitest';
import { AniSearch } from './search';

import './search';
import 'kemet-ui/dist/components/kemet-input/kemet-input';

describe('Search', () => {
  beforeEach(() => {
    render(
      html`<ani-search></ani-search>`,
      document.body,
    );
  });

  test('accepts users input for searching', async () => {
    const spyHandleSearch = vi.spyOn(AniSearch.prototype, 'handleSearch');
    await userEvent.type(page.getByRole('textbox'), "test");
    expect(spyHandleSearch).toHaveBeenCalledWith(expect.objectContaining({ detail: 'test'}));
  });

  test('accepts users input for searching on blur', async () => {
    const spyHandleSearchFocus = vi.spyOn(AniSearch.prototype, 'handleSearchFocus');
    await userEvent.type(page.getByRole('textbox'), "test");
    await userEvent.click(document.body);
    expect(spyHandleSearchFocus).toHaveBeenCalled();
  });
});
