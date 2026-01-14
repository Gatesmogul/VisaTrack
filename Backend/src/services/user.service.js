import User from "../models/User.js";

export async function createOrUpdateUser(data) {
  return await User.findOneAndUpdate(
    { authUserId: data.authUserId },
    data,
    { upsert: true, new: true }
  );
}

export async function getUserByAuthId(authUserId) {
  return await User.findOne({ authUserId });
}
