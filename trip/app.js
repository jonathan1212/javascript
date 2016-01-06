$.expenses = {};

var myApp = angular.module('myApp', []);


myApp.controller('MyController', function MyController($scope) {
    
  $scope.data = $.expenses;
  $scope.total = $.expenses['total'];
  $scope.total_expenses = $.expenses['total_expenses'];
  
  $scope.calculate = function() {
    var data = $scope.data;

    //truck expenses
    var sop = parseFloat( data.sop ) || 0;
    var toll_free = parseFloat( data.toll_free ) || 0;
	var huli = parseFloat( data.huli ) || 0;
	var parking = parseFloat( data.parking ) || 0;
	var rep_maint = parseFloat( data.rep_maint ) || 0;
	var comm = parseFloat( data.comm ) || 0;
	var others_expenses = parseFloat( data.others_expenses ) || 0;
	var driver_vale = parseFloat( data.driver_vale ) || 0;
	var helper1_vale = parseFloat( data.helper1_vale ) || 0;
	var helper2_vale = parseFloat( data.helper2_vale ) || 0;
	var driver_salary = parseFloat( data.driver_salary ) || 0;
	var helper1_salary = parseFloat( data.helper1_salary ) || 0;
	var helper2_salary = parseFloat( data.helper2_salary ) || 0;

	var driver_allowance = parseFloat( data.driver_allowance ) || 0;
	var helper1_allowance = parseFloat( data.helper1_allowance ) || 0;
	var helper2_allowance = parseFloat( data.helper2_allowance ) || 0;

	var returned = parseFloat( data.returned ) || 0;
	var diesel = parseFloat( data.diesel ) || 0;

	var expenses = (sop + toll_free + huli + rep_maint + comm + others_expenses + parking) - returned;	
	
	//liquidation
	var liquidation = expenses + driver_vale + helper1_vale + helper2_vale;
	
	var po = angular.element(document.querySelector('#trip_tripDiesel_po'));
	if( $(po).is(':checked') == false ){
		liquidation = liquidation + diesel;
	}


	var total_expense = expenses; // + driver_vale + helper1_vale + helper2_vale;
	var salary = driver_salary + helper1_salary + helper2_salary;

	var with_tax = angular.element(document.querySelector('#trip_with_tax'));

	//customer charges
    var customer_charge = parseFloat( data.customer_charge ) || 0;
    var charge = customer_charge / 1.12;

    $scope.data['charge'] = charge.toFixed(2);
    var tax = parseFloat($scope.data['charge']) * 0.12;
    $scope.data['tax'] = tax.toFixed(2);   


	total_expense = total_expense + diesel;


	if( $(with_tax).is(':checked') == true ){
		total_expense = total_expense + $scope.data['tax'];
	}

	$scope.data['total_expenses'] = liquidation; // + salary; //total_expense;
	
	var trip_provider = angular.element(document.querySelector("input[name='trip\[provider\]']:checked"));

	if (trip_provider.val() == 1) {
		var all_expenses = total_expense + salary + driver_allowance + helper1_allowance + helper2_allowance;

	} else if (trip_provider.val() == 2) {
		var all_expenses = 0;
	}

    // all expenses
    $scope.data['all_expenses'] = all_expenses; /*expenses*/ /*total_expense + salary;*/ // + $scope.data['tax'];
    
    //income
    $scope.data['income'] = $scope.data['charge'] - $scope.data['all_expenses'];

    // other expenses
    var freight_amount = parseFloat( data.freight_amount ) || 0;
    var trucking_origin = parseFloat( data.trucking_origin ) || 0;
	var trucking_destination = parseFloat( data.trucking_destination ) || 0;
	var agent = parseFloat( data.agent ) || 0;
	var others = parseFloat( data.others ) || 0;
	var storage_fee = parseFloat( data.storage_fee ) || 0;
	var mano_origin = parseFloat( data.mano_origin ) || 0;
	var mano_destination = parseFloat( data.mano_destination ) || 0;
	var wharfage_origin = parseFloat( data.wharfage_origin ) || 0;
	var wharfage_destination = parseFloat( data.wharfage_destination ) || 0;
	var arrastre_origin = parseFloat( data.arrastre_origin ) || 0;
	var arrastre_destination = parseFloat( data.arrastre_destination ) || 0;
	var stripping_destination = parseFloat( data.stripping_destination ) || 0;

    var total = freight_amount + trucking_origin + trucking_destination 
    + agent + others + storage_fee + mano_origin + mano_destination + wharfage_origin
    + wharfage_destination + arrastre_origin + arrastre_destination + stripping_destination;

  	$scope.total = total;
  }


});

$.expensesInit = function (data) {
	$.extend($.expenses,data);
}
