var WalnutValidator = require('src').default;

describe("popup", function () {

    var $validaotr;

    beforeEach(function () {
        var regulars = {
            test1: /^12$/
        };

        var customFuncs = {
            custom_max10: function($_fieldBase) {
                return $_fieldBase.val() <= 10;
            }
        };

        $validaotr = new WalnutValidator({
            regulars,
            customFuncs
        });
        jasmine.getFixtures().fixturesPath = 'specs/views';
        jasmine.getFixtures().load('input.html');
    });

    it("add new regular to global", function () {
        $('#input').val("abc");
        let $fieldBase = $validaotr.addField(
            '#input',
            {
                regular: 'test1'
            },
            {
                test1: "test1."
            }
        );
        $validaotr.validateAll();

        expect($fieldBase.error).toBe("test1");
        expect($fieldBase.message).toBe("test1.");
        expect($fieldBase.$popup.innerHTML).toBe("test1.");
    });

    it("add custom function to global", function () {
        $('#input').val(11);
        let $fieldBase = $validaotr.addField(
            '#input',
            {
                custom_test1: 'custom_max10'
            },
            {
                custom_test1: "this value must be less then ten."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe("custom_test1");
        expect($fieldBase.message).toBe("this value must be less then ten.");
        expect($fieldBase.$popup.innerHTML).toBe("this value must be less then ten.");
    });
});