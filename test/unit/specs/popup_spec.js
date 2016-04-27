var WalnutValidator = require('src').default;

describe("popup", function () {
    var $validaotr = new WalnutValidator();
    beforeEach(function () {
        $validaotr = new WalnutValidator();
        jasmine.getFixtures().fixturesPath = 'specs/views';
        jasmine.getFixtures().load('input.html');
    });

    it("show", function () {
        let $fieldBase = $validaotr.addField(
            $('#input'),
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
        expect($fieldBase.$popup.html()).toBe("required.");
    });

    it("hide", function () {
        $('#input').val('123');
        let $fieldBase = $validaotr.addField(
            $('#input'),
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
        expect($fieldBase.$popup.html()).toBe("");
    });
});