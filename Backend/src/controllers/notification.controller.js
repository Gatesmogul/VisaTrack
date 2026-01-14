
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export async function getMyNotifications(req, res) {
  const user = await User.findOne({ authUserId: req.user.uid });
  if (!user) return res.status(404).json({ message: "User not found" });

  const notifications = await Notification.find({
    userId: user._id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
}

export async function markAsRead(req, res) {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
}
