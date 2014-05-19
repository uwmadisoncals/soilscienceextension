jQuery(document).ready(function($){
	$("#autocompleteID").autocomplete({
		source: function(request, response){
			jQuery.getJson(autocompleteAjaxObject.ajaxurl + "?callback=?&action=autocompleteAjaxAction",request,function(data){
				response(jQuery.map(data, function(item){
					jQuery.each(item, function(i,val){
						val.label = val.whatever;
					});
					return item;
				}))
			})
		}
	})
})