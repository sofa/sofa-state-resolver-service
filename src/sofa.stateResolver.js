'use strict';
/* global sofa */
/**
 * @name StateResolver
 * @namespace sofa.StateResolver
 *
 * @description
 * `StateResolver` is used within the`StateResolverService` to resolve a state
 * for a given url. It can easily be overwritten to swap out the resolve strategy.
 */
sofa.define('sofa.StateResolver', function ($q, $http, configService) {
    var STATES_ENDPOINT = configService.get('apiEndpoint') + 'states';

    return function (config) {
        return $http({
                method: 'POST',
                url: STATES_ENDPOINT,
                data: config
            });
    };
});
