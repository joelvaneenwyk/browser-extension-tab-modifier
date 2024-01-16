app.factory('Rule', function () {
    class rule {
        constructor(properties) {
            this.name = null;
            this.detection = 'CONTAINS';
            this.url_fragment = null;
            this.tab = {
                title: null,
                icon: null,
                pinned: false,
                protected: false,
                unique: false,
                muted: false,
                title_matcher: null,
                url_matcher: null,
            };

            angular.extend(this, properties);
        }

        setModel(obj) {
            angular.extend(this, obj);
        }
    }

    return rule;
});
