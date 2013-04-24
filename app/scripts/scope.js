/*global CodeMirror */
CodeMirror.defineMode('scope', function (config, modeConfig) {
    'use strict';

    var nextToken = function(stream, state) {
        state.pos +=1;
        var levels = modeConfig.getLevels();
        stream.skipToEnd();
        return "level7";
    };

    return {
        startState: function () {
            return {
                pos: 0,
                //levels array index
                index: 0
            };
        },
        token: function (stream, state) {
            return nextToken(stream, state);
        },
    };
});