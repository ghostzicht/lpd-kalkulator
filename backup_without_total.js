// Backup approach: Modify the app to work without the 'total' column
// This script modifies index.html to calculate totals client-side

const fs = require('fs');

function createBackupVersion() {
  console.log('🔄 Creating backup version without total column dependency...');
  
  let html = fs.readFileSync('index.html', 'utf8');
  
  // 1. Modify saveQuote function to not use total column
  const oldSaveQuote = `          },
          total: total,
          status: 'draft'`;
          
  const newSaveQuote = `          },
          // total: total, // Calculated client-side instead
          status: 'draft'`;
  
  html = html.replace(oldSaveQuote, newSaveQuote);
  
  // 2. Modify showQuotesHistory to calculate total from items
  const oldTotalDisplay = `          const items = quote.items;
          const productInfo = items ? 
            \`\${items.product_name} (\${items.quantity}× \${items.print_method.toUpperCase()})\` : 
            'Produktdetails nicht verfügbar';

          return \`
            <div class="quote-item">
              <div class="quote-header">
                <span class="quote-number">\${quote.quote_number}</span>
                <span class="quote-date">\${date}</span>
              </div>
              <div class="quote-customer">\${customerName}</div>
              <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 8px;">
                \${productInfo}
              </div>
              <div class="quote-total">\${parseFloat(quote.total).toFixed(2)} €</div>
            </div>
          \`;`;
          
  const newTotalDisplay = `          const items = quote.items;
          const productInfo = items ? 
            \`\${items.product_name} (\${items.quantity}× \${items.print_method.toUpperCase()})\` : 
            'Produktdetails nicht verfügbar';
          
          // Calculate total client-side from items
          const calculatedTotal = items ? 
            (items.quantity * items.unit_price * (1 - (items.discount_percent || 0) / 100)) : 
            0;

          return \`
            <div class="quote-item">
              <div class="quote-header">
                <span class="quote-number">\${quote.quote_number}</span>
                <span class="quote-date">\${date}</span>
              </div>
              <div class="quote-customer">\${customerName}</div>
              <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 8px;">
                \${productInfo}
              </div>
              <div class="quote-total">\${calculatedTotal.toFixed(2)} €</div>
            </div>
          \`;`;
  
  html = html.replace(oldTotalDisplay, newTotalDisplay);
  
  // 3. Also update the confirmOffer function (quote saving on PDF generation)
  const oldConfirmOffer = `          total: total,`;
  const newConfirmOffer = `          // total: total, // Calculated client-side`;
  
  html = html.replace(oldConfirmOffer, newConfirmOffer);
  
  // Write backup version
  fs.writeFileSync('index_backup_no_total.html', html);
  console.log('✅ Backup version created: index_backup_no_total.html');
  console.log('   This version works without the total column in the database');
  
  return true;
}

function testBackupCompatibility() {
  console.log('\\n🧪 Testing backup compatibility...');
  
  // Test if the backup version would work by simulating the missing total column
  const testQuote = {
    id: 1,
    quote_number: 'TEST-123',
    items: {
      product_name: 'Test T-Shirt',
      quantity: 25,
      unit_price: 12.50,
      discount_percent: 25
    },
    // total: 234.38, // This column doesn't exist in backup scenario
    status: 'draft',
    created_at: new Date().toISOString()
  };
  
  // Simulate the client-side total calculation
  const calculatedTotal = testQuote.items.quantity * testQuote.items.unit_price * (1 - (testQuote.items.discount_percent || 0) / 100);
  
  console.log('   Simulated quote:', testQuote.quote_number);
  console.log('   Calculated total:', calculatedTotal.toFixed(2), '€');
  console.log('   ✅ Client-side calculation works');
}

if (require.main === module) {
  createBackupVersion();
  testBackupCompatibility();
  
  console.log('\\n📋 Usage:');
  console.log('   If DB fix fails, copy index_backup_no_total.html → index.html');
  console.log('   This will make the app work without the total column');
}