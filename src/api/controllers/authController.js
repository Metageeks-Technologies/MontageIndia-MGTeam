const bcrypt = require('bcryptjs');
const User = require('../Model/User');

exports.signup = async (req, res) => {
    const { email, password, role } = req.body;
    console.log('Received signup request with data:', { email, password, role });

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
            role: role || 'user',
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Error during user signup:', err.message);
        res.status(500).send('Server error');
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request with data:', { email, password });

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }


        const token = 'generate or retrieve your session token here';  

        res.json({ msg: 'Login successful', token });
    } catch (err) {
        console.error('Error during user login:', err.message);
        res.status(500).send('Server error');
    }
};
