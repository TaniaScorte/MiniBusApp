(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminJourneyController', AdminHomeController);

        AdminJourneyController.$inject = ['UserService', '$rootScope', '$scope'];


    function AdminJourneyController(UserService, $rootScope, $scope) {
        var vm = this;

       

    }


})();