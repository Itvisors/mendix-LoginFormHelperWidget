/*jshint undef: true, browser:true, nomen: true */
/*jslint browser:true, nomen: true */
/*global mx, mxui, define, require, console, logger */
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "dojo/cookie",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/on",
    "dojo/keys",
    "dojo/dom-prop"


], function (declare, _WidgetBase, dojoCookie, dojoConstruct, dojoQuery, dojoOn, dojoKeys, dojoProp) {
    "use strict";

    return declare("LoginFormHelperWidget.widget.LoginFormHelperWidget", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        userNameCaseConversion: "",
        trimUserName: true,
        loginOnEnter: true,
        loginButtonClass: "",
        allowRememberUserName: false,
        rememberUserNameCaption: false,

        // Internal variables.
        _saveUserNameToCookieAllowed: false,
        _userName: null,

        // Fixed values
        TRANSFORM_NONE: "none",
        TRANSFORM_LOWER: "lower",
        TRANSFORM_UPPER: "upper",
        COOKIE_NAME: "LoginFormHelperWidgetUserName",

        constructor: function () {
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            var thisObj = this,
                containerSelector,
                checkboxNode;

            containerSelector = this.domNode.parentNode.tagName;
            containerSelector += "." + dojoProp.get(this.domNode.parentNode, "class").replace(/\s/g, ".");

            // Case conversion for user name?
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
                        if (thisObj.trimUserName) {
                            this.value = this.value.trim();
                        }
                        thisObj._userName = this.value;
                    } else {
                        thisObj._userName = null;
                    }
                    thisObj.saveUserNameToCookie();
                });
            }

            // Login on enter?
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

            // Allow remember user name?
            if (this.allowRememberUserName) {
                // Create the checkbox
                checkboxNode = dojoConstruct.create("input", {
                    id: "checkboxRememberUserName",
                    type: "checkbox",
                    name: "rememberUserName",
                    class: "checkboxRememberUserName"
                });

                // Get current cookie value, if any.
                this._userName = dojoCookie(this.COOKIE_NAME);
                if (this._userName) {
                    this._saveUserNameToCookieAllowed = true;
                    checkboxNode.checked = true;
                    dojoQuery(containerSelector + " input[type=text]").forEach(function (textNode) {
                        textNode.value = thisObj._userName;
                    });
                }

                dojoOn(checkboxNode, "change", function () {
                    thisObj.handleCheckboxChange(this.checked);
                });
                dojoConstruct.place(checkboxNode, this.domNode);
                dojoConstruct.place("<label for='checkboxRememberUserName' class='labelRememberUserName'>" + this.rememberUserNameCaption + "</label>", this.domNode);
            }
        },

        handleCheckboxChange: function (checked) {
            console.log("Checked: " + checked);
            this._saveUserNameToCookieAllowed = checked;
            this.saveUserNameToCookie();
        },

        saveUserNameToCookie: function () {
            if (this._saveUserNameToCookieAllowed) {
                dojoCookie(this.COOKIE_NAME, this._userName, { expires: 90 });
            } else {
                dojoCookie(this.COOKIE_NAME, "", { expires: 0 });
            }
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        }
    });
});

require(["LoginFormHelperWidget/widget/LoginFormHelperWidget"]);
