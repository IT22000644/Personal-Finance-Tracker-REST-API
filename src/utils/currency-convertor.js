import { CURRENCY_API_KEY } from '../config/index.js'

const getConversionRate = async (from, to) => {
    const url = `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/pair/${from}/${to}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const data = await response.json()
    return data.conversion_rate
}

export default getConversionRate
