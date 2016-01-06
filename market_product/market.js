(function(){
	
	'use strict'


	$.getCriterion = function(options){
		var defaults = {};
		var options = $.extend({},defaults,options);
		
		var append = function(html) {
			$(options['criterionJurisdiction'].html(html));
		}

		var list = function(opts) {

			var val = $(opts).val();
			var newOpts = "";
			
			$.each(opts,function(i,v){
				for (var x in val) {
					if (val[x] == $(v).val()) {
						newOpts += $(v).prop('outerHTML');
					}
				}
			});
			return newOpts;
		}

		options['jurs'].on('change',function(){
			append(list(this));
		});

		//load 
		append(list(options['jurs'][0]));
		
	}


})();