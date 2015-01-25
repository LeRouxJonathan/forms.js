$(document).ready(function()
{
	
  var form = new Form("form");
  var file = new Field("file");
  file.setFileExtensions([".txt", ".pdf"]);
  
  console.log(file);
  
  var submit = $("#submit");
  submit.click(function(event)
  {
    event.preventDefault();
    console.log(file.hasValidExtension());
    console.log(form.isValid());
    console.log(file.getErrorMessage());
   
    if (form.isValid() === true)
    {
      var data = form.getAsJSON();
      console.log(data);
      
    }
    else
    {
      var invalids = form.getInvalidFields();
      for (var i = 0; i < invalids.length; i++)
      {
        var invalid = invalids[i];
        console.log(invalid.getErrorMessage());
      }	
    }
    
    
  });
  //console.log(form);
  //console.log(input);
	
	
	
	
});

