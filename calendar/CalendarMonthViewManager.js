(function($) {

	/**
	 * The class that manages the day view of the calendar.
	 */
	function CalendarMonthViewManager() { 
    	this.inheritFrom = BaseCalendarViewManager;
		this.inheritFrom();

  		var me = this;

		/**
		 * Overriden method from BaseCalendarViewManager.
		 */
		this.showTodayNavigation = function(today, date) {
			return (!(today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear()));
		};

		/**
		 * Overriden method from BaseCalendarViewManager.
		 */
		this.applyDateChanged = function(key, today, date) {
			switch (key) {
				case "previous":
					date.setMonth(date.getMonth() - 1);
        			break;

        		case "today":
          			date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());          
        			break;

        		case "next":
          			date.setMonth(date.getMonth() + 1);          
        			break;
      		}

      		return date;
		};

    	/**
     	 * Overriden method from BaseCalendarViewManager.
     	 */
    	this.paint = function(provider, today, date, template, listener) {
      		var data = provider.getData(date.getFullYear(), date.getMonth());

      		$('.calendarView').css('display', 'none');
      		$('#calendarMonthViewContainer').css('display', '');
      		$('.monthViewEventsContainer').html("");
      		$('.monthViewCellContainer').removeClass('today');
      		$('.monthViewDateContainer').removeClass('other_date');
      		$('.monthViewCalendarCellLoader').css('display', 'none');

      		$('#monthViewMainHeaderContainer').html(month[date.getMonth()] + " " + date.getFullYear());

      		var dateNumber = new Date(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes(), date.getSeconds());

	  		// START: for calendar printing
	  			PrintCalendarManager.setStartDate(dateNumber);
				PrintCalendarManager.setViewType('month');
	  		// END

      		dateNumber.setDate(dateNumber.getDate() - dateNumber.getDay());
      		for (var i = 0; i < 6; i++) {
        		for (var j = 0; j < 7; j++) {
          			$('#monthViewDateContainer_' + i + '_' + j).html(dateNumber.getDate());
          			$('#monthViewCellContainer_' + i + '_' + j).attr('date', dateNumber.getFullYear() + '-' + (dateNumber.getMonth() + 1) + '-' + dateNumber.getDate() + ' ' + dateNumber.getHours() + ':' + dateNumber.getMinutes() + ':' + dateNumber.getSeconds());

          			if (dateNumber.getDate() == today.getDate() && dateNumber.getMonth() == today.getMonth() && dateNumber.getFullYear() == today.getFullYear()) {
            			$('#monthViewCellContainer_' + i + '_' + j).addClass('today');
          			}
          			else if (dateNumber.getMonth() != date.getMonth()) {
            			$('#monthViewDateContainer_' + i + '_' + j).addClass('other_date');
          			}

          			dateNumber.setDate(dateNumber.getDate() + 1);
        		}
      		}

	  		var ctr	= 0;
	  		var stor_date = (0 < data.length) ? data[0].start_date : '';

      		for (x in data) {
				if (data[x].start_date.date > stor_date.date ) {
					if ( ctr > 3 ) {
						var sDate = stor_date.month + '/' + stor_date.date + '/' + stor_date.year;
						var new_container = $('<div class="view_more_events" id="view_more_events_'+(stor_date.week - 1)+'_'+(stor_date.day)+'" style="text-align:center" />')
												.html('<a class="more_events_link" id="more_events_link_'+sDate+'" href="javascript:void(0)" style="font-color:#2200CC;text-decoration:underline;">+'+(ctr-3)+' more</a>');
						$('#monthViewEventsContainer_'+(stor_date.week - 1)+'_'+(stor_date.day)).append(new_container);
					}
				ctr = 0;
				}
				if ( ctr < 3 ) {
	        		var hour = (0 == (data[x].start_date.hour % 12)) ? 12 : (data[x].start_date.hour % 12);
		        	var str = template.replace(/%time%/g, hour + ":" + data[x].start_date.minutes + " " + data[x].start_date.meridiem);

		        	str = str.replace(/%title%/g, data[x].title);
		        	str = str.replace(/%color_code%/g, data[x].color_code);
		        	str = str.replace(/%calendar_event_html_id%/g, 'monthViewEventBubbleContainer_' + data[x].id);
		        	str = str.replace(/%event_id%/g, data[x].id);
		        	str = str.replace(/%row%/g, (data[x].start_date.week - 1));
		        	str = str.replace(/%col%/g, data[x].start_date.day);
		        	str = str.replace(/%date%/g, data[x].start_date.year + '-' + data[x].start_date.month + '-' + data[x].start_date.date + ' ' + data[x].start_date.hours + ':' + data[x].start_date.minutes + ':00');
		        	str = str.replace(/%calendar_event_title_id%/g, 'monthViewCalendarEventTitle_' + data[x].id);
		        	str = str.replace(/%num_days%/g, (data[x].is_spanned) ? data[x].spanned_date + ' days' : '');
		        	str = str.replace(/%category%/g, data[x].category);
		        	str = str.replace(/%calendar_event_note_id%/g, 'monthViewCalendarNoteId_' + data[x].id);
		        	str = str.replace(/%notes%/g, data[x].notes);
		        	str = str.replace(/%has_notes%/g, (0 < data[x].notes.length) ? 'true' : 'false');

		        	$('#monthViewEventsContainer_' + (data[x].start_date.week - 1) + '_' + data[x].start_date.day).append(str);
				}

				ctr++;
				stor_date = data[x].start_date;
	      	}

      		// Attach listeners for each cell
	      	$('.monthViewCellContainer').dblclick(function(e) { 
	        	$('#monthViewCalendarCellLoader_' + $(this).attr('row') + '_' + $(this).attr('col')).css('display', '');

	        	var top = e.pageY - $(this).offset().top;
	        	var left = e.pageX - $(this).offset().left;

	        	listener(this, e, top, left, me);
	      	});

	      	$('.monthViewEventsData').dblclick(function(e) { 
	        	$('#monthViewCalendarCellLoader_' + $(this).attr('row') + '_' + $(this).attr('col')).css('display', '');

	        	var top =  (($("#monthViewCalendarEventTitle_" + $(this).attr('event_id')).innerHeight() + 12) / 2);
	        	var left = $("#monthViewCalendarEventTitle_" + $(this).attr('event_id')).innerWidth() + 3;

	        	listener(this, e, top, left, me);
	      	});

		  	$('.more_events_link').click(function() {
				var arrId	 = this.id.split('_');
				var new_date = new Date(arrId[3]);
				var month	 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

				var cont = $('<div id="view_all_events" />')
						.css('overflow', 'visible')
						.dialog({
							'title': month[new_date.getMonth()]+' '+new_date.getDate()+', '+new_date.getFullYear(),
							'modal': true,
							'width': 320,
						 	close: function(ev, ui) { $(this).remove(); }
						});
				me.paint2(provider, new_date, template, listener);
			});
		};

		this.paint2 = function(provider, curr_date, template, listener) {
			var data = provider.getData(curr_date.getFullYear(), curr_date.getMonth());

			$('.ui-dialog').css('overflow', 'visible');
			$('#view_all_events').empty();

			for (x in data) {
				if (data[x].start_date.date == curr_date.getDate() ) {
		        	var hour = (0 == (data[x].start_date.hour % 12)) ? 12 : (data[x].start_date.hour % 12);
			        var str = template.replace(/%time%/g, hour + ":" + data[x].start_date.minutes + " " + data[x].start_date.meridiem);
			        str = str.replace(/%title%/g, data[x].title);
		        	str = str.replace(/%color_code%/g, data[x].color_code);
			        str = str.replace(/%calendar_event_html_id%/g, 'month_event_' + data[x].id);
			        str = str.replace(/%event_id%/g, data[x].id);
			        str = str.replace(/%row%/g, (data[x].start_date.week - 1));
			        str = str.replace(/%col%/g, data[x].start_date.day);
			        str = str.replace(/%date%/g, data[x].start_date.year + '-' + data[x].start_date.month + '-' + data[x].start_date.date + ' ' + data[x].start_date.hours + ':' + data[x].start_date.minutes + ':00');
			        str = str.replace(/%calendar_event_title_id%/g, 'month_event_title_' + data[x].id);
			        str = str.replace(/%num_days%/g, (data[x].is_spanned) ? data[x].spanned_date + ' days' : '');
			        str = str.replace(/%category%/g, data[x].category);
			        str = str.replace(/%calendar_event_note_id%/g, 'month_event_note_' + data[x].id);
			        str = str.replace(/%notes%/g, data[x].notes);
			        str = str.replace(/%has_notes%/g, 'false');

			        $('#view_all_events').append(str);
					$('.days').css('color', 'gray').css('font-size', '9px');
					$('#month_event_'+data[x].id).css('padding-bottom', '5px');
				}
			}
			$('.monthViewEventsData').dblclick(function(e) { 
	        	var top =  (($("#monthViewCalendarEventTitle_" + $(this).attr('event_id')).innerHeight() + 12) / 2);
	        	var left = $("#monthViewCalendarEventTitle_" + $(this).attr('event_id')).innerWidth() + 3;

	        	listener(this, e, top, left, me);
	      	});
		};
	};
  
	var instance = null;

	window.CalendarMonthViewManager = {
		getInstance: function() {
	   		if (null == instance) {
	        	instance = new CalendarMonthViewManager();
	      	}

	      	return instance;
		}
	};

})(jQuery);