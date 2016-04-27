var WalnutValidator = require('src').default;

describe("checkbox", function () {
    var $validaotr = new WalnutValidator();
    beforeEach(function () {
        $validaotr = new WalnutValidator();
        jasmine.getFixtures().fixturesPath = 'specs/views';
        jasmine.getFixtures().load('checkbox.html');
    });

    it("required", function () {
        let $fieldBase = $validaotr.addField(
            $('input[name="checkbox"]'),
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
        $('input[name="checkbox"]').eq(0).prop('checked', true);
        let $fieldBase = $validaotr.addField(
            $('input[name="checkbox"]'),
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