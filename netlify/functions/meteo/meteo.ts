import { Handler } from '@netlify/functions'
import axios from 'axios';


export const handler: Handler = async (event, context) => {
    const lat = "44.799999"
    const lon = "-0.584000"
    const key = "5079817a0f73cd7ba5f93db4dab118c9"
    const units = "metric"
    const lang = 'fr'

    let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`)

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
}
