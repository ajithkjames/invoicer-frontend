// Main application controller

invoices.controller('InvoiceCtrl', ['$scope', '$http', 'DEFAULT_INVOICE', 'DEFAULT_LOGO', 'LocalStorage', 'Currency',
  function($scope, $http, DEFAULT_INVOICE, DEFAULT_LOGO, LocalStorage, Currency) {

  // Set defaults
  $scope.currencySymbol = '\u20B9';
  $scope.logoPresent = true;
  $scope.printMode   = false;
  $scope.additionalTax   = false;

  (function init() {
    // Attempt to load invoice from local storage
    !function() {
      var invoice = LocalStorage.getInvoice();
      $scope.invoice = invoice ? invoice : DEFAULT_INVOICE;
    }();

    // Set logo to the one from local storage or use default
    !function() {
      var logo = LocalStorage.getLogo();
      $scope.logo = logo ? logo : '';
    }();

    $scope.availableCurrencies = Currency.all();

  })()
  // Adds an item to the invoice's items
  $scope.addItem = function() {
    $scope.invoice.items.push({ qty:1, cost:0, description:"" });
  }
  $scope.addAdditionalTax=function() {
     $scope.additionalTax   = !$scope.additionalTax;
  }
  // Toggle's the logo
  $scope.removeLogo = function(element) {
    LocalStorage.clearLogo();
    $scope.logo = '';
  };

  // Triggers the logo chooser click event
  $scope.editLogo = function() {
    // angular.element('#imgInp').trigger('click');

    document.getElementById('imgInp').click();
  };

  $scope.printInfo = function() {
    window.print();
  };

  //Download the invoice as pdf
  $scope.pdf= function() {
  html2canvas(document.getElementById('invoice'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    
                    content: [{
                        image: data,
                        width: 500,
                    }],
                  pageSize: 'A4',
                };
                pdfMake.createPdf(docDefinition).download("invoice.pdf");
            }
        });
  };
  // Remotes an item from the invoice
  $scope.removeItem = function(item) {
    $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
  };

  // Calculates the sub total of the invoice
  $scope.invoiceSubTotal = function() {
    var total = 0.00;
    angular.forEach($scope.invoice.items, function(item, key){
      total += (item.qty * item.cost);
    });
    return total;
  };

  // Calculates the tax of the invoice
  $scope.calculateTax = function() {
    return (($scope.invoice.tax * $scope.invoiceSubTotal())/100);
  };
  $scope.calculateTax1 = function() {
    return (($scope.invoice.tax1 * $scope.invoiceSubTotal())/100);
  };

  // Calculates the grand total of the invoice
  $scope.calculateGrandTotal = function() {
    saveInvoice();
    return $scope.calculateTax() + $scope.calculateTax1() + $scope.invoiceSubTotal();
  };
$scope.setLogo = function(logo) {
    localStorage['logo'] = logo;
    var logo = LocalStorage.getLogo();
      $scope.logo = logo ? logo : '';
    console.log("done ",$scope.logo)
    location.reload();
  };
  // Clears the local storage
  $scope.clearLocalStorage = function() {
    var confirmClear = confirm('Are you sure you would like to clear the invoice?');
    if(confirmClear) {
      LocalStorage.clear();
      location.reload();
      setInvoice(DEFAULT_INVOICE);
    }
  };

  // Sets the current invoice to the given one
  var setInvoice = function(invoice) {
    $scope.invoice = invoice;
    saveInvoice();
  };

  // Reads a url
  var readUrl = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('company_logo').setAttribute('src', e.target.result);
        $scope.setLogo(e.target.result);
        console.log("sds")
      }
      reader.readAsDataURL(input.files[0]);

    }
  };

  // Saves the invoice in local storage
  var saveInvoice = function() {
    LocalStorage.setInvoice($scope.invoice);
  };

  // Runs on document.ready
  angular.element(document).ready(function () {
    // Set focus
    document.getElementById('invoice-number').focus();

    // Changes the logo whenever the input changes
    document.getElementById('imgInp').onchange = function() {
      readUrl(this);
    };
  });


}])