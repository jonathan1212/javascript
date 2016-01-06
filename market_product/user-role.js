(function($){

	"use strict"
		

    $.fn.getform = function (customOptions) {
    	var options = {};
    	
    	$.extend(options, customOptions);
     	
     	
     	return this.each(function() {
     		var $role = $(this);
		     		
     		$role.on('click',function(e){
     			
     			//e.preventDefault();
                $('#openModal').html('<i class="fa fa-spinner"></i>');

     			$.get("/user-management/userrole/"+$(this).data('id'), {}, 
		            function(data) { 
		            	//console.log(data);
		                $('#openModal').html(data);
		            }
		        );

     		});
     	
     	});

     	
    }

})(jQuery);