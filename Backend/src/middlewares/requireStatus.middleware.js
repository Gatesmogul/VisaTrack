export const requireStatus = (allowedStatuses) => {
  return (req, res, next) => {
    const userStatus = req.user.dbUser.status;

    if (!allowedStatuses.includes(userStatus)) {
      return res.status(403).json({
        message: "Action not allowed for current user status",
      });
    }

    next();
  };
};
