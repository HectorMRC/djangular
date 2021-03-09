'use strict';

angular
    .module('core.interceptors')
        .factory("LoginRequiredInterceptor", function($cookies, $location){
            return function(response){
                // console.log("interceptor error")
                // console.log(response)
                if (response.status == 401) {
                    var current = $location.path()
                    if (current == "/login") {
                        $location.path("/login")
                    } else {
                        $location.path("/login").search("next", current)
                    }
                }
            }
        })