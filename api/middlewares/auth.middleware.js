import jwt from 'jsonwebtoken'

export const isAuthenticated = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).send({ message: "Authorization failed." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();

    } catch (error) {
        console.log("auth-middleware-error", error);
        return res.status(400).send({ error: 'Token is invalid.' })
    }
}
