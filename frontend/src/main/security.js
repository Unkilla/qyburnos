import path from 'node:path'

export const IPC_CHANNELS = Object.freeze({
  sidecarRun: 'sidecar:run',
  terminalStart: 'terminal:start',
  terminalWrite: 'terminal:write',
  terminalStop: 'terminal:stop',
  terminalData: 'terminal:data',
  logsWrite: 'logs:write',
  metadataPath: 'metadata:path',
})

const SIDEcars = Object.freeze({ nmap: 'nmap.exe', subfinder: 'subfinder.exe' })
const SAFE_ARGUMENT = /^[a-zA-Z0-9_./:=+@%-]+$/

export function validateSidecarRequest(request) {
  if (!request || typeof request !== 'object' || !(request.tool in SIDEcars)) throw new Error('Unsupported sidecar tool')
  if (!Array.isArray(request.args) || request.args.length > 64 || request.args.some((arg) => typeof arg !== 'string' || !SAFE_ARGUMENT.test(arg))) throw new Error('Invalid sidecar arguments')
  return { filename: SIDEcars[request.tool], args: [...request.args] }
}

export function safeLogPath(logDirectory, logId) {
  if (typeof logId !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(logId)) throw new Error('Invalid log id')
  const directory = path.resolve(logDirectory)
  const filename = path.resolve(directory, `${logId}.json`)
  if (path.dirname(filename) !== directory) throw new Error('Invalid log path')
  return filename
}

export function validateLogPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid log payload')
  const serialized = JSON.stringify(payload)
  if (serialized.length > 20_000_000) throw new Error('Log payload is too large')
  return payload
}