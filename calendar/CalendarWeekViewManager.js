(function($) {
  /**
   * The class that manages the week view of the calendar.
   *
   */
  function CalendarWeekViewManager()  { 
    this.inheritFrom = BaseCalendarViewManager;
    this.inheritFrom();
    
    var me = this;
    
    /**
     * Overriden method from BaseCalendarViewManager.
     */
    this.showTodayNavigation = function(today, date) {
      if (today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear()) {
        var d1 = today.getDate() - today.getDay();
        
        if (date.getDate() >= d1 && date.getDate() < d1 + 7) {
          return false;
        }
      }
      
      return true;
    };
    
    /**
     * Overriden method from BaseCalendarViewManager.
     */
    this.applyDateChanged = function(key, today, date) {
      switch (key) {
        case "previous":
          date.setDate(date.getDate() - 7);
        break;
        
        case "today":
          date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());          
        break;
        
        case "next":
          date.setDate(date.getDate() + 7);          
        break;
      }
      
      return date;
    };
    
    /**
     * Overriden method from BaseCalendarViewManager.
     */
    this.paint = function(provider, today, date, template, listener) {
      var d2 = new Date(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes(), date.getSeconds());  
      var data = dataProvider.getData(date.getFullYear(), date.getMonth(), Math.ceil((d2.getDay() + date.getDate()) / 7));

      $('.weekViewCellContainer').removeClass('selected');
      $('.calendarView').css('display', 'none');
      $('.weekViewEventsContainer').html("");
      $('#weekViewMainHeaderContainer').html(date.getFullYear());
      $('#calendarWeekViewContainer').css('display', '');
      
      d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
      d2.setDate(date.getDate() - date.getDay());

	  // START: for calendar printing
	  	PrintCalendarManager.setStartDate(d2);
		PrintCalendarManager.setViewType('week');
	  // END

      for (var i = 0; i < 7; i++) { 
        $('#weekViewHeaderContainer_' + i).html(weekday[i] + ', ' + month[d2.getMonth()] + " " + d2.getDate());
      
        for (var j = 0; j < 24; j++) {
          var hour = (j < 10) ? '0' + j : '' + j;
          $('#weekViewCellContainer_' + j + '_' + i).attr('date', d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate() + ' ' + hour + ':00:00');
          
          if (d2.getDate() == today.getDate() && d2.getMonth() == today.getMonth() && d2.getFullYear() == today.getFullYear() && j == today.getHours()) {
            $('#weekViewCellContainer_' + j + '_' + d2.getDay()).addClass('selected');
          }
        }
        d2.setDate(d2.getDate() + 1);
      }
      
      for (x in data) {
        var hour = (0 == (data[x].start_date.hour % 12)) ? 12 : (data[x].start_date.hour % 12);
        var str = template.replace(/%time%/g, hour + ":" + data[x].start_date.minutes + " " + data[x].start_date.meridiem);
        str = str.replace(/%title%/g, data[x].title);
        str = str.replace(/%calendar_event_html_id%/g, 'weekViewEventBubbleContainer_' + data[x].id);
        str = str.replace(/%calendar_event_html_id%/g, 'weekViewEventBubbleContainer_' + data[x].id);
        str = str.replace(/%color_code%/g, data[x].color_code);
        str = str.replace(/%event_id%/g, data[x].id);
        str = str.replace(/%row%/g, data[x].start_date.hour);
        str = str.replace(/%col%/g, data[x].start_date.day);
        str = str.replace(/%date%/g, data[x].start_date.year + '-' + data[x].start_date.month + '-' + data[x].start_date.date + ' ' + data[x].start_date.hour + ':' + data[x].start_date.minutes + ':00');
        str = str.replace(/%calendar_event_title_id%/g, 'weekViewCalendarEventTitle_' + data[x].id);
        str = str.replace(/%num_days%/g, (data[x].is_spanned) ? data[x].spanned_date + ' days' : '');
        str = str.replace(/%category%/g, data[x].category);
        str = str.replace(/%calendar_event_note_id%/g, 'weekViewCalendarNoteId_' + data[x].id);
        str = str.replace(/%notes%/g, data[x].notes);
        str = str.replace(/%has_notes%/g, (0 < data[x].notes.length));
        
        $('#weekViewEventsContainer_' + data[x].start_date.hour + '_' + data[x].start_date.day).append(str); 
      }
      
      // Attach listeners for each cell
      $('.weekViewCellContainer').dblclick(function(e) {
        $('#weekViewCalendarCellLoader_' + $(this).attr('row') + '_' + $(this).attr('col')).css('display', '');
        var top = e.pageY - $(this).offset().top;
        var left = e.pageX - $(this).offset().left;
        
        listener(this, e, top, left, me);
      });
      
      $('.weekViewEventsData').dblclick(function(e) {
        e.stopPropagation();
        
        $('#weekViewCalendarCellLoader_' + $(this).attr('row') + '_' + $(this).attr('col')).css('display', '');
        var top =  $("#weekViewCalendarEventTitle_" + $(this).attr('event_id')).innerHeight() / 2 + 20;
        var left = $("#weekViewCalendarEventTitle_" + $(this).attr('event_id')).innerWidth() + 3;
        
        listener(this, e, top, left, me);
      });
    };
  };
  
  var instance = null;

  window.CalendarWeekViewManager = {
    getInstance: function() {
      if (null == instance) {
        instance = new CalendarWeekViewManager();
      }
      
      return instance;
    }
  };
  
})(jQuery);