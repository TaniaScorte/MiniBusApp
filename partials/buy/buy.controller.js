(function () {
    'use strict';

    angular
        .module('app')
        .controller('BuyController', BuyController);

        BuyController.$inject = ['$location','$scope','$rootScope','MapResourcesService','ResourcesService','SweetAlert','ResourcesSetService','$filter'];
    function BuyController($location,$scope,$rootScope,MapResourcesService,ResourcesService,SweetAlert,ResourcesSetService,$filter) {
        var vm = $scope;
        initController();

        function initController() {
            if(!$rootScope.paramsBuy){
                $scope.codigoqr = "";
                $location.path('/schedules');
                return;
            }
            vm.paramsBuy = $rootScope.paramsBuy;
            
            $scope.codigoqr = makeid(10);
            getParadasByRecorrido();
        }
        vm.formatDate = function(date){
            var dateOut = date.replace(/([A-Za-z)(\\/])/g, "");
            return dateOut;
        };
        vm.buyConfirm = function(){
            var codigoqr = makeid(8) + "-" + makeid(4) +"-" +makeid(4) +"-" + makeid(4) +"-" + makeid(12);
            var data = {
                qr: codigoqr,
                EmpresaId: vm.paramsBuy.empresa.Id,
                ViajeId: vm.paramsBuy.journey.Id,
                UsuarioId: $rootScope.globals.currentUser.userData.Id,
                EstadoId: 1,
                ParadaId: 50,// vm.paramsBuy.busStop.Id,
                Importe: vm.paramsBuy.recorrido.Importe,
                FechaCompra: $filter('date')(new Date, 'dd-MM-yyyy')
            };
            ResourcesSetService.SetPasaje(data)
            .then(function (response) {
                if (response.Estado == 0){
                    SweetAlert.swal ({
                        type: "success", 
                        title: "Grandioso!",
                        text: "Ya podes esperar tu MiBus!",
                        confirmButtonAriaLabel: 'Ok',
                    });   
                } 
            })
            .catch(function(error){
                SweetAlert.swal ({
                    type: "error", 
                    title: "Error",
                    text: error,
                    confirmButtonAriaLabel: 'Ok',
                });
            });
        }
        vm.backSchedules = function(){
            $rootScope.backSchedules = true;
            $location.path('/schedules');
        }
        function getParadasByRecorrido() {
            ResourcesService.GetParadasByRecorrido(vm.paramsBuy.recorrido.Id)
            .then(function (response) {
                if (response){
                   $rootScope.busStops = response; 
                   vm.paramsBuy.busStop = $rootScope.busStops[0] ;     
                } 
            })
            .catch(function(error){
                SweetAlert.swal ({
                    type: "error", 
                    title: "Error",
                    text: error,
                    confirmButtonAriaLabel: 'Ok',
                });
            });
        }
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
         
    }

})();