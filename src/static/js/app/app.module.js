'use strict';

angular.module('try', [
    // external
    'angularUtils.directives.dirPagination',
    'ngResource',
    'ngCookies',
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'ng-showdown',
    // internal
    'blogDetail',
    'blogList',
    'confirmClick',
    'loginDetail',
    'registerDetail',
    'tryNav',
]);