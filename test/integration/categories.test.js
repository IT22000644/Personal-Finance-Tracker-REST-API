import request from 'supertest'
import mongoose from 'mongoose'
import cron from 'node-cron'
import { app, server } from '../../app.js'
import User from '../../src/models/user.model.js'
import Category from '../../src/models/category.model.js'

describe('Category API Endpoints', () => {
    let adminToken
    let categoryId

    beforeAll(async () => {
        await request(app).post('/api/v1/users/').send({
            username: 'adminuser',
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@gmail.com',
            dob: '1990-02-17',
            password: 'P@assword123',
            role: 'Admin',
            country: 'USA',
            defaultCurrency: 'USD',
        })

        const loginResponse = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'admin@gmail.com', password: 'P@assword123' })

        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body.data.accessToken).toBeDefined()

        adminToken = loginResponse.body.data.accessToken
    })

    it('should create a new category (POST /category)', async () => {
        const response = await request(app)
            .post('/api/v1/category')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Groceries',
                description: 'Category for grocery expenses',
            })

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.data.name).toBe('Groceries')

        categoryId = response.body.data._id
    })

    it('should retrieve a category by ID (GET /category/:id)', async () => {
        const response = await request(app)
            .get(`/api/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data._id).toBe(categoryId)
    })

    it('should get all categories (GET /category/)', async () => {
        const response = await request(app)
            .get('/api/v1/category/')
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should update a category (PUT /category/:id)', async () => {
        const response = await request(app)
            .put(`/api/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Updated-Groceries',
                description: 'Updated category description',
            })

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.name).toBe('Updated-Groceries')
    })

    it('should delete a category (DELETE /category/:id)', async () => {
        const response = await request(app)
            .delete(`/api/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    it('should prevent non-admin users from creating a category', async () => {
        const userResponse = await request(app).post('/api/v1/users/').send({
            username: 'testuser',
            firstname: 'Test',
            lastname: 'User',
            email: 'testuser@gmail.com',
            dob: '1995-05-15',
            password: 'P@assword123',
            role: 'User',
            country: 'USA',
            defaultCurrency: 'USD',
        })

        expect(userResponse.status).toBe(201)

        const loginResponse = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'testuser@gmail.com', password: 'P@assword123' })

        expect(loginResponse.status).toBe(200)

        const userToken = loginResponse.body.data.accessToken

        const response = await request(app)
            .post('/api/v1/category')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Unauthorized Category',
                description: 'This should not be allowed',
            })

        expect(response.status).toBe(401)
    })

    afterAll(async () => {
        await User.deleteMany({})
        await Category.deleteMany({})
        await mongoose.disconnect()
        await server.close()

        cron.getTasks().forEach((task) => task.stop())
    })
})
