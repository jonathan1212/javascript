(function($){	
	$.fn.extend({
		checkContactUsername: function() {
			$("#usernameValidity").show();
			if ($(this).val().length < 3) {
				$("#usernameValidityMessage").attr('class', 'required').html('Invalid username. Too short.');
			} else {
    			var illegalChars = /\W/;
    			if (illegalChars.test($(this).val())){
    				$("#usernameValidityMessage").attr('class', 'required').html('Invalid username.');
    			} else {
    				$("#usernameValidityMessage").removeClass('required').html('Checking username availability...');
    				$.ajax({
    					dataType: 'JSON',
    					type: 'GET',
						data: ({username: $(this).val()}),
						url: '/account/ajaxClientUsernameCheck',
						success:function(response){
							jsonObj = response;//$.evalJSON(response);
							if (jsonObj.isExistUsername == 1){
								$("#usernameValidityMessage").attr('class', 'required').html('Username is already used by another.');
							} else {
								$("#usernameValidityMessage").removeClass('required').html('Username available!');
							}
						},
						error:function(obj, e){
							console.log('An error occurred while retrieving contact username.');
						}
    				});
    			}
			}
		},
	});
	
	$(document).ready(function(){
		$('#account_username').change(function() {
    		$(this).checkContactUsername();
    	});
	});
})(jQuery);