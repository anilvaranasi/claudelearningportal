# Code Review: claudelearningportal

**Scope:** ServiceNow Fluent SDK / AIUX (Lit web components) scoped app, scope `x_ibmin_claudel`.
**Verdict:** Approve with comments. No critical findings.
**Method:** Read-only review by the `code-reviewer` subagent. No files were modified.

Base path for all file references: `claudelearningportal\`

## Coverage

**Reviewed**
- `src/lux/widgets/*` (four widgets, each with a server script)
- `src/lux/pages/home/page.js`
- `src/fluent/index.now.ts` (system properties)
- `.github/workflows/*` (three GitHub workflows)
- `transform` script and the Playwright setup (`tests/smoke.spec.ts`)

**Skipped**
- `node_modules`, `.claude/skills`, `Figma/` prototype, `dist` and `dist-metadata` (build output, gitignored)
- `.env`: the reviewer could not read it. It is gitignored and was never committed. A scan of tracked files for secret patterns found nothing.

**Note:** This is not a classic update set. It has no Business Rules, Client Scripts, UI Actions, ACL records, Script Includes, or GlideRecord code.

---

## Critical

None.

## Warning

### 1. No access rules on the app or the Claude widgets
- **Where:** `aiux.json`; every widget class in `src/lux/widgets/*/index.js`
- **Issue:** No `experienceAcls` in `aiux.json` and no `@acl` on any widget or page. Per the project's AIUX docs (`.claude/skills/aiux-build/references/app/acl.md`), an app with no `experienceAcls` only admits `aix_experience_admin`, so normal learners are likely blocked today. Once the app is opened up, any signed-in user can call `otto-search` and `claude-chat`, which spend the one shared, paid API key.
- **Fix:** Decide the audience and gate both levels. Example:
  ```json
  "experienceAcls": [{"decision":"allow_if","securityAttribute":"user_is_authenticated"}]
  ```
  ```js
  @acl([{decision:'allow_if', roles:['x_ibmin_claudel.user']}])
  ```

### 2. No rate limit; chat requests can be very large
- **Where:** `src/lux/widgets/claude-chat/server-script.js:14-51`, `src/lux/widgets/otto-search/server-script.js:13-30`
- **Issue:** The browser sends the full chat history. The server accepts up to 20 messages of 8,000 characters each (about 160K characters per request), and nothing limits requests per user. The browser can also send fake `assistant` messages (line 45), which can steer Claude or fill context cheaply.
- **Failure case:** A script calls the widget endpoint in a loop with maximum-size payloads. Every call consumes the full context on the shared key.
- **Fix:**
  - Cap total characters across all messages (e.g. 24K).
  - Add a per-user limit (e.g. a counter keyed on `gs.getUserID()` with a time window, stored in a small table or cache).
  - Optionally keep conversation state on the server per session.

### 3. 90-second synchronous outbound call inside a widget request
- **Where:** `claude-chat/server-script.js:77`, `otto-search/server-script.js:63`
- **Issue:** `setHttpTimeout(90000)` holds a request thread for up to 90 seconds per call. Several slow calls at once can exhaust the instance's request threads and slow the whole instance.
- **Unverified:** The instance property `glide.http.outbound.max_timeout` may cap this value, so the effective timeout could be shorter. Check on the instance.
- **Fix:** Use about 30 seconds. Lower `max_tokens` for Otto, which only needs a 2-4 sentence answer.

### 4. Duplicated Claude client code in two server scripts
- **Where:** `claude-chat/server-script.js:22-103`, `otto-search/server-script.js:32-106`
- **Issue:** Reading the property and key, building the request and headers, handling HTTP status codes, extracting text blocks, and mapping errors are copied almost line for line. The browser-side `_errorMessage` functions are duplicated too. A fix in one copy (timeout, API version, error mapping) is easy to miss in the other.
- **Related security concern:** `claude_base_url` is a plain property. Anyone who can edit it can point the client at their own server and receive the API key in the `x-api-key` header.
- **Fix:**
  - Move the client into one shared server-side Script Include, e.g. `x_ibmin_claudel.ClaudeClient` with `send(system, messages, maxTokens)` returning `{text, model, errorCode}`.
  - Consider a Connection & Credential alias (or an Outbound REST Message with a credential) instead of a `password2` property plus `claude_base_url`.

### 5. `claude-chat` widget is deployed but unused
- **Where:** `claude-chat/index.js:12-19`
- **Issue:** No page imports `aiux-claude-chat`. `home/page.js` imports only otto-search and claude-status. The widget is `@discoverable(true)` and has a live server script that calls Claude, which adds to findings 1 and 2. Its header shows Otto labels ("Otto Search", "Claude capability navigator") at lines 175 and 178, which look copied from the other widget.
- **Fix:** Delete the widget, or set `@discoverable(false)`, add an ACL, and fix the labels.

### 6. PROD gate does not check the deployed commit; no test covers the widgets
- **Where:** `.github/workflows/prod-pipeline.yml:22-49`, `tests/smoke.spec.ts`
- **Issue:** The Playwright gate runs against whatever is installed on DEV, which may not be the commit being pushed to `prod`. The smoke tests only check that login works and that `/home` returns a status below 400. They would pass even if every widget failed or Claude was misconfigured.
- **Fix:**
  - Before the gate runs, confirm DEV has this commit's build (e.g. compare a version or commit marker).
  - Add a Playwright test that the home page shows `aiux-otto-search` and `aiux-claude-status`. Optionally add a search test that stubs the Claude call.

### 7. A newer push can cancel a DEV install midway
- **Where:** `.github/workflows/nowdev-pipeline.yml:9-11`
- **Issue:** `cancel-in-progress: true` applies to the whole workflow, including the `now-sdk install` step. A second push can kill an install in progress and leave DEV partly installed.
- **Fix:** Set `cancel-in-progress: false`, or move the deploy job into its own concurrency group that does not cancel.

---

## Suggestion

### 8. Long Otto answers can show broken JSON
- **Where:** `otto-search/server-script.js:85-97`
- **Issue:** If Claude stops at `max_tokens`, the JSON is cut off. Parsing fails and the raw fragment (e.g. `{"answer": "Claude can...`) is shown to the user.
- **Fix:** Check `stop_reason === 'max_tokens'` and return an error, or strip the partial JSON wrapper before display.

### 9. Error types never reach the log
- **Where:** `claude-chat/server-script.js:83`, `otto-search/server-script.js:69`
- **Issue:** Only the HTTP status is logged. Anthropic's `error.type` (e.g. `rate_limit_error`, `overloaded_error`) is in the response body, so 429 and 529 errors cannot be told apart.
- **Fix:** Parse the body and log only `error.type` (keeps response content out of logs). Map status 429 to its own `errorCode` so users get a "try again shortly" message.

### 10. Model name may not exist on the gateway (question, not a defect)
- **Where:** `src/fluent/index.now.ts:32`, and the `claude-sonnet-5-5` defaults in all three server scripts
- **Issue:** Not confirmed that this model ID exists on the IBM gateway. If it does not, every call fails with a generic `api_error`. The default is also copied in four places.
- **Fix:** Confirm the model ID. Keep the default in one place (see finding 4).

### 11. Leftover starter code
- **Where:** `src/lux/widgets/aiux-hello-world/`, `aiux-studio-preview/`
- **Issue:** Scaffold widgets are still part of the app. The hello-world greeting is hard-coded English.
- **Note:** The local `dist-metadata` still uses the old scope `x_146833_claudel`. It is a stale gitignored build, so run a clean rebuild before any manual install.

### 12. Model name shown to every user
- **Where:** `claude-status/server-script.js:5`
- **Issue:** Any user who can see the page sees the configured model name. Low risk.
- **Fix:** Show it only to admins (`gs.hasRole('admin')`).

---

## Done well

- The API key is never sent to the browser.
- It is stored as a `password2` property with `isPrivate` set and no value in source.
- Response bodies are not logged.
- The server checks message roles and lengths.
- Late search responses are ignored after a newer search or a close.
- All output is rendered through Lit text bindings, so there is no XSS.
- The transform script filters credentials from its output, and the PR artifact excludes `src/fluent` and `now.config.json`.

---

## Suggested priority

1. Findings 1 and 2: access rules and request limits (cost and abuse exposure)
2. Finding 4: shared client, and lock down `claude_base_url`
3. Findings 5 and 7: remove the unused widget, fix the cancel setting
4. Finding 6: deployment gate and widget tests
5. Findings 3, 8, 9, 10, 11, 12: timeouts, error handling, cleanup
