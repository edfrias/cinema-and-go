const { rest } = require('msw')
const { server } = require('../../test/msw/server')
const { FormatError, ValueError } = require('../../common/errors')
const gMaps = require('.');

describe('maps', () => {
    describe('Html fetch', () => {
        it('should fetch correctly data from the given url', async () => {
            const url = 'https://maps.googleapis.com/maps/api/directions/json?origin=41.353172,2.1028038&destination=41.4418285,2.1993901&key=AIzaSyDUJnlk-inpNkXenyzldRXMGWOAPjZR2S4&mode=walking'

            server.use(
                rest.get('https://maps.googleapis.com/maps/api/directions/json', (_req, res, ctx) => {
                    return res(ctx.json({
                        routes: [
                            {
                                legs: [
                                    {
                                        duration: { value: 1234 },
                                        distance: { value: 5678 }
                                    }
                                ]
                            }
                        ]
                    }))
                })
            )

            const html = await gMaps.getData(url)

            expect(html).toBeDefined()
            expect(typeof html).toBe('object')
            expect(html.routes[0].legs[0].duration.value).toBe(1234)
            expect(html.routes[0].legs[0].distance.value).toBe(5678)
        }),

        it('should fail on incorrect given url', () => {
            const url = 'haskdjhsakdhjlsakjd'
            expect(() => gMaps.getData(url)).toThrow(FormatError)
        })

        it('should fail on incorrect given url', () => {
            const url = ''
            expect(() => gMaps.getData(url)).toThrow(ValueError)
        })
    })
})
