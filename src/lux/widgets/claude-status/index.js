import {html, css, nothing} from 'lit';
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
@description('Shows whether the Claude API key is configured on this instance and which model is used, and can run a real connection test on request.')
@bestFor('Letting users and admins see at a glance whether the Claude integration is set up, and check that it actually responds.')
@chatCompatible(false)
@category('custom')
@server('./server-script.js')
@discoverable(true)
export default class ClaudeStatusWidget extends AIUXWidgetElement {
  static properties = {
    // 'idle' | 'testing' | 'done'
    _testState: {type: String, state: true},
    // ok | not_configured | unauthorized | api_error | unreachable
    _testResult: {type: String, state: true},
    _testedAt: {type: Number, state: true}
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this._testState = 'idle';
    this._testResult = '';
    this._testedAt = 0;
  }

  async _runTest() {
    if (this._testState === 'testing') return;
    this._testState = 'testing';
    this._testResult = '';
    try {
      const response = await this.server.get({action: 'test'});
      this._testResult = response?.testResult || 'api_error';
    } catch (err) {
      this._testResult = 'unreachable';
    }
    this._testedAt = Date.now();
    this._testState = 'done';
  }

  _testMessage(result) {
    switch (result) {
      case 'ok':
        return i18n.getMessage('Connection test passed. Claude responded.');
      case 'not_configured':
        return i18n.getMessage(
          'Connection test failed: no API key is set on this instance.'
        );
      case 'unauthorized':
        return i18n.getMessage(
          'Connection test failed: Claude rejected the API key.'
        );
      case 'unreachable':
        return i18n.getMessage(
          'Connection test failed: the Claude API could not be reached.'
        );
      default:
        return i18n.getMessage(
          'Connection test failed: Claude returned an error.'
        );
    }
  }

  _renderTestResult() {
    if (this._testState === 'testing') {
      return html`<span>${i18n.getMessage('Testing connection')}</span>`;
    }
    if (this._testState !== 'done') return nothing;
    const passed = this._testResult === 'ok';
    // Time of the check, formatted for the user's locale.
    const time = new Intl.DateTimeFormat(undefined, {
      timeStyle: 'short'
    }).format(new Date(this._testedAt));
    return html`<span class="flex flex-wrap items-center gap-2">
      <span class=${passed ? 'text-primary' : 'text-warning'}>
        ${icon({name: passed ? 'circle-check' : 'circle-info', size: 'xs'})}
      </span>
      <span class="break-words text-text-primary">
        ${this._testMessage(this._testResult)}
      </span>
      <span class="text-text-tertiary">
        ${i18n.getMessage('Checked at {0}', [time])}
      </span>
    </span>`;
  }

  render() {
    // The configured/model lines report configuration only. Only a test result
    // says anything about the connection.
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
        ${configured
          ? html`
              <div class="mt-4 flex flex-col items-start gap-3 text-sm">
                <button
                  type="button"
                  class="aiux-btn aiux-btn-sm aiux-btn-outline"
                  ?disabled=${this._testState === 'testing'}
                  @click=${this._runTest}
                >
                  ${i18n.getMessage('Test connection')}
                </button>
                <div role="status" aria-live="polite">
                  ${this._renderTestResult()}
                </div>
              </div>
            `
          : nothing}
      </section>
    `;
  }
}
