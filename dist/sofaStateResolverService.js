/**
 * sofa-state-resolver-service - v0.4.2 - Thu Feb 19 2015 14:17:46 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, document, undefined) {
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
    var STATES_ENDPOINT = configService.get('esEndpoint') + '_search?&size=1';

    var getCurrentCategoryId = function (routes, url) {
        var routeObj = sofa.Util.find(routes, function (route) {
            return route.productUrl === url;
        });
        return routeObj.categoryId;
    };

    return function (urlToResolve) {

        var query = {
            query: {
                filtered: {
                    filter: {
                        or: [
                            // category
                            {
                                term: {'route': urlToResolve}
                            },
                            // product
                            {
                                nested: {
                                    path: 'routes',
                                    filter: {
                                        term: {'routes.productUrl': urlToResolve}
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };

        return $http({
            method: 'POST',
            url: STATES_ENDPOINT,
            data: query
        })
            .then(function (data) {
                var hits = data.data.hits.hits;
                var stateType, stateData;

                if (!data.data.hits.hits.length) {
                    return $q.reject('can not resolve state');
                } else {
                    stateType = hits[0]._type;
                    stateData = hits[0]._source;
                }

                if (stateType === 'category') {
                    return {
                        data: {
                            url: urlToResolve,
                            stateName: 'categories',
                            stateParams: {
                                categoryId: stateData.id
                            }
                        }
                    };
                } else if (stateType === 'product') {
                    return {
                        data: {
                            url: urlToResolve,
                            stateName: 'product',
                            stateParams: {
                                categoryId: getCurrentCategoryId(stateData.routes, urlToResolve),
                                productId: stateData.id
                            }
                        }
                    };
                }
            });
    };
});

'use strict';
/* global sofa */
/**
 * @name StateResolverService
 * @class
 * @namespace sofa.StateResolverService
 *
 * @description
 * `sofa.StateResolverService` is a service to resolve human readable URLs into states that
 * can be dealt with on an application level.
 */
sofa.define('sofa.StateResolverService', function ($q, $http, configService) {
    var self            = {},
        stateResolver   = new sofa.StateResolver($q, $http, configService),
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
    * @param {url} The URL to be resolved.
     *
    * @return {promise} The deferred carrying the resolved state.
    */
    self.resolveState = function (url) {
        var deferred = $q.defer();

        if (states[url]) {
            deferred.resolve(states[url]);
        }
        else {
            stateResolver(url)
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
}(sofa, document));
