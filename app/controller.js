// Main application controller
invoices.directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ])
.directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ngModel){
      el.bind('change',function(){
        scope.$apply(function(){
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  }
});

invoices.controller('InvoiceCtrl', ['$scope','$sce', '$http', 'DEFAULT_INVOICE', 'DEFAULT_LOGO', 'LocalStorage', 'Currency',
  function($scope, $sce, $http, DEFAULT_INVOICE, DEFAULT_LOGO, LocalStorage, Currency) {

  // Set defaults
  $scope.currencySymbol = '\u20B9';
  $scope.printMode   = false;
  $scope.additionalTax   = false;
  $scope.notes   = false;
  $scope.terms   = false;
  $scope.logo = '';
  $scope.to1='';
  $scope.to='';
  $scope.from='';
  $scope.message='';
  $scope.invoicefile='';

  (function init() {
    // Attempt to load invoice from local storage
    !function() {
      var invoice = LocalStorage.getInvoice();
      $scope.invoice = invoice ? invoice : DEFAULT_INVOICE;
      $scope.invoice.date=new Date($scope.invoice.date);
      $scope.invoice.due=new Date($scope.invoice.due);
    }();

    // Set logo to the one from local storage or use default
    !function() {
      var logo = LocalStorage.getLogo();
      $scope.logo = logo ? logo : '';
    }();

    $scope.availableCurrencies = Currency.all();

  })()


  var formdata = new FormData();
  $scope.getTheFiles = function ($files) {
      angular.forEach($files, function (value, key) {
          formdata.append(key, value);
      });
  };

  // NOW UPLOAD THE FILES.
  $scope.sendInvoice = function () {
      window.alert("Your invoice has been sent to "+$scope.to);
      window.location.reload();
      formdata.append('to', $scope.to);
      formdata.append('from', $scope.from);
      formdata.append('message', $scope.message);
      var request = {
          method: 'POST',
          url: 'http://192.168.1.105:8000/send',
          data: formdata,
          headers: {
              'Content-Type': undefined
          }
      };

      // SEND THE data.
      $http(request)
          .then(function(success) {
          console.log("SUCCESS " + JSON.stringify(success));
          }, function(error) {
          console.log("ERROR " + JSON.stringify(error));
          });
  }

  // Adds an item to the invoice's items
  $scope.addItem = function() {
    if ($scope.invoice.items.length < 13 ){
      $scope.invoice.items.push({ qty:1, cost:0, description:"",$$hashKey:(0|Math.random()*9e6).toString(36)});
    }
    else{
      window.alert("Can't add more than 10 items!");
    }
  }
  $scope.addAdditionalTax=function() {
     $scope.additionalTax   = true;
  }
  $scope.removeAdditionalTax=function() {
     $scope.invoice.tax1='';
     $scope.additionalTax   = false;
  }
  $scope.addNotes=function() {
     $scope.invoice.notes='';
     $scope.notes   = !$scope.notes;
  }
  $scope.removeNotes=function() {
     $scope.invoice.notes='';
     $scope.notes   = false;
  }
  $scope.addTerms=function() {
     $scope.invoice.terms='';
     $scope.terms   = !$scope.terms;
  }
  $scope.removeTerms=function() {
     $scope.invoice.terms='';
     $scope.terms   = false;
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

  //Download the invoice as pdf
  $scope.pdf= function() {

  html2canvas(document.getElementById('invoice'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    
                    content: [{
                        image: data,
                        width: 580,
                       
                    }],
                  pageSize: 'A4',
                  pageMargins: [ 20, 0, 10, 20 ],
                };
                pdfMake.createPdf(docDefinition).download("invoice.pdf");
            }
        });
  };

  $scope.getpdf = function() {

    $http({
        url: 'http://192.168.1.105:8000/pdf',
        method: "POST",
        data: { 
        "company" : $scope.invoice.company_info.content,
        "customer" : $scope.invoice.customer_info.content,
        "logo":$scope.logo, 
        "items":$scope.invoice.items,
        "subtotal":$scope.subtotal,
        "taxtitle":$scope.invoice.tax_titile,
        "tax":$scope.invoice.tax,
        "taxamount":$scope.taxamount,
        "taxtitle1":$scope.invoice.tax1_titile,
        "tax1":$scope.invoice.tax1,
        "taxamount1":$scope.taxamount1,
        "grandtotal":$scope.grandTotal,
        "notes":$scope.invoice.notes,
        "terms":$scope.invoice.terms,
        "currency":$scope.currencySymbol,
        "additionaltax":$scope.additionalTax,
        
        },
        responseType: 'arraybuffer',
        headers: {
        "Content-Type": "application/json",
        }
       
    })
   .then(function successCallback(response) {
             var blob = new Blob([response.data], {type: 'application/pdf'});
             var fileURL = URL.createObjectURL(blob);
             var a = document.createElement("a");
             $scope.pdffile=fileURL;
            var fileName = "invoice.pdf";
            a.href = fileURL;
            a.download = fileName;
                a.click();
        }, function errorCallback(response) {   
        });
  }

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
    $scope.subtotal=total;
    return total;
  };

  // Calculates the tax of the invoice
  $scope.calculateTax = function() {
    $scope.taxamount= $scope.invoice.tax * $scope.invoiceSubTotal()/100 ;
    return $scope.taxamount;
  };
  $scope.calculateTax1 = function() {
    $scope.taxamount1= $scope.invoice.tax1 * $scope.invoiceSubTotal()/100 ;
    return $scope.taxamount1;
  };

  // Calculates the grand total of the invoice
  $scope.calculateGrandTotal = function() {
    saveInvoice();
    $scope.grandTotal = $scope.calculateTax() + $scope.calculateTax1() + $scope.invoiceSubTotal()
    return $scope.grandTotal;
  };

 // Reads a url
  var readUrl = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('company_logo').setAttribute('src', e.target.result);
        $scope.setLogo(e.target.result);
        $scope.$apply();

      }
      reader.readAsDataURL(input.files[0]);

    }
  };

$scope.setLogo = function(logo) {
    localStorage['logo'] = logo;
      $scope.logo = logo ;
  };
  // Clears the local storage
  $scope.clearLocalStorage = function() {
    var confirmClear = confirm('Are you sure you would like to clear the invoice?');
    if(confirmClear) {
      $scope.invoice=angular.copy(DEFAULT_INVOICE);
      LocalStorage.clear();
      $scope.logo = '';
    }
  };

  $scope.printmodeon = function(){
    $scope.printMode = true;
    angular.element('#printcontainer').css('width', '90%');
    angular.element('.form-control').css({'font-size': '20px','color':'black'});
    angular.element('#paper').css('font-size', '20px');
    angular.element('#items').addClass('items-table');

  };

  $scope.printmodeoff = function(){
    $scope.printMode = false;
    angular.element('#printcontainer').css('width', '800');
    angular.element('#items').removeClass('items-table');
    angular.element('.form-control').css({'font-size': '14px','color':'#555'});
    angular.element('#paper').css('font-size', '14px');

  };

  $scope.printInfo = function() {
    angular.element('#items').removeClass('items-table');
    $scope.printmodeoff();
    window.print();
  };

  // Sets the current invoice to the given one
  var setInvoice = function(invoice) {
    $scope.invoice = invoice;
    saveInvoice();
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