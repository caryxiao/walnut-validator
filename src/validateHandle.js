class validateHandle {

    /**
     * required
     * @param $fieldBase
     * @returns {*}
     */
    required($fieldBase) {

        let $field = $fieldBase.$field;
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
    regular($fieldBase, rule, $regulars) {
        let fieldValue = $fieldBase.val(),
            regex;

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

    min($fieldBase, rule) {
        let fieldValue = $fieldBase.val();
        if (fieldValue == "") {
            return true;
        }

        return fieldValue.length >= rule;
    }

    max($fieldBase, rule) {
        let fieldValue = $fieldBase.val();
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
    remote($fieldBase, rule) {

        let fieldValue = $fieldBase.val();
        if (fieldValue == "") {
            return true;
        }

        $fieldBase.validating(true);

        let url = rule;
        let data = {
            fieldValue: fieldValue
        };

        data = $.extend(true, {}, data, $fieldBase.getQueryData() || {});

        $fieldBase.$xhr = $.ajax({
            url: url,
            data: data,
            type: 'get',
            dataType: 'json',
            success: function (response) {
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
    customHandle($fieldBase, rule) {
        return rule.call(null, $fieldBase);
    }

    /**
     * same to another field value
     * @param $fieldBase
     * @param rule
     * @param $fieldsBase
     * @returns {boolean}
     */
    sameTo($fieldBase, rule, $fieldsBase) {
        let $sameToFieldBase = this._searchFieldBase($fieldsBase, rule);
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
    _searchFieldBase($fieldsBase, $field) {
        let $fieldBase;
        for(let _$fieldBase of $fieldsBase) {
            if (_$fieldBase.$field[0] == $field[0]) {
                $fieldBase = _$fieldBase;
                break;
            }
        }
        return $fieldBase;
    }
}

export default validateHandle;