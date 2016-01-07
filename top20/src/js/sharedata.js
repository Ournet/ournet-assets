(function($, popup) {
  var controls = $('.our-sharedata');
  if (controls.length === 0) return;
  $.each(controls, function(i) {
    var c = $(controls[i]);

    var item = $(".our-share-item", c);
    item.on('click', function() {
      var it = $(this);
      share({
        itemname: c.attr('data-title'),
        url: it.attr('href')
      });
    });
  });

  function share(data) {
    Popup.popup({
      url: data.url
    });
  }

})(jQuery, Popup);
