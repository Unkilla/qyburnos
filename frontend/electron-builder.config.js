export default {
  appId: 'com.qyburnos.desktop',
  productName: 'QyburnOS',
  directories: { output: 'release' },
  files: ['out/**/*', 'package.json'],
  extraFiles: [{ from: 'binaries', to: 'binaries', filter: ['**/*'] }],
  win: { target: [{ target: 'nsis', arch: ['x64'] }] },
  mac: { target: [{ target: 'dmg', arch: ['x64', 'arm64'] }] },
  linux: { target: [{ target: 'AppImage', arch: ['x64'] }] },
  artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
  publish: null,
}