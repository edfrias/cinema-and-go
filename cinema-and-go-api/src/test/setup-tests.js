const { server } = require('./msw/server')

beforeAll(() => server.listen({
	onUnhandledRequest(request) {
		const url = new URL(request.url)

		if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
			return
		}

		throw new Error(`[MSW] intercepted a request without a matching request handler: ${request.method} ${request.url}`)
	}
}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
