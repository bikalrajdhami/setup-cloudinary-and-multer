const { verifyJWT } = require("../Utils/generateToken");

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const user = await verifyJWT(token);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        req.user = user.id;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = verifyUser;