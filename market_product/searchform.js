(function(){

    "use strict"
    $('[name=search-remove]').on('click',function(){
    	$(this).hide();
    	$('[name=search-show]').show();
    	$('[name=searchform]').slideUp('slow');
    });

    $('[name=search-show]').on('click', function () {
    	$(this).hide();
    	$('[name=search-remove]').show();
        $('[name=searchform]').slideDown('slow');
    })

	$('[name=search-remove]').hide();
    //$('[name=searchform]').hide();
    	
})()