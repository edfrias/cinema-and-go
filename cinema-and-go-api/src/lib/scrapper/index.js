const axios = require('axios')
const cheerio = require('cheerio')
const validate = require('../../common/validate')

const scrapper = {
   /**
   * Fetch from Axios of a given url
   *
   * @param {String} url - The given parameter to fetch from
   *
   * @returns The value of the fetched url, an HTML memory object
   */
    __getHtml(url) {
        validate.arguments([
            { name: 'url', value: url, type: 'string', notEmpty: true },
        ])

        validate.url(url)

        return (async () => {
            const { data: html } = await axios.get(url)
            return html
        })()
    },

    __wait(ms) {
        return (async () => {
            return new Promise(resolve => {
                setTimeout(resolve, ms)
            })
        })()
    },


    // Internal method - Not in use | Given a url from ecartelera it returns each cities urls
    // __getAllCities(html) {
    //     const $ = cheerio.load(html, { decodeEntities: false }) // Decode entities is needed to view correctly accents

    //     let citiesLinks = []

    //     $('.wcnt .cityselector:first-of-type a').each((i, el) => {
    //     const item = {city: $(el).text(), link: $(el).attr('href')}
    //     citiesLinks.push(item)
    //     })

    //     console.log('citiesLinks ', '\n', '-------------', citiesLinks, '\n', '-------------')
    //     return citiesLinks
    // },


    // Internal method | Given a fetched url (html) it will returns each cinema urls
    __listCinemas(html) {
        const $ = cheerio.load(html, { decodeEntities: false }) // Decode entities is needed to view correctly accents

        let cinemaLinks = []

        $('#listings .list-std:first-of-type a:not(.inactivo)').each((i, el) => {
            const item = {cinema: $(el).text(), link: $(el).attr('href')}
            cinemaLinks.push(item)
        })

        cinemaLinks.sort((a, b) => (a.cinema > b.cinema) ? 1 : -1)

        return cinemaLinks
    },

    // Internal method | Given a fetched url (html) it will return the cinema info: name, phone, direction and projection days
    __listCinemaInfo(html) {
        const $ = cheerio.load(html, { decodeEntities: false }) // Decode entities is needed to view correctly accents

        const name = $('h1').text()
        const phone = $('.prices b').text().trim()
        const address = $('.direction').text().split('.')[0]
        let location = $('.map').first().attr('onclick') ? $('.map').first().attr('onclick').match(/\(([^)]+)\)/)[1].split(', ').map(item => Number(item)) : ''

        if(Array.from(location).every((val, i, arr) => val === arr[0])) {
            location = [Number(41.4071804), Number(2.1386014)]
        }

        const projectionDay = $('#days a').first().attr('href')

        let billboard = []

        $('.mcnt .lfilmb').each((i, el) => {
            const sessionTrim = $(el).find('.cartelerascont .showtimes').text().replace(/\r?\n|\r|\t/g, ' ').replace(/ {1,}/g, ' ').replace(/VOSE: /g,'').replace(/VOSC: /g,'').replace(/CATALÁN: /g,'').trim().split(' ')

            const movie = {
                img: 'https://www.ecartelera.com' + $(el).find('a img').attr('src'),
                title:$(el).find('h4').text().replace(/\r?\n|\r|\t/g, ' ').replace(/ {1,}/g, ' '),
                info:$(el).find('.info').text().replace(/\r?\n|\r|\t/g, ' ').replace(/ {1,}/g, ' ').trim().split(' | '),
                cast:$(el).find('.cast').text().replace(/\r?\n|\r|\t/g, ' ').replace(/ {1,}/g, ' ').replace(/Dir./gi, ', Dir.'),
                movieSessions: sessionTrim,
            }

            billboard.push(movie)
        })

        return { name, phone, address, location, projectionDay, billboard }
    },

    // getAllCities() { // Not in use in v1.0
    //     return (async () => {
    //         const html = await this.__getHtml(url_cities)
    //         const cities = await this.__getAllCities(html)

    //         return cities.map(async city => {
    //             return await this.getAllCinemas(city.link)
    //         });
    //     })()
    // },

    /**
     * getAllCinemas will get the cinemas from a single city
    */
    getAllCinemas(url_city) {
        return(async () => {
            const html = await this.__getHtml(url_city)
            const cinemas = await this.__listCinemas(html)

            let count = 0

            return Promise.all(cinemas.map(async cinema => {
                count+=1
                if(count === 10) {
                    count = 0
                    await this.__wait(2000)
                }
                const cinemaInfo = await this.getCinemaInfo(cinema.link)
                return cinemaInfo
            }))
        })()
    },

    /**
     * getCinemaInfo will returns all the information over each session in a cinema
     */
    getCinemaInfo(url_cinema) {
        return (async () => {
            const html = await this.__getHtml(url_cinema)
            const cinemaInfo = await this.__listCinemaInfo(html)
            cinemaInfo.link = url_cinema
            return cinemaInfo
        })()
    }
}

module.exports = scrapper
