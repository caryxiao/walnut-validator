var WalnutValidator = require('src').default;

describe("select", function () {
    var $validaotr = new WalnutValidator();
    beforeEach(function () {
        $validaotr = new WalnutValidator();
        jasmine.getFixtures().fixturesPath = 'specs/views';
        jasmine.getFixtures().load('select.html');
    });

    it("required", function () {
        let $fieldBase = $validaotr.addField(
            $('#select'),
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
        $('#select').val("2");
        let $fieldBase = $validaotr.addField(
            $('#select'),
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