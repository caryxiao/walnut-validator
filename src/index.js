import $ from "jquery"
import Event from "./event"
import Regulars from "./regulars"
import FieldBase from "./fieldBase"
import ValidateHandle from "./validateHandle";

class validator {

    constructor({
        regulars = {}, // config common regulars
        customFuncs = {},
        handleShowPopup = null,
        handleHidePopup = null,
        fieldHooks = {} //afterShowPopup, afterHidePopup
    } = {}) {
        this.$fieldsBase = [];
        var event = new Event();
        event.installTo(this);

        this.$regulars = new Regulars();
        this.$regulars.add(regulars);
        this.$customFuns = customFuncs;
        this.handleShowPopup = handleShowPopup;
        this.handleHidePopup = handleHidePopup;
        this.fieldHooks = fieldHooks;

        this.$validateHandle = new ValidateHandle();
    }

    /**
     * add field to validator
     * @param field
     * @param rules
     * @param messages
     * @returns {fieldBase}
     */
    addField(field, rules, messages) {
        let self = this;
        let $fieldBase = new FieldBase({
            field: field,
            rules: rules,
            messages: messages
        })
            .setHandleShowPopup(this.handleShowPopup)
            .setHandleHidePopup(this.handleHidePopup);



        if (typeof this.afterShowPopup == "function") {
            $fieldBase.on('afterShowPopup')
        }

        for(let eventName of Object.keys(this.fieldHooks)) {
            $fieldBase.on(eventName, this.fieldHooks[eventName]);
        }

        this.$fieldsBase.push($fieldBase);
        if ($fieldBase.triggerEvents.length) {
            $.each($fieldBase.triggerEvents, function (_key, _eventName) {
                $fieldBase.$field.on(_eventName, function () {
                    self.validateField($fieldBase);
                });
            })
        }
        return $fieldBase;
    }

    /**
     * validate field
     * @param $fieldBase
     */
    validateField($fieldBase) {
        if (!$fieldBase.$field.length) return;
        let status = true;
        let error;
        let $rules = $fieldBase.rules;
        for (let type in $rules) {
            let rule = $rules[type];

            if (type == "required") {
                status = this.$validateHandle.required($fieldBase);
                if (!status) {
                    error = type;
                    break;
                }
            } else if (type == "regular") {
                let rs = rule.split(',');
                for (let r of rs) {
                    status = this.$validateHandle.regular($fieldBase, r, this.$regulars.regulars);
                    if (!status) {
                        error = r;
                        break;
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
    validateAll() {
        for (let $fieldBase of this.$fieldsBase) {
            let $field = $fieldBase.$field;
            if ($field.context != $field[0] && $field.selected != "") {
                $fieldBase.$field = $($field.selector, $field.context);
                $fieldBase.init();
            }
            this.validateField($fieldBase);
        }
    }

    /**
     * start validate
     * @param cbk
     */
    submit(cbk = $.noop) {
        this.validateAll();
        let xhrs = this._getFieldsXHR();
        if (xhrs.length > 0) {
            $.when.apply({}, xhrs).done(function () {
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
    _getFieldsXHR() {
        let xhrs = [];
        for(let $fieldBase of this.$fieldsBase) {
            if ($fieldBase.$xhr != null) {
                xhrs.push($fieldBase.$xhr);
            }
        }

        return xhrs;
    }

    /**
     * check field has error
     * @returns {boolean}
     * @private
     */
    _hasError() {
        let hasError = false;
        for(let $fieldBase of this.$fieldsBase) {
            if (!$fieldBase.status) {
                hasError = true;
                break;
            }
        }
        return hasError;
    }
}

export default validator;
