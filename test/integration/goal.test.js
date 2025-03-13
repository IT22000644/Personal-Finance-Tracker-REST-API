import request from 'supertest'
import mongoose from 'mongoose'
import cron from 'node-cron'
import { app, server } from '../../app.js'
import User from '../../src/models/user.model.js'
import Category from '../../src/models/category.model.js'
import Goal from '../../src/models/goal.model.js'

describe('Goal API Endpoints', () => {
    let adminToken
    let userToken
    let userId
    let categoryId
    let goalId

    beforeAll(async () => {
        const adminSignup = await request(app).post('/api/v1/users/').send({
            username: 'adminuser',
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@gmail.com',
            dob: '1990-01-01',
            password: 'Pass@Word123',
            role: 'Admin',
            country: 'USA',
            defaultCurrency: 'USD',
        })
        expect(adminSignup.status).toBe(201)

        const adminLoginResponse = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'admin@gmail.com', password: 'Pass@Word123' })
        expect(adminLoginResponse.status).toBe(200)
        adminToken = adminLoginResponse.body.data.accessToken

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

        const categoryResponse = await request(app)
            .post('/api/v1/category')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Savings' })
        expect(categoryResponse.status).toBe(201)
        categoryId = categoryResponse.body.data._id
    })

    it('should create a goal (POST /goal/:id/)', async () => {
        const response = await request(app)
            .post(`/api/v1/goal/${userId}/`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: 'Test Goal',
                category: categoryId,
                targetAmount: 2000,
                targetDate: '2025-12-31',
                description: 'Save for vacation',
                tags: ['vacation', 'travel'],
            })

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        goalId = response.body.data._id
    })

    it('should get a specific goal by ID (GET /goal/:id/:goalId)', async () => {
        const response = await request(app)
            .get(`/api/v1/goal/${userId}/${goalId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data._id).toBe(goalId)
    })

    it('should update a goal (PUT /goal/:id/:goalId)', async () => {
        const response = await request(app)
            .put(`/api/v1/goal/${userId}/${goalId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                targetAmount: 3000,
                tags: ['vacation', 'savings'],
            })
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.targetAmount).toBe(3000)
    })

    it('should delete a goal (DELETE /goal/:id/:goalId)', async () => {
        const response = await request(app)
            .delete(`/api/v1/goal/${userId}/${goalId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    afterAll(async () => {
        await User.deleteMany({})
        await Category.deleteMany({})
        await Goal.deleteMany({})
        await mongoose.disconnect()
        await server.close()

        cron.getTasks().forEach((task) => task.stop())
    })
})
