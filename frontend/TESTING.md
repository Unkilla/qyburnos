# QyburnOS Testing Guide

## Automated checks

1. Run `npm ci` from `frontend/`.
2. Run `npm test` and confirm the IPC payload, path, and preload contract tests pass.
3. Run `npm run lint` and `npm run build`.
4. Run `npm run package` on the target operating system. Confirm the output is in `release/` and no native addon build step is requested.

## Manual validation

1. Start the app with `npm run electron:dev`. Confirm the dashboard opens in an Electron window and not a browser tab.
2. Open DevTools and verify the renderer cannot access `require`, `process`, or Node filesystem APIs. Confirm `contextIsolation` and sandboxing are enabled in the BrowserWindow configuration.
3. Expand the terminal. Type a harmless command such as `echo qyburnos-terminal` and confirm output streams into Xterm. Close and reopen the terminal to confirm the child process is stopped and restarted.
4. Start a scan with a test target. Confirm the existing dashboard updates without exposing a child-process API to React.
5. Invoke a supported sidecar with valid positional arguments. Confirm stdout and stderr return. Try an argument containing `;`, `&&`, or a newline and confirm the request is rejected.
6. Complete a scan and write a raw log. Confirm a JSON file is created below the Electron `userData/logs` directory and that the renderer never receives filesystem access.
7. Configure the `VITE_FIREBASE_*` variables in a local environment. Confirm Email/Password authentication and Firestore metadata operations use the Firebase Web SDK; do not upload raw scan logs.
8. Sign out, restart, and sign back in. Confirm workspace metadata is restored while raw logs remain local.
9. On Windows, install the NSIS artifact and launch it. On macOS, open the DMG. On Linux, execute the AppImage. Confirm each packaged app can load its renderer and resolves sidecars from its resources `binaries/` directory.
10. Test an offline launch. Confirm the shell and local logs still work, while Firebase metadata reports its normal offline/error state.