import Event from "./event"
import $ from "jquery"
/**
 * field object
 */
class fieldBase {
    constructor({
        field = null,
        rules = null,
        messages = null
    } = {}){
        let event = new Event();
        event.installTo(this);

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
        this.$popup = $('[aria-popup="' + this.$field.attr('aria-popup-name') + '"]');

        return this;
    }

    /**
     * Sets the custom regular expression for the field
     * {
     *   "qq": /^[1-9][0-9]{4,}$/
     * }
     * @param regulars
     * @returns {fieldBase}
     */
    setRegulars(regulars) {
        this.regulars = regulars;
        return this;
    }

    /**
     * Set other trigger conditions
     * ['blur', 'focus']
     * @param events
     * @returns {fieldBase}
     */
    setEvents(events) {
        this.triggerEvents = events;
        return this;
    }

    /**
     * set popup selector
     * @param selector
     * @returns {fieldBase}
     */
    setPopup(selector) {
        this.$popup = selector;
        return this;
    }

    /**
     * set ajax query data
     * @param handle function | object
     * @returns {fieldBase}
     */
    setHandleQuery(handle) {
        this._handleQuery = handle;
        return this;
    }

    setHandleShowPopup(handle) {
        this._handleShowPopup = handle;
        return this;
    }

    setHandleHidePopup(handle) {
        this._handleHidePopup = handle;
        return this;
    }


    /**
     * get query data
     * @returns {{}}
     */
    getQueryData() {
        let queryData = {};
        if (typeof this._handleQuery == "function") {
            queryData = this._handleQuery();
        } else if (typeof this._handleQuery == "object") {
            queryData = this._handleQuery;
        }
        return queryData;
    }

    setHandleLoading(handle) {
        this._handleLoading = handle;
        return this;
    }


    /**
     * set field status
     * @param status true|false
     * @param error ruleType, rule
     */
    setStatus(status, error) {
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

    get status() {
        return this._status;
    }

    get error() {
        return this._error;
    }

    get message() {
        return this._message;
    }

    /**
     * set error message
     * {
     *    required: "The field cannot be empty.",
     *    qq: "QQ number is error."
     * }
     * @param messages
     * @private
     */
    _initMessages(messages) {
        if (messages != null && !$.isEmptyObject(messages)) {
            $.each(messages, function (key, value) {
                var _ks = key.split(',');
                $.each(_ks, function (k, v) {
                    this._messages[v] = value;
                }.bind(this));
            }.bind(this));

        }
    }

    /**
     * get $field value
     * @returns {*}
     */
    val() {
        return this.$field.val();
    }

    /**
     * show error
     */
    showPopup() {
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
    hidePopup() {
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
    validating(status) {
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
}

export default fieldBase;