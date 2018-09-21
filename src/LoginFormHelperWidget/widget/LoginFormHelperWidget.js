/*jshint undef: true, browser:true, nomen: true */
/*jslint browser:true, nomen: true */
/*global mx, mxui, define, require, console, logger */
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "dojo/query",
    "dojo/on",
    "dojo/keys",
    "dojo/_base/lang"


], function (declare, _WidgetBase, dojoQuery, dojoOn, dojoKeys, lang) {
    "use strict";

    return declare("LoginFormHelperWidget.widget.LoginFormHelperWidget", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        containerClass: "",
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
            if (this.userNameCaseConversion !== this.TRANSFORM_NONE) {
            dojoQuery("div." + this.containerClass + " input[type=text]").on("blur", function (e) {
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
                dojoQuery("div." + this.containerClass + " input").on( "keyup", function (e) {
                    if (event.keyCode === dojoKeys.ENTER) {
                        var buttonQuery = "div." + thisObj.containerClass + " .btn.mx-button";
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
