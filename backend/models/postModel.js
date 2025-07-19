import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        caption: { type: String, default: "" },
        image: { type: String, default: "" },
        video: { type: String, default: "" },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        commentCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const postModel = mongoose.models.Post || mongoose.model("Post", postSchema);

export default postModel;
