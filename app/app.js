var invoices=angular.module('invoices',  [])

// The default logo for the invoice
.constant('DEFAULT_LOGO', 'assets/images/logo.jpg')

// The invoice displayed when the user first uses the app
.constant('DEFAULT_INVOICE', {
  date:new Date(),
  due:new Date(),
  notes:'',
  terms:'',
  from_text:'From,',
  to_text:'Bill To,',
  tax_titile:'tax(%)',
  tax: 0.00,
  tax1_titile:'Additional taxes(%)',
  tax1: 0.00,
  invoice_number: 1,
  from:'',
  to:'',
  items:[
    { qty: 1, description: '', cost: 0 }
  ]
})


