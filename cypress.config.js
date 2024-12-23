module.exports = {
  'projectId': '16ujsm',
  e2e: {
    // baseUrl: 'https://mpos.transglobe.com.tw/',
    baseUrl: 'http://10.67.67.108/',
    defaultCommandTimeout: 1000,
    trashAssetsBeforeRuns: true,
    testIsolation: false,
    experimentalInteractiveRunEvents: true,
    expertmentalStudio: true,
    // video
    video: true,
    videosFolder: 'results/videos',
    videoCompression: true,
    // screenshot
    screenshotsFolder: 'results/screenshots',
    screenshots: {
      enabled: true,
      on: 'failure'
    }
  },
}
