var WalnutValidator = require('src').default;

describe("ajax", function () {
    var $validaotr = new WalnutValidator();
    beforeEach(function () {
        $validaotr = new WalnutValidator();
        jasmine.getFixtures().fixturesPath = 'specs/views';
        jasmine.getFixtures().load('input.html');
        // jasmine.clock().install();
    });

    afterEach(function () {
        // jasmine.clock().uninstall();
    })

    it("invalid", function (done) {
        $('#input').val('12');
        let $fieldBase = $validaotr.addField(
            $('#input'),
            {
                remote: '/json/invalid.json'
            },
            {
                remote: "ajax invalid."
            }
        );

        spyOn($fieldBase, 'validating');
        
        $validaotr.validateAll();

        expect($fieldBase.validating).toHaveBeenCalledWith(true);

        setTimeout(function () {
            expect($fieldBase.status).toBe(false);
            expect($fieldBase.error).toBe('remote');
            expect($fieldBase.message).toBe('ajax invalid.');
            done();
        }, 500);
    });

    it("valid", function (done) {
        $('#input').val('12');
        let $fieldBase = $validaotr.addField(
            $('#input'),
            {
                remote: '/json/valid.json'
            },
            {
                remote: "ajax valid."
            }
        );

        spyOn($fieldBase, 'validating');

        $validaotr.validateAll();

        expect($fieldBase.validating).toHaveBeenCalled();
        expect($fieldBase.validating).toHaveBeenCalledWith(true);

        setTimeout(function () {
            expect($fieldBase.validating).toHaveBeenCalledTimes(2);
            expect($fieldBase.validating).toHaveBeenCalledWith(false);
            expect($fieldBase.status).toBe(true);
            expect($fieldBase.error).toBe(null);
            expect($fieldBase.message).toBe(null);
            done();
        }, 500);
    });
});