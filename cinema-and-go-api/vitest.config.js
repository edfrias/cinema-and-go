const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./src/test/setup-tests.js'],
        testTimeout: 1000000,
        hookTimeout: 1000000
    }
})
