'use strict';
/* global sofa */
/* global AsyncSpec */

describe('sofa.StateResolverService', function () {

    var stateResolverService,
        qService,
        configService,
        httpService;

    var async = new AsyncSpec(this);

    beforeEach(function () {
        configService        = new sofa.ConfigService();
        qService             = new sofa.QService();
        httpService          = new sofa.mocks.httpService(qService);
        stateResolverService = new sofa.StateResolverService(qService, httpService, configService);
    });

    it('should be defined', function () {
        expect(stateResolverService).toBeDefined();
    });

    async.it('should resolve state', function (done) {

        var state = {
            url: 'some-url'
        };

        stateResolverService.registerState(state);

        stateResolverService
            .resolveState(state.url)
            .then(function (resolvedState) {
                expect(resolvedState).toEqual(state);
                done();
            });
    });
});
