(function($){
  function init() {
    $('body').on('submit', 'form.ajax-form', function(e) {
      e.preventDefault();
      
      var t = $(this);
      var dt = {
        ajaxcall: true,
        ul: UI.Constants.ul,
        cn: UI.Constants.cn
      };

      var onSuccess = t.attr("data-ajax-success");
      var onError = t.attr("data-ajax-failure");

      t.ajaxSubmit({
        url: t.attr('action'),
        type: 'POST',
        data: dt,
        success: function(data, status, xhr) {
          UI.processAjaxResult(data);
          UI.Loading.hide();
          if (data && data.success) {
            getFunction(onSuccess, ["data", "status", "xhr"]).apply(this, arguments);
          } else {
            getFunction(onError, ["data", "status", "xhr"]).apply(this, arguments);
          }
        },
        error: function() {
          var failattr = onError;
          if (!failattr || failattr == '') UI.Informer.error();
          else {
            getFunction(failattr).apply(this, arguments);
          }
          UI.Loading.hide();
        },
        beforeSubmit: function() {
          UI.Loading.show();
          return true;
        },
        dataType: 'json'
      });
      return false;
    });
  }
  $(document).ready(init);
})(jQuery);