import request from 'supertest'
import mongoose from 'mongoose'
import cron from 'node-cron'
import { app, server } from '../../app.js'
import User from '../../src/models/user.model.js'
import Category from '../../src/models/category.model.js'
import Transaction from '../../src/models/transaction.model.js'

describe('Transaction API Endpoints', () => {
    let adminToken
    let userToken
    let userId
    let categoryId
    let transactionId

    beforeAll(async () => {
        const adminSignup = await request(app).post('/api/v1/users/').send({
            username: 'adminuser',
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@gmail.com',
            dob: '1990-02-17',
            password: 'Pass@Word123',
            role: 'Admin',
            country: 'USA',
            defaultCurrency: 'USD',
        })
        expect(adminSignup.status).toBe(201)

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

        const adminLoginResponse = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'admin@gmail.com', password: 'Pass@Word123' })
        expect(adminLoginResponse.status).toBe(200)
        adminToken = adminLoginResponse.body.data.accessToken

        const userLoginResponse = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'testuser@gmail.com', password: 'Pass@Word123' })
        expect(userLoginResponse.status).toBe(200)
        userToken = userLoginResponse.body.data.accessToken
        userId = userLoginResponse.body.data._id

        const categoryResponse = await request(app)
            .post('/api/v1/category')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Groceries',
                description: 'Grocery-related',
            })
        expect(categoryResponse.status).toBe(201)
        categoryId = categoryResponse.body.data._id
    })

    it('should create a transaction (POST /transaction/:id/)', async () => {
        const response = await request(app)
            .post(`/api/v1/transaction/${userId}/`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                category: categoryId,
                amount: 100.5,
                date: '2025-03-11',
                description: 'Grocery shopping',
                type: 'income',
            })
        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        transactionId = response.body.data._id
    })

    it('should get transactions of the authenticated user (GET /transaction/:id/)', async () => {
        const response = await request(app)
            .get(`/api/v1/transaction/${userId}/`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    it('should get a transaction by its ID (GET /transaction/:id/:transactionId)', async () => {
        const response = await request(app)
            .get(`/api/v1/transaction/${userId}/${transactionId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data._id).toBe(transactionId)
    })

    it('should update a transaction (PUT /transaction/:id/:transactionId)', async () => {
        const response = await request(app)
            .put(`/api/v1/transaction/${userId}/${transactionId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                amount: 150.75,
                description: 'Updated grocery shopping',
            })
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.amount).toBe(150.75)
    })

    it('should delete a transaction (DELETE /transaction/:id/:transactionId)', async () => {
        const response = await request(app)
            .delete(`/api/v1/transaction/${userId}/${transactionId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    it('should allow only Admin to get all user transactions (GET /transaction/)', async () => {
        const response = await request(app)
            .get('/api/v1/transaction/')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    it('should not allow normal users to get all transactions (GET /transaction/)', async () => {
        const response = await request(app)
            .get('/api/v1/transaction/')
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(401) // Forbidden
    })

    afterAll(async () => {
        await User.deleteMany({})
        await Category.deleteMany({})
        await Transaction.deleteMany({})
        await mongoose.disconnect()
        await server.close()

        cron.getTasks().forEach((task) => task.stop())
    })
})
