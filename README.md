# forms.js
Lightweight, easy-to-understand Javascript form validation library

<h2>Overview</h2>
Forms.js allows you to validate the input from your HTML forms and fields.
This is accomplished through the use of the two primary objects:
* <b>Form</b> - Any `<form>` element
* <b>Field</b> - Any `<input>`, `<textarea>` or `<select>` element, regardless of it being within an HTML `<form>`


With these objects, validation is as simple as:
<h5>Form</h5>
```javascript
var form = new Form(formElementId);
if (form.isValid() === true)
{
  //Perform your logic here
}
```
<h5>Field</h5>
```javascript
var field = new Field(inputElementId);
if (field.isValid() === true)
{
  //Perform your logic here
}
```


<h2>Working with Forms</h2>
Form objects allow you to:
* Quickly validate input elements contained within the `<form>` element:
  * `<input>`: text, email, file
  * `<select>`: select-one, select-multiple
* Control the submission, submission method(s), and action of the `<form>`:

  * Set the method (POST, GET, PUT)
  
  ```javascript
  form.setMethod("POST");
  ```
  
  * Set the action (url where you wish the data to be sent)
  
  ```javascript
  form.setAction(yourDirectory/sentData/);
  ```
  
  * Submit the form
  
  ```javascript
  form.submit()
  //Requires that the method and action are set before submission.
  ```
  * Translate all `<form>` data into a serialized string
  
  ```javascript
  form.serialize()
  ```


<h2>Working with Fields</h2>
Field objects allow you to:

* Identify whether or not they have been flagged, in conjunction with custom <i>data-</i> attribute, that the field is required.
  
  ```javascript
  field.isRequired()
  //Evaluates to true or false based on the value of 'data-required'
  ```
  
* For `<select>` elements, retrieve their currently-selected `<option>` value
  
  ```javascript
  var field = new Field(inputElementId);
  field.getSelectedValue();
  //Returns the currently selected <option> value
  ```

* For `<input = "file">` elements, set the allowed file extensions that can be uploaded

  ```javascript
  var file = new Field(inputElementId);
  var allowed_extensions = [".txt", ".pdf", ."docx"] //Only allow these file types to be submitted
  file.setFileExtensions(allowed_extensions);
  //This will be taken to account when calculating the Field object's validity
  ```
* Determine their validity (determination made by `<input>` type)

  ```javascript
  var field = new Field(inputElementId);
  if (field.isValid() === true)
  {
    //Now that we know this Field is valid, we'll do the following logic...
  }
  ```
  
  
<h2>Example</h2>
Let's submit a first name, last name, e-mail, and file upload `<form>`

HTML:

```html
<form name = "myform" id = "myform">
  <input type = "text" name = "first-name" id = "first-name" data-required = "true">
  <input type = "text" name = "last-name" id = "last-name" data-required = "true">
  <input type = "email" name = "email" id = "email"> <!--The user is not required to submit an e-mail address -->
  <input type = "file" name = "myfile" id = "myfile">
  <button name = "submit" id = "submit">
</form>

...

<script src = "path/to/your/copy/of/forms.js"></script>

```

Javascript:

```javascript
//I want to make sure my file input only accepts .pdf files:
var file = new Field("myfile");
var allowed_extensions = [".pdf"];
file.setFileExtensions(allowed_extensions);

//Set up the Form object
var form = new Form("myform");


//Let's bind this logic to follow a click event on our "submit" button
//For our example, let's use a jQuery .click() event. 
//(jquery is NOT required for forms.js to function)

var submit_button = $("#submit");
submit_button.click(function()
{
  form.setMethod("POST");
  form.setAction("my/directory/with/backend/logic/");
 
  if (form.isValid() === true)
  {
    //Now that I know my data is valid, get the data as a serialized string
    var form_data = form.serialize();
    
    //Perform your desired operations with the data
  }
  //However, if Field elements within the Form were invalid, find out what went wrong
  else
  {
    var invalids = form.getInvalidFields();
    
    //Loop through the invalid Field objects and get their error messages
    for (var i = 0; i < invalids.length; i++)
    {
      invalid = invalids[i];
      console.log(invalid.getErrorMessage());
    }
  }
  
});
```

  
