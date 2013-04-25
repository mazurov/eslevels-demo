/*global define, CodeMirror */
define(['jquery', 'eslevels'], function($, eslevels) {
    'use strict';
    var context, editor;

    context = new eslevels.Context();

    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        viewportMargin: Infinity,
        lineNumbers: true,
        matchBrackets: true,
        continueComments: 'Enter',
        mode: 'javascript'
    });
    var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#x27;',
        '/': '&#x2F;'
    };
    var htmlEscaper = /[&<>"'\/]/g;
    // Escape a string for HTML interpolation.
    var escape = function(string) {
        return ('' + string).replace(htmlEscaper, function(match) {
            return htmlEscapes[match];
        });
    };

    var colorCode = function(cm) {
        var code = cm.getValue();
        var result = '';
        var curr = 0;
        context.setCode(code);
        var levels = context.color();
        for (var pos = 0; pos < code.length; ++pos) {
            if ((curr < levels.length) && (pos === levels[curr][1])) {
                result += '<span class="cm-level' + levels[curr][0] + '">';
            }
            result += escape(code[pos]);

            if ((curr < levels.length) && (pos === levels[curr][2])) {
                result += '</span>';
                curr += 1;
            }
        }
        $('#scope').html(result);
    };

    editor.on('change', colorCode);
    colorCode(editor);
    // var code = $("#code").text();
    // var result = context.color();
    // var pos1, pos2, region;
    // for (var i=0; i < result.length; i+=1) {
    //     region = result[i];
    //     pos1 = editor.findPosH({line:0, ch:0}, region[1], "char");
    //     pos2 = editor.findPosH({line:0, ch:0}, region[2], "char");
    //     console.log(pos1,pos2);
    //     editor.markText(pos1,pos2, {className: "level"+region[0]});
    // }
    return {};
});