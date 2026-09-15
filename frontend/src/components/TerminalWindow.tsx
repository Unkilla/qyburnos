import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

export function TerminalWindow() {
	const terminalRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const terminal = new Terminal({ convertEol: true, cursorBlink: true, fontFamily: 'DM Mono, monospace', theme: { background: '#111719', foreground: '#d5dedb', cursor: '#b8e986' } })
		if (!terminalRef.current) return () => terminal.dispose()
		terminal.open(terminalRef.current)
		const removeDataListener = window.qyburnos?.terminal.onData((event) => terminal.write(event.data))
		terminal.onData((input) => { void window.qyburnos?.terminal.write(input) })
		void window.qyburnos?.terminal.start()
		return () => { removeDataListener?.(); void window.qyburnos?.terminal.stop(); terminal.dispose() }
	}, [])
	return <section className="terminal panel"><div className="terminal-header"><div><span className="window-dot red" /><span className="window-dot yellow" /><span className="window-dot green" /></div><span>terminal / interactive shell</span><span className="terminal-live"><span className="pulse-dot" /> live stream</span></div><div className="terminal-body xterm-host" ref={terminalRef} /></section>
}