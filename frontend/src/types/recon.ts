export type ScanStatus = 'queued' | 'running' | 'complete' | 'failed'
export type ScanModule = 'subdomains' | 'ports' | 'technologies' | 'whois'
export type TargetKind = 'url' | 'domain' | 'ip'

export interface TargetMetadata { value: string; kind: TargetKind; organization: string; location: string; asn: string }
export interface ScanModuleState { module: ScanModule; label: string; enabled: boolean; status: ScanStatus; progress: number }
export interface PortFinding { port: number; protocol: 'tcp' | 'udp'; service: string; version: string; state: 'open' | 'filtered' }
export interface SubdomainFinding { hostname: string; ip: string; status: number; provider: string; discoveredAt: string }
export interface TechnologyFinding { name: string; category: 'framework' | 'server' | 'analytics' | 'cdn'; version: string; confidence: number }
export interface WhoisRecord { registrar: string; created: string; expires: string; nameservers: string[] }
export interface ReconResults { ports: PortFinding[]; subdomains: SubdomainFinding[]; technologies: TechnologyFinding[]; whois: WhoisRecord }
export interface ScanSummary { openPorts: number; liveSubdomains: number; vulnerabilities: number; technologies: number }
export interface Scan { id: string; target: TargetMetadata; status: ScanStatus; progress: number; startedAt: string; duration: string; modules: ScanModuleState[]; summary: ScanSummary; results: ReconResults }
export interface StartScanInput { target: string; modules: ScanModule[] }
export interface ScanStreamEvent { type: 'stdout' | 'stderr' | 'status' | 'exit'; data: string; timestamp: string }
export interface TerminalSession { sessionId: string; target: string; connected: boolean; events: ScanStreamEvent[] }