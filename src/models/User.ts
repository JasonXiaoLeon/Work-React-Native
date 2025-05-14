const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String },
    age: { type: String },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    isDelete: { type: Number, default: 0 },
    refreshToken: { type: String },
    refreshTokenExpires: { type: Number },
    newPassword: { type: String, default: '' },
    permissionLevel: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const User = models.User || model('User', userSchema, 'users');

module.exports = { User };
