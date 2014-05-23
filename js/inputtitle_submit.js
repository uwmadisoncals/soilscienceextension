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
  		var input_length = $("input[id='autocomplete1']").val().length;
  		ac_count++;
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
		   		$("div.autoc.filtered").addClass("notEmpty");

		   	});

		   	if(!!input_length){
  					$("div.autoc.filtered").addClass("notEmpty");
  				}else{
  					$("div.autoc.filtered").removeClass("notEmpty");
  				};



		   	$(".autoc ul li a").click(function(e) {
		   		e.preventDefault();

		   		var searchstr = $(this).text();
		   		//alert(searchstr);
		   		$("#autocomplete1").val(searchstr);
		   		$("#autocomplete1_submit").click();

		   	});


		   }
		}); /*end ajax*/
  		/*if(!!$("input[id='autocomplete1']").val().length){
  			alert($("input[id='autocomplete1']").val().length);
  		}else{
  			alert("failed test");
  		}; */
		if(ac_count>0){
  		console.log("ac_count greater than zero and not null");
  	}else if(ac_count==0){
  		console.log("ac_count is zero");
  	}else{
  		console.log("something else");
  	};
  	}); /* end keyup */
  
  if (ac_count ==0 ){
  	//alert("ac_count is : " + ac_count);
  };
  });
})(jQuery);