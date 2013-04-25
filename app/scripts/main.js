require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        esprima: '../components/esprima/esprima',
        escope: '../components/escope/escope',
        estraverse: '../components/estraverse/estraverse',
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
    console.log(app);
    // console.log('Running jQuery %s', $().jquery);
});
