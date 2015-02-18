angular.module('sofa.stateResolverService', ['sofa.core'])
    .factory('stateResolver', function($q, $http, configService) {
        'use strict';
        return new sofa.StateResolver($q, $http, configService);
    })
    .factory('stateResolverService', function ($q, $http, configService) {
        'use strict';
        return new sofa.StateResolverService($q, $http, configService);
    });
