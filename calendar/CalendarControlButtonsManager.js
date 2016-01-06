(function($) {

  function CalendarControlButtonsManager() {
    var viewHandler = function() {};
    var navigationHandler = function() {};
    
    /**
     * Sets the css of a view button.
     */
    this.setViewButtonCss = function(key, attr, val) {
      $("#" + key + "CalendarControlButton").css(attr, val);
    }
    
    /**
     * Sets the css of a navigation button.
     */
    this.setNavigationButtonCss = function(key, attr, val) {
      $("#" + key + "CalendarControlButton").css(attr, val);      
    }
    
    /**
     * Sets the listener or callback function if calendar view(Day, Week, Month) buttons is clicked.
     */
    this.setViewHandler = function(h) {
      if (("function" == typeof(h)) || ("string" == typeof(h) && "function" == typeof(h))) {
        viewHandler = h;
      } 
      
      return this;
    };
    
    /**
     * Returns the view handler.
     */
    this.getViewHandler = function() {
      return viewHandler;
    };
    
    /**
     * Sets the listener or callback function if calendar navigation(Previous, Today, Next) buttons is clicked.
     */
    this.setNavigationHandler = function(h) {
      if (("function" == typeof(h)) || ("string" == typeof(h) && "function" == typeof(h))) {
        navigationHandler = h;
      } 
        
      return this;
    };
    
    /**
     * Returns the navigation handler.
     */
    this.getNavigationHandler = function() {
      return navigationHandler;
    };
    
    // Attach listeners to view and navigation buttons
    
    // Attach the event to view buttons
    $('.calendarViewControlButton').click(function(e) {
      var me = this;
      
      viewHandler($(this).attr('key'), function() { 
        $('.calendarViewControlButton').removeClass("selected");
        $(me).addClass("selected");
      });
    });

    // Attach the event to navigation buttons
    $('.calendarNavigationControlButton').click(function(e) {
      var me = this;
      
      navigationHandler($(this).attr('key'), function() {});
    });
  }
  
  var instance = null;
  
  window.CalendarControlButtonsManager = {
    
    /**
     * Create a singleton implementation for CalendarControlButtonsManager.
     */
    getInstance: function() {
      if (null == instance) {
        instance = new CalendarControlButtonsManager();
      }
      
      return instance;
    }
  };
  
})(jQuery);