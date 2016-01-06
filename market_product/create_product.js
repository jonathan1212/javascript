(function(){

    "use strict"

    $.getScript('/js/market_product/searchform.js', function()
    {
        $('.daterange').daterangepicker({
            locale: { cancelLabel: 'Clear' }  
        });


        $('.daterange').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });

        $('.daterange').val('');
    });

    	
})()