import type { Scan, ScanModule, StartScanInput } from '../types/recon'

export interface ReconApi { getActiveScan(): Promise<Scan>; startScan(input: StartScanInput): Promise<Scan> }
const defaultModules: ScanModule[] = ['subdomains', 'ports', 'technologies', 'whois']

const createMockScan = (input: StartScanInput, progress: number): Scan => {
  const complete = progress >= 100
  const labels: Record<ScanModule, string> = { subdomains: 'Subdomain enum', ports: 'Port scan', technologies: 'Tech fingerprint', whois: 'WHOIS lookup' }
  const modules = defaultModules.map((module) => ({ module, label: labels[module], enabled: input.modules.includes(module), status: complete ? 'complete' as const : progress > 0 ? 'running' as const : 'queued' as const, progress: complete ? 100 : Math.min(progress + (module === 'ports' ? 8 : 18), 100) }))
  return {
    id: 'scan-7f31a', target: { value: input.target, kind: input.target.includes('/') ? 'url' : 'domain', organization: 'Acme Infrastructure', location: 'Ashburn, US', asn: 'AS16509' }, status: complete ? 'complete' : 'running', progress, startedAt: '2026-09-11T09:42:00Z', duration: complete ? '00:02:41' : '00:01:18', modules,
    summary: { openPorts: 6, liveSubdomains: 18, vulnerabilities: 3, technologies: 12 },
    results: {
      ports: [{ port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 9.3', state: 'open' }, { port: 80, protocol: 'tcp', service: 'http', version: 'nginx 1.24.0', state: 'open' }, { port: 443, protocol: 'tcp', service: 'https', version: 'nginx 1.24.0', state: 'open' }, { port: 3306, protocol: 'tcp', service: 'mysql', version: '8.0.35', state: 'filtered' }],
      subdomains: [{ hostname: 'api.acme.test', ip: '34.120.44.8', status: 200, provider: 'Amass', discoveredAt: '09:43:12' }, { hostname: 'staging.acme.test', ip: '34.120.44.12', status: 200, provider: 'Certificate', discoveredAt: '09:43:08' }, { hostname: 'vpn.acme.test', ip: '18.204.12.91', status: 403, provider: 'DNS', discoveredAt: '09:42:57' }],
      technologies: [{ name: 'Nginx', category: 'server', version: '1.24.0', confidence: 98 }, { name: 'React', category: 'framework', version: '18.3.1', confidence: 94 }, { name: 'CloudFront', category: 'cdn', version: 'unknown', confidence: 87 }],
      whois: { registrar: 'Amazon Registrar, Inc.', created: '2018-04-22', expires: '2027-04-22', nameservers: ['ns-102.awsdns-12.com', 'ns-774.awsdns-32.net'] },
    },
  }
}

export const mockReconApi: ReconApi = { getActiveScan: async () => createMockScan({ target: 'acme.test', modules: defaultModules }, 72), startScan: async (input) => createMockScan(input, 8) }