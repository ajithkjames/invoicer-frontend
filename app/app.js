var invoices=angular.module('invoices', [])

// The default logo for the invoice
.constant('DEFAULT_LOGO', 'assets/images/spark.png')

// The invoice displayed when the user first uses the app
.constant('DEFAULT_INVOICE', {
  date:'',
  due:'',
  notes:'',
  terms:'',
  tax: 10.00,
  invoice_number: 1,
  customer_info: {
    content: '',
    
  },
  company_info: {
    content: '',
    
  },
  items:[
    { qty: 1, description: 'item description', cost: 1 }
  ]
})



