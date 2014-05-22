/*(function($) {
  $(document).ready(function(){
      $('#next').click(function(){
  	    $.post(
			PT_Ajax.ajaxurl, //url
			{ //data

				// wp ajax action
				action : 'ajax-inputtitleSubmit',
				
				// vars
				title : $('input[name=title]').val(),
			 
				// send the nonce along with the request
				nextNonce : PT_Ajax.nextNonce
			},
			function( response ) { //success
				console.log( response );
			}
		);
		return false;
	    });	
		    	
  });
})(jQuery); */



(function($) {
  $(document).ready(function(){
  	$('#autocomplete1').keyup(function(){
  		var input= $('#autocomplete1').val();

  		//alert(input);
  		$.ajax({
		   url:PT_Ajax.ajaxurl,
		   data:{
		   	action:'ajax-inputtitleSubmit',
		   	title : 'something',
		   	input : input,
		   	nextNonce : PT_Ajax.nextNonce
		   },
		   success: function(msg){
		   	$(".autoc ul").html("");
		   	//alert(msg[0]);
		   	$.each(msg,function(key,value){
		   		//alert(key+ ": "+value.slug);
		   		//console.log(key+ ": "+value.slug);
		   		$(".autoc ul").append("<li><a href='#'>"+value.slug+"</a></li>");
		   	});

		   	$(".autoc ul li a").click(function(e) {
		   		e.preventDefault();

		   		var searchstr = $(this).text();
		   		//alert(searchstr);
		   		$("#autocomplete1").val(searchstr);
		   		$("#autocomplete1_submit").click();

		   	});


		   }
		}); /*end ajax*/
  	});
  });
})(jQuery);