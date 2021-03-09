'use strict';

angular.
    module('core.post').
        factory('Post', function(LoginRequiredInterceptor, $cookies, $resource){
            var url = '/api/posts/:slug/:action/'
            var postQuery = {
                method: "GET",
                params: {},
                isArray: true,
                cache: false,
                transformResponse: function(data, headerGetter, status) {
                    var finalData = angular.fromJson(data)
                    return finalData.results
                }
                // interceptor
            }

            var postGet = {
                method: "GET",
                params: {"slug": "@slug"},
                isArray: false,
                cache: false,
            }

            var postUpdate = {
                method: "PUT",
                params: {
                    "slug": "@slug",
                    "action": "@action",
                },

                interceptor: {responseError: LoginRequiredInterceptor},
                cache: false,
                isArray: false,
            }

            var token = $cookies.get("token")
            if (token) {
                postUpdate["headers"] = {"Authorization": "JWT " + token}
            }

            return $resource(url, {}, {
                query: postQuery,
                get: postGet,
                update: postUpdate,
            })

        });