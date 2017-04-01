'use strict';

// Declare app level module
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.commentsContainer'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/commentsContainer'});
}]);