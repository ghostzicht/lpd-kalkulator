const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://rfgjylqyeaxrzlxqdvbb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZ2p5bHF5ZWF4cnpseHFkdmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTI5MzQsImV4cCI6MjA4OTI2ODkzNH0.dNRB0xSg5zbx5kM2T3y4yiFdywOzsDkzZBGvLqGiI1M'
);

async function testQuoteSystem() {
  console.log('🧪 Testing LPD Kalkulator Quote System\n');

  // 1. Test column existence
  console.log('1️⃣ Testing table schema...');
  try {
    const { data, error } = await supabase.from('quotes').select('id, customer_id, quote_number, items, total, status, created_at').limit(1);
    if (error) {
      console.log('❌ Schema test failed:', error.message);
      return false;
    }
    console.log('✅ All required columns exist\n');
  } catch (e) {
    console.log('❌ Schema test exception:', e.message);
    return false;
  }

  // 2. Test INSERT (quote creation)
  console.log('2️⃣ Testing quote creation...');
  const testQuote = {
    quote_number: 'TEST-' + Date.now(),
    items: {
      product_id: 123,
      product_name: 'Stanley Stella Creator T-Shirt',
      quantity: 25,
      unit_price: 12.50,
      print_method: 'dtg',
      print_sides: 1,
      discount_percent: 25
    },
    total: 234.38,
    status: 'draft'
  };

  try {
    const { data: quote, error } = await supabase
      .from('quotes')
      .insert([testQuote])
      .select();

    if (error) {
      console.log('❌ Quote creation failed:', error.message);
      return false;
    }
    console.log('✅ Quote created successfully!');
    console.log('   Quote:', quote[0].quote_number, '-', quote[0].total + '€\n');
  } catch (e) {
    console.log('❌ Quote creation exception:', e.message);
    return false;
  }

  // 3. Test SELECT (quote retrieval)
  console.log('3️⃣ Testing quote retrieval...');
  try {
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Quote retrieval failed:', error.message);
      return false;
    }
    console.log('✅ Quotes retrieved successfully!');
    console.log('   Found', quotes.length, 'quotes:');
    quotes.forEach((q, i) => {
      console.log(`   ${i+1}. ${q.quote_number} - ${q.total}€ (${q.status})`);
    });
  } catch (e) {
    console.log('❌ Quote retrieval exception:', e.message);
    return false;
  }

  console.log('\n🎉 All tests passed! Quote system is working correctly.');
  return true;
}

// Run the test
testQuoteSystem().then(success => {
  process.exit(success ? 0 : 1);
}).catch(e => {
  console.log('❌ Test runner exception:', e.message);
  process.exit(1);
});