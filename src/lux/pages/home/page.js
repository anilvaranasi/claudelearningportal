import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {icon} from '@servicenow/aiux/aiux-directive-icon';
import '../../widgets/claude-chat/index.js';
import '../../widgets/otto-search/index.js';

@customElement('x-ibmin-claudel-home-page')
export default class HomePage extends AIUXElement {
  // Layout, color, and spacing all come from DaisyUI components + Tailwind
  // utilities below; `static styles` is reserved for `:host` only.
  static styles = css`
    :host {
      display: block;
    }
  `;

  // Each tile puts a starter prompt in the chat box. Only text prompts are
  // offered: the API integration does not take file or image uploads yet.
  _capabilities() {
    return [
      {
        icon: 'chat',
        title: i18n.getMessage('Chat & generation'),
        detail: i18n.getMessage('Test prompts and system instructions'),
        prompt: i18n.getMessage(
          'Help me write a clear prompt for summarizing meeting notes.'
        )
      },
      {
        icon: 'document',
        title: i18n.getMessage('Document analysis'),
        detail: i18n.getMessage('Summarize and extract from pasted text'),
        prompt: i18n.getMessage(
          'Summarize the following text in three bullet points:\n\n'
        )
      },
      {
        icon: 'workflow',
        title: i18n.getMessage('Tool use'),
        detail: i18n.getMessage('Learn how functions and workflows connect'),
        prompt: i18n.getMessage(
          'Explain how Claude can call tools and functions, with a simple example.'
        )
      },
      {
        icon: 'image',
        title: i18n.getMessage('Vision'),
        detail: i18n.getMessage('Learn what Claude can do with images'),
        prompt: i18n.getMessage(
          'What kinds of image tasks can Claude help with, and how should I describe them in a prompt?'
        )
      }
    ];
  }

  _useStarter(prompt) {
    this.renderRoot.querySelector('aiux-claude-chat')?.setDraft(prompt);
  }

  // A suggestion from the Otto search dialog: fill the chat box, never send.
  _onContinueInChat(e) {
    this._useStarter(e.detail?.text || '');
  }

  _renderHero() {
    return html`
      <section class="rounded-box bg-primary text-primary-content">
        <div class="grid grid-cols-1 items-center gap-8 p-6 lg:grid-cols-2 lg:p-12">
          <div class="flex flex-col gap-4">
            <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              ${icon({name: 'ai-sparkle', size: 'sm'})}
              ${i18n.getMessage('Claude integration workspace')}
            </p>
            <h1 class="text-4xl font-bold leading-tight lg:text-5xl">
              ${i18n.getMessage('Explore what Claude can do.')}
            </h1>
            <p class="max-w-md text-lg opacity-80">
              ${i18n.getMessage(
                'Try Claude in a guided playground, read the answers, and learn what to build next.'
              )}
            </p>
          </div>
          <aiux-claude-chat></aiux-claude-chat>
        </div>
      </section>
    `;
  }

  _renderSearch() {
    return html`
      <section class="mt-10" aria-label=${i18n.getMessage('Ask Otto')}>
        <aiux-otto-search
          @otto-search:continue-in-chat=${this._onContinueInChat}
        ></aiux-otto-search>
      </section>
    `;
  }

  _renderCapabilities() {
    return html`
      <section class="mt-10" aria-labelledby="capabilities-heading">
        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-text-tertiary">
          ${i18n.getMessage('Capability playground')}
        </p>
        <h2 id="capabilities-heading" class="mb-6 text-3xl font-bold text-text-primary">
          ${i18n.getMessage('Choose a feature to try')}
        </h2>
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          ${this._capabilities().map(
            (item) => html`
              <li class="h-full">
                <button
                  type="button"
                  class="aiux-card h-full w-full bg-base-100 text-left transition-colors hover:bg-base-200 motion-reduce:transition-none"
                  @click=${() => this._useStarter(item.prompt)}
                >
                  <span class="aiux-card-body">
                    <span
                      class="mb-4 flex h-12 w-12 items-center justify-center rounded-box bg-base-200 text-text-primary"
                    >
                      ${icon({name: item.icon, size: 'md'})}
                    </span>
                    <span class="aiux-card-title text-text-primary">${item.title}</span>
                    <span class="text-sm text-text-secondary">${item.detail}</span>
                  </span>
                </button>
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }

  render() {
    return html`
      <div class="mx-auto max-w-6xl">
        ${this._renderHero()} ${this._renderSearch()}
        ${this._renderCapabilities()}
      </div>
    `;
  }
}
