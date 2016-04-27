var WalnutValidator = require('src').default;

describe("radio", function () {
    var $validaotr = new WalnutValidator();
    beforeEach(function () {
        $validaotr = new WalnutValidator();
        jasmine.getFixtures().fixturesPath = 'specs/views';
        jasmine.getFixtures().load('radio.html');
    });

    it("required", function () {
        let $fieldBase = $validaotr.addField(
            $('input[name="radio"]'),
            {
                required: true
            },
            {
                required: "required."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe("required");
        expect($fieldBase.message).toBe("required.");
    });

    it("checked", function () {
        $('input[name="radio"]').eq(0).prop('checked', true);
        let $fieldBase = $validaotr.addField(
            $('input[name="radio"]'),
            {
                required: true
            },
            {
                required: "required."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe(null);
        expect($fieldBase.message).toBe(null);
    });
});