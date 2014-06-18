'use strict';
/* global sofa */

describe('sofa.StateResolverService', function () {

    var componentName;

    beforeEach(function () {
        componentName = new sofa.StateResolverService();
    });

    it('should be defined', function () {
        expect(componentName).toBeDefined();
    });
});
