import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        unreadCounts: { type: Map, of: Number, default: {} },
    },
    { timestamps: true }
);

const conversationModel = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default conversationModel;
