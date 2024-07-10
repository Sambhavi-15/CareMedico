const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Assuming you have a Patient model
    required: true
  },
  notify: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Assuming you have a Doctor model
        required: true
      },
      problem: {
        type: String,
        required: true
      },
      allergies: {
        type: String
      }
    }
  ]
}, {
  timestamps: true
});

const Notify = mongoose.model('Notify', notificationSchema);

module.exports = Notify;
