exports.ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.direct('/login');
};