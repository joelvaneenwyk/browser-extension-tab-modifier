const w = window;

chrome.storage.local.get('tab_modifier', function (items) {
    if (items.tab_modifier === undefined) {
        return;
    }

    const tab_modifier = items.tab_modifier;
    let rule = null;

    const processPage = function () {
        // Check if a rule is available
        for (let i = 0; i < tab_modifier.rules.length; i++) {
            if (tab_modifier.rules[i].detection === undefined || tab_modifier.rules[i].detection === 'CONTAINS') {
                if (location.href.indexOf(tab_modifier.rules[i].url_fragment) !== -1) {
                    rule = tab_modifier.rules[i];
                    break;
                }
            } else {
                switch (tab_modifier.rules[i].detection) {
                    case 'STARTS':
                        if (location.href.startsWith(tab_modifier.rules[i].url_fragment) === true) {
                            rule = tab_modifier.rules[i];
                            break;
                        }
                        break;
                    case 'ENDS':
                        if (location.href.endsWith(tab_modifier.rules[i].url_fragment) === true) {
                            rule = tab_modifier.rules[i];
                            break;
                        }
                        break;
                    case 'REGEXP':
                        // eslint-disable-next-line no-case-declarations
                        const regexp = new RegExp(tab_modifier.rules[i].url_fragment);

                        if (regexp.test(location.href) === true) {
                            rule = tab_modifier.rules[i];
                            break;
                        }
                        break;
                    case 'EXACT':
                        if (location.href === tab_modifier.rules[i].url_fragment) {
                            rule = tab_modifier.rules[i];
                            break;
                        }
                        break;
                }
            }
        }

        // No rule available
        if (rule === null) {
            return;
        }

        /**
         * Returns the text related to the given CSS selector
         * @param selector
         * @returns {string}
         */
        const getTextBySelector = function (selector) {
            let el = document.querySelector(selector);
            let value = '';

            if (el !== null) {
                el = el.childNodes[0];

                if (el.tagName === 'input') {
                    value = el.value;
                } else if (el.tagName === 'select') {
                    value = el.options[el.selectedIndex].text;
                } else {
                    value = el.innerText || el.textContent;
                }
            }

            return value.trim();
        };

        /**
         * Update title string by replacing given tag by value
         * @param title
         * @param tag
         * @param value
         * @returns {*}
         */
        const updateTitle = function (title, tag, value) {
            if (value === '') {
                return title;
            }

            return title.replace(tag, value);
        };

        /**
         * Process new title depending on current URL & current title
         * @param current_url
         * @param current_title
         * @returns {*}
         */
        const processTitle = function (current_url, current_title) {
            let title = rule.tab.title;
            let matches = title.match(/\{([^}]+)}/g);
            let i;

            // Handle curly braces tags inside title
            if (matches !== null) {
                let selector;
                let text;

                for (i = 0; i < matches.length; i++) {
                    selector = matches[i].substring(1, matches[i].length - 1);
                    text = getTextBySelector(selector);
                    title = updateTitle(title, matches[i], text);
                }
            }

            // Handle title_matcher
            if (rule.tab.title_matcher !== null) {
                try {
                    matches = current_title.match(new RegExp(rule.tab.title_matcher), 'g');

                    if (matches !== null) {
                        for (i = 0; i < matches.length; i++) {
                            title = updateTitle(title, '@' + i, matches[i]);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            // Handle url_matcher
            if (rule.tab.url_matcher !== null) {
                try {
                    matches = current_url.match(new RegExp(rule.tab.url_matcher), 'g');

                    if (matches !== null) {
                        for (i = 0; i < matches.length; i++) {
                            title = updateTitle(title, '$' + i, matches[i]);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            return title;
        };

        /**
         * Remove existing favicon(s) and create a new one
         * @param new_icon
         * @returns {boolean}
         */
        const processIcon = function (new_icon) {
            const el = document.querySelectorAll('head link[rel*="icon"]');

            // Remove existing favicons
            Array.prototype.forEach.call(el, function (node) {
                node.parentNode.removeChild(node);
            });

            // Set preconfigured or custom (http|https|data) icon
            const icon =
                /^(https?|data):/.test(new_icon) === true ? new_icon : chrome.extension.getURL('/img/' + new_icon);

            // Create new favicon
            const link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = icon;

            document.getElementsByTagName('head')[0].appendChild(link);

            return true;
        };

        // Set title
        if (rule.tab.title !== null) {
            if (document.title !== null) {
                document.title = processTitle(location.href, document.title);
            }
        }

        let title_changed_by_me = false;

        // Set up a new observer
        const observer_title = new window.WebKitMutationObserver(function (
            mutations,
        ) {
            if (title_changed_by_me === true) {
                title_changed_by_me = false;
            } else {
                mutations.forEach(function () {
                    if (rule.tab.title !== null) {
                        document.title = processTitle(
                            location.href,
                            document.title,
                        );
                    }

                    title_changed_by_me = true;
                });
            }
        });

        // Observe when the website has changed the title
        if (document.querySelector('head > title') !== null) {
            observer_title.observe(document.querySelector('head > title'), {
                subtree: true,
                characterresponse: true,
                childList: true,
            });
        }

        // Pin the tab
        if (rule.tab.pinned === true) {
            chrome.runtime.sendMessage({ action: 'setPinned' });
        }

        // Set new icon
        if (rule.tab.icon !== null) {
            processIcon(rule.tab.icon);

            let icon_changed_by_me = false;

            // Set up a new observer
            const observer_icon = new window.WebKitMutationObserver(function (
                mutations,
            ) {
                if (icon_changed_by_me === true) {
                    icon_changed_by_me = false;
                } else {
                    mutations.forEach(function (mutation) {
                        // Handle favicon changes
                        if (mutation.target.type === 'image/x-icon') {
                            processIcon(rule.tab.icon);

                            icon_changed_by_me = true;
                        }

                        mutation.addedNodes.forEach(function (added_node) {
                            // Detect added favicon
                            if (added_node.type === 'image/x-icon') {
                                processIcon(rule.tab.icon);

                                icon_changed_by_me = true;
                            }
                        });

                        mutation.removedNodes.forEach(function (removed_node) {
                            // Detect removed favicon
                            if (removed_node.type === 'image/x-icon') {
                                processIcon(rule.tab.icon);

                                icon_changed_by_me = true;
                            }
                        });
                    });
                }
            });

            // Observe when the website has changed the head so the script
            // will detect favicon manipulation (add/remove)
            if (document.querySelector('head link[rel*="icon"]') !== null) {
                observer_icon.observe(document.querySelector('head'), {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true,
                    attributeOldValue: true,
                    characterDataOldValue: true,
                });
            }
        }

        // Protect the tab
        if (rule.tab.protected === true) {
            w.onbeforeunload = function () {
                return '';
            };
        }

        // Keep this tab unique
        if (rule.tab.unique === true) {
            chrome.runtime.sendMessage({
                action: 'setUnique',
                url_fragment: rule.url_fragment,
            });
        }

        // Mute the tab
        if (rule.tab.muted === true) {
            chrome.runtime.sendMessage({ action: 'setMuted' });
        }
    };

    processPage();

    // Reverted #39
    // w.onhashchange = processPage;
});
