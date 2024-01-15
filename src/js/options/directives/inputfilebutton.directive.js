app.directive('inputFileButton', function () {
    return {
        restrict: 'E',
        link: function (scope, elem) {
            const button = elem.find('button');
            const input = elem.find('input');

            input.css({ display: 'none' });

            button.bind('click', function () {
                input[0].click();
            });
        },
    };
});
