const express = require('express');
const create_new_user = require('../controller/registerController');
const upload = require('../middlewares/multer');
const authTokenMiddleware = require('../middlewares/authTokenMiddleware');
const route = express.Router();

//Create new user...
// Path: /api/v1/user/register
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - fullname
 *              - email
 *              - password
 *              - phonenumber
 *              - gender
 *              - country
 *          properties:
 *              fullname:
 *                  type: string
 *                  description: User's full name
 *              email:
 *                  type: string
 *                  description: User's email address
 *              password:
 *                  type: string
 *                  description: User's password
 *              phonenumber:
 *                  type: string
 *                  description: User's phone number
 *              gender:
 *                  type: string
 *                  enum: [male, female, other]
 *                  description: User's gender
 *              preference:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: User's preference
 *      UserResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  description: The status of the response
 *              message:
 *                  type: string
 *                  description: A message describing the result
 */

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */

route.post('/register', upload.single("profileimage"), create_new_user);

//Login a User...
//Path: /api/v1/user/login
route.post('/login', require('../controller/loginController'));

//Get user profile detials...
//Path: /api/v1/user/profile
route.get('/profile', authTokenMiddleware, require('../controller/userProfileController'));

//Delete user...
//Path: /api/v1/user/delete
route.delete('/delete', authTokenMiddleware, require('../controller/userProfileDeleteController'));

//Update user...
//Path: /api/v1/user/update
route.patch('/update', authTokenMiddleware, upload.single("profileimage"), require('../controller/updateProfileController'));

module.exports = route;