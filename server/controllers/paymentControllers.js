import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, metadata = {}, return_url } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Delivery Service",
            },
            unit_amount: Math.round(amount * 100), // GBP to pence
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        return_url ||
        `${process.env.FRONTEND_URL}/instant-quote/form?payment_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/instant-quote/form`,
      metadata: {
        ...metadata,
        serviceType: "delivery",
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
};
