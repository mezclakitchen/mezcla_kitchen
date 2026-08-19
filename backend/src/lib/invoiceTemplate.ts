import type { Order } from '../types/index.js';

export function getInvoiceHTML(order: Order): string {
  const items = (order.items as Array<{ name: string; qty: number; price: number; total: number }>) || [];

  const itemsHtml = items.map(item => `
    <tr>
      <td class="item-name">${item.name}</td>
      <td class="center">${item.price.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</td>
      <td class="center">${item.qty}</td>
      <td class="right">${item.total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</td>
    </tr>
  `).join('');

  const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
    month: 'long', day: '2-digit', year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Pinyon+Script&display=swap');
    
    :root {
      --black: #000000;
      --gold: #e8bd63;
      --mint: #f4faf7;
      --text: #1a1a1a;
      --line: #666666;
    }

    * { box-sizing: border-box; }

    @page {
      size: A4;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: var(--mint);
      font-family: 'Montserrat', sans-serif;
      -webkit-font-smoothing: antialiased;
      color: var(--text);
    }

    .invoice-container {
      width: 100%;
      height: 296mm; /* Strict height to prevent second page */
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }

    .header {
      background-color: var(--black);
      color: white;
      text-align: center;
      padding: 2.5rem 0 1.5rem 0;
    }

    .brand-title {
      font-family: 'Pinyon Script', cursive;
      font-size: 5.5rem;
      font-weight: 400;
      margin: 0;
      line-height: 0.9;
    }

    .brand-subtitle {
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.35em;
      color: var(--gold);
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .yellow-bar {
      background-color: var(--gold);
      text-align: center;
      padding: 1.2rem 0;
      color: var(--black);
    }

    .yellow-bar .invoice-title {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 0.25em;
      margin: 0 0 0.5rem 0;
    }
    
    .yellow-bar .pan-no {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      margin: 0;
    }

    .content-area {
      flex: 1;
      padding: 3rem 4rem;
      display: flex;
      flex-direction: column;
    }

    .details-grid {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .label {
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      color: var(--text);
      margin-bottom: 1.5rem;
    }

    .details-left {
      width: 55%;
    }

    .details-right {
      width: 40%;
      text-align: right;
    }

    .invoice-info {
      font-size: 1.1rem;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .data-block {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
    }

    th {
      text-align: left;
      padding: 1rem 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
      border-top: 1.5px solid var(--line);
      border-bottom: 1.5px solid var(--line);
    }

    th.right, td.right { text-align: right; }
    th.center, td.center { text-align: center; }

    td {
      padding: 1.5rem 0;
      font-size: 1.1rem;
    }

    .item-name {
      font-weight: 500;
    }

    .totals-wrapper {
      border-top: 1.5px solid var(--line);
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      width: 250px;
      font-size: 1.1rem;
    }

    .total-row.final {
      font-weight: 700;
      margin-top: 0.5rem;
    }

    footer {
      background-color: var(--black);
      color: white;
      padding: 2.5rem 4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-left {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      font-weight: 500;
    }

    .contact-icon {
      width: 28px;
      height: 28px;
      fill: white;
    }

    .thank-you {
      font-family: 'Pinyon Script', cursive;
      font-size: 3.5rem;
      margin-top: 1.5rem;
      color: white;
      line-height: 1;
    }

    .footer-center {
      text-align: center;
      font-size: 1rem;
      line-height: 1.6;
      color: #e0e0e0;
      max-width: 35%;
    }

    .footer-right {
      background-color: white;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 140px;
    }

    .qr-placeholder {
      width: 100%;
      aspect-ratio: 1;
      border: 1px dashed #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      color: #666;
      text-align: center;
    }

    .qr-text {
      color: black;
      font-size: 0.6rem;
      margin-top: 0.75rem;
      font-weight: 700;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <header class="header">
      <img src="data:image/png;base64,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" alt="Mezcla" style="max-width: 300px; height: auto; filter: brightness(0) invert(1);" />
    </header>
    
    <div class="yellow-bar">
      <h2 class="invoice-title">INVOICE</h2>
      <p class="pan-no">PAN NO: ${process.env.BUSINESS_PAN ?? 'EHTPS6556M'}</p>
    </div>

    <div class="content-area">
      <div class="details-grid">
        <div class="details-left">
          <div class="label">INVOICE TO:</div>
          <div class="data-block">
            ${order.customer_name}<br>
            ${order.customer_address ? order.customer_address.replace(/\n/g, '<br>') : ''}
            ${order.customer_phone ? `<br>${order.customer_phone}` : ''}
            ${order.customer_email ? `<br>${order.customer_email}` : ''}
          </div>
        </div>
        <div class="details-right">
          <div class="invoice-info">INVOICE NO: ${order.invoice_number}</div>
          <div class="invoice-info">${dateStr}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th width="40%">Description</th>
            <th width="20%" class="center">Price</th>
            <th width="20%" class="center">Qty</th>
            <th width="20%" class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div class="totals-wrapper">
        ${order.discount && order.discount > 0 ? `
        <div class="total-row">
          <span>Discount</span>
          <span style="color: #22c55e;">-${order.discount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
        </div>` : ''}
        ${order.delivery_charge && order.delivery_charge > 0 ? `
        <div class="total-row">
          <span>Delivery</span>
          <span>${order.delivery_charge.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
        </div>` : ''}
        ${order.cgst_amount && order.cgst_amount > 0 ? `
        <div class="total-row" style="font-size: 0.9rem; color: #666;">
          <span>CGST (${order.cgst_pct ?? 2.5}%)</span>
          <span>${order.cgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
        </div>` : ''}
        ${order.sgst_amount && order.sgst_amount > 0 ? `
        <div class="total-row" style="font-size: 0.9rem; color: #666;">
          <span>SGST (${order.sgst_pct ?? 2.5}%)</span>
          <span>${order.sgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
        </div>` : ''}
        <div class="total-row final">
          <span>Total</span>
          <span>${(order.total ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}/-</span>
        </div>
      </div>
    </div>

    <footer>
      <div class="footer-left">
        <div class="contact-item">
          <!-- Instagram Icon -->
          <svg class="contact-icon" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          MEZCLAKITCHEN.IN
        </div>
        <div class="contact-item">
          <!-- Phone Icon -->
          <svg class="contact-icon" viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          ${process.env.BUSINESS_PHONE ?? '9892290606'}
        </div>
        <div class="thank-you">thank you!</div>
      </div>
      
      <div class="footer-center">
        We would love to hear from you!<br><br>
        <strong>Please leave us a review on Google</strong><br>
        and tag us on Instagram.<br><br>
        We appreciate your support!
      </div>

      <div class="footer-right">
        <!-- Placeholder for QR code. Replace the div below with an actual img tag when available -->
        <div class="qr-placeholder">
          Scan to Pay<br>(Insert QR Code Here)
        </div>
        <div class="qr-text">MONALI ARVIND SHAH</div>
      </div>
    </footer>
  </div>
</body>
</html>
  `;
}

