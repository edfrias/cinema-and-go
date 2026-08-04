const { rest } = require('msw')
const { server } = require('../../test/msw/server')
const { FormatError, ValueError } = require('../../common/errors')
const scrapper = require('.');

const cityHtml = `
<div id="listings">
    <div class="list-std">
        <a href="https://www.ecartelera.com/cines/b/">Cinema B</a>
        <a href="https://www.ecartelera.com/cines/a/">Cinema A</a>
    </div>
</div>
`

const cinemaHtml = `
<h1>Multicines Test</h1>
<div class="prices"><b>934000000</b></div>
<div class="direction">Calle Falsa 123. Barcelona</div>
<div class="map" onclick="fn(41.401, 2.17)"></div>
<div id="days"><a href="/days/2026-08-04">today</a></div>
<div class="mcnt">
    <div class="lfilmb">
        <a><img src="/carteles/001.jpg" /></a>
        <h4>Pelicula Uno</h4>
        <div class="info">90 min. | ES | Drama | +12</div>
        <div class="cast">Actor A, Actor B Dir. Director X</div>
        <div class="cartelerascont">
            <div class="showtimes">12:00 16:30 VOSE: 20:00</div>
        </div>
    </div>
</div>
`

describe('scrapper', () => {
    describe('Html fetch', () => {
        it('should fetch correctly data from a given url', async () => {
            const url = 'https://www.google.com/'

            server.use(
                rest.get('https://www.google.com/', (_req, res, ctx) => res(ctx.body('<html>ok</html>')))
            )

            const html = await scrapper.__getHtml(url)

            expect(html).toBeDefined()
            expect(typeof html).toBe('string')
        }),

        it('should fail on incorrect given url', () => {
            const url = 'haskdjhsakdhjlsakjd'
            expect(() => scrapper.__getHtml(url)).toThrow(FormatError)
        })

        it('should fail on incorrect given url', () => {
            const url = ''
            expect(() => scrapper.__getHtml(url)).toThrow(ValueError)
        })
    })

    describe('List cinemas', () => {
        let html
        const url_cinemas = 'https://www.ecartelera.com/cines/0,9,23.html'

        beforeAll(async () => {
            server.use(
                rest.get(url_cinemas, (_req, res, ctx) => res(ctx.body(cityHtml)))
            )

            html = await scrapper.__getHtml(url_cinemas)
            return html
        })

        it('should retrieve the correct info from a given html', async () => {
            const cinemaList = await scrapper.__listCinemas(html)

            expect(cinemaList).toBeDefined()
            expect(cinemaList).toBeInstanceOf(Array)
        })

        it('should fail on incorrect given html', async () => {
            html = ''

            const cinemaList = await scrapper.__listCinemas(html)
            expect(cinemaList).toHaveLength(0)
        })
    })

    describe('List cinema info', () => {
        let html
        const url_cinema = 'https://www.ecartelera.com/cines/89,0,1.html'

        beforeAll(async () => {
            server.use(
                rest.get(url_cinema, (_req, res, ctx) => res(ctx.body(cinemaHtml)))
            )

            html = await scrapper.__getHtml(url_cinema)
            return html
        })

        it('should get the correct info from a given html', async () => {
            const cinemaInfo = await scrapper.__listCinemaInfo(html)
            expect(cinemaInfo).toBeDefined()
            expect(cinemaInfo).toBeInstanceOf(Object)
        })

        it('should fail on incorrect info from a given html', async () => {
            html = ''

            const cinemaInfo = await scrapper.__listCinemaInfo(html)
            expect(cinemaInfo).toBeDefined()
            expect(cinemaInfo).toEqual({
                name: '',
                phone: '',
                address: '',
                location: [ 41.4071804, 2.1386014 ],
                projectionDay: undefined,
                billboard: []
            });
        })
    })

    describe('Get all cinemas', () => {
        const url_city = 'https://www.ecartelera.com/cines/0,9,23.html'
        it('should get all cinemas by calling it', async () => {
            server.use(
                rest.get(url_city, (_req, res, ctx) => res(ctx.body(cityHtml))),
                rest.get('https://www.ecartelera.com/cines/a/', (_req, res, ctx) => res(ctx.body(cinemaHtml))),
                rest.get('https://www.ecartelera.com/cines/b/', (_req, res, ctx) => res(ctx.body(cinemaHtml)))
            )

            const cinemas = await scrapper.getAllCinemas(url_city)
            expect(cinemas).toBeDefined()
            expect(cinemas).toBeInstanceOf(Array)
            expect(cinemas).toHaveLength(2)
        })
    })

    describe('Get all information from inside a cinema', () => {
        const url_cinema = 'https://www.ecartelera.com/cines/multicines-arenas-de-barcelona/'
        it('should retrieve all cinema information when call it', async () => {
            server.use(
                rest.get(url_cinema, (_req, res, ctx) => res(ctx.body(cinemaHtml)))
            )

            const cinemaInfo = await scrapper.getCinemaInfo(url_cinema)
            expect(cinemaInfo).toBeDefined()
            expect(cinemaInfo).toBeInstanceOf(Object)
            expect(cinemaInfo.name).toBe('Multicines Test')
            expect(cinemaInfo.projectionDay).toBe('/days/2026-08-04')
        })
    })
})