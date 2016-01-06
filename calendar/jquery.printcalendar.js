var PrintCalendarManager = (function($){
	return {

		enddate		: '',
		startdate	: '',
		viewType	: 'month',

		// setters
		setViewType: function(viewType) {
			this.viewType = viewType;
		},
		setEndDate: function(date) {
			this.enddate = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
		},
		setStartDate: function(date) {
			this.startdate = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
		},
		// getters
		getViewType: function() {
			return this.viewType;
		},
		getEndDate: function() {
			return this.enddate;
		},
		getStartDate: function() {
			return this.startdate;
		},

		showPrintDialog: function() {
			var loading = $('<center />')
					.append($('<image src="/images/loader24x24white.gif" />'))
					.append($('<em style="vertical-align:super"> loading please wait...</em>'));
			var cont = $('<div id="print_calendar_container" />')
					.append(loading)
					.dialog({
						'title'	  : 'Print Calendar',
						'modal'	  : true,
						'width'	  : 580,
						'height'  : 150
					});
			$.ajax({
				type:	'GET',
				cache:	false,
				url:	'/tools/calendar/showPrintForm',
				success: function( data ){
					cont.empty().html(data)
						.dialog("option", "buttons", {
							'Cancel': function() {
								cont.dialog("close");
							},
							'Print': function() {
								// show loading indicator
								$('#printing_indicator').show();
								// hide print form
								$('#print_calendar_form').hide();
								// hide buttons
								$('.ui-dialog-buttonpane').hide()

								// close dialog
								window.setTimeout(function(){
									cont.dialog("close");
									PrintCalendarManager.proceedPrintCalendar();
								}, 500);
							}
						});
				}
			});
		},
		proceedPrintCalendar: function() {
			var font = $('#cmbFont').val();
			var size = $('#cmbSize').val();
			var orientation = $('#cmbOrientation').val();

			$('#print_calendar_container').remove();

			var params = 'start='+PrintCalendarManager.getStartDate()+'&end='+PrintCalendarManager.getEndDate();
			params += '&view_type='+PrintCalendarManager.getViewType()+'&font='+font+'&size='+size+'&orientation='+orientation;

			document.getElementById('print_pdf_calendar').src = '/tools/calendar/printCalendar?'+params;
		}
	}
})(jQuery);