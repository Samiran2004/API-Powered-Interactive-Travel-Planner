"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../src/models/userModel"));
const authenticateToken = async (req, res, next) => {
    try {
        const accessToken = req.cookies['accessToken'];
        // Check if access token is present
        if (!accessToken) {
            return res.status(401).send({
                status: 'Unauthorized',
                message: "Access token not found."
            });
        }
        // Verify the access token
        jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET, async (err, user) => {
            if (err) {
                // If token has expired, handle it
                if (err.name === 'TokenExpiredError') {
                    try {
                        const userData = await userModel_1.default.findById(user._id);
                        if (!userData || !userData.refreshtoken) {
                            return res.status(403).send({
                                status: 'Forbidden',
                                message: "Refresh token not found, please login again."
                            });
                        }
                        // Verify the refresh token
                        jsonwebtoken_1.default.verify(userData.refreshtoken, process.env.JWT_REFRESH_SECRET, (err, decodedRefreshToken) => {
                            if (err) {
                                return res.status(403).send({
                                    status: 'Forbidden',
                                    message: "Invalid refresh token, please login again."
                                });
                            }
                            // Generate new access token
                            const newUserPayload = {
                                fullname: userData.fullname,
                                email: userData.email,
                                username: userData.username,
                                gender: userData.gender,
                                _id: userData._id,
                                profilepicture: userData.profilepicture
                            };
                            const newAccessToken = jsonwebtoken_1.default.sign(newUserPayload, process.env.JWT_ACCESS_SECRET, {
                                expiresIn: '1h'
                            });
                            // Set new access token in cookies
                            res.cookie('accessToken', newAccessToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'Strict'
                            });
                            req.user = decodedRefreshToken; // Proceed with the refresh token
                            next();
                        });
                    }
                    catch (error) {
                        return res.status(500).send({
                            status: 'Error',
                            message: "Error while fetching refresh token."
                        });
                    }
                }
                else {
                    return res.status(403).send({
                        status: 'Forbidden',
                        message: 'Invalid or expired access token.'
                    });
                }
            }
            else {
                // Token is valid, proceed with the user
                req.user = user;
                next();
            }
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'Error',
            message: "Internal Server Error."
        });
    }
};
exports.default = authenticateToken;
