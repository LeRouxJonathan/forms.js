
function Field (jQueryFormElement)
{
	this.field = jQueryFormElement;
	this.id = this.field.prop("id");
    this.name = this.field.prop("name");
    this.value = this.field.prop("value");
    this.type = this.field.prop("type");
    this.placeholder = this.field.prop("placeholder");
    this.selector = "#"+this.id;
    this.errordiv = null;
    this.errormessage = this.placeholder + " is invalid";
    
    
    //Returns the jQuery implementation element of this field
    this.getElement = function getElement()
    {
    	return this.field;
    };
    
    
    //Returns the name of the field element
    this.getName = function getName()
    {
    	return this.name;
    };
    
    
    // Analyzes the field to see if it contains a value
    this.contains = function contains(string)
    {
    	if (this.value.indexOf(string) !== -1)
    	{
    	   return true;
    	}
    	else
    	{
    	   return false;
    	}
    };
    
    //Checks the field for the "data-required" custom HTML tag
    this.isRequired = function isRequired()
    {
    	
      var reqtag = this.field.attr("data-required");
      
      if (reqtag === "undefined" || reqtag === undefined)
      {
      	return false;
      }
      
      if (reqtag !== "undefined" && reqtag !== undefined)
      {
         if (reqtag.toString().toLowerCase() === "true")
         {
         	return true;
         }	
         else
         {
         	return false;
         }
      }
    };
    
    //Checks to see if the field is empty
    this.isEmpty = function isEmpty()
    {
    	if (this.value.length === 0)
    	{
    	   return true;
    	}
    	
    	if (this.value.length > 0)
    	{
    	   return false;
    	}
    };
    
    //Checks, depending on type, whether or not the field is valid
    this.isValid = function isValid()
    {
    	if (this.type === "file")
    	{
    	   if (this.value.length > 0)
    	   {
    	   	  return true;
    	   }
    	   else
    	   {
    	      return false;
    	   }
    	}
    	
    	if (this.type === "text")
    	{
    	   if (this.value.length > 0)
    	   {
    	   	  return true;
    	   }
    	   else
    	   {
    	      return false;
    	   }
    	}
    	
    	if (this.type === "email")
    	{
    	   if (this.value.length > 0 && this.contains("@") === true && this.contains(".") === true)
    	   {
    	   	  return true;
    	   }
    	   else
    	   {
    	      return false;
    	   }
    	}
    	
    };
    
    // Sets a custom error div for the Field; This is where errors will be displayed if triggered for each Field
    this.setErrorDiv = function setErrorDiv(jQueryDiv)
    {
        this.errordiv = jQueryDiv;
    };
    
    // Returns the given Field's error div as a jQuery object
    this.getErrorDiv = function getErrorDiv()
    {
    	return this.errordiv;
    };
    
    // Sets a custom error message for the Field
    this.setErrorMessage = function setErrorMessage(message)
    {	
    	if (message !== "undefined" && arguments.length >= 1)
    	{
    		this.errormessage = message;
    	}
    };
    
    // Returns the given Field's assigned error message;
    this.getErrorMessage = function getErrorMessage()
    {
    	return this.errormessage;
    };
    
    
    
    
    
    // Returns true if Field is of a given type
    this.isType = function isType(typestring)
    {
    	if (this.type.toString().trim().toUpperCase() === typestring.toString().trim().toUpperCase())
    	{
    		return true;
    	}
    };
    
    
    // Returns true if Field is of type "file" (for file upload), further analyzes the field for possible given upload files by type
    this.isFile = function isFile(filetypesArray)
    {
    	if (filetypesArray === "undefined" || arguments.length < 1)
    	{
    	   if (this.type === "file")
    	   {
    	      return true;
    	   }
    	
    	   else
    	   {
    	      return false;	
    	   }
    	}
    	
        // If a specified set of accepted file extensions have been provided, analyze if this file is of the same type;
    	if (filetypesArray !== "undefined" || arguments.length >= 1)
    	{
    		if (this.type === "file")
    		{
    		   for (var i = 0; i < filetypesArray.length; i++)
    		   {
    		   	   var namepieces = this.value.split(".");
    		   	   var extension = namepieces[namepieces.length - 1].toString().trim().toUpperCase(); 
    		   	   
    		   	   if (extension.indexOf(filetypesArray[i].toString().trim().toUpperCase()) !== -1)
    		   	   {
    		   	   	  return true;
    		   	   }
    		   }       	
    		}
    	}
    return false;
    };
    
    
    
    // Return the field as a JSON value
    this.getAsJSON = function getAsJSON()
    {
       return this.name+"="+this.value; 
    };
    
    
} //End: Field





function Form (jQueryForm)
{
   this.form = jQueryForm;
   this.id = this.form.prop("id");
   this.name = this.form.prop("name");
   this.action = this.form.prop("action");
   this.selector = "#"+this.id;
   
   
   //Returns the name of the form element
   this.getName = function getName()
   {
   	return this.name;
   };
   
   //Returns the id of the form element
   this.getId = function getId()
   {
   	return this.id;
   };
   
   //Returns an array of all form fields as specified by type as Field objects
   this.getFields = function getFields()
   {
   	   var fields = [];

   	   $("#"+this.id+" :input").each(function()
   	    {
   	      var field = new Field($(this));
   	      
   	      // Exclude "submits" as we don't want buttons
   	   	  if (field.type.toString().trim().toLowerCase() !== "submit")
   	   	  {
   	   	  	 fields.push(field);
   	   	  }
   	   	});
   	   

   	   if (fields.length < 1)
   	   {
   	   	  return null;
   	   }
   	   
   	   if (fields.length >= 1)
   	   {
   	      return fields;
   	   } 
   };
   
   //Checks the validity of the entire form on a per-field basis 
   this.isValid = function isValid()
   {
   	 var fields = this.getFields();
   	 {
   	 	 for (var i = 0; i < fields.length; i++)
   	 	 {
   	 	 	 if (fields[i].isValid() === false)
   	 	 	 {
   	 	 	 	return false;
   	 	 	 }
   	 	 }
   	 }
   	 
   	 return true;
   	   
   };
   
   // Returns all invalid fields as Field objects
   this.getInvalidFields = function getInvalidFields()
   {
   	   var invalids = [];
   	 
   	   var fields = this.getFields();
   	   {
   	 	 for (var i = 0; i < fields.length; i++)
   	 	 {
   	 	 	 if (fields[i].isValid() === false)
   	 	 	 {
   	 	 	 	invalids.push(fields[i]);
   	 	 	 }
   	 	 }
   	   }
   	   
   	   if (invalids.length < 1)
   	   {
   	   	   return null;
   	   }
   	   
   	   if (invalids.length >= 1)
   	   {
   	   	   return invalids;
   	   } 
   };
   
   //Returns all required fields (denoted by data-required = "true")
   this.getRequiredFields = function getRequiredFields()
   {
   	 var requireds = [];
   	
   	 var fields = this.getFields();
   	 
   	 for (var i = 0; i < fields.length; i++)
   	 {
   	 	 if (fields[i].isRequired() === true)
   	 	 {
   	 	 	requireds.push(fields[i]);
   	 	 }
   	 }
   	 
   	 if (requireds.length > 0)
   	 {
   	 	return requireds;
   	 }
   	 
   	 if (requireds.length < 1)
   	 {
   	 	return null;
   	 }
   };
   
   // Returns the entire form as JSON
   this.getAsJSON = function getAsJSON()
   {
      return this.form.serialize();
   };
}
