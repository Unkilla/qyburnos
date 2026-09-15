import { app, BrowserWindow, ipcMain } from 'electron'
import { execFile, spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { IPC_CHANNELS, safeLogPath, validateLogPayload, validateSidecarRequest } from './security.js'

//const __dirname = path.dirname(fileURLToPath(import.meta.url))
let mainWindow
let shellProcess

function sidecarPath(filename) {
  return app.isPackaged ? path.join(process.resourcesPath, 'binaries', process.platform === 'win32' ? 'win' : process.platform, filename) : path.join(__dirname, '..', '..', 'binaries', process.platform === 'win32' ? 'win' : process.platform, filename)
}

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1440, height: 960, minWidth: 1024, minHeight: 700, webPreferences: { preload: path.join(__dirname, '../preload/index.mjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } })
  const rendererUrl = process.env.ELECTRON_RENDERER_URL
  if (rendererUrl) mainWindow.loadURL(rendererUrl)
  else mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.on('closed', () => { mainWindow = undefined })
}

function registerIpc() {
  ipcMain.handle(IPC_CHANNELS.sidecarRun, async (_event, request) => {
    const { filename, args } = validateSidecarRequest(request)
    return new Promise((resolve, reject) => execFile(sidecarPath(filename), args, { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => error ? reject(new Error(stderr || error.message)) : resolve({ stdout, stderr })))
  })
  ipcMain.handle(IPC_CHANNELS.terminalStart, () => {
    if (shellProcess) return { connected: true }
    const command = process.platform === 'win32' ? 'powershell.exe' : (process.env.SHELL || '/bin/sh')
    const args = process.platform === 'win32' ? ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', '-'] : ['-i']
    shellProcess = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true })
    shellProcess.stdout.on('data', (data) => mainWindow?.webContents.send(IPC_CHANNELS.terminalData, { type: 'stdout', data: data.toString() }))
    shellProcess.stderr.on('data', (data) => mainWindow?.webContents.send(IPC_CHANNELS.terminalData, { type: 'stderr', data: data.toString() }))
    shellProcess.on('exit', (code) => { mainWindow?.webContents.send(IPC_CHANNELS.terminalData, { type: 'exit', data: String(code ?? '') }); shellProcess = undefined })
    return { connected: true }
  })
  ipcMain.handle(IPC_CHANNELS.terminalWrite, (_event, input) => { if (typeof input !== 'string' || input.length > 10_000) throw new Error('Invalid terminal input'); shellProcess?.stdin.write(input); return { written: Boolean(shellProcess) } })
  ipcMain.handle(IPC_CHANNELS.terminalStop, () => { shellProcess?.kill(); shellProcess = undefined; return { stopped: true } })
  ipcMain.handle(IPC_CHANNELS.logsWrite, async (_event, { logId, payload }) => { validateLogPayload(payload); const directory = path.join(app.getPath('userData'), 'logs'); await mkdir(directory, { recursive: true }); await writeFile(safeLogPath(directory, logId), JSON.stringify(payload), 'utf8'); return { saved: true } })
  ipcMain.handle(IPC_CHANNELS.metadataPath, () => app.getPath('userData'))
}

app.whenReady().then(() => { registerIpc(); createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() }) })
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('before-quit', () => { shellProcess?.kill() })