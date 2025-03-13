import request from 'supertest'
import mongoose from 'mongoose'
import cron from 'node-cron'
import { app, server } from '../../app.js'
import User from '../../src/models/user.model.js'

describe('User Signup and Login API Endpoints', () => {
    let userToken

    it('should create a new user (POST /users)', async () => {
        const response = await request(app).post('/api/v1/users/').send({
            username: 'anotheruser',
            firstname: 'Another',
            lastname: 'User',
            email: 'anotheruser@gmail.com',
            dob: '2000-02-17',
            password: 'P@assword123',
            role: 'User',
            country: 'USA',
            defaultCurrency: 'USD',
        })

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.data.email).toBe('anotheruser@gmail.com')
    })

    it('should allow login for a regular user (POST /users/auth/login)', async () => {
        const response = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'anotheruser@gmail.com', password: 'P@assword123' })

        userToken = response.body.data.accessToken

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.accessToken).toBeDefined()
    })

    it('should return error for invalid credentials (POST /users/auth/login)', async () => {
        const response = await request(app)
            .post('/api/v1/users/auth/login')
            .send({ email: 'nonexistent@gmail.com', password: 'wrongpassword' })

        expect(response.status).toBe(404)
        expect(response.body.message).toBe('Invalid user email or password')
    })

    it('should allow access to regular user for protected routes', async () => {
        const response = await request(app)
            .get('/api/v1/users')
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(401)
    })

    it('should return validation errors if required fields are missing (POST /users)', async () => {
        const response = await request(app).post('/api/v1/users/').send({
            username: 'newuser',
            email: 'newuser@gmail.com',
            password: 'password123',
        })

        expect(response.status).toBe(400)
    })

    it('should prevent duplicate email signup (POST /users)', async () => {
        const response = await request(app).post('/api/v1/users/').send({
            username: 'duplicateuser',
            firstname: 'Duplicate',
            lastname: 'User',
            email: 'anotheruser@gmail.com', // Existing email
            dob: '2001-02-17',
            password: 'P@assword123',
            role: 'User',
            country: 'USA',
            defaultCurrency: 'USD',
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('The email is already registered')
    })

    afterAll(async () => {
        await User.deleteMany({})
        cron.getTasks().forEach((task) => task.stop())
        await mongoose.disconnect()
        await server.close()
    })
})
