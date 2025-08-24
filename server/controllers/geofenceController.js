const { College } = require('../models');

const getGeofence = async (req, res) => {
    try {
        const college = await College.findOne({
            where: { id: req.user.collegeId },
            attributes: ['geoLatitude', 'geoLongitude', 'geoRadius']
        });
        if (!college) {
            return res.status(404).json({ message: 'College not found.' });
        }
        res.status(200).json(college);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const setGeofence = async (req, res) => {
    const { latitude, longitude, radius } = req.body;

    if (latitude === undefined || longitude === undefined || radius === undefined) {
        return res.status(400).json({ message: 'Latitude, longitude, and radius are required.' });
    }

    try {
        const college = await College.findByPk(req.user.collegeId);
        if (!college) {
            return res.status(404).json({ message: 'College not found.' });
        }

        college.geoLatitude = latitude;
        college.geoLongitude = longitude;
        college.geoRadius = radius;
        await college.save();

        res.status(200).json({ message: 'Geofence updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getGeofence, setGeofence };