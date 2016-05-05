/*!
 * walnut-validator.js v1.0.0
 * (c) 2016 Cary Xiao
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $$1 = _interopDefault(require('jquery'));

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

/**
 * 2015.10.12 添加功能, 支持命名空间时间
 *
 */
var event = function event() {
    var slice = [].slice,
        separator = /\s+/,
        protos;

    function findHandlers(arr, name, callback, context) {
        return $$1.grep(arr, function (handler) {
            return handler && (!name || handler.e === name || handler.e.substr(0, handler.e.indexOf('.')) === name) && (!callback || handler.cb === callback || handler.cb._cb === callback) && (!context || handler.ctx === context);
        });
    }

    function eachEvent(events, callback, iterator) {
        // 不支持对象，只支持多个event用空格隔开
        $$1.each((events || '').split(separator), function (_, key) {
            iterator(key, callback);
        });
    }

    function triggerHanders(events, args) {
        var stoped = false,
            i = -1,
            len = events.length,
            handler;

        while (++i < len) {
            handler = events[i];

            if (handler.cb.apply(handler.ctx2, args) === false) {
                stoped = true;
                break;
            }
        }

        return !stoped;
    }

    protos = {
        /**
         * 绑定事件。
         *
         * `callback`方法在执行时，arguments将会来源于trigger的时候携带的参数。如
         * ```javascript
         * var obj = {};
         *
         * // 使得obj有事件行为
         * Mediator.installTo( obj );
         *
         * obj.on( 'testa', function( arg1, arg2 ) {
             *     console.log( arg1, arg2 ); // => 'arg1', 'arg2'
             * });
         *
         * obj.trigger( 'testa', 'arg1', 'arg2' );
         * ```
         *
         * 如果`callback`中，某一个方法`return false`了，则后续的其他`callback`都不会被执行到。
         * 切会影响到`trigger`方法的返回值，为`false`。
         *
         * `on`还可以用来添加一个特殊事件`all`, 这样所有的事件触发都会响应到。同时此类`callback`中的arguments有一个不同处，
         * 就是第一个参数为`type`，记录当前是什么事件在触发。此类`callback`的优先级比脚低，会再正常`callback`执行完后触发。
         * ```javascript
         * obj.on( 'all', function( type, arg1, arg2 ) {
             *     console.log( type, arg1, arg2 ); // => 'testa', 'arg1', 'arg2'
             * });
         * ```
         *
         * @method on
         * @grammar on( name, callback[, context] ) => self
         * @param  {String}   name     事件名，支持多个事件用空格隔开
         * @param  {Function} callback 事件处理器
         * @param  {Object}   [context]  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         * @class Mediator
         */
        on: function on(name, callback, context) {
            var me = this,
                set;

            if (!callback) {
                return this;
            }

            set = this._events || (this._events = []);

            eachEvent(name, callback, function (name, callback) {
                var handler = { e: name };
                handler.cb = callback;
                handler.ctx = context;
                handler.ctx2 = context || me;
                handler.id = set.length;

                set.push(handler);
            });

            return this;
        },

        /**
         * 绑定事件，且当handler执行完后，自动解除绑定。
         * @method once
         * @grammar once( name, callback[, context] ) => self
         * @param  {String}   name     事件名
         * @param  {Function} callback 事件处理器
         * @param  {Object}   [context]  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        once: function once(name, callback, context) {
            var me = this;

            if (!callback) {
                return me;
            }

            eachEvent(name, callback, function (name, callback) {
                var once = function once() {
                    me.off(name, once);
                    return callback.apply(context || me, arguments);
                };

                once._cb = callback;
                me.on(name, once, context);
            });

            return me;
        },

        /**
         * 解除事件绑定
         * @method off
         * @grammar off( [name[, callback[, context] ] ] ) => self
         * @param  {String}   [name]     事件名
         * @param  {Function} [callback] 事件处理器
         * @param  {Object}   [context]  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        off: function off(name, cb, ctx) {
            var events = this._events;

            if (!events) {
                return this;
            }

            if (!name && !cb && !ctx) {
                this._events = [];
                return this;
            }
            console.log(events);
            eachEvent(name, cb, function (name, cb) {
                $$1.each(findHandlers(events, name, cb, ctx), function () {
                    delete events[this.id];
                });
            });

            return this;
        },

        /**
         * 触发事件
         * @method trigger
         * @grammar trigger( name[, args...] ) => self
         * @param  {String}   type     事件名
         * @param  {*} [...] 任意参数
         * @return {Boolean} 如果handler中return false了，则返回false, 否则返回true
         */
        trigger: function trigger(type) {
            var args, events, allEvents;

            if (!this._events || !type) {
                return this;
            }

            args = slice.call(arguments, 1);
            events = findHandlers(this._events, type);
            allEvents = findHandlers(this._events, 'all');

            return triggerHanders(events, args) && triggerHanders(allEvents, arguments);
        }
    };

    return $$1.extend({

        /**
         * 可以通过这个接口，使任何对象具备事件功能。
         * @method installTo
         * @param  {Object} obj 需要具备事件行为的对象。
         * @return {Object} 返回obj.
         */
        installTo: function installTo(obj) {
            return $$1.extend(obj, protos);
        }

    }, protos);
};

var regulars = function () {
    function regulars() {
        babelHelpers.classCallCheck(this, regulars);

        this._regulars = {
            require: /.+/,
            number: /^[\-+]?(0|[1-9]\d*)(\.\d+)?$/,
            date: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(10|11|12|13|14|15|16|17|18|19|20)\d{2}$/, //MM/DD/YYYY
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            url: /^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@\[\]\':+!]*([^<>\"])*$/,
            ip: /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/,
            empty: /^\s*$/,
            letter: /^[a-zA-Z]{1,}$/,
            password: /^[a-zA-Z]\w{5,17}$/,
            trade_password: /^\d{6}$/,
            mobile: /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i,
            qq: /^[1-9][0-9]{4,}$/
        };
    }

    babelHelpers.createClass(regulars, [{
        key: "add",
        value: function add(regulars) {
            $$1.extend(this._regulars, regulars || {});
            return this;
        }
    }, {
        key: "regulars",
        get: function get() {
            return this._regulars;
        }
    }]);
    return regulars;
}();

/**
 * field object
 */

var fieldBase = function () {
    function fieldBase() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var _ref$field = _ref.field;
        var field = _ref$field === undefined ? null : _ref$field;
        var _ref$rules = _ref.rules;
        var rules = _ref$rules === undefined ? null : _ref$rules;
        var _ref$messages = _ref.messages;
        var messages = _ref$messages === undefined ? null : _ref$messages;
        babelHelpers.classCallCheck(this, fieldBase);

        var event$$ = new event();
        event$$.installTo(this);

        this._status = true;
        this.$field = field;
        this.rules = rules;
        this._message = null;
        this._messages = {};
        this._error = null; //rules key
        this.triggerEvents = [];
        this.regulars = {};
        this.$xhr = null;
        this._initMessages(messages);
        this._handleQuery = null;
        this._handleLoading = null;
        this._handleShowPopup = null;
        this._handleHidePopup = null;

        this.init();

        return this;
    }

    babelHelpers.createClass(fieldBase, [{
        key: "init",
        value: function init() {
            this.$popup = $$1('[aria-popup="' + this.$field.attr('aria-popup-name') + '"]');
        }

        /**
         * Sets the custom regular expression for the field
         * {
         *   "qq": /^[1-9][0-9]{4,}$/
         * }
         * @param regulars
         * @returns {fieldBase}
         */

    }, {
        key: "setRegulars",
        value: function setRegulars(regulars) {
            this.regulars = regulars;
            return this;
        }

        /**
         * Set other trigger conditions
         * ['blur', 'focus']
         * @param events
         * @returns {fieldBase}
         */

    }, {
        key: "setEvents",
        value: function setEvents(events) {
            this.triggerEvents = events;
            return this;
        }

        /**
         * set popup selector
         * @param selector
         * @returns {fieldBase}
         */

    }, {
        key: "setPopup",
        value: function setPopup(selector) {
            this.$popup = selector;
            return this;
        }

        /**
         * set ajax query data
         * @param handle function | object
         * @returns {fieldBase}
         */

    }, {
        key: "setHandleQuery",
        value: function setHandleQuery(handle) {
            this._handleQuery = handle;
            return this;
        }
    }, {
        key: "setHandleShowPopup",
        value: function setHandleShowPopup(handle) {
            this._handleShowPopup = handle;
            return this;
        }
    }, {
        key: "setHandleHidePopup",
        value: function setHandleHidePopup(handle) {
            this._handleHidePopup = handle;
            return this;
        }

        /**
         * get query data
         * @returns {{}}
         */

    }, {
        key: "getQueryData",
        value: function getQueryData() {
            var queryData = {};
            if (typeof this._handleQuery == "function") {
                queryData = this._handleQuery();
            } else if (babelHelpers.typeof(this._handleQuery) == "object") {
                queryData = this._handleQuery;
            }
            return queryData;
        }
    }, {
        key: "setHandleLoading",
        value: function setHandleLoading(handle) {
            this._handleLoading = handle;
            return this;
        }

        /**
         * set field status
         * @param status true|false
         * @param error ruleType, rule
         */

    }, {
        key: "setStatus",
        value: function setStatus(status, error) {
            this._status = status;
            this._error = status ? null : error;

            if (this._error != null) {
                this._message = this._messages[this.error] == undefined ? null : this._messages[this.error];
                this.showPopup();
            } else {
                this._message = null;
                this.hidePopup();
            }

            return this;
        }
    }, {
        key: "_initMessages",


        /**
         * set error message
         * {
         *    required: "The field cannot be empty.",
         *    qq: "QQ number is error."
         * }
         * @param messages
         * @private
         */
        value: function _initMessages(messages) {
            if (messages != null && !$$1.isEmptyObject(messages)) {
                $$1.each(messages, function (key, value) {
                    var _ks = key.split(',');
                    $$1.each(_ks, function (k, v) {
                        this._messages[v] = value;
                    }.bind(this));
                }.bind(this));
            }
        }

        /**
         * get $field value
         * @returns {*}
         */

    }, {
        key: "val",
        value: function val() {
            return this.$field.val();
        }

        /**
         * show error
         */

    }, {
        key: "showPopup",
        value: function showPopup() {
            if (typeof this._handleShowPopup == "function") {
                this._handleShowPopup(this, this.message);
            } else {
                this.$popup.html(this.message).show();
            }
            this.trigger('afterShowPopup', this);
        }

        /**
         * hide error
         */

    }, {
        key: "hidePopup",
        value: function hidePopup() {
            if (typeof this._handleHidePopup == "function") {
                this._handleHidePopup(this);
            } else {
                this.$popup.empty().hide();
            }
            this.trigger('afterHidePopup', this);
        }

        /**
         * set field validating
         * @param status
         */

    }, {
        key: "validating",
        value: function validating(status) {
            if (this._handleLoading != null) {
                if (typeof this._handleLoading == "function") {
                    this.hidePopup();
                    this._handleLoading(status, this);
                }
            } else {
                if (status) {
                    this.$popup.html('loading...').show();
                } else {
                    this.hidePopup();
                }
            }
        }
    }, {
        key: "status",
        get: function get() {
            return this._status;
        }
    }, {
        key: "error",
        get: function get() {
            return this._error;
        }
    }, {
        key: "message",
        get: function get() {
            return this._message;
        }
    }]);
    return fieldBase;
}();

var validateHandle = function () {
    function validateHandle() {
        babelHelpers.classCallCheck(this, validateHandle);
    }

    babelHelpers.createClass(validateHandle, [{
        key: 'required',


        /**
         * required
         * @param $fieldBase
         * @returns {*}
         */
        value: function required($fieldBase) {

            var $field = $fieldBase.$field;
            if (['checkbox', 'radio'].indexOf($field.attr('type')) > -1) {
                return $field.is(":checked");
            } else {

                return $fieldBase.val() != "";
            }
        }

        /**
         * regular
         * @param $fieldBase
         * @param rule
         * @param $regulars
         * @returns {boolean}
         */

    }, {
        key: 'regular',
        value: function regular($fieldBase, rule, $regulars) {
            var fieldValue = $fieldBase.val(),
                regex = void 0;

            if (fieldValue == "") {
                return true;
            }

            if ($fieldBase.regulars[rule] != undefined) {
                regex = $fieldBase.regulars[rule];
            } else if ($regulars[rule] != undefined) {
                regex = $regulars[rule];
            } else {
                throw new Error("Not Found regulars:" + rule);
            }

            if (regex.global) {
                regex.lastIndex = 0;
            }

            return regex.test(fieldValue);
        }
    }, {
        key: 'min',
        value: function min($fieldBase, rule) {
            var fieldValue = $fieldBase.val();
            if (fieldValue == "") {
                return true;
            }

            return fieldValue.length >= rule;
        }
    }, {
        key: 'max',
        value: function max($fieldBase, rule) {
            var fieldValue = $fieldBase.val();
            if (fieldValue == "") {
                return true;
            }

            return fieldValue.length <= rule;
        }

        /**
         * ajax validate
         * @param $fieldBase
         * @param rule
         * @returns {string}
         */

    }, {
        key: 'remote',
        value: function remote($fieldBase, rule) {

            var fieldValue = $fieldBase.val();
            if (fieldValue == "") {
                return true;
            }

            $fieldBase.validating(true);

            var url = rule;
            var data = {
                fieldValue: fieldValue
            };

            data = $.extend(true, {}, data, $fieldBase.getQueryData() || {});

            $fieldBase.$xhr = $.ajax({
                url: url,
                data: data,
                type: 'get',
                dataType: 'json',
                success: function success(response) {
                    $fieldBase.validating(false);
                    if (response.validate) {
                        $fieldBase.setStatus(true).hidePopup();
                    } else {
                        $fieldBase.setStatus(false, 'remote').showPopup();
                    }
                }
            });

            return 'validating';
        }

        /**
         * custom function
         * @param $fieldBase
         * @param rule
         * @returns {*}
         */

    }, {
        key: 'customHandle',
        value: function customHandle($fieldBase, rule) {
            return rule.call(null, $fieldBase);
        }

        /**
         * same to another field value
         * @param $fieldBase
         * @param rule
         * @param $fieldsBase
         * @returns {boolean}
         */

    }, {
        key: 'sameTo',
        value: function sameTo($fieldBase, rule, $fieldsBase) {
            var $sameToFieldBase = this._searchFieldBase($fieldsBase, rule);
            if ($sameToFieldBase != undefined) {
                return $fieldBase.val() == $sameToFieldBase.val();
            } else {
                throw new Error("Not Found regulars:" + rule);
            }
        }

        /**
         * search $fieldBase in $fieldsBase
         * @param $fieldsBase
         * @param $field
         * @returns {*}
         * @private
         */

    }, {
        key: '_searchFieldBase',
        value: function _searchFieldBase($fieldsBase, $field) {
            var $fieldBase = void 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = $fieldsBase[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _$fieldBase = _step.value;

                    if (_$fieldBase.$field[0] == $field[0]) {
                        $fieldBase = _$fieldBase;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return $fieldBase;
        }
    }]);
    return validateHandle;
}();

var validator = function () {
    function validator() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? //afterShowPopup, afterHidePopup
        {} : arguments[0];

        var _ref$regulars = _ref.regulars;
        var regulars$$ = _ref$regulars === undefined ? {} : _ref$regulars;
        var _ref$customFuncs = _ref.customFuncs;
        var // config common regulars
        customFuncs = _ref$customFuncs === undefined ? {} : _ref$customFuncs;
        var _ref$handleShowPopup = _ref.handleShowPopup;
        var handleShowPopup = _ref$handleShowPopup === undefined ? null : _ref$handleShowPopup;
        var _ref$handleHidePopup = _ref.handleHidePopup;
        var handleHidePopup = _ref$handleHidePopup === undefined ? null : _ref$handleHidePopup;
        var _ref$fieldHooks = _ref.fieldHooks;
        var fieldHooks = _ref$fieldHooks === undefined ? {} : _ref$fieldHooks;
        babelHelpers.classCallCheck(this, validator);

        this.$fieldsBase = [];
        var event$$ = new event();
        event$$.installTo(this);

        this.$regulars = new regulars();
        this.$regulars.add(regulars$$);
        this.$customFuns = customFuncs;
        this.handleShowPopup = handleShowPopup;
        this.handleHidePopup = handleHidePopup;
        this.fieldHooks = fieldHooks;

        this.$validateHandle = new validateHandle();
    }

    /**
     * add field to validator
     * @param field
     * @param rules
     * @param messages
     * @returns {fieldBase}
     */


    babelHelpers.createClass(validator, [{
        key: "addField",
        value: function addField(field, rules, messages) {
            var self = this;
            var $fieldBase = new fieldBase({
                field: field,
                rules: rules,
                messages: messages
            }).setHandleShowPopup(this.handleShowPopup).setHandleHidePopup(this.handleHidePopup);

            if (typeof this.afterShowPopup == "function") {
                $fieldBase.on('afterShowPopup');
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.fieldHooks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var eventName = _step.value;

                    $fieldBase.on(eventName, this.fieldHooks[eventName]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.$fieldsBase.push($fieldBase);
            if ($fieldBase.triggerEvents.length) {
                $$1.each($fieldBase.triggerEvents, function (_key, _eventName) {
                    $fieldBase.$field.on(_eventName, function () {
                        self.validateField($fieldBase);
                    });
                });
            }
            return $fieldBase;
        }

        /**
         * validate field
         * @param $fieldBase
         */

    }, {
        key: "validateField",
        value: function validateField($fieldBase) {
            if (!$fieldBase.$field.length) return;
            var status = true;
            var error = void 0;
            var $rules = $fieldBase.rules;
            for (var type in $rules) {
                var rule = $rules[type];

                if (type == "required") {
                    status = this.$validateHandle.required($fieldBase);
                    if (!status) {
                        error = type;
                        break;
                    }
                } else if (type == "regular") {
                    var rs = rule.split(',');
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = rs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var r = _step2.value;

                            status = this.$validateHandle.regular($fieldBase, r, this.$regulars.regulars);
                            if (!status) {
                                error = r;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    if (!status) {
                        break;
                    }
                } else if (type.indexOf("custom") === 0) {

                    if (typeof rule == "string") {
                        if (typeof this.$customFuns[rule] == "function") {
                            rule = this.$customFuns[rule];
                        }
                    }

                    status = this.$validateHandle.customHandle($fieldBase, rule);

                    if (!status) {
                        error = type;
                        break;
                    }
                } else if (type == "sameTo") {
                    status = this.$validateHandle.sameTo($fieldBase, rule, this.$fieldsBase);
                    if (!status) {
                        error = type;
                        break;
                    }
                } else if (type == "remote") {
                    status = this.$validateHandle.remote($fieldBase, rule);
                    break;
                } else {
                    if (typeof this.$validateHandle[type] == "function") {
                        status = this.$validateHandle[type]($fieldBase, rule);
                        if (!status) {
                            error = type;
                            break;
                        }
                    }
                }
            }

            if (status != 'validating') {
                $fieldBase.setStatus(status, error);
            }
        }

        /**
         * validate all field
         */

    }, {
        key: "validateAll",
        value: function validateAll() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.$fieldsBase[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var $fieldBase = _step3.value;

                    var $field = $fieldBase.$field;
                    if ($field.context != $field[0] && $field.selected != "") {
                        $fieldBase.$field = $$1($field.selector, $field.context);
                        $fieldBase.init();
                    }
                    this.validateField($fieldBase);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        /**
         * start validate
         * @param cbk
         */

    }, {
        key: "submit",
        value: function submit() {
            var cbk = arguments.length <= 0 || arguments[0] === undefined ? $$1.noop : arguments[0];

            this.validateAll();
            var xhrs = this._getFieldsXHR();
            if (xhrs.length > 0) {
                $$1.when.apply({}, xhrs).done(function () {
                    if (!this._hasError()) {
                        cbk();
                        this.trigger('submit');
                    }
                }.bind(this));
            } else {
                if (!this._hasError()) {
                    cbk();
                    this.trigger('submit');
                }
            }
        }

        /**
         * get all field xhr
         * @returns {Array}
         * @private
         */

    }, {
        key: "_getFieldsXHR",
        value: function _getFieldsXHR() {
            var xhrs = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.$fieldsBase[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var $fieldBase = _step4.value;

                    if ($fieldBase.$xhr != null) {
                        xhrs.push($fieldBase.$xhr);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return xhrs;
        }

        /**
         * check field has error
         * @returns {boolean}
         * @private
         */

    }, {
        key: "_hasError",
        value: function _hasError() {
            var hasError = false;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.$fieldsBase[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var $fieldBase = _step5.value;

                    if (!$fieldBase.status) {
                        hasError = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return hasError;
        }
    }]);
    return validator;
}();

module.exports = validator;