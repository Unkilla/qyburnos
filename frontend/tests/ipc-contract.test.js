import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { validateLogPayload, validateSidecarRequest } from '../src/main/security.js'

describe('IPC payload security', () => {
  it('allows only known tools and positional safe arguments', () => {
    expect(validateSidecarRequest({ tool: 'nmap', args: ['-sV', 'example.test'] })).toEqual({ filename: 'nmap.exe', args: ['-sV', 'example.test'] })
    expect(() => validateSidecarRequest({ tool: 'unknown', args: [] })).toThrow()
    expect(() => validateSidecarRequest({ tool: 'nmap', args: ['-oA;touch'] })).toThrow()
  })

  it('rejects arrays and oversized log payloads', () => {
    expect(() => validateLogPayload([])).toThrow()
    expect(() => validateLogPayload({ output: 'x'.repeat(20_000_001) })).toThrow()
  })

  it('keeps privileged APIs behind the preload bridge', async () => {
    const source = await readFile(new URL('../src/preload/index.js', import.meta.url), 'utf8')
    expect(source).toContain('contextBridge.exposeInMainWorld')
    expect(source).toContain('ipcRenderer.invoke')
    expect(source).not.toContain('nodeIntegration')
  })
})