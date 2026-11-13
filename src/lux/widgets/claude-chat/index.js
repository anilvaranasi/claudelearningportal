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

@customElement('aiux-claude-chat')
@name('Claude Chat')
@description('Otto-style chat card for the portal home page. Messages go through a server script so the API key stays on the instance.')
@bestFor('Letting users ask Claude questions from the portal home page.')
@chatCompatible(false)
@category('custom')
@server('./server-script.js')
@discoverable(true)
export default class ClaudeChatWidget extends AIUXWidgetElement {
  // The server script only answers explicit chat actions, so skip the
  // automatic fetch when the widget connects.
  static fetchDataOnConnect = false;

  static properties = {
    _messages: {type: Array, state: true},
    _draft: {type: String, state: true},
    _sending: {type: Boolean, state: true},
    _errorCode: {type: String, state: true}
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this._messages = [];
    this._draft = '';
    this._sending = false;
    this._errorCode = '';
  }

  /**
   * Public: let the page put starter text in the prompt box (capability tiles).
   * The text is not sent; the user reviews it and presses Send.
   */
  async setDraft(text) {
    this._draft = text || '';
    await this.updateComplete;
    const input = this.renderRoot.querySelector('#prompt');
    input?.focus();
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
      case 'bad_request':
        return i18n.getMessage('That message could not be sent. Please try again.');
      default:
        return i18n.getMessage(
          'Claude could not answer right now. Please try again.'
        );
    }
  }

  _onInput(e) {
    this._draft = e.target.value;
  }

  _onKeydown(e) {
    // Enter sends; Shift+Enter inserts a new line. Ignore Enter while an IME
    // composition is active.
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      this._send(this._draft);
    }
  }

  _onSubmit(e) {
    e.preventDefault();
    this._send(this._draft);
  }

  async _send(text) {
    const content = (text || '').trim();
    if (!content || this._sending) return;

    this._messages = [...this._messages, {role: 'user', content}];
    this._draft = '';
    this._errorCode = '';
    this._sending = true;
    try {
      const response = await this.server.get({
        action: 'chat',
        messages: this._messages.map(({role, content: c}) => ({role, content: c}))
      });
      if (response?.isError || !response?.reply) {
        this._errorCode = response?.errorCode || 'api_error';
      } else {
        this._messages = [
          ...this._messages,
          {role: 'assistant', content: response.reply}
        ];
      }
    } catch (err) {
      this._errorCode = 'api_error';
    } finally {
      this._sending = false;
    }
  }

  _retry() {
    // The conversation already ends with the user turn: resend it.
    const last = this._messages[this._messages.length - 1];
    if (!last || last.role !== 'user') return;
    this._messages = this._messages.slice(0, -1);
    this._send(last.content);
  }

  updated(changed) {
    if (isServer) return;
    if (changed.has('_messages') || changed.has('_sending')) {
      this.renderRoot.querySelector('#thread-end')?.scrollIntoView({block: 'nearest'});
    }
    if (changed.has('_sending') && !this._sending) {
      this.renderRoot.querySelector('#prompt')?.focus();
    }
  }

  _renderHeader() {
    return html`
      <div class="flex items-center gap-3 border-b border-base-300 px-5 py-4">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content"
        >
          ${icon({name: 'bot', size: 'md'})}
        </div>
        <div>
          <p class="font-semibold text-text-primary">${i18n.getMessage('Otto')}</p>
          <p class="text-xs text-text-tertiary">
            ${i18n.getMessage('Your Claude assistant')}
          </p>
        </div>
      </div>
    `;
  }

  _renderMessage(message) {
    const isUser = message.role === 'user';
    return html`
      <li class="aiux-chat ${isUser ? 'aiux-chat-end' : 'aiux-chat-start'}">
        <div class="aiux-chat-header text-xs text-text-tertiary">
          ${isUser ? i18n.getMessage('You') : i18n.getMessage('Claude')}
        </div>
        <div
          class="aiux-chat-bubble whitespace-pre-wrap break-words ${isUser
            ? 'aiux-chat-bubble-primary'
            : ''}"
        >
          ${message.content}
        </div>
      </li>
    `;
  }

  _renderThread() {
    return html`
      <ul
        class="flex max-h-96 min-h-56 flex-col gap-2 overflow-y-auto px-5 py-4"
        role="log"
        aria-live="polite"
        aria-label=${i18n.getMessage('Conversation with Claude')}
      >
        <li class="aiux-chat aiux-chat-start">
          <div class="aiux-chat-bubble">
            ${i18n.getMessage(
              'Tell me what you want to try. I can answer questions, explain ideas and help you draft prompts.'
            )}
          </div>
        </li>
        ${this._messages.map((m) => this._renderMessage(m))}
        ${this._sending
          ? html`
              <li class="aiux-chat aiux-chat-start">
                <div class="aiux-chat-bubble">
                  <span role="status" class="flex flex-col gap-2">
                    <span class="sr-only">
                      ${i18n.getMessage('Claude is thinking')}
                    </span>
                    <span class="aiux-skeleton h-3 w-48"></span>
                    <span class="aiux-skeleton h-3 w-32"></span>
                  </span>
                </div>
              </li>
            `
          : nothing}
        <li id="thread-end" aria-hidden="true"></li>
      </ul>
    `;
  }

  _renderChips() {
    const chips = [
      i18n.getMessage('What can Claude help me with?'),
      i18n.getMessage('Explain prompt engineering in simple terms'),
      i18n.getMessage('Give me three tips for writing better prompts')
    ];
    return html`
      <ul class="flex flex-wrap gap-2 px-5 pb-4">
        ${chips.map(
          (chip) => html`
            <li>
              <button
                type="button"
                class="aiux-btn aiux-btn-outline aiux-btn-sm"
                ?disabled=${this._sending}
                @click=${() => this._send(chip)}
              >
                ${chip}
              </button>
            </li>
          `
        )}
      </ul>
    `;
  }

  _renderError() {
    if (!this._errorCode) return nothing;
    return html`
      <div class="aiux-alert aiux-alert-error mx-5 mb-3" role="alert">
        <span>${this._errorMessage(this._errorCode)}</span>
        <button
          type="button"
          class="aiux-btn aiux-btn-sm aiux-btn-ghost"
          @click=${this._retry}
        >
          ${i18n.getMessage('Retry')}
        </button>
      </div>
    `;
  }

  _renderForm() {
    return html`
      <form
        class="flex flex-col gap-2 px-5 pb-5"
        aria-label=${i18n.getMessage('Message Claude')}
        @submit=${this._onSubmit}
      >
        <label for="prompt" class="sr-only">
          ${i18n.getMessage('Message Claude')}
        </label>
        <div class="flex items-end gap-2">
          <textarea
            id="prompt"
            class="aiux-textarea min-w-0 flex-1"
            rows="2"
            maxlength="8000"
            placeholder=${i18n.getMessage(
              'Search Claude capabilities or describe what you want to build...'
            )}
            .value=${this._draft}
            ?disabled=${this._sending}
            @input=${this._onInput}
            @keydown=${this._onKeydown}
          ></textarea>
          <button
            type="submit"
            class="aiux-btn aiux-btn-primary"
            aria-label=${i18n.getMessage('Send message')}
            ?disabled=${this._sending || !this._draft.trim()}
          >
            ${icon({name: 'arrow-right', size: 'sm'})}
          </button>
        </div>
        <p class="text-xs text-text-tertiary">
          ${i18n.getMessage('Press Enter to send, Shift+Enter for a new line.')}
        </p>
      </form>
    `;
  }

  render() {
    return html`
      <section
        class="w-full overflow-hidden rounded-box bg-base-100 text-base-content shadow-xl"
        aria-label=${i18n.getMessage('Chat with Claude')}
      >
        ${this._renderHeader()} ${this._renderThread()} ${this._renderChips()}
        ${this._renderError()} ${this._renderForm()}
      </section>
    `;
  }
}
