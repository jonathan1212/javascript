
(function($){


	/*if($("#isAgeSelected").is(':checked'))
	    $("#txtAge").show();  // checked
	else
	    $("#txtAge").hide();

		if($('#checkMeOut').prop('checked')) {
		    // something when checked
		} else {
		    // something else when not
		}


	*/ 
	//console.log('aa');

	$.userAccess = function(options) {

		var _me = this;
    	var defaults = {};
		options = $.extend({},defaults,options);
		
		this.showhideOBJ = function(obj,cl) {
			
			if (!obj.prop('checked')) {
				$('.' +cl).hide();
			} else {
				$('.'+cl).show();
			}

		}
		//master
		options['is_master'].on('click',function(){
			_me.showhide(this,'ismaster');
		});
		_me.showhideOBJ(options['is_master'],'ismaster');
		
		//transaction
		options['is_transaction'].on('click',function(){
			_me.showhide(this,'istransaction');
		});
		_me.showhideOBJ(options['is_transaction'],'istransaction');
		
		//setup
		options['is_setup'].on('click',function(){
			_me.showhide(this,'issetup');
		});
		_me.showhideOBJ(options['is_setup'],'issetup');

		//reports
		options['is_reports'].on('click',function(){
			_me.showhide(this,'isreports');
		});
		_me.showhideOBJ(options['is_reports'],'isreports');

		//sales
		options['is_sales'].on('click',function(){
			_me.showhide(this,'issales');
		});
		_me.showhideOBJ(options['is_sales'],'issales');

		//docuemnts
		options['is_documents'].on('click',function(){
			_me.showhide(this,'isdocuments');
		});
		_me.showhideOBJ(options['is_documents'],'isdocuments');

		//docuemnts
		options['is_dashboard'].on('click',function(){
			_me.showhide(this,'isdashboard');
		});
		_me.showhideOBJ(options['is_dashboard'],'isdashboard');


		//master client
		options['is_master_client'].on('click',function(){
			_me.showhide(this,'masterclient');
		});
		_me.showhideOBJ(options['is_master_client'],'masterclient');

		options['is_master_subclient'].on('click',function(){
			_me.showhide(this,'mastersubclient');
		});
		_me.showhideOBJ(options['is_master_subclient'],'mastersubclient');

		options['is_master_employee'].on('click',function(){
			_me.showhide(this,'masteremployee');
		});
		_me.showhideOBJ(options['is_master_employee'],'masteremployee');

		options['is_master_truck'].on('click',function(){
			_me.showhide(this,'mastertruck');
		});
		_me.showhideOBJ(options['is_master_truck'],'mastertruck');

		options['is_master_shippingline'].on('click',function(){
			_me.showhide(this,'mastershippingline');
		});
		_me.showhideOBJ(options['is_master_shippingline'],'mastershippingline');

		options['is_master_truckingprovider'].on('click',function(){
			_me.showhide(this,'truckingprovider');
		});
		_me.showhideOBJ(options['is_master_truckingprovider'],'truckingprovider');

		options['is_master_consignee'].on('click',function(){
			_me.showhide(this,'masterconsignee');
		});
		_me.showhideOBJ(options['is_master_consignee'],'masterconsignee');


		options['is_master_supplier'].on('click',function(){
			_me.showhide(this,'mastersupplier');
		});
		_me.showhideOBJ(options['is_master_supplier'],'mastersupplier');


		options['is_master_designation'].on('click',function(){
			_me.showhide(this,'masterdesignation');
		});
		_me.showhideOBJ(options['is_master_designation'],'masterdesignation');

		options['is_master_expenses'].on('click',function(){
			_me.showhide(this,'masterexpenses');
		});
		_me.showhideOBJ(options['is_master_expenses'],'masterexpenses');

		options['is_master_category'].on('click',function(){
			_me.showhide(this,'mastercategory');
		});
		_me.showhideOBJ(options['is_master_category'],'mastercategory');

		//transaction
		options['is_transaction_trip'].on('click',function(){
			_me.showhide(this,'transactiontrip');
		});
		_me.showhideOBJ(options['is_transaction_trip'],'transactiontrip');

		options['is_transaction_booking'].on('click',function(){
			_me.showhide(this,'transactionbooking');
		});
		_me.showhideOBJ(options['is_transaction_booking'],'transactionbooking');

		options['is_transaction_budget'].on('click',function(){
			_me.showhide(this,'transactionbudget');
		});
		_me.showhideOBJ(options['is_transaction_budget'],'transactionbudget');

		options['is_transaction_payroll'].on('click',function(){
			_me.showhide(this,'transactionpayroll');
		});
		_me.showhideOBJ(options['is_transaction_payroll'],'transactionpayroll');

		options['is_transaction_maintenance'].on('click',function(){
			_me.showhide(this,'transactionmaintenance');
		});
		_me.showhideOBJ(options['is_transaction_maintenance'],'transactionmaintenance');

		options['is_transaction_diesel'].on('click',function(){
			_me.showhide(this,'transactiondiesel');
		});
		_me.showhideOBJ(options['is_transaction_diesel'],'transactiondiesel');

		options['is_transaction_otherexpenses'].on('click',function(){
			_me.showhide(this,'transactionotherexpenses');
		});
		_me.showhideOBJ(options['is_transaction_otherexpenses'],'transactionotherexpenses');

		options['is_setup_account'].on('click',function(){
			_me.showhide(this,'setupaccount');
		});
		_me.showhideOBJ(options['is_setup_account'],'setupaccount');

		options['is_setup_clientmanagement'].on('click',function(){
			_me.showhide(this,'setupclientmanagement');
		});
		_me.showhideOBJ(options['is_setup_clientmanagement'],'setupclientmanagement');

		/*options['is_setup_clientmanagement'].on('click',function(){
			_me.showhide(this,'setupclientmanagement');
		});
		_me.showhideOBJ(options['is_setup_clientmanagement'],'setupclientmanagement');*/

		options['is_sales_ar'].on('click',function(){
			_me.showhide(this,'salesar');
		});
		_me.showhideOBJ(options['is_sales_ar'],'salesar');

		options['is_dashboard_weeklytrip'].on('click',function(){
			_me.showhide(this,'dashboardweeklytrip');
		});
		_me.showhideOBJ(options['is_dashboard_weeklytrip'],'dashboardweeklytrip');



		this.showhide = function(obj,cl) {
			
			if (!$(obj).prop('checked')) {
				$('.' +cl).hide('slow');
			} else {
				$('.'+cl).show('slow');
			}

		};


	}

})(jQuery)