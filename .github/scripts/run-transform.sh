#!/usr/bin/env bash
# Runs `now-sdk transform` for sn-pull-sync and tolerates ONE known SDK failure.
#
# SDK 4.14.0 extracts and rewrites the app's files, then throws on the last
# shape, NowConfigShape (now.config.json): "Tried to check for equality before
# committing, but the target node (Block) could not be parsed". Only that exact
# failure is tolerated. Any other error (bad credentials, network, a different
# shape) still fails the step.
#
# When the failure is tolerated, the run is PARTIAL: it writes partial=true to
# $GITHUB_OUTPUT so the commit step can refuse to commit it.
#
# The repo is public. -d output goes to a file and is never uploaded; only lines
# that cannot carry credentials are printed, and the file is deleted at the end.
set -u

raw="${RUNNER_TEMP:-/tmp}/transform.raw"

pnpm exec now-sdk transform -d > "$raw" 2>&1
code=$?
echo "transform exit code: $code"

echo "--- filtered output (last 40 lines, debug noise and credential-like lines removed) ---"
sed 's/\x1b\[[0-9;]*m//g' "$raw" \
  | grep -vE 'DEBUG: (Extracted|Database contains|Transforming record)' \
  | grep -viE 'auth|token|cookie|passw|pwd|user|credential|session|bearer|secret|key|header' \
  | cut -c1-300 | tail -n 40

known_error=false
if [ "$code" -ne 0 ]; then
  last_commit_line=$(grep 'Committing shape:' "$raw" | tail -n 1)
  if grep -q 'target node (Block) could not be parsed' "$raw" \
     && echo "$last_commit_line" | grep -q 'NowConfigShape'; then
    known_error=true
  fi
fi

rm -f "$raw"

if [ "$code" -eq 0 ]; then
  echo "partial=false" >> "${GITHUB_OUTPUT:-/dev/null}"
  exit 0
fi

if [ "$known_error" = true ]; then
  echo "::warning::Tolerated the known SDK 4.14.0 now.config.json error. Files were written before it, but this run is PARTIAL and will not be committed."
  echo "partial=true" >> "${GITHUB_OUTPUT:-/dev/null}"
  exit 0
fi

echo "::error::transform failed with an error that is not the known now.config.json one."
exit "$code"
