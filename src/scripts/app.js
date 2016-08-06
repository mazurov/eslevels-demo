import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import '../styles/main.css';
import 'bootstrap/dist/css/bootstrap.css';

import $ from 'jquery';
import esprima from 'esprima';
import eslevels from 'eslevels';
import {version as escopeVersion} from 'escope';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';


window.$ = window.jQuery = require('jquery');
require('bootstrap/dist/js/npm');
// Bootstrap.$ = $;

var exports = {};
exports.run = function() {
    'use strict';
    var editor;
    var eslevelsMode = 'full';
    var ecmaVersion = '5';
    var sourceType = 'script';
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
        $('body').removeClass('bg-danger');
        var code = cm.getValue();
        var result = '';
        var curr = 0;
        var ast;
        try {
          ast = esprima.parse(code, {range: true, sourceType: 'module'});
        }catch (e) {
          console.error('Parse error');
          $('#colorer').html(code);
          $('body').addClass('bg-danger');
          return;
        }
        var levels;
        try{
            levels = eslevels.levels(ast, {mode: eslevelsMode, escopeOpts: { sourceType: sourceType, ecmaVersion: parseInt(ecmaVersion)} });
        }catch(e){
          console.error('Escope error ' + e);
          $('#colorer').html(code);
          $('body').addClass('bg-danger');
          return;
        }
        for (var pos = 0; pos < code.length; ++pos) {
          if ((curr < levels.length) && (pos === levels[curr][1])) {
            result += '<span class="cm-level' + levels[curr][0] + ' cm-' + eslevelsMode + '">';
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

    $('.btn').click(function() {
        var src = 'examples/' + $(this).data('src') + '.js';
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
    $('.btn:first').click();
    $('.CodeMirror-hscrollbar').scroll(function() {
        $('#colorer').scrollTop($(this).scrollTop());
        $('#colorer').scrollLeft($(this).scrollLeft());
      });

    $('#mode-vars').click(function() {
        if ($(this).prop('checked')) {
          eslevelsMode = 'mini';
        } else {
          eslevelsMode = 'full';
        }
        colorCode(editor);
      });

    $('input[name="es"]').change(
        function() {
            ecmaVersion = $(this).val();
            colorCode(editor);
        }
    );

    $('input[name="st"]').change(
        function() {
            sourceType = $(this).val();
            colorCode(editor);
        }
    );

    $('#esprima-version').text(esprima.version);
    $('#eslevels-version').text(eslevels.version);
    $('#escope-version').text(escopeVersion);
};

$('[data-toggle="tooltip"]').tooltip();

exports.run();
export default exports;
