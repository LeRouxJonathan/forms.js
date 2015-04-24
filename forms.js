function Field (elementId)
{
    this.field = document.getElementById(elementId);
    this.id = this.field.id;
    this.name = this.field.getAttribute("name");
    this.value = this.field.value;
    this.type = this.field.type;

    //By default, error_message is blank. 
    //When actions performed against the field find it to be invalid in some way, the error message will be set and reported
    this.error_message = "";
    
    this.file_extensions = null;
    
    // Sets a custom error message for the Field
    this.setErrorMessage = function setErrorMessage(message)
    {	
      this.error_message = message;
    };//end: setErrorMessage(message)
    
    
    // Returns the given Field's assigned error message;
    this.getErrorMessage = function getErrorMessage()
    {
      return this.error_message;
    };//end: getErrorMessage()
    
    
    //Returns the name of the Field element
    this.getName = function getName()
    {
      return this.name;
    };//end: getName()
    
    //Returns the current value of the Field
    this.getValue = function getValue()
    {
      return this.value;
    };//end: getValue()
    
    //Returns the values selected in the two types of HTML <select> elements
    this.getSelectedValue = function getSelectedValue()
    {
      if (this.type === "select-one")
      {
        return this.field.options[this.field.selectedIndex].value;
      }
      
      if (this.type === "select-multiple")
      {
      	var values = [];
      	var options = this.field.getElementsByTagName("option");
      	
      	if (options.length > 0)
      	{
      	  for (var i = 0; i < options.length; i++)
      	  {
      	    if (options[i].selected === true)
      	    {
      	      values.push(options[i].value);
      	    }
      	  }
      	  
      	  if (values.length > 0)
      	  {
      	    return values;
      	  }
      	  else
      	  {
      	    return null;
      	  }
      	  	
      	}
      	else
        {
          return null;
        }
      }
      
      else
      {
        return "Type of Field is not of type select-one or select-multiple";
      }
    };//end: getSelectedValue()
    
    
    //Returns the type of the Field
    this.getType = function getType()
    {
    	
      return this.type;
      
    };//end: getType()
    
    //Checks the field for the "data-required" custom HTML tag
    this.isRequired = function isRequired()
    {
    	
      var reqtag = this.field.getAttribute("data-required");
      
      if (reqtag === null)
      {
      	return false;
      }
      else
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
    };//end: isRequired()
    
    //Checks to see if the Field is empty
    this.isEmpty = function isEmpty()
    {
    
      if (this.type === "select-one" || this.type === "select-two")	
      {
        if (this.field.options[this.field.selectedIndex].value.length === 0 || this.field.options[this.field.selectedIndex].value.toString().trim() === "")
        {
          return true;
        }
        else
        {
          return false;
        }
      }
      else
      {
        if (this.value.length === 0)
        {
          return true;
        }
        else
        {
          return false;
        }
      }
      
    };//end: isEmpty()
    
    //Checks, depending on type, whether or not the field is valid
    this.isValid = function isValid()
    {
      //File
      if (this.type === "file")
      {
      	
      	//Determine if we even have a file value selected by the end-user
        if (this.value.length > 0)
    	{
    	  //Determine if we have pre-defined allowed extensions for this file
    	  //If so, determine if the end-user's selected file matches our allowed extensions
    	  if (this.getFileExtensions() !== null)
    	  {
    	    if (this.hasValidExtension() === true)
    	    {
    	      return true;
    	    }
    	    else
    	    {
    	      this.setErrorMessage("Invalid file extensions detected for Field: " + this.name);
    	      return false;
    	    }
    	  }
    	  
    	  //If no specific extensions are desired, this is a valid file upload
    	  else
    	  {
    	    return true;
    	  }
    	}
    	
    	//If nothing has been provided by the end-user for this file upload, it is invalid
    	else
    	{
          this.setErrorMessage("No input detected for Field " + this.name);
    	  return false;
    	}
      }
      
      //Text
      if (this.type === "text")
      {
        if (this.value.length > 0)
    	{
    	  return true;
    	}
    	else
    	{
    	  this.setErrorMessage("No input detected for Field: " + this.name);
    	  return false;
    	}
      }
      
      //Textareas
      if (this.type === "textarea")
      {
        if (this.value.length > 0 && this.value.toString().trim() !== "")
        {
          return true;
        }
        else
        {
          this.setErrorMessage("No input detected for Field: " + this.name);
          return false;
        }
      }
    	
    	
      //Email
      if (this.type === "email")
      {
        if (this.value.length > 0 && this.value.indexOf("@") !== -1 && this.value.indexOf(".") !== -1) //Submits only the most simple criteria for email validation
    	{
    	  return true;
    	}
    	else
    	{
    	  this.setErrorMessage("Invalid or missing email for Field: " + this.name);
    	  return false;
    	}
      }
      
      //If the field is a select box that only allows for the selection of one value
      if (this.type === "select-one")
      {
        if (this.field.options[this.field.selectedIndex].value.length > 0)
        {
          return true;
        }
        
        else
        {
          this.setErrorMessage("No selection supplied for Field: " + this.name);
          return false;
        }
      }
      
      
      //If field is a select box that allows for the selection of multiple values
      if (this.type === "select-multiple")
      {
        if (this.field.options[this.field.selectedIndex].value.length > 0)
        {
          return true;
        }
        
        else
        {
          this.setErrorMessage("No selection(s) made for Field: " + this.name);
          return false;
        }
      }
      
    };//end: isValid()

    
    
    //Checks the type of the Field against the queried type
    this.isType = function isType(type)
    {
      if (this.type.toString().trim().toUpperCase() === type.toString().trim().toUpperCase())
      {
        return true;
      }
      else
      {
        return false;
      }
    };//end: isType(type)
    
    
    //Sets the approved file extensions for the 
    this.setFileExtensions = function setFileExtensions(fileExtensionsArray)
    {
      if (this.getType() === "file")
      {
        //Ensure the values we're attempting to set as valid file extensions are in the form of an array
        if (fileExtensionsArray instanceof Array)
        {
          //For clarity's sake, strip the "."s that may have been included in the array.
          //Example: var extensions = [".txt", ".pdf", ".xls"] => ["txt", "pdf", "xls"]
        
          var extensions = [];
          for (var i = 0; i < fileExtensionsArray.length; i++)
          {
            var array_piece = fileExtensionsArray[i].toString().trim();
            if (array_piece.indexOf(".") !== -1)
            {
              extensions.push(array_piece.replace(".", ""));
            }
            else
            {
              extensions.push(array_piece);
            }
          }
        
          //Finally, set the accepted file extensions for this Field as the cleansed array.
          this.file_extensions = extensions;
        }
        else
        {
          return "Invalid fileExtensionsArray encountered when attempting to assign valid file extensions to Field " + this.getName();
        }	
      }
      else
      {
        return "Field " + this.getName() + " must be of type file when attempting to set a array of valid file types";
      }
    };//end: setFileExtensions(fileExtensionsArray)
    
    
    //Returns the allowed file extensions for this File
    this.getFileExtensions = function getFileExtensions()
    {
      return this.file_extensions;
    };//end: getFileExtensions()
    
    
    	
     
    //Determines if an end-user submitted file, attached to a Field of type "file" is of the proper extension
    this.hasValidExtension = function hasValidExtension()
    {
      //Determine if this is even a Field of type file
      if (this.getType() === "file")
      {
      	
      	var accepted_extensions = this.getFileExtensions();
      	
        if (accepted_extensions !== null)
        {
        
          //Grab the file that the user is attempting to submit
          var filename = this.value;
          var namepieces = filename.toString().split(".");
          var extension = namepieces[namepieces - 1];
            
          //Check the extension of this file against our Array of accepted file extensions
          for (var i = 0; i < accepted_extensions.length; i++)
          {
            if (extension === accepted_extensions[i])
            {
              return true;
            }
          }
          
          //If the submitted file's extension is never found within our Array of accepted file types, return false;
          return false;
        }  
          
        //By default, return true, unless an unsupported extension is detected
        else
        {
          return "File extension parameters must be of type Array";
        }
      }
      else
      {
        return "Field is not of type 'file'";
      }
    }; //end: hasvalidExtension()
    
    
    
    //Return the field as a serialized string
    this.serialize = function serialize()
    {	
      var string = "";
    	
      //if the Field is of type select-one or select-multiple
      //Example: <select ../> or <select multiple = "multiple" ... /> HTML elements	  
      if (this.type === "select-one" || this.type === "select-multiple")
      {
        var selected = this.getSelectedValue();
        
        if (selected !== null && selected !== undefined)
        {
          string = this.name+"="+encodeURIComponent(selected);
        }
        
        //If this select box has no selections made, exclude it from the string entirely
        else
        {
          return ""; 
        }
        
      }
      
      //If the Field element in question is of any other type than select-one or select-multiple
      else
      {
        if (string === "")
        {
          string = string + this.name+"="+encodeURIComponent(this.value);
        }
        else
        {
          string = string + "&" + this.name+"="+encodeURIComponent(this.value);
        }	
      }
     
      return string;
    
    }; //end: serialize()
    
    
} //End: Field





function Form (formId)
{
   this.form = document.getElementById(formId);
   this.id = this.form.id;
   this.name = this.form.getAttribute("name");
   
   
   this.action = this.form.getAttribute("action");
   this.method = this.form.getAttribute("method");
   
   //Returns the name of the form element
   this.getName = function getName()
   {
   	 return this.name;
   };//end: getName()
   
   
   //Returns the id of the form element
   this.getId = function getId()
   {
   	 return this.id;
   };//end: getId()
   
   
   //Sets the $_GET/$_POST action for this form
   this.setAction = function setAction(action)
   {
     this.form.setAttribute("action", action);
     this.action = action;
   };//end: setAction(action)
   
   
   //Returns the $_GET/$_POST action for this form
   this.getAction = function getAction()
   {
     return this.action;
   };//end: getAction()
   
   
   //Sets the submission method for this Form
   this.setMethod = function setMethod(method)
   {
     this.form.setAttribute("method", method);
     this.method = method;
   };//end: setMethod(method)
   
   
   //Returns the submission method for this Form
   this.getMethod = function getMethod()
   {
     return this.method;
   };//end: getMethod()
   
   //Returns an array of all form fields as specified by type as Field objects
   this.getFields = function getFields()
   {
   	   var form_elements = this.form.elements;
   	   var fields = [];
   	   //Create a Field object for each input element
       for (var i = 0; i < form_elements.length; i++)
       {
         var field = new Field(form_elements[i].id);
         if (field.type !== "submit")
         {
           fields.push(field);
         }
       }
       //Return null if we have nothing
   	   if (fields.length < 1)
   	   {
   	   	  return null;
   	   }
   	   
   	   //If we have valid Field objects, return them.
   	   if (fields.length >= 1)
   	   {
   	      return fields;
   	   } 
   };//end: getFields()
   
   
   //Returns all required fields (denoted by data-required = "true")
   this.getRequiredFields = function getRequiredFields()
   {
   	 var requireds = [];
   	
   	 var fields = this.getFields();
   	 
   	 for (var i = 0; i < fields.length; i++)
   	 {
   	 	 if (fields[i].isRequired() === true && fields[i].getType() !== "submit")
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
   };//end: getRequiredFields()
   
   
   // Returns all invalid fields as Field objects in the context of Form validity
   this.getInvalidFields = function getInvalidFields()
   {
   	   var invalids = [];
   	 
   	   var fields = this.getFields();
   	   {
   	 	 for (var i = 0; i < fields.length; i++)
   	 	 {
   	 	   var field = fields[i];
   	 	   
   	 	   if (field.isRequired() === true && field.isValid() === false)
   	 	   {
   	 	     invalids.push(field);
   	 	   }
   	 	 	 
   	 	   if (field.isRequired() === false && field.isEmpty() === false)
   	 	   {
   	 	     if (field.isValid() === false)
   	 	 	 {
   	 	 	   invalids.push(field);
   	 	 	 }
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
   };//end: getInvalidFields()
   
   
   
   
   //Checks the validity of the entire form on a per-field basis 
   this.isValid = function isValid()
   {
   	 var fields = this.getFields();
   	 {
   	 	 for (var i = 0; i < fields.length; i++)
   	 	 {
   	 	 	 var field = fields[i];
   	 	 	 
   	 	 	 //If there are required fields that are in any way invalid, the Form is invalid
   	 	 	 if (field.isRequired() === true && field.isValid() === false)
   	 	 	 {
   	 	 	   return false;
   	 	 	 }
   	 	 	 
   	 	 	 //If there are non-required fields that have input, analyze the validity
   	 	 	 if (field.isRequired() === false && field.isEmpty() === false)
   	 	 	 {
   	 	 	   if (field.isValid() === false)
   	 	 	   {
   	 	 	     return false;
   	 	 	   }
   	 	 	 }
   	 	 }
   	 }
   	 
   	 //Otherwise, return true
   	 return true;
   	 
   };//end: isValid()
   
   
   
   
   // Returns the entire form as a serialized string
   this.serialize = function serialize()
   {
      //return this.form.serialize();
      var string = "";
      var fields = this.getFields();
      
      //Get the values for each field
      for (var i = 0; i < fields.length; i++)
      {
      	var value = fields[i].serialize();
      	
        if (string === "")
        {
          if (value !== "") //Only add value to the string
          {
            string = string + value;
          }
        }
        else
        {
          if (value !== "") //Only add value to the string
          {
            string = string + "&" + fields[i].serialize();	
          }
        }
      }
      
      return string;
      
   };//end: serialize()
   
   
   //Hard-submits the form
   this.submit = function submit()
   {
   
     if (this.method !== null && this.action !== null)
     {
       this.form.submit();
     }
     else
     {
       return "Forms must have a pre-defined and valid method and action prior to non-AJAX submission";
     }
   
   };//end: submit();
   
   
   
   //Resets the fields on the form
   this.reset = function reset()
   {
     this.form.reset();	
   };//end: reset()
   
}//end: Form.js v2