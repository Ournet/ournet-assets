(function($, gd) {
  $('#widget-conf-place').autocomplete('controls/findplace', {
    minChars: 3,
    selectFirst: true,
    scrollHeight: 320,
    autoFill: false,
    params: {
      ul: gd.ul
    },
    extraParams: {
      ul: gd.ul
    },
    formatItem: function(data, i, max, value) {
      var txt = '<strong>' + data.name + '</strong><div>' + data.region.name + '</div>';
      return txt;
    },
    parse: function(data) {
      return $.map(data, function(row) {
        return {
          data: row,
          value: new String(row.id),
          result: row.name
        }
      });
    }
  }, 'json').result(function(evnt, data) {
    $('#widget-conf-placeid').val(data.id);
  });

  function getData() {
    var data = {};
    $('#widget-conf .conf-input').each(function() {
      var element = $(this);
      var name = element.attr('name');
      data[name] = element.val();
      if (element.attr('type') === 'checkbox') {
        data[name] = element.attr('checked') === 'checked';
      }
    });
    data.ul = data.ul || gd.ul;
    return data;
  }

  function generate() {
    var data = getData();
    var type = $('#widget-type').val();
    $.get('/' + type + '/widget_html_script', data, function(result) {
      $('#widget-iframe').html(result);
      $('#widget-script').val(result);
    });
  }

  $('#widget-conf-generate').click(generate);

  $('#widget-types .type-item').click(function() {
    var data = $.parseJSON($(this).attr('data-data'));
    for (var prop in data) {
      $('#widget-conf .conf-input[name=' + prop + ']').val(data[prop]);
    }
    generate();
  });

  generate();
})(jQuery, globalInitData);
