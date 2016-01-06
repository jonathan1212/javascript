(function($){


	application = {
		init: function(options) {
			this.options = $.extend({},options);
			
			console.log(this.options);
		} 
	}


	var myApp = angular.module('myApp',[
		'ngRoute',
		'newsLetterControllers'
	]);

	myApp.config(['$routeProvider',function($routeProvider){
		$routeProvider.
			when('/',{
				templateUrl: application['options'].listpartial,
				controller: 'CalendarController'
			}).
            when('/client/:clientID',{
                templateUrl: application['options'].listpartial,
                controller: 'CalendarController'
            }).
            when('/date/:start/:end',{
                templateUrl: application['options'].listpartial,
                controller: 'CalendarController'
            }).
            when('/date/:page/:start/:end',{
                templateUrl: application['options'].listpartial,
                controller: 'CalendarController'
            }).
            when('/calendarpage/:page/:clientID',{
                templateUrl: application['options'].listpartial,
                controller: 'CalendarController'
            }).
            when('/calendarpage/:page',{
                templateUrl: application['options'].listpartial,
                controller: 'CalendarController'
            }).
            // VIEW NL
            when('/viewNL/:date',{
                templateUrl: application['options'].nlpartial,
                controller: 'NLController'
            }).

            // READERS Controller
            when('/readers/:nID',{
                templateUrl: application['options'].readerpartial,
                controller: 'ReadersController'
            }).
            when('/page/:page/:nID/:email',{
                templateUrl: application['options'].readerpartial,
                controller: 'ReadersController'
            }).
            when('/page/:page/:nID',{
                templateUrl: application['options'].readerpartial,
                controller: 'ReadersController'
            }).
            when('/search/:nID/:email',{
                templateUrl: application['options'].readerpartial,
                controller: 'ReadersController'
            }).
            when('/more',{
                templateUrl: application['options'].readerpartial,
                controller: 'MoreController'
            }).
			otherwise({
				redirectTo: '/'
			});

	}]);


})(jQuery);