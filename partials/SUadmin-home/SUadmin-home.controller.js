(function () {
    'use strict';

    var SUhome = angular
        .module('app')
        .controller('SUAdminHomeController', SUAdminHomeController);
    SUAdminHomeController.$inject = ['UserService', 'SweetAlert', 'ResourcesService', 'ResourcesUpdateService', 'ResourcesDeleteService', 'ResourcesSetService', '$rootScope', '$http', '$filter', '$scope'];
    function SUAdminHomeController(UserService, SweetAlert, ResourcesService, ResourcesUpdateService, ResourcesDeleteService, ResourcesSetService, $rootScope, $http, $filter, $scope) {
        var vm = this;


        initController();

        function initController() {
            if (!$rootScope.empresas) {
                getEmpresas();
                espera(false);

            }
            if (!$rootScope.dnitypes) {
                getTiposDNI();
            }
        }
        function getEmpresas() {
            $scope.items = []; // JSON 
            $scope.filtroItems = [];
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.inicializar = function () {
                ResourcesService.GetEmpresas()
                    .then(function (response) {
                        if (response) {
                            if (response) {
                                $scope.items = response;
                                // console.log($scope.items);
                                $scope.hacerPagineo($scope.items);
                                $scope.totalItems = $scope.items.length;
                                // console.log('total items', $scope.totalItems);
                            }

                        }
                    })
                    .catch(function (error) {
                        //console.log(error);
                        SweetAlert.swal({
                            type: "error",
                            title: "Error",
                            text: error,
                            confirmButtonAriaLabel: 'Ok',
                        });
                    });
            };
            $scope.inicializar();

            $scope.hacerPagineo = function (arreglo) {
                var principio = (($scope.currentPage - 1) * $scope.numPerPage); //0, 3
                var fin = principio + $scope.numPerPage; //3, 6
                $scope.filtroItems = arreglo.slice(principio, fin); // 
            };

            $scope.buscar = function (busqueda) {
                var buscados = $filter('filter')($scope.items, function (item) {
                    return (item.Nombre.toLowerCase().indexOf(busqueda.toLowerCase()) != -1); // matches, contains
                });
                $scope.totalItems = buscados.length;
                $scope.hacerPagineo(buscados);
            };

            $scope.$watch('currentPage', function () {
                $scope.hacerPagineo($scope.items);
            });

        }

        //nueva empresa
        $scope.nueva = function () {
            var data = {
                Nombre: $scope.txtNombreNew,
                Direccion: $scope.txtDirNew,
                Cuit: $scope.txtCuitNew,
                Descripcion: $scope.txtDescNew,
                Token: "2019",
            }
            ResourcesSetService.SetEmpresa(data)
                .then(function (response) {
                    if (response.Estado == 0) {
                        CreateUser(response.id);
                    }
                })
                .catch(function (error) {
                    //  console.log(error);
                    SweetAlert.swal({
                        type: "error",
                        title: "Error",
                        text: error,
                        confirmButtonAriaLabel: 'Ok',
                    });
                });
        }

        //editar empresas
        $scope.editar = function (id) {
            espera(true);
            ResourcesService.GetEmpresa(id)
                .then(function (response) {
                    $scope.txtNombreEdit = response.Nombre;
                    $scope.txtDirEdit = response.Direccion;
                    $scope.txtCuitEdit = response.Cuit;
                    $scope.txtDescEdit = response.Descripcion;
                   // console.log(response);
                    espera(false);
                })
                .catch(function (error) {
                    console.log(error);
                    espera(false);
                    SweetAlert.swal({
                        type: "error",
                        title: "Error",
                        text: error,
                        confirmButtonAriaLabel: 'Ok',
                    });
                });

            $('#btnEditar').on('click', function () {
                if(validarEmpresa('edit')){
                    var data = {
                    id: id,
                    Nombre: $scope.txtNombreEdit,
                    Direccion: $scope.txtDirEdit,
                    Cuit: $scope.txtCuitEdit,
                    Descripcion: $scope.txtDescEdit,
                    TokenMP: '',
                    Token: '2019'
                }
                ResourcesUpdateService.UpdateEmpresa(data)
                    .then(function (response) {
                        //console.log(response);
                        getEmpresas();  
                        $('#modalEditar').modal('hide');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                }

            });

        }
        //eliminar empresa
        $scope.eliminar = function (id) {

            $('#btnEliminar').on('click', function () {
                ResourcesDeleteService.DeleteEmpresa(id)
                    .then(function (response) {
                        if (response) {
                            getEmpresas();
                            $('#modalEliminar').modal('hide');
                        }
                    })
                    .catch(function (error) {
                        SweetAlert.swal({
                            type: "error",
                            title: "Error",
                            text: error,
                            confirmButtonAriaLabel: 'Ok',
                        });
                    });

            })

        }

        function espera(e) {
            if (e == true) {
                $scope.espera = 'visible';
            } else {
                $scope.espera = 'oculto';

            }
        }

        function CreateUser(idEmpresa) {
            var data = {
                Nombre: $scope.nombre,
                Apellido: $scope.apellido,
                TipoDni: $scope.tipoDni.Id,
                Dni: $scope.dni,
                Email: $scope.email,
                Clave: $scope.clave,
                Telefono: $scope.telefono,
                EmpresaId: idEmpresa,
                RolId: 3
            }
            UserService.Create(data)
                .then(function (response) {
                    if (response.Estado == 0) {
                        SweetAlert.swal({
                            type: "success",
                            title: "La operacion se ha realizado con exito",
                            text: "El usuario ha sido creado, verifique su casilla de E-mail",
                            confirmButtonAriaLabel: 'Ok',
                        });
                        getEmpresas();
                        $('#modalNuevo').modal('hide');

                    }
                    else if (response.Estado == 50) {
                        SweetAlert.swal({
                            type: "warning",
                            title: "Verifique!",
                            text: response.Mensaje + " verifique su e-mail",
                            confirmButtonAriaLabel: 'Ok',
                        });
                    }
                    else {
                        vm.dataLoading = false;
                        SweetAlert.swal({
                            type: "error",
                            title: "Error",
                            text: "Error al crear el usuario",
                            confirmButtonAriaLabel: 'Ok',
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    SweetAlert.swal({
                        type: "error",
                        title: "Error",
                        text: error,
                        confirmButtonAriaLabel: 'Ok',
                    });
                });
        }


        function getTiposDNI() {
            ResourcesService.GetTiposDNI()
                .then(function (response) {
                    if (response) {
                        $rootScope.dnitypes = response;
                    }
                })
                .catch(function (error) {
                    SweetAlert.swal({
                        type: "error",
                        title: "Error",
                        text: error,
                        confirmButtonAriaLabel: 'Ok',
                    });
                });
        }

        $scope.siguiente = function () {
            
            if(validarEmpresa('new')){
                $scope.formEmpresa = 'formOculto';
                $scope.formUsuario = 'formVisible';
            }else{
                //alert('error');
            }
        }

        $scope.clearForm = function () {
            $scope.formEmpresa = 'formVisible';
            $scope.formUsuario = 'formOculto';
        }

        function validarEmpresa(tipo) {
            if (tipo == 'new') {
                if($scope.txtNombreNew == "" || $scope.txtNombreNew == undefined){
                    $scope.errorNewNom = true;
                    return false;
                }
                if($scope.txtDirNew == "" || $scope.txtDirNew == undefined){
                    $scope.errorNewDir = true;
                    return false;
                }
                if($scope.txtCuitNew == "" || $scope.txtCuitNew == undefined){
                    $scope.errorNewCuit = true;
                    return false;
                }
                if($scope.txtDescNew == "" || $scope.txtDescNew == undefined){
                    $scope.errorNewDesc = true;
                    return false;
                }
            }
            if (tipo == 'edit') {
                console.log($scope.txtCuitEdit);
                if($scope.txtNombreEdit == "" || $scope.txtNombreEdit == undefined || $scope.txtNombreEdit == null){
                    $scope.errorEditNom = true;
                    return false;
                }
                if($scope.txtDirEdit == "" || $scope.txtDirEdit == undefined){
                    $scope.errorEditDir = true;
                    return false;
                }
                if($scope.txtCuitEdit == "" || $scope.txtCuitEdit == undefined || $scope.txtCuitEdit == null){
                    $scope.errorEditCuit = true;
                    console.log('paso');

                    return false;
                }
                if($scope.txtDescEdit == "" || $scope.txtDescEdit == undefined || null){
                    $scope.errorEditDesc = true;
                    return false;
                }

                return true;

            }
        }

        function validarUsuario(){

        }


    }
    //filtro personalizado para fechas
    SUhome.filter('filterDate', function () {
        var cambiarFiltro = function (datosOriginales) {
            if (datosOriginales == null) {
                var nuevosDatos = 'No hay datos';

            } else {
                var millis = datosOriginales.replace(/([A-Za-z)(\\/])/g, "");
                var date = new Date(parseInt(millis));
                var hoy = new Date();
                //         console.log('hoy'+hoy.getTime()+'input'+millis);
                if (hoy.getTime() < parseInt(millis)) {
                    var nuevosDatos = 'Activo'
                } else {
                    var nuevosDatos = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                }

            }


            return nuevosDatos;
        };
        return cambiarFiltro;
    });


})();




