'use strict';

angular.
    module('post').
        factory('Post', function($resource){
            var url = '/api/posts/:slug'
            return $resource(url, {}, {
                query: {
                    method: "GET",
                    params: {},
                    isArray: true,
                    cache: false,
                    transformResponse: function(data, headerGetter, status) {
                        var finalData = angular.fromJson(data)
                        return finalData.results
                    }
                    // interceptor
                },
                get: {
                    method: "GET",
                    params: {"slug": @slug},
                    isArray: false,
                    cache: false,
                }
            })

        });