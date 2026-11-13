import {html, css, nothing, isServer} from 'lit';
import {customElement} from 'lit/decorators.js';
import {
  AIUXWidgetElement,
  decorators
} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {icon} from '@servicenow/aiux/aiux-directive-icon';
const {name, description, bestFor, chatCompatible, category, server, discoverable} =
  decorators;

const MAX_QUERY_CHARS = 1000;

@customElement('aiux-otto-search')
@name('Claude Search')
@description('"Ask Claude" search bar. Shows a short Claude answer and follow-up prompts in a dialog. Calls Claude through a server script so the API key stays on the instance.')
@bestFor('Letting users ask a quick question about Claude and explore follow-up questions.')
@chatCompatible(false)
@category('custom')
@server('./server-script.js')
@discoverable(true)
export default class OttoSearchWidget extends AIUXWidgetElement {
  // The server script only answers explicit search actions.
  static fetchDataOnConnect = false;

  static properties = {
    _query: {type: String, state: true},
    _open: {type: Boolean, state: true},
    // 'idle' | 'loading' | 'error' | 'result'
    _status: {type: String, state: true},
    _answer: {type: String, state: true},
    _suggestions: {type: Array, state: true},
    _errorCode: {type: String, state: true}
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this._query = '';
    this._open = false;
    this._status = 'idle';
    this._answer = '';
    this._suggestions = [];
    this._errorCode = '';
    this._requestId = 0;
  }

  /**
   * Public: open the results dialog. With a query it fills the search box and
   * runs the search; without one it reopens the last result, or focuses the
   * search box when there is none.
   */
  async open(query) {
    const text = typeof query === 'string' ? query.trim() : '';
    if (text) {
      this._query = text.slice(0, MAX_QUERY_CHARS);
      await this._search();
    } else if (this._status !== 'idle') {
      this._open = true;
    } else {
      this._focusInput();
    }
  }

  _focusInput() {
    if (isServer) return;
    this.renderRoot.querySelector('#claude-query')?.focus();
  }

  _errorMessage(code) {
    switch (code) {
      case 'not_configured':
        return i18n.getMessage(
          'Claude is not configured on this instance. Ask an administrator to set the API key.'
        );
      case 'unauthorized':
        return i18n.getMessage(
          'Claude rejected the API key. Ask an administrator to check it.'
        );
      case 'rate_limited':
        return i18n.getMessage(
          'Claude is busy right now. Please try again in a moment.'
        );
      case 'bad_request':
        return i18n.getMessage('That question could not be sent. Please try again.');
      default:
        return i18n.getMessage(
          'Claude could not answer right now. Please try again.'
        );
    }
  }

  _onInput(e) {
    this._query = e.target.value;
  }

  _onSubmit(e) {
    e.preventDefault();
    this._search();
  }

  _onExample(text) {
    this._query = text;
    this._search();
  }

  async _search() {
    const query = (this._query || '').trim().slice(0, MAX_QUERY_CHARS);
    if (!query) return;

    const requestId = ++this._requestId;
    this._status = 'loading';
    this._errorCode = '';
    this._open = true;
    try {
      const response = await this.server.get({action: 'search', query});
      // A newer search replaced this one: drop the stale response.
      if (requestId !== this._requestId) return;
      if (response?.isError || !response?.answer) {
        this._errorCode = response?.errorCode || 'api_error';
        this._status = 'error';
      } else {
        this._answer = response.answer;
        this._suggestions = Array.isArray(response.suggestions)
          ? response.suggestions.slice(0, 3)
          : [];
        this._status = 'result';
      }
    } catch (err) {
      if (requestId !== this._requestId) return;
      this._errorCode = 'api_error';
      this._status = 'error';
    }
  }

  // Closing invalidates any in-flight search, so a late answer cannot reopen
  // anything. Focus returns to the search box.
  async _close() {
    this._requestId++;
    this._open = false;
    if (this._status === 'loading') {
      this._status = 'idle';
    }
    // Removing an open modal does not restore focus; do it after the update.
    await this.updateComplete;
    this._focusInput();
  }

  _onModalClose(e) {
    // Ignore close events from modals nested inside the content.
    if (e.target !== e.currentTarget) return;
    this._close();
  }

  // A follow-up suggestion runs as a new search inside the open dialog.
  _askSuggestion(text) {
    this._query = text;
    this._search();
  }

  _renderSearchBar() {
    const examples = [
      i18n.getMessage('Analyze a document'),
      i18n.getMessage('Try tool use'),
      i18n.getMessage('Describe an image')
    ];
    return html`
      <form
        role="search"
        class="flex flex-col gap-4"
        aria-label=${i18n.getMessage('Ask Claude')}
        @submit=${this._onSubmit}
      >
        <label for="claude-query" class="sr-only">
          ${i18n.getMessage('Ask Claude a question')}
        </label>
        <div
          class="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-2 pl-5 shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary"
        >
          <span class="shrink-0 text-text-tertiary">
            ${icon({name: 'magnifying-glass', size: 'md'})}
          </span>
          <input
            id="claude-query"
            type="search"
            class="min-w-0 flex-1 bg-transparent py-3 text-base text-base-content outline-none"
            maxlength=${MAX_QUERY_CHARS}
            autocomplete="off"
            placeholder=${i18n.getMessage(
              'Search capabilities or describe what you want to build'
            )}
            .value=${this._query}
            @input=${this._onInput}
          />
          <button
            type="submit"
            class="aiux-btn aiux-btn-primary shrink-0"
            aria-label=${i18n.getMessage('Search')}
            ?disabled=${!this._query.trim() || this._status === 'loading'}
          >
            ${icon({name: 'send', size: 'sm'})}
          </button>
        </div>
        <ul
          class="flex flex-wrap justify-center gap-x-5 gap-y-2"
          aria-label=${i18n.getMessage('Example searches')}
        >
          ${examples.map(
            (example) => html`
              <li>
                <button
                  type="button"
                  class="text-xs font-medium text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50 motion-reduce:transition-none"
                  ?disabled=${this._status === 'loading'}
                  @click=${() => this._onExample(example)}
                >
                  ${example}
                </button>
              </li>
            `
          )}
        </ul>
      </form>
    `;
  }

  _renderLoading() {
    return html`
      <div role="status" class="flex flex-col gap-3 py-2">
        <span class="sr-only">${i18n.getMessage('Claude is thinking')}</span>
        <span class="aiux-skeleton h-4 w-full"></span>
        <span class="aiux-skeleton h-4 w-5/6"></span>
        <span class="aiux-skeleton h-4 w-2/3"></span>
      </div>
    `;
  }

  _renderError() {
    return html`
      <div class="aiux-alert aiux-alert-error" role="alert">
        <span>${this._errorMessage(this._errorCode)}</span>
        <button
          type="button"
          class="aiux-btn aiux-btn-sm aiux-btn-ghost"
          @click=${this._search}
        >
          ${i18n.getMessage('Retry')}
        </button>
      </div>
    `;
  }

  _renderResult() {
    return html`
      <p class="whitespace-pre-wrap break-words text-text-primary">${this._answer}</p>
      ${this._suggestions.length
        ? html`
            <h6 class="mt-5 mb-2 text-sm font-semibold text-text-secondary">
              ${i18n.getMessage('Suggested follow-ups')}
            </h6>
            <ul class="flex flex-col gap-2">
              ${this._suggestions.map(
                (text) => html`
                  <li
                    class="flex flex-col gap-2 rounded-box border border-base-300 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span class="min-w-0 break-words text-sm text-text-primary">
                      ${text}
                    </span>
                    <button
                      type="button"
                      class="aiux-btn aiux-btn-sm aiux-btn-outline shrink-0"
                      @click=${() => this._askSuggestion(text)}
                    >
                      ${i18n.getMessage('Ask this')}
                      ${icon({name: 'arrow-right', size: 'xs'})}
                    </button>
                  </li>
                `
              )}
            </ul>
          `
        : nothing}
    `;
  }

  _renderDialogBody() {
    switch (this._status) {
      case 'loading':
        return this._renderLoading();
      case 'error':
        return this._renderError();
      case 'result':
        return this._renderResult();
      default:
        return nothing;
    }
  }

  _renderDialog() {
    if (!this._open) return nothing;
    // Rendered only while open: it keeps the dialog out of the server HTML.
    return html`
      <aiux-modal
        open
        size="md"
        close-on-backdrop
        label=${i18n.getMessage('Claude answer')}
        close-label=${i18n.getMessage('Close')}
        @aiux-modal:close=${this._onModalClose}
      >
        <h5 slot="header" class="flex items-center gap-2">
          ${icon({name: 'ai-sparkle', size: 'md'})}
          ${i18n.getMessage('Claude answer')}
        </h5>
        <p class="mb-3 break-words text-sm text-text-tertiary">${this._query}</p>
        <div aria-live="polite">${this._renderDialogBody()}</div>
        <div slot="footer" class="flex justify-end gap-2">
          <button
            type="button"
            class="aiux-btn aiux-btn-secondary"
            @click=${() => this._close()}
          >
            ${i18n.getMessage('Close')}
          </button>
        </div>
      </aiux-modal>
    `;
  }

  render() {
    return html`${this._renderSearchBar()} ${this._renderDialog()}`;
  }
}
