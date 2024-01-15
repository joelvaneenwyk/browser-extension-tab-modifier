app.directive('onReadFile', [
    '$parse',
    function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                const fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeEvent) {
                    const reader = new FileReader();

                    reader.onload = function (onLoadEvent) {
                        scope.$apply(function () {
                            fn(scope, {
                                $fileContent: onLoadEvent.target.result,
                            });
                        });
                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            },
        };
    },
]);
