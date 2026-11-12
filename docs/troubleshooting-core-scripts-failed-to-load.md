# Troubleshooting: "Core scripts failed to load! Check your internet connection."

| | |
|---|---|
| **App** | ClaudeLearningPortal (scope `x_146833_claudel`, basename `claudelearningportal`) |
| **Instance** | DEV |
| **Date found** | 2026-11-11 |
| **Status** | Open. Platform issue on the DEV instance; nothing to fix in this repo. |
| **Diagnosis source** | Otto (ServiceNow Creator). Not independently verified: the 404 results below are Otto's, not mine. |

## Symptom

Opening the deployed app in a browser shows:

```
Core scripts failed to load!
Check your internet connection.
```

URLs tried:

- `/aiux/claudelearningportal/home`
- `/aiux/claudelearningportal/incidents`

The message appears even though the browser has a working internet connection. The wording is misleading.

## Diagnosis (from Otto)

The AIUX framework's core static assets return **404 Not Found** on the DEV instance:

| Asset | Status |
|---|---|
| `/sncapps/aix/assets/aiux-core-loader.js` | 404 |
| `/sncapps/aix/assets/core.js` | 404 |
| `/sncapps/aix/assets/aiux-styles-loader.css` | 404 |

Both framework store apps are installed and active, but their static content bundles are not deployed:

| Store app | Version |
|---|---|
| AI Experience Framework (`sn_aixf`) | 1.4.3 |
| AI Experience Framework Builder (`sn_aiux_builder`) | 1.5.6 |

Because the shell cannot download its own JavaScript and CSS, **no AIUX experience would render on this instance**. That includes the built-in Core UI, not only this app.

## What was ruled out (evidence from this project)

The app itself built and installed cleanly, so it is not the cause:

- CI job **Typecheck, lint and build**: success.
- CI job **Deploy to ServiceNow DEV** (`now-sdk install`): success, after the scope fix below.
- The build reported the app as compatible with any AIUX runtime (Karuna) since 22.67.0.

Related issue fixed on the way, unrelated to this error: the first install failed with `Unable to install third party application 'x_snc_claudelearni'`. `x_snc_` is a prefix reserved for ServiceNow Inc. apps. The app scope was changed to the instance's company code, `x_146833_claudel`. See commit `4b3d92c`.

## Recommended fix (instance administration)

None of these steps can be done from this repo or from the Fluent SDK. They need an instance admin.

1. **Flush and rebuild static content.** Go to System Diagnostics > Stats (`/stats.do`) and look for an option to flush or rebuild the static content cache. Also check for a pending deployment of the AIUX framework.
2. **Reinstall AI Experience Framework.** Go to System Applications > All Available Applications, find "AI Experience Framework", and reinstall it to trigger a fresh static content deployment.
3. **Open a case with ServiceNow Support** if steps 1 and 2 do not resolve it. Missing assets under `/sncapps/aix/` point to a deployment problem on the instance.

## How to verify the fix

Test in this order, from least to most specific:

1. **Asset check.** Open `/sncapps/aix/assets/core.js` on the instance. It should return JavaScript, not a 404.
2. **Core UI check.** Open `/aiux/ui/home`. It should render the built-in AIUX shell. If this still fails, the platform is not fixed yet.
3. **App check.** Open `/aiux/claudelearningportal/home` and `/aiux/claudelearningportal/incidents`. The Home page should show the starter hero and feature cards. Incidents should show the nav shell and an incident list.

If step 2 passes but step 3 fails, the problem is in the app and needs a new investigation. In that case, record the failing request URL and status from the browser's Network tab.

## Not yet done

- No ServiceNow case has been opened.
- The static content rebuild and framework reinstall have not been tried.
- The app has never been seen rendering on this instance. The Claude chat page has not been built, so this blocks testing it as well.

## Alternative suggested by Otto

Build the portal as a UI Page-based experience instead of AIUX. This would avoid the missing framework assets, but it changes the technology the project is built on (Lux/AIUX and the Fluent SDK). It was not chosen. Revisit it only if the platform fix is not possible.
