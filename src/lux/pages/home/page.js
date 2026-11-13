import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {icon} from '@servicenow/aiux/aiux-directive-icon';
import '../../widgets/otto-search/index.js';
import '../../widgets/claude-status/index.js';

@customElement('x-ibmin-claudel-home-page')
export default class HomePage extends AIUXElement {
  // Layout, color, and spacing all come from DaisyUI components + Tailwind
  // utilities below; `static styles` is reserved for `:host` only.
  static styles = css`
    :host {
      display: block;
      /* Tailwind's font-serif reads this variable and nothing else defines it.
         A system serif stack avoids an external font request. */
      --font-serif: Georgia, Cambria, 'Times New Roman', Times, serif;
    }
  `;

  // Each cell runs a search in the Claude answer dialog. The wording says what works:
  // text in, text out. Nothing here uploads a file or image.
  _capabilities() {
    return [
      {
        icon: 'chat',
        title: i18n.getMessage('Text & chat'),
        detail: i18n.getMessage('Generate, transform, and reason with text'),
        query: i18n.getMessage(
          'How can Claude help me generate, transform and reason with text?'
        )
      },
      {
        icon: 'document',
        title: i18n.getMessage('Document analysis'),
        detail: i18n.getMessage('Summarize and extract from pasted text'),
        query: i18n.getMessage(
          'How do I prompt Claude to summarize a document and extract structured data from it?'
        )
      },
      {
        icon: 'workflow',
        title: i18n.getMessage('Tool use'),
        detail: i18n.getMessage('Learn how Claude connects to functions and workflows'),
        query: i18n.getMessage(
          'Explain how Claude can call tools and functions, with a simple example.'
        )
      },
      {
        icon: 'image',
        title: i18n.getMessage('Vision'),
        detail: i18n.getMessage('Learn what Claude can do with images'),
        query: i18n.getMessage(
          'What kinds of image tasks can Claude help with, and how should I describe them in a prompt?'
        )
      }
    ];
  }

  _search(query) {
    this.renderRoot.querySelector('aiux-otto-search')?.open(query);
  }

  _renderHero() {
    return html`
      <section class="rounded-box border border-base-300 bg-base-300">
        <div class="mx-auto max-w-4xl px-5 py-14 text-center sm:py-20">
          <p
            class="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            ${icon({name: 'bot', size: 'xs'})}
            ${i18n.getMessage('Claude capability navigator')}
          </p>
          <h1
            class="font-serif text-4xl font-medium tracking-tight text-text-primary sm:text-5xl"
          >
            ${i18n.getMessage('What would you like to try?')}
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-base text-text-secondary">
            ${i18n.getMessage(
              'Search a capability or describe an idea. Claude answers in a few sentences and suggests what to ask next.'
            )}
          </p>
          <div class="mt-9 text-left">
            <aiux-otto-search></aiux-otto-search>
          </div>
        </div>
      </section>
    `;
  }

  _renderCapabilities() {
    return html`
      <section class="mt-12" aria-labelledby="capabilities-heading">
        <p class="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
          ${i18n.getMessage('Playground')}
        </p>
        <h2
          id="capabilities-heading"
          class="mb-8 font-serif text-3xl font-medium tracking-tight text-text-primary"
        >
          ${i18n.getMessage('Explore capabilities')}
        </h2>
        <ul
          class="grid grid-cols-1 divide-y divide-base-300 border-y border-base-300 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0"
        >
          ${this._capabilities().map(
            (item) => html`
              <li>
                <button
                  type="button"
                  class="flex h-full min-h-44 w-full flex-col gap-2 p-6 text-left transition-colors hover:bg-base-200 motion-reduce:transition-none"
                  @click=${() => this._search(item.query)}
                >
                  <span class="mb-8 text-primary">
                    ${icon({name: item.icon, size: 'md'})}
                  </span>
                  <span class="font-semibold text-text-primary">${item.title}</span>
                  <span class="text-sm text-text-secondary">${item.detail}</span>
                </button>
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }

  _renderStatus() {
    return html`
      <section class="mt-12" aria-labelledby="status-heading">
        <h2 id="status-heading" class="sr-only">
          ${i18n.getMessage('Integration status')}
        </h2>
        <div class="max-w-md">
          <aiux-claude-status></aiux-claude-status>
        </div>
      </section>
    `;
  }

  render() {
    return html`
      <div class="mx-auto max-w-6xl">
        ${this._renderHero()} ${this._renderCapabilities()}
        ${this._renderStatus()}
      </div>
    `;
  }
}
