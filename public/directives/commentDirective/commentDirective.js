app.directive('comment', function () {

    var controller = function ($scope) {
    };

    return {
        restrict    : 'E',
        templateUrl : 'directives/commentDirective/commentView.html',
        scope       : {
            email    : '=',
            message  : '=',
            gravatar : '=',
            created  : '='
        },
        controller  : controller
    };

}).filter('timeAgo', function () {
    return function (input) {
        var out = '';

        if (input != '') {
            out = moment(input).fromNow();
        }

        return out;
    };
});


