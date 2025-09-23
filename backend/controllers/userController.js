import User from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const Users = await User.find({});
        res.json(Users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};