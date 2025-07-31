export async function sendCartToWooCommerce(
  cartItems: { product_id: number; quantity: number }[]
) {
  // Get or generate a unique session ID
  let wooSessionId = localStorage.getItem("woo_session_id");
  if (!wooSessionId) {
    wooSessionId = crypto.randomUUID();
    localStorage.setItem("woo_session_id", wooSessionId);
  }

  const response = await fetch(
    "https://delhibookmarket.com/wp-json/custom/v1/cart-sync",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-woo-session": wooSessionId,
      },
      body: JSON.stringify({ products: cartItems }),
    }
  );

  const data = await response.json();

  return data;
}
