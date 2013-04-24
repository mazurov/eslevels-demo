require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        esprima: '../components/esprima/esprima',
        escope: '../components/escope/escope',
        estraverse: '../components/estraverse/estraverse',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app'], function (app) {
    'use strict';
    // use app here
    console.log(app);
    // console.log('Running jQuery %s', $().jquery);
});