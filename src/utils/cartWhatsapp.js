export function sendCartOrderViaWhatsapp(cartItems, subtotal, discount, deliveryCharge, total) {
  if (cartItems.length === 0) return;

  // Build enhanced order message with better formatting
  let message = `══════════════════════════\n`;
  message += `    📋 *ORDER DETAILS*   \n`;
  message += `══════════════════════════\n\n`;
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `  🛒 *ITEMS ORDERED*     \n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  cartItems.forEach((item, idx) => {
    const price = item.offer_price || item.normal_price || item.price || 0;
    const itemTotal = (price * item.quantity).toFixed(2);
    
    message += `${idx + 1}. *${item.name}*\n`;
    if (item.product_code) {
      message += `   📦 Code: \`${item.product_code}\`\n`;
    }
    message += `   ├─ Quantity: ${item.quantity} × ₹${price.toFixed(2)}\n`;
    message += `   └─ Amount: ₹${itemTotal}\n`;
    
    // Combo products with better indentation
    if (item.is_combo && item.combo_products) {
      message += `   *Combo Includes:*\n`;
      item.combo_products.forEach((p, pIdx) => {
        const isLast = pIdx === item.combo_products.length - 1;
        const prefix = isLast ? '      └─' : '      ├─';
        message += `${prefix} ${p.name} (×${p.quantity})`;
        if (p.product_code) {
          message += ` 📦\`${p.product_code}\``;
        }
        message += `\n`;
      });
    }
    message += `\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💰 *PRICE BREAKDOWN*\n\n`;
  message += `├─ Subtotal          ₹${subtotal.toFixed(2)}\n`;
  message += `├─ Discount (10%)  -₹${discount.toFixed(2)}\n`;
  message += `├─ Delivery         ${deliveryCharge === 0 ? '🎉 FREE' : `₹${deliveryCharge.toFixed(2)}`}\n`;
  message += `└─────────────────────────\n`;
  message += `   *TOTAL AMOUNT:  ₹${total.toFixed(2)}*\n\n`;
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✅ Please confirm this order.\n`;
  message += `🙏 Thank you for choosing us!\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/9195?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

export function openCartOrderPrintPreview(cartItems, subtotal, discount, deliveryCharge, total) {
  const win = window.open('', '_blank');
  if (!win) return;

  const rows = cartItems.map((item, idx) => {
    const price = item.offer_price || item.normal_price || item.price || 0;
    const itemTotal = (price * item.quantity).toFixed(2);
    
    const line = `
      <tr class="item-row">
        <td class="item-number">${idx + 1}</td>
        <td class="item-details">
          <div class="item-name">${item.name}</div>
          ${item.product_code ? `<div class="item-code">📦 Code: ${item.product_code}</div>` : ''}
          ${item.is_combo && item.combo_products ? `
            <div class="combo-badge">🎁 Combo Package</div>
          ` : ''}
        </td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">₹${price.toFixed(2)}</td>
        <td class="text-right item-total">₹${itemTotal}</td>
      </tr>
    `;
    
    const combo = item.is_combo && item.combo_products ? item.combo_products.map((p, pIdx) => `
      <tr class="combo-row">
        <td></td>
        <td colspan="4" class="combo-item">
          <span class="combo-prefix">${pIdx === item.combo_products.length - 1 ? '└─' : '├─'}</span>
          ${p.name} <span class="combo-qty">(×${p.quantity})</span>
          ${p.product_code ? `<span class="combo-code">📦 ${p.product_code}</span>` : ''}
        </td>
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
        <title>Order Summary - Ovees</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1f2937;
            padding: 40px 24px;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          }
          
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #111827 0%, #374151 100%);
            color: white;
            padding: 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          
          .header .subtitle {
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          
          .content {
            padding: 32px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid #111827;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
          }
          
          thead {
            background: #f9fafb;
            border-bottom: 2px solid #e5e7eb;
          }
          
          th {
            padding: 14px 12px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
          }
          
          .item-row td {
            padding: 20px 12px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
          }
          
          .item-number {
            font-weight: 700;
            color: #111827;
            font-size: 16px;
            width: 40px;
          }
          
          .item-details {
            min-width: 300px;
          }
          
          .item-name {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 6px;
          }
          
          .item-code {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          
          .combo-badge {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 6px;
          }
          
          .combo-row td {
            padding: 8px 12px;
            border-bottom: 1px solid #f9fafb;
          }
          
          .combo-item {
            padding-left: 52px !important;
            font-size: 14px;
            color: #6b7280;
          }
          
          .combo-prefix {
            color: #9ca3af;
            margin-right: 8px;
          }
          
          .combo-qty {
            color: #9ca3af;
            font-weight: 600;
          }
          
          .combo-code {
            color: #9ca3af;
            font-size: 12px;
            margin-left: 8px;
          }
          
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          
          .item-total {
            font-weight: 600;
            color: #111827;
          }
          
          .summary-box {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            border-radius: 12px;
            padding: 24px;
            margin-top: 20px;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            font-size: 15px;
          }
          
          .summary-row.total {
            border-top: 3px solid #111827;
            margin-top: 12px;
            padding-top: 16px;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
          }
          
          .summary-label {
            color: #6b7280;
          }
          
          .summary-value {
            font-weight: 600;
            color: #111827;
          }
          
          .discount {
            color: #dc2626 !important;
          }
          
          .free-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
          }
          
          .footer {
            background: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer strong {
            color: #111827;
          }
          
          .print-button {
            margin-top: 24px;
            padding: 14px 32px;
            background: linear-gradient(135deg, #111827 0%, #374151 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .container {
              box-shadow: none;
              border-radius: 0;
            }
            
            .no-print {
              display: none !important;
            }
            
            .header::before {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Order Summary</h1>
            <div class="subtitle">Thank you for your order!</div>
          </div>
          
          <div class="content">
            <div class="section-title">
              🛒 Items Ordered
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="width:40px;">#</th>
                  <th style="text-align:left;">Item Details</th>
                  <th class="text-center" style="width:80px;">Qty</th>
                  <th class="text-right" style="width:100px;">Price</th>
                  <th class="text-right" style="width:120px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            
            <div class="section-title">
              💰 Price Breakdown
            </div>
            
            <div class="summary-box">
              <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">₹${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Discount (10%)</span>
                <span class="summary-value discount">-₹${discount.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Delivery Charge</span>
                <span class="summary-value">
                  ${deliveryCharge === 0 ? '<span class="free-badge">🎉 FREE</span>' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>₹${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="no-print" style="text-align:center;">
              <button onclick="window.print()" class="print-button">
                🖨️ Print / Save as PDF
              </button>
            </div>
          </div>
          
          <div class="footer">
            Generated by <strong>Ovees</strong> • ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => { 
              try { 
                // Auto-print is optional - comment out if not needed
                // window.print(); 
              } catch(e) {} 
            }, 200);
          });
        </script>
      </body>
    </html>
  `;

  win.document.open();
  win.document.write(html);
  win.document.close();
}