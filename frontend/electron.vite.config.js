import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ main: { plugins: [externalizeDepsPlugin()] }, preload: { plugins: [externalizeDepsPlugin()] }, renderer: { root: '.', build: { rollupOptions: { input: resolve('index.html') } }, resolve: { alias: { '@': resolve('src') } }, plugins: [react()] } })