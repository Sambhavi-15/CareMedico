const mongoose = require('mongoose');
const { Schema } = mongoose;

// Base User Schema
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, required: true, enum: ['Doctor', 'Patient'] }
}, { discriminatorKey: 'userType', collection: 'users' });

// Discriminator schemas for Doctor and Patient
const doctorSchema = new Schema({
    specialization: { type: String, required: true },
    education: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true }
});

const patientSchema = new Schema({
    age: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
const Doctor = User.discriminator('Doctor', doctorSchema);
const Patient = User.discriminator('Patient', patientSchema);

module.exports = { User, Doctor, Patient };
