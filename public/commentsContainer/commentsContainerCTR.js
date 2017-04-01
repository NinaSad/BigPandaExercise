/**
 * Created by nina on 3/24/17.
 */
'use strict';

angular.module('myApp.commentsContainer', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/commentsContainer', {
            templateUrl : 'commentsContainer/commentsContainer.html',
            controller  : 'commentsContainerCTR'
        });
    }])

    .controller('commentsContainerCTR', ['$scope', '$http', function ($scope, $http) {

        $scope.newComment = {};

        //get all comments data to present
        $http({
            method : 'GET',
            url    : '/comments/all'
        }).then(function successCallback(response) {

            $scope.comments = response.data;

            //sort comment from old to new
            $scope.comments.sort(function (a, b) {
                return parseFloat(a.created) - parseFloat(b.created);
            });

        }, function errorCallback(response) {
            alert('error while getting comments data from server');
        });


        //send the new comment to the server
        function addComment(newComment) {
            $http({
                method : 'POST',
                url    : '/comments/new',
                params : {message : newComment.message, email : newComment.email}
            }).then(function successCallback(data, status, headers, config) {

                //get the relevant avatar generated in the server
                newComment.gravatar = data.data.gravatar;

                //get the curr time stamp from server
                newComment.created = data.data.created;

                //push new comment to the existing comments array
                $scope.comments.push(newComment);

            }, function errorCallback(data, status, headers, config) {

                if (data.data.message) {
                    alert(data.data.message);
                }
            });
        }

        $scope.submitNewComment = function () {
            
            //create comment object with the submitted comment data
            var newComment = {
                email   : $scope.newComment.email,
                message    : $scope.newComment.message
            };

            //validate email + comment
            addComment(newComment);
        }
    }]);