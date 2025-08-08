// For ES Modules (if using import)
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, metadata = {}, return_url } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY in environment");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    });

    // Validate amount
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Delivery Service",
            },
            unit_amount: Math.round(amount * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        return_url ||
        ${process.env.FRONTEND_URL}/instant-quote/form?payment_success=true,
      cancel_url: ${process.env.FRONTEND_URL}/instant-quote/form,
      metadata: {
        ...metadata,
        serviceType: "delivery",
      },
    });

    // Save the session and form data to your database here if needed
    // await saveToDatabase(session.id, metadata);

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
};
