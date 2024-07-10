const express = require('express');
const router = express.Router();
const { User, Doctor, Patient } = require('../models/User');

// Route for user signup
router.post('/signup', async (req, res) => {
    const { email, name, password, userType, specialization, education, age, address, gender } = req.body;

    try {
        let user;
        if (userType === 'Doctor') {
            user = new Doctor({ email, name, password, userType, specialization, education, age, gender });
        } else if (userType === 'Patient') {
            user = new Patient({ email, name, password, userType, age, address, gender });
        } else {
            return res.status(400).json({ error: 'Invalid user type' });
        }

        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/userinfo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch specializations for doctors only
router.get('/form/specializations', async (req, res) => {
   // console.log("uioiu")
    try {
        const doctors = await User.find({ userType: 'Doctor' });
console.log(doctors)
        const specializationsSet = new Set();
        doctors.forEach(doctor => {
            if (doctor.specialization) {
                specializationsSet.add(doctor.specialization);
            }
        });

        const specializations = Array.from(specializationsSet);
        res.json(specializations);
    } catch (err) {
        console.error('Error fetching specializations:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/form/doctors/:specialization', async (req, res) => {
    try {
        const specialization = req.params.specialization;

        // Log the specialization being searched for
        console.log(`Fetching doctors with specialization: ${specialization}`);

        // Query to find doctors with the specified specialization
        const doctors = await User.find({ userType: 'Doctor', specialization: specialization });

        // Check if any doctors were found
        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found with the specified specialization' });
        }

        res.json(doctors);
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
