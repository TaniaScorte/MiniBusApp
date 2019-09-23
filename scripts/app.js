(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies','ngAnimate','ui.bootstrap','ngSanitize','oitozero.ngSweetAlert'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider','$httpProvider'];
    function config($routeProvider, $locationProvider,$httpProvider) {
       // $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
      //  $httpProvider.defaults.headers.common['Content-Type'] =  ' text/plain';
      // $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] =  '*';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] =  'POST, GET, DELETE, PUT'
        
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'partials/home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'partials/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'partials/register/register.view.html',
                controllerAs: 'vm'
            })
            .when('/reset-password', {
                controller: 'ResetPasswordController',
                templateUrl: 'partials/reset-password/reset-password.view.html',
                controllerAs: 'vm'
            })
            .when('/schedules', {
                controller: 'SchedulesController',
                templateUrl: 'partials/schedules/schedules.view.html',
                controllerAs: 'vm'
            })
            .when('/bus-view', {
                controller: 'BusViewController',
                templateUrl: 'partials/bus-view/bus-view.view.html',
                controllerAs: 'vm'
            })
            .when('/buy', {
                controller: 'BuyController',
                templateUrl: 'partials/buy/buy.view.html',
                controllerAs: 'vm'
            })

            .when('/user-edit', {
                controller: 'UserEditController',
                templateUrl: 'partials/user-edit/user-edit.view.html',
                controllerAs: 'vm'
            })
            .when('/user-history', {
                controller: 'UserHistoryController',
                templateUrl: 'partials/user-history/user-history.view.html',
                controllerAs: 'vm'
            })
            .when('/driver-home', {
                controller: 'DriverHomeController',
                templateUrl: 'partials/driver-home/driver-home.view.html',
                controllerAs: 'vm'
            })
            .when('/driver-map', {
                controller: 'DriverMapController',
                templateUrl: 'partials/driver-map/driver-map.view.html',
                controllerAs: 'vm'
            })
            .when('/driver-report', {
                controller: 'DriverReportController',
                templateUrl: 'partials/driver-report/driver-report.view.html',
                controllerAs: 'vm'
            })
            .when('/driver-bus', {
                controller: 'DriverBusController',
                templateUrl: 'partials/driver-bus/driver-bus.view.html',
                controllerAs: 'vm'
            })
            .when('/admin-home', {
                controller: 'AdminHomeController',
                templateUrl: 'partials/admin-home/admin-home.view.html',
                controllerAs: 'vm'
            })
            .when('/admin-routes', {
                controller: 'AdminRoutesController',
                templateUrl: 'partials/admin-routes/admin-routes.view.html',
                controllerAs: 'vm'
            })
            .when('/admin-journey', {
                controller: 'AdminJourneyController',
                templateUrl: 'partials/admin-journey/admin-journey.view.html',
                controllerAs: 'vm'
            })
            .when('/admin-drivers', {
                controller: 'AdminDriversController',
                templateUrl: 'partials/admin-drivers/admin-drivers.view.html',
                controllerAs: 'vm'
            })
            .when('/SUadmin-home', {
                controller: 'SUAdminHomeController',
                templateUrl: 'partials/SUadmin-home/SUadmin-home.view.html',
                controllerAs: 'vm'
            })


            .otherwise({ redirectTo: '/' });            
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
       
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        if (restrictedPage) {
            $location.path('/login');
        }     
    }

})();