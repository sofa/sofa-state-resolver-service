/**
 * sofa-state-resolver-service - v0.4.2 - Thu Feb 19 2015 14:17:47 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (angular) {
angular.module('sofa.stateResolverService', ['sofa.core'])
    .factory('stateResolver', ["$q", "$http", "configService", function($q, $http, configService) {
        'use strict';
        return new sofa.StateResolver($q, $http, configService);
    }])
    .factory('stateResolverService', ["$q", "$http", "configService", function ($q, $http, configService) {
        'use strict';
        return new sofa.StateResolverService($q, $http, configService);
    }]);
}(angular));
