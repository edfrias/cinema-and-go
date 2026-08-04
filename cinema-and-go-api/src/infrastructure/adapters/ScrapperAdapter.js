const IScrapperAdapter = require('../../domain/interfaces/IScrapperAdapter')

class ScrapperAdapter extends IScrapperAdapter {
    constructor(scrapperLib) {
        super()
        this.scrapperLib = scrapperLib
    }

    getAllCinemas(urlCity) {
        return this.scrapperLib.getAllCinemas(urlCity)
    }
}

module.exports = { ScrapperAdapter }
