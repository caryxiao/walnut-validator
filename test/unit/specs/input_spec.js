var WalnutValidator = require('src').default;

describe("input", function () {
    var $validaotr;
    beforeEach(function () {
        $validaotr = new WalnutValidator();
        jasmine.getFixtures().fixturesPath = 'specs/views';
        jasmine.getFixtures().load('input.html');
    });

    it("required", function () {
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
    });

    it("regular invalid", function () {
        $('#input').val('1');
        let $fieldBase = $validaotr.addField(
            $('#input'),
            {
                regular: 'email'
            },
            {
                email: "email."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe("email");
        expect($fieldBase.message).toBe("email.");
    });

    it("regular valid", function () {
        $('#input').val('289872225@qq.com');
        let $fieldBase = $validaotr.addField(
            $('#input'),
            {
                regular: 'email'
            },
            {
                email: "email."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe(null);
        expect($fieldBase.message).toBe(null);
    });

    it("min", function () {
        $('#input').val('123');
        let $fieldBase = $validaotr.addField(
            $('#input'),
            {
                min: 2
            },
            {
                min: "min.",
                max: "max."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe(null);
        expect($fieldBase.message).toBe(null);
    });

    it("max", function () {
        $('#input').val('12');
        let $fieldBase = $validaotr.addField(
            $('#input'),
            {
                max: 2
            },
            {
                max: "max."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe(null);
        expect($fieldBase.message).toBe(null);
    });

    it("custom function", function () {
        $('#input').val('12');
        let $fieldBase = $validaotr.addField(
            $('#input'),
            {
                custom_fun: function ($_fieldBase) {
                    return $_fieldBase.val() == 12;
                }
            },
            {
                custom_fun: "custom function."
            }
        );
        $validaotr.validateAll();
        expect($fieldBase.error).toBe(null);
        expect($fieldBase.message).toBe(null);
    });

    describe('same to', function () {
        beforeEach(function () {
            jasmine.getFixtures().load('form.html');
        });

        it("invalid", function () {
            $('#password').val('123');
            let $fieldBase1 = $validaotr.addField(
                $('#password'),
                {
                    max: 10
                },
                {
                    max: "max."
                }
            );

            let $fieldBase2 = $validaotr.addField(
                $('#confirm-password'),
                {
                    max: 10,
                    sameTo: $('#password')
                },
                {
                    max: "max.",
                    sameTo: "same to."
                }
            );

            $validaotr.validateAll();

            expect($fieldBase2.error).toBe('sameTo');
        });

        it("valid", function () {
            $('#password').val('123');
            $validaotr.addField(
                $('#password'),
                {
                    max: 10
                },
                {
                    max: "max."
                }
            );
            $('#confirm-password').val('123');
            let $fieldBase2 = $validaotr.addField(
                $('#confirm-password'),
                {
                    max: 10,
                    sameTo: $('#password')
                },
                {
                    max: "max.",
                    sameTo: "same to."
                }
            );

            $validaotr.validateAll();

            expect($fieldBase2.error).toBe(null);
        });
    });
});