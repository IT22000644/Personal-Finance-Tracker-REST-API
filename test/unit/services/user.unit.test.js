import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { jest } from '@jest/globals'
import mockingoose from 'mockingoose'
import User from '../../../src/models/user.model.js'
import * as userService from '../../../src/services/user.services.js'
import ServerError from '../../../src/errors/exception.js'
import {
    HTTP_RESPONSE_CODE,
    APP_ERROR_MESSAGE,
} from '../../../src/config/constants.js'

// Mock dependencies
jest.mock('bcrypt', () => ({
    genSalt: jest.fn(() => Promise.resolve('salt')),
    hash: jest.fn(() => Promise.resolve('hashedPassword')),
    compare: jest.fn(() => Promise.resolve(true)),
}))
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockAccessToken'),
    verify: jest.fn(() => ({ _id: 'user123' })),
}))

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks() // Clear mocks after each test
        mockingoose.resetAll() // Reset all mockingoose mocks after each test
    })

    describe('create', () => {
        it('should create a new user when email does not exist', async () => {
            const mockUserData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                username: 'johndoe',
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                dob: new Date('1990-01-01'),
                password: 'securePassword123',
                joinedOn: new Date('2025-03-06T08:34:17.156Z'),
                role: 'User',
                country: 'USA',
                defaultCurrency: 'USD',
            }

            mockingoose(User).toReturn(null, 'findOne')

            const findOneSpy = jest.spyOn(User, 'findOne')

            bcrypt.genSalt = jest.fn().mockResolvedValue('salt')
            bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword')

            mockingoose(User).toReturn(mockUserData, 'save')

            const createdUser = await userService.create(mockUserData)

            expect(findOneSpy).toHaveBeenCalledWith({
                email: mockUserData.email,
            })
            expect(bcrypt.hash).toHaveBeenCalledWith(
                'securePassword123',
                'salt'
            )
            expect(createdUser.email).toEqual(mockUserData.email)
        })

        it('should throw an error if user already exists', async () => {
            mockingoose(User).toReturn({ email: 'john@example.com' }, 'findOne')

            await expect(
                userService.create({ email: 'john@example.com' })
            ).rejects.toThrow(ServerError)

            expect(User.findOne).toHaveBeenCalledWith({
                email: 'john@example.com',
            })
        })
    })

    describe('authenticate', () => {
        it('should authenticate a valid user', async () => {
            const mockUser = {
                _id: '67c9619255e259b747c5e065',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: 'User',
                username: 'johndoe',
                toJSON: jest.fn().mockReturnValue({
                    email: 'john@example.com',
                    role: 'User',
                }),
            }

            mockingoose(User).toReturn(mockUser, 'findOne')

            // Mock bcrypt.compare
            bcrypt.compare = jest.fn().mockResolvedValue(true)

            // Mock jwt.sign
            jwt.sign = jest.fn().mockReturnValue('mockAccessToken')

            const result = await userService.authenticate({
                email: 'john@example.com',
                password: 'securePassword123',
            })

            // Assertions
            expect(result).toHaveProperty('accessToken')
            expect(result).toHaveProperty('refreshToken')
            expect(User.findOne).toHaveBeenCalledWith({
                email: 'john@example.com',
            })
            expect(bcrypt.compare).toHaveBeenCalledWith(
                'securePassword123',
                'hashedPassword'
            )
        })

        it('should throw an error for an invalid email', async () => {
            mockingoose(User).toReturn(null, 'findOne')

            await expect(
                userService.authenticate({
                    email: 'wrong@example.com',
                    password: 'securePassword123',
                })
            ).rejects.toThrow(ServerError)

            expect(User.findOne).toHaveBeenCalledWith({
                email: 'wrong@example.com',
            })
        })

        it('should throw an error for an incorrect password', async () => {
            const mockUser = {
                email: 'john@example.com',
                password: 'hashedPassword',
            }

            mockingoose(User).toReturn(mockUser, 'findOne')
            bcrypt.compare.mockResolvedValue(false)

            await expect(
                userService.authenticate({
                    email: 'john@example.com',
                    password: 'wrongPassword',
                })
            ).rejects.toThrow(ServerError)
        })
    })

    describe('getUsers', () => {
        it('should return a paginated list of users', async () => {
            const mockUsers = [
                {
                    _id: '67c0c4e10b5ef1b31e8448d8',
                    username: 'john_doe',
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john.doe@example.com',
                    dob: new Date('1990-01-01T00:00:00.000Z').toISOString(),
                    role: 'Admin',
                    country: 'USA',
                    defaultCurrency: 'USD',
                    joinedOn: new Date(
                        '2025-02-27T20:02:30.509Z'
                    ).toISOString(),
                    __v: 0,
                    lastLogin: new Date(
                        '2025-03-03T22:57:04.173Z'
                    ).toISOString(),
                },
                {
                    _id: '67c0c6679644785e758e70ef',
                    username: 'john_doe',
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john.doe2@example.com',
                    dob: new Date('1990-01-01T00:00:00.000Z').toISOString(),
                    role: 'Admin',
                    country: 'USA',
                    defaultCurrency: 'USD',
                    joinedOn: new Date(
                        '2025-02-27T20:06:02.670Z'
                    ).toISOString(),
                    __v: 0,
                    lastLogin: undefined,
                },
            ]

            mockingoose(User).toReturn(mockUsers, 'find')
            mockingoose(User).toReturn(2, 'countDocuments')

            const result = await userService.getUsers(1, 10)

            const normalizedResult = {
                ...result,
                users: result.users.map((user) => ({
                    ...user._doc,
                    _id: user._doc._id.toString(),
                    dob: user._doc.dob
                        ? user._doc.dob.toISOString()
                        : undefined,
                    joinedOn: user._doc.joinedOn
                        ? user._doc.joinedOn.toISOString()
                        : undefined,
                    lastLogin: user._doc.lastLogin
                        ? user._doc.lastLogin.toISOString()
                        : undefined,
                })),
            }

            expect(normalizedResult.users).toEqual(mockUsers)
            expect(normalizedResult.totalPages).toBe(1)
        })
    })

    describe('getUserById', () => {
        beforeEach(() => {
            mockingoose.resetAll()
        })

        it('should return a user by ID', async () => {
            const mockUser = {
                _id: '67c951d2a6df488ed7116e06',
                username: 'johndoe',
                joinedOn: new Date('2025-03-06T07:42:48.294Z'),
                role: 'User',
            }

            mockingoose(User).toReturn(mockUser, 'findOne')
            const result = await userService.getUserById(
                '67c951d2a6df488ed7116e06'
            )

            const normalizedResult = {
                ...result.toObject(),
                _id: result._id.toString(),
            }
            expect(normalizedResult).toEqual(mockUser)
        })
    })
    describe('update', () => {
        it('should update a user', async () => {
            const mockUpdates = { username: 'newUsername' }
            mockingoose(User).toReturn(mockUpdates, 'findOneAndUpdate')

            const result = await userService.update('user123', mockUpdates)

            expect(result.username).toEqual(mockUpdates.username)
        })
    })
})
