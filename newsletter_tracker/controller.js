var newsLetterControllers = angular.module('newsLetterControllers',['angular-lodash','ngProgress', 'angucomplete']);

newsLetterControllers.controller('ReadersController',['$scope','$http','$routeParams','$location','ngProgress',function($scope,$http,$routeParams,$location,ngProgress) {
    ngProgress.start();
    var params = {
        'page': $routeParams.page,
        'nID' : $routeParams.nID,
        'email': $routeParams.email
    }
    $scope.params = params;

    $http.get('/admin.php/newsletter_tracker/searchReader', { params: params } ).success(function(data){
        ngProgress.complete();

        $scope.readers = data;

        $scope.noRecords = _.isEmpty(data['objects']) ? true: false;

        $scope.firstpageClass = function(){
            if (data['page'] == 1) {
                return 'disabled';
            }
            return '';
        }

        $scope.nID = data['nID'];

        $scope.lastpageClass = function(){
            if(data['page'] == data['lastpage'])
                return 'disabled';
            return '';
        }

        $scope.isActive = function(page){
            if (page == data['page'])
                return 'active';
            return '';
        }

        $scope.reader = { email: data['email'] };


        $scope.readerBaseUrl = application['options'].readerBaseUrl;
    })
    .error(function(data, status, headers, config) {

            console.log('meada error');
            console.log(data);
            console.log(status);
            console.log(headers);

    });

    $scope.onFormSubmit = function(reader){
    	console.log( reader.email);
        $location.path( '/search/'+params['nID']+'/'+reader.email ); //.search(params);
    }


}]);

newsLetterControllers.controller('CalendarController',['$scope','$http','$q','$routeParams','$location','ngProgress','NLCalendarService',function($scope,$http,$q,$routeParams,$location,ngProgress,NLCalendarService) {
    ngProgress.start();
    var params = {
        'start'     : $routeParams.start,
        'end'       : $routeParams.end,
        'clientID'   : $routeParams.clientID,
        'page'      : $routeParams.page
    }

    var data = [];
    $scope.newsletter_calendar = [];
    $scope.nlpager = [];
    $scope.danger = false;

    var pendingRequest = null;

    loadNLCalendars(params);


    $scope.abortRequest = function() {
        console.log('abort');
        console.log(pendingRequest);

        return( pendingRequest && pendingRequest.abort() );

    };
    function loadNLCalendars( params ) {
        
        if ( pendingRequest ) {
            console.log('aborted');
            pendingRequest.abort();
                
        }

        pendingRequest = NLCalendarService.getCalendar( params );

        // Handle data response.
        pendingRequest.then(
            function( results ) {
                ngProgress.complete();
                var data = results['newsletter'];

                $scope.newsletter_calendar = data;
                $scope.nlpager = results['pager'];    

                $scope.noRecords = _.isEmpty(data) ? true: false;

                $scope.filterNewsLetter = function(file){
                    $scope.search = file.ID;
                }

                $scope.nlclass = function(description){
                    if(description == 'extra')
                        return 'cnl';
                    return 'rnl'
                }


                $scope.firstpageClass = function(){
                    if ($scope.nlpager['page'] == 1) {
                        return 'disabled';
                    }
                    return '';
                }

                $scope.nID = data['nID'];

                $scope.lastpageClass = function(){
                    if($scope.nlpager['page'] == data['lastpage'])
                        return 'disabled';
                    return '';
                }

                $scope.isActive = function(page){
                    if (page == $scope.nlpager['page'])
                        return 'active';
                    return '';
                }

                $scope.firstPagerLink = function(nlpager,page){

                    var params = "";
                    var link = "calendarpage";
                    if ( !_.isUndefined(nlpager['from']) ) {
                        params = nlpager.from+'/'+nlpager.to;
                        link = 'date';
                    }
                    else if ( !_.isNull(nlpager['clientID']) ) {
                        params = nlpager.clientID;
                    }

                    return '#/'+link+'/'+page+'/'+params;

                }

                 $scope.actionButton = function($event) {

                    $event.stopPropagation();

                    var listactionclass = $($event.target).parents('div').attr('class');
                    var $currentTarget = angular.element($event.currentTarget);
                    var $ul = $currentTarget.next();
                    var $button = $currentTarget;
    
                     $('.'+listactionclass+' button').removeClass('active');  
                    
                    if ($ul.is(':visible')) {
                        $ul.slideUp();
                    } else {
                        $button.addClass('active');
                        $('.'+listactionclass+' ul').hide();
                        $ul.slideToggle();
                    }

                }
                
            },

            function( code ) {
                ngProgress.complete();
                $scope.danger = true;

                console.log('danger');
                console.warn( "Calendar couldn't be loaded." );
            }
        );

        //pendingRequest.abort();

    };



}]);


newsLetterControllers.controller('MoreController',['$scope','$http','$routeParams','$location',function($scope,$http,$routeParams,$location) {

}]);


newsLetterControllers.controller('NLController',['$scope','$http','$routeParams','$location','ngProgress',function($scope,$http,$routeParams,$location,ngProgress) {
    ngProgress.start();

    var params = {
        'date'     : $routeParams.date
    }
    $scope.danger = false;
    
    $http.get('/admin.php/newsletter_tracker/getNL', { params: params }).success(function(data){
        ngProgress.complete();

        $scope.nls = data;
        $scope.infonls = data['nls']['info'];
        $scope.noRecords = _.isEmpty(data['nls']['features']) ? true: false;

        $scope.overAllTotal = function(){

             var columnCount = 0;
             var introCount = 0;
             var featuresCount = 0;
             var sublinks = 0;
             var item = data['nls'];

             for (var b in item['features']){
                featuresCount = featuresCount + parseInt(item['features'][b].Views);
             }

             if(item['info'].Description != 'extra') {

                introCount = _.isNull(item['intro'])  ? 0 : parseInt(item['intro'].Views);

                 for (var x in item['columnLinks']) {

                     for (var y in item['columnLinks'][x]) {
                        columnCount = columnCount + parseInt(item['columnLinks'][x][y].Views);
                     }
                 }

                 for (var c in item['sublinks']) {
                    sublinks = sublinks + parseInt(item['sublinks'][c].Views);
                 }

                 return columnCount + sublinks + featuresCount + introCount;

            }
            else {
                return featuresCount;
            }
         }

         $scope.totalSublinks = function(sublinks){
            return totalCounts(sublinks);
         }

         $scope.totalMainFeatures = function(features){
            return totalCounts(features);
         }

         $scope.totalColumn = function(categories){
            return totalCounts(categories);
         }

        $scope.notSorted = function(obj){
            if (!obj) {
                return [];
            }
            return Object.keys(obj);
        }

        $scope.isCnl = function(param){
            if (param == 'binary') {
                if ( $scope.infonls['Description'].trim() == 'extra') 
                     return false;
                return true;
            }else if(param == 'cols2') {
                if ( $scope.infonls['Description'].trim() == 'extra') 
                    return 'colspan="2"';
                return "";
            }else if(param == 'width') {
                if ( $scope.infonls['Description'].trim() == 'extra') 
                    return '35%';
                return '25%';
            }

            return "";
        }

        var totalCounts = function(column) {
            var total = 0;
            for ( var x in column) {
                total = total +  parseInt(column[x].Views);
            }
            return total;
        }


    })
    .error(function(data, status, headers, config) {

        ngProgress.complete();
        $scope.danger = true;

    });

    }]);


newsLetterControllers.controller('SearchController',['$scope','$http','$routeParams','$location','ngProgress',function($scope,$http,$routeParams,$location,ngProgress) {
    ngProgress.start();

    var params = {
        'start'     : $routeParams.start
    };

    var date  = new Date();
    var daysAgo = _.clone(date);

    daysAgo.setDate(daysAgo.getDate() - daysAgo.getDay());

    if(_.isUndefined(params['start'])){
        $scope.range['start'] = daysAgo.getFullYear() +'-'+ (daysAgo.getMonth() + 1) + '-'+ daysAgo.getDate();
        $scope.range['end'] = date.getFullYear() +'-'+ (date.getMonth() +1 ) + '-'+ date.getDate();
    }else{
        $scope.range['start'] = params['start'];
        $scope.range['end'] = params['end'];
    }

    this.searchByInstName = function(client,$event){

        if(!_.isUndefined(client)) {
            $location.path( '/client/'+client['originalObject'].id);

            $($event.target).parent().toggleClass('expanded');

        }
    }

    this.searchByRange = function(range,$event){

        $location.path( '/date/'+range['start']+'/'+range['end']);

        $($event.target).parent().toggleClass('expanded');

    }

}]);


//service
newsLetterControllers.service(
    "NLCalendarService",
    function( $http, $q, $rootScope ) {

        // ---
        // PUBLIC METHODS.
        // ---
       
        // I get the friend with the given ID.
        function getCalendar( params ) {

            var deferredAbort = $q.defer();
            
            var request = $http({
                method: 'get',
                url: '/admin.php/newsletter_tracker/getCalendar',
                params: params,
                timeout: deferredAbort.promise
            });


            var promise = request.then(
                function ( response ) {

                    return( response.data );

                },
                function ( response ) {

                    return( $q.reject( response.status ) );

                }
            );

             // abort the underlying AJAX request.
            promise.abort = function() {

                deferredAbort.resolve();

            };

            // Since we're creating functions and passing them out of scope,
            // we're creating object references that may be hard to garbage
            // collect. As such, we can perform some clean-up once we know
            // that the requests has finished.
            promise.finally(
                function() {

                    console.info( "Cleaning up object references." );

                    promise.abort = angular.noop;

                    deferredAbort = request = promise = null;

                }
            );

            return( promise );
        }

        // Return the public API.
        response = {
            getCalendar: getCalendar
        }

       return response;


    }
);