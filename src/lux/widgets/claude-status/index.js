import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {
  AIUXWidgetElement,
  decorators
} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
const {name, description, bestFor, chatCompatible, category, server, discoverable} =
  decorators;

@customElement('aiux-claude-status')
@name('Claude Status')
@description('Shows whether the Claude API key is configured on this instance, and which model is used.')
@bestFor('Letting users and admins see at a glance whether the Claude integration is set up.')
@chatCompatible(false)
@category('custom')
@server('./server-script.js')
@discoverable(true)
export default class ClaudeStatusWidget extends AIUXWidgetElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    // This reports configuration only. It does not call the API, so it cannot
    // say the key is valid or the gateway reachable.
    const configured = !!this.data?.configured;
    const model = this.data?.model || '';
    return html`
      <section
        class="border-l-2 border-accent pl-6"
        aria-label=${i18n.getMessage('Claude integration status')}
      >
        <p class="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <span
            class="h-2 w-2 rounded-full ${configured ? 'bg-accent' : 'bg-warning'}"
            aria-hidden="true"
          ></span>
          ${configured
            ? i18n.getMessage('Claude API key configured')
            : i18n.getMessage('Claude API is not configured')}
        </p>
        <p class="mt-3 text-sm text-text-secondary">
          ${configured
            ? i18n.getMessage('Model: {0}', [model])
            : i18n.getMessage(
                'Ask an administrator to set the API key on this instance.'
              )}
        </p>
      </section>
    `;
  }
}
