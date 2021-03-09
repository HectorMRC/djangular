'use strict';

angular.
    module('core.comment').
        factory('Comment', function(LoginRequiredInterceptor, $cookies, $location, $httpParamSerializer, $resource){
            var url = '/api/comments/:id/'
            var comment_query = {
                url: url,
                method: "GET",
                params: {},
                isArray: true,
                cache: false,
                transformResponse: function(data, headerGetter, status) {
                    var finalData = angular.fromJson(data)
                    return finalData.results
                }
            }

            var commentGet = {
                method: "GET",
                params: {"id": "@id"},
                isArray: false,
                cache: false,
                //interceptor: {responseError: function(response) {
                //    if (response.status = 404) {
                //        $location.path('/404')
                //    }
                //}}
            }

            var commentCreate = {
                url: '/api/comments/create/',
                method: "POST",
                interceptor: {responseError: LoginRequiredInterceptor}
                // params: {"id": "@id"},
                // isArray: false,
                // cache: false,
            }

            var commentDelete = {
                url: '/api/comments/:id/',
                method: "DELETE",
                interceptor: {responseError: LoginRequiredInterceptor}
                //params: {"id": "@id"},
                // isArray: false,
                // cache: false,
            }

            var commentUpdate = {
                url: '/api/comments/:id/',
                method: "PUT",
                interceptor: {responseError: LoginRequiredInterceptor},
                //params: {"id": "@id"},
                // isArray: false,
                // cache: false,
            }

            var token = $cookies.get("token")
            if (token) {
                commentCreate["headers"] = {"Authorization": "JWT " + token}
                commentDelete["headers"] = {"Authorization": "JWT " + token}
                commentUpdate["headers"] = {"Authorization": "JWT " + token}
            }

            return $resource(url, {}, {
                query: comment_query,
                get: commentGet,
                create: commentCreate,
                delete: commentDelete,
                update: commentUpdate,
            })

        });