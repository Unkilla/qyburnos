interface QyburnosApi {
  sidecar: { run(request: { tool: string; args: string[] }): Promise<{ stdout: string; stderr: string }> }
  terminal: { start(): Promise<{ connected: boolean }>; write(input: string): Promise<{ written: boolean }>; stop(): Promise<{ stopped: boolean }>; onData(listener: (event: { type: string; data: string }) => void): () => void }
  logs: { write(logId: string, payload: unknown): Promise<{ saved: boolean }> }
  metadata: { getStoragePath(): Promise<string> }
}

interface Window { qyburnos?: QyburnosApi }