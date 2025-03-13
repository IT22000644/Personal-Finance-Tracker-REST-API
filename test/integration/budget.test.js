import request from 'supertest'
import mongoose from 'mongoose'
import cron from 'node-cron'
import { app, server } from '../../app.js'
import User from '../../src/models/user.model.js'
import Budget from '../../src/models/budget.model.js'

describe('Budget API Endpoints', () => {
    let userToken
    let userId
    let budgetId

    beforeAll(async () => {
        const userSignup = await request(app).post('/api/v1/users/').send({
            username: 'testuser',
            firstname: 'Test',
            lastname: 'User',
            email: 'testuser@gmail.com',
            dob: '1995-05-15',
            password: 'Pass@Word123',
            role: 'User',
            country: 'USA',
            defaultCurrency: 'USD',
        })
        expect(userSignup.status).toBe(201)

        const userLoginResponse = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'testuser@gmail.com', password: 'Pass@Word123' })
        expect(userLoginResponse.status).toBe(200)
        userToken = userLoginResponse.body.data.accessToken
        userId = userLoginResponse.body.data._id
    })

    it('should create a budget (POST /budget/:id/)', async () => {
        const response = await request(app)
            .post(`/api/v1/budget/${userId}/`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                amount: 500,
                period: 'monthly',
                startDate: '2025-04-01',
                endDate: '2025-04-30',
                tags: ['groceries', 'food'],
            })
        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        budgetId = response.body.data._id
    })

    it('should get all budgets for the user (GET /budget/:id/)', async () => {
        const response = await request(app)
            .get(`/api/v1/budget/${userId}/`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    it('should get a specific budget by ID (GET /budget/:id/:budgetId)', async () => {
        const response = await request(app)
            .get(`/api/v1/budget/${userId}/${budgetId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data._id).toBe(budgetId)
    })

    it('should update a budget (PUT /budget/:id/:budgetId)', async () => {
        const response = await request(app)
            .put(`/api/v1/budget/${userId}/${budgetId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                amount: 600,
                tags: ['food', 'shopping'],
            })
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.amount).toBe(600)
    })

    it('should delete a budget (DELETE /budget/:id/:budgetId)', async () => {
        const response = await request(app)
            .delete(`/api/v1/budget/${userId}/${budgetId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    afterAll(async () => {
        await User.deleteMany({})
        await Budget.deleteMany({})
        await mongoose.disconnect()
        await server.close()

        cron.getTasks().forEach((task) => task.stop())
    })
})
