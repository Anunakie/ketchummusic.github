const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { name, price, pdf } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !price || !pdf) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: name, price, pdf" }),
      };
    }

    // Debug: check if Stripe key is loaded
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }),
      };
    }

    // Determine the site origin for redirect URLs
    const origin = event.headers.origin || event.headers.referer || "https://ketchum-music.com";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Sheet Music: ${name}`,
              description: `Digital PDF sheet music for "${name}" by Daniel Ketchum`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        pdf_filename: pdf,
        product_name: name,
      },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/sheet-music.html`,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to create checkout session",
        detail: error.message,
        type: error.type || "unknown"
      }),
    };
  }
};
