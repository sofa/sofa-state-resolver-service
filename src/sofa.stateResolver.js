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
