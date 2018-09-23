/*jshint undef: true, browser:true, nomen: true */
/*jslint browser:true, nomen: true */
/*global mx, mxui, define, require, console, logger */
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "dojo/query",
    "dojo/on",
    "dojo/keys",
    "dojo/dom-prop"


], function (declare, _WidgetBase, dojoQuery, dojoOn, dojoKeys, dojoProp) {
    "use strict";

    return declare("LoginFormHelperWidget.widget.LoginFormHelperWidget", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        userNameCaseConversion: "",
        loginOnEnter: "",
        loginButtonClass: "",

        // Internal variables.

        // Fixed values
        TRANSFORM_NONE: "none",
        TRANSFORM_LOWER: "lower",
        TRANSFORM_UPPER: "upper",

        constructor: function () {
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            var thisObj = this;
            var containerSelector;

            containerSelector = this.domNode.parentNode.tagName;
            containerSelector += "." + dojoProp.get(this.domNode.parentNode, "class").replace(/\s/g, ".");
            if (this.userNameCaseConversion !== this.TRANSFORM_NONE) {
            dojoQuery(containerSelector + " input[type=text]").on("blur", function (e) {
                if (this.value) {
                    switch (thisObj.userNameCaseConversion) {
                        case thisObj.TRANSFORM_LOWER:
                            this.value = this.value.toLowerCase();
                            break;

                        case thisObj.TRANSFORM_UPPER:
                            this.value = this.value.toUpperCase();
                            break;

                        default:
                            break;
                    }
                }
                });
            }
            if (this.loginOnEnter) {
                dojoQuery(containerSelector + " input").on( "keyup", function (e) {
                    if (event.keyCode === dojoKeys.ENTER) {
                        var buttonQuery = containerSelector + " .btn.mx-button";
                        if (thisObj.loginButtonClass) {
                            buttonQuery += "." + thisObj.loginButtonClass;
                        }
                        var nl = dojoQuery(buttonQuery);
                        if (nl.length) {
                            dojoOn.emit(nl[0], "click", { cancelable:true, bubbles: true});
                        }
                    }
                });
            }
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        }
    });
});

require(["LoginFormHelperWidget/widget/LoginFormHelperWidget"]);
