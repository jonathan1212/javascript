var ImportCalendarManager = (function($){
	return {

		calendar_color	: '2a64db',

		chooseCalendarColor: function(obj, color, id) {
			// set all colors as unselected
			$('.'+id).css('border-color', '#EBEAEA');
			// set new selected calendar color
			$(obj).className = 'selected';
			$(obj).css('border-color', '#CCCCCC');
			// update hidden field value
			$('#hdnCalendarColor').val(color);
		},
		validateFileType: function( filename ) {
			var isValid = false;

			if ( 0 == filename.length ){
				$('#calendar_import_error').show();
				$('#calendar_import_error').html("Filename is required");
			}
			else{
				var allowedFileTypes = new Array("ics");
				var ext = filename.split('.').pop().toLowerCase();

				if (jQuery.inArray(ext, allowedFileTypes) != -1) {
					isValid = true;
				}

				if (!isValid){
					$('#calendar_import_error').show();
					$('#calendar_import_error').html("Invalid file type");
				}
				else{
					$('#hdnExtension').val(ext);
					$('#calendar_import_error').hide();
					$('#calendar_import_error').html("");
				}
			}

			return isValid;
		},

		showImportDialog: function() {
			var loading = $('<center />')
					.append($('<image src="/images/loader24x24white.gif" />'))
					.append($('<em style="vertical-align:super"> loading please wait...</em>'));
			var cont = $('<div id="import_calendar_container" />')
					.append(loading)
					.dialog({
						'title': 'Import Calendar',
						'modal': true,
						'width': 520
					});
			$.ajax({
				type:	'POST',
				cache:	false,
				url:	'/tools/calendar/showImportForm',
				success: function( data ){
					cont.empty().html(data)
						.dialog("option", "buttons", {
							'Cancel': function() {
								cont.dialog("close");
							},
							'Import': function() {
								var isValidFileType = ImportCalendarManager.validateFileType( $("#cFileName").val() );
								if (isValidFileType) {
									// show loading indicator
									$('#importing_indicator').show();
									// hide import form
									$('#import_calendar_form').hide();
									// hide buttons
									$('.ui-dialog-buttonpane').hide()

									// close dialog
									window.setTimeout(function(){
										ImportCalendarManager.proceedImportCalendar();
									}, 500);
								}
							}
						});
					// update calendar color
					$('.import_calendar_color_code').click(function(){
						ImportCalendarManager.chooseCalendarColor($(this), $(this).attr('value'), 'import_calendar_color_code');
					});
					$('#cmbCalendars').change(function(){
						if ( 0 == $(this).val() ) {
							$('#row_color_code_select').show();
						}
						else {
							$('#row_color_code_select').hide();
						}
					});
				}
			});
		},
		proceedImportCalendar: function() {
			var frame = document.getElementById('frmImportCalendar');

			frame.target = 'import_calendar_target';
			frame.submit();

			document.getElementById('import_calendar_target').onload = function(){
				// hide loading indicator
				$('#importing_indicator').hide();

				// show success message
				$('#import_calendar_container').empty()
					.html('<center>You have successfully imported one calendar.</center>')
					.dialog("option", "buttons", {
						'Ok': function() {
							window.setTimeout(function(){
								$('#import_calendar_container').dialog("close");
								window.location.reload(true);
							}, 500);
						}
					});
			};
		},
		showAddCalendarByURLDialog: function() {
			var loading = $('<center />')
					.append($('<image src="/images/loader24x24white.gif" />'))
					.append($('<em style="vertical-align:super"> loading please wait...</em>'));
			var cont = $('<div id="add_calendar_by_url_container" />')
					.append(loading)
					.dialog({
						'title': 'Add Calendar by URL',
						'modal': true,
						'width': 520
					});
			$.ajax({
				type:	'POST',
				cache:	false,
				url:	'/tools/calendar/showAddByURLForm',
				success: function( data ){
					cont.empty().html(data)
						.dialog("option", "buttons", {
							'Cancel': function() {
								cont.dialog("close");
							},
							'Add': function() {
								var isValidFileType = ImportCalendarManager.validateFileType( $("#txtURL").val() );
								if (isValidFileType) {
									// show loading indicator
									$('#add_by_url_indicator').show();
									// hide import form
									$('#add_by_url_form').hide();
									// hide buttons
									$('.ui-dialog-buttonpane').hide()

									// close dialog
									window.setTimeout(function(){
										ImportCalendarManager.proceedAddCalendarByURL();
									}, 500);
								}
							}
						});
					// update calendar color
					$('.add_calendar_by_url_color_code').click(function(){
						ImportCalendarManager.chooseCalendarColor($(this), $(this).attr('value'), 'add_calendar_by_url_color_code');
					})
				}
			});
		},
		proceedAddCalendarByURL: function() {
			var params = 'url='+$("#txtURL").val()+'&color='+$("#hdnCalendarColor").val();

			$.ajax({
				type:	'POST',
				cache:	false,
				url:	'/tools/calendar/addByURL?'+params,
				success: function(){
					$('#add_calendar_by_url_container').empty()
						.html('<center>You have successfully imported one calendar.</center>')
						.dialog("option", "buttons", {
							'Ok': function() {
								window.setTimeout(function(){
									$('#add_calendar_by_url_container').dialog("close");
									window.location.reload(true);
								}, 500);
							}
						});
				}
			});
		}
	}
})(jQuery);