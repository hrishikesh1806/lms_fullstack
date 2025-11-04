import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ManualUser", // ✅ changed from "User"
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "stripe",
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite error during hot reload
const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export { Purchase };
