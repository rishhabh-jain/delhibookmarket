export async function sendCartToWooCommerce(
  cartItems: { product_id: number; quantity: number }[]
) {
  const response = await fetch(
    "https://delhibookmarket.com/wp-json/custom/v1/cart-sync",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // important for cookie-based cart session
      body: JSON.stringify({ cart: cartItems }),
    }
  );

  const data = await response.json();

  return data;
}
