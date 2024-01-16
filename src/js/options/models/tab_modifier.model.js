app.factory('TabModifier', [
    'Rule',
    function (Rule) {
        const tab_modifier = function (properties) {
            this.settings = {
                enable_new_version_notification: false,
            };
            this.rules = [];

            angular.extend(this, properties);
        };

        tab_modifier.prototype.setModel = function (obj) {
            angular.extend(this, obj);
        };

        tab_modifier.prototype.addRule = function (rule) {
            this.rules.push(rule);
        };

        tab_modifier.prototype.removeRule = function (rule) {
            this.rules.splice(this.rules.indexOf(rule), 1);
        };

        tab_modifier.prototype.save = function (rule, index) {
            if (index === null || index === undefined) {
                this.addRule(rule);
            } else {
                this.rules[index] = rule;
            }
        };

        tab_modifier.prototype.build = function (data, replace_existing_rules) {
            replace_existing_rules =
                typeof replace_existing_rules !== 'undefined'
                    ? replace_existing_rules
                    : true;
            const that = this;

            if (data.settings !== undefined) {
                this.settings = data.settings;
            }

            if (replace_existing_rules === true) {
                this.deleteRules();
            }

            angular.forEach(data.rules, function (rule) {
                that.addRule(new Rule(rule));
            });
        };

        tab_modifier.prototype.sync = function () {
            chrome.storage.local.set({ tab_modifier: this });
        };

        tab_modifier.prototype.checkFileBeforeImport = function (json) {
            if (json !== undefined) {
                try {
                    const settings = JSON.parse(json);

                    if ('rules' in settings === false) {
                        return 'INVALID_SETTINGS';
                    }
                } catch (e) {
                    return 'INVALID_JSON_FORMAT';
                }

                return true;
            } else {
                return false;
            }
        };

        tab_modifier.prototype.import = function (json, replace_existing_rules) {
            replace_existing_rules =
                typeof replace_existing_rules !== 'undefined'
                    ? replace_existing_rules
                    : true;

            this.build(JSON.parse(json), replace_existing_rules);

            return this;
        };

        tab_modifier.prototype.export = function () {
            const blob = new Blob([JSON.stringify(this, null, 4)], {
                type: 'text/plain',
            });

            return (window.URL || window.webkitURL).createObjectURL(blob);
        };

        tab_modifier.prototype.deleteRules = function () {
            this.setModel({ rules: [] });

            return this;
        };

        return tab_modifier;
    },
]);
