module.exports = {
  'projectId': '16ujsm',
  e2e: {
    baseUrl: 'https://mpos.transglobe.com.tw/',
    // baseUrl: 'http://10.67.67.108/',
    port: 9091,
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
    },
    setupNodeEvents(on, config) {
      console.log(config)
      // e2e testing node events setup code
    },
  },
}
