
var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

(function($) {

  BaseCalendarViewManager = function() { 
    var provider = null;
    var buttonManager = null;
    var template = "";
    var callback = function(obj, e) {};
    var me = this;
    
    /**
     * The abstract navigation handler.
     */
    this.navigationHandler = function(key, c) {
      var date = (provider) ? provider.getDate() : new Date();
      var today = (provider) ? provider.getToday() : new Date();
      var d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());  
      
      date = me.applyDateChanged(key, today, date);
      provider.setDate(date);
      
      if ((date.getFullYear() == d2.getFullYear()) && (date.getMonth() == d2.getMonth())) {
        me.updateUI(c);
      }
      else {
        dataProvider.updateData(function() {
          me.updateUI(c);
        });
      }
    };

    /**
     * Sets the button manager to be used.
     */
    this.setButtonManager = function(manager) {
      buttonManager = manager;
      
      return me;
    };
    
    /**
     * Returns the template.
     */
    this.getButtonManager = function() {
      return buttonManager;
    };
   
    /**
     * Sets the template to be used.
     */
    this.setTemplate = function(t) {
      template = t;
      
      return me;
    };
    
    /**
     * Returns the template.
     */
    this.getTemplate = function() {
      return template;
    };
    
    /**
     * Sets the data provider.
     */
    this.setDataProvider = function(p) {
      provider = p;
       
      return me;
    };
    
    /**
     * Returns the data provider.
     */
    this.getDataProvider = function() {
      return provider;
    }
    
    /**
     * Sets the listener or callback function to be called whenever there is an event in which the Add Event form is needed. 
     */
    this.setCallback = function(c) {
      if ("function" == typeof(c) || ("string" == typeof(c) && "function" == eval('typeof(' + c + ')'))) {
        callback = c;
      }
    };
    
    /**
     * Returns the listener or callback function.
     */
    this.getCallback = function() {
      return callback;
    };
    
    /**
     * Updates the calendar UI.
     */
    this.updateUI = function(c) { 
      if (buttonManager) {
        if (me.showTodayNavigation(provider.getToday(), provider.getDate())) {
          buttonManager.setNavigationButtonCss('today', 'display', '');
        }
        else {
          buttonManager.setNavigationButtonCss('today', 'display', 'none');
        }
      }
      
      me.paint(provider, provider.getToday(), provider.getDate(), template, callback);

	  if ($('#view_all_events').css('display') == 'block') {
		me.paint2(provider, provider.getDate(), template, callback);
	  }
      
      if ('function' == typeof(c) || ('string' == typeof(c) && 'function' == eval('typeof(' + c + ')'))) {
        c();
      }
    };
    
    /**
     * This should be overriden by sub classes.
     * 
     * @param      CalendarEventDataProvider         provider     The data provider.
     * @param      Date                              today        The date today based on the timezone of the current user.
     * @param      Date                              date         The current active date.
     * @param      string                            template     Serves as the template of the event element.
     * @param      CalendarControlButtonsManager     manager     The control buttons manager.
     * @param      function                          callback     The listener or callback function.
     * @return     void 
     */
    this.paint = function(provider, today, date, template, manager, callback) {};

	/**
     * This should be overriden by sub classes.
     * 
     * @param      CalendarEventDataProvider         provider     The data provider.
     * @param      Date                              today        The date today based on the timezone of the current user.
     * @param      string                            template     Serves as the template of the event element.
     * @param      CalendarControlButtonsManager     manager     The control buttons manager.
     * @param      int                         		 id     	 The id of the container
     * @return     void 
     */
	this.paint2 = function(provider, curr_date, template, listener) {};

    /**
     * This should be overriden by sub classes.
     * 
     * @param      string                            key         The key with values previous, today, and next.
     * @param      Date                              today       The date today based on the timezone of the current user.
     * @param      Date                              date        The current active date.
     * @return     void 
     */
    this.applyDateChanged = function(key, today, date) {};
    
    /**
     * This should be overriden by sub classes.
     * 
     * @param      string                            key         The key with values previous, today, and next.
     * @param      Date                              today       The date today based on the timezone of the current user.
     * @param      Date                              date        The current active date.
     * @return     void 
     */
    this.showTodayNavigation = function(today, date) { return true; };   
  };
  
})(jQuery);