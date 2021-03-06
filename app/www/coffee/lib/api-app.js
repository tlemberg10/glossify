// Generated by CoffeeScript 1.9.1
(function() {
  requirejs.config({
    baseUrl: 'coffee/lib',
    paths: {
      jquery: '../../js/jquery-2.1.3.min'
    }
  });

  requirejs(['jquery', 'storage', 'api'], function($, storage, api) {
    var _registerEvents, _setBodyHtml;
    _setBodyHtml = function(apiSummary) {
      var allInputsHtml, allOptionsHtml, bodyHtml, divHtml, divs, divsHtml, first, firstClass, funcName, i, inputDivHtml, inputHtml, inputs, j, len, len1, optionHtml, options, outputHtml, param, ref, ref1, selectHtml, submitDivHtml;
      divs = [];
      options = [];
      first = true;
      ref = Object.keys(apiSummary);
      for (i = 0, len = ref.length; i < len; i++) {
        funcName = ref[i];
        optionHtml = "<option value='" + funcName + "'>" + funcName + "</option>";
        options.push(optionHtml);
        inputs = [];
        ref1 = apiSummary[funcName]['params'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          param = ref1[j];
          inputHtml = "<tr>\n	<td>" + param + "</td>\n	<td><input id='arg-" + funcName + "-" + param + "' type='text' /></td>\n</tr>";
          inputs.push(inputHtml);
        }
        allInputsHtml = inputs.join('');
        inputDivHtml = "<table>\n	" + allInputsHtml + "\n</table>";
        submitDivHtml = "<div>\n	<input type=\"submit\" data-func-name='" + funcName + "' class='submit-btn' />\n</div>";
        if (first) {
          firstClass = 'func-div-first';
        } else {
          firstClass = '';
        }
        divHtml = "<div id='func-div-" + funcName + "' class='func-div " + firstClass + "'>\n	<h2>" + funcName + "</h2>\n	" + inputDivHtml + "\n	" + submitDivHtml + "\n</div>";
        divs.push(divHtml);
        first = false;
      }
      allOptionsHtml = options.join('');
      selectHtml = "<select id='func-select'>" + allOptionsHtml + "</select>";
      divsHtml = divs.join('');
      outputHtml = "<div>\n	<h2>Output</h2>\n	<div id='response-text'></div>\n</div>";
      bodyHtml = selectHtml + "\n" + divsHtml + "\n" + outputHtml;
      $('body').html(bodyHtml);
      $('.func-div').hide();
      return $('.func-div-first').show();
    };
    _registerEvents = function(apiSummary) {
      $('#func-select').change(function(event) {
        var funcName;
        $('#response-text').html('');
        funcName = $(this).val();
        $('.func-div').hide();
        return $("#func-div-" + funcName).show();
      });
      return $('.submit-btn').click(function(event) {
        var func, funcName, handler, i, len, param, paramValues, ref;
        funcName = $(this).data('func-name');
        paramValues = [];
        ref = apiSummary[funcName]['params'];
        for (i = 0, len = ref.length; i < len; i++) {
          param = ref[i];
          paramValues.push($("#arg-" + funcName + "-" + param).val());
        }
        func = apiSummary[funcName]['func'];
        handler = function(json) {
          return $('#response-text').html(JSON.stringify(json));
        };
        if (paramValues.length === 0) {
          return func(handler);
        } else if (paramValues.length === 1) {
          return func(paramValues[0], handler);
        } else if (paramValues.length === 2) {
          return func(paramValues[0], paramValues[1], handler);
        } else if (paramValues.length === 3) {
          return func(paramValues[0], paramValues[1], paramValues[2], handler);
        }
      });
    };
    return $(document).ready(function(event) {
      var apiSummary;
      apiSummary = api.apiSummary();
      _setBodyHtml(apiSummary);
      return _registerEvents(apiSummary);
    });
  });

}).call(this);
