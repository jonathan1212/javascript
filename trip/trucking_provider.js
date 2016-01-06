$(function () {
    
    'use strict';


    $.truckingProvider = function(options) {
    	
    	var _me = this;
    	var defaults = {};
		options = $.extend({},defaults,options);
	
    	this.getProvider = function(obj) {

    		if (obj instanceof jQuery) {
	    		var provider = obj.val();
	    		_me.getProviderByValue(provider);
    		}
    	}

    	this.getProviderByValue = function(val) {

    		var provider = val;

	        $('.company , .3rdparty').slideUp('slow');
        	if (provider == 1) {
	            $('.company').slideDown('slow');
	        } else if (provider == 2){
	            $('.3rdparty').slideDown('slow');
	        }
    	}

    	/*var provider = options['obj'];
    	_me.getProvider(provider);*/
	
    	
    	return {
    		getProvider: _me.getProvider(options['obj']),
    		getProviderByValue: _me.getProviderByValue
    	}

    };


    $.getTripInfo = function(options) {

        var _me = this;
        var defaults = {};
        options = $.extend({},defaults,options);
        
        this.getInfo = function(obj) {

            $(obj).on('click',function(e) {
                
                e.preventDefault();

                var id = $(this).attr('tripid');
                
                $.getJSON( "/admin.php/trip/getTripInfo", {
                    id: id
                  })
                .done(function( data ) {
                    
                    var $div = $('<table/>').html(data.html);
                    //console.log($div);
                    
                    $('#tripinfo_container').html('');
                    $div.appendTo("#tripinfo_container").modal();
                    
                    $('.trip-booking-section').show();
                    //$('.modal').css('width',width);

               });

            }); 
        }

        return {
            getTrip: _me.getInfo(options['obj'])
        }

    }

});