import mongoose from "mongoose";
import Stripe from "stripe";

import ManualUser from "../models/Usermodel.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

/* ==========================================================
   ⚙️ Initialize Stripe Instance
   ========================================================== */
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/* ==========================================================
   🟢 Clerk Webhook (Disabled — Using JWT Auth Only)
   ========================================================== */
export const clerkWebhooks = async (req, res) => {
  res.json({
    success: true,
    message: "✅ Clerk webhooks disabled — JWT-based auth in use",
  });
};

/* ==========================================================
   💳 Stripe Webhook — Handle Payment Confirmation
   ========================================================== */
export const stripeWebhooks = async (req, res) => {
  if (!stripe) {
    console.error("❌ Stripe not initialized. Missing STRIPE_SECRET_KEY.");
    return res.status(500).send("Stripe not initialized");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ✅ Verify Stripe Signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      /* ==========================================================
         ✅ Payment Success — Enroll User in Course
         ========================================================== */
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Retrieve checkout session (to get metadata)
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        const session = sessions.data[0];
        if (!session) {
          console.warn("⚠️ No checkout session found for payment intent:", paymentIntentId);
          break;
        }

        const { purchaseId } = session.metadata || {};
        if (!purchaseId) {
          console.warn("⚠️ Missing purchaseId in metadata.");
          break;
        }

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
          console.warn("⚠️ Purchase not found:", purchaseId);
          break;
        }

        // ✅ Fetch user & course
        const user = await ManualUser.findById(purchase.userId);
        const course = await Course.findById(purchase.courseId);

        if (!user || !course) {
          console.warn("⚠️ Missing user or course:", {
            userFound: !!user,
            courseFound: !!course,
          });
          break;
        }

        // ✅ Enroll user to course
        if (!course.enrolledStudents.includes(user._id)) {
          course.enrolledStudents.push(user._id);
          await course.save();
        }

        // ✅ Add course to user's enrolled list
        if (!user.enrolledCourses.includes(course._id)) {
          user.enrolledCourses.push(course._id);
          await user.save();
        }

        // ✅ Mark purchase completed
        purchase.status = "completed";
        await purchase.save();

        console.log(`✅ Payment successful — ${user.email} enrolled in "${course.courseTitle}"`);
        break;
      }

      /* ==========================================================
         ❌ Payment Failed
         ========================================================== */
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        const session = sessions.data[0];
        const { purchaseId } = session?.metadata || {};

        if (!purchaseId) break;

        const purchase = await Purchase.findById(purchaseId);
        if (purchase) {
          purchase.status = "failed";
          await purchase.save();
        }

        console.warn(`⚠️ Payment failed for purchase: ${purchaseId}`);
        break;
      }

      /* ==========================================================
         🟡 Default — Unhandled Stripe Event
         ========================================================== */
      default:
        console.log(`ℹ️ Unhandled Stripe event: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Stripe Webhook Handling Error:", err.message);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};
