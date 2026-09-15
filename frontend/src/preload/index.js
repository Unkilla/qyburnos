import { contextBridge, ipcRenderer } from 'electron'

const channels = Object.freeze({ sidecarRun: 'sidecar:run', terminalStart: 'terminal:start', terminalWrite: 'terminal:write', terminalStop: 'terminal:stop', terminalData: 'terminal:data', logsWrite: 'logs:write', metadataPath: 'metadata:path' })

contextBridge.exposeInMainWorld('qyburnos', Object.freeze({
  sidecar: { run: (request) => ipcRenderer.invoke(channels.sidecarRun, request) },
  terminal: { start: () => ipcRenderer.invoke(channels.terminalStart), write: (input) => ipcRenderer.invoke(channels.terminalWrite, input), stop: () => ipcRenderer.invoke(channels.terminalStop), onData: (listener) => { const handler = (_event, data) => listener(data); ipcRenderer.on(channels.terminalData, handler); return () => ipcRenderer.removeListener(channels.terminalData, handler) } },
  logs: { write: (logId, payload) => ipcRenderer.invoke(channels.logsWrite, { logId, payload }) },
  metadata: { getStoragePath: () => ipcRenderer.invoke(channels.metadataPath) },
}))