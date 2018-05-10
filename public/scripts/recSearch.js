

$('#e1').select2({
    ajax: {
        url: "/search/query",
        dataType: 'json',
        delay: 250,
        data: function(params) {
            return {
                name: params.term,
            };
        },
        processResults: function(data) {
            var fixedData = data.map(function(obj){
              obj.id = obj._id;
              obj.text = obj.name + "(" + obj.type.name + ")";
              return obj;
            });

            return {
                results: fixedData
            };
        },
        cache: true
    },
    placeholder: 'Search for an entry',
    escapeMarkup: function(markup) { return markup; },
   // id: function (item) { return item._id },
   // text:function(item) {return item.name},
   // minimumInputLength: 1,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
});

function formatRepo(entry) {
    if (entry.loading) {
       return entry.text;
     }
    //var typeName = type.name;
    var markup = "<div class= 'container' > <div class= 'row' > <div class = 'col-3'>";

    if(entry.image){
      markup += " <img class='img-fluid'src='" + entry.image + "'>";
    }

    markup+="</div>"
     
    markup += "<div class='col-auto'><div class='row'>" + entry.name + "</div>"

    if(entry.type){
      markup += "<div class='row'> (" + entry.type.name + ") </div>";
    }
    markup +="</div> </div> </div>";
   
    //console.log(repo);
    console.log(markup);
    return markup;
}

function formatRepoSelection(entry) {
   var markup = entry.name;

    if(entry.type){
      markup += " (" + entry.type.name + ")";
    }
   
    return markup || entry.text;
}