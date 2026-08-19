import 'dotenv/config';
import { adminSupabase } from './lib/supabase.js';

async function run() {
  console.log('Populating recent seed data...');

  const customers = [
    { name: 'Amit Desai', phone: '919876000001', email: 'amit@example.com', tags: ['vip'], notes: 'Frequent buyer' },
    { name: 'Riya Kapoor', phone: '919876000002', email: 'riya@example.com', tags: ['regular'], notes: 'Likes sourdough' },
    { name: 'Karan Shah', phone: '919876000003', email: 'karan@example.com', tags: ['corporate'], notes: 'Bulk orders' },
    { name: 'Sneha Rao', phone: '919876000004', email: 'sneha@example.com', tags: [], notes: '' },
    { name: 'Vijay Kumar', phone: '919876000005', email: 'vijay@example.com', tags: ['regular'], notes: '' },
    { name: 'Anjali Menon', phone: '919876000006', email: 'anjali@example.com', tags: ['vip'], notes: '' },
    { name: 'Suresh Raina', phone: '919876000007', email: 'suresh@example.com', tags: [], notes: '' },
    { name: 'Pooja Hegde', phone: '919876000008', email: 'pooja@example.com', tags: ['regular'], notes: '' },
  ];

  for (const c of customers) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 60)); // last 60 days
    await adminSupabase.from('customers').upsert({
      ...c,
      created_at: d.toISOString(),
      updated_at: d.toISOString()
    }, { onConflict: 'phone' });
  }

  const itemsOptions = [
    [{ name: 'Sourdough Multigrain Boule', qty: 1, price: 480, total: 480 }],
    [{ name: 'Classic Hummus', qty: 2, price: 380, total: 760 }],
    [{ name: 'Rosemary Focaccia', qty: 1, price: 360, total: 360 }, { name: 'Basil Pesto', qty: 1, price: 460, total: 460 }],
    [{ name: 'Artisan Bread & Dip Hamper', qty: 1, price: 1200, total: 1200 }],
    [{ name: 'Grazing Table — Small', qty: 1, price: 4500, total: 4500 }],
    [{ name: 'Office Party Box', qty: 2, price: 2400, total: 4800 }]
  ];

  const statuses = ['paid', 'paid', 'paid', 'paid', 'pending', 'cancelled'];
  const now = new Date();
  
  for (let i = 1; i <= 60; i++) {
    const c = customers[Math.floor(Math.random() * customers.length)];
    const items = itemsOptions[Math.floor(Math.random() * itemsOptions.length)];
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const cgst = Number((subtotal * 0.025).toFixed(2));
    const sgst = Number((subtotal * 0.025).toFixed(2));
    const total = subtotal + cgst + sgst;
    
    // Spread evenly across last 60 days to populate May and June
    const orderDate = new Date(now.getTime() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const year = orderDate.getFullYear();

    await adminSupabase.from('orders').insert({
      invoice_number: `MZ-${year}-9${i.toString().padStart(3, '0')}`,
      customer_name: c.name,
      customer_phone: c.phone,
      customer_email: c.email,
      customer_address: 'Bangalore, Karnataka',
      items: items,
      subtotal,
      discount: 0,
      delivery_charge: 0,
      cgst_pct: 2.5,
      sgst_pct: 2.5,
      cgst_amount: cgst,
      sgst_amount: sgst,
      total,
      status,
      payment_method: status === 'paid' ? 'upi' : null,
      created_at: orderDate.toISOString(),
      updated_at: orderDate.toISOString()
    });
  }

  console.log('Successfully inserted seed data for graphs!');
}

run().catch(console.error);
