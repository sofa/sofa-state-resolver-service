require('shared-sofa-component-tasks')(require('gulp'), {
    pkg: require('./package.json'),
    baseDir: __dirname,
    testDependencyFiles: [
        'node_modules/shared-sofa-component-tasks/node_modules/sofa-testing/mocks/sofa.httpService.mock.js',
        'node_modules/sofa-core/dist/sofaCore.angular.js',
        'node_modules/sofa-q-service/dist/sofa.qService.js'
    ]
});
