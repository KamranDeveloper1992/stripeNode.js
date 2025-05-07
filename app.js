const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.stripeKey);

app.use(bodyParser.json());

const products = {
  phone: { name: "Telefon", price: 30000 },
  watch: { name: "Saat", price: 12000 },
};

app.get("/", (req, res) => {
  res.send("Stripe Express Server işləyir!");
});

app.get("/pay", async (req, res) => {
  const selectedProduct = products["phone"];

  if (!selectedProduct) {
    return res.status(400).json({ error: "Məhsul tapılmadı" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "azn",
            product_data: {
              name: selectedProduct.name,
            },

            unit_amount: selectedProduct.price,
          },

          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.redirect(session.url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} ünvanında işləyir`);
});
