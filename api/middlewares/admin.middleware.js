export const isAdmin = (req, res, next) => {
    try {
        const role = req.user.role;

        if (!role || role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next(); // Call next to pass control to the next middleware/route handler
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
