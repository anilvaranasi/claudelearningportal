# Troubleshooting: "Core scripts failed to load! Check your internet connection."

| | |
|---|---|
| **App** | ClaudeLearningPortal (scope `x_146833_claudel`, basename `claudelearningportal`) |
| **Instance** | DEV |
| **Date found** | 2026-11-11 |
| **Root cause** | The AI Experience Framework plugins were not installed on the DEV instance. |
| **Root cause source** | Reported by the project owner. Not independently verified by the build agent. |
| **Status** | Fix is an instance-admin action. Nothing to change in this repo. |

## Symptom

Opening the deployed app in a browser shows:

```
Core scripts failed to load!
Check your internet connection.
```

URLs tried:

- `/aiux/claudelearningportal/home`
- `/aiux/claudelearningportal/incidents`

The message appears even though the internet connection is fine. The wording is misleading: the browser cannot download the AIUX framework's own JavaScript and CSS from the instance.

## Root cause

**The AI Experience Framework plugins were not installed on the instance.** Without them, the instance has no AIUX runtime to serve. The app deployed successfully because `now-sdk install` only needs the app's own scope. It does not check that the framework the app runs on is present.

## Evidence

Otto (ServiceNow Creator) found these framework assets returning **404 Not Found** on the instance:

| Asset | Status |
|---|---|
| `/sncapps/aix/assets/aiux-core-loader.js` | 404 |
| `/sncapps/aix/assets/core.js` | 404 |
| `/sncapps/aix/assets/aiux-styles-loader.css` | 404 |

These are the files the AIUX shell loads first. If they are missing, no AIUX experience renders, including the built-in Core UI at `/aiux/ui/home`, not only this app.

### Discrepancy to be aware of

Otto's report also said the store apps **AI Experience Framework (`sn_aixf` 1.4.3)** and **AI Experience Framework Builder (`sn_aiux_builder` 1.5.6)** were "installed and active, but with static content not deployed". That conflicts with the root cause above. I cannot tell from here which is right. If the plugins show as installed in the instance's application list, the cause is a failed or incomplete install of their static content, and the fix steps below still apply. In that case, update this document.

## What was ruled out (from this project)

The app code and pipeline are not the cause:

- CI job **Typecheck, lint and build**: success.
- CI job **Deploy to ServiceNow DEV** (`now-sdk install`): success, after the scope fix below.
- The build reported the app as compatible with any AIUX runtime (Karuna) since 22.67.0.

An unrelated problem was fixed on the way. The first install failed with `Unable to install third party application 'x_snc_claudelearni'`. `x_snc_` is reserved for ServiceNow Inc. apps, so the scope was changed to the instance's company code, `x_146833_claudel` (commit `4b3d92c`).

## Fix (instance administration)

None of these can be done from this repo or the Fluent SDK. They need an instance admin.

1. **Install the AI Experience Framework plugins.** Go to System Applications > All Available Applications, find **AI Experience Framework** (`sn_aixf`) and **AI Experience Framework Builder** (`sn_aiux_builder`), and install them. If they already show as installed, reinstall them to trigger a fresh static content deployment.
2. **Flush static content.** Go to System Diagnostics > Stats (`/stats.do`) and look for an option to flush or rebuild the static content cache.
3. **Open a case with ServiceNow Support** if steps 1 and 2 do not resolve it. Missing assets under `/sncapps/aix/` point to a deployment problem on the instance.

## How to verify the fix

Test in this order, from least to most specific:

1. **Asset check.** Open `/sncapps/aix/assets/core.js` on the instance. It should return JavaScript, not a 404.
2. **Core UI check.** Open `/aiux/ui/home`. It should render the built-in AIUX shell. If this still fails, the platform is not fixed yet.
3. **App check.** Open `/aiux/claudelearningportal/home` and `/aiux/claudelearningportal/incidents`. Home should show the starter hero and feature cards. Incidents should show the nav shell and an incident list.

If step 2 passes but step 3 fails, the problem is in the app and needs a new investigation. In that case, record the failing request URL and status from the browser's Network tab.

## Prevention

Before deploying an AIUX app to any instance (DEV or PROD), confirm the AI Experience Framework plugins are installed there. A successful `now-sdk install` does not prove this. A quick check is that `/sncapps/aix/assets/core.js` returns JavaScript.

PROD needs the same check. The PROD pipeline would deploy the app to an instance without the framework and report success.

## Not yet done

- The plugins have not been installed or reinstalled, and no ServiceNow case has been opened.
- The app has never been seen rendering on this instance. The Claude chat page has not been built, so this also blocks testing it.

## Alternative suggested by Otto

Build the portal as a UI Page-based experience instead of AIUX. This avoids the framework dependency but changes the technology the project is built on (Lux/AIUX and the Fluent SDK). It was not chosen. Revisit it only if the plugins cannot be installed.
