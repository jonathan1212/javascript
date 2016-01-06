(function($){

	$.fn.single = function(options){
		var settings = $.extend({ 
			_form: $('form'),
			_url: '#',
			_title: 'Action',
			_message: 'Do you want to continue?',
			_width: 350,
			_height: 180,
			_targets: ''
		}, options);
		
		return $(this).unbind('click').bind('click', function(){         
			$('.batch_checkbox').attr('checked', false);
			$('.batch_checkbox', $(this).closest('tr')).attr('checked', true);
			
			var data_action = $(this).attr('data-action');
			$('a[data-action="'+data_action+'"].batch').click();
			return false;
		});
	};

	$.fn.batch = function(options){
		var settings = $.extend({ 
			_form: $('form'),
			_url: '#',
			_title: 'Action',
			_message: 'Do you want to continue?',
			_width: 350,
			_height: 180,
			_targets: '',
			_customizedDialog: '',
			_callback : function() {}
		}, options);
		
		return $(this).unbind('click').bind('click', function(){
			if($(settings._targets+':checked').length > 0){
				if(settings._customizedDialog != ''){
					$('#'+settings._customizedDialog).dialog({
						title: settings._title,
						width: settings._width,
						height: settings._height,
						buttons: {
							'Yes': function(){
								settings._form.attr('action', settings._url);
								settings._form.submit();
							},
							'No': function(){
								$(this).dialog("close");
							}
						}
					});
					if( typeof settings._callback == 'function' ){
	                        settings._callback.call(this);
	                 }
					
				}else{
					var dialogDiv = $('<div></div>').
						attr('id', 'confirm').
						css("display", "none").
						attr('title', settings._title).
						html(settings._message);
					$('body').append(dialogDiv);
	
					$('#confirm').dialog({
						width: settings._width,
						height: settings._height,
						buttons: {
							'Yes': function(){
								settings._form.attr('action', settings._url);
								settings._form.submit();
							},
							'No': function(){
								$(this).dialog("close");
							}
						}
					});   
				}   
			}
			
			return false;
		});
	};
	
	$.fn.initBatchActions = function(){
		$(this).bind('click', function(){
			$('#batchActions').hide();            

			if($('.batch_checkbox:checked').length > 0){
				$('#batchActions').show();
			}
			$('.actionDrp li').hide();
			$('.batch_checkbox:checked').each(function(){
				$('.action', $(this).parents('tr')).each(function(){
					$('.'+$(this).attr('data-action'), $('.actionDrp')).show();
				});
			});
		});
	}
	
	$.fn.checkAll = function(options){
		var settings = $.extend({ trigger: '', targets: '', check: null, countHolder: '#checkCount' }, options );
		
		$(settings.targets).click(function(){
			$(settings.countHolder).html($(settings.targets+':checked').length);
		});
		
		return $(this).click(function(){                                          
			if(settings.check == null){
				$(settings.targets).attr('checked', $(settings.trigger).is(':checked'));
			}else{
				$(settings.targets).attr('checked', settings.check);
				$(settings.trigger).attr('checked', settings.check);
			}
			
			$(settings.countHolder).html($(settings.targets+':checked').length);
		});
	};
	
	$.fn.groupDropdown = function(options){
		var settings = $.extend({ organization_url: '', group_url: '', _form: '' }, options );

		return $(this).change(function(){
			$('#groupId').val($(':selected', this).attr('data-id'));
		});
	};

	$.__initGroupDropdown = function(options){
		var settings = $.extend({
			content: '#groupsDropdown',
			message: '',
			form: $('form'),
			group: 0
		}, options);
			
		var groups = $(settings.content).clone().removeClass('long').removeAttr('id');
		$('option[data-level=organization]', groups).remove();
		$('option[data-id='+settings.group+']', groups).remove();                     
		
		groups.unbind('change').bind('change', function(){
			var selected = $(':selected', this).attr('data-id');
			
			hiddenInput = $('#destinationGroupId');

			if($(hiddenInput).length == 0){
				var hiddenInput = $('<input />').
					attr('name', 'destinationGroupId').
					attr('id', 'destinationGroupId').
					attr('type', 'hidden');
			}
			
			$(hiddenInput).attr('value', selected);
			settings.form.append(hiddenInput);
		});
		
		var dialogDiv = $('<div></div>').
			attr('id', 'dropDownDialog').
			css("display", "none").
			attr('title', settings._title).
			append(settings.message).
			append(groups);
		$('body').append(dialogDiv);
		
		groups.change();
	};
	

})(jQuery);