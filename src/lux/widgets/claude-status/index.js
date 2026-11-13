import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {
  AIUXWidgetElement,
  decorators
} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {icon} from '@servicenow/aiux/aiux-directive-icon';
const {name, description, bestFor, chatCompatible, category, server, discoverable} =
  decorators;

@customElement('aiux-claude-status')
@name('Claude Status')
@description('Shows whether the Claude API key is configured on this instance, and which model is used.')
@bestFor('Letting users and admins see at a glance whether the Claude integration is ready.')
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
    const configured = !!this.data?.configured;
    const model = this.data?.model || '';
    return html`
      <section
        class="rounded-box bg-primary p-6 text-primary-content"
        aria-label=${i18n.getMessage('Claude integration status')}
      >
        <div class="flex items-start justify-between gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 text-primary"
          >
            ${icon({name: configured ? 'circle-check' : 'circle-info', size: 'md'})}
          </div>
          <span
            class="aiux-badge aiux-badge-soft aiux-badge-sm ${configured
              ? 'aiux-badge-success'
              : 'aiux-badge-warning'}"
          >
            ${configured
              ? i18n.getMessage('Connected')
              : i18n.getMessage('Not configured')}
          </span>
        </div>
        <h3 class="mt-8 font-serif text-xl font-semibold">
          ${configured
            ? i18n.getMessage('Claude API is ready')
            : i18n.getMessage('Claude API is not configured')}
        </h3>
        <p class="mt-2 text-sm opacity-80">
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
