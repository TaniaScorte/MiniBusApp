(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

        UserService.$inject = ['$timeout', '$filter', '$q','$http','$rootScope'];
        function UserService($timeout, $filter, $q,$http,$rootScope) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;
      
        function GetAll() {
            var deferred = $q.defer();
            $http.get('http://api.mellevas.com.ar/usuarios/getusuarios?empresaid=1',headers)
            .then(function(response){
               deferred.resolve(response.data);
            })
            .catch(function(response){
              deferred.reject(response);
            });
            return deferred.promise;
        }

        function GetById(id,token) {
            var deferred = $q.defer();
            var urlUserGetId ='http://www.mellevas.com.ar/api/usuarios/getusuario?id=';   
            
            var req = {
                method: 'GET',
                url: urlUserGetId + id + "&token=" + 2019,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
               }
               
            $http(req)
                .then(function(response){
                    deferred.resolve(response);
                })
                .catch(function(error){
                    deferred.reject("Error al iniciar");
                });
                return deferred.promise;
        }

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();
            var data ={
                Nombre: user.name,
                Apellido: user.surname,
                TipoDni: user.dnitype.Id,
                Dni: user.dni,
                Email: user.email,
                Clave: user.password,
                Telefono: user.tel,
                EmpresaId: 0,
                RolId:1,
                Token: "2019",
            }
            var urlUserCreate ='http://www.mellevas.com.ar/api/usuarios/create';   
            
            var req = {
                method: 'POST',
                url: urlUserCreate,
                data: data
               }
               
            $http(req)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al crear el usuario");
                });
                return deferred.promise;
        }

        function Update(user) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getUsers() {
                var deferred = $q.defer();
                $http.get('usuarios/getusuarios',headers)
                .then(function(response){
                   deferred.resolve(response.data);
                })
                .catch(function(response){
                  deferred.reject(response);
                });
                return deferred.promise;
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }
    }
})();