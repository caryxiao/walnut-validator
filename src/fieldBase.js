import Event from "./event"
import $ from "jquery"
// const dom = document;
/**
 * field object
 */
class fieldBase {

    constructor({
        el = null,
        rules = null,
        messages = null
    } = {}){
        let event = new Event();
        event.installTo(this);
        this._status = true;
        this.el = el;
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

    init() {
        this.$popup = $('[aria-popup="' + this.$field.attr('aria-popup-name') + '"]');
    }

    get Field() {
        return this.el[0];
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
        if (messages != null && Object.keys(messages).length > 0) {
            for (let key in messages) {
                let _ks = key.split(',');
                for (let k of _ks) {
                    this._messages[k] = messages[_ks];
                }
            }
        }
    }

    /**
     * get field value
     * @returns {*}
     */
    val() {
        if (['checkbox', 'radio'].indexOf(this.Field.getAttribute('type')) == -1) {
            return this.Field.value;
        }
    }

    /**
     * show error
     */
    showPopup() {

        if (this.$popup != null) {
            if (typeof this._handleShowPopup == "function") {
                this._handleShowPopup(this, this.message);
            } else {
                this.$popup.innerHTML = this.message;
                this.$popup.style.display = "block";
            }
        }

        this.trigger('afterShowPopup', this);
    }

    /**
     * hide error
     */
    hidePopup() {
        if (this.$popup != null) {
            if (typeof this._handleHidePopup == "function") {
                this._handleHidePopup(this);
            } else {
                this.$popup.innerHTML = "";
                this.$popup.style.display = "none";
            }
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
                if (this.$popup != null) {
                    this.$popup.innerHTML = 'loading...';
                    this.$popup.style.display = "block";
                }
            } else {
                this.hidePopup();
            }
        }
    }
}

export default fieldBase;