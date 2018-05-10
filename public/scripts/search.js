$('#entry-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/search/query?' + search, function(data) {
    $('#entry-grid').html('');
    data.forEach(function(entry) {
      $('#entry-grid').append(`
       <div class="col-md-2 col-sm-3">
          <div class="thumbnail">
             <a  href="/entry/${ entry._id }"> <img class="poster-showcase" src="${ entry.image }"></a>
            <div class="caption">            
            </div>
            <p>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#entry-search').submit(function(event) {
  event.preventDefault();
});