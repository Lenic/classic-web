import $ from 'jquery';

import style from './lazy';

style.load();

$('#download').attr('href', 'http://www.helianwifi.com');

$.getJSON('/api/users', function (data) {
  $('#target').html(JSON.stringify(data));
});

// modify any code and save, bug disappear.
