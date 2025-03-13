import 'dotenv/config.js'
import request from 'supertest'

const api = request(process.env.BASE_URL || 'http://localhost:3000')
export default api
