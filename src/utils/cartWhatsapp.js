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

export function openCartOrderPrintPreview(cartItems, subtotal, discount, deliveryCharge, total) {
  const win = window.open('', '_blank');
  if (!win) return;

  const rows = cartItems.map((item) => {
    const price = item.offer_price || item.normal_price || item.price || 0;
    const line = `
      <tr>
        <td>${item.name}${item.product_code ? ` <small style="color:#6b7280">(Code: ${item.product_code})</small>` : ''}</td>
        <td style="text-align:center;">${item.quantity}</td>
        <td style="text-align:right;">₹${price.toFixed(2)}</td>
        <td style="text-align:right;">₹${(price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
    const combo = item.is_combo && item.combo_products ? item.combo_products.map(p => `
      <tr>
        <td style="padding-left:16px;color:#6b7280;">└─ ${p.name}${p.product_code ? ` <small>(Code: ${p.product_code})</small>` : ''}</td>
        <td style="text-align:center;color:#6b7280;">${p.quantity}</td>
        <td style="text-align:right;color:#6b7280;">—</td>
        <td style="text-align:right;color:#6b7280;">—</td>
      </tr>
    `).join('') : '';
    return line + combo;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Summary</title>
        <style>
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111827; padding:24px; }
          .card { max-width: 800px; margin: 0 auto; border:1px solid #e5e7eb; border-radius:12px; padding:24px; }
          h1 { font-size:20px; margin:0 0 16px; }
          table { width:100%; border-collapse: collapse; }
          th, td { padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; }
          th { text-align:left; background:#f9fafb; }
          .totals td { border:none; padding:6px 12px; }
          .right { text-align:right; }
          .muted { color:#6b7280; }
          .summary { margin-top:16px; }
          .footer { margin-top:24px; font-size:12px; color:#6b7280; }
          @media print { .no-print { display:none; } .card { border:none; padding:0; } }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Order Summary</h1>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align:center;">Qty</th>
                <th class="right">Price</th>
                <th class="right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <table class="summary" style="width:100%;">
            <tbody class="totals">
              <tr>
                <td class="right muted">Subtotal</td>
                <td class="right" style="width:160px;">₹${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="right muted">Discount (10%)</td>
                <td class="right">-₹${discount.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="right muted">Delivery Charge</td>
                <td class="right">${deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td class="right" style="font-weight:700;">Total</td>
                <td class="right" style="font-weight:700;">₹${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">Generated by Ovees • Save as PDF via your browser's Print dialog.</div>
          <div class="no-print" style="margin-top:16px;">
            <button onclick="window.print()" style="padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#111827;color:white;">Print / Save as PDF</button>
          </div>
        </div>
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => { try { window.print(); } catch(e) {} }, 200);
          });
        </script>
      </body>
    </html>
  `;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
