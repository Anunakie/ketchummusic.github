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
    const { session_id } = JSON.parse(event.body);

    if (!session_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing session_id" }),
      };
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify payment was successful
    if (session.payment_status === "paid") {
      const pdfFilename = session.metadata.pdf_filename;
      const productName = session.metadata.product_name;

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: true,
          product_name: productName,
          download_url: `/assets/sheet-music/${pdfFilename}`,
        }),
      };
    } else {
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          error: "Payment has not been completed",
        }),
      };
    }
  } catch (error) {
    console.error("Verify download error:", error.message);

    // Handle specific Stripe errors
    if (error.type === "StripeInvalidRequestError") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid session ID" }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to verify payment" }),
    };
  }
};
