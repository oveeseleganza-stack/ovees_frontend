// WhatsApp order utility for cart checkouts

export function sendCartOrderViaWhatsapp(cartItems, subtotal, discount, deliveryCharge, total) {
  if (cartItems.length === 0) return;

  // Build order message
  let message = `*Order Details*\n\n`;
  message += `*Items:*\n`;
  cartItems.forEach((item) => {
    const price = item.offer_price || item.normal_price || item.price || 0;
    let itemLine = `• ${item.name}`;
    if (item.product_code) {
      itemLine += ` (Code: ${item.product_code})`;
    }
    message += `${itemLine}\n`;
    message += `  Qty: ${item.quantity} × ₹${price.toFixed(2)} = ₹${(price * item.quantity).toFixed(2)}\n`;
    if (item.is_combo && item.combo_products) {
      item.combo_products.forEach((p) => {
        message += `  └─ ${p.name} (x${p.quantity})`;
        if (p.product_code) {
          message += ` (Code: ${p.product_code})`;
        }
        message += `\n`;
      });
    }
  });
  message += `\n*Price Summary:*\n`;
  message += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
  message += `Discount (10%): -₹${discount.toFixed(2)}\n`;
  message += `Delivery Charge: ${deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}\n`;
  message += `*Total: ₹${total.toFixed(2)}*\n\n`;
  message += `Please confirm this order. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/918129690147?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}
