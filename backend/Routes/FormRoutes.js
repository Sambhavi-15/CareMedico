const express = require('express');
const router = express.Router();
const Notify = require('../models/Notification'); // Make sure the path is correct
const History = require('../models/History'); 
// Route to handle form submission
router.post('/form/submit', async (req, res) => {
  try {
    const { patientId, date, doctorId, problem, allergies } = req.body;

    // Create a new history entry
    const newHistoryEntry = {
      date,
      patientId,
      problem,
      allergies,
    };
console.log(newHistoryEntry)
    // Find the patient's history or create a new one
    let historyRecord = await Notify.findOne({ doctorId });

    if (historyRecord) {
      // Add new entry to existing history
      historyRecord.notify.push(newHistoryEntry);
    } else {
      // Create a new history record
      historyRecord = new Notify({
        doctorId,
        notify: [newHistoryEntry],
      });
    }

    // Save the history record
    await historyRecord.save();

    res.status(200).json({ message: 'History saved successfully' });
  } catch (err) {
    console.error('Error saving history:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/notifications/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;
  console.log(doctorId)
  try {
    const notificationDoc = await Notify.findOne({ doctorId });
console.log(notificationDoc)
    if (!notificationDoc) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    if (notificationDoc.notify.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.json(notificationDoc.notify);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/notifications/accept/:notificationId', async (req, res) => {
  const { notificationId } = req.params;

  try {
    // Find the notification
    const notifyDoc = await Notify.findOne({ "notify._id": notificationId });
    if (!notifyDoc) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Find the specific notification in the notify array
    const notification = notifyDoc.notify.id(notificationId);

    // Create a new history entry with status accept
    const newHistory = {
      patientId: notification.patientId,
      history: {
        date: notification.date,
        doctorId: notifyDoc.doctorId,
        problem: notification.problem,
        allergies: notification.allergies,
        status: 'accept'
      }
    };

    await History.updateOne(
      { patientId: notification.patientId },
      { $push: { history: newHistory.history } },
      { upsert: true }
    );

    // Remove the notification from the Notify collection
    await Notify.updateOne(
      { "notify._id": notificationId },
      { $pull: { notify: { _id: notificationId } } }
    );

    res.json({ message: 'Notification accepted and moved to history' });
  } catch (error) {
    console.error('Error accepting notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject notification
router.post('/notifications/reject/:notificationId', async (req, res) => {
  const { notificationId } = req.params;

  try {
    // Find the notification
    const notifyDoc = await Notify.findOne({ "notify._id": notificationId });
    if (!notifyDoc) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Find the specific notification in the notify array
    const notification = notifyDoc.notify.id(notificationId);

    // Create a new history entry with status reject
    const newHistory = {
      patientId: notification.patientId,
      history: {
        date: notification.date,
        doctorId: notifyDoc.doctorId,
        problem: notification.problem,
        allergies: notification.allergies,
        status: 'reject'
      }
    };

    await History.updateOne(
      { patientId: notification.patientId },
      { $push: { history: newHistory.history } },
      { upsert: true }
    );

    // Remove the notification from the Notify collection
    await Notify.updateOne(
      { "notify._id": notificationId },
      { $pull: { notify: { _id: notificationId } } }
    );

    res.json({ message: 'Notification rejected and moved to history' });
  } catch (error) {
    console.error('Error rejecting notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/history/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const history = await History.findOne({ patientId }).populate('history.doctorId', 'name');
    if (!history) {
      return res.status(404).json({ message: 'No history found for this patient' });
    }
    res.json(history);
  } catch (error) {
    console.error('Error fetching patient history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
