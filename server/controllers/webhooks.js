import Stripe from "stripe";
import { Webhook } from "svix";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------- Clerk webhook ----------
export const clerkWebhooks = async (req, res) => {
    try {
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            throw new Error("CLERK_WEBHOOK_SECRET is not set");
        }

        const payload = Buffer.isBuffer(req.body)
            ? req.body.toString("utf8")
            : typeof req.body === "string"
                ? req.body
                : JSON.stringify(req.body);

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Throws if the signature is invalid
        wh.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        // Parse the verified payload ourselves
        const { type, data } = JSON.parse(payload);

        if (type === "user.created" || type === "user.updated") {
            await User.findByIdAndUpdate(
                data.id,
                {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "User",
                    imageUrl: data.image_url || "https://img.clerk.com/preview.png",
                },
                { upsert: true, new: true }
            );
        } else if (type === "user.deleted") {
            await User.findByIdAndDelete(data.id);
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Clerk webhook error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

// ---------- Stripe webhook ----------
export const stripeWebhooks = async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                console.error("No session data found for payment intent:", paymentIntentId);
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);

            if (!purchaseData) {
                console.error("No purchase found for ID:", purchaseId);
                return;
            }

            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            if (!userData || !courseData) {
                console.error("User or Course not found");
                return;
            }

            courseData.enrolledStudents.push(userData._id);
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            purchaseData.status = "completed";
            await purchaseData.save();
        } catch (error) {
            console.error("Error handling payment success:", error);
        }
    };

    const handlePaymentFailed = async (paymentIntent) => {
        try {
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                console.error("No session data found for failed payment intent:", paymentIntentId);
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);

            if (!purchaseData) {
                console.error("No purchase found for ID:", purchaseId);
                return;
            }

            purchaseData.status = "failed";
            await purchaseData.save();
        } catch (error) {
            console.error("Error handling payment failure:", error);
        }
    };

    switch (event.type) {
        case "payment_intent.succeeded":
            await handlePaymentSuccess(event.data.object);
            break;

        case "payment_intent.payment_failed":
            await handlePaymentFailed(event.data.object);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
};