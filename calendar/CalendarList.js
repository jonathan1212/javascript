/**
 * CalendarList script.
 *
 * calendar object properties:
 *  - id(integer)           => The ID of the calendar.
 *  - name(string)          => The name of the calendar.
 *  - creator_id(integer)   => The ID of the creator of the calendar.
 *  - is_editable(integer)  => The flag whether the events of this calendar is editable.
 *  - color_code(string)    => The color code of the calendar.
 *  - is_checked(boolean)   => th flag whether this is active or the checkbox related to this calendar is checked.
 *
 */

(function() {
	/**
	 * Creates a new CalendarList.
	 */
	CalendarList = function() {	
		var calendars = new Array();
		var current_user_id = 0;
		var calendar_ul = $('<ul class="content list listExt" />').html('<li id="calendarListHeader"></li>');
		var onSelectCalendar = function() {};
		var logged_id = -1;
		var url = '';
		var me = this;
		
		/**
		 * Adds a calendar to the calendar list.
		 *
		 * @param     calendar     calendar     The calendar to be added.
		 */
		this.addCalendar = function(calendar) {
			calendars.push(calendar);
			
			this.repaint();
			
			return this;
		}
		
		this.setLoggedId = function(id) {
			logged_id = id;
			
			return this;
		}
		
		this.setUrl = function(my_url) {
			url = my_url;
		}
		
		/**
		 * Removes the calendar to the calendar list.
		 *
		 * @param     integer     id     ID of the calendar
		 */
		this.removeCalendar = function(id) {
			for(i in calendars) {
				if(calendars[i].id == id) {
					calendars.splice(i, 1);
					
					break;
				}
			}			
			
			this.repaint();
			
			return this;
		}		
		
		/**
		 * Appends the calendar list to the inner html of the given html id.
		 *
		 * @param     string     id     The id of the html container.
		 */
		this.addToContainer = function(id) {
			$('#' + id).prepend(calendar_ul);
			
			return this;
		}
		
		/**
		 * Sets the ID of the current logged user.
		 *
		 * @param     string     id     The id of the current logged user.
		 */
		this.setCurrentUserId = function(id) {
			current_user_id = id;
			
			return this;
		}
		
		/**
		 * Sets the callback that will be triggered on every select of a calendar.
		 * 
		 * @param     function($, calendar)     c     The callback
		 */
		this.onSelectCalendar = function(c) {
			onSelectCalendar = (typeof(c) == "function") ? c : function() {};
			
			return this;
		}
		
		/**
		 * Repaints the calendar.
		 */
		this.repaint = function() {
			if(0 == calendars.length) {
				$('#subscribe_button').css('display', 'none');
			}
			else {
				$('#subscribe_button').css('display', '');
			}
			
			calendar_ul.html('<li id="calendarListHeader"></li>');
			
			for(i in calendars) {
				var calendar = calendars[i];
				
				calendar_ul.append($('<li class="clearfix" id="calendar_' + i +'" />')
					.append($('<div id="calendar_data_' + i + '" class="clearfix"/>')
						.append($('<label class="calendarTitle" id="calendar_title_' + i + '"/>')
							.append($('<input index = "' + i + '" class="checkbox" type="checkbox" ' + (calendar.is_checked ? 'checked="checked"' : '') + ' />').click(function() {
								var index = $(this).attr('index');
								calendars[index].is_checked = $(this).attr('checked');
								
								$('#loader_' + index).css('display', '');
									
								CalendarEventDataProvider.getInstance()
									.setCalendarProvider(CalendarList.instance().getJsonCalendarIds)
								    .updateData(function() {
								    	$('#loader_' + index).css('display', 'none');
								      	var view = $('.calendarViewControlButton.selected').attr('key');
								      	viewManagers[view].updateUI(function() {});    
									});
									
								//CalendarTable.instance().update(function() {
								//	$('#loader_' + index).css('display', 'none');
								//});
							}))
							.append($('<span class="swatch" style="background-color: #' + calendar.color_code + ';" />'))
						)
						.append($('<a class="calendarLink clearfix setBlock" href="javascript:void(0);" index = "' + i +'" />')
							.html('<span class="setBlock toLeft">' + calendar.name + '</span>'  + ((logged_id == calendars[i].creator_id) ? '' : ((calendars[i].is_editable) ? ' - shared' : '<img src="/images/lock.png" class="lock">')))
							.click(function(e) {
								var index = $(this).attr('index');
								
								if(logged_id == calendars[index].creator_id) {
									$('#loader_' + index).css('display', '');
									
									function setCalendarForm() {
										CalendarForm.instance = $('#calendar_form_' + index);
										CalendarForm.instance.calendarform({
											form_url : url + '?calendar_id=' + calendars[index].id,
											onShowForm: function() {
												$('#loader_' + index).css('display', 'none');
												$('#calendar_data_' + index).css('display', 'none');
											},
											onSave: function(data) {
												var d = eval('(' + data + ')');
												$('#calendar_data_' + index).css('display', '');	
												
												//CalendarTable.instance().update(function() {
												//	$('#loader_' + index).css('display', 'none');
												//});
												
												CalendarEventDataProvider.getInstance()
													.setCalendarProvider(CalendarList.instance().getJsonCalendarIds)
												    .updateData(function() {
												    	$('#loader_' + index).css('display', 'none');
												      	var view = $('.calendarViewControlButton.selected').attr('key');
												      	viewManagers[view].updateUI(function() {});    
													});
												
												if(d.is_successful) {
													CalendarList.instance().updateCalendar(d.calendar.id, d.calendar);
												}
												else {
													// alert(d.message);
												}
												
												CalendarForm.instance = null;
											},
											onCancel: function() {
												$('#calendar_data_' + index).css('display', '');
												$('#loader_' + index).css('display', 'none');
												$('#calendar_form_' + index).html("");
												
												CalendarForm.instance = null;
											},
											onDelete: function() {
												//CalendarTable.instance().update();
												
												calendars.splice(index, 1);
												
												CalendarEventDataProvider.getInstance()
													.setCalendarProvider(CalendarList.instance().getJsonCalendarIds)
												    .updateData(function() {
												    	$('#loader_' + index).css('display', 'none');
												      	var view = $('.calendarViewControlButton.selected').attr('key');
												      	viewManagers[view].updateUI(function() {});
													});
												
												me.repaint();
												
												CalendarForm.instance = null;
											}
										});
									}
									
									if(null !== CalendarForm.instance) {
								  	CalendarForm.instance.calendarform('cleanUp', function() {
											CalendarForm.instance.calendarform('triggerOnCancel');
											me.repaint();
										  setCalendarForm();
										});
									}
									else {
										setCalendarForm();					
									}
								}
							})
						)
						.append('<image id="loader_' + i + '" src="/images/loader16x16DDD.gif" style="display: none;">')
					)
					.append('<div id="calendar_form_' + i +'" />')
				);	 
			}		
		}
		
		/**
		 * Updates the given calendar.
		 *
		 * @param     integer      id    The ID of the calendar to be updated.
		 * @param     calendar     c     The calendar to be updated and the values of the calendar.
		 */
		this.updateCalendar = function(id, c) {
			for(i in calendars) {
				if(calendars[i].id == id) {
					c.is_checked = calendars[i].is_checked;
					calendars[i] = c;
					
					break;
				}
			}
			
			this.repaint();
			
			return this;
		}
		
		/**
		 * Retrieves the calendar of the given calendar id.
		 */
		this.getCalendar = function(id) {
			for(i in calendars) {
				if(calendars[i].id == id) {
					return calendars[i];
				}
			}
			
			return null;			
		}
		
		/**
		 * Retrieves the ids of the calendars that are checked.
		 */
		this.getJsonCalendarIds = function(id) {
			var ids = []; 
			
			for(i in calendars) {
				if(calendars[i].is_checked) {
					ids.push(calendars[i].id);
				}
			}
			
			return ids;		
		}
		
		this.getCalendarListContainer = function() {
			return calendar_ul;
		}	
	}
	
	CalendarList.prototype = {
		/**
		 * Adds a calendar to the calendar list.
		 *
		 * @param     calendar[]     calendar     The calendar to be added.
		 */
		addCalendars: function(calendars) {
			for(x in calendars) {
				this.addCalendar(calendars[x]);
			}
			
			return this;
		}
	};
	
	var instance = null;
	
	/**
	 * The instance of calendar list.
	 */
	CalendarList.instance = function(){
		if(null == instance) {
			instance = new CalendarList();
		}
		
		return instance;
	}
})();