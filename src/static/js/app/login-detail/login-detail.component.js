'use strict';

angular.module('loginDetail').
    component('loginDetail', {
        templateUrl: '/api/templates/login-detail.html',
        controller: function($cookies, $http, $route, $location, $routeParams, $rootScope, $scope){
            var loginURL = '/api/users/login/'
            $scope.loginError = {}
            $scope.user = {
            }

            $scope.$watch(function(){
                if ($scope.user.password) {
                    $scope.loginError.password = ""
                } else if ($scope.user.username) {
                    $scope.loginError.username = ""
                }
            })
            var tokenExists = $cookies.get("token")
            if (tokenExists) {
                $scope.loggedIn = true
                $cookies.remove("token")
                $scope.user = {
                    username: $cookies.get("username")
                }

                window.location.reload()
            }

            $scope.doLogin = function(user) {
                //console.log(user)
                if (!user.username) {
                    $scope.loginError.username = ["This field is required"]
                }

                if (!user.password) {
                    $scope.loginError.password = ["This field is required"]
                }

                if (user.username && user.password) {
                    var reqConfig = {
                        method: "POST",
                        url: loginURL,
                        data: {
                            username: user.username,
                            password: user.password
                        },
                        headers: {}
                    }

                    var requestAction = $http.post(loginURL, user)

                    requestAction.success(function(r_data, r_status, r_header, r_config){
                        console.log(r_data) // token
                        $cookies.put("token", r_data.token)
                        $cookies.put("username", r_data.username)

                        $location.path("/")
                        $route.reload()
                        //window.location.reload()
                    })

                    requestAction.error(function(e_data, e_status, e_header, e_config){
                        // console.log(e_data) // error
                        $scope.loginError = e_data
                    })
                }
            }

            // $http.post()
        }
})