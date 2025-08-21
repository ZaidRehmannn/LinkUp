import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["like", "comment", "follow"], required: true },
        message: { type: String, required: true },
        postId: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const notificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default notificationModel;
