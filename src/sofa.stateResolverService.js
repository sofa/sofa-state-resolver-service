'use strict';
/* global sofa */
/**
 * @name StateResolverService
 * @class
 * @namespace sofa.StateResolverService
 *
 * @description
 * `sofa.StateResolverService` is a service to resolve human readable URLs into states that
 * can be dealed with on an application level.
 */
sofa.define('sofa.StateResolverService', function ($q, $http, configService) {
    var self            = {},
        stateResolver   = new sofa.StateResolver($q, $http, configService),
        storeCode       = configService.get('storeCode'),
        useShopUrls     = configService.get('useShopUrls'),
        states          = {};

    /**
    * @method registerState
    * @memberof sofa.StateResolverService
    *
    * @description
    * registers a state
    *
    * @example
    * stateResolverService.registerState(state);
    *
    * @param {object} state The state to be registered.
    *
    */
    self.registerState = function (state) {
        states[state.url] = state;
    };

    /**
    * @method resolveState
    * @memberof sofa.StateResolverService
    *
    * @description
    * Takes an URL and resolves it into a state
    *
    * @example
    * stateResolverService
    *    .resolveState(url)
    *    .then(function(state){
    *        //do something with state
    *    })
    *
    * @param {object} deferred The deferred carrying the resolved state.
    */
    self.resolveState = function (url) {
        var deferred = $q.defer();

        // in legacy mode we need to remove the leading slash that comes
        // from the url because on the serverside we are only dealing with
        // keys (e.g. some-crazy-product) and not with paths.s
        if (!useShopUrls && url.charAt(0) === '/') {
            url = url.substr(1);
        }

        if (states[url]) {
            deferred.resolve(states[url]);
        }
        else {
            stateResolver({
                storeCode: storeCode,
                url: url
            })
            .then(function (response) {
                deferred.resolve(response.data);
            }, function () {
                deferred.reject();
            });
        }

        return deferred.promise;
    };

    return self;

});
