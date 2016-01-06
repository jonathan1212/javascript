/**
 * Script for CalendarTable.
 * 
 * Requirements:
 *  - date.js 
 *
 */

(function() {
	CalendarTable = function() {
		var url = null;
		var me = this;
		var opts = null;
		var today = new Date();
		
		var d = new Date();
		d.setDate(1);
		
		var onClickCalendarEventHandler = function() {};
		var calendarProvider = function() { return ''; };
		
		$('#calendar_prev_button').click(function(){
			me.setControlButtonsEnabled(false);
			$('#calendar_loader').css('display', '');
			
			d.setDate(1);
			d.setMonth(d.getMonth() - 1);
			me.update();
		});
		
		$('#calendar_next_button').click(function(){
			me.setControlButtonsEnabled(false);				
			
			$('#calendar_loader').css('display', '');
			d.setDate(1);
			d.setMonth(d.getMonth() + 1);
			me.update();
		});
		
		$('#calendar_today_button').click(function(){
			me.setControlButtonsEnabled(false);
		 
			$('#calendar_loader').css('display', '');
			d = new Date();
			d.setDate(1);
			me.update();
		});
		
		me.setToday = function(date) {
		  today = date;
		  
		  return this;
		}
		
		me.getToday = function() {
		  return today;
		}
		
		me.getDate = function() {
			return d;
		}
		
		me.setDate = function(d1) {
			d = d1;
			
			return this;
		}
		
		me.setUrl = function(l) {
			url = l;
			
			return this;
		};
		
		me.setOnClickCalendarEventHandler = function(c) {
			onClickCalendarEventHandler = c;
			
			return this;
		};
		
		me.setCalendarProvider = function(c) {
			calendarProvider = c;
			
			return this;
		};
		
		/**
		 * Shows the calendar form for adding events in the calendar.
		 */
		me.initialize = function(options) {
			this.plotDates();
			this.update();
		};
		
		/**
		 * Disables or enables  the control buttons.
		 * 
		 * @param     boolean     val     The state of the control buttons.
		 */
		me.setControlButtonsEnabled = function(val) {
			$('#calendar_prev_button').attr('disabled', (val) ? false : true);
			$('#calendar_next_button').attr('disabled', (val) ? false : true);
			$('#calendar_today_button').attr('disabled', (val) ? false : true);
		};
		
		/**
		 * Plot dates on the calendar.
		 */
		me.plotDates = function() {
			var days = me.createDays();
			var date = me.getDate();
			
			$('#calendar_month_and_year_info').html(month[date.getMonth()] + " " + date.getFullYear());
			//$('#calendar_month_and_year_info').html(months[d.getMonth()]+' '+ d.getFullYear());
			
			$('.today').removeClass('today');
			
			for(i in days) {
				$('#calendar_index_' + i)
					.html('')
					.append('<div class="clearfix"><img style="float:left; display:none; " class="calendar_cell_loader" src="/images/loader16x16white.gif" id="calendar_cell_' + i + '_loader"> <span class="date ' + ((days[i].is_other_date) ? 'other_date' : '') + '">'+days[i].date.getDate()+'</span></div>')
					.attr('date', days[i].date.getFullYear() + '-' + (days[i].date.getMonth() + 1) + '-' + days[i].date.getDate())
					.append('<div id="calendar_data_container_'+days[i].date.getFullYear()+'_'+(days[i].date.getMonth() + 1)+'_'+days[i].date.getDate()+'"></div>');
				$('#td_calendar_index_' + i)
					.addClass((days[i].is_current) ? 'today' : '')
					.click(function(e) {
						$('.selected_day').removeClass('selected_day');
						$(this).addClass('selected_day');
					});
			}
			
			return this;
		}
		
		/**
		 * Create the possible days of the calendar.
		 */
		me.createDays = function() {
			var days = [];
			
			for(var i = 1; i <= 42; i++) {
				var d2 = new Date(d.getFullYear(), d.getMonth(), 1);
				d2.setDate(d2.getDate() + (i - (d2.getDay() + 1)));
				
				days.push({
					date:       d2,
					is_other_date: !(d2.getMonth() == d.getMonth() && d2.getFullYear() == d.getFullYear()),
					is_current: (d2.getDate() == today.getDate() && d2.getMonth() == today.getMonth() && d2.getFullYear() == today.getFullYear())
				});
			}
			
			return days;
		}
		
		/**
		 * Updates the events plotted in the calendar table. The data will come from the given url set in the constructor.
		 */
		me.update = function(c) {
			var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (1 - (d.getDay() + 1)));
			var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (42 - (d.getDay() + 1)));
			var date1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate();
			var date2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate();
			
			$.ajax({
				//url: url+'?calendars=[' + calendarProvider() + ']&fromDate='+date1+"&toDate="+date2,
				url: url+'?calendars=[' + CalendarList.instance().getJsonCalendarIds() + ']&date='+date1, 
				success: function(data){
					me.setControlButtonsEnabled(true);
					
					var d2 = new Date();
					$('#calendar_today_button').css('display', (d2.getMonth() == d.getMonth() && d2.getFullYear() == d.getFullYear()) ? 'none' : '');
					
					me.plotDates();
					
					for(i in data) {
						$('#calendar_data_container_'+data[i].start_date.Y+'_'+data[i].start_date.n+'_'+data[i].start_date.j)
							.append($('<div class="entry" id="event_'+data[i].id+'" event_id="'+data[i].id+'" style="position: relative; " />')
								.append($('<a href="javascript:void(0);" id="the_calendar_event_'+data[i].id+'" calendar_id="'+data[i].calendar_id+'" event_id="'+data[i].id+'" style="color: #'+data[i].color_code+'; " />')
									.html(data[i].title)
									.dblclick(function(e) {
										e.stopPropagation();
										e.stopImmediatePropagation();
										
										$('#calendar_note_' + $(this).parent().attr('event_id')).css('display', 'none');
										onClickCalendarEventHandler($(this).parent().attr('id'), $(this).attr('event_id'), $(this).attr('calendar_id'), e);
										
										return false;
									})
									.mouseover(function(e) {
										if(!CalendarEventForm.instance().isVisible()) {
											$('.with_bubble').removeClass('with_bubble');
											$(this).parent().addClass('with_bubble');
											$('#calendar_note_' + $(this).parent().attr('event_id')).css('display', 'block');
										}
									})
									.mouseout(function(e) {
										if(!CalendarEventForm.instance().isVisible()) {
											$('.with_bubble').removeClass('with_bubble');
											$(this).parent().addClass('with_bubble');					
										}
										
										$('#calendar_note_' + $(this).parent().attr('event_id')).css('display', 'none');
									})
								)
								.append((0 < data[i].category.length) ? '<span class="days setBlock">' + data[i].category + '</span>' : '<br />')
								.append((data[i].is_spanned) ? '<span class="days">' + data[i].spanned_date + ' days</span>' : '')
								.append((0 < data[i].notes.length) ? '<div id="calendar_note_'+data[i].id+'" class="notes" style="display:none;" ><h4>'+data[i].title+' Notes'+'</h4><p>'+data[i].notes +'</p></div>' : '')
							);
					}
					
					$('#calendar_loader').css('display', 'none');
					
					if(typeof(c) == "function") {
						c();
					}
				},
				cache: false,
				dataType: 'json',
				error: function() {
					alert('Sorry, but we encountered an error while processing your request. We will fixed this as soon as possible.');
				}
			});
		};
		
		return this;
	}
	
	var instance = null;
	
	/**
	 * Creates the single instance of CalendarTable.
	 * 
	 * @return     CalendarTable     The single instance of CalendarTable.
	 */
	CalendarTable.instance = function() {
		if(null == instance) {
			instance = new CalendarTable();
		}
		
		return instance;
	}
})();