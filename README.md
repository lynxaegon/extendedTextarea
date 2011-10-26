Description
=
It creates a textarea that supports images, and it can also change keywords to images.
Example: if it detects [first_name] (or any other keyword you specify), it can change it to an image that you selected by default.

You can copy from it even if you have images inside (they will be converted to their text value)
If you paste a text, it will automatically convert keywords to images (if you have any)

Requirements:
-
jQuery 1.4.4 or greater, available at jQuery.com

Usage:
-
### This is how you initialize the editor:
	<script src="jquery.min.js" type="text/javascript"></script>
	<script>
		var editor;
		$(document).ready(function(){
			 editor = $("#editor").extendedTextarea();
		})
	</script>
	...	
	<div id="editor"></div>

### Options:

	keywords ( so that you can automaticaly change a keyword to an image )
		<script>
			var editor;
        	        $(document).ready(function(){
	                         editor = $("#editor").extendedTextarea({
					keywords: [{
						"text":"[first_name]",
						"regex": /\[first_name\]/gi,
						"img": "tag_first_name.png"
					}]
				});
                	})
		</script> 
	
	keyUp and keyDown events:
		<script>
                        var editor;
                        $(document).ready(function(){
                                 editor = $("#editor").extendedTextarea({
                                        keywords: [{
                                                "text":"[first_name]",
                                                "regex": /\[first_name\]/gi,
                                                "img": "tag_first_name.png"
                                        },
					{
                                                "text":"[last_name]",
                                                "regex": /\[last_name\]/gi,
                                                "img": "tag_last_name.png"
                                        }],
					keyUp: function(){
						console.log("keyUp event");
					},
					keyDown: function(){
						console.log("keyDown event");
					}
                                });
                        })
                </script>
	### Functions
	Get the text value of the editor:
		alert(editor.val());

	Insert text at caret position:
		editor.insertAtCaret("test");

	Change the keyUp or keyDown event:
		editor.keyUp(function(){
			alert("keyUp");
		});
		editor.keyDown(function(){
                        alert("keyDown");
                });

### Examples:

To view the example, open index.html

### Compatibility:

Tested on Internet Explorer 6-9, Chrome 10+, Opera 10+, Firefox 3.6+.

### Bugs:

Found a bug? Please [let me know](https://github.com/lynxaegon/extendedTextarea/issues).
		
### Author

Andrei Vaduva
