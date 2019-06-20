import validate from '../Validate'
import { ConnectionError, HttpError } from '../Errors'
import axios from 'axios'

/**
 * Makes an HTTP call.
 *
 * @param {*} url
 * @param {*} callback
 * @param {*} options
 *
 * @version 4.0.0
 */
function call(url, options = {}) {
    const { method = 'GET', headers, data } = options

    validate.arguments([
        { name: 'url', value: url, type: 'string', notEmpty: true },
        { name: 'method', value: method, type: 'string', notEmpty: true },
        { name: 'headers', value: headers, type: 'object', optional: true },
        { name: 'data', value: data, type: 'object', optional: true }
    ])

    validate.url(url)

    return (async () => {
        try {
            const response = await axios({
                headers,
                method,
                url,
                data
            })

            return response.data
        } catch (error) {
            if (error.code === 'ENOTFOUND') throw new ConnectionError('cannot connect')

            const { response } = error

            if (response && response.status) {
                const err = new HttpError()

                err.status = response.status

                throw err
            }

            throw error
        }
    })()
}


export default call
