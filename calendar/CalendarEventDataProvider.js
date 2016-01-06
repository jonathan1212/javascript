(function($) {

  function CalendarEventDataProvider() {
    var url = ""; 
    var data = [];
    var date = new Date();
    var calendarProvider = null;
    var today = new Date();
    
    /**
     * Set the date today based on the user's timezone. This is the today global definition of calendar.
     */
    this.setToday = function(t) {
      today = t;
      
      return this;
    }
    
    /**
     * Returns the date today.
     */
    this.getToday = function() {
      return today;
    }
    
    /**
     * Sets the url where the data of the events will be get.
     */
    this.setUrl = function(u) {
      url = u;
      
      return this; 
    };
    
    /**
     * Returns the url where the data of the events will be get.
     */
    this.getUrl = function() {
      return url;
    };
    
    /**
     * Sets the provider of calendar data.
     */
    this.setCalendarProvider = function(p) {
      if ('function' == typeof(p) || ('string' == typeof(p) && 'function' == eval("typeof(" + p + ")"))) {
        calendarProvider = p;
      }
      
      return this;
    };
    
    /**
     * Returns the provider of calendar data.
     */
    this.getCalendarProvider = function() {
      return calendarProvider;
    };
    
    /**
     * Retrieves the data.
     *
     * @param      int     year     Retrieves events that fall in this year.
     * @param      int     month    Retrieves events that fall in this month.
     * @param      int     week     Retrieves event that fall in this week. If this is null retrieves the events that fall to the month and year only.
     * @param      int     date     Retrieves event that fall in this date. If this is null retrieves the events that fall to the month and year only.
     */
    this.getData = function(year, month, week, date) {
      var ret_data = [];
      
      for (i in data) { 
        if (data[i].start_date.year == year && (data[i].start_date.month - 1) == month) {
          if (week) {
            if (week == data[i].start_date.week) {
              ret_data.push(data[i]);
            }
          }
          else if (date) {
            if (date == data[i].start_date.date) {
              ret_data.push(data[i]);
            }      
          }
          else {
            ret_data.push(data[i]);
          } 
        }
      }
      
      return ret_data;
    };
    
    this.setDate = function(d) {
      date = d;
      
      return this;
    };
    
    this.getDate = function() {
      return date;
    };
    
    this.updateData = function(callback) {
      calendars = (calendarProvider) ? calendarProvider() : [];
      $.get(url, "date=" + (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()) + "&calendars=[" + calendars.toString() + "]", function(d) {
        data = d;
        
        if ('function' == typeof(callback) || ('string' == typeof(callback) && 'function' == eval('typeof(' + callback + ')'))) {
          callback(data);
        }
      }, "json");
      
      return this; 
    };
  };
  
  var instance = null;
  
  window.CalendarEventDataProvider =  {
    getInstance: function() {
      if (null == instance) {
        instance = new CalendarEventDataProvider();
      }
      
      return instance;
    }
  };
  
})(jQuery);