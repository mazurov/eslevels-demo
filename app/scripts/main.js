require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        esprima: '../components/esprima/esprima',
        estraverse: '../components/estraverse/estraverse',
        escope: '../components/escope/escope',
        eslevels: '../components/eslevels/eslevels',
        codemirror: '../components/codemirror/lib/codemirror',
        'codemirror.javascript': '../components/codemirror/mode/javascript/javascript'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        codemirror : {
            exports: 'CodeMirror'
        },
        'codemirror.javascript': ['codemirror']
    }
});

require(['app'], function (app) {
    'use strict';
    // use app here
    app.run();
    // console.log('Running jQuery %s', $().jquery);
});
