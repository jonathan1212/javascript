(function($){

	Trip_Dump = {
		expenses : 0,
		tax: 0
	}

	Trip = function()
	{	
		//this.expenses = 0;
		//var instance = this;

		/*Trip.getInstance = function()
		{
			return instance;
		}*/
		this.searchByDriver = function(){
			
		}

		this.calculate = function(option){
			$.calculate(option);
			//alert('total:'+total);
			//this.expenses = total;
		}

		this.chargeCalculate = function(options){
			options = $.extend({expenses: this.expenses},options);
			$.charges(options);			
		}

		this.customerTax = function(options){
			$.customer_tax(options);
		}

		//return Trip;
	}
	
	Trip.getInstance = function(){
		
		if(Trip.instance == undefined){
			Trip.instance = new Trip();
		}

		return Trip.instance; 
	}

	/*Trip.getInstance = function(){
		if()
	}*/

	$.calculate = function(options){
		var defaults = {};
		options = $.extend({},defaults,options);
		var total = 0;
		
		$('#'+options.sop +', #'+options.toll_free+', #'+options.huli+
			', #'+options.driver_vale+', #'+options.helper1_vale+', #'+options.helper2_vale
			+', #'+options.rep_maint+', #'+options.comm+', #'+options.others +', #'+options.diesel
			 +', #'+options.returned).on('blur',function(){
			
			var sop = parseFloat( $('#'+options.sop).val() ) || 0;
			var toll_free = parseFloat( $('#'+options.toll_free).val() ) || 0;
			var huli = parseFloat( $('#'+options.huli).val() ) || 0;
			var rep_maint = parseFloat( $('#'+options.rep_maint).val() ) || 0;
			var comm = parseFloat( $('#'+options.comm).val() ) || 0;
			var others = parseFloat( $('#'+options.others).val() ) || 0;
			var returned = parseFloat( $('#'+options.returned).val() ) || 0;
			
			var expenses = (sop + toll_free + huli + rep_maint + comm + others); //- returned;
			
			var driver_vale = parseFloat( $('#'+options.driver_vale).val() ) || 0;
			var helper1_vale = parseFloat( $('#'+options.helper1_vale).val() ) || 0;
			var helper2_vale = parseFloat( $('#'+options.helper2_vale).val() ) || 0;

			var total = expenses + driver_vale + helper1_vale + helper2_vale;
	
			var driver_salary = parseFloat( $('#'+options.driver_salary).val() ) || 0;
			var helper1_salary = parseFloat( $('#'+options.helper1_salary).val() ) || 0;
			var helper2_salary = parseFloat( $('#'+options.helper2_salary).val() ) || 0;

			var salary = driver_salary + helper1_salary + helper2_salary;

			var diesel = parseFloat( $('#'+options.diesel).val() ) || 0;

			if( $('#'+options.po).is(':checked') == false ){
				total = total + diesel;
			}	

			$('#'+options.total).val(total);

			var charge = parseFloat($('#'+options.charge).val()) || 0;
			var tax = parseFloat($('#'+options.tax).val()) || 0;

			var income = charge - ( expenses + salary + tax + diesel );

			console.log('expenses:'+ expenses);
			console.log('salary:'+ salary);
			
			//console.log(parseFloat($('#'+options.charge).val()));
			//console.log(parseFloat($('#'+options.tax).val()));
			//console.log(parseFloat($('#'+options.diesel).val()));

			//console.log(income);

            $('#'+options.income).val(income);
			Trip_Dump.expenses = expenses + salary;
		});

		$('#'+options.po).click(function(){

			var total = parseFloat($('#'+options.total).val()) || 0;
			var diesel = parseFloat( $('#'+options.diesel).val() ) || 0;

			if( $(this).is(':checked') == true ){
				$('#'+options.total).val( total - diesel );
			}else{
				$('#'+options.total).val( total  + diesel  );
			}
		});
	 
			
	};

	var callcharges = function(options){

	}

	$.charges = function(options){
		console.log('sfd');

		var defaults = {};
		options = $.extend({},defaults,options);
		
		var diesel = parseFloat( $('#'+options.diesel).val() ) || 0;
		var charge = parseFloat($('#'+options.charge).val()) || 0;

		var totale = Trip_Dump.expenses + Trip_Dump.tax + diesel;
		var income = charge - totale;

		$('#'+options.income).val(income);
		
		//return false;
	}

	$.customer_tax = function(options){
		var defaults = {};
		options = $.extend({},defaults,options);
		var total = 0;
		
		$('#'+options.charge).on('blur',function(){

			var me = parseFloat($(this).val()) || 0;

			var tax = me  * .12;
			
			$('#'+options.tax).val(tax);

			Trip_Dump.tax = tax;
			
		});
	}
	

})(jQuery);