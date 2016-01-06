(function($) {

  function CalendarDayViewManager() { 
    this.inheritFrom = BaseCalendarViewManager;
    this.inheritFrom();
    
    var me = this;
    
    /**
     * Overriden method from BaseCalendarViewManager.
     */
    this.showTodayNavigation = function(today, date) {
      return (!(today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear() && today.getDate() == date.getDate()));
    };
    
    /**
     * Overriden method from BaseCalendarViewManager.
     */
    this.applyDateChanged = function(key, today, date) {
      switch (key) {
        case "previous":
          date.setDate(date.getDate() - 1);
        break;
        
        case "today":
          date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());          
        break;
        
        case "next":
          date.setDate(date.getDate() + 1);          
        break;
      }
      
      return date;
    };
    
    /**
     * Overriden method from BaseCalendarViewManager.
     */
    this.paint = function(provider, today, date, template, listener) {
      $('.calendarView').css('display', 'none');
      $('#calendarDayViewContainer').css('display', '');
      $('.dayViewEventsContainer').html("");
      $('.dayViewCellContainer').removeClass('done');
      $('.dayViewCellContainer').css('background-color', '');

	  // START: for calendar printing
	  	PrintCalendarManager.setStartDate(date);
		PrintCalendarManager.setViewType('day');
	  // END

      var data = provider.getData(date.getFullYear(), date.getMonth(), null, date.getDate());
      
      $('#dayViewMainHeaderContainer').html(month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
      
      // higlights to date
      if (today.getFullYear() == date.getFullYear() && today.getDate() == date.getDate() && today.getMonth() == date.getMonth()) { 
        var j = 0;
        
        for (; j < today.getHours(); j++) {
          $('#dayViewCellContainer_' + j).addClass('done');
        }
        
        $('#dayViewCellContainer_' + j).css('background-color', '#EAEFF7');   
      }
      else if (date < today) {
        for (var j = 0; j < 24; j++) {
          $('#dayViewCellContainer_' + j).addClass('done');
        }
      }
      
      // Set the date attribute
      for (var j = 0; j < 24; j++) {
        var hour = (10 < j) ? '' + j : '0' + j; 
        $('#dayViewAddEventButton_' + j).attr('date', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + hour + ':' + date.getMinutes() + ':' + date.getSeconds());
      }
      
      // Sets the event data
      for (x in data) {
        var hour = (0 == (data[x].start_date.hour % 12)) ? 12 : (data[x].start_date.hour % 12);
        var str = template.replace(/%time%/g, hour + ":" + data[x].start_date.minutes + " " + data[x].start_date.meridiem);
        str = str.replace(/%title%/g, data[x].title);
        str = str.replace(/%link%/g, '');
        str = str.replace(/%calendar_event_html_id%/g, 'dayViewEventBubbleContainer_' + data[x].id);
        str = str.replace(/%calendar_event_html_id%/g, 'dayViewEventBubbleContainer_' + data[x].id);
        str = str.replace(/%color_code%/g, data[x].color_code);
        str = str.replace(/%event_id%/g, data[x].id);
        str = str.replace(/%date%/g, data[x].start_date.year + '-' + data[x].start_date.month + '-' + data[x].start_date.date + ' ' + data[x].start_date.hour + ':' + data[x].start_date.minutes + ':00');
        str = str.replace(/%calendar_event_title_id%/g, 'dayViewCalendarEventTitle_' + data[x].id);
        str = str.replace(/%num_days%/g, (data[x].is_spanned) ? data[x].spanned_date + ' days' : '');
        str = str.replace(/%category%/g, data[x].category);
        str = str.replace(/%calendar_event_note_id%/g, 'dayViewCalendarNoteId_' + data[x].id);
        str = str.replace(/%notes%/g, data[x].notes);
        str = str.replace(/%has_notes%/g, (0 < data[x].notes.length));
        str = str.replace(/%cell_id%/g, data[x].start_date.hour);   
        $('#dayViewEventsContainer_' + data[x].start_date.hour).append(str);
      }
      
      // Attach listeners
      
      $('.dayViewAddEventButton').click(function(e) {
        var top = ($(this).innerHeight() / 2) + 4;
        var left = $(this).innerWidth() + 2;
        
        $('.dayViewAddEventButton').css('display', 'none');
        $('#dayViewAddEventButton_' + $(this).attr('cell_id')).css('display', '');
        $('.isFormShownVar').val('false'); 
        $('#isFormShown_' + $(this).attr('cell_id')).val('true');
        $('.viewCalendarCellLoader').css('display', 'none');
        $('#dayViewCalendarCellLoader_' + $(this).attr('cell_id')).css('display', '');
      
        listener(this, e, top, left, me);
      });
      
      $('.dayViewEventTitle').dblclick(function(e) {
        var top =  (($("#dayViewCalendarEventTitle_" + $(this).attr('event_id')).innerHeight() + 12) / 2) + 14;
        var left = $("#dayViewCalendarEventTitle_" + $(this).attr('event_id')).innerWidth() + 3;
        
        $('.viewCalendarCellLoader').css('display', 'none');
        $('#dayViewCalendarCellLoader_' + $(this).attr('cell_id')).css('display', '');
        
        listener(this, e, top, left, me);
      });
    };
  };
  
  var instance = null;

  window.CalendarDayViewManager = {
    getInstance: function() {
      if (null == instance) {
        instance = new CalendarDayViewManager();
      }
      
      return instance;
    }
  };
  
})(jQuery);