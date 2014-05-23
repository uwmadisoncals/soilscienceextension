/*(function($) {
  $(document).ready(function(){
      $('#next').click(function(){
  	    $.post(
			{ //data

			PT_Ajax.ajaxurl, //url
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
  	var ac_count = 0;
  	$('#autocomplete1').keyup(function(){
  		var input= $('#autocomplete1').val();
  		var input_length = $("input[id='autocomplete1']").val().length;
  		var flag_emptyJson = false;

  		//alert(input);
  		$.ajax({
		   url:PT_Ajax.ajaxurl,
		   data:{
		   	action:'ajax-inputtitleSubmit',
		   	title : 'something',
		   	input : input,
		   	nextNonce : PT_Ajax.nextNonce
		   },
		   // this function fires at each successful receipt of json object
		   success: function(msg){
		   	$(".autoc ul").html("");

		   	//build the list of suggestions from the JSON objects returned
		   	$.each(msg,function(key,value){
		   		$(".autoc ul").append("<li><a href='#'>"+value.slug+"</a></li>");
		   	});

		   	//if the json response is empty, flag it
		   	if(msg.length===0){
		   		flag_emptyJson =true;
		   	}

		   	//check current field value length and if returned json is empty. add/remove appropriate classes
		   	if(!!input_length && !flag_emptyJson){
  					$("div.autoc.filtered").addClass("notEmpty");
  				}else{
  					$("div.autoc.filtered").removeClass("notEmpty");
  				};

  			//clicking on the list items, submits the form 
		  	$(".autoc ul li a").click(function(e) {
		   		e.preventDefault();
		   		var searchstr = $(this).text();
		   		//alert(searchstr);
		   		$("#autocomplete1").val(searchstr);
		   		$("#autocomplete1_submit").click();

		   	});


		   },
		   error: function(){
		   	alert("error thrown");
		   }
		}); /*end ajax*/
  	}); /* end keyup */
  
  if (ac_count ==0 ){
  	//alert("ac_count is : " + ac_count);
  };
  });
})(jQuery);