(function($){
	$.fn.extendedTextarea = function(options) {
		var defaults = {
			"keywords": [
			{
				"text": "[prenume]",
				"regex": /\[prenume\]/gi,
				"img": "tag_prenume.png"
			}]
		}

		var opts = $.extend(true, {}, defaults, options);
		var $text = $(this);
		var $textarea;
		var validBrowser = checkCompatibility();
		var $helper = $("<div/>").css({
			"display": "none",
			"postion": "absolute",
			"top": -300
		});

		if(validBrowser) {
			$text.attr("contentEditable", "true");
			$helper.appendTo("body");

			$text.keyup(function(e){
				if (e.ctrlKey)
				{
					switch(e.keyCode)
					{
						case 86: // v
							var txt = getMsgText();
							$text.text(txt);
							txt = $text.html();
							txt = txt.replace(/\n/g,"<br/>");
							$text.html(parseKeywords(txt));
							setEndOfContenteditable();
						break;
						case 67: //c
							var txt = getMsgText();
							$text.text(txt);
							txt = $text.html();
							txt = txt.replace(/\n/g,"<br/>");

							$text.html(parseKeywords(txt));
							setEndOfContenteditable();
						break;
					}
				}
				else
				{
					var txt = parseKeywords($text.html());
					if($text.html() != txt) {
						$text.html(txt);
						setEndOfContenteditable();
					}
				}
				if(defaults.keyUp)
					defaults.keyUp(e);
			});
			$text.keydown(function(e){
				// Ctrl-variations
				if (e.ctrlKey)
				{
					switch(e.keyCode)
					{
						case 66: // b
						case 73: // i
						case 85: // u
							// FF
							if (e.preventDefault)
							{
								e.preventDefault();
							}
							// MSIE
							else
							{
								e.returnValue = false;
								e.keyCode = 0;
							}
							return;
						break;
						case 67: //c
							$text.html(getMsgText().replace(/\n/g,"<br/>"));
							selectAllText();
						break;
					}
				}
				if(defaults.keyDown)
					defaults.keyDown(e);
			});
			$text.bind('dragover drop', function(event){
			    event.preventDefault();
			    return false;
			});
		} else {
			$textarea = $("<textarea/>").css({
				"width": "100%",
				"height": "100%"
			}).appendTo($text);
		}
		function selectAllText()
		{
			var sel, range;
	        if (window.getSelection && document.createRange) {
	            range = document.createRange();
	            range.selectNodeContents($text[0]);
	            sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	        } else if (document.body.createTextRange) {
	            range = document.body.createTextRange();
	            range.moveToElementText($text[0]);
	            range.select();
	        }
		}
		function parseKeywords(text) {
			for(var i in opts.keywords) {
				var key = opts.keywords[i];
				if( text.search(key.regex) != -1) {
					text = text.replace(key.regex, "<img class='editorVariable' style='height: 18px; width: 59px;' oncontrolselect='return false;' src='" + key.img + "'/>");
				}
			}

			return text;
		}


		function setEndOfContenteditable()
		{
		    var range,selection;
		    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
		    {
		    	range = document.createRange();//Create a range (a range is a like the selection but invisible)
		        range.selectNodeContents($text[0]);//Select the entire contents of the element with the range
		        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		        selection = window.getSelection();//get the selection object (allows you to change selection)
		        selection.removeAllRanges();//remove any selections already made
		        selection.addRange(range);//make the range you have just created the visible selection
		    }
		    else if(document.selection)//IE 8 and lower
		    {
		        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
		        range.moveToElementText($text[0]);//Select the entire contents of the element with the range
		        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		        range.select();//Select the range (make it the visible selection
		    }
		}
		if($.browser.mozilla) {
			document.execCommand("enableObjectResizing", false, false);
		}
		function getMsgText()
		{
			var txt="";
			txt = $text.html();
			txt = txt.replace(/\<div\>\<br.*?\>\<\/div\>/gi,"<br/>");
			txt = txt.replace(/^\<div\>/gi,"");
			txt = txt.replace(/\<div\>/gi,"\n");
			txt = txt.replace(/\<\/div\>/gi,"");
			txt = txt.replace(/\&nbsp;/gi," ");
			txt = txt.replace(/\<br.*?\>/gi,"\n");
			txt = txt.replace(/\<br.*?\>$/gi,"");

			for(var i in opts.keywords) {
				var key = opts.keywords[i];

				var regex = new RegExp("\<img.+?src\=(\'|\")" + key.img + "(\'|\").*?\>", "ig");
				txt = txt.replace(regex, key.text);
			}
			$helper.html(txt);
			txt = $helper.text();
			txt = txt.replace(/^\n$/g,"");
			$helper.empty();
			return txt;
		}

		function setValue(text) {
			if( validBrowser ) {
				text = text.replace(/\n/g,"<br/>");
				$text.html(parseKeywords(text));
			} else {
				$textarea.val(text);
			}
		}

		function insertAtCaret(text) {
			$text.focus();
		    var sel, range, html;
		    var focused=false;
		    if (window.getSelection) {
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		            range = sel.getRangeAt(0);
		            if(range.startOffset==0)
		            {
			            setEndOfContenteditable();
			            sel = window.getSelection();
			            range = sel.getRangeAt(0);
			            focused=true;
			        }
		            range.insertNode( document.createTextNode(text) );
		        }
		    } else if (document.selection && document.selection.createRange) {
		        range = document.selection.createRange();
		        range.pasteHTML(text);
		    }
		    if(focused)
		    	setEndOfContenteditable();
		    $text.html(parseKeywords($text.html()));
		}
		function insertAtCaretTextArea(string)
		{
			var obj;
			obj=$textarea[0];
			obj.focus();
			if (typeof(document.selection) != 'undefined')
			{
				var range = document.selection.createRange();

				if (range.parentElement() != obj)
				  return;

				range.text = string;
				range.select();
			}
			else if (typeof(obj.selectionStart) != 'undefined')
			{
				var start = obj.selectionStart;

				obj.value = obj.value.substr(0, start)
				          + string
				          + obj.value.substr(obj.selectionEnd, obj.value.length);

				start += string.length;
				obj.setSelectionRange(start, start);
			}
			else
				obj.value += string;

				obj.focus();
		}

		function checkCompatibility(){
			var userAgent = navigator.userAgent.toLowerCase();
			$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
			var canContentEditable = false;

			// Is this a version of IE?
			if($.browser.msie){
				// userAgent = $.browser.version;
				// userAgent = userAgent.substring(0,userAgent.indexOf('.'));
				canContentEditable = true;
			}

			// Is this a version of Chrome?
			if($.browser.chrome){
				// userAgent = userAgent.substring(userAgent.indexOf('chrome/') +7);
				// userAgent = userAgent.substring(0,userAgent.indexOf('.'));
				canContentEditable = true;
				// If it is chrome then jQuery thinks it's safari so we have to tell it it isn't
				$.browser.safari = false;
			}

			// Is this a version of Safari?
			if($.browser.safari){
				// userAgent = userAgent.substring(userAgent.indexOf('safari/') +7);
				// userAgent = userAgent.substring(0,userAgent.indexOf('.'));
				canContentEditable=false;
			}

			// Is this a version of Mozilla?
			if($.browser.mozilla){
				//Is it Firefox?
				if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
					userAgent = userAgent.substring(userAgent.indexOf('firefox/') +8);
					userAgent = userAgent.substring(0,userAgent.indexOf('.'));
					if(userAgent >= 3)
						canContentEditable = true;
					else
						canContentEditable = false;
					}
				// If not then it must be another Mozilla
				else{
					canContentEditable = false;
				}
			}

			// Is this a version of Opera?
			if($.browser.opera){
				// userAgent = userAgent.substring(userAgent.indexOf('version/') +8);
				// userAgent = userAgent.substring(0,userAgent.indexOf('.'));
				canContentEditable = true;
			}
			return canContentEditable;
		}
		function getValue() {
			if( validBrowser ) {
				return getMsgText();
			} else {
				return $textarea.val();
			}
		}

		return {
			"val": function(text) {
				if (typeof text === "undefined") {
					return getValue();
				} else {
					setValue(text);
				}
			},
			"insertAtCaret": function(text){
				if(validBrowser == true)
					insertAtCaret(text);
				else
					insertAtCaretTextArea(text);
			},
			"keyUp" : function(fnc){
				defaults.keyUp=fnc;
			},
			"keyDown" : function(fnc){
				defaults.keyDown=fnc;
			}
		}
	}
})(jQuery)