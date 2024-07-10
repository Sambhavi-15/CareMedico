const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Assuming you have a Patient model
    required: true
  },
  history: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Assuming you have a Doctor model
        required: true
      },
      problem: {
        type: String,
        required: true
      },
      allergies: {
        type: String
      },
      status: {
        type: String,
        enum: ['accept', 'reject'],
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

const History = mongoose.model('History', historySchema);

module.exports = History;
