/*global define*/
define(['jquery', 'esprima', 'eslevels','codemirror','codemirror.javascript'], function($, esprima, eslevels, CodeMirror) {
    'use strict';
    var exports = {};
    exports.run = function() {
        var editor;

        editor = new CodeMirror($('#editor')[0], {
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
            var ast = esprima.parse(code, {range:true});
            var levels = eslevels.levels(ast);
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
            $('#colorer').html(result);
        };

        editor.on('change', colorCode);
        colorCode(editor);


        $('.btn-group .btn').click(function() {
            var src = 'examples/'+$(this).data('src')+'.js';
            $.ajax({
                url: src,
                dataType: 'text',
                success: function(data) {
                    editor.setValue(data);
                },
                error: function(req, err, ex) {
                    console.log(req,    err, ex);
                }
            });
        });
        $('.btn-group .btn:first').click();
        $('.CodeMirror-hscrollbar').scroll(function(){
            $('#colorer').scrollTop($(this).scrollTop());
            $('#colorer').scrollLeft($(this).scrollLeft());
        });
    };
    return exports;
});
