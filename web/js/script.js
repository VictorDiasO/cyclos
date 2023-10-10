/*
 * JavaScriptUtil version 2.2.4
 *
 * The JavaScriptUtil is a set of misc functions used by the other scripts
 *
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Home Page: http://javascriptools.sourceforge.net
 *
 * JavaScripTools is distributed under the GNU Lesser General Public License (LGPL).
 * For more information, see http://www.gnu.org/licenses/lgpl-2.1.txt
 */

///////////////////////////////////////////////////////////////////////////////
// Constants
var JST_CHARS_NUMBERS = "0123456789";
var JST_CHARS_LOWER = "";
var JST_CHARS_UPPER = "";
//Scan the upper and lower characters
for (var i = 50; i < 500; i++) {
    var c = String.fromCharCode(i);
    var lower = c.toLowerCase();
    var upper = c.toUpperCase();
    if (lower != upper) {
        JST_CHARS_LOWER += lower;
        JST_CHARS_UPPER += upper;
    }
}
var JST_CHARS_LETTERS = JST_CHARS_LOWER + JST_CHARS_UPPER;
var JST_CHARS_ALPHA = JST_CHARS_LETTERS + JST_CHARS_NUMBERS;
var JST_CHARS_BASIC_LOWER = "abcdefghijklmnopqrstuvwxyz";
var JST_CHARS_BASIC_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var JST_CHARS_BASIC_LETTERS = JST_CHARS_BASIC_LOWER + JST_CHARS_BASIC_UPPER;
var JST_CHARS_BASIC_ALPHA = JST_CHARS_BASIC_LETTERS + JST_CHARS_NUMBERS;
var JST_CHARS_WHITESPACE = " \t\n\r";

//Number of milliseconds in a second
var MILLIS_IN_SECOND = 1000;

//Number of milliseconds in a minute
var MILLIS_IN_MINUTE = 60 * MILLIS_IN_SECOND;

//Number of milliseconds in a hour
var MILLIS_IN_HOUR = 60 * MILLIS_IN_MINUTE;

//Number of milliseconds in a day
var MILLIS_IN_DAY = 24 * MILLIS_IN_HOUR;

//Date field: milliseconds
var JST_FIELD_MILLISECOND = 0;

//Date field: seconds
var JST_FIELD_SECOND = 1;

//Date field: minutes
var JST_FIELD_MINUTE = 2;

//Date field: hours
var JST_FIELD_HOUR = 3;

//Date field: days
var JST_FIELD_DAY = 4;

//Date field: months
var JST_FIELD_MONTH = 5;

//Date field: years
var JST_FIELD_YEAR = 6;

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the reference to the named object
 * Parameters:
 *     name: The object's name. When a reference, return it.
 *     source: The object where to search the name
 * Returns: The reference, or null if not found
 */
function getObject(objectName, source) {
    if (isEmpty(objectName)) {
        return null;
    }
    if (!isInstance(objectName, String)) {
        return objectName;
    }
    if(isEmpty(source)) {
        source = self;
    }
    //Check if the source is a reference or a name
    if(isInstance(source, String)) {
        //It's a name. Try to find it on a frame
        sourceName = source;
        source = self.frames[sourceName];
        if (source == null) source = parent.frames[sourceName];
        if (source == null) source = top.frames[sourceName];
        if (source == null) source = getObject(sourceName);
        if (source == null) return null;
    }
    //Get the document
    var document = (source.document) ? source.document : source;
    //Check the browser's type
    if (document.getElementById) {
        //W3C
        var collection = document.getElementsByName(objectName);
        if (collection.length == 1) return collection[0];
        if (collection.length > 1) {
            //When the collection itself is an array, return it
            if (typeof(collection) == "array") {
                return collection;
            }
            //Copy the collection nodes to an array
            var ret = new Array(collection.length);
            for (var i = 0; i < collection.length; i++) {
                ret[i] = collection[i];
            }
            return ret;
        }
        return document.getElementById(objectName);
    } else {
        //Old Internet Explorer
        if (document[objectName]) return document[objectName];
        if (document.all[objectName]) return document.all[objectName];
        if (source[objectName]) return source[objectName];
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if the object is an instance of the specified class
 * Parameters:
 *     object: The object
 *     clazz: The class
 * Returns: Is the object an instance of the class?
 */
function isInstance(object, clazz) {
    if ((object == null) || (clazz == null)) {
        return false;
    }
    if (object instanceof clazz) {
        return true;
    }
    if ((clazz == String) && (typeof(object) == "string")) {
        return true;
    }
    if ((clazz == Number) && (typeof(object) == "number")) {
        return true;
    }
    if ((clazz == Array) && (typeof(object) == "array")) {
        return true;
    }
    if ((clazz == Function) && (typeof(object) == "function")) {
        return true;
    }
    var base = object.base;
    while (base != null) {
        if (base == clazz) {
            return true;
        }
        base = base.base;
    }
    return false;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns true if the object value represents a true value
 * Parameters:
 *     object: The input object. It will be treated as a string.
 *        if the string starts with any of the characters on trueChars, it 
 *        will be considered true. False otherwise.
 *     trueChars: The initial characters for the object be a true value, 
 *        ingoring case. Default: 1, Y, N or S.
 * Returns: The boolean value
 */
function booleanValue(object, trueChars) {
    if (object == true || object == false) {
        return object;
    } else {
        object = String(object);
        if (object.length == 0) {
            return false;
        } else {
            var first = object.charAt(0).toUpperCase();
            trueChars = isEmpty(trueChars) ? "T1YS" : trueChars.toUpperCase();
            return trueChars.indexOf(first) != -1
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if the object is undefined
 * Parameters:
 *     object: The object to test
 * Returns: Is the object undefined?
 */
function isUndefined(object) {
    return typeof(object) == "undefined";
}


///////////////////////////////////////////////////////////////////////////////
/*
 * Makes an object invoke a function as if it were a method of his
 * Parameters:
 *     object: The target object
 *     method: The function reference
 *     args: The arguments. If is not an array, uses a single 
 *                argument. If null, uses no arguments.
 * Returns: The invocation return value
 */
function invokeAsMethod(object, method, args) {
    return method.apply(object, args);
}

///////////////////////////////////////////////////////////////////////////////
/**
 * Ensures the given argument is an array.
 * When null or undefined, returns an empty array.
 * When an array return it.
 * Otherwise, return an array with the argument in
 * Parameters:
 *     object: The object
 * Returns: The array
 */
function ensureArray(object) {
    if (typeof(object) == 'undefined' || object == null) {
        return [];
    }
    if (object instanceof Array) {
        return object;
    }
    return [object];
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the index of the object in array, -1 if it's not there...
 * Parameters:
 *     object: The object to search
 *     array: The array where to search
 *     startingAt: The index where to start the search (optional)
 * Returns: The index
 */
function indexOf(object, array, startingAt) {
    if ((object == null) || !(array instanceof Array)) {
        return -1;
    }
    if (startingAt == null) {
        startingAt = 0;
    }
    for (var i = startingAt; i < array.length; i++) {
        if (array[i] == object) {
            return i;
        }
    }
    return -1;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if the object is in the array
 * Parameters:
 *     object: The object to search
 *     array: The array where to search
 * Returns: Is the object in the array?
 */
function inArray(object, array) {
    return indexOf(object, array) >= 0;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all occurrences of the given object or objects from an array.
 * Parameters:
 *     array: The array
 *     object1 .. objectN: The objects to remove
 * Returns: The new array
 */
function removeFromArray(array) {
    if (!isInstance(array, Array)) {
        return null;
    }
    var ret = new Array();
    var toRemove = removeFromArray.arguments.slice(1);
    for (var i = 0; i < array.length; i++) {
        var current = array[i];
        if (!inArray(current, toRemove)) {
            ret[ret.length] = current;
        }
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the concatenation of two arrays
 * Parameters:
 *     array1 ... arrayN: The arrays to concatenate
 * Returns: The concatenation of the two arrays
 */
function arrayConcat() {
    var ret = [];
    for (var i = 0; i < arrayConcat.arguments.length; i++) {
        var current = arrayConcat.arguments[i];
        if (!isEmpty(current)) {
            if (!isInstance(current, Array)) {
                current = [current]
            }
            for (j = 0; j < current.length; j++) {
                ret[ret.length] = current[j];
            }
        }
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the concatenation of two arrays
 * Parameters:
 *     array1: The array first array
 *     array1: The array second array
 * Returns: The concatenation of the two arrays
 */
function arrayEquals(array1, array2) {
    if (!isInstance(array1, Array) || !isInstance(array2, Array)) {
        return false;
    }
    if (array1.length != array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks or unchecks all the checkboxes
 * Parameters:
 *     object: The reference for the checkbox or checkbox array.
 *     flag: If true, checks, otherwise, unchecks the checkboxes
 */
function checkAll(object, flag) {
    //Check if is the object name    
    if (typeof(object) == "string") {
        object = getObject(object);
    }
    if (object != null) {
        if (!isInstance(object, Array)) {
            object = [object];
        }
        for (i = 0; i < object.length; i++) {
            object[i].checked = flag;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds an event listener to the object.
 * Parameters:
 *     object: The object that generates events
 *     eventName: A name like keypress, blur, etc
 *     handler: A function that will handle the event
 */
function observeEvent(object, eventName, handler) {
    object = getObject(object);
    if (object != null) {
        if (object.addEventListener) {
            object.addEventListener(eventName, function(e) {return invokeAsMethod(object, handler, [e]);}, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + eventName, function() {return invokeAsMethod(object, handler, [window.event]);});
        } else {
            object["on" + eventName] = handler;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Return the keycode of the given event
 * Parameters:
 *     event: The interface event
 */
function typedCode(event) {
    var code = 0;
    if (event == null && window.event) {
        event = window.event;
    }
    if (event != null) {
        if (event.keyCode) {
            code = event.keyCode;
        } else if (event.which) {
            code = event.which;
        }
    }
    return code;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Stops the given event of propagating
 * Parameters:
 *     event: The interface event
 */
function stopPropagation(event) {
    if (event == null && window.event) {
        event = window.event;
    }
    if (event != null) {
        if (event.stopPropagation != null) {
            event.stopPropagation();
        } else if (event.cancelBubble !== null) {
            event.cancelBubble = true;
        }
    }
    return false;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Prevents the default action for the given event
 * Parameters:
 *     event: The interface event
 */
function preventDefault(event) {
    if (event == null && window.event) {
        event = window.event;
    }
    if (event != null) {
        if (event.preventDefault != null) {
            event.preventDefault();
        } else if (event.returnValue !== null) {
            event.returnValue = false;
        }
    }
    return false;
}

/*
 * Prepares the input object to use caret or selection manipulation
 * functions on Internet Explorer. Should be called only once on each input
 * Parameters:
 *     object: The reference for the input
 */
function prepareForCaret(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    if (object.createTextRange) {
        var handler = function() {
            object.caret = document.selection.createRange().duplicate();
        }
        observeEvent(object, "onclick", handler);
        observeEvent(object, "ondblclick", handler);
        observeEvent(object, "onselect", handler);
        observeEvent(object, "onkeyup", handler);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Return if an object supports caret operations
 * Parameters:
 *     object: The reference for the input
 * Returns: Are caret operations supported?
 */
function isCaretSupported(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return false;
    }
    //Opera 8- claims to support setSelectionRange, but it does not works for caret operations, only selection
    if (navigator.userAgent.toLowerCase().indexOf("opera") >= 0) {
        return false;
    }
    return object.setSelectionRange != null || object.createTextRange != null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Return if an object supports input selection operations
 * Parameters:
 *     object: The reference for the input
 * Returns: Are input selection operations supported?
 */
function isInputSelectionSupported(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return false;
    }
    return object.setSelectionRange != null || object.createTextRange != null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns an input's selected text. 
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 * Returns: The selected text
 */
function getInputSelection(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    try {
        if (object.createTextRange && object.caret) {
            return object.caret.text;
        } else if (object.setSelectionRange) {
            var selStart = object.selectionStart;
            var selEnd = object.selectionEnd;
            return object.value.substring(selStart, selEnd);
        }
    } catch (e) {
        // Ignore
    }
    return "";
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the selection range on an input field.
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 *     start: The selection start
 *     end: The selection end
 * Returns: An array with 2 integers: start and end
 */
function getInputSelectionRange(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    try {
        if (object.selectionEnd) {
            return [object.selectionStart, object.selectionEnd];
        } else if (object.createTextRange && object.caret) {
            var end = getCaret(object);
            return [end - object.caret.text.length, end];
        }
    } catch (e) {
        // Ignore
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the selection range on an input field
 * Parameters:
 *     object: The reference for the input
 *     start: The selection start
 *     end: The selection end
 */
function setInputSelectionRange(object, start, end) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    try {
        if (start < 0) {
            start = 0;
        }
        if (end > object.value.length) {
            end = object.value.length;
        }
        if (object.setSelectionRange) {
            object.focus();
            object.setSelectionRange(start, end);
        } else if (object.createTextRange) {
            object.focus();
            var range;
            if (object.caret) {
                range = object.caret;
                range.moveStart("textedit", -1);
                range.moveEnd("textedit", -1);
            } else {
                range = object.createTextRange();
            }
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    } catch (e) {
        // Ignore
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the caret position. When a range is selected, returns the range end.
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 * Returns: The position
 */
function getCaret(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return null;
    }
    try {
        if (object.createTextRange && object.caret) {
            var range = object.caret.duplicate();
            range.moveStart('textedit', -1);
            return range.text.length;
        } else if (object.selectionStart || object.selectionStart == 0) {
            return object.selectionStart;
        }
    } catch (e) {
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the caret to the specified position
 * Parameters:
 *     object: The reference for the input
 *     pos: The position
 */
function setCaret(object, pos) {
    setInputSelectionRange(object, pos, pos);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the caret to the text end
 * Parameters:
 *     object: The reference for the input
 */
function setCaretToEnd(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    try {
        if (object.createTextRange) {
          var range = object.createTextRange();
          range.collapse(false);
          range.select();
        } else if (object.setSelectionRange) {
          var length = object.value.length;
          object.setSelectionRange(length, length);
          object.focus();
        }
    } catch (e) {
        // Ignore
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the caret to the text start
 * Parameters:
 *     object: The reference for the input
 */
function setCaretToStart(object) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    try {
        if (object.createTextRange) {
          var range = object.createTextRange();
          range.collapse(true);
          range.select();
        } else if (object.setSelectionRange) {
          object.focus();
          object.setSelectionRange(0, 0);
        }
    } catch (e) {
        // Ignore
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Selects a given string on the input text
 * Parameters:
 *     object: The reference for the input
 *     string: The string to select
 */
function selectString(object, string) {
    if (isInstance(object, String)) {
        object = getObject(object);
    }
    if (object == null || !object.type) {
        return;
    }
    var match = new RegExp(string, "i").exec(object.value);
    if (match) {
        setInputSelectionRange(object, match.index, match.index + match[0].length);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Replaces the selected text for a new one. On IE, only works if the object has focus.
 * For IE, requires prepareForCaret() to be first called on the object
 * Parameters:
 *     object: The reference for the input
 *     string: The new text
 */
function replaceSelection(object, string) {
    object = getObject(object);
    if (object == null || !object.type) {
        return;
    }
    if (object.setSelectionRange) {
        var selectionStart = object.selectionStart;
        var selectionEnd = object.selectionEnd;
        object.value = object.value.substring(0, selectionStart) + string + object.value.substring(selectionEnd);
        if (selectionStart != selectionEnd) {
            setInputSelectionRange(object, selectionStart, selectionStart + string.length);
        } else {
            setCaret(object, selectionStart + string.length);
        }
    } else if (object.createTextRange && object.caret) {
        object.caret.text = string;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Clears the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 * Returns: The array of removed options
 */
function clearOptions(select) {
    select = getObject(select);
    var ret = new Array();
    if (select != null) {
        for (var i = 0; i < select.options.length; i++) {
            var option = select.options[i];
            ret[ret.length] = new Option(option.text, option.value);
        }
        select.options.length = 0;
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds an options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     option: The Option instance
 *     sort: Will sort the options? Default: false
 *     textProperty: The object property, when not an Option, to read the text. Defaults to "text"
 *     valueProperty: The object property, when not an Option, to read the value. Defaults to "value"
 *     selectedProperty: The object property, when not an Option, to read if the option is selected. Defaults to "selected"
 */
function addOption(select, option, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    if (select == null || option == null) {
        return;
    }
    
    textProperty = textProperty || "text";
    valueProperty = valueProperty || "value";
    selectedProperty = selectedProperty || "selected"
    if (isUndefined(option[valueProperty])) {
        valueProperty = textProperty;
    }
    var selected = false;
    if (!isUndefined(option[selectedProperty])) {
        selected = option[selectedProperty];
    }
    option = new Option(option[textProperty], option[valueProperty], selected, selected);

    select.options[select.options.length] = option;

    if (booleanValue(sort)) {
        sortOptions(select);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     options: The array of Option instances
 *     sort: Will sort the options? Default: false
 *     textProperty: The object property, when not an Option, to read the text. Defaults to "text"
 *     valueProperty: The object property, when not an Option, to read the value. Defaults to "value"
 *     selectedProperty: The object property, when not an Option, to read if the option is selected. Defaults to "selected"
 */
function addOptions(select, options, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    if (select == null) {
        return;
    }
    for (var i = 0; i < options.length; i++) {
        addOption(select, options[i], false, textProperty, valueProperty, selectedProperty);
    }
    if (!select.multiple && select.selectedIndex < 0 && select.options.length > 0) {
        select.selectedIndex = 0;
    }
    if (booleanValue(sort)) {
        sortOptions(select);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Compares two options
 * Parameters:
 *     opt1: The first option
 *     opt2: The second option
 */
function compareOptions(opt1, opt2) {
    if (opt1 == null && opt2 == null) {
        return 0;
    }
    if (opt1 == null) {
        return -1;
    }
    if (opt2 == null) {
        return 1;
    }
    if (opt1.text == opt2.text) {
        return 0;
    } else if (opt1.text > opt2.text) {
        return 1;
    } else {
        return -1;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     options: The array of Option instances
 *     addEmpty: A flag indicating an empty option should be added. Defaults to false
 *     textProperty: The object property, when not an Option, to read the text. Defaults to "text"
 *     valueProperty: The object property, when not an Option, to read the value. Defaults to "value"
 *     selectedProperty: The object property, when not an Option, to read if the option is selected. Defaults to "selected"
 * Returns: The original Options array
 */
function setOptions(select, options, addEmpty, sort, textProperty, valueProperty, selectedProperty) {
    select = getObject(select);
    var ret = clearOptions(select);
    var addEmptyIsString = isInstance(addEmpty, String);
    if (addEmptyIsString || booleanValue(addEmpty)) {
        select.options[0] = new Option(addEmptyIsString ? addEmpty : "");
    }
    addOptions(select, options, sort, textProperty, valueProperty, selectedProperty);
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
/*
 * Sorts the array of options to a given select field
 * Parameters:
 *     select: The reference for the select, or the select name
 *     sortFunction The sortFunction to use. Defaults to the default sort function
 */
function sortOptions(select, sortFunction) {
    select = getObject(select);
    if (select == null) {
        return;
    }
    var options = clearOptions(select);
    if (isInstance(sortFunction, Function)) {
        options.sort(sortFunction);
    } else {
        options.sort(compareOptions);
    }
    setOptions(select, options);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Transfers the options from a select to another
 * Parameters:
 *     source: The reference for the source select, or the select name
 *     dest: The reference for the destination select, or the select name
 *     all: Will transfer all options (true) or the selected ones (false)? Default: false
 *     sort: Will sort the options? Default: false
 */
function transferOptions(source, dest, all, sort) {
    source = getObject(source);
    dest = getObject(dest);
    if (source == null || dest == null) {
        return;
    }
    if (booleanValue(all)) {
        addOptions(dest, clearOptions(source), sort);
    } else {
        var sourceOptions = new Array();
        var destOptions = new Array();
        for (var i = 0; i < source.options.length; i++) {
            var option = source.options[i];
            var options = (option.selected) ? destOptions : sourceOptions;
            options[options.length] = new Option(option.text, option.value);
        }
        setOptions(source, sourceOptions, false, sort);
        addOptions(dest, destOptions, sort);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Gets the value of an element
 * Parameters:
 *     object: The reference for the element
 * Returns: The value or an Array containing the values, if there's more than one
 */
function getValue(object) {
    object = getObject(object);
    if (object == null) {
        return null;
    }

    //Check if object is an array
    if (object.length && !object.type) {
        var ret = new Array();
        for (var i = 0; i < object.length; i++) {
            var temp = getValue(object[i]);
            if (temp != null) {
                ret[ret.length] = temp;
            }
        }
        return ret.length == 0 ? null : ret.length == 1 ? ret[0] : ret;
    }

    //Check the object type
    if (object.type) {
        //Select element
        if (object.type.indexOf("select") >= 0) {
            var ret = new Array();
            if (!object.multiple && object.selectedIndex < 0 && object.options.length > 0) {
                //On konqueror, if no options is marked as selected, not even the first one will return as selected
                ret[ret.length] = object.options[0].value;
            } else {
                for (i = 0; i < object.options.length; i++) {
                    var option = object.options[i];
                    if (option.selected) {
                        ret[ret.length] = option.value;
                        if (!object.multiple) {
                            break;
                        }
                    }
                }
            }
            return ret.length == 0 ? null : ret.length == 1 ? ret[0] : ret;
        }
    
        //Radios and checkboxes
        if (object.type == "radio" || object.type == "checkbox") {
            return booleanValue(object.checked) ? object.value : null;
        } else {
            //Other input elements
            return object.value;
        }
    } else if (typeof(object.innerHTML) != "undefined"){
        //Not an input
        return object.innerHTML;
    } else {
        return null;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the value of an element
 * Parameters:
 *     object: The reference for the element
 *     value: The value to be set
 */
function setValue(object, value) {

    //Validates the object
    if (object == null) {
        return;
    }
    
    //Check if is the object name    
    if (typeof(object) == "string") {
        object = getObject(object);
    }

    //Ensures the array is made of strings
    var values = ensureArray(value);
    for (var i = 0; i < values.length; i++) {
        values[i] = values[i] == null ? "" : "" + values[i];
    }
    
    //Check if object is an array
    if (object.length && !object.type) {
        while (values.length < object.length) {
            values[values.length] = "";
        }
        for (var i = 0; i < object.length; i++) {
            var obj = object[i];
            setValue(obj, inArray(obj.type, ["checkbox", "radio"]) ? values : values[i]);
        }
        return;
    }
    //Check the object type
    if (object.type) {
        //Check the input type
        if (object.type.indexOf("select") >= 0) {
            //Select element
            for (var i = 0; i < object.options.length; i++) {
                var option = object.options[i];
                option.selected = inArray(option.value, values);
            }
            return;
        } else if (object.type == "radio" || object.type == "checkbox") {
            //Radios and checkboxes 
            object.checked = inArray(object.value, values);
            return;
        } else {
            //Other input elements: get the first value
            object.value = values.length == 0 ? "" : values[0];
            return;
        }
    } else if (typeof(object.innerHTML) != "undefined"){
        //The object is not an input
        object.innerHTML = values.length == 0 ? "" : values[0];
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns an argument depending on the value of the first argument.
 * Example: decode(param, 1, 'A', 2, 'B', 'C'). When param == 1, returns 'A'.
 * When param == 2, return 'B'. Otherwise, return 'C'
 * Parameters:
 *     object: The object
 *     (additional parametes): The tested values and the return value
 * Returns: The correct argument
 */
function decode(object) {
    var args = decode.arguments;
    for (var i = 1; i < args.length; i += 2) {
        if (i < args.length - 1) {
            if (args[i] == object) {
                return args[i + 1];
            }
        } else {
            return args[i];
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns an argument depending on the boolean value of the prior argument.
 * Example: select(a > b, 'A', b > a, 'B', 'Equals'). When a > b, returns 'A'.
 * When b > a, return 'B'. Otherwise, return 'Equals'
 * Parameters:
 *     (additional parametes): The tested values and the return value
 * Returns: The correct argument
 */
function select() {
    var args = select.arguments;
    for (var i = 0; i < args.length; i += 2) {
        if (i < args.length - 1) {
            if (booleanValue(args[i])) {
                return args[i + 1];
            }
        } else {
            return args[i];
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns if an object is an empty instance ("", null, undefined or NaN)
 * Parameters:
 *     object: The object
 * Returns: Is the object an empty instance?
 */
function isEmpty(object) {
    return object == null || String(object) == "" || typeof(object) == "undefined" || (typeof(object) == "number" && isNaN(object));
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the object if not empty (according to the isEmpty function), or the
 *     second parameter otherwise
 * Parameters:
 *     object: The object
 *     emptyValue: The object returned if the first is empty
 * Returns: The first object if is not empty, otherwise the second one
 */
function ifEmpty(object, emptyValue) {
    return isEmpty(object) ? emptyValue : object;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the object if not null, or the second parameter otherwise
 * Parameters:
 *     object: The object
 *     nullValue: The object returned if the first is null
 * Returns: The first object if is not empty, otherwise the second one
 */
function ifNull(object, nullValue) {
    return object == null ? nullValue : object;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Replaces all the occurences in the string
 * Parameters:
 *     string: The string
 *     find: Text to be replaced
 *     replace: Text to replace the previous
 * Returns: The new string
 */
function replaceAll(string, find, replace) {
    return String(string).split(find).join(replace);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Repeats the String a number of times
 * Parameters:
 *     string: The string
 *     times: How many times?
 * Returns: The new string
 */
function repeat(string, times) {
    var ret = "";
    for (var i = 0; i < Number(times); i++) {
        ret += string;
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all specified characters on the left side
 * Parameters:
 *     string: The string
 *     chars: The string containing all characters to be removed. Default: JST_CHARS_WHITESPACE
 * Returns: The new string
 */
function ltrim(string, chars) {
    string = string ? String(string) : "";
    chars = chars || JST_CHARS_WHITESPACE;
    var pos = 0;
    while (chars.indexOf(string.charAt(pos)) >= 0 && (pos <= string.length)) {
        pos++;
    }
    return string.substr(pos);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all specified characters on the right side
 * Parameters:
 *     string: The string
 *     chars: The string containing all characters to be removed. Default: JST_CHARS_WHITESPACE
 * Returns: The new string
 */
function rtrim(string, chars) {
    string = string ? String(string) : "";
    chars = chars || JST_CHARS_WHITESPACE;
    var pos = string.length - 1;
    while (chars.indexOf(string.charAt(pos)) >= 0 && (pos >= 0)) {
        pos--;
    }
    return string.substring(0, pos + 1);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes all whitespaces on both left and right sides
 * Parameters:
 *     string: The string
 *     chars: The string containing all characters to be removed. Default: JST_CHARS_WHITESPACE
 * Returns: The new string
 */
function trim(string, chars) {
    chars = chars || JST_CHARS_WHITESPACE;
    return ltrim(rtrim(string, chars), chars);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Make the string have the specified length, completing with the specified 
 * character on the left. If the String is greater than the specified size, 
 * it is truncated to it, using the leftmost characters
 * Parameters:
 *     string: The string
 *     size: The string size
 *     chr: The character that will fill the string
 * Returns: The new string
 */
function lpad(string, size, chr) {
    string = String(string);
    if (size < 0) {
        return "";
    }
    if (isEmpty(chr)) {
        chr = " ";
    } else {
        chr = String(chr).charAt(0);
    }
    while (string.length < size) {
        string = chr + string;
    }
    return left(string, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Make the string have the specified length, completing with the specified 
 * character on the right. If the String is greater than the specified size, 
 * it is truncated to it, using the leftmost characters
 * Parameters:
 *     string: The string
 *     size: The string size
 *     chr: The character that will fill the string
 * Returns: The new string
 */
function rpad(string, size, chr) {
    string = String(string);
    if (size <= 0) {
        return "";
    }
    chr = String(chr);
    if (isEmpty(chr)) {
        chr = " ";
    } else {
        chr = chr.charAt(0);
    }
    while (string.length < size) {
        string += chr;
    }
    return left(string, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified number of characters 
 * from a string after an initial position
 * Parameters:
 *     string: The string
 *     pos: The initial position
 *     size: The crop size (optional, default=1)
 * Returns: The new string
 */
function crop(string, pos, size) {
    string = String(string);
    if (size == null) {
        size = 1;
    }
    if (size <= 0) {
        return "";
    }
    return left(string, pos) + mid(string, pos + size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified number of characters from the left of a string 
 * Parameters:
 *     string: The string
 *     size: The crop size (optional, default=1)
 * Returns: The new string
 */
function lcrop(string, size) {
    if (size == null) {
        size = 1;
    }
    return crop(string, 0, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified number of characters from the right of a string 
 * Parameters:
 *     string: The string
 *     size: The crop size (optional, default=1)
 * Returns: The new string
 */
function rcrop(string, size) {
    string = String(string);
    if (size == null) {
        size = 1;
    }
    return crop(string, string.length - size, size);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Capitalizes the text, uppercasing the first letter of every word
 * Parameters:
 *     text: The text
 *     separators: An String containing all separator characters. Default: JST_CHARS_WHITESPACE + '.?!'
 * Returns: The new text
 */
function capitalize(text, separators) {
    text = String(text);
    separators = separators || JST_CHARS_WHITESPACE + '.?!';
    var out = "";
    var last = '';    
    for (var i = 0; i < text.length; i++) {
        var current = text.charAt(i);
        if (separators.indexOf(last) >= 0) {
            out += current.toUpperCase();
        } else {
            out += current.toLowerCase();
        }
        last = current;
    }
    return out;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only the specified characters
 * Parameters:
 *     string: The string
 *     possible: The string containing the possible characters
 * Returns: Do the String contains only the specified characters?
 */
function onlySpecified(string, possible) {
    string = String(string);
    possible = String(possible);
    for (var i = 0; i < string.length; i++) {
        if (possible.indexOf(string.charAt(i)) == -1) {
            return false;
        }
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only numbers
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only numbers?
 */
function onlyNumbers(string) {
    return onlySpecified(string, JST_CHARS_NUMBERS);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only letters
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only lettersts?
 */
function onlyLetters(string) {
    return onlySpecified(string, JST_CHARS_LETTERS);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only alphanumeric characters (letters or digits)
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only alphanumeric characters?
 */
function onlyAlpha(string) {
    return onlySpecified(string, JST_CHARS_ALPHA);
}
///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only letters without accentiation
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only lettersts?
 */
function onlyBasicLetters(string) {
    return onlySpecified(string, JST_CHARS_BASIC_LETTERS);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Checks if the string contains only alphanumeric characters  without accentiation (letters or digits)
 * Parameters:
 *     string: The string
 * Returns: Do the String contains only alphanumeric characters?
 */
function onlyBasicAlpha(string) {
    return onlySpecified(string, JST_CHARS_BASIC_ALPHA);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the left most n characters
 * Parameters:
 *     string: The string
 *     n: The number of characters
 * Returns: The substring
 */
function left(string, n) {
    string = String(string);
    return string.substring(0, n);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the right most n characters
 * Parameters:
 *     string: The string
 *     n: The number of characters
 * Returns: The substring
 */
function right(string, n) {
    string = String(string);
    return string.substr(string.length - n);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns n characters after the initial position
 * Parameters:
 *     string: The string
 *     pos: The initial position
 *     n: The number of characters (optional)
 * Returns: The substring
 */
function mid(string, pos, n) {
    string = String(string);
    if (n == null) {
        n = string.length;
    }
    return string.substring(pos, pos + n);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Inserts a value inside a string
 * Parameters:
 *     string: The string
 *     pos: The insert position
 *     value: The value to be inserted
 * Returns: The updated
 */
function insertString(string, pos, value) {
    string = String(string);
    var prefix = left(string, pos);
    var suffix = mid(string, pos)
    return prefix + value + suffix;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the function name for a given function reference
 * Parameters:
 *     funct: The function
 *     unnamed: The String to return on unnamed functions. Default: [unnamed]
 * Returns: The function name. If the reference is not a function, returns null
 */
function functionName(funct, unnamed) {
    if (typeof(funct) == "function") {
        var src = funct.toString();
        var start = src.indexOf("function");
        var end = src.indexOf("(");
        if ((start >= 0) && (end >= 0)) {
            start += 8; //The "function" length
            var name = trim(src.substring(start, end));
            return isEmpty(name) ? (unnamed || "[unnamed]") : name;
        }
    } if (typeof(funct) == "object") {
        return functionName(funct.constructor);
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns all properties in the object, sorted or not, with the separator between them.
 * Parameters:
 *     object: The object
 *     separator: The separator between properties
 *     sort: Will the properties be sorted?
 *     includeObject: Will the object.toString() be included?
 *     objectSeparator: The text separating the object.toString() from the properties. Default to a line
 * Returns: The string
 */
function debug(object, separator, sort, includeObject, objectSeparator) {
    if (object == null) {
        return "null";
    }
    sort = booleanValue(sort == null ? true : sort);
    includeObject = booleanValue(includeObject == null ? true : sort);
    separator = separator || "\n";
    objectSeparator = objectSeparator || "--------------------";

    //Get the properties
    var properties = new Array();
    for (var property in object) {
        var part = property + " = ";
        try {
            part += object[property];
        } catch (e) {
            part += "<Error retrieving value>";
        }
        properties[properties.length] = part;
    }
    //Sort if necessary
    if (sort) {
        properties.sort();
    }
    //Build the output
    var out = "";
    if (includeObject) {
        try {
            out = object.toString() + separator;
        } catch (e) {
            out = "<Error calling the toString() method>"
        }
        if (!isEmpty(objectSeparator)) {
            out += objectSeparator + separator;
        }
    }
    out += properties.join(separator);
    return out;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Escapes the string's special characters to their escaped form
 * ('\\' to '\\\\', '\n' to '\\n', ...) and the extraChars are escaped via unicode
 * (\\uXXXX, where XXXX is the hexadecimal charcode)
 * Parameters:
 *     string: The string to be escaped
 *     extraChars: The String containing extra characters to be escaped
 *     onlyExtra: If true, do not process the standard characters ('\\', '\n', ...)
 * Returns: The encoded String
 */
function escapeCharacters(string, extraChars, onlyExtra) {
    var ret = String(string);
    extraChars = String(extraChars || "");
    onlyExtra = booleanValue(onlyExtra);
    //Checks if must process only the extra characters
    if (!onlyExtra) {
        ret = replaceAll(ret, "\n", "\\n");
        ret = replaceAll(ret, "\r", "\\r");
        ret = replaceAll(ret, "\t", "\\t");
        ret = replaceAll(ret, "\"", "\\\"");
        ret = replaceAll(ret, "\'", "\\\'");
        ret = replaceAll(ret, "\\", "\\\\");
    }
    //Process the extra characters
    for (var i = 0; i < extraChars.length; i++) {
        var chr = extraChars.charAt(i);
        ret = replaceAll(ret, chr, "\\\\u" + lpad(new Number(chr.charCodeAt(0)).toString(16), 4, '0'));
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Unescapes the string, changing the special characters to their unescaped form
 * ('\\\\' to '\\', '\\n' to '\n', '\\uXXXX' to the hexadecimal ASC(XXXX), ...)
 * Parameters:
 *     string: The string to be unescaped
 *     onlyExtra: If true, do not process the standard characters ('\\', '\n', ...)
 * Returns: The unescaped String
 */
function unescapeCharacters(string, onlyExtra) {
    var ret = String(string);
    var pos = -1;
    var u = "\\\\u";
    onlyExtra = booleanValue(onlyExtra);
    //Process the extra characters
    do {
        pos = ret.indexOf(u);
        if (pos >= 0) {
            var charCode = parseInt(ret.substring(pos + u.length, pos + u.length + 4), 16);
            ret = replaceAll(ret, u + charCode, String.fromCharCode(charCode));
        }
    } while (pos >= 0);
    
    //Checks if must process only the extra characters
    if (!onlyExtra) {
        ret = replaceAll(ret, "\\n", "\n");
        ret = replaceAll(ret, "\\r", "\r");
        ret = replaceAll(ret, "\\t", "\t");
        ret = replaceAll(ret, "\\\"", "\"");
        ret = replaceAll(ret, "\\\'", "\'");
        ret = replaceAll(ret, "\\\\", "\\");
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Writes the specified cookie
 * Parameters:
 *     name: The cookie name
 *     value: The value
 *     document: The document containing the cookie. Default to self.document
 *     expires: The expiration date or the false flag, indicating it never expires. Defaults: until browser is closed.
 *     path: The cookie's path. Default: not specified
 *     domain: The cookie's domain. Default: not specified
 */
function writeCookie(name, value, document, expires, path, domain, secure) {
    document = document || self.document;
    var str = name + "=" + (isEmpty(value) ? "" : encodeURIComponent(value));
    if (path != null) str += "; path=" + path;
    if (domain != null) str += "; domain=" + domain;
    if (secure != null && booleanValue(secure)) str += "; secure";
    if (expires === false) expires = new Date(2500, 12, 31);
    if (expires instanceof Date) str += "; expires=" + expires.toGMTString();
    document.cookie = str;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Reads the specified cookie
 * Parameters:
 *     name: The cookie name
 *     document: The document containing the cookie. Default to self.document
 * Returns: The value
 */
function readCookie(name, document) {
    document = document || self.document;
    var prefix = name + "=";
    var cookie = document.cookie;
    var begin = cookie.indexOf("; " + prefix);
    if (begin == -1) {
    begin = cookie.indexOf(prefix);
    if (begin != 0) return null;
    } else
    begin += 2;
    var end = cookie.indexOf(";", begin);
    if (end == -1)
    end = cookie.length;
    return decodeURIComponent(cookie.substring(begin + prefix.length, end));
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Removes the specified cookie
 * Parameters:
 *     name: The cookie name
 *     document: The document containing the cookie. Default to self.document
 *     path: The cookie's path. Default: not specified
 *     domain: The cookie's domain. Default: not specified
 */
function deleteCookie(name, document, path, domain) {
    writeCookie(name, null, document, path, domain);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the value of a given date field 
 * Parameters:
 *     date: The date
 *     field: the field. May be one of the constants JST_FIELD_*. Defaults to JST_FIELD_DAY
 */
function getDateField(date, field) {
    if (!isInstance(date, Date)) {
        return null;
    }
    switch (field) {
        case JST_FIELD_MILLISECOND:
            return date.getMilliseconds();
        case JST_FIELD_SECOND:
            return date.getSeconds();
        case JST_FIELD_MINUTE:
            return date.getMinutes();
        case JST_FIELD_HOUR:
            return date.getHours();
        case JST_FIELD_DAY:
            return date.getDate();
        case JST_FIELD_MONTH:
            return date.getMonth();
        case JST_FIELD_YEAR:
            return date.getFullYear();
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Sets the value of a given date field 
 * Parameters:
 *     date: The date
 *     field: the field. May be one of the constants JST_FIELD_*. Defaults to JST_FIELD_DAY
 *     value: The field value
 */
function setDateField(date, field, value) {
    if (!isInstance(date, Date)) {
        return;
    }
    switch (field) {
        case JST_FIELD_MILLISECOND:
            date.setMilliseconds(value);
            break;
        case JST_FIELD_SECOND:
            date.setSeconds(value);
            break;
        case JST_FIELD_MINUTE:
            date.setMinutes(value);
            break;
        case JST_FIELD_HOUR:
            date.setHours(value);
            break;
        case JST_FIELD_DAY:
            date.setDate(value);
            break;
        case JST_FIELD_MONTH:
            date.setMonth(value);
            break;
        case JST_FIELD_YEAR:
            date.setFullYear(value);
            break;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Adds a field to a date
 * Parameters:
 *     date: the date
 *     amount: the amount to add. Defaults to 1
 *     field: The field. May be one of the constants JST_FIELD_*. Defaults to JST_FIELD_DAY
 * Returns: The new date
 */
function dateAdd(date, amount, field) {
    if (!isInstance(date, Date)) {
        return null;
    }
    if (amount == 0) {
        return new Date(date.getTime());
    }
    if (!isInstance(amount, Number)) {
        amount = 1;
    }
    if (field == null) field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null;
    }
    var time = date.getTime();
    if (field <= JST_FIELD_DAY) {
        var mult = 1;
        switch (field) {
            case JST_FIELD_SECOND:
                mult = MILLIS_IN_SECOND;
                break;
            case JST_FIELD_MINUTE:
                mult = MILLIS_IN_MINUTE;
                break;
            case JST_FIELD_HOUR:
                mult = MILLIS_IN_HOUR;
                break;
            case JST_FIELD_DAY:
                mult = MILLIS_IN_DAY;
                break;
        }
        var time = date.getTime();
        time += mult * amount;
        return new Date(time);
    }
    var ret = new Date(time);
    var day = ret.getDate();
    var month = ret.getMonth();
    var year = ret.getFullYear();
    if (field == JST_FIELD_YEAR) {
        year += amount;
    } else if (field == JST_FIELD_MONTH) {
        month += amount;
    }
    while (month > 11) {
        month -= 12;
        year++;
    }
    day = Math.min(day, getMaxDay(month, year));
    ret.setDate(day);
    ret.setMonth(month);
    ret.setFullYear(year);
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the difference, as in date2 - date1
 * Parameters:
 *     date1: the first date
 *     date2: the second date
 *     field: The field. May be one of the constants JST_FIELD_*. Default to JST_FIELD_DAY
 * Returns: An integer number
 */
function dateDiff(date1, date2, field) {
    if (!isInstance(date1, Date) || !isInstance(date2, Date)) {
        return null;
    }
    if (field == null) field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null;
    }
    if (field <= JST_FIELD_DAY) {
        var div = 1;
        switch (field) {
            case JST_FIELD_SECOND:
                div = MILLIS_IN_SECOND;
                break;
            case JST_FIELD_MINUTE:
                div = MILLIS_IN_MINUTE;
                break;
            case JST_FIELD_HOUR:
                div = MILLIS_IN_HOUR;
                break;
            case JST_FIELD_DAY:
                div = MILLIS_IN_DAY;
                break;
        }
        return Math.round((date2.getTime() - date1.getTime()) / div);
    }
    var years = date2.getFullYear() - date1.getFullYear();
    if (field == JST_FIELD_YEAR) {
        return years;
    } else if (field == JST_FIELD_MONTH) {
        var months1 = date1.getMonth();
        var months2 = date2.getMonth();
        
        if (years < 0) {
            months1 += Math.abs(years) * 12;
        } else if (years > 0) {
            months2 += years * 12;
        }
        
        return (months2 - months1);
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Truncates the date, setting all fields lower than the specified one to its minimum value
 * Parameters:
 *     date: The date
 *     field: The field. May be one of the constants JST_FIELD_*. Default to JST_FIELD_DAY
 * Returns: The new Date
 */
function truncDate(date, field) {
    if (!isInstance(date, Date)) {
        return null;
    }
    if (field == null) field = JST_FIELD_DAY;
    if (field < 0 || field > JST_FIELD_YEAR) {
        return null;
    }
    var ret = new Date(date.getTime());
    if (field > JST_FIELD_MILLISECOND) {
        ret.setMilliseconds(0);
    }
    if (field > JST_FIELD_SECOND) {
        ret.setSeconds(0);
    }
    if (field > JST_FIELD_MINUTE) {
        ret.setMinutes(0);
    }
    if (field > JST_FIELD_HOUR) {
        ret.setHours(0);
    }
    if (field > JST_FIELD_DAY) {
        ret.setDate(1);
    }
    if (field > JST_FIELD_MONTH) {
        ret.setMonth(0);
    }
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the maximum day of a given month and year
 * Parameters:
 *     month: the month
 *     year: the year
 * Returns: The maximum day
 */
function getMaxDay(month, year) {
    month = new Number(month) + 1;
    year = new Number(year);
    switch (month) {
        case 1: case 3: case 5: case 7:
        case 8: case 10: case 12:
            return 31;
        case 4: case 6: case 9: case 11:
            return 30;
        case 2:
            if ((year % 4) == 0) {
                return 29;
            } else {
                return 28;
            }
        default:
            return 0;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * Returns the full year, given a 2 digit year. 50 or less returns 2050
 * Parameters:
 *     year: the year
 * Returns: The 4 digit year
 */
function getFullYear(year) {
    year = Number(year);
    if (year < 1000) {
        if (year < 50 || year > 100) {
            year += 2000;
        } else {
            year += 1900;
        }
    }
    return year;
}

/**
 * Sets the opacity of a given object. The value ranges from 0 to 100.
 * This function is currently supported by Internet Explorer (only works 
 * when the object's position is absolute - why?!? >:-( ) and Gecko based 
 * browsers only.
 * Parameters:
 *     object: The object name or reference
 *     value: The opacity value from 0 to 100. Default: 100
 */
function setOpacity(object, value) {
    object = getObject(object);
    if (object == null) {
        return;
    }
    value = Math.round(Number(value));
    if (isNaN(value) || value > 100) {
        value = 100;
    }
    if (value < 0) {
        value = 0;
    }
    var style = object.style;
    if (style == null) {
        return;
    }
    //Opacity on Mozilla / Gecko based browsers
    style.MozOpacity = value / 100;
    //Opacity on Internet Explorer
    style.filter = "alpha(opacity=" + value + ")";
}

/**
 * Returns the opacity of a given object. The value ranges from 0 to 100.
 * This function is currently supported by Internet Explorer and Gecko based browsers only.
 * Parameters:
 *     object: The object name or reference
 */
function getOpacity(object) {
    object = getObject(object);
    if (object == null) {
        return;
    }
    var style = object.style;
    if (style == null) {
        return;
    }
    //Check the known options
    if (style.MozOpacity) {
        //Opacity on Mozilla / Gecko based browsers
        return Math.round(style.MozOpacity * 100);
    } else if (style.filter) {
        //Opacity on Internet Explorer
        var regExp = new RegExp("alpha\\(opacity=(\d*)\\)");
        var array = regExp.exec(style.filter);
        if (array != null && array.length > 1) {
            return parseInt(array[1], 10);
        }
    }
    //Not found. Return 100%
    return 100;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * A class that represents a key/value pair
 * Parameters:
 *     key: The key
 *     value: The value
 */
function Pair(key, value) {
    this.key = key == null ? "" : key;
    this.value = value;
    
    /* Returns a String representation of this pair */
    this.toString = function() {
        return this.key + "=" + this.value;
    };
}

///////////////////////////////////////////////////////////////////////////////
/*
 * DEPRECATED - Pair is a much meaningful name, use it instead.
 *              Value will be removed in future versions.
 */
function Value(key, value) {
    this.base = Pair;
    this.base(key, value);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * A class used to build a string with more performance than string concatenation
 */
function StringBuffer(initialCapacity) {
    this.initialCapacity = initialCapacity || 10;
    this.buffer = new Array(this.initialCapacity);
 
    //Appends the value to the buffer. The buffer itself is returned, so nested calls may be done
    this.append = function(value) {
        this.buffer[this.buffer.length] = value;
        return this;
    }
    
    //Clears the buffer
    this.clear = function() {
        delete this.buffer;
        this.buffer = new Array(this.initialCapacity);
    }
    
    //Returns the buffered string
    this.toString = function() {
        return this.buffer.join("");
    }
    
    //Returns the buffered string length
    this.length = function() {
        return this.toString().length;
    }
}
/*
 * Parsers version 2.2.4
 *
 * This is a set of parsers used both to parse and format different types of data
 *
 * Dependencies: 
 *  - JavaScriptUtil.js
 *
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Home Page: http://javascriptools.sourceforge.net
 *
 * JavaScripTools is distributed under the GNU Lesser General Public License (LGPL).
 * For more information, see http://www.gnu.org/licenses/lgpl-2.1.txt
 */

/*****************************************************************************/

///////////////////////////////////////////////////////////////////////////////
// DEFAULT PROPERTY VALUES CONSTANTS
///////////////////////////////////////////////////////////////////////////////

//////////////   NumberParser Constants
//Number of decimal digits (-1 = unlimited)
var JST_DEFAULT_DECIMAL_DIGITS = -1;
//Decimal separator
var JST_DEFAULT_DECIMAL_SEPARATOR = ",";
//Group separator
var JST_DEFAULT_GROUP_SEPARATOR = ".";
//Use grouping?
var JST_DEFAULT_USE_GROUPING = false;
//Currency symbol
var JST_DEFAULT_CURRENCY_SYMBOL = "R$";
//Use the currency symbol?
var JST_DEFAULT_USE_CURRENCY = false;
//Use parenthesis for negative values?
var JST_DEFAULT_NEGATIVE_PARENTHESIS = false;
//Group size
var JST_DEFAULT_GROUP_SIZE = 3;
//Use space after currency symbol
var JST_DEFAULT_SPACE_AFTER_CURRENCY = true;
//When negative place currency inside minus or parenthesis?
var JST_DEFAULT_CURRENCY_INSIDE = false;

//////////////   DateParser Constants
//Default date mask
var JST_DEFAULT_DATE_MASK = "dd/MM/yyyy";
//Default enforce length
var JST_DEFAULT_ENFORCE_LENGTH = true;

//////////////   BooleanParser Constants
//Default true value
var JST_DEFAULT_TRUE_VALUE = "true";
//Default false value
var JST_DEFAULT_FALSE_VALUE = "false";
//Default useBooleanValue value
var JST_DEFAULT_USE_BOOLEAN_VALUE = true;

///////////////////////////////////////////////////////////////////////////////
/*
 * Parser
 *
 * A superclass for all parser types
 */
function Parser() {
    /*
     * Parses the String
     * Parameters:
     *     text: The text to be parsed
     * Returns: The parsed value
     */
    this.parse = function(text) {
        return text;
    }

    /*
     * Formats the value
     * Parameters:
     *     value: The value to be formatted
     * Returns: The formatted value
     */
    this.format = function(value) {
        return value;
    }
    
    /*
     * Checks if the given text is a valid value for this parser.
     * Returns true if the text is empty
     * Parameters:
     *     value: The text to be tested
     * Returns: Is the text valid?
     */
    this.isValid = function(text) {
        return isEmpty(text) || (this.parse(text) != null);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * NumberParser - used for numbers
 * Parameters: 
 *    decimalDigits: The number of decimal digits. -1 Means no limit. Defaults to the JST_DEFAULT_DECIMAL_DIGITS constant value
 *    decimalSeparator: The decimal separator. Defaults to the JST_DEFAULT_DECIMAL_SEPARATOR constant value
 *    groupSeparator: The separator between thousands group. Defaults to the JST_DEFAULT_GROUP_SEPARATOR constant value
 *    useGrouping: Will grouping separator be used?. Defaults to the JST_DEFAULT_USE_GROUPING constant value
 *    currencySymbol: The currency symbol. Defaults to the JST_DEFAULT_CURRENCY_SYMBOL constant value
 *    useCurrency: Will the currencySymbol be used? Defaults to the JST_DEFAULT_USE_CURRENCY constant value
 *    negativeParenthesis: Use parenthesis (true) or "-" (false) for negative values? Defaults to the JST_DEFAULT_NEGATIVE_PARENTHESIS constant value
 *    groupSize: How many digits will be grouped together? Defaults to the JST_DEFAULT_GROUP_SIZE constant value
 *    spaceAfterCurrency: Will a space be placed after the currency symbol? Defaults to the JST_DEFAULT_SPACE_AFTER_CURRENCY constant value
 *    currencyInside: When negative place currency inside minus or parenthesis?
 * Additional methods (others than those defined on the Parser class):
 *    round(): rounds a number to the parser specific precision
 */
function NumberParser(decimalDigits, decimalSeparator, groupSeparator, useGrouping, currencySymbol, useCurrency, negativeParenthesis, groupSize, spaceAfterCurrency, currencyInside) {
    this.base = Parser;
    this.base();
    
    this.decimalDigits = (decimalDigits == null) ? JST_DEFAULT_DECIMAL_DIGITS : decimalDigits;
    this.decimalSeparator = (decimalSeparator == null) ? JST_DEFAULT_DECIMAL_SEPARATOR : decimalSeparator;
    this.groupSeparator = (groupSeparator == null) ? JST_DEFAULT_GROUP_SEPARATOR : groupSeparator;
    this.useGrouping = (useGrouping == null) ? JST_DEFAULT_USE_GROUPING : booleanValue(useGrouping);
    this.currencySymbol = (currencySymbol == null) ? JST_DEFAULT_CURRENCY_SYMBOL : currencySymbol;
    this.useCurrency = (useCurrency == null) ? JST_DEFAULT_USE_CURRENCY : booleanValue(useCurrency);
    this.negativeParenthesis = (negativeParenthesis == null) ? JST_DEFAULT_NEGATIVE_PARENTHESIS : booleanValue(negativeParenthesis);
    this.groupSize = (groupSize == null) ? JST_DEFAULT_GROUP_SIZE : groupSize;
    this.spaceAfterCurrency = (spaceAfterCurrency == null) ? JST_DEFAULT_SPACE_AFTER_CURRENCY : booleanValue(spaceAfterCurrency);
    this.currencyInside = (currencyInside == null) ? JST_DEFAULT_CURRENCY_INSIDE : booleanValue(currencyInside);
    
    this.parse = function(string) {
        string = trim(string);
        if (isEmpty(string)) {
            return null;
        }
        string = replaceAll(string, this.groupSeparator, "");
        string = replaceAll(string, this.decimalSeparator, ".");
        string = replaceAll(string, this.currencySymbol, "");
        var isNegative = (string.indexOf("(") >= 0) || (string.indexOf("-") >= 0);
        string = replaceAll(string, "(", "");
        string = replaceAll(string, ")", "");
        string = replaceAll(string, "-", "");
        string = trim(string);
        //Check the valid characters
        if (!onlySpecified(string, JST_CHARS_NUMBERS + ".")) {
            return null;
        }
        var ret = parseFloat(string);
        ret = isNegative ? (ret * -1) : ret;
        return this.round(ret);
    }
    
    this.format = function(number) {
        //Check if the number is a String
        if (isNaN(number)) {
            number = this.parse(number);
        }
        if (isNaN(number)) return null;
        
        var isNegative = number < 0;
        number = Math.abs(number);
        var ret = "";
        var parts = String(this.round(number)).split(".");
        var intPart = parts[0];
        var decPart = parts.length > 1 ? parts[1] : "";
        
        //Checks if there's thousand separator
        if ((this.useGrouping) && (!isEmpty(this.groupSeparator))) {
            var group, temp = "";
            for (var i = intPart.length; i > 0; i -= this.groupSize) {
                group = intPart.substring(intPart.length - this.groupSize);
                intPart = intPart.substring(0, intPart.length - this.groupSize);
                temp = group + this.groupSeparator + temp;
            }
            intPart = temp.substring(0, temp.length-1);
        }
        
        //Starts building the return value
        ret = intPart;
        
        //Checks if there's decimal digits
        if (this.decimalDigits != 0) {
            if (this.decimalDigits > 0) {
                while (decPart.length < this.decimalDigits) {
                    decPart += "0";
                }
            }
            if (!isEmpty(decPart)) {
                ret += this.decimalSeparator + decPart;
            }
        }
        
        //Checks the negative number
        if (isNegative && !this.currencyInside) {
            if (this.negativeParenthesis) {
                ret = "(" + ret + ")";
            }  else {
                ret = "-" + ret;
            }
        }
        
        //Checks the currency symbol
        if (this.useCurrency) {
            ret = this.currencySymbol + (this.spaceAfterCurrency ? " " : "") + ret;
        }

        if (isNegative && this.currencyInside) {
            if (this.negativeParenthesis) {
                ret = "(" + ret + ")";
            }  else {
                ret = "-" + ret;
            }
        }

        return ret;
    }
    
    /*
     * Rounds the number to the precision
     */
    this.round = function(number) {
    
        //Checks the trivial cases
        if (this.decimalDigits < 0) {
            return number;
        } else if (this.decimalDigits == 0) {
            return Math.round(number);
        }
        
        var mult = Math.pow(10, this.decimalDigits);
    
        return Math.round(number * mult) / mult;
    }
}

/*****************************************************************************/

///////////////////////////////////////////////////////////////////////////////
/*
 * DateParser - Used for dates
 * Parameters:
 *     mask: The date mask. Accepts the following characters:
 *        d: Day         M: month        y: year
 *        h: 12 hour     H: 24 hour      m: minute
 *        s: second      S: millisecond
 *        a: am / pm     A: AM / PM
 *        /. -: Separators
 *        The default is the value of the JST_DEFAULT_DATE_MASK constant
 *     enforceLength: If set to true, each field on the parsed String must have 
 *        the same length as that field on the mask, ie: yyyy-MM-dd with 99-10-8
 *        would result on a parse error. Default: The value of the JST_DEFAULT_ENFORCE_LENGTH constant
 *     completeFieldsWith: A date used to complete missing fields
 * Additional methods (others than those defined on the Parser class):
 *     (none. all other methods are considered "private" and not supposed 
 *      for external use)
 */
function DateParser(mask, enforceLength, completeFieldsWith) {
    
    this.base = Parser;
    this.base();

    this.mask = (mask == null) ? JST_DEFAULT_DATE_MASK : String(mask);
    this.enforceLength = (enforceLength == null) ? JST_DEFAULT_ENFORCE_LENGTH : booleanValue(enforceLength);
    this.completeFieldsWith = completeFieldsWith || null;
    this.numberParser = new NumberParser(0);
    this.compiledMask = new Array();
    
    //Types of fields
    var LITERAL     =  0;
    var MILLISECOND =  1;
    var SECOND      =  2;
    var MINUTE      =  3;
    var HOUR_12     =  4;
    var HOUR_24     =  5;
    var DAY         =  6;
    var MONTH       =  7;
    var YEAR        =  8;
    var AM_PM_UPPER =  9;
    var AM_PM_LOWER = 10;
    
    this.parse = function(string) {
        if (isEmpty(string)) {
            return null;
        }
        string = trim(String(string)).toUpperCase();
        
        //Checks PM entries
        var pm = string.indexOf("PM") != -1;
        string = replaceAll(replaceAll(string, "AM", ""), "PM", "");
        
        //Get each field value
        var parts = [0, 0, 0, 0, 0, 0, 0];
        var partValues = ["", "", "", "", "", "", ""];
        var entries = [null, null, null, null, null, null, null];
        for (var i = 0; i < this.compiledMask.length; i++) {
            var entry = this.compiledMask[i];
            
            var pos = this.getTypeIndex(entry.type);
            
            //Check if is a literal or not
            if (pos == -1) {
                //Check if it's AM/PM or a literal
                if (entry.type == LITERAL) {
                    //Is a literal: skip it
                    string = string.substr(entry.length);
                } else {
                    //It's a AM/PM. All have been already cleared...
                }
            } else {
                var partValue = 0;
                if (i == (this.compiledMask.length - 1)) {
                    partValue = string;
                    string = "";
                } else {
                    var nextEntry = this.compiledMask[i + 1];
                    
                    //Check if the next part is a literal
                    if (nextEntry.type == LITERAL) {
                        var nextPos = string.indexOf(nextEntry.literal);

                        //Check if next literal is missing
                        if (nextPos == -1) {
                            //Probably the last part on the String
                            partValue = string
                            string = "";
                        } else {
                            //Get the value of the part from the string and cuts it
                            partValue = left(string, nextPos);
                            string = string.substr(nextPos);
                        }
                    } else {
                        //Get the value of the part from the string and cuts it
                        partValue = string.substring(0, entry.length);
                        string = string.substr(entry.length);
                    }
                }
                //Validate the part value and store it
                if (!onlyNumbers(partValue)) {
                    return null;
                }
                partValues[pos] = partValue;
                entries[pos] = entry;
                parts[pos] = isEmpty(partValue) ? this.minValue(parts, entry.type) : this.numberParser.parse(partValue);
            }
        }

        //If there's something else on the String, it's an error!
        if (!isEmpty(string)) {
            return null;
        }

        //If was PM, add 12 hours
        if (pm && (parts[JST_FIELD_HOUR] < 12)) {
            parts[JST_FIELD_HOUR] += 12;
        }
        //The month is from 0 to 11
        if (parts[JST_FIELD_MONTH] > 0) {
            parts[JST_FIELD_MONTH]--;
        }
        //Check for 2-digit year
        if (parts[JST_FIELD_YEAR] < 100) {
            if (parts[JST_FIELD_YEAR] < 50) {
                parts[JST_FIELD_YEAR] += 2000;
            } else {
                parts[JST_FIELD_YEAR] += 1900;
            }
        }
                
        //Validate the parts
        for (var i = 0; i < parts.length; i++) {
            var entry = entries[i]
            var part = parts[i];
            var partValue = partValues[i];
            if (part < 0) {
                return null;
            } else if (entry != null) {
                if (this.enforceLength && ((entry.length >= 0) && (partValue.length < entry.length))) {
                    return null;
                }
                part = parseInt(partValue, 10);
                if (isNaN(part) && this.completeFieldsWith != null) {
                    part = parts[i] = getDateField(this.completeFieldsWith, i); 
                }
                if ((part < this.minValue(parts, entry.type)) || (part > this.maxValue(parts, entry.type))) {
                    return null;
                }
            } else if (i == JST_FIELD_DAY && part == 0) {
                part = parts[i] = 1;
            }
        }        

        //Build the return
        return new Date(parts[JST_FIELD_YEAR], parts[JST_FIELD_MONTH], parts[JST_FIELD_DAY], parts[JST_FIELD_HOUR], 
            parts[JST_FIELD_MINUTE], parts[JST_FIELD_SECOND], parts[JST_FIELD_MILLISECOND]);
    }
    
    this.format = function(date) {
        if (!(date instanceof Date)) {
            date = this.parse(date);
        }
        if (date == null) {
            return "";
        }
        var ret = "";
        var parts = [date.getMilliseconds(), date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth(), date.getFullYear()];

        //Iterate through the compiled mask
        for (var i = 0; i < this.compiledMask.length; i++) {
            var entry = this.compiledMask[i];
            switch (entry.type) {
                case LITERAL: 
                    ret += entry.literal;
                    break;
                case AM_PM_LOWER:
                    ret += (parts[JST_FIELD_HOUR] < 12) ? "am" : "pm";
                    break;
                case AM_PM_UPPER:
                    ret += (parts[JST_FIELD_HOUR] < 12) ? "AM" : "PM";
                    break;
                case MILLISECOND:
                case SECOND:
                case MINUTE:
                case HOUR_24:
                case DAY:
                    ret += lpad(parts[this.getTypeIndex(entry.type)], entry.length, "0");
                    break;
                case HOUR_12:
                    ret += lpad(parts[JST_FIELD_HOUR] % 12, entry.length, "0");
                    break;
                case MONTH:
                    ret += lpad(parts[JST_FIELD_MONTH] + 1, entry.length, "0");
                    break;
                case YEAR:
                    ret += lpad(right(parts[JST_FIELD_YEAR], entry.length), entry.length, "0");
                    break;
            }
        }
        
        //Return the value
        return ret;
    }
    
    /*
     * Returns the maximum value of the field
     */
    this.maxValue = function(parts, type) {
        switch (type) {
            case MILLISECOND: return 999;
            case SECOND: return 59;
            case MINUTE: return 59;
            case HOUR_12: case HOUR_24: return 23; //Internal value: both 23
            case DAY: return getMaxDay(parts[JST_FIELD_MONTH], parts[JST_FIELD_YEAR]);
            case MONTH: return 12;
            case YEAR: return 9999;
            default: return 0;
        }
    }

    /*
     * Returns the minimum value of the field
     */
    this.minValue = function(parts, type) {
        switch (type) {
            case DAY: case MONTH: case YEAR: return 1;
            default: return 0;
        }
    }
        
    /*
     * Returns the field's type
     */
    this.getFieldType = function(field) {
        switch (field.charAt(0)) {
            case "S": return MILLISECOND;
            case "s": return SECOND;
            case "m": return MINUTE;
            case "h": return HOUR_12;
            case "H": return HOUR_24;
            case "d": return DAY;
            case "M": return MONTH;
            case "y": return YEAR;
            case "a": return AM_PM_LOWER;
            case "A": return AM_PM_UPPER;
            default: return LITERAL;
        }
    }
    
    /*
     * Returns the type's index in the field array
     */
    this.getTypeIndex = function(type) {
        switch (type) {
            case MILLISECOND: return JST_FIELD_MILLISECOND;
            case SECOND: return JST_FIELD_SECOND;
            case MINUTE: return JST_FIELD_MINUTE;
            case HOUR_12: case HOUR_24: return JST_FIELD_HOUR;
            case DAY: return JST_FIELD_DAY;
            case MONTH: return JST_FIELD_MONTH;
            case YEAR: return JST_FIELD_YEAR;
            default: return -1;
        }
    }
    
    /*
     * Class containing information about a field
     */
    var Entry = function(type, length, literal) {
        this.type = type;
        this.length = length || -1;
        this.literal = literal;
    }
    
    /*
     * Compiles the mask
     */
    this.compile = function() {
        var current = "";
        var old = "";
        var part = "";
        this.compiledMask = new Array();
        for (var i = 0; i < this.mask.length; i++) {
            current = this.mask.charAt(i);
            
            //Checks if still in the same field
            if ((part == "") || (current == part.charAt(0))) {
                part += current;
            } else {
                //Field changed: use the field
                var type = this.getFieldType(part);
                
                //Store the mask entry
                this.compiledMask[this.compiledMask.length] = new Entry(type, part.length, part);

                //Handles the field changing
                part = "";
                i--;
            }
        }
        //Checks if there's another unparsed part
        if (part != "") {
            var type = this.getFieldType(part);
            
            //Store the mask entry
            this.compiledMask[this.compiledMask.length] = new Entry(type, part.length, part);
        }
    }
    
    /*
     * Changes the format mask
     */
    this.setMask = function(mask) {
        this.mask = mask;
        this.compile();
    }
    
    //Initially set the mask
    this.setMask(this.mask);
}

///////////////////////////////////////////////////////////////////////////////
/*
 * BooleanParser - used for boolean values
 * Parameters:
 *     trueValue: The value returned when parsing true. Default: the JST_DEFAULT_TRUE_VALUE value
 *     falseValue: The value returned when parsing true. Default: the JST_DEFAULT_FALSE_VALUE value
 */
function BooleanParser(trueValue, falseValue, useBooleanValue) {
    this.base = Parser;
    this.base();

    this.trueValue = trueValue || JST_DEFAULT_TRUE_VALUE;
    this.falseValue = falseValue || JST_DEFAULT_FALSE_VALUE;
    this.useBooleanValue = useBooleanValue || JST_DEFAULT_USE_BOOLEAN_VALUE;

    this.parse = function(string) {
        if (this.useBooleanValue && booleanValue(string)) {
            return true;
        }
        return string == JST_DEFAULT_TRUE_VALUE;
    }
    
    this.format = function(bool) {
        return booleanValue(bool) ? this.trueValue : this.falseValue;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * StringParser - Parser for String values
 */
function StringParser() {
    this.base = Parser;
    this.base();

    this.parse = function(string) {
        return String(string);
    }
    
    this.format = function(string) {
        return String(string);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * EscapeParser - used to escape / unescape characters
 * Parameters:
 *     extraChars: A string containing the characters forced to \uXXXX. 
 *                 Default: ""
 *     onlyExtra: A boolean indicating if only then extraCharacters will 
 *                be processed. Default: false
 */
function EscapeParser(extraChars, onlyExtra) {
    this.base = Parser;
    this.base();
    
    this.extraChars = extraChars || "";
    this.onlyExtra = booleanValue(onlyExtra);
    
    this.parse = function(value) {
        if (value == null) {
            return null;
        }
        return unescapeCharacters(String(value), extraChars, onlyExtra);
    }
    
    this.format = function(value) {
        if (value == null) {
            return null;
        }
        return escapeCharacters(String(value), onlyExtra);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * CustomParser - parses / formats using custom functions
 * Parameters:
 *     formatFunction: The function that will format the data
 *     parseFunction: The function that will parse the data
 */
function CustomParser(formatFunction, parseFunction) {
    this.base = Parser;
    this.base();
    
    this.formatFunction = formatFunction || function(value) { return value; };
    this.parseFunction = parseFunction || function(value) { return value; };
    
    this.parse = function(value) {
        return parseFunction.apply(this, arguments);
    }
    
    this.format = function(value) {
        return formatFunction.apply(this, arguments);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * WrapperParser - wraps another parser, adding custom functions to it's results
 * Parameters:
 *     wrappedParser: The wrapped parser
 *     formatFunction: The function that will format the data that has been already parsed by the wrapped parser
 *     parseFunction: The function that will parse the data before the wrapped parser
 */
function WrapperParser(wrappedParser, formatFunction, parseFunction) {
    this.base = Parser;
    this.base();
    
    this.wrappedParser = wrappedParser || new CustomParser();
    this.formatFunction = formatFunction || function(value) { return value; };
    this.parseFunction = parseFunction || function(value) { return value; };
    
    this.format = function(value) {
        var formatted = this.wrappedParser.format.apply(this.wrappedParser, arguments);
        var args = [];
        args[0] = formatted;
        args[1] = arguments[0];
        for (var i = 1, len = arguments.length; i < len; i++) {
            args[i + 1] = arguments[i];
        }
        return formatFunction.apply(this, args);
    }
    
    this.parse = function(value) {
        var parsed = parseFunction.apply(this, arguments);
        arguments[0] = parsed;
        return this.wrappedParser.parse.apply(this.wrappedParser, arguments);
    }
}
/*
 * InputMask version 2.2.4
 *
 * This script contains several classes to restrict the user input on HTML inputs.
 *
 * Dependencies: 
 *  - JavaScriptUtil.js
 *  - Parsers.js (for NumberMask and DateMask)
 *
 * Author: Luis Fernando Planella Gonzalez (lfpg.dev at gmail dot com)
 * Home Page: http://javascriptools.sourceforge.net
 *
 * You may freely distribute this file, just don't remove this header
 */

/*
 * Default value constants
 */
//Will InputMask be applied when the user strokes a backspace?
var JST_NUMBER_MASK_APPLY_ON_BACKSPACE = true;
//Will InputMask validate the text on the onblur event?
var JST_MASK_VALIDATE_ON_BLUR = true;
//Allow negative values by default on the NumberMask
var JST_DEFAULT_ALLOW_NEGATIVE = true;
//Will the NumberMask digits be from left to right by default?
var JST_DEFAULT_LEFT_TO_RIGHT = false;
//Validates the typed text on DateMask?
var JST_DEFAULT_DATE_MASK_VALIDATE = true;
//The default message for DateMask validation errors
var JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE = "";
//The default padFunction for years
var JST_DEFAULT_DATE_MASK_YEAR_PAD_FUNCTION = getFullYear;
//The default padFunction for am/pm field
var JST_DEFAULT_DATE_MASK_AM_PM_PAD_FUNCTION = function(value) {
    if (isEmpty(value)) return "";
    switch (left(value, 1)) {
        case 'a': return 'am';
        case 'A': return 'AM';
        case 'p': return 'pm';
        case 'P': return 'PM';
    }
    return value;
} 
//The default decimal separator for decimal separator for the JST_MASK_DECIMAL 
//Note that this does not affect the NumberMask instances
var JST_FIELD_DECIMAL_SEPARATOR = new Literal(typeof(JST_DEFAULT_DECIMAL_SEPARATOR) == "undefined" ? "," : JST_DEFAULT_DECIMAL_SEPARATOR);
//The SizeLimit default output text
var JST_DEFAULT_LIMIT_OUTPUT_TEXT = "${left}";

///////////////////////////////////////////////////////////////////////////////
//Temporary variables for the masks
numbers = new Input(JST_CHARS_NUMBERS);
optionalNumbers = new Input(JST_CHARS_NUMBERS);
optionalNumbers.optional = true;
oneToTwoNumbers = new Input(JST_CHARS_NUMBERS, 1, 2);
year = new Input(JST_CHARS_NUMBERS, 1, 4, getFullYear);
dateSep = new Literal("/");
dateTimeSep = new Literal(" ");
timeSep = new Literal(":");

/*
 * Some prebuilt masks
 */
var JST_MASK_NUMBERS       = [numbers];
var JST_MASK_DECIMAL       = [numbers, JST_FIELD_DECIMAL_SEPARATOR, optionalNumbers];
var JST_MASK_UPPER         = [new Upper(JST_CHARS_LETTERS)];
var JST_MASK_LOWER         = [new Lower(JST_CHARS_LETTERS)];
var JST_MASK_CAPITALIZE    = [new Capitalize(JST_CHARS_LETTERS)];
var JST_MASK_LETTERS       = [new Input(JST_CHARS_LETTERS)];
var JST_MASK_ALPHA         = [new Input(JST_CHARS_ALPHA)];
var JST_MASK_ALPHA_UPPER   = [new Upper(JST_CHARS_ALPHA)];
var JST_MASK_ALPHA_LOWER   = [new Lower(JST_CHARS_ALPHA)];
var JST_MASK_DATE          = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year];
var JST_MASK_DATE_TIME     = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year, dateTimeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers];
var JST_MASK_DATE_TIME_SEC = [oneToTwoNumbers, dateSep, oneToTwoNumbers, dateSep, year, dateTimeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers, timeSep, oneToTwoNumbers];

/* We ignore the following characters on mask:
45 - insert, 46 - del (not on konqueror), 35 - end, 36 - home, 33 - pgup, 
34 - pgdown, 37 - left, 39 - right, 38 - up, 40 - down,
127 - del on konqueror, 4098 shift + tab on konqueror */
var JST_IGNORED_KEY_CODES = [45, 35, 36, 33, 34, 37, 39, 38, 40, 127, 4098];
if (navigator.userAgent.toLowerCase().indexOf("khtml") < 0) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = 46;
}
//All other with keyCode < 32 are also ignored
for (var i = 0; i < 32; i++) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = i;
}
//F1 - F12 are also ignored
for (var i = 112; i <= 123; i++) {
    JST_IGNORED_KEY_CODES[JST_IGNORED_KEY_CODES.length] = i;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main InputMask class.
 * Parameters: 
 *    fields: The mask fields
 *    control: The reference to the control that is being masked
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    changeFunction: The additional function instance used on the change event
 */
function InputMask(fields, control, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, changeFunction) {
    
    //Check if the fields are a String
    if (isInstance(fields, String)) {
        fields = maskBuilder.parse(fields);
    } else if (isInstance(fields, MaskField)) {
        fields = [fields];
    }
    
    //Check if the fields are a correct array of fields
    if (isInstance(fields, Array)) {
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (!isInstance(field, MaskField)) {
                alert("Invalid field: " + field);
                return;
            }
        }
    } else {
        alert("Invalid field array: " + fields);
        return;
    }
    
    this.fields = fields;

    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to mask");
        return;
    } else {
        this.control = control;
        prepareForCaret(this.control);
        this.control.supportsCaret = isCaretSupported(this.control);
    }
    
    //Set the control's reference to the mask descriptor
    this.control.mask = this;
    this.control.pad = false;
    this.control.ignore = false;

    //Set the function calls
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.updateFunction = updateFunction || null;
    this.changeFunction = changeFunction || null;

    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }

        this.keyCode = typedCode(event);
        
        //Check for extra function on keydown
        if (this.mask.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyDownFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keydown", onKeyDown);
    
    //The KeyPress event will filter the typed character
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }

        //Get what's been typed        
        var keyCode = this.keyCode || typedCode(event);
        var ignore = event.altKey || event.ctrlKey || inArray(keyCode, JST_IGNORED_KEY_CODES);

        //When a range is selected, clear it
        if (!ignore) {
            var range = getInputSelectionRange(this);
            if (range != null && range[0] != range[1]) {
                replaceSelection(this, "");
            }
        }
        
        //Prepre the variables
        this.caretPosition = getCaret(this);
        this.setFixedLiteral = null;
        var typedChar = this.typedChar = ignore ? "" : String.fromCharCode(typedCode(event));
        var fieldDescriptors = this.fieldDescriptors = this.mask.getCurrentFields();
        var currentFieldIndex = this.currentFieldIndex = this.mask.getFieldIndexUnderCaret();

        //Check if any field accept the typed key
        var accepted = false;
        if (!ignore) {
            var currentField = this.mask.fields[currentFieldIndex];
            accepted = currentField.isAccepted(typedChar);
            if (accepted) {
                //Apply basic transformations
                if (currentField.upper) {
                    typedChar = this.typedChar = typedChar.toUpperCase();
                } else if (currentField.lower) {
                    typedChar = this.typedChar = typedChar.toLowerCase();
                }
                if (currentFieldIndex == this.mask.fields.length - 2) {
                    var nextFieldIndex = currentFieldIndex + 1;
                    var nextField = this.mask.fields[nextFieldIndex];
                    if (nextField.literal) {
                        //When this field is the last input and the next field is literal, if this field is complete, append the literal also
                        var currentFieldIsComplete = !currentField.acceptsMoreText(fieldDescriptors[currentFieldIndex].value + typedChar);
                        if (currentFieldIsComplete) {
                            this.setFixedLiteral = nextFieldIndex;
                        }
                    }
                }
            } else {
                var previousFieldIndex = currentFieldIndex - 1;
                if (currentFieldIndex > 0 && this.mask.fields[previousFieldIndex].literal && isEmpty(fieldDescriptors[previousFieldIndex].value)) {
                    //When passed by the previous field without it having a value, force it to have a value
                    this.setFixedLiteral = previousFieldIndex;
                    accepted = true;
                } else if (currentFieldIndex < this.mask.fields.length - 1) {
                    //When typed the next literal, pad this field and go to the next one
                    var descriptor = fieldDescriptors[currentFieldIndex];
                    var nextFieldIndex = currentFieldIndex + 1;
                    var nextField = this.mask.fields[nextFieldIndex];
                    if (nextField.literal && nextField.text.indexOf(typedChar) >= 0) {
                        //Mark the field as setting the current literal
                        this.setFixedLiteral = nextFieldIndex;
                        accepted = true;
                    }
                } else if (currentFieldIndex == this.mask.fields.length - 1 && currentField.literal) {
                    // When the mask ends with a literal and it's the current field, force it to have a value
                    this.setFixedLiteral = currentFieldIndex;
                    accepted = true;
                }
            }
        }

        //Check for extra function on keypress
        if (this.mask.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyPressFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        
        //Return on ignored keycodes
        if (ignore) {
            return;
        }
        
        //Apply the mask
        var shouldApplyMask = !ignore && accepted;
        if (shouldApplyMask) {
            applyMask(this.mask, false);
        }
        
        this.keyCode = null;
        return preventDefault(event);
    }
    observeEvent(this.control, "keypress", onKeyPress);

    //The KeyUp event is no longer used, and will be kept for backward compatibility
    function onKeyUp (event) {
        if (window.event) {
            event = window.event;
        }

        //Check for extra function on keyup
        if (this.mask.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyUpFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keyup", onKeyUp);
    
    //Add support for onchange event
    function onFocus (event) {
        this._lastValue = this.value;
    }
    observeEvent(this.control, "focus", onFocus);
    
    //The Blur event will apply the mask again, to ensure the user will not paste an invalid value
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }
        
        document.fieldOnBlur = this;
        try {        
            var valueChanged = this._lastValue != this.value;
            
            if (valueChanged && JST_MASK_VALIDATE_ON_BLUR) {
                applyMask(this.mask, true);
            }
            
            if (this.mask.changeFunction != null) {
                if (valueChanged && this.mask.changeFunction != null) {
                    var e = {};
                    for (property in event) {
                        e[property] = event[property];
                    }
                    e.type = "change";
                    invokeAsMethod(this, this.mask.changeFunction, [e, this.mask]);
                }
            }
                
            //Check for extra function on blur
            if (this.mask.blurFunction != null) {
                var ret = invokeAsMethod(this, this.mask.blurFunction, [event, this.mask]);
                if (ret == false) {
                    return preventDefault(event);
                }
            }
            return true;
        } finally {
            document.fieldOnBlur = null;
        }
    }
    observeEvent(this.control, "blur", onBlur);
    
    //Method to determine whether the mask fields are complete
    this.isComplete = function () {

        //Ensures the field values will be parsed
        applyMask(this, true);
        
        //Get the fields
        var descriptors = this.getCurrentFields();

        //Check if there is some value
        if (descriptors == null || descriptors.length == 0) {
            return false;
        }

        //Check for completed values
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.input && !field.isComplete(descriptors[i].value) && !field.optional) {
                return false;
            }
        }
        return true;
    }
    
    //Method to force a mask update
    this.update = function () {
        applyMask(this, true);
    }
    
    //Returns an array with objects containing values, start position and end positions
    this.getCurrentFields = function(value) {
        value = value || this.control.value;
        var descriptors = [];
        var currentIndex = 0;
        //Get the value for input fields
        var lastInputIndex = -1;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            var fieldValue = "";
            var descriptor = {};
            if (field.literal) {
                if (lastInputIndex >= 0) {
                    var lastInputField = this.fields[lastInputIndex];
                    var lastInputDescriptor = descriptors[lastInputIndex];
                    //When no text is accepted by the last input field, 
                    //assume the next input will be used, so, assume the value for this literal as it's text
                    if (field.text.indexOf(mid(value, currentIndex, 1)) < 0 && lastInputField.acceptsMoreText(lastInputDescriptor.value)) {
                        descriptor.begin = -1;
                    } else {
                        descriptor.begin = currentIndex;
                    }
                }
                if (currentIndex >= value.length) {
                    break;
                }
                if (value.substring(currentIndex, currentIndex + field.text.length) == field.text) {
                    currentIndex += field.text.length;
                }
            } else {
                //Check if there's a value
                var upTo = field.upTo(value, currentIndex);
                if (upTo < 0 && currentIndex >= value.length) {
                    break;
                }
                fieldValue = upTo < 0 ? "" : field.transformValue(value.substring(currentIndex, upTo + 1));
                descriptor.begin = currentIndex;
                descriptor.value = fieldValue;
                currentIndex += fieldValue.length;
                lastInputIndex = i;
            }
            descriptors[i] = descriptor;
        }
        
        //Complete the descriptors
        var lastWithValue = descriptors.length - 1;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (i > lastWithValue) {
                descriptors[i] = {value: "", begin: -1};
            } else {
                // Literals with inputs on both sides that have values also have values
                if (field.literal) {
                    var descriptor = descriptors[i]; 

                    //Literals that have been set begin < 0 will have no value 
                    if (descriptor.begin < 0) {
                        descriptor.value = "";
                        continue;
                    }
                    
                    //Find the previous input value
                    var previousField = null;
                    var previousValueComplete = false;
                    for (var j = i - 1; j >= 0; j--) {
                        var current = this.fields[j]; 
                        if (current.input) {
                            previousField = current;
                            previousValueComplete = current.isComplete(descriptors[j].value);
                            if (previousValueComplete) {
                                break;
                            } else {
                                previousField = null;
                            }
                        }
                    }

                    //Find the next input value
                    var nextField = null;
                    var nextValueExists = null;
                    for (var j = i + 1; j < this.fields.length && j < descriptors.length; j++) {
                        var current = this.fields[j]; 
                        if (current.input) {
                            nextField = current;
                            nextValueExists = !isEmpty(descriptors[j].value);
                            if (nextValueExists) {
                                break;
                            } else {
                                nextField = null;
                            }
                        }
                    }
                    //3 cases for using the value: 
                    // * both previous and next inputs have complete values
                    // * no previous input and the next has complete value
                    // * no next input and the previous has complete value
                    if ((previousValueComplete && nextValueExists) || (previousField == null && nextValueExists) || (nextField == null && previousValueComplete)) {
                        descriptor.value = field.text;
                    } else {
                        descriptor.value = "";
                        descriptor.begin = -1;
                    }
                }
            }
        }
        return descriptors;
    }
    
    //Returns the field index under the caret
    this.getFieldIndexUnderCaret = function() {
        var value = this.control.value;
        var caret = getCaret(this.control);
        //When caret operations are not supported, assume it's at text end
        if (caret == null) caret = value.length;
        var lastPosition = 0;
        var lastInputIndex = null;
        var lastInputAcceptsMoreText = false;
        var lastWasLiteral = false;
        var returnNextInput = isEmpty(value) || caret == 0;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.input) {
                //Check whether should return the next input field
                if (returnNextInput || lastPosition > value.length) {
                    return i;
                }
                //Find the field value
                var upTo = field.upTo(value, lastPosition)
                if (upTo < 0) {
                    return i; //lastInputIndex == null || lastWasLiteral ? i : lastInputIndex;
                }
                //Handle unlimited fields
                if (field.max < 0) {
                    var nextField = null;
                    if (i < this.fields.length - 1) {
                        nextField = this.fields[i + 1];
                    }
                    if (caret - 1 <= upTo && (nextField == null || nextField.literal)) {
                        return i;
                    } 
                }
                var fieldValue = value.substring(lastPosition, upTo + 1);
                var acceptsMoreText = field.acceptsMoreText(fieldValue);
                var positionToCheck = acceptsMoreText ? caret - 1 : caret
                if (caret >= lastPosition && positionToCheck <= upTo) {
                    return i;
                }
                lastInputAcceptsMoreText = acceptsMoreText;
                lastPosition = upTo + 1;
                lastInputIndex = i;
            } else {
                if (caret == lastPosition) {
                    returnNextInput = !lastInputAcceptsMoreText;
                }
                lastPosition += field.text.length;
            }
            lastWasLiteral = field.literal;
        }
        return this.fields.length - 1;
    }
    
    //Method to determine if the mask is only for filtering which chars can be typed
    this.isOnlyFilter = function () {
        if (this.fields == null || this.fields.length == 0) {
            return true;
        }
        if (this.fields.length > 1) {
            return false;
        }
        var field = this.fields[0];
        return field.input && field.min <= 1 && field.max <= 0;
    }
    
    //Returns if this mask changes the text case
    this.transformsCase = function() {
        if (this.fields == null || this.fields.length == 0) {
            return false;
        }
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field.upper || field.lower || field.capitalize) {
                return true;
            }
        }
        return false;
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main NumberMask class.
 * Parameters: 
 *    parser: The NumberParser instance used by the mask
 *    control: The reference to the control that is being masked
 *    maxIntegerDigits: The limit for integer digits (excluding separators). 
 *                      Default: -1 (no limit)
 *    allowNegative: Should negative values be allowed? Default: see the 
 *                   value of the JST_DEFAULT_ALLOW_NEGATIVE constant.
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    leftToRight: Indicates if the input will be processed from left to right. 
 *                 Default: the JST_DEFAULT_LEFT_TO_RIGHT constant
 *    changeFunction: The additional function instance used on the change event
 */
function NumberMask(parser, control, maxIntegerDigits, allowNegative, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, leftToRight, changeFunction) {
    //Validate the parser
    if (!isInstance(parser, NumberParser)) {
        alert("Illegal NumberParser instance");
        return;
    }
    this.parser = parser;
    
    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to mask");
        return;
    } else {
        this.control = control;
        prepareForCaret(this.control);
        this.control.supportsCaret = isCaretSupported(this.control);
    }

    //Get the additional properties
    this.maxIntegerDigits = maxIntegerDigits || -1;
    this.allowNegative = allowNegative || JST_DEFAULT_ALLOW_NEGATIVE;
    this.leftToRight = leftToRight || JST_DEFAULT_LEFT_TO_RIGHT;

    //Set the control's reference to the mask and other aditional flags
    this.control.mask = this;
    this.control.ignore = false;
    this.control.swapSign = false;
    this.control.toDecimal = false;
    this.control.oldValue = this.control.value;
    
    //Set the function calls
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.updateFunction = updateFunction || null;
    this.changeFunction = changeFunction || null;
    
    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }
        
        var keyCode = typedCode(event);
        this.ignore = event.altKey || event.ctrlKey || inArray(keyCode, JST_IGNORED_KEY_CODES);

        //Check for extra function on keydown
        if (this.mask.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyDownFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        
        return true;
    }
    observeEvent(this.control, "keydown", onKeyDown);

    //The KeyPress event will filter the keys
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        var typedChar = String.fromCharCode(keyCode);

        //Check for extra function on keypress
        if (this.mask.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyPressFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        if (this.ignore) {
            return true;
        }

        //Store the old value
        this.oldValue = this.value;

        //Check for the minus sign
        if (typedChar == '-') {
            if (this.mask.allowNegative) {
                if (this.value == '') {
                    //Typing the negative sign on the empty field. ok.
                    this.ignore = true;
                    return true;
                }
                //The field is not empty. Set the swapSign flag, so applyNumberMask will do the job
                this.swapSign = true;
                applyNumberMask(this.mask, false, false);
            }
            return preventDefault(event);
        }
        //Check for the decimal separator
        if (this.mask.leftToRight && typedChar == this.mask.parser.decimalSeparator && this.mask.parser.decimalDigits != 0) {
            this.toDecimal = true;
            if (this.supportsCaret) {
                return preventDefault(event);
            }
        }
        this.swapSign = false;
        this.toDecimal = false;
        this.accepted = false;
        if (this.mask.leftToRight && typedChar == this.mask.parser.decimalSeparator) {
            if (this.mask.parser.decimalDigits == 0 || this.value.indexOf(this.mask.parser.decimalSeparator) >= 0) {
                this.accepted = true;
                return preventDefault(event);
            } else {
                return true;
            }
        }
        this.accepted = onlyNumbers(typedChar);
        if (!this.accepted) {
            return preventDefault(event);
        }
    }
    observeEvent(this.control, "keypress", onKeyPress);
    
    //The KeyUp event will apply the mask
    function onKeyUp (event) {
        //Check an invalid parser
        if (this.mask.parser.decimalDigits < 0 && !this.mask.leftToRight) {
            alert("A NumberParser with unlimited decimal digits is not supported on NumberMask when the leftToRight property is false");
            this.value = "";
            return false;
        }

        if (window.event) {
            event = window.event;
        }
        //Check if it's not an ignored key
        var keyCode = typedCode(event);
        var isBackSpace = (keyCode == 8) && JST_NUMBER_MASK_APPLY_ON_BACKSPACE;
        if (this.supportsCaret && (this.toDecimal || (!this.ignore && this.accepted) || isBackSpace)) {
            //If the number was already 0 and we stroke a backspace, clear the text value
            if (isBackSpace && this.mask.getAsNumber() == 0) {
                this.value = "";
            }
            applyNumberMask(this.mask, false, isBackSpace);
        }
        //Check for extra function on keyup
        if (this.mask.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.mask.keyUpFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }

        return true;
    }
    observeEvent(this.control, "keyup", onKeyUp);
    
    //Add support for onchange event
    function onFocus (event) {
        if (this.mask.changeFunction != null) {
            this._lastValue = this.value;
        }
    }
    observeEvent(this.control, "focus", onFocus);

    //The Blur event will apply the mask again, to ensure the user will not paste an invalid value
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }
        
        if (JST_MASK_VALIDATE_ON_BLUR) {
            if (this.value == '-') {
                this.value = '';
            } else {
                applyNumberMask(this.mask, true, false);
            }
        }
        
        if (this.mask.changeFunction != null) {
            if (this._lastValue != this.value && this.mask.changeFunction != null) {
                var e = {};
                for (property in event) {
                    e[property] = event[property];
                }
                e.type = "change";
                invokeAsMethod(this, this.mask.changeFunction, [e, this.mask]);
            }
        }
        
        //Check for extra function on keydown
        if (this.mask.blurFunction != null) {
            var ret = invokeAsMethod(this, this.mask.blurFunction, [event, this.mask]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        return true;
    }
    observeEvent(this.control, "blur", onBlur);
    
    //Method to determine if the mask is all complete
    this.isComplete = function() {
        return this.control.value != "";
    }
    
    //Returns the control value as a number
    this.getAsNumber = function() {
        var number = this.parser.parse(this.control.value);
        if (isNaN(number)) {
            number = null;
        }
        return number;
    }

    //Sets the control value as a number
    this.setAsNumber = function(number) {
        var value = "";
        if (isInstance(number, Number)) {
            value = this.parser.format(number);
        }
        this.control.value = value;
        this.update();
    }
    
    //Method to force a mask update
    this.update = function() {
        applyNumberMask(this, true, false);
    }
}

///////////////////////////////////////////////////////////////////////////////
/*
 * This is the main DateMask class.
 * Parameters: 
 *    parser: The DateParser instance used by the mask
 *    control: The reference to the control that is being masked
 *    validate: Validate the control on the onblur event? Default: The JST_DEFAULT_DATE_MASK_VALIDATE value
 *    validationMessage: Message alerted on validation on fail. The ${value} 
 *       placeholder may be used as a substituition for the field value, and ${mask} 
 *       for the parser mask. Default: the JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE value
 *    keyPressFunction: The additional function instance used on the keyPress event
 *    keyDownFunction: The additional function instance used on the keyDown event
 *    keyUpFunction: The additional function instance used on the keyUp event
 *    blurFunction: The additional function instance used on the blur event
 *    updateFunction: A callback called when the mask is applied
 *    changeFunction: The additional function instance used on the change event
 */
function DateMask(parser, control, validate, validationMessage, keyPressFunction, keyDownFunction, keyUpFunction, blurFunction, updateFunction, changeFunction) {
    
    //Validate the parser
    if (isInstance(parser, String)) {
        parser = new DateParser(parser);
    }
    if (!isInstance(parser, DateParser)) {
        alert("Illegal DateParser instance");
        return;
    }
    this.parser = parser;
    
    //Set a control to keyPressFunction, to ensure the validation won't be shown twice
    this.extraKeyPressFunction = keyPressFunction || null;
    function maskKeyPressFunction (event, dateMask) {
        dateMask.showValidation = true;
        if (dateMask.extraKeyPressFunction != null) {
            var ret = invokeAsMethod(this, dateMask.extraKeyPressFunction, [event, dateMask]);
            if (ret == false) {
                return false;
            }
        }
        return true;
    }
    
    //Set the validation to blurFunction, plus the informed blur function
    this.extraBlurFunction = blurFunction || null;
    function maskBlurFunction (event, dateMask) {
        var control = dateMask.control;
        if (dateMask.validate && control.value.length > 0) {
            var controlValue = control.value.toUpperCase();
            controlValue = controlValue.replace(/A[^M]/, "AM");
            controlValue = controlValue.replace(/A$/, "AM");
            controlValue = controlValue.replace(/P[^M]/, "PM");
            controlValue = controlValue.replace(/P$/, "PM");
            var date = dateMask.parser.parse(controlValue);
            if (date == null) {
                var msg = dateMask.validationMessage;
                if (dateMask.showValidation && !isEmpty(msg)) {
                    dateMask.showValidation = false;
                    msg = replaceAll(msg, "${value}", control.value);
                    msg = replaceAll(msg, "${mask}", dateMask.parser.mask);
                    alert(msg);
                }
                control.value = "";
                control.focus();
            } else {
                control.value = dateMask.parser.format(date);
            }
        }
        if (dateMask.extraBlurFunction != null) {
            var ret = invokeAsMethod(this, dateMask.extraBlurFunction, [event, dateMask]);
            if (ret == false) {
                return false;
            }
        }
        return true;
    }
    
    //Build the fields array
    var fields = new Array();
    var old = '';
    var mask = this.parser.mask;
    while (mask.length > 0) {
        var field = mask.charAt(0);
        var size = 1;
        var maxSize = -1;
        var padFunction = null;
        while (mask.charAt(size) == field) {
            size++;
        }
        mask = mid(mask, size);
        var accepted = JST_CHARS_NUMBERS;
        switch (field) {
            case 'd': case 'M': case 'h': case 'H': case 'm': case 's': 
                maxSize = 2;
                break;
            case 'y':
                padFunction = JST_DEFAULT_DATE_MASK_YEAR_PAD_FUNCTION;
                if (size == 2) {
                    maxSize = 2;
                } else {
                    maxSize = 4;
                }
                break;
            case 'a': case 'A': case 'p': case 'P':
                maxSize = 2;
                padFunction = JST_DEFAULT_DATE_MASK_AM_PM_PAD_FUNCTION;
                accepted = 'aApP';
                break;
            case 'S':
                maxSize = 3;
                break;
        }
        var input;
        if (maxSize == -1) {
            input = new Literal(field);
        } else {
            input = new Input(accepted, size, maxSize);
            if (padFunction == null) {
                input.padFunction = new Function("text", "return lpad(text, " + maxSize + ", '0')");
            } else {
                input.padFunction = padFunction;
            }
        }
        fields[fields.length] = input;
    }
    
    //Initialize the superclass
    this.base = InputMask;
    this.base(fields, control, maskKeyPressFunction, keyDownFunction, keyUpFunction, maskBlurFunction, updateFunction, changeFunction);
    
    //Store the additional variables
    this.validate = validate == null ? JST_DEFAULT_DATE_MASK_VALIDATE : booleanValue(validate);
    this.showValidation = true;
    this.validationMessage = validationMessage || JST_DEFAULT_DATE_MASK_VALIDATION_MESSAGE;
    this.control.dateMask = this;
    
    //Returns the control value as a date
    this.getAsDate = function() {
        return this.parser.parse(this.control.value);
    }

    //Sets the control value as a date
    this.setAsDate = function(date) {
        var value = "";
        if (isInstance(date, Date)) {
            value = this.parser.format(date);
        }
        this.control.value = value;
        this.update();
    }
}


///////////////////////////////////////////////////////////////////////////////
/*
 * This class limits the size of an input (mainly textAreas, that does not have a 
 * maxLength attribute). Optionally, can use another element to output the number 
 * of characters on the element and/or the number of characters left.
 * Like the masks, this class uses the keyUp and blur events, may use additional
 * callbacks for those events.
 * Parameters:
 *     control: The textArea reference or name
 *     maxLength: The maximum text length
 *     output: The element to output the number of characters left. Default: none
 *     outputText: The text. May use two placeholders: 
 *         ${size} - Outputs the current text size
 *         ${left} - Outputs the number of characters left
 *         ${max} - Outputs the maximum number characters that the element accepts
 *         Examples: "${size} / ${max}", "You typed ${size}, and have ${left} more characters to type"
 *         Default: "${left}"
 *     updateFunction: If set, this function will be called when the text is updated. So, custom actions
 *         may be performed. The arguments passed to the function are: The control, the text size, the maximum size
 *         and the number of characters left.
 *     keyUpFunction: The additional handler to the keyUp event. Default: none
 *     blurFunction: The additional handler to the blur event. Default: none
 *     keyPressFunction: The additional handler to the keyPress event. Default: none
 *     keyDownFunction: The additional handler to the keyDown event. Default: none
 *     changeFunction: The additional function instance used on the change event. Default: none
 */
function SizeLimit(control, maxLength, output, outputText, updateFunction, keyUpFunction, blurFunction, keyDownFunction, keyPressFunction, changeFunction) {
    //Validate the control
    control = validateControlToMask(control);
    if (!control) {
        alert("Invalid control to limit size");
        return;
    } else {
        this.control = control;
        prepareForCaret(control);
    }
    
    if (!isInstance(maxLength, Number)) {
        alert("Invalid maxLength");
        return;
    }

    //Get the additional properties
    this.control = control;
    this.maxLength = maxLength;
    this.output = output || null;
    this.outputText = outputText || JST_DEFAULT_LIMIT_OUTPUT_TEXT;
    this.updateFunction = updateFunction || null;
    this.keyDownFunction = keyDownFunction || null;
    this.keyPressFunction = keyPressFunction || null;
    this.keyUpFunction = keyUpFunction || null;
    this.blurFunction = blurFunction || null;
    this.changeFunction = changeFunction || null;

    //Set the control's reference to the mask descriptor
    this.control.sizeLimit = this;

    //The onKeyDown event will detect special keys
    function onKeyDown (event) {
        if (window.event) {
            event = window.event;
        }

        var keyCode = typedCode(event);
        this.ignore = inArray(keyCode, JST_IGNORED_KEY_CODES);

        //Check for extra function on keydown
        if (this.sizeLimit.keyDownFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyDownFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
    }
    observeEvent(this.control, "keydown", onKeyDown);
    
    //The KeyPress event will filter the typed character
    function onKeyPress (event) {
        if (window.event) {
            event = window.event;
        }
        
        var keyCode = typedCode(event);
        var typedChar = String.fromCharCode(keyCode);
        var allowed = this.ignore || this.value.length < this.sizeLimit.maxLength;
        
        //Check for extra function on keypress
        if (this.sizeLimit.keyPressFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyPressFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return preventDefault(event);
            }
        }
        if (!allowed) {
            preventDefault(event);
        }
    }
    observeEvent(this.control, "keypress", onKeyPress);
    
    //The KeyUp event handler
    function onKeyUp (event) {
        if (window.event) {
            event = window.event;
        }

        //Check for extra function on keypress
        if (this.sizeLimit.keyUpFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.keyUpFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return false;
            }
        }
        return checkSizeLimit(this, false);
    }
    observeEvent(this.control, "keyup", onKeyUp);

    //Add support for onchange event
    function onFocus (event) {
        if (this.mask && this.mask.changeFunction != null) {
            this._lastValue = this.value;
        }
    }
    observeEvent(this.control, "focus", onFocus);
    
    //The Blur event handler
    function onBlur (event) {
        if (window.event) {
            event = window.event;
        }
        
        var ret = checkSizeLimit(this, true);
        
        if (this.mask && this.mask.changeFunction != null) {
            if (this._lastValue != this.value && this.sizeLimit.changeFunction != null) {
                var e = {};
                for (property in event) {
                    e[property] = event[property];
                }
                e.type = "change";
                invokeAsMethod(this, this.sizeLimit.changeFunction, [e, this.sizeLimit]);
            }
        }

        //Check for extra function on blur
        if (this.sizeLimit.blurFunction != null) {
            var ret = invokeAsMethod(this, this.sizeLimit.blurFunction, [event, this.sizeLimit]);
            if (ret == false) {
                return false;
            }
        }
        return ret;
    }
    observeEvent(this.control, "blur", onBlur);
    
    // Method used to update the limit    
    this.update = function() {
        checkSizeLimit(this.control, true);
    }

    //Initially check the size limit
    this.update();
}

//Function to determine if a given object is a valid control to mask
function validateControlToMask(control) {
    control = getObject(control)
    if (control == null) {
        return false;
    } else if (!(control.type) || (!inArray(control.type, ["text", "textarea", "password"]))) {
        return false;
    } else {
        //Avoid memory leak on MSIE
        if (/MSIE/.test(navigator.userAgent) && !window.opera) {
            observeEvent(self, "unload", function() {
                control.mask = control.dateMask = control.sizeLimit = null;
            });
        }
        return control;
    }
}

//Function to handle the mask format
function applyMask(mask, isBlur) {
    var fields = mask.fields;

    //Return if there are fields to process
    if ((fields == null) || (fields.length == 0)) {
        return;
    }

    var control = mask.control;
    if (isEmpty(control.value) && isBlur) {
        return true;
    }
    
    var value = control.value;
    var typedChar = control.typedChar;
    var typedIndex = control.caretPosition;
    var setFixedLiteral = control.setFixedLiteral;
    var currentFieldIndex = mask.getFieldIndexUnderCaret();
    var fieldDescriptors = mask.getCurrentFields();
    var currentDescriptor = fieldDescriptors[currentFieldIndex];
    
    //Apply the typed char
    if (isBlur || !isEmpty(typedChar)) {
        var out = new StringBuffer(fields.length);
        var caretIncrement = 1;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var descriptor = fieldDescriptors[i];
            var padValue = (setFixedLiteral == i + 1);
            if (currentFieldIndex == i + 1 && field.literal && typedIndex == descriptor.begin) {
                //Increment the caret when "passing by" a literal 
                caretIncrement += field.text.length;
            } else if (field.literal && currentFieldIndex > i) {
            	//Passed through a literal field
            	descriptor.value = field.text;
            	caretIncrement += field.text.length + 1;
            } else if (currentFieldIndex == i) {
                //Append the typed char
                if (!isEmpty(typedIndex) && !isEmpty(typedChar) && field.isAccepted(typedChar)) {
                    var fieldStartsAt = descriptor.begin < 0 ? value.length : descriptor.begin;
                    var insertAt = Math.max(0, typedIndex - fieldStartsAt);
                    if (field.input && field.acceptsMoreText(descriptor.value)) {
                        //When more text is accepted, insert the typed char
                        descriptor.value = insertString(descriptor.value, insertAt, typedChar);
                    } else {
                        //No more text is accepted, overwrite
                        var prefix = left(descriptor.value, insertAt);
                        var suffix = mid(descriptor.value, insertAt + 1);
                        descriptor.value = prefix + typedChar + suffix;
                    }
                }
            }
            //Pad the last field on blur 
            if (isBlur && !isEmpty(descriptor.value) && i == fields.length - 1 && field.input) {
                padValue = true
            }
            //Check if the value should be padded
            if (padValue) {
                var oldValue = descriptor.value;
                descriptor.value = field.pad(descriptor.value);
                var inc = descriptor.value.length - oldValue.length;
                if (inc > 0) {
                    caretIncrement += inc; 
                } 
            }
            out.append(descriptor.value);
        }
        value = out.toString();
    }
    
    //Build the output
    fieldDescriptors = mask.getCurrentFields(value);
    var out = new StringBuffer(fields.length);
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var descriptor = fieldDescriptors[i];
        //When a literal is fixed or the next field has value, append it forcefully
        if (field.literal && (setFixedLiteral == i || (i < fields.length - 1 && !isEmpty(fieldDescriptors[i + 1].value)))) {
            descriptor.value = field.text;
        }
        out.append(descriptor.value);
    }
    
    //Update the control value
    control.value = out.toString();
    if (control.caretPosition != null && !isBlur) {
        if (control.pad) {
            setCaretToEnd(control);
        } else {
            setCaret(control, typedIndex + control.value.length - value.length + caretIncrement);
        }
    }
    
    //Call the update function if present
    if (mask.updateFunction != null) {
        mask.updateFunction(mask);
    }

    //Clear the control variables
    control.typedChar = null;
    control.fieldDescriptors = null;
    control.currentFieldIndex = null;
    
    return false;
}

//Retrieve the number of characters that are not digits up to the caret
function nonDigitsToCaret(value, caret) {
    if (caret == null) {
        return null;
    }
    var nonDigits = 0;
    for (var i = 0; i < caret && i < value.length; i++) {
        if (!onlyNumbers(value.charAt(i))) {
            nonDigits++;
        }
    }
    return nonDigits;
}

//Function to handle the number mask format
function applyNumberMask(numberMask, isBlur, isBackSpace) {
    var control = numberMask.control;
    var value = control.value;
    if (value == "") {
        return true;
    }
    var parser = numberMask.parser;
    var maxIntegerDigits = numberMask.maxIntegerDigits;
    var swapSign = false;
    var toDecimal = false;
    var leftToRight = numberMask.leftToRight;
    if (control.swapSign == true) {
        swapSign = true;
        control.swapSign = false;
    }
    if (control.toDecimal == true) {
        toDecimal = value.indexOf(parser.decimalSeparator) < 0;
        control.toDecimal = false;
    }
    var intPart = "";
    var decPart = "";
    var isNegative = value.indexOf('-') >= 0 || value.indexOf('(') >= 0;
    if (value == "") {
        value = parser.format(0);
    }
    value = replaceAll(value, parser.groupSeparator, '')
    value = replaceAll(value, parser.currencySymbol, '')
    value = replaceAll(value, '-', '')
    value = replaceAll(value, '(', '')
    value = replaceAll(value, ')', '')
    value = replaceAll(value, ' ', '')
    var pos = value.indexOf(parser.decimalSeparator);
    var hasDecimal = (pos >= 0);
    var caretAdjust = 0;
    
    //Check if the handling will be from left to right or right to left
    if (leftToRight) {
        //The left to right is based on the decimal separator position
        if (hasDecimal) {
            intPart = value.substr(0, pos);
            decPart = value.substr(pos + 1);
        } else {
            intPart = value;
        }
        if (isBlur && parser.decimalDigits > 0) {
            decPart = rpad(decPart, parser.decimalDigits, '0');
        }
    } else {
        //The right to left is based on a fixed decimal size
        var decimalDigits = parser.decimalDigits;
        value = replaceAll(value, parser.decimalSeparator, '');
        intPart = left(value, value.length - decimalDigits);
        decPart = lpad(right(value, decimalDigits), decimalDigits, '0');
    }
    var zero = onlySpecified(intPart + decPart, '0');

    //Validate the input
    if ((!isEmpty(intPart) && !onlyNumbers(intPart)) || (!isEmpty(decPart) && !onlyNumbers(decPart))) {
        control.value = control.oldValue;
        return true;
    }
    if (leftToRight && parser.decimalDigits >= 0 && decPart.length > parser.decimalDigits) {
        decPart = decPart.substring(0, parser.decimalDigits);
    }
    if (maxIntegerDigits >= 0 && intPart.length > maxIntegerDigits) {
        caretAdjust = maxIntegerDigits - intPart.length - 1;
        intPart = left(intPart, maxIntegerDigits);
    }
    //Check the sign
    if (zero) {
        isNegative = false;
    } else if (swapSign) {
        isNegative = !isNegative;
    }
    //Format the integer part with decimal separators
    if (!isEmpty(intPart)) {
        while (intPart.charAt(0) == '0') {
            intPart = intPart.substr(1);
        }
    }
    if (isEmpty(intPart)) {
        intPart = "0";
    }
    if ((parser.useGrouping) && (!isEmpty(parser.groupSeparator))) {
        var group, temp = "";
        for (var i = intPart.length; i > 0; i -= parser.groupSize) {
            group = intPart.substring(intPart.length - parser.groupSize);
            intPart = intPart.substring(0, intPart.length - parser.groupSize);
            temp = group + parser.groupSeparator + temp;
        }
        intPart = temp.substring(0, temp.length-1);
    }
    //Format the output
    var out = new StringBuffer();
    var oneFormatted = parser.format(isNegative ? -1 : 1);
    var appendEnd = true;
    pos = oneFormatted.indexOf('1');
    out.append(oneFormatted.substring(0, pos));
    out.append(intPart);
    
    //Build the output
    if (leftToRight) {
        if (toDecimal || !isEmpty(decPart)) {
            out.append(parser.decimalSeparator).append(decPart);
            appendEnd = !toDecimal;
        }
    } else {
        if (parser.decimalDigits > 0) {
            out.append(parser.decimalSeparator);
        }
        out.append(decPart);
    }
    
    if (appendEnd && oneFormatted.indexOf(")") >= 0) {
        out.append(")");
    }

    //Retrieve the caret    
    var caret = getCaret(control);
    var oldNonDigitsToCaret = nonDigitsToCaret(control.value, caret), hadSymbol;
    var caretToEnd = toDecimal || caret == null || caret == control.value.length;
    if (caret != null && !isBlur) { 
        hadSymbol = control.value.indexOf(parser.currencySymbol) >= 0 || control.value.indexOf(parser.decimalSeparator) >= 0;
    }
    
    //Update the value
    control.value = out.toString();
    
    if (caret != null && !isBlur) {    
        //If a currency symbol was inserted, set caret to end    
        if (!hadSymbol && ((value.indexOf(parser.currencySymbol) >= 0) || (value.indexOf(parser.decimalSeparator) >= 0))) {
            caretToEnd = true;
        }
        //Restore the caret
        if (!caretToEnd) {
            //Retrieve the new caret position
            var newNonDigitsToCaret = nonDigitsToCaret(control.value, caret);
            //There's no caret adjust when backspace was pressed
            if (isBackSpace) {
                caretAdjust = 0;
            }
            setCaret(control, caret + caretAdjust + newNonDigitsToCaret - oldNonDigitsToCaret);
        } else {
            setCaretToEnd(control);
        }
    }
    
    //Call the update function if present
    if (numberMask.updateFunction != null) {
        numberMask.updateFunction(numberMask);
    }

    return false;
}

//Function to check the text limit
function checkSizeLimit(control, isBlur) {
    var sizeLimit = control.sizeLimit;
    var max = sizeLimit.maxLength;
    var diff = max - control.value.length;
    if (control.value.length > max) {
        control.value = left(control.value, max);
        setCaretToEnd(control);
    }
    var size = control.value.length;
    var charsLeft = max - size;
    if (sizeLimit.output != null) {
        var text = sizeLimit.outputText;
        text = replaceAll(text, "${size}", size);
        text = replaceAll(text, "${left}", charsLeft);
        text = replaceAll(text, "${max}", max);
        setValue(sizeLimit.output, text);
    }
    if (isInstance(sizeLimit.updateFunction, Function)) {
        sizeLimit.updateFunction(control, size, max, charsLeft);
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////
// MaskField Type Classes

/*
 * General input field type
 */
function MaskField() {
    this.literal = false;
    this.input = false;
    
    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        return -1;
    }
}

/*
 * Literal field type
 */
function Literal(text) {
    this.base = MaskField;
    this.base();
    this.text = text;
    this.literal = true;
    
    //Return if the character is in the text
    this.isAccepted = function(chr) {
        return onlySpecified(chr, this.text);
    }
    
    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        return text.indexOf(this.text, fromIndex);
    }
}

/*
 * User input field type
 */
function Input(accepted, min, max, padFunction, optional) {
    this.base = MaskField;
    this.base();
    this.accepted = accepted;
    if (min != null && max == null) {
        max = min;
    }
    this.min = min || 1;
    this.max = max || -1;
    this.padFunction = padFunction || null;
    this.input = true;
    this.upper = false;
    this.lower = false;
    this.capitalize = false;
    this.optional = booleanValue(optional);

    //Ensures the min/max consistencies
    if (this.min < 1) {
        this.min = 1;
    }
    if (this.max == 0) {
        this.max = -1;
    }
    if ((this.max < this.min) && (this.max >= 0)) {
        this.max = this.min;
    }
    
    //Returns the index up to where the texts matches this input
    this.upTo = function(text, fromIndex) {
        text = text || "";
        fromIndex = fromIndex || 0;
        if (text.length < fromIndex) {
            return -1;
        }
        var toIndex = -1;
        for (var i = fromIndex; i < text.length; i++) {
            if (this.isAccepted(text.substring(fromIndex, i + 1))) {
                toIndex = i;
            } else {
                break;
            }
        }
        return toIndex;
    }

    //Tests whether this field accepts more than the given text     
    this.acceptsMoreText = function(text) {
        if (this.max < 0) return true; 
        return (text || "").length < this.max;
    }
    
    //Tests whether the text is accepted
    this.isAccepted = function(text) {
        return ((this.accepted == null) || onlySpecified(text, this.accepted)) && ((text.length <= this.max) || (this.max < 0));
    }

    //Tests whether the text length is ok
    this.checkLength = function(text) {
        return (text.length >= this.min) && ((this.max < 0) || (text.length <= this.max));
    }
    
    //Tests whether the text is complete
    this.isComplete = function(text) {
        text = String(text);
        if (isEmpty(text)) {
            return this.optional;
        }
        return text.length >= this.min;
    }

    //Apply the case transformations when necessary
    this.transformValue = function(text) {
        text = String(text);
        if (this.upper) {
            return text.toUpperCase();
        } else if (this.lower) {
            return text.toLowerCase();
        } else if (this.capitalize) {
            return capitalize(text);
        } else {
            return text;
        }
    }
    
    //Pads the text
    this.pad = function(text) {
        text = String(text);
        if ((text.length < this.min) && ((this.max >= 0) || (text.length <= this.max)) || this.max < 0) {
            var value;
            if (this.padFunction != null && this.padFunction instanceof Function) {
                value = this.padFunction(text, this.min, this.max);
            } else {
                value = text;
            }
            //Enforces padding
            if (value.length < this.min) {
                var padChar = ' ';
                if (this.accepted == null || this.accepted.indexOf(' ') > 0) {
                    padChar = ' ';
                } else if (this.accepted.indexOf('0') > 0) {
                    padChar = '0';
                } else {
                    padChar = this.accepted.charAt(0);
                }
                return left(lpad(value, this.min, padChar), this.min);
            } else {
                //If has no max limit
                return value;
            }
        } else {
            return text;
        }
    }
}

/*
 * Lowercased input field type
 */
function Lower(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.lower = true;
}

/*
 * Uppercased input field type
 */
function Upper(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.upper = true;
}

/*
 * Capitalized input field type
 */
function Capitalize(accepted, min, max, padFunction, optional) {
    this.base = Input;
    this.base(accepted, min, max, padFunction, optional);
    this.capitalize = true;
}

///////////////////////////////////////////////////////////////////////////////
/*
 * The FieldBuilder class is used to build input fields
 */
function FieldBuilder() {
    
    /**
     * Builds a literal input with the given text
     */
    this.literal = function(text) {
        return new Literal(text);
    }

    /* 
     * Build an input field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.input = function(accepted, min, max, padFunction, optional) {
        return new Input(accepted, min, max, padFunction, optional);
    }

    /* 
     * Build an uppercase input field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.upper = function(accepted, min, max, padFunction, optional) {
        return new Upper(accepted, min, max, padFunction, optional);
    }

    /* 
     * Build an lowercase field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.lower = function(accepted, min, max, padFunction, optional) {
        return new Lower(accepted, min, max, padFunction, optional);
    }

    /* 
     * Build an capitalized input field with the given accepted chars. 
     * All other parameters are optional 
     */
    this.capitalize = function(accepted, min, max, padFunction, optional) {
        return new Capitalize(accepted, min, max, padFunction, optional);
    }
    
    /* 
     * Build an input field accepting any chars.
     * All parameters are optional 
     */
    this.inputAll = function(min, max, padFunction, optional) {
        return this.input(null, min, max, padFunction, optional);
    }

    /* 
     * Build an uppercase input field accepting any chars.
     * All parameters are optional 
     */
    this.upperAll = function(min, max, padFunction, optional) {
        return this.upper(null, min, max, padFunction, optional);
    }

    /* 
     * Build an lowercase field accepting any chars.
     * All parameters are optional 
     */
    this.lowerAll = function(min, max, padFunction, optional) {
        return this.lower(null, min, max, padFunction, optional);
    }

    /* 
     * Build an capitalized input field accepting any chars.
     * All parameters are optional 
     */
    this.capitalizeAll = function(min, max, padFunction, optional) {
        return this.capitalize(null, min, max, padFunction, optional);
    }
    
    /* 
     * Build an input field accepting only numbers.
     * All parameters are optional 
     */
    this.inputNumbers = function(min, max, padFunction, optional) {
        return this.input(JST_CHARS_NUMBERS, min, max, padFunction, optional);
    }
    
    /* 
     * Build an input field accepting only letters.
     * All parameters are optional 
     */
    this.inputLetters = function(min, max, padFunction, optional) {
        return this.input(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /* 
     * Build an uppercase input field accepting only letters.
     * All parameters are optional 
     */
    this.upperLetters = function(min, max, padFunction, optional) {
        return this.upper(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /* 
     * Build an lowercase input field accepting only letters.
     * All parameters are optional 
     */
    this.lowerLetters = function(min, max, padFunction, optional) {
        return this.lower(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }

    /* 
     * Build an capitalized input field accepting only letters.
     * All parameters are optional 
     */
    this.capitalizeLetters = function(min, max, padFunction, optional) {
        return this.capitalize(JST_CHARS_LETTERS, min, max, padFunction, optional);
    }
}
//Create a FieldBuilder instance
var fieldBuilder = new FieldBuilder();

///////////////////////////////////////////////////////////////////////////////
/*
 * The MaskBuilder class is used to build masks in a easier to use way
 */
function MaskBuilder() {

    /* 
     * Parses a String, building a mask from it.
     * The following characters are recognized
     * #, 0 or 9 - A number               
     * a or A - A letter
     * ? or _ - Any character
     * l or L - A lowercase letter
     * u or U - An uppercase letter
     * c or C - A capitalized letter
     * \\ - A backslash
     * \#, \0, ... - Those literal characters
     * any other character - A literal text
     */
    this.parse = function(string) {
        if (string == null || !isInstance(string, String)) {
            return this.any();
        }
        var fields = new Array();
        var start = null;
        var lastType = null;
        //helper function
        var switchField = function(type, text) {
            switch (type) {
                case '_':
                    return fieldBuilder.inputAll(text.length);
                case '#':
                    return fieldBuilder.inputNumbers(text.length);
                case 'a':
                    return fieldBuilder.inputLetters(text.length);
                case 'l': 
                    return fieldBuilder.lowerLetters(text.length);
                case 'u': 
                    return fieldBuilder.upperLetters(text.length);
                case 'c': 
                    return fieldBuilder.capitalizeLetters(text.length);
                default:
                    return fieldBuilder.literal(text);
            }
        }
        //Let's parse the string
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (start == null) {
                start = i;
            }
            var type;
            var literal = false;
            //Checks for the escaping backslash
            if (c == '\\') {
                if (i == string.length - 1) {
                    break;
                }
                string = left(string, i) + mid(string, i + 1);
                c = string.charAt(i);
                literal = true;
            }
            //determine the field type
            if (literal) {
                type = '?';
            } else {
                switch (c) {
                    case '?': case '_':
                        type = '_';
                        break;
                    case '#': case '0': case '9':
                        type = '#';
                        break;
                    case 'a': case 'A':
                        type = 'a';
                        break;
                    case 'l': case 'L':
                        type = 'l';
                        break;
                    case 'u': case 'U':
                        type = 'u';
                        break;
                    case 'c': case 'C':
                        type = 'c';
                        break;
                    default:
                        type = '?';
                }
            }
            if (lastType != type && lastType != null) {
                var text = string.substring(start, i);
                fields[fields.length] = switchField(lastType, text);
                start = i;
                lastType = type;
            } else {
                lastType = type
            }
        }
        //Use the last field
        if (start < string.length) {
            var text = string.substring(start);
            fields[fields.length] = switchField(lastType, text);
        }
        return fields;
    }
    
    /* 
     * Build a mask that accepts the given characters
     * May also specify the max length
     */
    this.accept = function(accepted, max) {
        return [fieldBuilder.input(accepted, max)];
    }

    /* 
     * Build a mask that accepts any characters
     * May also specify the max length
     */
    this.any = function(max) {
        return [fieldBuilder.any(max)];
    }

    /* 
     * Build a numeric mask
     * May also specify the max length
     */
    this.numbers = function(max) {
        return [fieldBuilder.inputNumbers(max)];
    }
    
    /* 
     * Build a decimal input mask
     */
    this.decimal = function() {
        var decimalField = fieldBuilder.inputNumbers();
        decimalField.optional = true;
        return [fieldBuilder.inputNumbers(), JST_FIELD_DECIMAL_SEPARATOR, decimalField];
    }
    
    /* 
     * Build a mask that only accepts letters
     * May also specify the max length
     */
    this.letters = function(max) {
        return [fieldBuilder.inputLetters(max)];
    }
    
    /* 
     * Build a mask that only accepts uppercase letters
     * May also specify the max length
     */
    this.upperLetters = function(max) {
        return [fieldBuilder.upperLetters(max)];
    }
    
    /* 
     * Build a mask that only accepts lowercase letters
     * May also specify the max length
     */
    this.lowerLetters = function(max) {
        return [fieldBuilder.lowerLetters(max)];
    }
    
    /* 
     * Build a mask that only accepts capitalized letters
     * May also specify the max length
     */
    this.capitalizeLetters = function(max) {
        return [fieldBuilder.capitalizeLetters(max)];
    }
}
//Create a MaskBuilder instance
var maskBuilder = new MaskBuilder();
/*! https://mths.be/he v1.1.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	// All astral symbols.
	var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	// All ASCII symbols (not just printable ASCII) except those listed in the
	// first column of the overrides table.
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides
	var regexAsciiWhitelist = /[\x01-\x7F]/g;
	// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
	// code points listed in the first column of the overrides table on
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.
	var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

	var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
	var encodeMap = {'\xAD':'shy','\u200C':'zwnj','\u200D':'zwj','\u200E':'lrm','\u2063':'ic','\u2062':'it','\u2061':'af','\u200F':'rlm','\u200B':'ZeroWidthSpace','\u2060':'NoBreak','\u0311':'DownBreve','\u20DB':'tdot','\u20DC':'DotDot','\t':'Tab','\n':'NewLine','\u2008':'puncsp','\u205F':'MediumSpace','\u2009':'thinsp','\u200A':'hairsp','\u2004':'emsp13','\u2002':'ensp','\u2005':'emsp14','\u2003':'emsp','\u2007':'numsp','\xA0':'nbsp','\u205F\u200A':'ThickSpace','\u203E':'oline','_':'lowbar','\u2010':'dash','\u2013':'ndash','\u2014':'mdash','\u2015':'horbar',',':'comma',';':'semi','\u204F':'bsemi',':':'colon','\u2A74':'Colone','!':'excl','\xA1':'iexcl','?':'quest','\xBF':'iquest','.':'period','\u2025':'nldr','\u2026':'mldr','\xB7':'middot','\'':'apos','\u2018':'lsquo','\u2019':'rsquo','\u201A':'sbquo','\u2039':'lsaquo','\u203A':'rsaquo','"':'quot','\u201C':'ldquo','\u201D':'rdquo','\u201E':'bdquo','\xAB':'laquo','\xBB':'raquo','(':'lpar',')':'rpar','[':'lsqb',']':'rsqb','{':'lcub','}':'rcub','\u2308':'lceil','\u2309':'rceil','\u230A':'lfloor','\u230B':'rfloor','\u2985':'lopar','\u2986':'ropar','\u298B':'lbrke','\u298C':'rbrke','\u298D':'lbrkslu','\u298E':'rbrksld','\u298F':'lbrksld','\u2990':'rbrkslu','\u2991':'langd','\u2992':'rangd','\u2993':'lparlt','\u2994':'rpargt','\u2995':'gtlPar','\u2996':'ltrPar','\u27E6':'lobrk','\u27E7':'robrk','\u27E8':'lang','\u27E9':'rang','\u27EA':'Lang','\u27EB':'Rang','\u27EC':'loang','\u27ED':'roang','\u2772':'lbbrk','\u2773':'rbbrk','\u2016':'Vert','\xA7':'sect','\xB6':'para','@':'commat','*':'ast','/':'sol','undefined':null,'&':'amp','#':'num','%':'percnt','\u2030':'permil','\u2031':'pertenk','\u2020':'dagger','\u2021':'Dagger','\u2022':'bull','\u2043':'hybull','\u2032':'prime','\u2033':'Prime','\u2034':'tprime','\u2057':'qprime','\u2035':'bprime','\u2041':'caret','`':'grave','\xB4':'acute','\u02DC':'tilde','^':'Hat','\xAF':'macr','\u02D8':'breve','\u02D9':'dot','\xA8':'die','\u02DA':'ring','\u02DD':'dblac','\xB8':'cedil','\u02DB':'ogon','\u02C6':'circ','\u02C7':'caron','\xB0':'deg','\xA9':'copy','\xAE':'reg','\u2117':'copysr','\u2118':'wp','\u211E':'rx','\u2127':'mho','\u2129':'iiota','\u2190':'larr','\u219A':'nlarr','\u2192':'rarr','\u219B':'nrarr','\u2191':'uarr','\u2193':'darr','\u2194':'harr','\u21AE':'nharr','\u2195':'varr','\u2196':'nwarr','\u2197':'nearr','\u2198':'searr','\u2199':'swarr','\u219D':'rarrw','\u219D\u0338':'nrarrw','\u219E':'Larr','\u219F':'Uarr','\u21A0':'Rarr','\u21A1':'Darr','\u21A2':'larrtl','\u21A3':'rarrtl','\u21A4':'mapstoleft','\u21A5':'mapstoup','\u21A6':'map','\u21A7':'mapstodown','\u21A9':'larrhk','\u21AA':'rarrhk','\u21AB':'larrlp','\u21AC':'rarrlp','\u21AD':'harrw','\u21B0':'lsh','\u21B1':'rsh','\u21B2':'ldsh','\u21B3':'rdsh','\u21B5':'crarr','\u21B6':'cularr','\u21B7':'curarr','\u21BA':'olarr','\u21BB':'orarr','\u21BC':'lharu','\u21BD':'lhard','\u21BE':'uharr','\u21BF':'uharl','\u21C0':'rharu','\u21C1':'rhard','\u21C2':'dharr','\u21C3':'dharl','\u21C4':'rlarr','\u21C5':'udarr','\u21C6':'lrarr','\u21C7':'llarr','\u21C8':'uuarr','\u21C9':'rrarr','\u21CA':'ddarr','\u21CB':'lrhar','\u21CC':'rlhar','\u21D0':'lArr','\u21CD':'nlArr','\u21D1':'uArr','\u21D2':'rArr','\u21CF':'nrArr','\u21D3':'dArr','\u21D4':'iff','\u21CE':'nhArr','\u21D5':'vArr','\u21D6':'nwArr','\u21D7':'neArr','\u21D8':'seArr','\u21D9':'swArr','\u21DA':'lAarr','\u21DB':'rAarr','\u21DD':'zigrarr','\u21E4':'larrb','\u21E5':'rarrb','\u21F5':'duarr','\u21FD':'loarr','\u21FE':'roarr','\u21FF':'hoarr','\u2200':'forall','\u2201':'comp','\u2202':'part','\u2202\u0338':'npart','\u2203':'exist','\u2204':'nexist','\u2205':'empty','\u2207':'Del','\u2208':'in','\u2209':'notin','\u220B':'ni','\u220C':'notni','\u03F6':'bepsi','\u220F':'prod','\u2210':'coprod','\u2211':'sum','+':'plus','\xB1':'pm','\xF7':'div','\xD7':'times','<':'lt','\u226E':'nlt','<\u20D2':'nvlt','=':'equals','\u2260':'ne','=\u20E5':'bne','\u2A75':'Equal','>':'gt','\u226F':'ngt','>\u20D2':'nvgt','\xAC':'not','|':'vert','\xA6':'brvbar','\u2212':'minus','\u2213':'mp','\u2214':'plusdo','\u2044':'frasl','\u2216':'setmn','\u2217':'lowast','\u2218':'compfn','\u221A':'Sqrt','\u221D':'prop','\u221E':'infin','\u221F':'angrt','\u2220':'ang','\u2220\u20D2':'nang','\u2221':'angmsd','\u2222':'angsph','\u2223':'mid','\u2224':'nmid','\u2225':'par','\u2226':'npar','\u2227':'and','\u2228':'or','\u2229':'cap','\u2229\uFE00':'caps','\u222A':'cup','\u222A\uFE00':'cups','\u222B':'int','\u222C':'Int','\u222D':'tint','\u2A0C':'qint','\u222E':'oint','\u222F':'Conint','\u2230':'Cconint','\u2231':'cwint','\u2232':'cwconint','\u2233':'awconint','\u2234':'there4','\u2235':'becaus','\u2236':'ratio','\u2237':'Colon','\u2238':'minusd','\u223A':'mDDot','\u223B':'homtht','\u223C':'sim','\u2241':'nsim','\u223C\u20D2':'nvsim','\u223D':'bsim','\u223D\u0331':'race','\u223E':'ac','\u223E\u0333':'acE','\u223F':'acd','\u2240':'wr','\u2242':'esim','\u2242\u0338':'nesim','\u2243':'sime','\u2244':'nsime','\u2245':'cong','\u2247':'ncong','\u2246':'simne','\u2248':'ap','\u2249':'nap','\u224A':'ape','\u224B':'apid','\u224B\u0338':'napid','\u224C':'bcong','\u224D':'CupCap','\u226D':'NotCupCap','\u224D\u20D2':'nvap','\u224E':'bump','\u224E\u0338':'nbump','\u224F':'bumpe','\u224F\u0338':'nbumpe','\u2250':'doteq','\u2250\u0338':'nedot','\u2251':'eDot','\u2252':'efDot','\u2253':'erDot','\u2254':'colone','\u2255':'ecolon','\u2256':'ecir','\u2257':'cire','\u2259':'wedgeq','\u225A':'veeeq','\u225C':'trie','\u225F':'equest','\u2261':'equiv','\u2262':'nequiv','\u2261\u20E5':'bnequiv','\u2264':'le','\u2270':'nle','\u2264\u20D2':'nvle','\u2265':'ge','\u2271':'nge','\u2265\u20D2':'nvge','\u2266':'lE','\u2266\u0338':'nlE','\u2267':'gE','\u2267\u0338':'ngE','\u2268\uFE00':'lvnE','\u2268':'lnE','\u2269':'gnE','\u2269\uFE00':'gvnE','\u226A':'ll','\u226A\u0338':'nLtv','\u226A\u20D2':'nLt','\u226B':'gg','\u226B\u0338':'nGtv','\u226B\u20D2':'nGt','\u226C':'twixt','\u2272':'lsim','\u2274':'nlsim','\u2273':'gsim','\u2275':'ngsim','\u2276':'lg','\u2278':'ntlg','\u2277':'gl','\u2279':'ntgl','\u227A':'pr','\u2280':'npr','\u227B':'sc','\u2281':'nsc','\u227C':'prcue','\u22E0':'nprcue','\u227D':'sccue','\u22E1':'nsccue','\u227E':'prsim','\u227F':'scsim','\u227F\u0338':'NotSucceedsTilde','\u2282':'sub','\u2284':'nsub','\u2282\u20D2':'vnsub','\u2283':'sup','\u2285':'nsup','\u2283\u20D2':'vnsup','\u2286':'sube','\u2288':'nsube','\u2287':'supe','\u2289':'nsupe','\u228A\uFE00':'vsubne','\u228A':'subne','\u228B\uFE00':'vsupne','\u228B':'supne','\u228D':'cupdot','\u228E':'uplus','\u228F':'sqsub','\u228F\u0338':'NotSquareSubset','\u2290':'sqsup','\u2290\u0338':'NotSquareSuperset','\u2291':'sqsube','\u22E2':'nsqsube','\u2292':'sqsupe','\u22E3':'nsqsupe','\u2293':'sqcap','\u2293\uFE00':'sqcaps','\u2294':'sqcup','\u2294\uFE00':'sqcups','\u2295':'oplus','\u2296':'ominus','\u2297':'otimes','\u2298':'osol','\u2299':'odot','\u229A':'ocir','\u229B':'oast','\u229D':'odash','\u229E':'plusb','\u229F':'minusb','\u22A0':'timesb','\u22A1':'sdotb','\u22A2':'vdash','\u22AC':'nvdash','\u22A3':'dashv','\u22A4':'top','\u22A5':'bot','\u22A7':'models','\u22A8':'vDash','\u22AD':'nvDash','\u22A9':'Vdash','\u22AE':'nVdash','\u22AA':'Vvdash','\u22AB':'VDash','\u22AF':'nVDash','\u22B0':'prurel','\u22B2':'vltri','\u22EA':'nltri','\u22B3':'vrtri','\u22EB':'nrtri','\u22B4':'ltrie','\u22EC':'nltrie','\u22B4\u20D2':'nvltrie','\u22B5':'rtrie','\u22ED':'nrtrie','\u22B5\u20D2':'nvrtrie','\u22B6':'origof','\u22B7':'imof','\u22B8':'mumap','\u22B9':'hercon','\u22BA':'intcal','\u22BB':'veebar','\u22BD':'barvee','\u22BE':'angrtvb','\u22BF':'lrtri','\u22C0':'Wedge','\u22C1':'Vee','\u22C2':'xcap','\u22C3':'xcup','\u22C4':'diam','\u22C5':'sdot','\u22C6':'Star','\u22C7':'divonx','\u22C8':'bowtie','\u22C9':'ltimes','\u22CA':'rtimes','\u22CB':'lthree','\u22CC':'rthree','\u22CD':'bsime','\u22CE':'cuvee','\u22CF':'cuwed','\u22D0':'Sub','\u22D1':'Sup','\u22D2':'Cap','\u22D3':'Cup','\u22D4':'fork','\u22D5':'epar','\u22D6':'ltdot','\u22D7':'gtdot','\u22D8':'Ll','\u22D8\u0338':'nLl','\u22D9':'Gg','\u22D9\u0338':'nGg','\u22DA\uFE00':'lesg','\u22DA':'leg','\u22DB':'gel','\u22DB\uFE00':'gesl','\u22DE':'cuepr','\u22DF':'cuesc','\u22E6':'lnsim','\u22E7':'gnsim','\u22E8':'prnsim','\u22E9':'scnsim','\u22EE':'vellip','\u22EF':'ctdot','\u22F0':'utdot','\u22F1':'dtdot','\u22F2':'disin','\u22F3':'isinsv','\u22F4':'isins','\u22F5':'isindot','\u22F5\u0338':'notindot','\u22F6':'notinvc','\u22F7':'notinvb','\u22F9':'isinE','\u22F9\u0338':'notinE','\u22FA':'nisd','\u22FB':'xnis','\u22FC':'nis','\u22FD':'notnivc','\u22FE':'notnivb','\u2305':'barwed','\u2306':'Barwed','\u230C':'drcrop','\u230D':'dlcrop','\u230E':'urcrop','\u230F':'ulcrop','\u2310':'bnot','\u2312':'profline','\u2313':'profsurf','\u2315':'telrec','\u2316':'target','\u231C':'ulcorn','\u231D':'urcorn','\u231E':'dlcorn','\u231F':'drcorn','\u2322':'frown','\u2323':'smile','\u232D':'cylcty','\u232E':'profalar','\u2336':'topbot','\u233D':'ovbar','\u233F':'solbar','\u237C':'angzarr','\u23B0':'lmoust','\u23B1':'rmoust','\u23B4':'tbrk','\u23B5':'bbrk','\u23B6':'bbrktbrk','\u23DC':'OverParenthesis','\u23DD':'UnderParenthesis','\u23DE':'OverBrace','\u23DF':'UnderBrace','\u23E2':'trpezium','\u23E7':'elinters','\u2423':'blank','\u2500':'boxh','\u2502':'boxv','\u250C':'boxdr','\u2510':'boxdl','\u2514':'boxur','\u2518':'boxul','\u251C':'boxvr','\u2524':'boxvl','\u252C':'boxhd','\u2534':'boxhu','\u253C':'boxvh','\u2550':'boxH','\u2551':'boxV','\u2552':'boxdR','\u2553':'boxDr','\u2554':'boxDR','\u2555':'boxdL','\u2556':'boxDl','\u2557':'boxDL','\u2558':'boxuR','\u2559':'boxUr','\u255A':'boxUR','\u255B':'boxuL','\u255C':'boxUl','\u255D':'boxUL','\u255E':'boxvR','\u255F':'boxVr','\u2560':'boxVR','\u2561':'boxvL','\u2562':'boxVl','\u2563':'boxVL','\u2564':'boxHd','\u2565':'boxhD','\u2566':'boxHD','\u2567':'boxHu','\u2568':'boxhU','\u2569':'boxHU','\u256A':'boxvH','\u256B':'boxVh','\u256C':'boxVH','\u2580':'uhblk','\u2584':'lhblk','\u2588':'block','\u2591':'blk14','\u2592':'blk12','\u2593':'blk34','\u25A1':'squ','\u25AA':'squf','\u25AB':'EmptyVerySmallSquare','\u25AD':'rect','\u25AE':'marker','\u25B1':'fltns','\u25B3':'xutri','\u25B4':'utrif','\u25B5':'utri','\u25B8':'rtrif','\u25B9':'rtri','\u25BD':'xdtri','\u25BE':'dtrif','\u25BF':'dtri','\u25C2':'ltrif','\u25C3':'ltri','\u25CA':'loz','\u25CB':'cir','\u25EC':'tridot','\u25EF':'xcirc','\u25F8':'ultri','\u25F9':'urtri','\u25FA':'lltri','\u25FB':'EmptySmallSquare','\u25FC':'FilledSmallSquare','\u2605':'starf','\u2606':'star','\u260E':'phone','\u2640':'female','\u2642':'male','\u2660':'spades','\u2663':'clubs','\u2665':'hearts','\u2666':'diams','\u266A':'sung','\u2713':'check','\u2717':'cross','\u2720':'malt','\u2736':'sext','\u2758':'VerticalSeparator','\u27C8':'bsolhsub','\u27C9':'suphsol','\u27F5':'xlarr','\u27F6':'xrarr','\u27F7':'xharr','\u27F8':'xlArr','\u27F9':'xrArr','\u27FA':'xhArr','\u27FC':'xmap','\u27FF':'dzigrarr','\u2902':'nvlArr','\u2903':'nvrArr','\u2904':'nvHarr','\u2905':'Map','\u290C':'lbarr','\u290D':'rbarr','\u290E':'lBarr','\u290F':'rBarr','\u2910':'RBarr','\u2911':'DDotrahd','\u2912':'UpArrowBar','\u2913':'DownArrowBar','\u2916':'Rarrtl','\u2919':'latail','\u291A':'ratail','\u291B':'lAtail','\u291C':'rAtail','\u291D':'larrfs','\u291E':'rarrfs','\u291F':'larrbfs','\u2920':'rarrbfs','\u2923':'nwarhk','\u2924':'nearhk','\u2925':'searhk','\u2926':'swarhk','\u2927':'nwnear','\u2928':'toea','\u2929':'tosa','\u292A':'swnwar','\u2933':'rarrc','\u2933\u0338':'nrarrc','\u2935':'cudarrr','\u2936':'ldca','\u2937':'rdca','\u2938':'cudarrl','\u2939':'larrpl','\u293C':'curarrm','\u293D':'cularrp','\u2945':'rarrpl','\u2948':'harrcir','\u2949':'Uarrocir','\u294A':'lurdshar','\u294B':'ldrushar','\u294E':'LeftRightVector','\u294F':'RightUpDownVector','\u2950':'DownLeftRightVector','\u2951':'LeftUpDownVector','\u2952':'LeftVectorBar','\u2953':'RightVectorBar','\u2954':'RightUpVectorBar','\u2955':'RightDownVectorBar','\u2956':'DownLeftVectorBar','\u2957':'DownRightVectorBar','\u2958':'LeftUpVectorBar','\u2959':'LeftDownVectorBar','\u295A':'LeftTeeVector','\u295B':'RightTeeVector','\u295C':'RightUpTeeVector','\u295D':'RightDownTeeVector','\u295E':'DownLeftTeeVector','\u295F':'DownRightTeeVector','\u2960':'LeftUpTeeVector','\u2961':'LeftDownTeeVector','\u2962':'lHar','\u2963':'uHar','\u2964':'rHar','\u2965':'dHar','\u2966':'luruhar','\u2967':'ldrdhar','\u2968':'ruluhar','\u2969':'rdldhar','\u296A':'lharul','\u296B':'llhard','\u296C':'rharul','\u296D':'lrhard','\u296E':'udhar','\u296F':'duhar','\u2970':'RoundImplies','\u2971':'erarr','\u2972':'simrarr','\u2973':'larrsim','\u2974':'rarrsim','\u2975':'rarrap','\u2976':'ltlarr','\u2978':'gtrarr','\u2979':'subrarr','\u297B':'suplarr','\u297C':'lfisht','\u297D':'rfisht','\u297E':'ufisht','\u297F':'dfisht','\u299A':'vzigzag','\u299C':'vangrt','\u299D':'angrtvbd','\u29A4':'ange','\u29A5':'range','\u29A6':'dwangle','\u29A7':'uwangle','\u29A8':'angmsdaa','\u29A9':'angmsdab','\u29AA':'angmsdac','\u29AB':'angmsdad','\u29AC':'angmsdae','\u29AD':'angmsdaf','\u29AE':'angmsdag','\u29AF':'angmsdah','\u29B0':'bemptyv','\u29B1':'demptyv','\u29B2':'cemptyv','\u29B3':'raemptyv','\u29B4':'laemptyv','\u29B5':'ohbar','\u29B6':'omid','\u29B7':'opar','\u29B9':'operp','\u29BB':'olcross','\u29BC':'odsold','\u29BE':'olcir','\u29BF':'ofcir','\u29C0':'olt','\u29C1':'ogt','\u29C2':'cirscir','\u29C3':'cirE','\u29C4':'solb','\u29C5':'bsolb','\u29C9':'boxbox','\u29CD':'trisb','\u29CE':'rtriltri','\u29CF':'LeftTriangleBar','\u29CF\u0338':'NotLeftTriangleBar','\u29D0':'RightTriangleBar','\u29D0\u0338':'NotRightTriangleBar','\u29DC':'iinfin','\u29DD':'infintie','\u29DE':'nvinfin','\u29E3':'eparsl','\u29E4':'smeparsl','\u29E5':'eqvparsl','\u29EB':'lozf','\u29F4':'RuleDelayed','\u29F6':'dsol','\u2A00':'xodot','\u2A01':'xoplus','\u2A02':'xotime','\u2A04':'xuplus','\u2A06':'xsqcup','\u2A0D':'fpartint','\u2A10':'cirfnint','\u2A11':'awint','\u2A12':'rppolint','\u2A13':'scpolint','\u2A14':'npolint','\u2A15':'pointint','\u2A16':'quatint','\u2A17':'intlarhk','\u2A22':'pluscir','\u2A23':'plusacir','\u2A24':'simplus','\u2A25':'plusdu','\u2A26':'plussim','\u2A27':'plustwo','\u2A29':'mcomma','\u2A2A':'minusdu','\u2A2D':'loplus','\u2A2E':'roplus','\u2A2F':'Cross','\u2A30':'timesd','\u2A31':'timesbar','\u2A33':'smashp','\u2A34':'lotimes','\u2A35':'rotimes','\u2A36':'otimesas','\u2A37':'Otimes','\u2A38':'odiv','\u2A39':'triplus','\u2A3A':'triminus','\u2A3B':'tritime','\u2A3C':'iprod','\u2A3F':'amalg','\u2A40':'capdot','\u2A42':'ncup','\u2A43':'ncap','\u2A44':'capand','\u2A45':'cupor','\u2A46':'cupcap','\u2A47':'capcup','\u2A48':'cupbrcap','\u2A49':'capbrcup','\u2A4A':'cupcup','\u2A4B':'capcap','\u2A4C':'ccups','\u2A4D':'ccaps','\u2A50':'ccupssm','\u2A53':'And','\u2A54':'Or','\u2A55':'andand','\u2A56':'oror','\u2A57':'orslope','\u2A58':'andslope','\u2A5A':'andv','\u2A5B':'orv','\u2A5C':'andd','\u2A5D':'ord','\u2A5F':'wedbar','\u2A66':'sdote','\u2A6A':'simdot','\u2A6D':'congdot','\u2A6D\u0338':'ncongdot','\u2A6E':'easter','\u2A6F':'apacir','\u2A70':'apE','\u2A70\u0338':'napE','\u2A71':'eplus','\u2A72':'pluse','\u2A73':'Esim','\u2A77':'eDDot','\u2A78':'equivDD','\u2A79':'ltcir','\u2A7A':'gtcir','\u2A7B':'ltquest','\u2A7C':'gtquest','\u2A7D':'les','\u2A7D\u0338':'nles','\u2A7E':'ges','\u2A7E\u0338':'nges','\u2A7F':'lesdot','\u2A80':'gesdot','\u2A81':'lesdoto','\u2A82':'gesdoto','\u2A83':'lesdotor','\u2A84':'gesdotol','\u2A85':'lap','\u2A86':'gap','\u2A87':'lne','\u2A88':'gne','\u2A89':'lnap','\u2A8A':'gnap','\u2A8B':'lEg','\u2A8C':'gEl','\u2A8D':'lsime','\u2A8E':'gsime','\u2A8F':'lsimg','\u2A90':'gsiml','\u2A91':'lgE','\u2A92':'glE','\u2A93':'lesges','\u2A94':'gesles','\u2A95':'els','\u2A96':'egs','\u2A97':'elsdot','\u2A98':'egsdot','\u2A99':'el','\u2A9A':'eg','\u2A9D':'siml','\u2A9E':'simg','\u2A9F':'simlE','\u2AA0':'simgE','\u2AA1':'LessLess','\u2AA1\u0338':'NotNestedLessLess','\u2AA2':'GreaterGreater','\u2AA2\u0338':'NotNestedGreaterGreater','\u2AA4':'glj','\u2AA5':'gla','\u2AA6':'ltcc','\u2AA7':'gtcc','\u2AA8':'lescc','\u2AA9':'gescc','\u2AAA':'smt','\u2AAB':'lat','\u2AAC':'smte','\u2AAC\uFE00':'smtes','\u2AAD':'late','\u2AAD\uFE00':'lates','\u2AAE':'bumpE','\u2AAF':'pre','\u2AAF\u0338':'npre','\u2AB0':'sce','\u2AB0\u0338':'nsce','\u2AB3':'prE','\u2AB4':'scE','\u2AB5':'prnE','\u2AB6':'scnE','\u2AB7':'prap','\u2AB8':'scap','\u2AB9':'prnap','\u2ABA':'scnap','\u2ABB':'Pr','\u2ABC':'Sc','\u2ABD':'subdot','\u2ABE':'supdot','\u2ABF':'subplus','\u2AC0':'supplus','\u2AC1':'submult','\u2AC2':'supmult','\u2AC3':'subedot','\u2AC4':'supedot','\u2AC5':'subE','\u2AC5\u0338':'nsubE','\u2AC6':'supE','\u2AC6\u0338':'nsupE','\u2AC7':'subsim','\u2AC8':'supsim','\u2ACB\uFE00':'vsubnE','\u2ACB':'subnE','\u2ACC\uFE00':'vsupnE','\u2ACC':'supnE','\u2ACF':'csub','\u2AD0':'csup','\u2AD1':'csube','\u2AD2':'csupe','\u2AD3':'subsup','\u2AD4':'supsub','\u2AD5':'subsub','\u2AD6':'supsup','\u2AD7':'suphsub','\u2AD8':'supdsub','\u2AD9':'forkv','\u2ADA':'topfork','\u2ADB':'mlcp','\u2AE4':'Dashv','\u2AE6':'Vdashl','\u2AE7':'Barv','\u2AE8':'vBar','\u2AE9':'vBarv','\u2AEB':'Vbar','\u2AEC':'Not','\u2AED':'bNot','\u2AEE':'rnmid','\u2AEF':'cirmid','\u2AF0':'midcir','\u2AF1':'topcir','\u2AF2':'nhpar','\u2AF3':'parsim','\u2AFD':'parsl','\u2AFD\u20E5':'nparsl','\u266D':'flat','\u266E':'natur','\u266F':'sharp','\xA4':'curren','\xA2':'cent','$':'dollar','\xA3':'pound','\xA5':'yen','\u20AC':'euro','\xB9':'sup1','\xBD':'half','\u2153':'frac13','\xBC':'frac14','\u2155':'frac15','\u2159':'frac16','\u215B':'frac18','\xB2':'sup2','\u2154':'frac23','\u2156':'frac25','\xB3':'sup3','\xBE':'frac34','\u2157':'frac35','\u215C':'frac38','\u2158':'frac45','\u215A':'frac56','\u215D':'frac58','\u215E':'frac78','\uD835\uDCB6':'ascr','\uD835\uDD52':'aopf','\uD835\uDD1E':'afr','\uD835\uDD38':'Aopf','\uD835\uDD04':'Afr','\uD835\uDC9C':'Ascr','\xAA':'ordf','\xE1':'aacute','\xC1':'Aacute','\xE0':'agrave','\xC0':'Agrave','\u0103':'abreve','\u0102':'Abreve','\xE2':'acirc','\xC2':'Acirc','\xE5':'aring','\xC5':'angst','\xE4':'auml','\xC4':'Auml','\xE3':'atilde','\xC3':'Atilde','\u0105':'aogon','\u0104':'Aogon','\u0101':'amacr','\u0100':'Amacr','\xE6':'aelig','\xC6':'AElig','\uD835\uDCB7':'bscr','\uD835\uDD53':'bopf','\uD835\uDD1F':'bfr','\uD835\uDD39':'Bopf','\u212C':'Bscr','\uD835\uDD05':'Bfr','\uD835\uDD20':'cfr','\uD835\uDCB8':'cscr','\uD835\uDD54':'copf','\u212D':'Cfr','\uD835\uDC9E':'Cscr','\u2102':'Copf','\u0107':'cacute','\u0106':'Cacute','\u0109':'ccirc','\u0108':'Ccirc','\u010D':'ccaron','\u010C':'Ccaron','\u010B':'cdot','\u010A':'Cdot','\xE7':'ccedil','\xC7':'Ccedil','\u2105':'incare','\uD835\uDD21':'dfr','\u2146':'dd','\uD835\uDD55':'dopf','\uD835\uDCB9':'dscr','\uD835\uDC9F':'Dscr','\uD835\uDD07':'Dfr','\u2145':'DD','\uD835\uDD3B':'Dopf','\u010F':'dcaron','\u010E':'Dcaron','\u0111':'dstrok','\u0110':'Dstrok','\xF0':'eth','\xD0':'ETH','\u2147':'ee','\u212F':'escr','\uD835\uDD22':'efr','\uD835\uDD56':'eopf','\u2130':'Escr','\uD835\uDD08':'Efr','\uD835\uDD3C':'Eopf','\xE9':'eacute','\xC9':'Eacute','\xE8':'egrave','\xC8':'Egrave','\xEA':'ecirc','\xCA':'Ecirc','\u011B':'ecaron','\u011A':'Ecaron','\xEB':'euml','\xCB':'Euml','\u0117':'edot','\u0116':'Edot','\u0119':'eogon','\u0118':'Eogon','\u0113':'emacr','\u0112':'Emacr','\uD835\uDD23':'ffr','\uD835\uDD57':'fopf','\uD835\uDCBB':'fscr','\uD835\uDD09':'Ffr','\uD835\uDD3D':'Fopf','\u2131':'Fscr','\uFB00':'fflig','\uFB03':'ffilig','\uFB04':'ffllig','\uFB01':'filig','fj':'fjlig','\uFB02':'fllig','\u0192':'fnof','\u210A':'gscr','\uD835\uDD58':'gopf','\uD835\uDD24':'gfr','\uD835\uDCA2':'Gscr','\uD835\uDD3E':'Gopf','\uD835\uDD0A':'Gfr','\u01F5':'gacute','\u011F':'gbreve','\u011E':'Gbreve','\u011D':'gcirc','\u011C':'Gcirc','\u0121':'gdot','\u0120':'Gdot','\u0122':'Gcedil','\uD835\uDD25':'hfr','\u210E':'planckh','\uD835\uDCBD':'hscr','\uD835\uDD59':'hopf','\u210B':'Hscr','\u210C':'Hfr','\u210D':'Hopf','\u0125':'hcirc','\u0124':'Hcirc','\u210F':'hbar','\u0127':'hstrok','\u0126':'Hstrok','\uD835\uDD5A':'iopf','\uD835\uDD26':'ifr','\uD835\uDCBE':'iscr','\u2148':'ii','\uD835\uDD40':'Iopf','\u2110':'Iscr','\u2111':'Im','\xED':'iacute','\xCD':'Iacute','\xEC':'igrave','\xCC':'Igrave','\xEE':'icirc','\xCE':'Icirc','\xEF':'iuml','\xCF':'Iuml','\u0129':'itilde','\u0128':'Itilde','\u0130':'Idot','\u012F':'iogon','\u012E':'Iogon','\u012B':'imacr','\u012A':'Imacr','\u0133':'ijlig','\u0132':'IJlig','\u0131':'imath','\uD835\uDCBF':'jscr','\uD835\uDD5B':'jopf','\uD835\uDD27':'jfr','\uD835\uDCA5':'Jscr','\uD835\uDD0D':'Jfr','\uD835\uDD41':'Jopf','\u0135':'jcirc','\u0134':'Jcirc','\u0237':'jmath','\uD835\uDD5C':'kopf','\uD835\uDCC0':'kscr','\uD835\uDD28':'kfr','\uD835\uDCA6':'Kscr','\uD835\uDD42':'Kopf','\uD835\uDD0E':'Kfr','\u0137':'kcedil','\u0136':'Kcedil','\uD835\uDD29':'lfr','\uD835\uDCC1':'lscr','\u2113':'ell','\uD835\uDD5D':'lopf','\u2112':'Lscr','\uD835\uDD0F':'Lfr','\uD835\uDD43':'Lopf','\u013A':'lacute','\u0139':'Lacute','\u013E':'lcaron','\u013D':'Lcaron','\u013C':'lcedil','\u013B':'Lcedil','\u0142':'lstrok','\u0141':'Lstrok','\u0140':'lmidot','\u013F':'Lmidot','\uD835\uDD2A':'mfr','\uD835\uDD5E':'mopf','\uD835\uDCC2':'mscr','\uD835\uDD10':'Mfr','\uD835\uDD44':'Mopf','\u2133':'Mscr','\uD835\uDD2B':'nfr','\uD835\uDD5F':'nopf','\uD835\uDCC3':'nscr','\u2115':'Nopf','\uD835\uDCA9':'Nscr','\uD835\uDD11':'Nfr','\u0144':'nacute','\u0143':'Nacute','\u0148':'ncaron','\u0147':'Ncaron','\xF1':'ntilde','\xD1':'Ntilde','\u0146':'ncedil','\u0145':'Ncedil','\u2116':'numero','\u014B':'eng','\u014A':'ENG','\uD835\uDD60':'oopf','\uD835\uDD2C':'ofr','\u2134':'oscr','\uD835\uDCAA':'Oscr','\uD835\uDD12':'Ofr','\uD835\uDD46':'Oopf','\xBA':'ordm','\xF3':'oacute','\xD3':'Oacute','\xF2':'ograve','\xD2':'Ograve','\xF4':'ocirc','\xD4':'Ocirc','\xF6':'ouml','\xD6':'Ouml','\u0151':'odblac','\u0150':'Odblac','\xF5':'otilde','\xD5':'Otilde','\xF8':'oslash','\xD8':'Oslash','\u014D':'omacr','\u014C':'Omacr','\u0153':'oelig','\u0152':'OElig','\uD835\uDD2D':'pfr','\uD835\uDCC5':'pscr','\uD835\uDD61':'popf','\u2119':'Popf','\uD835\uDD13':'Pfr','\uD835\uDCAB':'Pscr','\uD835\uDD62':'qopf','\uD835\uDD2E':'qfr','\uD835\uDCC6':'qscr','\uD835\uDCAC':'Qscr','\uD835\uDD14':'Qfr','\u211A':'Qopf','\u0138':'kgreen','\uD835\uDD2F':'rfr','\uD835\uDD63':'ropf','\uD835\uDCC7':'rscr','\u211B':'Rscr','\u211C':'Re','\u211D':'Ropf','\u0155':'racute','\u0154':'Racute','\u0159':'rcaron','\u0158':'Rcaron','\u0157':'rcedil','\u0156':'Rcedil','\uD835\uDD64':'sopf','\uD835\uDCC8':'sscr','\uD835\uDD30':'sfr','\uD835\uDD4A':'Sopf','\uD835\uDD16':'Sfr','\uD835\uDCAE':'Sscr','\u24C8':'oS','\u015B':'sacute','\u015A':'Sacute','\u015D':'scirc','\u015C':'Scirc','\u0161':'scaron','\u0160':'Scaron','\u015F':'scedil','\u015E':'Scedil','\xDF':'szlig','\uD835\uDD31':'tfr','\uD835\uDCC9':'tscr','\uD835\uDD65':'topf','\uD835\uDCAF':'Tscr','\uD835\uDD17':'Tfr','\uD835\uDD4B':'Topf','\u0165':'tcaron','\u0164':'Tcaron','\u0163':'tcedil','\u0162':'Tcedil','\u2122':'trade','\u0167':'tstrok','\u0166':'Tstrok','\uD835\uDCCA':'uscr','\uD835\uDD66':'uopf','\uD835\uDD32':'ufr','\uD835\uDD4C':'Uopf','\uD835\uDD18':'Ufr','\uD835\uDCB0':'Uscr','\xFA':'uacute','\xDA':'Uacute','\xF9':'ugrave','\xD9':'Ugrave','\u016D':'ubreve','\u016C':'Ubreve','\xFB':'ucirc','\xDB':'Ucirc','\u016F':'uring','\u016E':'Uring','\xFC':'uuml','\xDC':'Uuml','\u0171':'udblac','\u0170':'Udblac','\u0169':'utilde','\u0168':'Utilde','\u0173':'uogon','\u0172':'Uogon','\u016B':'umacr','\u016A':'Umacr','\uD835\uDD33':'vfr','\uD835\uDD67':'vopf','\uD835\uDCCB':'vscr','\uD835\uDD19':'Vfr','\uD835\uDD4D':'Vopf','\uD835\uDCB1':'Vscr','\uD835\uDD68':'wopf','\uD835\uDCCC':'wscr','\uD835\uDD34':'wfr','\uD835\uDCB2':'Wscr','\uD835\uDD4E':'Wopf','\uD835\uDD1A':'Wfr','\u0175':'wcirc','\u0174':'Wcirc','\uD835\uDD35':'xfr','\uD835\uDCCD':'xscr','\uD835\uDD69':'xopf','\uD835\uDD4F':'Xopf','\uD835\uDD1B':'Xfr','\uD835\uDCB3':'Xscr','\uD835\uDD36':'yfr','\uD835\uDCCE':'yscr','\uD835\uDD6A':'yopf','\uD835\uDCB4':'Yscr','\uD835\uDD1C':'Yfr','\uD835\uDD50':'Yopf','\xFD':'yacute','\xDD':'Yacute','\u0177':'ycirc','\u0176':'Ycirc','\xFF':'yuml','\u0178':'Yuml','\uD835\uDCCF':'zscr','\uD835\uDD37':'zfr','\uD835\uDD6B':'zopf','\u2128':'Zfr','\u2124':'Zopf','\uD835\uDCB5':'Zscr','\u017A':'zacute','\u0179':'Zacute','\u017E':'zcaron','\u017D':'Zcaron','\u017C':'zdot','\u017B':'Zdot','\u01B5':'imped','\xFE':'thorn','\xDE':'THORN','\u0149':'napos','\u03B1':'alpha','\u0391':'Alpha','\u03B2':'beta','\u0392':'Beta','\u03B3':'gamma','\u0393':'Gamma','\u03B4':'delta','\u0394':'Delta','\u03B5':'epsi','\u03F5':'epsiv','\u0395':'Epsilon','\u03DD':'gammad','\u03DC':'Gammad','\u03B6':'zeta','\u0396':'Zeta','\u03B7':'eta','\u0397':'Eta','\u03B8':'theta','\u03D1':'thetav','\u0398':'Theta','\u03B9':'iota','\u0399':'Iota','\u03BA':'kappa','\u03F0':'kappav','\u039A':'Kappa','\u03BB':'lambda','\u039B':'Lambda','\u03BC':'mu','\xB5':'micro','\u039C':'Mu','\u03BD':'nu','\u039D':'Nu','\u03BE':'xi','\u039E':'Xi','\u03BF':'omicron','\u039F':'Omicron','\u03C0':'pi','\u03D6':'piv','\u03A0':'Pi','\u03C1':'rho','\u03F1':'rhov','\u03A1':'Rho','\u03C3':'sigma','\u03A3':'Sigma','\u03C2':'sigmaf','\u03C4':'tau','\u03A4':'Tau','\u03C5':'upsi','\u03A5':'Upsilon','\u03D2':'Upsi','\u03C6':'phi','\u03D5':'phiv','\u03A6':'Phi','\u03C7':'chi','\u03A7':'Chi','\u03C8':'psi','\u03A8':'Psi','\u03C9':'omega','\u03A9':'ohm','\u0430':'acy','\u0410':'Acy','\u0431':'bcy','\u0411':'Bcy','\u0432':'vcy','\u0412':'Vcy','\u0433':'gcy','\u0413':'Gcy','\u0453':'gjcy','\u0403':'GJcy','\u0434':'dcy','\u0414':'Dcy','\u0452':'djcy','\u0402':'DJcy','\u0435':'iecy','\u0415':'IEcy','\u0451':'iocy','\u0401':'IOcy','\u0454':'jukcy','\u0404':'Jukcy','\u0436':'zhcy','\u0416':'ZHcy','\u0437':'zcy','\u0417':'Zcy','\u0455':'dscy','\u0405':'DScy','\u0438':'icy','\u0418':'Icy','\u0456':'iukcy','\u0406':'Iukcy','\u0457':'yicy','\u0407':'YIcy','\u0439':'jcy','\u0419':'Jcy','\u0458':'jsercy','\u0408':'Jsercy','\u043A':'kcy','\u041A':'Kcy','\u045C':'kjcy','\u040C':'KJcy','\u043B':'lcy','\u041B':'Lcy','\u0459':'ljcy','\u0409':'LJcy','\u043C':'mcy','\u041C':'Mcy','\u043D':'ncy','\u041D':'Ncy','\u045A':'njcy','\u040A':'NJcy','\u043E':'ocy','\u041E':'Ocy','\u043F':'pcy','\u041F':'Pcy','\u0440':'rcy','\u0420':'Rcy','\u0441':'scy','\u0421':'Scy','\u0442':'tcy','\u0422':'Tcy','\u045B':'tshcy','\u040B':'TSHcy','\u0443':'ucy','\u0423':'Ucy','\u045E':'ubrcy','\u040E':'Ubrcy','\u0444':'fcy','\u0424':'Fcy','\u0445':'khcy','\u0425':'KHcy','\u0446':'tscy','\u0426':'TScy','\u0447':'chcy','\u0427':'CHcy','\u045F':'dzcy','\u040F':'DZcy','\u0448':'shcy','\u0428':'SHcy','\u0449':'shchcy','\u0429':'SHCHcy','\u044A':'hardcy','\u042A':'HARDcy','\u044B':'ycy','\u042B':'Ycy','\u044C':'softcy','\u042C':'SOFTcy','\u044D':'ecy','\u042D':'Ecy','\u044E':'yucy','\u042E':'YUcy','\u044F':'yacy','\u042F':'YAcy','\u2135':'aleph','\u2136':'beth','\u2137':'gimel','\u2138':'daleth'};

	var regexEscape = /["&'<>`]/g;
	var escapeMap = {
		'"': '&quot;',
		'&': '&amp;',
		'\'': '&#x27;',
		'<': '&lt;',
		// See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
		// following is not strictly necessary unless it’s part of a tag or an
		// unquoted attribute value. We’re only escaping it to support those
		// situations, and for XML support.
		'>': '&gt;',
		// In Internet Explorer ≤ 8, the backtick character can be used
		// to break out of (un)quoted attribute values or HTML comments.
		// See http://html5sec.org/#102, http://html5sec.org/#108, and
		// http://html5sec.org/#133.
		'`': '&#x60;'
	};

	var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
	var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;
	var decodeMap = {'aacute':'\xE1','Aacute':'\xC1','abreve':'\u0103','Abreve':'\u0102','ac':'\u223E','acd':'\u223F','acE':'\u223E\u0333','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','acy':'\u0430','Acy':'\u0410','aelig':'\xE6','AElig':'\xC6','af':'\u2061','afr':'\uD835\uDD1E','Afr':'\uD835\uDD04','agrave':'\xE0','Agrave':'\xC0','alefsym':'\u2135','aleph':'\u2135','alpha':'\u03B1','Alpha':'\u0391','amacr':'\u0101','Amacr':'\u0100','amalg':'\u2A3F','amp':'&','AMP':'&','and':'\u2227','And':'\u2A53','andand':'\u2A55','andd':'\u2A5C','andslope':'\u2A58','andv':'\u2A5A','ang':'\u2220','ange':'\u29A4','angle':'\u2220','angmsd':'\u2221','angmsdaa':'\u29A8','angmsdab':'\u29A9','angmsdac':'\u29AA','angmsdad':'\u29AB','angmsdae':'\u29AC','angmsdaf':'\u29AD','angmsdag':'\u29AE','angmsdah':'\u29AF','angrt':'\u221F','angrtvb':'\u22BE','angrtvbd':'\u299D','angsph':'\u2222','angst':'\xC5','angzarr':'\u237C','aogon':'\u0105','Aogon':'\u0104','aopf':'\uD835\uDD52','Aopf':'\uD835\uDD38','ap':'\u2248','apacir':'\u2A6F','ape':'\u224A','apE':'\u2A70','apid':'\u224B','apos':'\'','ApplyFunction':'\u2061','approx':'\u2248','approxeq':'\u224A','aring':'\xE5','Aring':'\xC5','ascr':'\uD835\uDCB6','Ascr':'\uD835\uDC9C','Assign':'\u2254','ast':'*','asymp':'\u2248','asympeq':'\u224D','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','awconint':'\u2233','awint':'\u2A11','backcong':'\u224C','backepsilon':'\u03F6','backprime':'\u2035','backsim':'\u223D','backsimeq':'\u22CD','Backslash':'\u2216','Barv':'\u2AE7','barvee':'\u22BD','barwed':'\u2305','Barwed':'\u2306','barwedge':'\u2305','bbrk':'\u23B5','bbrktbrk':'\u23B6','bcong':'\u224C','bcy':'\u0431','Bcy':'\u0411','bdquo':'\u201E','becaus':'\u2235','because':'\u2235','Because':'\u2235','bemptyv':'\u29B0','bepsi':'\u03F6','bernou':'\u212C','Bernoullis':'\u212C','beta':'\u03B2','Beta':'\u0392','beth':'\u2136','between':'\u226C','bfr':'\uD835\uDD1F','Bfr':'\uD835\uDD05','bigcap':'\u22C2','bigcirc':'\u25EF','bigcup':'\u22C3','bigodot':'\u2A00','bigoplus':'\u2A01','bigotimes':'\u2A02','bigsqcup':'\u2A06','bigstar':'\u2605','bigtriangledown':'\u25BD','bigtriangleup':'\u25B3','biguplus':'\u2A04','bigvee':'\u22C1','bigwedge':'\u22C0','bkarow':'\u290D','blacklozenge':'\u29EB','blacksquare':'\u25AA','blacktriangle':'\u25B4','blacktriangledown':'\u25BE','blacktriangleleft':'\u25C2','blacktriangleright':'\u25B8','blank':'\u2423','blk12':'\u2592','blk14':'\u2591','blk34':'\u2593','block':'\u2588','bne':'=\u20E5','bnequiv':'\u2261\u20E5','bnot':'\u2310','bNot':'\u2AED','bopf':'\uD835\uDD53','Bopf':'\uD835\uDD39','bot':'\u22A5','bottom':'\u22A5','bowtie':'\u22C8','boxbox':'\u29C9','boxdl':'\u2510','boxdL':'\u2555','boxDl':'\u2556','boxDL':'\u2557','boxdr':'\u250C','boxdR':'\u2552','boxDr':'\u2553','boxDR':'\u2554','boxh':'\u2500','boxH':'\u2550','boxhd':'\u252C','boxhD':'\u2565','boxHd':'\u2564','boxHD':'\u2566','boxhu':'\u2534','boxhU':'\u2568','boxHu':'\u2567','boxHU':'\u2569','boxminus':'\u229F','boxplus':'\u229E','boxtimes':'\u22A0','boxul':'\u2518','boxuL':'\u255B','boxUl':'\u255C','boxUL':'\u255D','boxur':'\u2514','boxuR':'\u2558','boxUr':'\u2559','boxUR':'\u255A','boxv':'\u2502','boxV':'\u2551','boxvh':'\u253C','boxvH':'\u256A','boxVh':'\u256B','boxVH':'\u256C','boxvl':'\u2524','boxvL':'\u2561','boxVl':'\u2562','boxVL':'\u2563','boxvr':'\u251C','boxvR':'\u255E','boxVr':'\u255F','boxVR':'\u2560','bprime':'\u2035','breve':'\u02D8','Breve':'\u02D8','brvbar':'\xA6','bscr':'\uD835\uDCB7','Bscr':'\u212C','bsemi':'\u204F','bsim':'\u223D','bsime':'\u22CD','bsol':'\\','bsolb':'\u29C5','bsolhsub':'\u27C8','bull':'\u2022','bullet':'\u2022','bump':'\u224E','bumpe':'\u224F','bumpE':'\u2AAE','bumpeq':'\u224F','Bumpeq':'\u224E','cacute':'\u0107','Cacute':'\u0106','cap':'\u2229','Cap':'\u22D2','capand':'\u2A44','capbrcup':'\u2A49','capcap':'\u2A4B','capcup':'\u2A47','capdot':'\u2A40','CapitalDifferentialD':'\u2145','caps':'\u2229\uFE00','caret':'\u2041','caron':'\u02C7','Cayleys':'\u212D','ccaps':'\u2A4D','ccaron':'\u010D','Ccaron':'\u010C','ccedil':'\xE7','Ccedil':'\xC7','ccirc':'\u0109','Ccirc':'\u0108','Cconint':'\u2230','ccups':'\u2A4C','ccupssm':'\u2A50','cdot':'\u010B','Cdot':'\u010A','cedil':'\xB8','Cedilla':'\xB8','cemptyv':'\u29B2','cent':'\xA2','centerdot':'\xB7','CenterDot':'\xB7','cfr':'\uD835\uDD20','Cfr':'\u212D','chcy':'\u0447','CHcy':'\u0427','check':'\u2713','checkmark':'\u2713','chi':'\u03C7','Chi':'\u03A7','cir':'\u25CB','circ':'\u02C6','circeq':'\u2257','circlearrowleft':'\u21BA','circlearrowright':'\u21BB','circledast':'\u229B','circledcirc':'\u229A','circleddash':'\u229D','CircleDot':'\u2299','circledR':'\xAE','circledS':'\u24C8','CircleMinus':'\u2296','CirclePlus':'\u2295','CircleTimes':'\u2297','cire':'\u2257','cirE':'\u29C3','cirfnint':'\u2A10','cirmid':'\u2AEF','cirscir':'\u29C2','ClockwiseContourIntegral':'\u2232','CloseCurlyDoubleQuote':'\u201D','CloseCurlyQuote':'\u2019','clubs':'\u2663','clubsuit':'\u2663','colon':':','Colon':'\u2237','colone':'\u2254','Colone':'\u2A74','coloneq':'\u2254','comma':',','commat':'@','comp':'\u2201','compfn':'\u2218','complement':'\u2201','complexes':'\u2102','cong':'\u2245','congdot':'\u2A6D','Congruent':'\u2261','conint':'\u222E','Conint':'\u222F','ContourIntegral':'\u222E','copf':'\uD835\uDD54','Copf':'\u2102','coprod':'\u2210','Coproduct':'\u2210','copy':'\xA9','COPY':'\xA9','copysr':'\u2117','CounterClockwiseContourIntegral':'\u2233','crarr':'\u21B5','cross':'\u2717','Cross':'\u2A2F','cscr':'\uD835\uDCB8','Cscr':'\uD835\uDC9E','csub':'\u2ACF','csube':'\u2AD1','csup':'\u2AD0','csupe':'\u2AD2','ctdot':'\u22EF','cudarrl':'\u2938','cudarrr':'\u2935','cuepr':'\u22DE','cuesc':'\u22DF','cularr':'\u21B6','cularrp':'\u293D','cup':'\u222A','Cup':'\u22D3','cupbrcap':'\u2A48','cupcap':'\u2A46','CupCap':'\u224D','cupcup':'\u2A4A','cupdot':'\u228D','cupor':'\u2A45','cups':'\u222A\uFE00','curarr':'\u21B7','curarrm':'\u293C','curlyeqprec':'\u22DE','curlyeqsucc':'\u22DF','curlyvee':'\u22CE','curlywedge':'\u22CF','curren':'\xA4','curvearrowleft':'\u21B6','curvearrowright':'\u21B7','cuvee':'\u22CE','cuwed':'\u22CF','cwconint':'\u2232','cwint':'\u2231','cylcty':'\u232D','dagger':'\u2020','Dagger':'\u2021','daleth':'\u2138','darr':'\u2193','dArr':'\u21D3','Darr':'\u21A1','dash':'\u2010','dashv':'\u22A3','Dashv':'\u2AE4','dbkarow':'\u290F','dblac':'\u02DD','dcaron':'\u010F','Dcaron':'\u010E','dcy':'\u0434','Dcy':'\u0414','dd':'\u2146','DD':'\u2145','ddagger':'\u2021','ddarr':'\u21CA','DDotrahd':'\u2911','ddotseq':'\u2A77','deg':'\xB0','Del':'\u2207','delta':'\u03B4','Delta':'\u0394','demptyv':'\u29B1','dfisht':'\u297F','dfr':'\uD835\uDD21','Dfr':'\uD835\uDD07','dHar':'\u2965','dharl':'\u21C3','dharr':'\u21C2','DiacriticalAcute':'\xB4','DiacriticalDot':'\u02D9','DiacriticalDoubleAcute':'\u02DD','DiacriticalGrave':'`','DiacriticalTilde':'\u02DC','diam':'\u22C4','diamond':'\u22C4','Diamond':'\u22C4','diamondsuit':'\u2666','diams':'\u2666','die':'\xA8','DifferentialD':'\u2146','digamma':'\u03DD','disin':'\u22F2','div':'\xF7','divide':'\xF7','divideontimes':'\u22C7','divonx':'\u22C7','djcy':'\u0452','DJcy':'\u0402','dlcorn':'\u231E','dlcrop':'\u230D','dollar':'$','dopf':'\uD835\uDD55','Dopf':'\uD835\uDD3B','dot':'\u02D9','Dot':'\xA8','DotDot':'\u20DC','doteq':'\u2250','doteqdot':'\u2251','DotEqual':'\u2250','dotminus':'\u2238','dotplus':'\u2214','dotsquare':'\u22A1','doublebarwedge':'\u2306','DoubleContourIntegral':'\u222F','DoubleDot':'\xA8','DoubleDownArrow':'\u21D3','DoubleLeftArrow':'\u21D0','DoubleLeftRightArrow':'\u21D4','DoubleLeftTee':'\u2AE4','DoubleLongLeftArrow':'\u27F8','DoubleLongLeftRightArrow':'\u27FA','DoubleLongRightArrow':'\u27F9','DoubleRightArrow':'\u21D2','DoubleRightTee':'\u22A8','DoubleUpArrow':'\u21D1','DoubleUpDownArrow':'\u21D5','DoubleVerticalBar':'\u2225','downarrow':'\u2193','Downarrow':'\u21D3','DownArrow':'\u2193','DownArrowBar':'\u2913','DownArrowUpArrow':'\u21F5','DownBreve':'\u0311','downdownarrows':'\u21CA','downharpoonleft':'\u21C3','downharpoonright':'\u21C2','DownLeftRightVector':'\u2950','DownLeftTeeVector':'\u295E','DownLeftVector':'\u21BD','DownLeftVectorBar':'\u2956','DownRightTeeVector':'\u295F','DownRightVector':'\u21C1','DownRightVectorBar':'\u2957','DownTee':'\u22A4','DownTeeArrow':'\u21A7','drbkarow':'\u2910','drcorn':'\u231F','drcrop':'\u230C','dscr':'\uD835\uDCB9','Dscr':'\uD835\uDC9F','dscy':'\u0455','DScy':'\u0405','dsol':'\u29F6','dstrok':'\u0111','Dstrok':'\u0110','dtdot':'\u22F1','dtri':'\u25BF','dtrif':'\u25BE','duarr':'\u21F5','duhar':'\u296F','dwangle':'\u29A6','dzcy':'\u045F','DZcy':'\u040F','dzigrarr':'\u27FF','eacute':'\xE9','Eacute':'\xC9','easter':'\u2A6E','ecaron':'\u011B','Ecaron':'\u011A','ecir':'\u2256','ecirc':'\xEA','Ecirc':'\xCA','ecolon':'\u2255','ecy':'\u044D','Ecy':'\u042D','eDDot':'\u2A77','edot':'\u0117','eDot':'\u2251','Edot':'\u0116','ee':'\u2147','efDot':'\u2252','efr':'\uD835\uDD22','Efr':'\uD835\uDD08','eg':'\u2A9A','egrave':'\xE8','Egrave':'\xC8','egs':'\u2A96','egsdot':'\u2A98','el':'\u2A99','Element':'\u2208','elinters':'\u23E7','ell':'\u2113','els':'\u2A95','elsdot':'\u2A97','emacr':'\u0113','Emacr':'\u0112','empty':'\u2205','emptyset':'\u2205','EmptySmallSquare':'\u25FB','emptyv':'\u2205','EmptyVerySmallSquare':'\u25AB','emsp':'\u2003','emsp13':'\u2004','emsp14':'\u2005','eng':'\u014B','ENG':'\u014A','ensp':'\u2002','eogon':'\u0119','Eogon':'\u0118','eopf':'\uD835\uDD56','Eopf':'\uD835\uDD3C','epar':'\u22D5','eparsl':'\u29E3','eplus':'\u2A71','epsi':'\u03B5','epsilon':'\u03B5','Epsilon':'\u0395','epsiv':'\u03F5','eqcirc':'\u2256','eqcolon':'\u2255','eqsim':'\u2242','eqslantgtr':'\u2A96','eqslantless':'\u2A95','Equal':'\u2A75','equals':'=','EqualTilde':'\u2242','equest':'\u225F','Equilibrium':'\u21CC','equiv':'\u2261','equivDD':'\u2A78','eqvparsl':'\u29E5','erarr':'\u2971','erDot':'\u2253','escr':'\u212F','Escr':'\u2130','esdot':'\u2250','esim':'\u2242','Esim':'\u2A73','eta':'\u03B7','Eta':'\u0397','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','euro':'\u20AC','excl':'!','exist':'\u2203','Exists':'\u2203','expectation':'\u2130','exponentiale':'\u2147','ExponentialE':'\u2147','fallingdotseq':'\u2252','fcy':'\u0444','Fcy':'\u0424','female':'\u2640','ffilig':'\uFB03','fflig':'\uFB00','ffllig':'\uFB04','ffr':'\uD835\uDD23','Ffr':'\uD835\uDD09','filig':'\uFB01','FilledSmallSquare':'\u25FC','FilledVerySmallSquare':'\u25AA','fjlig':'fj','flat':'\u266D','fllig':'\uFB02','fltns':'\u25B1','fnof':'\u0192','fopf':'\uD835\uDD57','Fopf':'\uD835\uDD3D','forall':'\u2200','ForAll':'\u2200','fork':'\u22D4','forkv':'\u2AD9','Fouriertrf':'\u2131','fpartint':'\u2A0D','frac12':'\xBD','frac13':'\u2153','frac14':'\xBC','frac15':'\u2155','frac16':'\u2159','frac18':'\u215B','frac23':'\u2154','frac25':'\u2156','frac34':'\xBE','frac35':'\u2157','frac38':'\u215C','frac45':'\u2158','frac56':'\u215A','frac58':'\u215D','frac78':'\u215E','frasl':'\u2044','frown':'\u2322','fscr':'\uD835\uDCBB','Fscr':'\u2131','gacute':'\u01F5','gamma':'\u03B3','Gamma':'\u0393','gammad':'\u03DD','Gammad':'\u03DC','gap':'\u2A86','gbreve':'\u011F','Gbreve':'\u011E','Gcedil':'\u0122','gcirc':'\u011D','Gcirc':'\u011C','gcy':'\u0433','Gcy':'\u0413','gdot':'\u0121','Gdot':'\u0120','ge':'\u2265','gE':'\u2267','gel':'\u22DB','gEl':'\u2A8C','geq':'\u2265','geqq':'\u2267','geqslant':'\u2A7E','ges':'\u2A7E','gescc':'\u2AA9','gesdot':'\u2A80','gesdoto':'\u2A82','gesdotol':'\u2A84','gesl':'\u22DB\uFE00','gesles':'\u2A94','gfr':'\uD835\uDD24','Gfr':'\uD835\uDD0A','gg':'\u226B','Gg':'\u22D9','ggg':'\u22D9','gimel':'\u2137','gjcy':'\u0453','GJcy':'\u0403','gl':'\u2277','gla':'\u2AA5','glE':'\u2A92','glj':'\u2AA4','gnap':'\u2A8A','gnapprox':'\u2A8A','gne':'\u2A88','gnE':'\u2269','gneq':'\u2A88','gneqq':'\u2269','gnsim':'\u22E7','gopf':'\uD835\uDD58','Gopf':'\uD835\uDD3E','grave':'`','GreaterEqual':'\u2265','GreaterEqualLess':'\u22DB','GreaterFullEqual':'\u2267','GreaterGreater':'\u2AA2','GreaterLess':'\u2277','GreaterSlantEqual':'\u2A7E','GreaterTilde':'\u2273','gscr':'\u210A','Gscr':'\uD835\uDCA2','gsim':'\u2273','gsime':'\u2A8E','gsiml':'\u2A90','gt':'>','Gt':'\u226B','GT':'>','gtcc':'\u2AA7','gtcir':'\u2A7A','gtdot':'\u22D7','gtlPar':'\u2995','gtquest':'\u2A7C','gtrapprox':'\u2A86','gtrarr':'\u2978','gtrdot':'\u22D7','gtreqless':'\u22DB','gtreqqless':'\u2A8C','gtrless':'\u2277','gtrsim':'\u2273','gvertneqq':'\u2269\uFE00','gvnE':'\u2269\uFE00','Hacek':'\u02C7','hairsp':'\u200A','half':'\xBD','hamilt':'\u210B','hardcy':'\u044A','HARDcy':'\u042A','harr':'\u2194','hArr':'\u21D4','harrcir':'\u2948','harrw':'\u21AD','Hat':'^','hbar':'\u210F','hcirc':'\u0125','Hcirc':'\u0124','hearts':'\u2665','heartsuit':'\u2665','hellip':'\u2026','hercon':'\u22B9','hfr':'\uD835\uDD25','Hfr':'\u210C','HilbertSpace':'\u210B','hksearow':'\u2925','hkswarow':'\u2926','hoarr':'\u21FF','homtht':'\u223B','hookleftarrow':'\u21A9','hookrightarrow':'\u21AA','hopf':'\uD835\uDD59','Hopf':'\u210D','horbar':'\u2015','HorizontalLine':'\u2500','hscr':'\uD835\uDCBD','Hscr':'\u210B','hslash':'\u210F','hstrok':'\u0127','Hstrok':'\u0126','HumpDownHump':'\u224E','HumpEqual':'\u224F','hybull':'\u2043','hyphen':'\u2010','iacute':'\xED','Iacute':'\xCD','ic':'\u2063','icirc':'\xEE','Icirc':'\xCE','icy':'\u0438','Icy':'\u0418','Idot':'\u0130','iecy':'\u0435','IEcy':'\u0415','iexcl':'\xA1','iff':'\u21D4','ifr':'\uD835\uDD26','Ifr':'\u2111','igrave':'\xEC','Igrave':'\xCC','ii':'\u2148','iiiint':'\u2A0C','iiint':'\u222D','iinfin':'\u29DC','iiota':'\u2129','ijlig':'\u0133','IJlig':'\u0132','Im':'\u2111','imacr':'\u012B','Imacr':'\u012A','image':'\u2111','ImaginaryI':'\u2148','imagline':'\u2110','imagpart':'\u2111','imath':'\u0131','imof':'\u22B7','imped':'\u01B5','Implies':'\u21D2','in':'\u2208','incare':'\u2105','infin':'\u221E','infintie':'\u29DD','inodot':'\u0131','int':'\u222B','Int':'\u222C','intcal':'\u22BA','integers':'\u2124','Integral':'\u222B','intercal':'\u22BA','Intersection':'\u22C2','intlarhk':'\u2A17','intprod':'\u2A3C','InvisibleComma':'\u2063','InvisibleTimes':'\u2062','iocy':'\u0451','IOcy':'\u0401','iogon':'\u012F','Iogon':'\u012E','iopf':'\uD835\uDD5A','Iopf':'\uD835\uDD40','iota':'\u03B9','Iota':'\u0399','iprod':'\u2A3C','iquest':'\xBF','iscr':'\uD835\uDCBE','Iscr':'\u2110','isin':'\u2208','isindot':'\u22F5','isinE':'\u22F9','isins':'\u22F4','isinsv':'\u22F3','isinv':'\u2208','it':'\u2062','itilde':'\u0129','Itilde':'\u0128','iukcy':'\u0456','Iukcy':'\u0406','iuml':'\xEF','Iuml':'\xCF','jcirc':'\u0135','Jcirc':'\u0134','jcy':'\u0439','Jcy':'\u0419','jfr':'\uD835\uDD27','Jfr':'\uD835\uDD0D','jmath':'\u0237','jopf':'\uD835\uDD5B','Jopf':'\uD835\uDD41','jscr':'\uD835\uDCBF','Jscr':'\uD835\uDCA5','jsercy':'\u0458','Jsercy':'\u0408','jukcy':'\u0454','Jukcy':'\u0404','kappa':'\u03BA','Kappa':'\u039A','kappav':'\u03F0','kcedil':'\u0137','Kcedil':'\u0136','kcy':'\u043A','Kcy':'\u041A','kfr':'\uD835\uDD28','Kfr':'\uD835\uDD0E','kgreen':'\u0138','khcy':'\u0445','KHcy':'\u0425','kjcy':'\u045C','KJcy':'\u040C','kopf':'\uD835\uDD5C','Kopf':'\uD835\uDD42','kscr':'\uD835\uDCC0','Kscr':'\uD835\uDCA6','lAarr':'\u21DA','lacute':'\u013A','Lacute':'\u0139','laemptyv':'\u29B4','lagran':'\u2112','lambda':'\u03BB','Lambda':'\u039B','lang':'\u27E8','Lang':'\u27EA','langd':'\u2991','langle':'\u27E8','lap':'\u2A85','Laplacetrf':'\u2112','laquo':'\xAB','larr':'\u2190','lArr':'\u21D0','Larr':'\u219E','larrb':'\u21E4','larrbfs':'\u291F','larrfs':'\u291D','larrhk':'\u21A9','larrlp':'\u21AB','larrpl':'\u2939','larrsim':'\u2973','larrtl':'\u21A2','lat':'\u2AAB','latail':'\u2919','lAtail':'\u291B','late':'\u2AAD','lates':'\u2AAD\uFE00','lbarr':'\u290C','lBarr':'\u290E','lbbrk':'\u2772','lbrace':'{','lbrack':'[','lbrke':'\u298B','lbrksld':'\u298F','lbrkslu':'\u298D','lcaron':'\u013E','Lcaron':'\u013D','lcedil':'\u013C','Lcedil':'\u013B','lceil':'\u2308','lcub':'{','lcy':'\u043B','Lcy':'\u041B','ldca':'\u2936','ldquo':'\u201C','ldquor':'\u201E','ldrdhar':'\u2967','ldrushar':'\u294B','ldsh':'\u21B2','le':'\u2264','lE':'\u2266','LeftAngleBracket':'\u27E8','leftarrow':'\u2190','Leftarrow':'\u21D0','LeftArrow':'\u2190','LeftArrowBar':'\u21E4','LeftArrowRightArrow':'\u21C6','leftarrowtail':'\u21A2','LeftCeiling':'\u2308','LeftDoubleBracket':'\u27E6','LeftDownTeeVector':'\u2961','LeftDownVector':'\u21C3','LeftDownVectorBar':'\u2959','LeftFloor':'\u230A','leftharpoondown':'\u21BD','leftharpoonup':'\u21BC','leftleftarrows':'\u21C7','leftrightarrow':'\u2194','Leftrightarrow':'\u21D4','LeftRightArrow':'\u2194','leftrightarrows':'\u21C6','leftrightharpoons':'\u21CB','leftrightsquigarrow':'\u21AD','LeftRightVector':'\u294E','LeftTee':'\u22A3','LeftTeeArrow':'\u21A4','LeftTeeVector':'\u295A','leftthreetimes':'\u22CB','LeftTriangle':'\u22B2','LeftTriangleBar':'\u29CF','LeftTriangleEqual':'\u22B4','LeftUpDownVector':'\u2951','LeftUpTeeVector':'\u2960','LeftUpVector':'\u21BF','LeftUpVectorBar':'\u2958','LeftVector':'\u21BC','LeftVectorBar':'\u2952','leg':'\u22DA','lEg':'\u2A8B','leq':'\u2264','leqq':'\u2266','leqslant':'\u2A7D','les':'\u2A7D','lescc':'\u2AA8','lesdot':'\u2A7F','lesdoto':'\u2A81','lesdotor':'\u2A83','lesg':'\u22DA\uFE00','lesges':'\u2A93','lessapprox':'\u2A85','lessdot':'\u22D6','lesseqgtr':'\u22DA','lesseqqgtr':'\u2A8B','LessEqualGreater':'\u22DA','LessFullEqual':'\u2266','LessGreater':'\u2276','lessgtr':'\u2276','LessLess':'\u2AA1','lesssim':'\u2272','LessSlantEqual':'\u2A7D','LessTilde':'\u2272','lfisht':'\u297C','lfloor':'\u230A','lfr':'\uD835\uDD29','Lfr':'\uD835\uDD0F','lg':'\u2276','lgE':'\u2A91','lHar':'\u2962','lhard':'\u21BD','lharu':'\u21BC','lharul':'\u296A','lhblk':'\u2584','ljcy':'\u0459','LJcy':'\u0409','ll':'\u226A','Ll':'\u22D8','llarr':'\u21C7','llcorner':'\u231E','Lleftarrow':'\u21DA','llhard':'\u296B','lltri':'\u25FA','lmidot':'\u0140','Lmidot':'\u013F','lmoust':'\u23B0','lmoustache':'\u23B0','lnap':'\u2A89','lnapprox':'\u2A89','lne':'\u2A87','lnE':'\u2268','lneq':'\u2A87','lneqq':'\u2268','lnsim':'\u22E6','loang':'\u27EC','loarr':'\u21FD','lobrk':'\u27E6','longleftarrow':'\u27F5','Longleftarrow':'\u27F8','LongLeftArrow':'\u27F5','longleftrightarrow':'\u27F7','Longleftrightarrow':'\u27FA','LongLeftRightArrow':'\u27F7','longmapsto':'\u27FC','longrightarrow':'\u27F6','Longrightarrow':'\u27F9','LongRightArrow':'\u27F6','looparrowleft':'\u21AB','looparrowright':'\u21AC','lopar':'\u2985','lopf':'\uD835\uDD5D','Lopf':'\uD835\uDD43','loplus':'\u2A2D','lotimes':'\u2A34','lowast':'\u2217','lowbar':'_','LowerLeftArrow':'\u2199','LowerRightArrow':'\u2198','loz':'\u25CA','lozenge':'\u25CA','lozf':'\u29EB','lpar':'(','lparlt':'\u2993','lrarr':'\u21C6','lrcorner':'\u231F','lrhar':'\u21CB','lrhard':'\u296D','lrm':'\u200E','lrtri':'\u22BF','lsaquo':'\u2039','lscr':'\uD835\uDCC1','Lscr':'\u2112','lsh':'\u21B0','Lsh':'\u21B0','lsim':'\u2272','lsime':'\u2A8D','lsimg':'\u2A8F','lsqb':'[','lsquo':'\u2018','lsquor':'\u201A','lstrok':'\u0142','Lstrok':'\u0141','lt':'<','Lt':'\u226A','LT':'<','ltcc':'\u2AA6','ltcir':'\u2A79','ltdot':'\u22D6','lthree':'\u22CB','ltimes':'\u22C9','ltlarr':'\u2976','ltquest':'\u2A7B','ltri':'\u25C3','ltrie':'\u22B4','ltrif':'\u25C2','ltrPar':'\u2996','lurdshar':'\u294A','luruhar':'\u2966','lvertneqq':'\u2268\uFE00','lvnE':'\u2268\uFE00','macr':'\xAF','male':'\u2642','malt':'\u2720','maltese':'\u2720','map':'\u21A6','Map':'\u2905','mapsto':'\u21A6','mapstodown':'\u21A7','mapstoleft':'\u21A4','mapstoup':'\u21A5','marker':'\u25AE','mcomma':'\u2A29','mcy':'\u043C','Mcy':'\u041C','mdash':'\u2014','mDDot':'\u223A','measuredangle':'\u2221','MediumSpace':'\u205F','Mellintrf':'\u2133','mfr':'\uD835\uDD2A','Mfr':'\uD835\uDD10','mho':'\u2127','micro':'\xB5','mid':'\u2223','midast':'*','midcir':'\u2AF0','middot':'\xB7','minus':'\u2212','minusb':'\u229F','minusd':'\u2238','minusdu':'\u2A2A','MinusPlus':'\u2213','mlcp':'\u2ADB','mldr':'\u2026','mnplus':'\u2213','models':'\u22A7','mopf':'\uD835\uDD5E','Mopf':'\uD835\uDD44','mp':'\u2213','mscr':'\uD835\uDCC2','Mscr':'\u2133','mstpos':'\u223E','mu':'\u03BC','Mu':'\u039C','multimap':'\u22B8','mumap':'\u22B8','nabla':'\u2207','nacute':'\u0144','Nacute':'\u0143','nang':'\u2220\u20D2','nap':'\u2249','napE':'\u2A70\u0338','napid':'\u224B\u0338','napos':'\u0149','napprox':'\u2249','natur':'\u266E','natural':'\u266E','naturals':'\u2115','nbsp':'\xA0','nbump':'\u224E\u0338','nbumpe':'\u224F\u0338','ncap':'\u2A43','ncaron':'\u0148','Ncaron':'\u0147','ncedil':'\u0146','Ncedil':'\u0145','ncong':'\u2247','ncongdot':'\u2A6D\u0338','ncup':'\u2A42','ncy':'\u043D','Ncy':'\u041D','ndash':'\u2013','ne':'\u2260','nearhk':'\u2924','nearr':'\u2197','neArr':'\u21D7','nearrow':'\u2197','nedot':'\u2250\u0338','NegativeMediumSpace':'\u200B','NegativeThickSpace':'\u200B','NegativeThinSpace':'\u200B','NegativeVeryThinSpace':'\u200B','nequiv':'\u2262','nesear':'\u2928','nesim':'\u2242\u0338','NestedGreaterGreater':'\u226B','NestedLessLess':'\u226A','NewLine':'\n','nexist':'\u2204','nexists':'\u2204','nfr':'\uD835\uDD2B','Nfr':'\uD835\uDD11','nge':'\u2271','ngE':'\u2267\u0338','ngeq':'\u2271','ngeqq':'\u2267\u0338','ngeqslant':'\u2A7E\u0338','nges':'\u2A7E\u0338','nGg':'\u22D9\u0338','ngsim':'\u2275','ngt':'\u226F','nGt':'\u226B\u20D2','ngtr':'\u226F','nGtv':'\u226B\u0338','nharr':'\u21AE','nhArr':'\u21CE','nhpar':'\u2AF2','ni':'\u220B','nis':'\u22FC','nisd':'\u22FA','niv':'\u220B','njcy':'\u045A','NJcy':'\u040A','nlarr':'\u219A','nlArr':'\u21CD','nldr':'\u2025','nle':'\u2270','nlE':'\u2266\u0338','nleftarrow':'\u219A','nLeftarrow':'\u21CD','nleftrightarrow':'\u21AE','nLeftrightarrow':'\u21CE','nleq':'\u2270','nleqq':'\u2266\u0338','nleqslant':'\u2A7D\u0338','nles':'\u2A7D\u0338','nless':'\u226E','nLl':'\u22D8\u0338','nlsim':'\u2274','nlt':'\u226E','nLt':'\u226A\u20D2','nltri':'\u22EA','nltrie':'\u22EC','nLtv':'\u226A\u0338','nmid':'\u2224','NoBreak':'\u2060','NonBreakingSpace':'\xA0','nopf':'\uD835\uDD5F','Nopf':'\u2115','not':'\xAC','Not':'\u2AEC','NotCongruent':'\u2262','NotCupCap':'\u226D','NotDoubleVerticalBar':'\u2226','NotElement':'\u2209','NotEqual':'\u2260','NotEqualTilde':'\u2242\u0338','NotExists':'\u2204','NotGreater':'\u226F','NotGreaterEqual':'\u2271','NotGreaterFullEqual':'\u2267\u0338','NotGreaterGreater':'\u226B\u0338','NotGreaterLess':'\u2279','NotGreaterSlantEqual':'\u2A7E\u0338','NotGreaterTilde':'\u2275','NotHumpDownHump':'\u224E\u0338','NotHumpEqual':'\u224F\u0338','notin':'\u2209','notindot':'\u22F5\u0338','notinE':'\u22F9\u0338','notinva':'\u2209','notinvb':'\u22F7','notinvc':'\u22F6','NotLeftTriangle':'\u22EA','NotLeftTriangleBar':'\u29CF\u0338','NotLeftTriangleEqual':'\u22EC','NotLess':'\u226E','NotLessEqual':'\u2270','NotLessGreater':'\u2278','NotLessLess':'\u226A\u0338','NotLessSlantEqual':'\u2A7D\u0338','NotLessTilde':'\u2274','NotNestedGreaterGreater':'\u2AA2\u0338','NotNestedLessLess':'\u2AA1\u0338','notni':'\u220C','notniva':'\u220C','notnivb':'\u22FE','notnivc':'\u22FD','NotPrecedes':'\u2280','NotPrecedesEqual':'\u2AAF\u0338','NotPrecedesSlantEqual':'\u22E0','NotReverseElement':'\u220C','NotRightTriangle':'\u22EB','NotRightTriangleBar':'\u29D0\u0338','NotRightTriangleEqual':'\u22ED','NotSquareSubset':'\u228F\u0338','NotSquareSubsetEqual':'\u22E2','NotSquareSuperset':'\u2290\u0338','NotSquareSupersetEqual':'\u22E3','NotSubset':'\u2282\u20D2','NotSubsetEqual':'\u2288','NotSucceeds':'\u2281','NotSucceedsEqual':'\u2AB0\u0338','NotSucceedsSlantEqual':'\u22E1','NotSucceedsTilde':'\u227F\u0338','NotSuperset':'\u2283\u20D2','NotSupersetEqual':'\u2289','NotTilde':'\u2241','NotTildeEqual':'\u2244','NotTildeFullEqual':'\u2247','NotTildeTilde':'\u2249','NotVerticalBar':'\u2224','npar':'\u2226','nparallel':'\u2226','nparsl':'\u2AFD\u20E5','npart':'\u2202\u0338','npolint':'\u2A14','npr':'\u2280','nprcue':'\u22E0','npre':'\u2AAF\u0338','nprec':'\u2280','npreceq':'\u2AAF\u0338','nrarr':'\u219B','nrArr':'\u21CF','nrarrc':'\u2933\u0338','nrarrw':'\u219D\u0338','nrightarrow':'\u219B','nRightarrow':'\u21CF','nrtri':'\u22EB','nrtrie':'\u22ED','nsc':'\u2281','nsccue':'\u22E1','nsce':'\u2AB0\u0338','nscr':'\uD835\uDCC3','Nscr':'\uD835\uDCA9','nshortmid':'\u2224','nshortparallel':'\u2226','nsim':'\u2241','nsime':'\u2244','nsimeq':'\u2244','nsmid':'\u2224','nspar':'\u2226','nsqsube':'\u22E2','nsqsupe':'\u22E3','nsub':'\u2284','nsube':'\u2288','nsubE':'\u2AC5\u0338','nsubset':'\u2282\u20D2','nsubseteq':'\u2288','nsubseteqq':'\u2AC5\u0338','nsucc':'\u2281','nsucceq':'\u2AB0\u0338','nsup':'\u2285','nsupe':'\u2289','nsupE':'\u2AC6\u0338','nsupset':'\u2283\u20D2','nsupseteq':'\u2289','nsupseteqq':'\u2AC6\u0338','ntgl':'\u2279','ntilde':'\xF1','Ntilde':'\xD1','ntlg':'\u2278','ntriangleleft':'\u22EA','ntrianglelefteq':'\u22EC','ntriangleright':'\u22EB','ntrianglerighteq':'\u22ED','nu':'\u03BD','Nu':'\u039D','num':'#','numero':'\u2116','numsp':'\u2007','nvap':'\u224D\u20D2','nvdash':'\u22AC','nvDash':'\u22AD','nVdash':'\u22AE','nVDash':'\u22AF','nvge':'\u2265\u20D2','nvgt':'>\u20D2','nvHarr':'\u2904','nvinfin':'\u29DE','nvlArr':'\u2902','nvle':'\u2264\u20D2','nvlt':'<\u20D2','nvltrie':'\u22B4\u20D2','nvrArr':'\u2903','nvrtrie':'\u22B5\u20D2','nvsim':'\u223C\u20D2','nwarhk':'\u2923','nwarr':'\u2196','nwArr':'\u21D6','nwarrow':'\u2196','nwnear':'\u2927','oacute':'\xF3','Oacute':'\xD3','oast':'\u229B','ocir':'\u229A','ocirc':'\xF4','Ocirc':'\xD4','ocy':'\u043E','Ocy':'\u041E','odash':'\u229D','odblac':'\u0151','Odblac':'\u0150','odiv':'\u2A38','odot':'\u2299','odsold':'\u29BC','oelig':'\u0153','OElig':'\u0152','ofcir':'\u29BF','ofr':'\uD835\uDD2C','Ofr':'\uD835\uDD12','ogon':'\u02DB','ograve':'\xF2','Ograve':'\xD2','ogt':'\u29C1','ohbar':'\u29B5','ohm':'\u03A9','oint':'\u222E','olarr':'\u21BA','olcir':'\u29BE','olcross':'\u29BB','oline':'\u203E','olt':'\u29C0','omacr':'\u014D','Omacr':'\u014C','omega':'\u03C9','Omega':'\u03A9','omicron':'\u03BF','Omicron':'\u039F','omid':'\u29B6','ominus':'\u2296','oopf':'\uD835\uDD60','Oopf':'\uD835\uDD46','opar':'\u29B7','OpenCurlyDoubleQuote':'\u201C','OpenCurlyQuote':'\u2018','operp':'\u29B9','oplus':'\u2295','or':'\u2228','Or':'\u2A54','orarr':'\u21BB','ord':'\u2A5D','order':'\u2134','orderof':'\u2134','ordf':'\xAA','ordm':'\xBA','origof':'\u22B6','oror':'\u2A56','orslope':'\u2A57','orv':'\u2A5B','oS':'\u24C8','oscr':'\u2134','Oscr':'\uD835\uDCAA','oslash':'\xF8','Oslash':'\xD8','osol':'\u2298','otilde':'\xF5','Otilde':'\xD5','otimes':'\u2297','Otimes':'\u2A37','otimesas':'\u2A36','ouml':'\xF6','Ouml':'\xD6','ovbar':'\u233D','OverBar':'\u203E','OverBrace':'\u23DE','OverBracket':'\u23B4','OverParenthesis':'\u23DC','par':'\u2225','para':'\xB6','parallel':'\u2225','parsim':'\u2AF3','parsl':'\u2AFD','part':'\u2202','PartialD':'\u2202','pcy':'\u043F','Pcy':'\u041F','percnt':'%','period':'.','permil':'\u2030','perp':'\u22A5','pertenk':'\u2031','pfr':'\uD835\uDD2D','Pfr':'\uD835\uDD13','phi':'\u03C6','Phi':'\u03A6','phiv':'\u03D5','phmmat':'\u2133','phone':'\u260E','pi':'\u03C0','Pi':'\u03A0','pitchfork':'\u22D4','piv':'\u03D6','planck':'\u210F','planckh':'\u210E','plankv':'\u210F','plus':'+','plusacir':'\u2A23','plusb':'\u229E','pluscir':'\u2A22','plusdo':'\u2214','plusdu':'\u2A25','pluse':'\u2A72','PlusMinus':'\xB1','plusmn':'\xB1','plussim':'\u2A26','plustwo':'\u2A27','pm':'\xB1','Poincareplane':'\u210C','pointint':'\u2A15','popf':'\uD835\uDD61','Popf':'\u2119','pound':'\xA3','pr':'\u227A','Pr':'\u2ABB','prap':'\u2AB7','prcue':'\u227C','pre':'\u2AAF','prE':'\u2AB3','prec':'\u227A','precapprox':'\u2AB7','preccurlyeq':'\u227C','Precedes':'\u227A','PrecedesEqual':'\u2AAF','PrecedesSlantEqual':'\u227C','PrecedesTilde':'\u227E','preceq':'\u2AAF','precnapprox':'\u2AB9','precneqq':'\u2AB5','precnsim':'\u22E8','precsim':'\u227E','prime':'\u2032','Prime':'\u2033','primes':'\u2119','prnap':'\u2AB9','prnE':'\u2AB5','prnsim':'\u22E8','prod':'\u220F','Product':'\u220F','profalar':'\u232E','profline':'\u2312','profsurf':'\u2313','prop':'\u221D','Proportion':'\u2237','Proportional':'\u221D','propto':'\u221D','prsim':'\u227E','prurel':'\u22B0','pscr':'\uD835\uDCC5','Pscr':'\uD835\uDCAB','psi':'\u03C8','Psi':'\u03A8','puncsp':'\u2008','qfr':'\uD835\uDD2E','Qfr':'\uD835\uDD14','qint':'\u2A0C','qopf':'\uD835\uDD62','Qopf':'\u211A','qprime':'\u2057','qscr':'\uD835\uDCC6','Qscr':'\uD835\uDCAC','quaternions':'\u210D','quatint':'\u2A16','quest':'?','questeq':'\u225F','quot':'"','QUOT':'"','rAarr':'\u21DB','race':'\u223D\u0331','racute':'\u0155','Racute':'\u0154','radic':'\u221A','raemptyv':'\u29B3','rang':'\u27E9','Rang':'\u27EB','rangd':'\u2992','range':'\u29A5','rangle':'\u27E9','raquo':'\xBB','rarr':'\u2192','rArr':'\u21D2','Rarr':'\u21A0','rarrap':'\u2975','rarrb':'\u21E5','rarrbfs':'\u2920','rarrc':'\u2933','rarrfs':'\u291E','rarrhk':'\u21AA','rarrlp':'\u21AC','rarrpl':'\u2945','rarrsim':'\u2974','rarrtl':'\u21A3','Rarrtl':'\u2916','rarrw':'\u219D','ratail':'\u291A','rAtail':'\u291C','ratio':'\u2236','rationals':'\u211A','rbarr':'\u290D','rBarr':'\u290F','RBarr':'\u2910','rbbrk':'\u2773','rbrace':'}','rbrack':']','rbrke':'\u298C','rbrksld':'\u298E','rbrkslu':'\u2990','rcaron':'\u0159','Rcaron':'\u0158','rcedil':'\u0157','Rcedil':'\u0156','rceil':'\u2309','rcub':'}','rcy':'\u0440','Rcy':'\u0420','rdca':'\u2937','rdldhar':'\u2969','rdquo':'\u201D','rdquor':'\u201D','rdsh':'\u21B3','Re':'\u211C','real':'\u211C','realine':'\u211B','realpart':'\u211C','reals':'\u211D','rect':'\u25AD','reg':'\xAE','REG':'\xAE','ReverseElement':'\u220B','ReverseEquilibrium':'\u21CB','ReverseUpEquilibrium':'\u296F','rfisht':'\u297D','rfloor':'\u230B','rfr':'\uD835\uDD2F','Rfr':'\u211C','rHar':'\u2964','rhard':'\u21C1','rharu':'\u21C0','rharul':'\u296C','rho':'\u03C1','Rho':'\u03A1','rhov':'\u03F1','RightAngleBracket':'\u27E9','rightarrow':'\u2192','Rightarrow':'\u21D2','RightArrow':'\u2192','RightArrowBar':'\u21E5','RightArrowLeftArrow':'\u21C4','rightarrowtail':'\u21A3','RightCeiling':'\u2309','RightDoubleBracket':'\u27E7','RightDownTeeVector':'\u295D','RightDownVector':'\u21C2','RightDownVectorBar':'\u2955','RightFloor':'\u230B','rightharpoondown':'\u21C1','rightharpoonup':'\u21C0','rightleftarrows':'\u21C4','rightleftharpoons':'\u21CC','rightrightarrows':'\u21C9','rightsquigarrow':'\u219D','RightTee':'\u22A2','RightTeeArrow':'\u21A6','RightTeeVector':'\u295B','rightthreetimes':'\u22CC','RightTriangle':'\u22B3','RightTriangleBar':'\u29D0','RightTriangleEqual':'\u22B5','RightUpDownVector':'\u294F','RightUpTeeVector':'\u295C','RightUpVector':'\u21BE','RightUpVectorBar':'\u2954','RightVector':'\u21C0','RightVectorBar':'\u2953','ring':'\u02DA','risingdotseq':'\u2253','rlarr':'\u21C4','rlhar':'\u21CC','rlm':'\u200F','rmoust':'\u23B1','rmoustache':'\u23B1','rnmid':'\u2AEE','roang':'\u27ED','roarr':'\u21FE','robrk':'\u27E7','ropar':'\u2986','ropf':'\uD835\uDD63','Ropf':'\u211D','roplus':'\u2A2E','rotimes':'\u2A35','RoundImplies':'\u2970','rpar':')','rpargt':'\u2994','rppolint':'\u2A12','rrarr':'\u21C9','Rrightarrow':'\u21DB','rsaquo':'\u203A','rscr':'\uD835\uDCC7','Rscr':'\u211B','rsh':'\u21B1','Rsh':'\u21B1','rsqb':']','rsquo':'\u2019','rsquor':'\u2019','rthree':'\u22CC','rtimes':'\u22CA','rtri':'\u25B9','rtrie':'\u22B5','rtrif':'\u25B8','rtriltri':'\u29CE','RuleDelayed':'\u29F4','ruluhar':'\u2968','rx':'\u211E','sacute':'\u015B','Sacute':'\u015A','sbquo':'\u201A','sc':'\u227B','Sc':'\u2ABC','scap':'\u2AB8','scaron':'\u0161','Scaron':'\u0160','sccue':'\u227D','sce':'\u2AB0','scE':'\u2AB4','scedil':'\u015F','Scedil':'\u015E','scirc':'\u015D','Scirc':'\u015C','scnap':'\u2ABA','scnE':'\u2AB6','scnsim':'\u22E9','scpolint':'\u2A13','scsim':'\u227F','scy':'\u0441','Scy':'\u0421','sdot':'\u22C5','sdotb':'\u22A1','sdote':'\u2A66','searhk':'\u2925','searr':'\u2198','seArr':'\u21D8','searrow':'\u2198','sect':'\xA7','semi':';','seswar':'\u2929','setminus':'\u2216','setmn':'\u2216','sext':'\u2736','sfr':'\uD835\uDD30','Sfr':'\uD835\uDD16','sfrown':'\u2322','sharp':'\u266F','shchcy':'\u0449','SHCHcy':'\u0429','shcy':'\u0448','SHcy':'\u0428','ShortDownArrow':'\u2193','ShortLeftArrow':'\u2190','shortmid':'\u2223','shortparallel':'\u2225','ShortRightArrow':'\u2192','ShortUpArrow':'\u2191','shy':'\xAD','sigma':'\u03C3','Sigma':'\u03A3','sigmaf':'\u03C2','sigmav':'\u03C2','sim':'\u223C','simdot':'\u2A6A','sime':'\u2243','simeq':'\u2243','simg':'\u2A9E','simgE':'\u2AA0','siml':'\u2A9D','simlE':'\u2A9F','simne':'\u2246','simplus':'\u2A24','simrarr':'\u2972','slarr':'\u2190','SmallCircle':'\u2218','smallsetminus':'\u2216','smashp':'\u2A33','smeparsl':'\u29E4','smid':'\u2223','smile':'\u2323','smt':'\u2AAA','smte':'\u2AAC','smtes':'\u2AAC\uFE00','softcy':'\u044C','SOFTcy':'\u042C','sol':'/','solb':'\u29C4','solbar':'\u233F','sopf':'\uD835\uDD64','Sopf':'\uD835\uDD4A','spades':'\u2660','spadesuit':'\u2660','spar':'\u2225','sqcap':'\u2293','sqcaps':'\u2293\uFE00','sqcup':'\u2294','sqcups':'\u2294\uFE00','Sqrt':'\u221A','sqsub':'\u228F','sqsube':'\u2291','sqsubset':'\u228F','sqsubseteq':'\u2291','sqsup':'\u2290','sqsupe':'\u2292','sqsupset':'\u2290','sqsupseteq':'\u2292','squ':'\u25A1','square':'\u25A1','Square':'\u25A1','SquareIntersection':'\u2293','SquareSubset':'\u228F','SquareSubsetEqual':'\u2291','SquareSuperset':'\u2290','SquareSupersetEqual':'\u2292','SquareUnion':'\u2294','squarf':'\u25AA','squf':'\u25AA','srarr':'\u2192','sscr':'\uD835\uDCC8','Sscr':'\uD835\uDCAE','ssetmn':'\u2216','ssmile':'\u2323','sstarf':'\u22C6','star':'\u2606','Star':'\u22C6','starf':'\u2605','straightepsilon':'\u03F5','straightphi':'\u03D5','strns':'\xAF','sub':'\u2282','Sub':'\u22D0','subdot':'\u2ABD','sube':'\u2286','subE':'\u2AC5','subedot':'\u2AC3','submult':'\u2AC1','subne':'\u228A','subnE':'\u2ACB','subplus':'\u2ABF','subrarr':'\u2979','subset':'\u2282','Subset':'\u22D0','subseteq':'\u2286','subseteqq':'\u2AC5','SubsetEqual':'\u2286','subsetneq':'\u228A','subsetneqq':'\u2ACB','subsim':'\u2AC7','subsub':'\u2AD5','subsup':'\u2AD3','succ':'\u227B','succapprox':'\u2AB8','succcurlyeq':'\u227D','Succeeds':'\u227B','SucceedsEqual':'\u2AB0','SucceedsSlantEqual':'\u227D','SucceedsTilde':'\u227F','succeq':'\u2AB0','succnapprox':'\u2ABA','succneqq':'\u2AB6','succnsim':'\u22E9','succsim':'\u227F','SuchThat':'\u220B','sum':'\u2211','Sum':'\u2211','sung':'\u266A','sup':'\u2283','Sup':'\u22D1','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','supdot':'\u2ABE','supdsub':'\u2AD8','supe':'\u2287','supE':'\u2AC6','supedot':'\u2AC4','Superset':'\u2283','SupersetEqual':'\u2287','suphsol':'\u27C9','suphsub':'\u2AD7','suplarr':'\u297B','supmult':'\u2AC2','supne':'\u228B','supnE':'\u2ACC','supplus':'\u2AC0','supset':'\u2283','Supset':'\u22D1','supseteq':'\u2287','supseteqq':'\u2AC6','supsetneq':'\u228B','supsetneqq':'\u2ACC','supsim':'\u2AC8','supsub':'\u2AD4','supsup':'\u2AD6','swarhk':'\u2926','swarr':'\u2199','swArr':'\u21D9','swarrow':'\u2199','swnwar':'\u292A','szlig':'\xDF','Tab':'\t','target':'\u2316','tau':'\u03C4','Tau':'\u03A4','tbrk':'\u23B4','tcaron':'\u0165','Tcaron':'\u0164','tcedil':'\u0163','Tcedil':'\u0162','tcy':'\u0442','Tcy':'\u0422','tdot':'\u20DB','telrec':'\u2315','tfr':'\uD835\uDD31','Tfr':'\uD835\uDD17','there4':'\u2234','therefore':'\u2234','Therefore':'\u2234','theta':'\u03B8','Theta':'\u0398','thetasym':'\u03D1','thetav':'\u03D1','thickapprox':'\u2248','thicksim':'\u223C','ThickSpace':'\u205F\u200A','thinsp':'\u2009','ThinSpace':'\u2009','thkap':'\u2248','thksim':'\u223C','thorn':'\xFE','THORN':'\xDE','tilde':'\u02DC','Tilde':'\u223C','TildeEqual':'\u2243','TildeFullEqual':'\u2245','TildeTilde':'\u2248','times':'\xD7','timesb':'\u22A0','timesbar':'\u2A31','timesd':'\u2A30','tint':'\u222D','toea':'\u2928','top':'\u22A4','topbot':'\u2336','topcir':'\u2AF1','topf':'\uD835\uDD65','Topf':'\uD835\uDD4B','topfork':'\u2ADA','tosa':'\u2929','tprime':'\u2034','trade':'\u2122','TRADE':'\u2122','triangle':'\u25B5','triangledown':'\u25BF','triangleleft':'\u25C3','trianglelefteq':'\u22B4','triangleq':'\u225C','triangleright':'\u25B9','trianglerighteq':'\u22B5','tridot':'\u25EC','trie':'\u225C','triminus':'\u2A3A','TripleDot':'\u20DB','triplus':'\u2A39','trisb':'\u29CD','tritime':'\u2A3B','trpezium':'\u23E2','tscr':'\uD835\uDCC9','Tscr':'\uD835\uDCAF','tscy':'\u0446','TScy':'\u0426','tshcy':'\u045B','TSHcy':'\u040B','tstrok':'\u0167','Tstrok':'\u0166','twixt':'\u226C','twoheadleftarrow':'\u219E','twoheadrightarrow':'\u21A0','uacute':'\xFA','Uacute':'\xDA','uarr':'\u2191','uArr':'\u21D1','Uarr':'\u219F','Uarrocir':'\u2949','ubrcy':'\u045E','Ubrcy':'\u040E','ubreve':'\u016D','Ubreve':'\u016C','ucirc':'\xFB','Ucirc':'\xDB','ucy':'\u0443','Ucy':'\u0423','udarr':'\u21C5','udblac':'\u0171','Udblac':'\u0170','udhar':'\u296E','ufisht':'\u297E','ufr':'\uD835\uDD32','Ufr':'\uD835\uDD18','ugrave':'\xF9','Ugrave':'\xD9','uHar':'\u2963','uharl':'\u21BF','uharr':'\u21BE','uhblk':'\u2580','ulcorn':'\u231C','ulcorner':'\u231C','ulcrop':'\u230F','ultri':'\u25F8','umacr':'\u016B','Umacr':'\u016A','uml':'\xA8','UnderBar':'_','UnderBrace':'\u23DF','UnderBracket':'\u23B5','UnderParenthesis':'\u23DD','Union':'\u22C3','UnionPlus':'\u228E','uogon':'\u0173','Uogon':'\u0172','uopf':'\uD835\uDD66','Uopf':'\uD835\uDD4C','uparrow':'\u2191','Uparrow':'\u21D1','UpArrow':'\u2191','UpArrowBar':'\u2912','UpArrowDownArrow':'\u21C5','updownarrow':'\u2195','Updownarrow':'\u21D5','UpDownArrow':'\u2195','UpEquilibrium':'\u296E','upharpoonleft':'\u21BF','upharpoonright':'\u21BE','uplus':'\u228E','UpperLeftArrow':'\u2196','UpperRightArrow':'\u2197','upsi':'\u03C5','Upsi':'\u03D2','upsih':'\u03D2','upsilon':'\u03C5','Upsilon':'\u03A5','UpTee':'\u22A5','UpTeeArrow':'\u21A5','upuparrows':'\u21C8','urcorn':'\u231D','urcorner':'\u231D','urcrop':'\u230E','uring':'\u016F','Uring':'\u016E','urtri':'\u25F9','uscr':'\uD835\uDCCA','Uscr':'\uD835\uDCB0','utdot':'\u22F0','utilde':'\u0169','Utilde':'\u0168','utri':'\u25B5','utrif':'\u25B4','uuarr':'\u21C8','uuml':'\xFC','Uuml':'\xDC','uwangle':'\u29A7','vangrt':'\u299C','varepsilon':'\u03F5','varkappa':'\u03F0','varnothing':'\u2205','varphi':'\u03D5','varpi':'\u03D6','varpropto':'\u221D','varr':'\u2195','vArr':'\u21D5','varrho':'\u03F1','varsigma':'\u03C2','varsubsetneq':'\u228A\uFE00','varsubsetneqq':'\u2ACB\uFE00','varsupsetneq':'\u228B\uFE00','varsupsetneqq':'\u2ACC\uFE00','vartheta':'\u03D1','vartriangleleft':'\u22B2','vartriangleright':'\u22B3','vBar':'\u2AE8','Vbar':'\u2AEB','vBarv':'\u2AE9','vcy':'\u0432','Vcy':'\u0412','vdash':'\u22A2','vDash':'\u22A8','Vdash':'\u22A9','VDash':'\u22AB','Vdashl':'\u2AE6','vee':'\u2228','Vee':'\u22C1','veebar':'\u22BB','veeeq':'\u225A','vellip':'\u22EE','verbar':'|','Verbar':'\u2016','vert':'|','Vert':'\u2016','VerticalBar':'\u2223','VerticalLine':'|','VerticalSeparator':'\u2758','VerticalTilde':'\u2240','VeryThinSpace':'\u200A','vfr':'\uD835\uDD33','Vfr':'\uD835\uDD19','vltri':'\u22B2','vnsub':'\u2282\u20D2','vnsup':'\u2283\u20D2','vopf':'\uD835\uDD67','Vopf':'\uD835\uDD4D','vprop':'\u221D','vrtri':'\u22B3','vscr':'\uD835\uDCCB','Vscr':'\uD835\uDCB1','vsubne':'\u228A\uFE00','vsubnE':'\u2ACB\uFE00','vsupne':'\u228B\uFE00','vsupnE':'\u2ACC\uFE00','Vvdash':'\u22AA','vzigzag':'\u299A','wcirc':'\u0175','Wcirc':'\u0174','wedbar':'\u2A5F','wedge':'\u2227','Wedge':'\u22C0','wedgeq':'\u2259','weierp':'\u2118','wfr':'\uD835\uDD34','Wfr':'\uD835\uDD1A','wopf':'\uD835\uDD68','Wopf':'\uD835\uDD4E','wp':'\u2118','wr':'\u2240','wreath':'\u2240','wscr':'\uD835\uDCCC','Wscr':'\uD835\uDCB2','xcap':'\u22C2','xcirc':'\u25EF','xcup':'\u22C3','xdtri':'\u25BD','xfr':'\uD835\uDD35','Xfr':'\uD835\uDD1B','xharr':'\u27F7','xhArr':'\u27FA','xi':'\u03BE','Xi':'\u039E','xlarr':'\u27F5','xlArr':'\u27F8','xmap':'\u27FC','xnis':'\u22FB','xodot':'\u2A00','xopf':'\uD835\uDD69','Xopf':'\uD835\uDD4F','xoplus':'\u2A01','xotime':'\u2A02','xrarr':'\u27F6','xrArr':'\u27F9','xscr':'\uD835\uDCCD','Xscr':'\uD835\uDCB3','xsqcup':'\u2A06','xuplus':'\u2A04','xutri':'\u25B3','xvee':'\u22C1','xwedge':'\u22C0','yacute':'\xFD','Yacute':'\xDD','yacy':'\u044F','YAcy':'\u042F','ycirc':'\u0177','Ycirc':'\u0176','ycy':'\u044B','Ycy':'\u042B','yen':'\xA5','yfr':'\uD835\uDD36','Yfr':'\uD835\uDD1C','yicy':'\u0457','YIcy':'\u0407','yopf':'\uD835\uDD6A','Yopf':'\uD835\uDD50','yscr':'\uD835\uDCCE','Yscr':'\uD835\uDCB4','yucy':'\u044E','YUcy':'\u042E','yuml':'\xFF','Yuml':'\u0178','zacute':'\u017A','Zacute':'\u0179','zcaron':'\u017E','Zcaron':'\u017D','zcy':'\u0437','Zcy':'\u0417','zdot':'\u017C','Zdot':'\u017B','zeetrf':'\u2128','ZeroWidthSpace':'\u200B','zeta':'\u03B6','Zeta':'\u0396','zfr':'\uD835\uDD37','Zfr':'\u2128','zhcy':'\u0436','ZHcy':'\u0416','zigrarr':'\u21DD','zopf':'\uD835\uDD6B','Zopf':'\u2124','zscr':'\uD835\uDCCF','Zscr':'\uD835\uDCB5','zwj':'\u200D','zwnj':'\u200C'};
	var decodeMapLegacy = {'aacute':'\xE1','Aacute':'\xC1','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','aelig':'\xE6','AElig':'\xC6','agrave':'\xE0','Agrave':'\xC0','amp':'&','AMP':'&','aring':'\xE5','Aring':'\xC5','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','brvbar':'\xA6','ccedil':'\xE7','Ccedil':'\xC7','cedil':'\xB8','cent':'\xA2','copy':'\xA9','COPY':'\xA9','curren':'\xA4','deg':'\xB0','divide':'\xF7','eacute':'\xE9','Eacute':'\xC9','ecirc':'\xEA','Ecirc':'\xCA','egrave':'\xE8','Egrave':'\xC8','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','frac12':'\xBD','frac14':'\xBC','frac34':'\xBE','gt':'>','GT':'>','iacute':'\xED','Iacute':'\xCD','icirc':'\xEE','Icirc':'\xCE','iexcl':'\xA1','igrave':'\xEC','Igrave':'\xCC','iquest':'\xBF','iuml':'\xEF','Iuml':'\xCF','laquo':'\xAB','lt':'<','LT':'<','macr':'\xAF','micro':'\xB5','middot':'\xB7','nbsp':'\xA0','not':'\xAC','ntilde':'\xF1','Ntilde':'\xD1','oacute':'\xF3','Oacute':'\xD3','ocirc':'\xF4','Ocirc':'\xD4','ograve':'\xF2','Ograve':'\xD2','ordf':'\xAA','ordm':'\xBA','oslash':'\xF8','Oslash':'\xD8','otilde':'\xF5','Otilde':'\xD5','ouml':'\xF6','Ouml':'\xD6','para':'\xB6','plusmn':'\xB1','pound':'\xA3','quot':'"','QUOT':'"','raquo':'\xBB','reg':'\xAE','REG':'\xAE','sect':'\xA7','shy':'\xAD','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','szlig':'\xDF','thorn':'\xFE','THORN':'\xDE','times':'\xD7','uacute':'\xFA','Uacute':'\xDA','ucirc':'\xFB','Ucirc':'\xDB','ugrave':'\xF9','Ugrave':'\xD9','uml':'\xA8','uuml':'\xFC','Uuml':'\xDC','yacute':'\xFD','Yacute':'\xDD','yen':'\xA5','yuml':'\xFF'};
	var decodeMapNumeric = {'0':'\uFFFD','128':'\u20AC','130':'\u201A','131':'\u0192','132':'\u201E','133':'\u2026','134':'\u2020','135':'\u2021','136':'\u02C6','137':'\u2030','138':'\u0160','139':'\u2039','140':'\u0152','142':'\u017D','145':'\u2018','146':'\u2019','147':'\u201C','148':'\u201D','149':'\u2022','150':'\u2013','151':'\u2014','152':'\u02DC','153':'\u2122','154':'\u0161','155':'\u203A','156':'\u0153','158':'\u017E','159':'\u0178'};
	var invalidReferenceCodePoints = [1,2,3,4,5,6,7,8,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,64976,64977,64978,64979,64980,64981,64982,64983,64984,64985,64986,64987,64988,64989,64990,64991,64992,64993,64994,64995,64996,64997,64998,64999,65000,65001,65002,65003,65004,65005,65006,65007,65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111];

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	var object = {};
	var hasOwnProperty = object.hasOwnProperty;
	var has = function(object, propertyName) {
		return hasOwnProperty.call(object, propertyName);
	};

	var contains = function(array, value) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			if (array[index] == value) {
				return true;
			}
		}
		return false;
	};

	var merge = function(options, defaults) {
		if (!options) {
			return defaults;
		}
		var result = {};
		var key;
		for (key in defaults) {
			// A `hasOwnProperty` check is not needed here, since only recognized
			// option names are used anyway. Any others are ignored.
			result[key] = has(options, key) ? options[key] : defaults[key];
		}
		return result;
	};

	// Modified version of `ucs2encode`; see https://mths.be/punycode.
	var codePointToSymbol = function(codePoint, strict) {
		var output = '';
		if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
			// See issue #4:
			// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
			// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
			// REPLACEMENT CHARACTER.”
			if (strict) {
				parseError('character reference outside the permissible Unicode range');
			}
			return '\uFFFD';
		}
		if (has(decodeMapNumeric, codePoint)) {
			if (strict) {
				parseError('disallowed character reference');
			}
			return decodeMapNumeric[codePoint];
		}
		if (strict && contains(invalidReferenceCodePoints, codePoint)) {
			parseError('disallowed character reference');
		}
		if (codePoint > 0xFFFF) {
			codePoint -= 0x10000;
			output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
			codePoint = 0xDC00 | codePoint & 0x3FF;
		}
		output += stringFromCharCode(codePoint);
		return output;
	};

	var hexEscape = function(codePoint) {
		return '&#x' + codePoint.toString(16).toUpperCase() + ';';
	};

	var decEscape = function(codePoint) {
		return '&#' + codePoint + ';';
	};

	var parseError = function(message) {
		throw Error('Parse error: ' + message);
	};

	/*--------------------------------------------------------------------------*/

	var encode = function(string, options) {
		options = merge(options, encode.options);
		var strict = options.strict;
		if (strict && regexInvalidRawCodePoint.test(string)) {
			parseError('forbidden code point');
		}
		var encodeEverything = options.encodeEverything;
		var useNamedReferences = options.useNamedReferences;
		var allowUnsafeSymbols = options.allowUnsafeSymbols;
		var escapeCodePoint = options.decimal ? decEscape : hexEscape;

		var escapeBmpSymbol = function(symbol) {
			return escapeCodePoint(symbol.charCodeAt(0));
		};

		if (encodeEverything) {
			// Encode ASCII symbols.
			string = string.replace(regexAsciiWhitelist, function(symbol) {
				// Use named references if requested & possible.
				if (useNamedReferences && has(encodeMap, symbol)) {
					return '&' + encodeMap[symbol] + ';';
				}
				return escapeBmpSymbol(symbol);
			});
			// Shorten a few escapes that represent two symbols, of which at least one
			// is within the ASCII range.
			if (useNamedReferences) {
				string = string
					.replace(/&gt;\u20D2/g, '&nvgt;')
					.replace(/&lt;\u20D2/g, '&nvlt;')
					.replace(/&#x66;&#x6A;/g, '&fjlig;');
			}
			// Encode non-ASCII symbols.
			if (useNamedReferences) {
				// Encode non-ASCII symbols that can be replaced with a named reference.
				string = string.replace(regexEncodeNonAscii, function(string) {
					// Note: there is no need to check `has(encodeMap, string)` here.
					return '&' + encodeMap[string] + ';';
				});
			}
			// Note: any remaining non-ASCII symbols are handled outside of the `if`.
		} else if (useNamedReferences) {
			// Apply named character references.
			// Encode `<>"'&` using named character references.
			if (!allowUnsafeSymbols) {
				string = string.replace(regexEscape, function(string) {
					return '&' + encodeMap[string] + ';'; // no need to check `has()` here
				});
			}
			// Shorten escapes that represent two symbols, of which at least one is
			// `<>"'&`.
			string = string
				.replace(/&gt;\u20D2/g, '&nvgt;')
				.replace(/&lt;\u20D2/g, '&nvlt;');
			// Encode non-ASCII symbols that can be replaced with a named reference.
			string = string.replace(regexEncodeNonAscii, function(string) {
				// Note: there is no need to check `has(encodeMap, string)` here.
				return '&' + encodeMap[string] + ';';
			});
		} else if (!allowUnsafeSymbols) {
			// Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
			// using named character references.
			string = string.replace(regexEscape, escapeBmpSymbol);
		}
		return string
			// Encode astral symbols.
			.replace(regexAstralSymbols, function($0) {
				// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
				var high = $0.charCodeAt(0);
				var low = $0.charCodeAt(1);
				var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
				return escapeCodePoint(codePoint);
			})
			// Encode any remaining BMP symbols that are not printable ASCII symbols
			// using a hexadecimal escape.
			.replace(regexBmpWhitelist, escapeBmpSymbol);
	};
	// Expose default options (so they can be overridden globally).
	encode.options = {
		'allowUnsafeSymbols': false,
		'encodeEverything': false,
		'strict': false,
		'useNamedReferences': false,
		'decimal' : false
	};

	var decode = function(html, options) {
		options = merge(options, decode.options);
		var strict = options.strict;
		if (strict && regexInvalidEntity.test(html)) {
			parseError('malformed character reference');
		}
		return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7) {
			var codePoint;
			var semicolon;
			var decDigits;
			var hexDigits;
			var reference;
			var next;
			if ($1) {
				// Decode decimal escapes, e.g. `&#119558;`.
				decDigits = $1;
				semicolon = $2;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(decDigits, 10);
				return codePointToSymbol(codePoint, strict);
			}
			if ($3) {
				// Decode hexadecimal escapes, e.g. `&#x1D306;`.
				hexDigits = $3;
				semicolon = $4;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(hexDigits, 16);
				return codePointToSymbol(codePoint, strict);
			}
			if ($5) {
				// Decode named character references with trailing `;`, e.g. `&copy;`.
				reference = $5;
				if (has(decodeMap, reference)) {
					return decodeMap[reference];
				} else {
					// Ambiguous ampersand. https://mths.be/notes/ambiguous-ampersands
					if (strict) {
						parseError(
							'named character reference was not terminated by a semicolon'
						);
					}
					return $0;
				}
			}
			// If we’re still here, it’s a legacy reference for sure. No need for an
			// extra `if` check.
			// Decode named character references without trailing `;`, e.g. `&amp`
			// This is only a parse error if it gets converted to `&`, or if it is
			// followed by `=` in an attribute context.
			reference = $6;
			next = $7;
			if (next && options.isAttributeValue) {
				if (strict && next == '=') {
					parseError('`&` did not start a character reference');
				}
				return $0;
			} else {
				if (strict) {
					parseError(
						'named character reference was not terminated by a semicolon'
					);
				}
				// Note: there is no need to check `has(decodeMapLegacy, reference)`.
				return decodeMapLegacy[reference] + (next || '');
			}
		});
	};
	// Expose default options (so they can be overridden globally).
	decode.options = {
		'isAttributeValue': false,
		'strict': false
	};

	var escape = function(string) {
		return string.replace(regexEscape, function($0) {
			// Note: there is no need to check `has(escapeMap, $0)` here.
			return escapeMap[$0];
		});
	};

	/*--------------------------------------------------------------------------*/

	var he = {
		'version': '1.1.0',
		'encode': encode,
		'decode': decode,
		'escape': escape,
		'unescape': decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return he;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = he;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in he) {
				has(he, key) && (freeExports[key] = he[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.he = he;
	}

}(this));
/**
 * Script adapted from https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * MIT license
 */
function fileDownload(data, filename, mime) {

    var blobData = (typeof bom !== 'undefined') ? [bom, data] : [data]
    var blob = new Blob(blobData, {type: mime || 'application/octet-stream'});
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename);

        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }

        document.body.appendChild(tempLink);
        tempLink.click();

        // Fixes "webkit blob resource error 1"
        setTimeout(function() {
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }, 200)
    }
}
/**
 * Applies a mask for hex color codes on the given field
 */
function applyHexColorMask(field) {
	var maskFields = [
	                  fieldBuilder.literal("#"),
	                  fieldBuilder.input("0123456789aAbBcCdDeEfF", 6, 6, true)
	                  ];
	return new InputMask(maskFields, field);
}

/**
 * Gets the current position of the user
 */
function locate(onSuccess, onFailure) {
	if (navigator.geolocation) {
		navigator.geolocation
				.getCurrentPosition(
						function(position) {
							onSuccess(position);							
						},
						function(error) {
							onFailure(error);
						});
	} else {
		onFailure(null);
	}
}

var problemsLoadingInterval;
function startLoading() {
	document.getElementById('rootSpinner').style.display = '';
	if (!problemsLoadingInterval) {
    	problemsLoadingInterval = setTimeout(function() {
    		setProblemsLoadingVisible(true);
    	}, 15000);
	}
}
function stopLoading() {
    document.getElementById('rootSpinner').style.display = 'none';
	setProblemsLoadingVisible(false);
}

/**
 * Shows / hides the problems loading message
 */
function setProblemsLoadingVisible(visible) {
	document.getElementById('problemsLoading').style.display = visible ? '' : 'none';
	if (!visible) {
		clearInterval(problemsLoadingInterval);
		problemsLoadingInterval = null;
	}
}
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).opentype={})}(this,function(O){"use strict";function e(e){if(null==this)throw TypeError();var t=String(this),r=t.length,n=e?Number(e):0;if(n!=n&&(n=0),!(n<0||r<=n)){var a,o=t.charCodeAt(n);return 55296<=o&&o<=56319&&n+1<r&&56320<=(a=t.charCodeAt(n+1))&&a<=57343?1024*(o-55296)+a-56320+65536:o}}var t;String.prototype.codePointAt||((t=function(){try{var e={},t=Object.defineProperty,r=t(e,e,e)&&t}catch(e){}return r}())?t(String.prototype,"codePointAt",{value:e,configurable:!0,writable:!0}):String.prototype.codePointAt=e);var u=0,o=-3;function r(){this.table=new Uint16Array(16),this.trans=new Uint16Array(288)}function s(e,t){this.source=e,this.sourceIndex=0,this.tag=0,this.bitcount=0,this.dest=t,this.destLen=0,this.ltree=new r,this.dtree=new r}var i=new r,l=new r,p=new Uint8Array(30),c=new Uint16Array(30),h=new Uint8Array(30),f=new Uint16Array(30),d=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),v=new r,g=new Uint8Array(320);function n(e,t,r,n){var a,o;for(a=0;a<r;++a)e[a]=0;for(a=0;a<30-r;++a)e[a+r]=a/r|0;for(o=n,a=0;a<30;++a)t[a]=o,o+=1<<e[a]}var m=new Uint16Array(16);function y(e,t,r,n){var a,o;for(a=0;a<16;++a)e.table[a]=0;for(a=0;a<n;++a)e.table[t[r+a]]++;for(a=o=e.table[0]=0;a<16;++a)m[a]=o,o+=e.table[a];for(a=0;a<n;++a)t[r+a]&&(e.trans[m[t[r+a]]++]=a)}function b(e){e.bitcount--||(e.tag=e.source[e.sourceIndex++],e.bitcount=7);var t=1&e.tag;return e.tag>>>=1,t}function S(e,t,r){if(!t)return r;for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;var n=e.tag&65535>>>16-t;return e.tag>>>=t,e.bitcount-=t,n+r}function x(e,t){for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;for(var r=0,n=0,a=0,o=e.tag;n=2*n+(1&o),o>>>=1,++a,r+=t.table[a],0<=(n-=t.table[a]););return e.tag=o,e.bitcount-=a,t.trans[r+n]}function T(e,t,r){var n,a,o,s,i,u;for(n=S(e,5,257),a=S(e,5,1),o=S(e,4,4),s=0;s<19;++s)g[s]=0;for(s=0;s<o;++s){var l=S(e,3,0);g[d[s]]=l}for(y(v,g,0,19),i=0;i<n+a;){var p=x(e,v);switch(p){case 16:var c=g[i-1];for(u=S(e,2,3);u;--u)g[i++]=c;break;case 17:for(u=S(e,3,3);u;--u)g[i++]=0;break;case 18:for(u=S(e,7,11);u;--u)g[i++]=0;break;default:g[i++]=p}}y(t,g,0,n),y(r,g,n,a)}function U(e,t,r){for(;;){var n,a,o,s,i=x(e,t);if(256===i)return u;if(i<256)e.dest[e.destLen++]=i;else for(n=S(e,p[i-=257],c[i]),a=x(e,r),s=o=e.destLen-S(e,h[a],f[a]);s<o+n;++s)e.dest[e.destLen++]=e.dest[s]}}function k(e){for(var t,r;8<e.bitcount;)e.sourceIndex--,e.bitcount-=8;if((t=256*(t=e.source[e.sourceIndex+1])+e.source[e.sourceIndex])!==(65535&~(256*e.source[e.sourceIndex+3]+e.source[e.sourceIndex+2])))return o;for(e.sourceIndex+=4,r=t;r;--r)e.dest[e.destLen++]=e.source[e.sourceIndex++];return e.bitcount=0,u}!function(e,t){var r;for(r=0;r<7;++r)e.table[r]=0;for(e.table[7]=24,e.table[8]=152,e.table[9]=112,r=0;r<24;++r)e.trans[r]=256+r;for(r=0;r<144;++r)e.trans[24+r]=r;for(r=0;r<8;++r)e.trans[168+r]=280+r;for(r=0;r<112;++r)e.trans[176+r]=144+r;for(r=0;r<5;++r)t.table[r]=0;for(t.table[5]=32,r=0;r<32;++r)t.trans[r]=r}(i,l),n(p,c,4,3),n(h,f,2,1),p[28]=0,c[28]=258;var a=function(e,t){var r,n,a=new s(e,t);do{switch(r=b(a),S(a,2,0)){case 0:n=k(a);break;case 1:n=U(a,i,l);break;case 2:T(a,a.ltree,a.dtree),n=U(a,a.ltree,a.dtree);break;default:n=o}if(n!==u)throw new Error("Data error")}while(!r);return a.destLen<a.dest.length?"function"==typeof a.dest.slice?a.dest.slice(0,a.destLen):a.dest.subarray(0,a.destLen):a.dest};function R(e,t,r,n,a){return Math.pow(1-a,3)*e+3*Math.pow(1-a,2)*a*t+3*(1-a)*Math.pow(a,2)*r+Math.pow(a,3)*n}function E(){this.x1=Number.NaN,this.y1=Number.NaN,this.x2=Number.NaN,this.y2=Number.NaN}function B(){this.commands=[],this.fill="black",this.stroke=null,this.strokeWidth=1}function L(e){throw new Error(e)}function C(e,t){e||L(t)}E.prototype.isEmpty=function(){return isNaN(this.x1)||isNaN(this.y1)||isNaN(this.x2)||isNaN(this.y2)},E.prototype.addPoint=function(e,t){"number"==typeof e&&((isNaN(this.x1)||isNaN(this.x2))&&(this.x1=e,this.x2=e),e<this.x1&&(this.x1=e),e>this.x2&&(this.x2=e)),"number"==typeof t&&((isNaN(this.y1)||isNaN(this.y2))&&(this.y1=t,this.y2=t),t<this.y1&&(this.y1=t),t>this.y2&&(this.y2=t))},E.prototype.addX=function(e){this.addPoint(e,null)},E.prototype.addY=function(e){this.addPoint(null,e)},E.prototype.addBezier=function(e,t,r,n,a,o,s,i){var u=[e,t],l=[r,n],p=[a,o],c=[s,i];this.addPoint(e,t),this.addPoint(s,i);for(var h=0;h<=1;h++){var f=6*u[h]-12*l[h]+6*p[h],d=-3*u[h]+9*l[h]-9*p[h]+3*c[h],v=3*l[h]-3*u[h];if(0!=d){var g=Math.pow(f,2)-4*v*d;if(!(g<0)){var m=(-f+Math.sqrt(g))/(2*d);0<m&&m<1&&(0===h&&this.addX(R(u[h],l[h],p[h],c[h],m)),1===h&&this.addY(R(u[h],l[h],p[h],c[h],m)));var y=(-f-Math.sqrt(g))/(2*d);0<y&&y<1&&(0===h&&this.addX(R(u[h],l[h],p[h],c[h],y)),1===h&&this.addY(R(u[h],l[h],p[h],c[h],y)))}}else{if(0==f)continue;var b=-v/f;0<b&&b<1&&(0===h&&this.addX(R(u[h],l[h],p[h],c[h],b)),1===h&&this.addY(R(u[h],l[h],p[h],c[h],b)))}}},E.prototype.addQuad=function(e,t,r,n,a,o){var s=e+2/3*(r-e),i=t+2/3*(n-t),u=s+1/3*(a-e),l=i+1/3*(o-t);this.addBezier(e,t,s,i,u,l,a,o)},B.prototype.moveTo=function(e,t){this.commands.push({type:"M",x:e,y:t})},B.prototype.lineTo=function(e,t){this.commands.push({type:"L",x:e,y:t})},B.prototype.curveTo=B.prototype.bezierCurveTo=function(e,t,r,n,a,o){this.commands.push({type:"C",x1:e,y1:t,x2:r,y2:n,x:a,y:o})},B.prototype.quadTo=B.prototype.quadraticCurveTo=function(e,t,r,n){this.commands.push({type:"Q",x1:e,y1:t,x:r,y:n})},B.prototype.close=B.prototype.closePath=function(){this.commands.push({type:"Z"})},B.prototype.extend=function(e){if(e.commands)e=e.commands;else if(e instanceof E){var t=e;return this.moveTo(t.x1,t.y1),this.lineTo(t.x2,t.y1),this.lineTo(t.x2,t.y2),this.lineTo(t.x1,t.y2),void this.close()}Array.prototype.push.apply(this.commands,e)},B.prototype.getBoundingBox=function(){for(var e=new E,t=0,r=0,n=0,a=0,o=0;o<this.commands.length;o++){var s=this.commands[o];switch(s.type){case"M":e.addPoint(s.x,s.y),t=n=s.x,r=a=s.y;break;case"L":e.addPoint(s.x,s.y),n=s.x,a=s.y;break;case"Q":e.addQuad(n,a,s.x1,s.y1,s.x,s.y),n=s.x,a=s.y;break;case"C":e.addBezier(n,a,s.x1,s.y1,s.x2,s.y2,s.x,s.y),n=s.x,a=s.y;break;case"Z":n=t,a=r;break;default:throw new Error("Unexpected path command "+s.type)}}return e.isEmpty()&&e.addPoint(0,0),e},B.prototype.draw=function(e){e.beginPath();for(var t=0;t<this.commands.length;t+=1){var r=this.commands[t];"M"===r.type?e.moveTo(r.x,r.y):"L"===r.type?e.lineTo(r.x,r.y):"C"===r.type?e.bezierCurveTo(r.x1,r.y1,r.x2,r.y2,r.x,r.y):"Q"===r.type?e.quadraticCurveTo(r.x1,r.y1,r.x,r.y):"Z"===r.type&&e.closePath()}this.fill&&(e.fillStyle=this.fill,e.fill()),this.stroke&&(e.strokeStyle=this.stroke,e.lineWidth=this.strokeWidth,e.stroke())},B.prototype.toPathData=function(o){function e(){for(var e,t=arguments,r="",n=0;n<arguments.length;n+=1){var a=t[n];0<=a&&0<n&&(r+=" "),r+=(e=a,Math.round(e)===e?""+Math.round(e):e.toFixed(o))}return r}o=void 0!==o?o:2;for(var t="",r=0;r<this.commands.length;r+=1){var n=this.commands[r];"M"===n.type?t+="M"+e(n.x,n.y):"L"===n.type?t+="L"+e(n.x,n.y):"C"===n.type?t+="C"+e(n.x1,n.y1,n.x2,n.y2,n.x,n.y):"Q"===n.type?t+="Q"+e(n.x1,n.y1,n.x,n.y):"Z"===n.type&&(t+="Z")}return t},B.prototype.toSVG=function(e){var t='<path d="';return t+=this.toPathData(e),t+='"',this.fill&&"black"!==this.fill&&(null===this.fill?t+=' fill="none"':t+=' fill="'+this.fill+'"'),this.stroke&&(t+=' stroke="'+this.stroke+'" stroke-width="'+this.strokeWidth+'"'),t+="/>"},B.prototype.toDOMElement=function(e){var t=this.toPathData(e),r=document.createElementNS("http://www.w3.org/2000/svg","path");return r.setAttribute("d",t),r};var w={fail:L,argument:C,assert:C},D=2147483648,I={},G={},M={};function A(e){return function(){return e}}G.BYTE=function(e){return w.argument(0<=e&&e<=255,"Byte value should be between 0 and 255."),[e]},M.BYTE=A(1),G.CHAR=function(e){return[e.charCodeAt(0)]},M.CHAR=A(1),G.CHARARRAY=function(e){void 0===e&&(e="",console.warn("Undefined CHARARRAY encountered and treated as an empty string. This is probably caused by a missing glyph name."));for(var t=[],r=0;r<e.length;r+=1)t[r]=e.charCodeAt(r);return t},M.CHARARRAY=function(e){return void 0===e?0:e.length},G.USHORT=function(e){return[e>>8&255,255&e]},M.USHORT=A(2),G.SHORT=function(e){return 32768<=e&&(e=-(65536-e)),[e>>8&255,255&e]},M.SHORT=A(2),G.UINT24=function(e){return[e>>16&255,e>>8&255,255&e]},M.UINT24=A(3),G.ULONG=function(e){return[e>>24&255,e>>16&255,e>>8&255,255&e]},M.ULONG=A(4),G.LONG=function(e){return D<=e&&(e=-(2*D-e)),[e>>24&255,e>>16&255,e>>8&255,255&e]},M.LONG=A(4),G.FIXED=G.ULONG,M.FIXED=M.ULONG,G.FWORD=G.SHORT,M.FWORD=M.SHORT,G.UFWORD=G.USHORT,M.UFWORD=M.USHORT,G.LONGDATETIME=function(e){return[0,0,0,0,e>>24&255,e>>16&255,e>>8&255,255&e]},M.LONGDATETIME=A(8),G.TAG=function(e){return w.argument(4===e.length,"Tag should be exactly 4 ASCII characters."),[e.charCodeAt(0),e.charCodeAt(1),e.charCodeAt(2),e.charCodeAt(3)]},M.TAG=A(4),G.Card8=G.BYTE,M.Card8=M.BYTE,G.Card16=G.USHORT,M.Card16=M.USHORT,G.OffSize=G.BYTE,M.OffSize=M.BYTE,G.SID=G.USHORT,M.SID=M.USHORT,G.NUMBER=function(e){return-107<=e&&e<=107?[e+139]:108<=e&&e<=1131?[247+((e-=108)>>8),255&e]:-1131<=e&&e<=-108?[251+((e=-e-108)>>8),255&e]:-32768<=e&&e<=32767?G.NUMBER16(e):G.NUMBER32(e)},M.NUMBER=function(e){return G.NUMBER(e).length},G.NUMBER16=function(e){return[28,e>>8&255,255&e]},M.NUMBER16=A(3),G.NUMBER32=function(e){return[29,e>>24&255,e>>16&255,e>>8&255,255&e]},M.NUMBER32=A(5),G.REAL=function(e){var t=e.toString(),r=/\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(t);if(r){var n=parseFloat("1e"+((r[2]?+r[2]:0)+r[1].length));t=(Math.round(e*n)/n).toString()}for(var a="",o=0,s=t.length;o<s;o+=1){var i=t[o];a+="e"===i?"-"===t[++o]?"c":"b":"."===i?"a":"-"===i?"e":i}for(var u=[30],l=0,p=(a+=1&a.length?"f":"ff").length;l<p;l+=2)u.push(parseInt(a.substr(l,2),16));return u},M.REAL=function(e){return G.REAL(e).length},G.NAME=G.CHARARRAY,M.NAME=M.CHARARRAY,G.STRING=G.CHARARRAY,M.STRING=M.CHARARRAY,I.UTF8=function(e,t,r){for(var n=[],a=r,o=0;o<a;o++,t+=1)n[o]=e.getUint8(t);return String.fromCharCode.apply(null,n)},I.UTF16=function(e,t,r){for(var n=[],a=r/2,o=0;o<a;o++,t+=2)n[o]=e.getUint16(t);return String.fromCharCode.apply(null,n)},G.UTF16=function(e){for(var t=[],r=0;r<e.length;r+=1){var n=e.charCodeAt(r);t[t.length]=n>>8&255,t[t.length]=255&n}return t},M.UTF16=function(e){return 2*e.length};var F={"x-mac-croatian":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ","x-mac-cyrillic":"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю","x-mac-gaelic":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæøṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ","x-mac-greek":"Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ­","x-mac-icelandic":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-inuit":"ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł","x-mac-ce":"ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ",macintosh:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-romanian":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-turkish":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ"};I.MACSTRING=function(e,t,r,n){var a=F[n];if(void 0!==a){for(var o="",s=0;s<r;s++){var i=e.getUint8(t+s);o+=i<=127?String.fromCharCode(i):a[127&i]}return o}};var P,N="function"==typeof WeakMap&&new WeakMap;function H(e){return-128<=e&&e<=127}function z(e,t,r){for(var n=0,a=e.length;t<a&&n<64&&0===e[t];)++t,++n;return r.push(128|n-1),t}function W(e,t,r){for(var n=0,a=e.length,o=t;o<a&&n<64;){var s=e[o];if(!H(s))break;if(0===s&&o+1<a&&0===e[o+1])break;++o,++n}r.push(n-1);for(var i=t;i<o;++i)r.push(e[i]+256&255);return o}function _(e,t,r){for(var n=0,a=e.length,o=t;o<a&&n<64;){var s=e[o];if(0===s)break;if(H(s)&&o+1<a&&H(e[o+1]))break;++o,++n}r.push(64|n-1);for(var i=t;i<o;++i){var u=e[i];r.push(u+65536>>8&255,u+256&255)}return o}G.MACSTRING=function(e,t){var r=function(e){if(!P)for(var t in P={},F)P[t]=new String(t);var r=P[e];if(void 0!==r){if(N){var n=N.get(r);if(void 0!==n)return n}var a=F[e];if(void 0!==a){for(var o={},s=0;s<a.length;s++)o[a.charCodeAt(s)]=s+128;return N&&N.set(r,o),o}}}(t);if(void 0!==r){for(var n=[],a=0;a<e.length;a++){var o=e.charCodeAt(a);if(128<=o&&void 0===(o=r[o]))return;n[a]=o}return n}},M.MACSTRING=function(e,t){var r=G.MACSTRING(e,t);return void 0!==r?r.length:0},G.VARDELTAS=function(e){for(var t=0,r=[];t<e.length;){var n=e[t];t=(0===n?z:-128<=n&&n<=127?W:_)(e,t,r)}return r},G.INDEX=function(e){for(var t=1,r=[t],n=[],a=0;a<e.length;a+=1){var o=G.OBJECT(e[a]);Array.prototype.push.apply(n,o),t+=o.length,r.push(t)}if(0===n.length)return[0,0];for(var s=[],i=1+Math.floor(Math.log(t)/Math.log(2))/8|0,u=[void 0,G.BYTE,G.USHORT,G.UINT24,G.ULONG][i],l=0;l<r.length;l+=1){var p=u(r[l]);Array.prototype.push.apply(s,p)}return Array.prototype.concat(G.Card16(e.length),G.OffSize(i),s,n)},M.INDEX=function(e){return G.INDEX(e).length},G.DICT=function(e){for(var t=[],r=Object.keys(e),n=r.length,a=0;a<n;a+=1){var o=parseInt(r[a],0),s=e[o];t=(t=t.concat(G.OPERAND(s.value,s.type))).concat(G.OPERATOR(o))}return t},M.DICT=function(e){return G.DICT(e).length},G.OPERATOR=function(e){return e<1200?[e]:[12,e-1200]},G.OPERAND=function(e,t){var r=[];if(Array.isArray(t))for(var n=0;n<t.length;n+=1)w.argument(e.length===t.length,"Not enough arguments given for type"+t),r=r.concat(G.OPERAND(e[n],t[n]));else if("SID"===t)r=r.concat(G.NUMBER(e));else if("offset"===t)r=r.concat(G.NUMBER32(e));else if("number"===t)r=r.concat(G.NUMBER(e));else{if("real"!==t)throw new Error("Unknown operand type "+t);r=r.concat(G.REAL(e))}return r},G.OP=G.BYTE,M.OP=M.BYTE;var q="function"==typeof WeakMap&&new WeakMap;function X(e,t,r){if(t.length&&("coverageFormat"!==t[0].name||1===t[0].value))for(var n=0;n<t.length;n+=1){var a=t[n];this[a.name]=a.value}if(this.tableName=e,this.fields=t,r)for(var o=Object.keys(r),s=0;s<o.length;s+=1){var i=o[s],u=r[i];void 0!==this[i]&&(this[i]=u)}}function V(e,t,r){void 0===r&&(r=t.length);var n=new Array(t.length+1);n[0]={name:e+"Count",type:"USHORT",value:r};for(var a=0;a<t.length;a++)n[a+1]={name:e+a,type:"USHORT",value:t[a]};return n}function Y(e,t,r){var n=t.length,a=new Array(n+1);a[0]={name:e+"Count",type:"USHORT",value:n};for(var o=0;o<n;o++)a[o+1]={name:e+o,type:"TABLE",value:r(t[o],o)};return a}function j(e,t,r){var n=t.length,a=[];a[0]={name:e+"Count",type:"USHORT",value:n};for(var o=0;o<n;o++)a=a.concat(r(t[o],o));return a}function Z(e){1===e.format?X.call(this,"coverageTable",[{name:"coverageFormat",type:"USHORT",value:1}].concat(V("glyph",e.glyphs))):2===e.format?X.call(this,"coverageTable",[{name:"coverageFormat",type:"USHORT",value:2}].concat(j("rangeRecord",e.ranges,function(e){return[{name:"startGlyphID",type:"USHORT",value:e.start},{name:"endGlyphID",type:"USHORT",value:e.end},{name:"startCoverageIndex",type:"USHORT",value:e.index}]}))):w.assert(!1,"Coverage format must be 1 or 2.")}function Q(e){X.call(this,"scriptListTable",j("scriptRecord",e,function(e,t){var r=e.script,n=r.defaultLangSys;return w.assert(!!n,"Unable to write GSUB: script "+e.tag+" has no default language system."),[{name:"scriptTag"+t,type:"TAG",value:e.tag},{name:"script"+t,type:"TABLE",value:new X("scriptTable",[{name:"defaultLangSys",type:"TABLE",value:new X("defaultLangSys",[{name:"lookupOrder",type:"USHORT",value:0},{name:"reqFeatureIndex",type:"USHORT",value:n.reqFeatureIndex}].concat(V("featureIndex",n.featureIndexes)))}].concat(j("langSys",r.langSysRecords,function(e,t){var r=e.langSys;return[{name:"langSysTag"+t,type:"TAG",value:e.tag},{name:"langSys"+t,type:"TABLE",value:new X("langSys",[{name:"lookupOrder",type:"USHORT",value:0},{name:"reqFeatureIndex",type:"USHORT",value:r.reqFeatureIndex}].concat(V("featureIndex",r.featureIndexes)))}]})))}]}))}function K(e){X.call(this,"featureListTable",j("featureRecord",e,function(e,t){var r=e.feature;return[{name:"featureTag"+t,type:"TAG",value:e.tag},{name:"feature"+t,type:"TABLE",value:new X("featureTable",[{name:"featureParams",type:"USHORT",value:r.featureParams}].concat(V("lookupListIndex",r.lookupListIndexes)))}]}))}function J(e,r){X.call(this,"lookupListTable",Y("lookup",e,function(e){var t=r[e.lookupType];return w.assert(!!t,"Unable to write GSUB lookup type "+e.lookupType+" tables."),new X("lookupTable",[{name:"lookupType",type:"USHORT",value:e.lookupType},{name:"lookupFlag",type:"USHORT",value:e.lookupFlag}].concat(Y("subtable",e.subtables,t)))}))}G.CHARSTRING=function(e){if(q){var t=q.get(e);if(void 0!==t)return t}for(var r=[],n=e.length,a=0;a<n;a+=1){var o=e[a];r=r.concat(G[o.type](o.value))}return q&&q.set(e,r),r},M.CHARSTRING=function(e){return G.CHARSTRING(e).length},G.OBJECT=function(e){var t=G[e.type];return w.argument(void 0!==t,"No encoding function for type "+e.type),t(e.value)},M.OBJECT=function(e){var t=M[e.type];return w.argument(void 0!==t,"No sizeOf function for type "+e.type),t(e.value)},G.TABLE=function(e){for(var t=[],r=e.fields.length,n=[],a=[],o=0;o<r;o+=1){var s=e.fields[o],i=G[s.type];w.argument(void 0!==i,"No encoding function for field type "+s.type+" ("+s.name+")");var u=e[s.name];void 0===u&&(u=s.value);var l=i(u);"TABLE"===s.type?(a.push(t.length),t=t.concat([0,0]),n.push(l)):t=t.concat(l)}for(var p=0;p<n.length;p+=1){var c=a[p],h=t.length;w.argument(h<65536,"Table "+e.tableName+" too big."),t[c]=h>>8,t[c+1]=255&h,t=t.concat(n[p])}return t},M.TABLE=function(e){for(var t=0,r=e.fields.length,n=0;n<r;n+=1){var a=e.fields[n],o=M[a.type];w.argument(void 0!==o,"No sizeOf function for field type "+a.type+" ("+a.name+")");var s=e[a.name];void 0===s&&(s=a.value),t+=o(s),"TABLE"===a.type&&(t+=2)}return t},G.RECORD=G.TABLE,M.RECORD=M.TABLE,G.LITERAL=function(e){return e},M.LITERAL=function(e){return e.length},X.prototype.encode=function(){return G.TABLE(this)},X.prototype.sizeOf=function(){return M.TABLE(this)};var $={Table:X,Record:X,Coverage:(Z.prototype=Object.create(X.prototype)).constructor=Z,ScriptList:(Q.prototype=Object.create(X.prototype)).constructor=Q,FeatureList:(K.prototype=Object.create(X.prototype)).constructor=K,LookupList:(J.prototype=Object.create(X.prototype)).constructor=J,ushortList:V,tableList:Y,recordList:j};function ee(e,t){return e.getUint8(t)}function te(e,t){return e.getUint16(t,!1)}function re(e,t){return e.getUint32(t,!1)}function ne(e,t){return e.getInt16(t,!1)+e.getUint16(t+2,!1)/65535}var ae={byte:1,uShort:2,short:2,uLong:4,fixed:4,longDateTime:8,tag:4};function oe(e,t){this.data=e,this.offset=t,this.relativeOffset=0}oe.prototype.parseByte=function(){var e=this.data.getUint8(this.offset+this.relativeOffset);return this.relativeOffset+=1,e},oe.prototype.parseChar=function(){var e=this.data.getInt8(this.offset+this.relativeOffset);return this.relativeOffset+=1,e},oe.prototype.parseCard8=oe.prototype.parseByte,oe.prototype.parseCard16=oe.prototype.parseUShort=function(){var e=this.data.getUint16(this.offset+this.relativeOffset);return this.relativeOffset+=2,e},oe.prototype.parseSID=oe.prototype.parseUShort,oe.prototype.parseOffset16=oe.prototype.parseUShort,oe.prototype.parseShort=function(){var e=this.data.getInt16(this.offset+this.relativeOffset);return this.relativeOffset+=2,e},oe.prototype.parseF2Dot14=function(){var e=this.data.getInt16(this.offset+this.relativeOffset)/16384;return this.relativeOffset+=2,e},oe.prototype.parseOffset32=oe.prototype.parseULong=function(){var e=re(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,e},oe.prototype.parseFixed=function(){var e=ne(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,e},oe.prototype.parseString=function(e){var t=this.data,r=this.offset+this.relativeOffset,n="";this.relativeOffset+=e;for(var a=0;a<e;a++)n+=String.fromCharCode(t.getUint8(r+a));return n},oe.prototype.parseTag=function(){return this.parseString(4)},oe.prototype.parseLongDateTime=function(){var e=re(this.data,this.offset+this.relativeOffset+4);return e-=2082844800,this.relativeOffset+=8,e},oe.prototype.parseVersion=function(e){var t=te(this.data,this.offset+this.relativeOffset),r=te(this.data,this.offset+this.relativeOffset+2);return this.relativeOffset+=4,void 0===e&&(e=4096),t+r/e/10},oe.prototype.skip=function(e,t){void 0===t&&(t=1),this.relativeOffset+=ae[e]*t},oe.prototype.parseULongList=function(e){void 0===e&&(e=this.parseULong());for(var t=new Array(e),r=this.data,n=this.offset+this.relativeOffset,a=0;a<e;a++)t[a]=r.getUint32(n),n+=4;return this.relativeOffset+=4*e,t},oe.prototype.parseOffset16List=oe.prototype.parseUShortList=function(e){void 0===e&&(e=this.parseUShort());for(var t=new Array(e),r=this.data,n=this.offset+this.relativeOffset,a=0;a<e;a++)t[a]=r.getUint16(n),n+=2;return this.relativeOffset+=2*e,t},oe.prototype.parseShortList=function(e){for(var t=new Array(e),r=this.data,n=this.offset+this.relativeOffset,a=0;a<e;a++)t[a]=r.getInt16(n),n+=2;return this.relativeOffset+=2*e,t},oe.prototype.parseByteList=function(e){for(var t=new Array(e),r=this.data,n=this.offset+this.relativeOffset,a=0;a<e;a++)t[a]=r.getUint8(n++);return this.relativeOffset+=e,t},oe.prototype.parseList=function(e,t){t||(t=e,e=this.parseUShort());for(var r=new Array(e),n=0;n<e;n++)r[n]=t.call(this);return r},oe.prototype.parseList32=function(e,t){t||(t=e,e=this.parseULong());for(var r=new Array(e),n=0;n<e;n++)r[n]=t.call(this);return r},oe.prototype.parseRecordList=function(e,t){t||(t=e,e=this.parseUShort());for(var r=new Array(e),n=Object.keys(t),a=0;a<e;a++){for(var o={},s=0;s<n.length;s++){var i=n[s],u=t[i];o[i]=u.call(this)}r[a]=o}return r},oe.prototype.parseRecordList32=function(e,t){t||(t=e,e=this.parseULong());for(var r=new Array(e),n=Object.keys(t),a=0;a<e;a++){for(var o={},s=0;s<n.length;s++){var i=n[s],u=t[i];o[i]=u.call(this)}r[a]=o}return r},oe.prototype.parseStruct=function(e){if("function"==typeof e)return e.call(this);for(var t=Object.keys(e),r={},n=0;n<t.length;n++){var a=t[n],o=e[a];r[a]=o.call(this)}return r},oe.prototype.parseValueRecord=function(e){if(void 0===e&&(e=this.parseUShort()),0!==e){var t={};return 1&e&&(t.xPlacement=this.parseShort()),2&e&&(t.yPlacement=this.parseShort()),4&e&&(t.xAdvance=this.parseShort()),8&e&&(t.yAdvance=this.parseShort()),16&e&&(t.xPlaDevice=void 0,this.parseShort()),32&e&&(t.yPlaDevice=void 0,this.parseShort()),64&e&&(t.xAdvDevice=void 0,this.parseShort()),128&e&&(t.yAdvDevice=void 0,this.parseShort()),t}},oe.prototype.parseValueRecordList=function(){for(var e=this.parseUShort(),t=this.parseUShort(),r=new Array(t),n=0;n<t;n++)r[n]=this.parseValueRecord(e);return r},oe.prototype.parsePointer=function(e){var t=this.parseOffset16();if(0<t)return new oe(this.data,this.offset+t).parseStruct(e)},oe.prototype.parsePointer32=function(e){var t=this.parseOffset32();if(0<t)return new oe(this.data,this.offset+t).parseStruct(e)},oe.prototype.parseListOfLists=function(e){for(var t=this.parseOffset16List(),r=t.length,n=this.relativeOffset,a=new Array(r),o=0;o<r;o++){var s=t[o];if(0!==s)if(this.relativeOffset=s,e){for(var i=this.parseOffset16List(),u=new Array(i.length),l=0;l<i.length;l++)this.relativeOffset=s+i[l],u[l]=e.call(this);a[o]=u}else a[o]=this.parseUShortList();else a[o]=void 0}return this.relativeOffset=n,a},oe.prototype.parseCoverage=function(){var e=this.offset+this.relativeOffset,t=this.parseUShort(),r=this.parseUShort();if(1===t)return{format:1,glyphs:this.parseUShortList(r)};if(2!==t)throw new Error("0x"+e.toString(16)+": Coverage format must be 1 or 2.");for(var n=new Array(r),a=0;a<r;a++)n[a]={start:this.parseUShort(),end:this.parseUShort(),index:this.parseUShort()};return{format:2,ranges:n}},oe.prototype.parseClassDef=function(){var e=this.offset+this.relativeOffset,t=this.parseUShort();if(1===t)return{format:1,startGlyph:this.parseUShort(),classes:this.parseUShortList()};if(2===t)return{format:2,ranges:this.parseRecordList({start:oe.uShort,end:oe.uShort,classId:oe.uShort})};throw new Error("0x"+e.toString(16)+": ClassDef format must be 1 or 2.")},oe.list=function(e,t){return function(){return this.parseList(e,t)}},oe.list32=function(e,t){return function(){return this.parseList32(e,t)}},oe.recordList=function(e,t){return function(){return this.parseRecordList(e,t)}},oe.recordList32=function(e,t){return function(){return this.parseRecordList32(e,t)}},oe.pointer=function(e){return function(){return this.parsePointer(e)}},oe.pointer32=function(e){return function(){return this.parsePointer32(e)}},oe.tag=oe.prototype.parseTag,oe.byte=oe.prototype.parseByte,oe.uShort=oe.offset16=oe.prototype.parseUShort,oe.uShortList=oe.prototype.parseUShortList,oe.uLong=oe.offset32=oe.prototype.parseULong,oe.uLongList=oe.prototype.parseULongList,oe.struct=oe.prototype.parseStruct,oe.coverage=oe.prototype.parseCoverage,oe.classDef=oe.prototype.parseClassDef;var se={reserved:oe.uShort,reqFeatureIndex:oe.uShort,featureIndexes:oe.uShortList};oe.prototype.parseScriptList=function(){return this.parsePointer(oe.recordList({tag:oe.tag,script:oe.pointer({defaultLangSys:oe.pointer(se),langSysRecords:oe.recordList({tag:oe.tag,langSys:oe.pointer(se)})})}))||[]},oe.prototype.parseFeatureList=function(){return this.parsePointer(oe.recordList({tag:oe.tag,feature:oe.pointer({featureParams:oe.offset16,lookupListIndexes:oe.uShortList})}))||[]},oe.prototype.parseLookupList=function(n){return this.parsePointer(oe.list(oe.pointer(function(){var e=this.parseUShort();w.argument(1<=e&&e<=9,"GPOS/GSUB lookup type "+e+" unknown.");var t=this.parseUShort(),r=16&t;return{lookupType:e,lookupFlag:t,subtables:this.parseList(oe.pointer(n[e])),markFilteringSet:r?this.parseUShort():void 0}})))||[]},oe.prototype.parseFeatureVariationsList=function(){return this.parsePointer32(function(){var e=this.parseUShort(),t=this.parseUShort();return w.argument(1===e&&t<1,"GPOS/GSUB feature variations table unknown."),this.parseRecordList32({conditionSetOffset:oe.offset32,featureTableSubstitutionOffset:oe.offset32})})||[]};var ie={getByte:ee,getCard8:ee,getUShort:te,getCard16:te,getShort:function(e,t){return e.getInt16(t,!1)},getULong:re,getFixed:ne,getTag:function(e,t){for(var r="",n=t;n<t+4;n+=1)r+=String.fromCharCode(e.getInt8(n));return r},getOffset:function(e,t,r){for(var n=0,a=0;a<r;a+=1)n<<=8,n+=e.getUint8(t+a);return n},getBytes:function(e,t,r){for(var n=[],a=t;a<r;a+=1)n.push(e.getUint8(a));return n},bytesToString:function(e){for(var t="",r=0;r<e.length;r+=1)t+=String.fromCharCode(e[r]);return t},Parser:oe};var ue={parse:function(e,t){var r={};r.version=ie.getUShort(e,t),w.argument(0===r.version,"cmap table version should be 0."),r.numTables=ie.getUShort(e,t+2);for(var n=-1,a=r.numTables-1;0<=a;--a){var o=ie.getUShort(e,t+4+8*a),s=ie.getUShort(e,t+4+8*a+2);if(3===o&&(0===s||1===s||10===s)||0===o&&(0===s||1===s||2===s||3===s||4===s)){n=ie.getULong(e,t+4+8*a+4);break}}if(-1===n)throw new Error("No valid cmap sub-tables found.");var i=new ie.Parser(e,t+n);if(r.format=i.parseUShort(),12===r.format)!function(e,t){var r;t.parseUShort(),e.length=t.parseULong(),e.language=t.parseULong(),e.groupCount=r=t.parseULong(),e.glyphIndexMap={};for(var n=0;n<r;n+=1)for(var a=t.parseULong(),o=t.parseULong(),s=t.parseULong(),i=a;i<=o;i+=1)e.glyphIndexMap[i]=s,s++}(r,i);else{if(4!==r.format)throw new Error("Only format 4 and 12 cmap tables are supported (found format "+r.format+").");!function(e,t,r,n,a){var o;e.length=t.parseUShort(),e.language=t.parseUShort(),e.segCount=o=t.parseUShort()>>1,t.skip("uShort",3),e.glyphIndexMap={};for(var s=new ie.Parser(r,n+a+14),i=new ie.Parser(r,n+a+16+2*o),u=new ie.Parser(r,n+a+16+4*o),l=new ie.Parser(r,n+a+16+6*o),p=n+a+16+8*o,c=0;c<o-1;c+=1)for(var h=void 0,f=s.parseUShort(),d=i.parseUShort(),v=u.parseShort(),g=l.parseUShort(),m=d;m<=f;m+=1)0!==g?(p=l.offset+l.relativeOffset-2,p+=g,p+=2*(m-d),0!==(h=ie.getUShort(r,p))&&(h=h+v&65535)):h=m+v&65535,e.glyphIndexMap[m]=h}(r,i,e,t,n)}return r},make:function(e){var t,r=!0;for(t=e.length-1;0<t;--t){if(65535<e.get(t).unicode){console.log("Adding CMAP format 12 (needed!)"),r=!1;break}}var n=[{name:"version",type:"USHORT",value:0},{name:"numTables",type:"USHORT",value:r?1:2},{name:"platformID",type:"USHORT",value:3},{name:"encodingID",type:"USHORT",value:1},{name:"offset",type:"ULONG",value:r?12:20}];r||(n=n.concat([{name:"cmap12PlatformID",type:"USHORT",value:3},{name:"cmap12EncodingID",type:"USHORT",value:10},{name:"cmap12Offset",type:"ULONG",value:0}])),n=n.concat([{name:"format",type:"USHORT",value:4},{name:"cmap4Length",type:"USHORT",value:0},{name:"language",type:"USHORT",value:0},{name:"segCountX2",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);var a,o,s,i=new $.Table("cmap",n);for(i.segments=[],t=0;t<e.length;t+=1){for(var u=e.get(t),l=0;l<u.unicodes.length;l+=1)a=i,o=u.unicodes[l],s=t,a.segments.push({end:o,start:o,delta:-(o-s),offset:0,glyphIndex:s});i.segments=i.segments.sort(function(e,t){return e.start-t.start})}i.segments.push({end:65535,start:65535,delta:1,offset:0});var p=i.segments.length,c=0,h=[],f=[],d=[],v=[],g=[],m=[];for(t=0;t<p;t+=1){var y=i.segments[t];y.end<=65535&&y.start<=65535?(h=h.concat({name:"end_"+t,type:"USHORT",value:y.end}),f=f.concat({name:"start_"+t,type:"USHORT",value:y.start}),d=d.concat({name:"idDelta_"+t,type:"SHORT",value:y.delta}),v=v.concat({name:"idRangeOffset_"+t,type:"USHORT",value:y.offset}),void 0!==y.glyphId&&(g=g.concat({name:"glyph_"+t,type:"USHORT",value:y.glyphId}))):c+=1,r||void 0===y.glyphIndex||(m=(m=(m=m.concat({name:"cmap12Start_"+t,type:"ULONG",value:y.start})).concat({name:"cmap12End_"+t,type:"ULONG",value:y.end})).concat({name:"cmap12Glyph_"+t,type:"ULONG",value:y.glyphIndex}))}if(i.segCountX2=2*(p-c),i.searchRange=2*Math.pow(2,Math.floor(Math.log(p-c)/Math.log(2))),i.entrySelector=Math.log(i.searchRange/2)/Math.log(2),i.rangeShift=i.segCountX2-i.searchRange,i.fields=i.fields.concat(h),i.fields.push({name:"reservedPad",type:"USHORT",value:0}),i.fields=i.fields.concat(f),i.fields=i.fields.concat(d),i.fields=i.fields.concat(v),i.fields=i.fields.concat(g),i.cmap4Length=14+2*h.length+2+2*f.length+2*d.length+2*v.length+2*g.length,!r){var b=16+4*m.length;i.cmap12Offset=20+i.cmap4Length,i.fields=i.fields.concat([{name:"cmap12Format",type:"USHORT",value:12},{name:"cmap12Reserved",type:"USHORT",value:0},{name:"cmap12Length",type:"ULONG",value:b},{name:"cmap12Language",type:"ULONG",value:0},{name:"cmap12nGroups",type:"ULONG",value:m.length/3}]),i.fields=i.fields.concat(m)}return i}},le=[".notdef","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","endash","dagger","daggerdbl","periodcentered","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","questiondown","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","ring","cedilla","hungarumlaut","ogonek","caron","emdash","AE","ordfeminine","Lslash","Oslash","OE","ordmasculine","ae","dotlessi","lslash","oslash","oe","germandbls","onesuperior","logicalnot","mu","trademark","Eth","onehalf","plusminus","Thorn","onequarter","divide","brokenbar","degree","thorn","threequarters","twosuperior","registered","minus","eth","multiply","threesuperior","copyright","Aacute","Acircumflex","Adieresis","Agrave","Aring","Atilde","Ccedilla","Eacute","Ecircumflex","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Ntilde","Oacute","Ocircumflex","Odieresis","Ograve","Otilde","Scaron","Uacute","Ucircumflex","Udieresis","Ugrave","Yacute","Ydieresis","Zcaron","aacute","acircumflex","adieresis","agrave","aring","atilde","ccedilla","eacute","ecircumflex","edieresis","egrave","iacute","icircumflex","idieresis","igrave","ntilde","oacute","ocircumflex","odieresis","ograve","otilde","scaron","uacute","ucircumflex","udieresis","ugrave","yacute","ydieresis","zcaron","exclamsmall","Hungarumlautsmall","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","266 ff","onedotenleader","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","commasuperior","threequartersemdash","periodsuperior","questionsmall","asuperior","bsuperior","centsuperior","dsuperior","esuperior","isuperior","lsuperior","msuperior","nsuperior","osuperior","rsuperior","ssuperior","tsuperior","ff","ffi","ffl","parenleftinferior","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","exclamdownsmall","centoldstyle","Lslashsmall","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","Dotaccentsmall","Macronsmall","figuredash","hypheninferior","Ogoneksmall","Ringsmall","Cedillasmall","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","zerosuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall","001.000","001.001","001.002","001.003","Black","Bold","Book","Light","Medium","Regular","Roman","Semibold"],pe=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","","endash","dagger","daggerdbl","periodcentered","","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","","questiondown","","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","","ring","cedilla","","hungarumlaut","ogonek","caron","emdash","","","","","","","","","","","","","","","","","AE","","ordfeminine","","","","","Lslash","Oslash","OE","ordmasculine","","","","","","ae","","","","dotlessi","","","lslash","oslash","oe","germandbls"],ce=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclamsmall","Hungarumlautsmall","","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","twodotenleader","onedotenleader","comma","hyphen","period","fraction","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","colon","semicolon","commasuperior","threequartersemdash","periodsuperior","questionsmall","","asuperior","bsuperior","centsuperior","dsuperior","esuperior","","","isuperior","","","lsuperior","msuperior","nsuperior","osuperior","","","rsuperior","ssuperior","tsuperior","","ff","fi","fl","ffi","ffl","parenleftinferior","","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdownsmall","centoldstyle","Lslashsmall","","","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","","Dotaccentsmall","","","Macronsmall","","","figuredash","hypheninferior","","","Ogoneksmall","Ringsmall","Cedillasmall","","","","onequarter","onehalf","threequarters","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","","","zerosuperior","onesuperior","twosuperior","threesuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall"],he=[".notdef",".null","nonmarkingreturn","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quotesingle","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","grave","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","Adieresis","Aring","Ccedilla","Eacute","Ntilde","Odieresis","Udieresis","aacute","agrave","acircumflex","adieresis","atilde","aring","ccedilla","eacute","egrave","ecircumflex","edieresis","iacute","igrave","icircumflex","idieresis","ntilde","oacute","ograve","ocircumflex","odieresis","otilde","uacute","ugrave","ucircumflex","udieresis","dagger","degree","cent","sterling","section","bullet","paragraph","germandbls","registered","copyright","trademark","acute","dieresis","notequal","AE","Oslash","infinity","plusminus","lessequal","greaterequal","yen","mu","partialdiff","summation","product","pi","integral","ordfeminine","ordmasculine","Omega","ae","oslash","questiondown","exclamdown","logicalnot","radical","florin","approxequal","Delta","guillemotleft","guillemotright","ellipsis","nonbreakingspace","Agrave","Atilde","Otilde","OE","oe","endash","emdash","quotedblleft","quotedblright","quoteleft","quoteright","divide","lozenge","ydieresis","Ydieresis","fraction","currency","guilsinglleft","guilsinglright","fi","fl","daggerdbl","periodcentered","quotesinglbase","quotedblbase","perthousand","Acircumflex","Ecircumflex","Aacute","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Oacute","Ocircumflex","apple","Ograve","Uacute","Ucircumflex","Ugrave","dotlessi","circumflex","tilde","macron","breve","dotaccent","ring","cedilla","hungarumlaut","ogonek","caron","Lslash","lslash","Scaron","scaron","Zcaron","zcaron","brokenbar","Eth","eth","Yacute","yacute","Thorn","thorn","minus","multiply","onesuperior","twosuperior","threesuperior","onehalf","onequarter","threequarters","franc","Gbreve","gbreve","Idotaccent","Scedilla","scedilla","Cacute","cacute","Ccaron","ccaron","dcroat"];function fe(e){this.font=e}function de(e){this.cmap=e}function ve(e,t){this.encoding=e,this.charset=t}function ge(e){switch(e.version){case 1:this.names=he.slice();break;case 2:this.names=new Array(e.numberOfGlyphs);for(var t=0;t<e.numberOfGlyphs;t++)e.glyphNameIndex[t]<he.length?this.names[t]=he[e.glyphNameIndex[t]]:this.names[t]=e.names[e.glyphNameIndex[t]-he.length];break;case 2.5:this.names=new Array(e.numberOfGlyphs);for(var r=0;r<e.numberOfGlyphs;r++)this.names[r]=he[r+e.glyphNameIndex[r]];break;case 3:default:this.names=[]}}function me(e,t){(t.lowMemory?function(e){e._IndexToUnicodeMap={};for(var t=e.tables.cmap.glyphIndexMap,r=Object.keys(t),n=0;n<r.length;n+=1){var a=r[n],o=t[a];void 0===e._IndexToUnicodeMap[o]?e._IndexToUnicodeMap[o]={unicodes:[parseInt(a)]}:e._IndexToUnicodeMap[o].unicodes.push(parseInt(a))}}:function(e){for(var t,r=e.tables.cmap.glyphIndexMap,n=Object.keys(r),a=0;a<n.length;a+=1){var o=n[a],s=r[o];(t=e.glyphs.get(s)).addUnicode(parseInt(o))}for(var i=0;i<e.glyphs.length;i+=1)t=e.glyphs.get(i),e.cffEncoding?e.isCIDFont?t.name="gid"+i:t.name=e.cffEncoding.charset[i]:e.glyphNames.names&&(t.name=e.glyphNames.glyphIndexToName(i))})(e)}fe.prototype.charToGlyphIndex=function(e){var t=e.codePointAt(0),r=this.font.glyphs;if(r)for(var n=0;n<r.length;n+=1)for(var a=r.get(n),o=0;o<a.unicodes.length;o+=1)if(a.unicodes[o]===t)return n;return null},de.prototype.charToGlyphIndex=function(e){return this.cmap.glyphIndexMap[e.codePointAt(0)]||0},ve.prototype.charToGlyphIndex=function(e){var t=e.codePointAt(0),r=this.encoding[t];return this.charset.indexOf(r)},ge.prototype.nameToGlyphIndex=function(e){return this.names.indexOf(e)},ge.prototype.glyphIndexToName=function(e){return this.names[e]};var ye={line:function(e,t,r,n,a){e.beginPath(),e.moveTo(t,r),e.lineTo(n,a),e.stroke()}};function be(e){this.bindConstructorValues(e)}function Se(t,e,r){Object.defineProperty(t,e,{get:function(){return t.path,t[r]},set:function(e){t[r]=e},enumerable:!0,configurable:!0})}function xe(e,t){if(this.font=e,this.glyphs={},Array.isArray(t))for(var r=0;r<t.length;r++){var n=t[r];n.path.unitsPerEm=e.unitsPerEm,this.glyphs[r]=n}this.length=t&&t.length||0}be.prototype.bindConstructorValues=function(e){var t,r;this.index=e.index||0,this.name=e.name||null,this.unicode=e.unicode||void 0,this.unicodes=e.unicodes||void 0!==e.unicode?[e.unicode]:[],"xMin"in e&&(this.xMin=e.xMin),"yMin"in e&&(this.yMin=e.yMin),"xMax"in e&&(this.xMax=e.xMax),"yMax"in e&&(this.yMax=e.yMax),"advanceWidth"in e&&(this.advanceWidth=e.advanceWidth),Object.defineProperty(this,"path",(t=e.path,r=t||new B,{configurable:!0,get:function(){return"function"==typeof r&&(r=r()),r},set:function(e){r=e}}))},be.prototype.addUnicode=function(e){0===this.unicodes.length&&(this.unicode=e),this.unicodes.push(e)},be.prototype.getBoundingBox=function(){return this.path.getBoundingBox()},be.prototype.getPath=function(e,t,r,n,a){var o,s;e=void 0!==e?e:0,t=void 0!==t?t:0,r=void 0!==r?r:72;var i=(n=n||{}).xScale,u=n.yScale;if(n.hinting&&a&&a.hinting&&(s=this.path&&a.hinting.exec(this,r)),s)o=a.hinting.getCommands(s),e=Math.round(e),t=Math.round(t),i=u=1;else{o=this.path.commands;var l=1/(this.path.unitsPerEm||1e3)*r;void 0===i&&(i=l),void 0===u&&(u=l)}for(var p=new B,c=0;c<o.length;c+=1){var h=o[c];"M"===h.type?p.moveTo(e+h.x*i,t+-h.y*u):"L"===h.type?p.lineTo(e+h.x*i,t+-h.y*u):"Q"===h.type?p.quadraticCurveTo(e+h.x1*i,t+-h.y1*u,e+h.x*i,t+-h.y*u):"C"===h.type?p.curveTo(e+h.x1*i,t+-h.y1*u,e+h.x2*i,t+-h.y2*u,e+h.x*i,t+-h.y*u):"Z"===h.type&&p.closePath()}return p},be.prototype.getContours=function(){if(void 0===this.points)return[];for(var e=[],t=[],r=0;r<this.points.length;r+=1){var n=this.points[r];t.push(n),n.lastPointOfContour&&(e.push(t),t=[])}return w.argument(0===t.length,"There are still points left in the current contour."),e},be.prototype.getMetrics=function(){for(var e=this.path.commands,t=[],r=[],n=0;n<e.length;n+=1){var a=e[n];"Z"!==a.type&&(t.push(a.x),r.push(a.y)),"Q"!==a.type&&"C"!==a.type||(t.push(a.x1),r.push(a.y1)),"C"===a.type&&(t.push(a.x2),r.push(a.y2))}var o={xMin:Math.min.apply(null,t),yMin:Math.min.apply(null,r),xMax:Math.max.apply(null,t),yMax:Math.max.apply(null,r),leftSideBearing:this.leftSideBearing};return isFinite(o.xMin)||(o.xMin=0),isFinite(o.xMax)||(o.xMax=this.advanceWidth),isFinite(o.yMin)||(o.yMin=0),isFinite(o.yMax)||(o.yMax=0),o.rightSideBearing=this.advanceWidth-o.leftSideBearing-(o.xMax-o.xMin),o},be.prototype.draw=function(e,t,r,n,a){this.getPath(t,r,n,a).draw(e)},be.prototype.drawPoints=function(o,e,t,r){function n(e,t,r,n){o.beginPath();for(var a=0;a<e.length;a+=1)o.moveTo(t+e[a].x*n,r+e[a].y*n),o.arc(t+e[a].x*n,r+e[a].y*n,2,0,2*Math.PI,!1);o.closePath(),o.fill()}e=void 0!==e?e:0,t=void 0!==t?t:0,r=void 0!==r?r:24;for(var a=1/this.path.unitsPerEm*r,s=[],i=[],u=this.path,l=0;l<u.commands.length;l+=1){var p=u.commands[l];void 0!==p.x&&s.push({x:p.x,y:-p.y}),void 0!==p.x1&&i.push({x:p.x1,y:-p.y1}),void 0!==p.x2&&i.push({x:p.x2,y:-p.y2})}o.fillStyle="blue",n(s,e,t,a),o.fillStyle="red",n(i,e,t,a)},be.prototype.drawMetrics=function(e,t,r,n){var a;t=void 0!==t?t:0,r=void 0!==r?r:0,n=void 0!==n?n:24,a=1/this.path.unitsPerEm*n,e.lineWidth=1,e.strokeStyle="black",ye.line(e,t,-1e4,t,1e4),ye.line(e,-1e4,r,1e4,r);var o=this.xMin||0,s=this.yMin||0,i=this.xMax||0,u=this.yMax||0,l=this.advanceWidth||0;e.strokeStyle="blue",ye.line(e,t+o*a,-1e4,t+o*a,1e4),ye.line(e,t+i*a,-1e4,t+i*a,1e4),ye.line(e,-1e4,r+-s*a,1e4,r+-s*a),ye.line(e,-1e4,r+-u*a,1e4,r+-u*a),e.strokeStyle="green",ye.line(e,t+l*a,-1e4,t+l*a,1e4)},xe.prototype.get=function(e){if(void 0===this.glyphs[e]){this.font._push(e),"function"==typeof this.glyphs[e]&&(this.glyphs[e]=this.glyphs[e]());var t=this.glyphs[e],r=this.font._IndexToUnicodeMap[e];if(r)for(var n=0;n<r.unicodes.length;n++)t.addUnicode(r.unicodes[n]);this.font.cffEncoding?this.font.isCIDFont?t.name="gid"+e:t.name=this.font.cffEncoding.charset[e]:this.font.glyphNames.names&&(t.name=this.font.glyphNames.glyphIndexToName(e)),this.glyphs[e].advanceWidth=this.font._hmtxTableData[e].advanceWidth,this.glyphs[e].leftSideBearing=this.font._hmtxTableData[e].leftSideBearing}else"function"==typeof this.glyphs[e]&&(this.glyphs[e]=this.glyphs[e]());return this.glyphs[e]},xe.prototype.push=function(e,t){this.glyphs[e]=t,this.length++};var Te={GlyphSet:xe,glyphLoader:function(e,t){return new be({index:t,font:e})},ttfGlyphLoader:function(r,e,n,a,o,s){return function(){var t=new be({index:e,font:r});return t.path=function(){n(t,a,o);var e=s(r.glyphs,t);return e.unitsPerEm=r.unitsPerEm,e},Se(t,"xMin","_xMin"),Se(t,"xMax","_xMax"),Se(t,"yMin","_yMin"),Se(t,"yMax","_yMax"),t}},cffGlyphLoader:function(r,e,n,a){return function(){var t=new be({index:e,font:r});return t.path=function(){var e=n(r,t,a);return e.unitsPerEm=r.unitsPerEm,e},t}}};function Ue(e,t){if(e===t)return 1;if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return;for(var r=0;r<e.length;r+=1)if(!Ue(e[r],t[r]))return;return 1}}function ke(e){return e.length<1240?107:e.length<33900?1131:32768}function Oe(e,t,r){var n,a,o=[],s=[],i=ie.getCard16(e,t);if(0!==i){var u=ie.getByte(e,t+2);n=t+(i+1)*u+2;for(var l=t+3,p=0;p<i+1;p+=1)o.push(ie.getOffset(e,l,u)),l+=u;a=n+o[i]}else a=t+2;for(var c=0;c<o.length-1;c+=1){var h=ie.getBytes(e,n+o[c],n+o[c+1]);r&&(h=r(h)),s.push(h)}return{objects:s,startOffset:t,endOffset:a}}function Re(e,t){if(28===t)return e.parseByte()<<8|e.parseByte();if(29===t)return e.parseByte()<<24|e.parseByte()<<16|e.parseByte()<<8|e.parseByte();if(30===t)return function(e){for(var t="",r=["0","1","2","3","4","5","6","7","8","9",".","E","E-",null,"-"];;){var n=e.parseByte(),a=n>>4,o=15&n;if(15==a)break;if(t+=r[a],15==o)break;t+=r[o]}return parseFloat(t)}(e);if(32<=t&&t<=246)return t-139;if(247<=t&&t<=250)return 256*(t-247)+e.parseByte()+108;if(251<=t&&t<=254)return 256*-(t-251)-e.parseByte()-108;throw new Error("Invalid b0 "+t)}function Ee(e,t,r){t=void 0!==t?t:0;var n=new ie.Parser(e,t),a=[],o=[];for(r=void 0!==r?r:e.length;n.relativeOffset<r;){var s=n.parseByte();s<=21?(12===s&&(s=1200+n.parseByte()),a.push([s,o]),o=[]):o.push(Re(n,s))}return function(e){for(var t={},r=0;r<e.length;r+=1){var n=e[r][0],a=e[r][1],o=void 0;if(o=1===a.length?a[0]:a,t.hasOwnProperty(n)&&!isNaN(t[n]))throw new Error("Object "+t+" already has key "+n);t[n]=o}return t}(a)}function Le(e,t){return t=t<=390?le[t]:e[t-391]}function Ce(e,t,r){for(var n,a={},o=0;o<t.length;o+=1){var s=t[o];if(Array.isArray(s.type)){var i=[];i.length=s.type.length;for(var u=0;u<s.type.length;u++)void 0===(n=void 0!==e[s.op]?e[s.op][u]:void 0)&&(n=void 0!==s.value&&void 0!==s.value[u]?s.value[u]:null),"SID"===s.type[u]&&(n=Le(r,n)),i[u]=n;a[s.name]=i}else void 0===(n=e[s.op])&&(n=void 0!==s.value?s.value:null),"SID"===s.type&&(n=Le(r,n)),a[s.name]=n}return a}var we=[{name:"version",op:0,type:"SID"},{name:"notice",op:1,type:"SID"},{name:"copyright",op:1200,type:"SID"},{name:"fullName",op:2,type:"SID"},{name:"familyName",op:3,type:"SID"},{name:"weight",op:4,type:"SID"},{name:"isFixedPitch",op:1201,type:"number",value:0},{name:"italicAngle",op:1202,type:"number",value:0},{name:"underlinePosition",op:1203,type:"number",value:-100},{name:"underlineThickness",op:1204,type:"number",value:50},{name:"paintType",op:1205,type:"number",value:0},{name:"charstringType",op:1206,type:"number",value:2},{name:"fontMatrix",op:1207,type:["real","real","real","real","real","real"],value:[.001,0,0,.001,0,0]},{name:"uniqueId",op:13,type:"number"},{name:"fontBBox",op:5,type:["number","number","number","number"],value:[0,0,0,0]},{name:"strokeWidth",op:1208,type:"number",value:0},{name:"xuid",op:14,type:[],value:null},{name:"charset",op:15,type:"offset",value:0},{name:"encoding",op:16,type:"offset",value:0},{name:"charStrings",op:17,type:"offset",value:0},{name:"private",op:18,type:["number","offset"],value:[0,0]},{name:"ros",op:1230,type:["SID","SID","number"]},{name:"cidFontVersion",op:1231,type:"number",value:0},{name:"cidFontRevision",op:1232,type:"number",value:0},{name:"cidFontType",op:1233,type:"number",value:0},{name:"cidCount",op:1234,type:"number",value:8720},{name:"uidBase",op:1235,type:"number"},{name:"fdArray",op:1236,type:"offset"},{name:"fdSelect",op:1237,type:"offset"},{name:"fontName",op:1238,type:"SID"}],De=[{name:"subrs",op:19,type:"offset",value:0},{name:"defaultWidthX",op:20,type:"number",value:0},{name:"nominalWidthX",op:21,type:"number",value:0}];function Ie(e,t,r,n){return Ce(Ee(e,t,r),De,n)}function Ge(e,t,r,n){for(var a,o,s=[],i=0;i<r.length;i+=1){var u=new DataView(new Uint8Array(r[i]).buffer),l=(o=n,Ce(Ee(a=u,0,a.byteLength),we,o));l._subrs=[],l._subrsBias=0,l._defaultWidthX=0,l._nominalWidthX=0;var p=l.private[0],c=l.private[1];if(0!==p&&0!==c){var h=Ie(e,c+t,p,n);if(l._defaultWidthX=h.defaultWidthX,l._nominalWidthX=h.nominalWidthX,0!==h.subrs){var f=Oe(e,c+h.subrs+t);l._subrs=f.objects,l._subrsBias=ke(l._subrs)}l._privateDict=h}s.push(l)}return s}function Me(g,m,e){var y,b,S,x,T,U,t,k,O=new B,R=[],E=0,L=!1,C=!1,w=0,D=0;if(g.isCIDFont){var r=g.tables.cff.topDict._fdSelect[m.index],n=g.tables.cff.topDict._fdArray[r];T=n._subrs,U=n._subrsBias,t=n._defaultWidthX,k=n._nominalWidthX}else T=g.tables.cff.topDict._subrs,U=g.tables.cff.topDict._subrsBias,t=g.tables.cff.topDict._defaultWidthX,k=g.tables.cff.topDict._nominalWidthX;var I=t;function G(e,t){C&&O.closePath(),O.moveTo(e,t),C=!0}function M(){R.length%2==0||L||(I=R.shift()+k),E+=R.length>>1,R.length=0,L=!0}return function e(t){for(var r,n,a,o,s,i,u,l,p,c,h,f,d=0;d<t.length;){var v=t[d];switch(d+=1,v){case 1:case 3:M();break;case 4:1<R.length&&!L&&(I=R.shift()+k,L=!0),D+=R.pop(),G(w,D);break;case 5:for(;0<R.length;)w+=R.shift(),D+=R.shift(),O.lineTo(w,D);break;case 6:for(;0<R.length&&(w+=R.shift(),O.lineTo(w,D),0!==R.length);)D+=R.shift(),O.lineTo(w,D);break;case 7:for(;0<R.length&&(D+=R.shift(),O.lineTo(w,D),0!==R.length);)w+=R.shift(),O.lineTo(w,D);break;case 8:for(;0<R.length;)y=w+R.shift(),b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),w=S+R.shift(),D=x+R.shift(),O.curveTo(y,b,S,x,w,D);break;case 10:s=R.pop()+U,(i=T[s])&&e(i);break;case 11:return;case 12:switch(v=t[d],d+=1,v){case 35:y=w+R.shift(),b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),u=S+R.shift(),l=x+R.shift(),p=u+R.shift(),c=l+R.shift(),h=p+R.shift(),f=c+R.shift(),w=h+R.shift(),D=f+R.shift(),R.shift(),O.curveTo(y,b,S,x,u,l),O.curveTo(p,c,h,f,w,D);break;case 34:y=w+R.shift(),b=D,S=y+R.shift(),x=b+R.shift(),u=S+R.shift(),l=x,p=u+R.shift(),c=x,h=p+R.shift(),f=D,w=h+R.shift(),O.curveTo(y,b,S,x,u,l),O.curveTo(p,c,h,f,w,D);break;case 36:y=w+R.shift(),b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),u=S+R.shift(),l=x,p=u+R.shift(),c=x,h=p+R.shift(),f=c+R.shift(),w=h+R.shift(),O.curveTo(y,b,S,x,u,l),O.curveTo(p,c,h,f,w,D);break;case 37:y=w+R.shift(),b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),u=S+R.shift(),l=x+R.shift(),p=u+R.shift(),c=l+R.shift(),h=p+R.shift(),f=c+R.shift(),Math.abs(h-w)>Math.abs(f-D)?w=h+R.shift():D=f+R.shift(),O.curveTo(y,b,S,x,u,l),O.curveTo(p,c,h,f,w,D);break;default:console.log("Glyph "+m.index+": unknown operator 1200"+v),R.length=0}break;case 14:0<R.length&&!L&&(I=R.shift()+k,L=!0),C&&(O.closePath(),C=!1);break;case 18:M();break;case 19:case 20:M(),d+=E+7>>3;break;case 21:2<R.length&&!L&&(I=R.shift()+k,L=!0),D+=R.pop(),G(w+=R.pop(),D);break;case 22:1<R.length&&!L&&(I=R.shift()+k,L=!0),G(w+=R.pop(),D);break;case 23:M();break;case 24:for(;2<R.length;)y=w+R.shift(),b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),w=S+R.shift(),D=x+R.shift(),O.curveTo(y,b,S,x,w,D);w+=R.shift(),D+=R.shift(),O.lineTo(w,D);break;case 25:for(;6<R.length;)w+=R.shift(),D+=R.shift(),O.lineTo(w,D);y=w+R.shift(),b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),w=S+R.shift(),D=x+R.shift(),O.curveTo(y,b,S,x,w,D);break;case 26:for(R.length%2&&(w+=R.shift());0<R.length;)y=w,b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),w=S,D=x+R.shift(),O.curveTo(y,b,S,x,w,D);break;case 27:for(R.length%2&&(D+=R.shift());0<R.length;)y=w+R.shift(),b=D,S=y+R.shift(),x=b+R.shift(),w=S+R.shift(),D=x,O.curveTo(y,b,S,x,w,D);break;case 28:r=t[d],n=t[d+1],R.push((r<<24|n<<16)>>16),d+=2;break;case 29:s=R.pop()+g.gsubrsBias,(i=g.gsubrs[s])&&e(i);break;case 30:for(;0<R.length&&(y=w,b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),w=S+R.shift(),D=x+(1===R.length?R.shift():0),O.curveTo(y,b,S,x,w,D),0!==R.length);)y=w+R.shift(),b=D,S=y+R.shift(),x=b+R.shift(),D=x+R.shift(),w=S+(1===R.length?R.shift():0),O.curveTo(y,b,S,x,w,D);break;case 31:for(;0<R.length&&(y=w+R.shift(),b=D,S=y+R.shift(),x=b+R.shift(),D=x+R.shift(),w=S+(1===R.length?R.shift():0),O.curveTo(y,b,S,x,w,D),0!==R.length);)y=w,b=D+R.shift(),S=y+R.shift(),x=b+R.shift(),w=S+R.shift(),D=x+(1===R.length?R.shift():0),O.curveTo(y,b,S,x,w,D);break;default:v<32?console.log("Glyph "+m.index+": unknown operator "+v):v<247?R.push(v-139):v<251?(r=t[d],d+=1,R.push(256*(v-247)+r+108)):v<255?(r=t[d],d+=1,R.push(256*-(v-251)-r-108)):(r=t[d],n=t[d+1],a=t[d+2],o=t[d+3],d+=4,R.push((r<<24|n<<16|a<<8|o)/65536))}}}(e),m.advanceWidth=I,O}function Be(e,t){var r,n=le.indexOf(e);return 0<=n&&(r=n),0<=(n=t.indexOf(e))?r=n+le.length:(r=le.length+t.length,t.push(e)),r}function Ae(e,t,r){for(var n={},a=0;a<e.length;a+=1){var o=e[a],s=t[o.name];void 0===s||Ue(s,o.value)||("SID"===o.type&&(s=Be(s,r)),n[o.op]={name:o.name,type:o.type,value:s})}return n}function Fe(e,t){var r=new $.Record("Top DICT",[{name:"dict",type:"DICT",value:{}}]);return r.dict=Ae(we,e,t),r}function Pe(e){var t=new $.Record("Top DICT INDEX",[{name:"topDicts",type:"INDEX",value:[]}]);return t.topDicts=[{name:"topDict_0",type:"TABLE",value:e}],t}function Ne(e){var t=[],r=e.path;t.push({name:"width",type:"NUMBER",value:e.advanceWidth});for(var n=0,a=0,o=0;o<r.commands.length;o+=1){var s=void 0,i=void 0,u=r.commands[o];if("Q"===u.type){u={type:"C",x:u.x,y:u.y,x1:Math.round(1/3*n+2/3*u.x1),y1:Math.round(1/3*a+2/3*u.y1),x2:Math.round(1/3*u.x+2/3*u.x1),y2:Math.round(1/3*u.y+2/3*u.y1)}}if("M"===u.type)s=Math.round(u.x-n),i=Math.round(u.y-a),t.push({name:"dx",type:"NUMBER",value:s}),t.push({name:"dy",type:"NUMBER",value:i}),t.push({name:"rmoveto",type:"OP",value:21}),n=Math.round(u.x),a=Math.round(u.y);else if("L"===u.type)s=Math.round(u.x-n),i=Math.round(u.y-a),t.push({name:"dx",type:"NUMBER",value:s}),t.push({name:"dy",type:"NUMBER",value:i}),t.push({name:"rlineto",type:"OP",value:5}),n=Math.round(u.x),a=Math.round(u.y);else if("C"===u.type){var l=Math.round(u.x1-n),p=Math.round(u.y1-a),c=Math.round(u.x2-u.x1),h=Math.round(u.y2-u.y1);s=Math.round(u.x-u.x2),i=Math.round(u.y-u.y2),t.push({name:"dx1",type:"NUMBER",value:l}),t.push({name:"dy1",type:"NUMBER",value:p}),t.push({name:"dx2",type:"NUMBER",value:c}),t.push({name:"dy2",type:"NUMBER",value:h}),t.push({name:"dx",type:"NUMBER",value:s}),t.push({name:"dy",type:"NUMBER",value:i}),t.push({name:"rrcurveto",type:"OP",value:8}),n=Math.round(u.x),a=Math.round(u.y)}}return t.push({name:"endchar",type:"OP",value:14}),t}var He={parse:function(r,n,a,e){a.tables.cff={};var t,o,s,i=(t=r,o=n,(s={}).formatMajor=ie.getCard8(t,o),s.formatMinor=ie.getCard8(t,o+1),s.size=ie.getCard8(t,o+2),s.offsetSize=ie.getCard8(t,o+3),s.startOffset=o,s.endOffset=o+4,s),u=Oe(r,i.endOffset,ie.bytesToString),l=Oe(r,u.endOffset),p=Oe(r,l.endOffset,ie.bytesToString),c=Oe(r,p.endOffset);a.gsubrs=c.objects,a.gsubrsBias=ke(a.gsubrs);var h=Ge(r,n,l.objects,p.objects);if(1!==h.length)throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = "+h.length);var f=h[0];if((a.tables.cff.topDict=f)._privateDict&&(a.defaultWidthX=f._privateDict.defaultWidthX,a.nominalWidthX=f._privateDict.nominalWidthX),void 0!==f.ros[0]&&void 0!==f.ros[1]&&(a.isCIDFont=!0),a.isCIDFont){var d=f.fdArray,v=f.fdSelect;if(0===d||0===v)throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");var g=Oe(r,d+=n),m=Ge(r,n,g.objects,p.objects);f._fdArray=m,v+=n,f._fdSelect=function(e,t,r,n){var a,o=[],s=new ie.Parser(e,t),i=s.parseCard8();if(0===i)for(var u=0;u<r;u++){if(n<=(a=s.parseCard8()))throw new Error("CFF table CID Font FDSelect has bad FD index value "+a+" (FD count "+n+")");o.push(a)}else{if(3!==i)throw new Error("CFF Table CID Font FDSelect table has unsupported format "+i);var l,p=s.parseCard16(),c=s.parseCard16();if(0!==c)throw new Error("CFF Table CID Font FDSelect format 3 range has bad initial GID "+c);for(var h=0;h<p;h++){if(a=s.parseCard8(),l=s.parseCard16(),n<=a)throw new Error("CFF table CID Font FDSelect has bad FD index value "+a+" (FD count "+n+")");if(r<l)throw new Error("CFF Table CID Font FDSelect format 3 range has bad GID "+l);for(;c<l;c++)o.push(a);c=l}if(l!==r)throw new Error("CFF Table CID Font FDSelect format 3 range has bad final GID "+l)}return o}(r,v,a.numGlyphs,m.length)}var y,b=n+f.private[1],S=Ie(r,b,f.private[0],p.objects);if(a.defaultWidthX=S.defaultWidthX,a.nominalWidthX=S.nominalWidthX,0!==S.subrs){var x=b+S.subrs,T=Oe(r,x);a.subrs=T.objects,a.subrsBias=ke(a.subrs)}else a.subrs=[],a.subrsBias=0;e.lowMemory?(y=function(e,t){var r,n,a=[],o=ie.getCard16(e,t);if(0!==o){var s=ie.getByte(e,t+2);r=t+(o+1)*s+2;for(var i=t+3,u=0;u<o+1;u+=1)a.push(ie.getOffset(e,i,s)),i+=s;n=r+a[o]}else n=t+2;return{offsets:a,startOffset:t,endOffset:n}}(r,n+f.charStrings),a.nGlyphs=y.offsets.length):(y=Oe(r,n+f.charStrings),a.nGlyphs=y.objects.length);var U=function(e,t,r,n){var a,o,s=new ie.Parser(e,t);--r;var i=[".notdef"],u=s.parseCard8();if(0===u)for(var l=0;l<r;l+=1)a=s.parseSID(),i.push(Le(n,a));else if(1===u)for(;i.length<=r;){a=s.parseSID(),o=s.parseCard8();for(var p=0;p<=o;p+=1)i.push(Le(n,a)),a+=1}else{if(2!==u)throw new Error("Unknown charset format "+u);for(;i.length<=r;){a=s.parseSID(),o=s.parseCard16();for(var c=0;c<=o;c+=1)i.push(Le(n,a)),a+=1}}return i}(r,n+f.charset,a.nGlyphs,p.objects);if(0===f.encoding?a.cffEncoding=new ve(pe,U):1===f.encoding?a.cffEncoding=new ve(ce,U):a.cffEncoding=function(e,t,r){var n,a={},o=new ie.Parser(e,t),s=o.parseCard8();if(0===s)for(var i=o.parseCard8(),u=0;u<i;u+=1)a[n=o.parseCard8()]=u;else{if(1!==s)throw new Error("Unknown encoding format "+s);var l=o.parseCard8();n=1;for(var p=0;p<l;p+=1)for(var c=o.parseCard8(),h=o.parseCard8(),f=c;f<=c+h;f+=1)a[f]=n,n+=1}return new ve(a,r)}(r,n+f.encoding,U),a.encoding=a.encoding||a.cffEncoding,a.glyphs=new Te.GlyphSet(a),e.lowMemory)a._push=function(e){var t=function(e,t,r,n,a){var o=ie.getCard16(r,n),s=0;0!==o&&(s=n+(o+1)*ie.getByte(r,n+2)+2);var i=ie.getBytes(r,s+t[e],s+t[e+1]);return a&&(i=a(i)),i}(e,y.offsets,r,n+f.charStrings);a.glyphs.push(e,Te.cffGlyphLoader(a,e,Me,t))};else for(var k=0;k<a.nGlyphs;k+=1){var O=y.objects[k];a.glyphs.push(k,Te.cffGlyphLoader(a,k,Me,O))}},make:function(e,t){for(var r,n=new $.Table("CFF ",[{name:"header",type:"RECORD"},{name:"nameIndex",type:"RECORD"},{name:"topDictIndex",type:"RECORD"},{name:"stringIndex",type:"RECORD"},{name:"globalSubrIndex",type:"RECORD"},{name:"charsets",type:"RECORD"},{name:"charStringsIndex",type:"RECORD"},{name:"privateDict",type:"RECORD"}]),a=1/t.unitsPerEm,o={version:t.version,fullName:t.fullName,familyName:t.familyName,weight:t.weightName,fontBBox:t.fontBBox||[0,0,0,0],fontMatrix:[a,0,0,a,0,0],charset:999,encoding:0,charStrings:999,private:[0,999]},s=[],i=1;i<e.length;i+=1)r=e.get(i),s.push(r.name);var u=[];n.header=new $.Record("Header",[{name:"major",type:"Card8",value:1},{name:"minor",type:"Card8",value:0},{name:"hdrSize",type:"Card8",value:4},{name:"major",type:"Card8",value:1}]),n.nameIndex=function(e){var t=new $.Record("Name INDEX",[{name:"names",type:"INDEX",value:[]}]);t.names=[];for(var r=0;r<e.length;r+=1)t.names.push({name:"name_"+r,type:"NAME",value:e[r]});return t}([t.postScriptName]);var l,p,c,h=Fe(o,u);n.topDictIndex=Pe(h),n.globalSubrIndex=new $.Record("Global Subr INDEX",[{name:"subrs",type:"INDEX",value:[]}]),n.charsets=function(e,t){for(var r=new $.Record("Charsets",[{name:"format",type:"Card8",value:0}]),n=0;n<e.length;n+=1){var a=Be(e[n],t);r.fields.push({name:"glyph_"+n,type:"SID",value:a})}return r}(s,u),n.charStringsIndex=function(e){for(var t=new $.Record("CharStrings INDEX",[{name:"charStrings",type:"INDEX",value:[]}]),r=0;r<e.length;r+=1){var n=e.get(r),a=Ne(n);t.charStrings.push({name:n.name,type:"CHARSTRING",value:a})}return t}(e),n.privateDict=(l={},p=u,(c=new $.Record("Private DICT",[{name:"dict",type:"DICT",value:{}}])).dict=Ae(De,l,p),c),n.stringIndex=function(e){var t=new $.Record("String INDEX",[{name:"strings",type:"INDEX",value:[]}]);t.strings=[];for(var r=0;r<e.length;r+=1)t.strings.push({name:"string_"+r,type:"STRING",value:e[r]});return t}(u);var f=n.header.sizeOf()+n.nameIndex.sizeOf()+n.topDictIndex.sizeOf()+n.stringIndex.sizeOf()+n.globalSubrIndex.sizeOf();return o.charset=f,o.encoding=0,o.charStrings=o.charset+n.charsets.sizeOf(),o.private[1]=o.charStrings+n.charStringsIndex.sizeOf(),h=Fe(o,u),n.topDictIndex=Pe(h),n}};var ze={parse:function(e,t){var r={},n=new ie.Parser(e,t);return r.version=n.parseVersion(),r.fontRevision=Math.round(1e3*n.parseFixed())/1e3,r.checkSumAdjustment=n.parseULong(),r.magicNumber=n.parseULong(),w.argument(1594834165===r.magicNumber,"Font header has wrong magic number."),r.flags=n.parseUShort(),r.unitsPerEm=n.parseUShort(),r.created=n.parseLongDateTime(),r.modified=n.parseLongDateTime(),r.xMin=n.parseShort(),r.yMin=n.parseShort(),r.xMax=n.parseShort(),r.yMax=n.parseShort(),r.macStyle=n.parseUShort(),r.lowestRecPPEM=n.parseUShort(),r.fontDirectionHint=n.parseShort(),r.indexToLocFormat=n.parseShort(),r.glyphDataFormat=n.parseShort(),r},make:function(e){var t=Math.round((new Date).getTime()/1e3)+2082844800,r=t;return e.createdTimestamp&&(r=e.createdTimestamp+2082844800),new $.Table("head",[{name:"version",type:"FIXED",value:65536},{name:"fontRevision",type:"FIXED",value:65536},{name:"checkSumAdjustment",type:"ULONG",value:0},{name:"magicNumber",type:"ULONG",value:1594834165},{name:"flags",type:"USHORT",value:0},{name:"unitsPerEm",type:"USHORT",value:1e3},{name:"created",type:"LONGDATETIME",value:r},{name:"modified",type:"LONGDATETIME",value:t},{name:"xMin",type:"SHORT",value:0},{name:"yMin",type:"SHORT",value:0},{name:"xMax",type:"SHORT",value:0},{name:"yMax",type:"SHORT",value:0},{name:"macStyle",type:"USHORT",value:0},{name:"lowestRecPPEM",type:"USHORT",value:0},{name:"fontDirectionHint",type:"SHORT",value:2},{name:"indexToLocFormat",type:"SHORT",value:0},{name:"glyphDataFormat",type:"SHORT",value:0}],e)}};var We={parse:function(e,t){var r={},n=new ie.Parser(e,t);return r.version=n.parseVersion(),r.ascender=n.parseShort(),r.descender=n.parseShort(),r.lineGap=n.parseShort(),r.advanceWidthMax=n.parseUShort(),r.minLeftSideBearing=n.parseShort(),r.minRightSideBearing=n.parseShort(),r.xMaxExtent=n.parseShort(),r.caretSlopeRise=n.parseShort(),r.caretSlopeRun=n.parseShort(),r.caretOffset=n.parseShort(),n.relativeOffset+=8,r.metricDataFormat=n.parseShort(),r.numberOfHMetrics=n.parseUShort(),r},make:function(e){return new $.Table("hhea",[{name:"version",type:"FIXED",value:65536},{name:"ascender",type:"FWORD",value:0},{name:"descender",type:"FWORD",value:0},{name:"lineGap",type:"FWORD",value:0},{name:"advanceWidthMax",type:"UFWORD",value:0},{name:"minLeftSideBearing",type:"FWORD",value:0},{name:"minRightSideBearing",type:"FWORD",value:0},{name:"xMaxExtent",type:"FWORD",value:0},{name:"caretSlopeRise",type:"SHORT",value:1},{name:"caretSlopeRun",type:"SHORT",value:0},{name:"caretOffset",type:"SHORT",value:0},{name:"reserved1",type:"SHORT",value:0},{name:"reserved2",type:"SHORT",value:0},{name:"reserved3",type:"SHORT",value:0},{name:"reserved4",type:"SHORT",value:0},{name:"metricDataFormat",type:"SHORT",value:0},{name:"numberOfHMetrics",type:"USHORT",value:0}],e)}};var _e={parse:function(e,t,r,n,a,o,s){s.lowMemory?function(e,t,r,n,a){var o,s;e._hmtxTableData={};for(var i=new ie.Parser(t,r),u=0;u<a;u+=1)u<n&&(o=i.parseUShort(),s=i.parseShort()),e._hmtxTableData[u]={advanceWidth:o,leftSideBearing:s}}(e,t,r,n,a):function(e,t,r,n,a){for(var o,s,i=new ie.Parser(e,t),u=0;u<n;u+=1){u<r&&(o=i.parseUShort(),s=i.parseShort());var l=a.get(u);l.advanceWidth=o,l.leftSideBearing=s}}(t,r,n,a,o)},make:function(e){for(var t=new $.Table("hmtx",[]),r=0;r<e.length;r+=1){var n=e.get(r),a=n.advanceWidth||0,o=n.leftSideBearing||0;t.fields.push({name:"advanceWidth_"+r,type:"USHORT",value:a}),t.fields.push({name:"leftSideBearing_"+r,type:"SHORT",value:o})}return t}};var qe={make:function(e){for(var t=new $.Table("ltag",[{name:"version",type:"ULONG",value:1},{name:"flags",type:"ULONG",value:0},{name:"numTags",type:"ULONG",value:e.length}]),r="",n=12+4*e.length,a=0;a<e.length;++a){var o=r.indexOf(e[a]);o<0&&(o=r.length,r+=e[a]),t.fields.push({name:"offset "+a,type:"USHORT",value:n+o}),t.fields.push({name:"length "+a,type:"USHORT",value:e[a].length})}return t.fields.push({name:"stringPool",type:"CHARARRAY",value:r}),t},parse:function(e,t){var r=new ie.Parser(e,t),n=r.parseULong();w.argument(1===n,"Unsupported ltag table version."),r.skip("uLong",1);for(var a=r.parseULong(),o=[],s=0;s<a;s++){for(var i="",u=t+r.parseUShort(),l=r.parseUShort(),p=u;p<u+l;++p)i+=String.fromCharCode(e.getInt8(p));o.push(i)}return o}};var Xe={parse:function(e,t){var r={},n=new ie.Parser(e,t);return r.version=n.parseVersion(),r.numGlyphs=n.parseUShort(),1===r.version&&(r.maxPoints=n.parseUShort(),r.maxContours=n.parseUShort(),r.maxCompositePoints=n.parseUShort(),r.maxCompositeContours=n.parseUShort(),r.maxZones=n.parseUShort(),r.maxTwilightPoints=n.parseUShort(),r.maxStorage=n.parseUShort(),r.maxFunctionDefs=n.parseUShort(),r.maxInstructionDefs=n.parseUShort(),r.maxStackElements=n.parseUShort(),r.maxSizeOfInstructions=n.parseUShort(),r.maxComponentElements=n.parseUShort(),r.maxComponentDepth=n.parseUShort()),r},make:function(e){return new $.Table("maxp",[{name:"version",type:"FIXED",value:20480},{name:"numGlyphs",type:"USHORT",value:e}])}},Ve=["copyright","fontFamily","fontSubfamily","uniqueID","fullName","version","postScriptName","trademark","manufacturer","designer","description","manufacturerURL","designerURL","license","licenseURL","reserved","preferredFamily","preferredSubfamily","compatibleFullName","sampleText","postScriptFindFontName","wwsFamily","wwsSubfamily"],Ye={0:"en",1:"fr",2:"de",3:"it",4:"nl",5:"sv",6:"es",7:"da",8:"pt",9:"no",10:"he",11:"ja",12:"ar",13:"fi",14:"el",15:"is",16:"mt",17:"tr",18:"hr",19:"zh-Hant",20:"ur",21:"hi",22:"th",23:"ko",24:"lt",25:"pl",26:"hu",27:"es",28:"lv",29:"se",30:"fo",31:"fa",32:"ru",33:"zh",34:"nl-BE",35:"ga",36:"sq",37:"ro",38:"cz",39:"sk",40:"si",41:"yi",42:"sr",43:"mk",44:"bg",45:"uk",46:"be",47:"uz",48:"kk",49:"az-Cyrl",50:"az-Arab",51:"hy",52:"ka",53:"mo",54:"ky",55:"tg",56:"tk",57:"mn-CN",58:"mn",59:"ps",60:"ks",61:"ku",62:"sd",63:"bo",64:"ne",65:"sa",66:"mr",67:"bn",68:"as",69:"gu",70:"pa",71:"or",72:"ml",73:"kn",74:"ta",75:"te",76:"si",77:"my",78:"km",79:"lo",80:"vi",81:"id",82:"tl",83:"ms",84:"ms-Arab",85:"am",86:"ti",87:"om",88:"so",89:"sw",90:"rw",91:"rn",92:"ny",93:"mg",94:"eo",128:"cy",129:"eu",130:"ca",131:"la",132:"qu",133:"gn",134:"ay",135:"tt",136:"ug",137:"dz",138:"jv",139:"su",140:"gl",141:"af",142:"br",143:"iu",144:"gd",145:"gv",146:"ga",147:"to",148:"el-polyton",149:"kl",150:"az",151:"nn"},je={0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:5,11:1,12:4,13:0,14:6,15:0,16:0,17:0,18:0,19:2,20:4,21:9,22:21,23:3,24:29,25:29,26:29,27:29,28:29,29:0,30:0,31:4,32:7,33:25,34:0,35:0,36:0,37:0,38:29,39:29,40:0,41:5,42:7,43:7,44:7,45:7,46:7,47:7,48:7,49:7,50:4,51:24,52:23,53:7,54:7,55:7,56:7,57:27,58:7,59:4,60:4,61:4,62:4,63:26,64:9,65:9,66:9,67:13,68:13,69:11,70:10,71:12,72:17,73:16,74:14,75:15,76:18,77:19,78:20,79:22,80:30,81:0,82:0,83:0,84:4,85:28,86:28,87:28,88:0,89:0,90:0,91:0,92:0,93:0,94:0,128:0,129:0,130:0,131:0,132:0,133:0,134:0,135:7,136:4,137:26,138:0,139:0,140:0,141:0,142:0,143:28,144:0,145:0,146:0,147:0,148:6,149:0,150:0,151:0},Ze={1078:"af",1052:"sq",1156:"gsw",1118:"am",5121:"ar-DZ",15361:"ar-BH",3073:"ar",2049:"ar-IQ",11265:"ar-JO",13313:"ar-KW",12289:"ar-LB",4097:"ar-LY",6145:"ary",8193:"ar-OM",16385:"ar-QA",1025:"ar-SA",10241:"ar-SY",7169:"aeb",14337:"ar-AE",9217:"ar-YE",1067:"hy",1101:"as",2092:"az-Cyrl",1068:"az",1133:"ba",1069:"eu",1059:"be",2117:"bn",1093:"bn-IN",8218:"bs-Cyrl",5146:"bs",1150:"br",1026:"bg",1027:"ca",3076:"zh-HK",5124:"zh-MO",2052:"zh",4100:"zh-SG",1028:"zh-TW",1155:"co",1050:"hr",4122:"hr-BA",1029:"cs",1030:"da",1164:"prs",1125:"dv",2067:"nl-BE",1043:"nl",3081:"en-AU",10249:"en-BZ",4105:"en-CA",9225:"en-029",16393:"en-IN",6153:"en-IE",8201:"en-JM",17417:"en-MY",5129:"en-NZ",13321:"en-PH",18441:"en-SG",7177:"en-ZA",11273:"en-TT",2057:"en-GB",1033:"en",12297:"en-ZW",1061:"et",1080:"fo",1124:"fil",1035:"fi",2060:"fr-BE",3084:"fr-CA",1036:"fr",5132:"fr-LU",6156:"fr-MC",4108:"fr-CH",1122:"fy",1110:"gl",1079:"ka",3079:"de-AT",1031:"de",5127:"de-LI",4103:"de-LU",2055:"de-CH",1032:"el",1135:"kl",1095:"gu",1128:"ha",1037:"he",1081:"hi",1038:"hu",1039:"is",1136:"ig",1057:"id",1117:"iu",2141:"iu-Latn",2108:"ga",1076:"xh",1077:"zu",1040:"it",2064:"it-CH",1041:"ja",1099:"kn",1087:"kk",1107:"km",1158:"quc",1159:"rw",1089:"sw",1111:"kok",1042:"ko",1088:"ky",1108:"lo",1062:"lv",1063:"lt",2094:"dsb",1134:"lb",1071:"mk",2110:"ms-BN",1086:"ms",1100:"ml",1082:"mt",1153:"mi",1146:"arn",1102:"mr",1148:"moh",1104:"mn",2128:"mn-CN",1121:"ne",1044:"nb",2068:"nn",1154:"oc",1096:"or",1123:"ps",1045:"pl",1046:"pt",2070:"pt-PT",1094:"pa",1131:"qu-BO",2155:"qu-EC",3179:"qu",1048:"ro",1047:"rm",1049:"ru",9275:"smn",4155:"smj-NO",5179:"smj",3131:"se-FI",1083:"se",2107:"se-SE",8251:"sms",6203:"sma-NO",7227:"sms",1103:"sa",7194:"sr-Cyrl-BA",3098:"sr",6170:"sr-Latn-BA",2074:"sr-Latn",1132:"nso",1074:"tn",1115:"si",1051:"sk",1060:"sl",11274:"es-AR",16394:"es-BO",13322:"es-CL",9226:"es-CO",5130:"es-CR",7178:"es-DO",12298:"es-EC",17418:"es-SV",4106:"es-GT",18442:"es-HN",2058:"es-MX",19466:"es-NI",6154:"es-PA",15370:"es-PY",10250:"es-PE",20490:"es-PR",3082:"es",1034:"es",21514:"es-US",14346:"es-UY",8202:"es-VE",2077:"sv-FI",1053:"sv",1114:"syr",1064:"tg",2143:"tzm",1097:"ta",1092:"tt",1098:"te",1054:"th",1105:"bo",1055:"tr",1090:"tk",1152:"ug",1058:"uk",1070:"hsb",1056:"ur",2115:"uz-Cyrl",1091:"uz",1066:"vi",1106:"cy",1160:"wo",1157:"sah",1144:"ii",1130:"yo"};function Qe(e,t,r){switch(e){case 0:if(65535===t)return"und";if(r)return r[t];break;case 1:return Ye[t];case 3:return Ze[t]}}var Ke="utf-16",Je={0:"macintosh",1:"x-mac-japanese",2:"x-mac-chinesetrad",3:"x-mac-korean",6:"x-mac-greek",7:"x-mac-cyrillic",9:"x-mac-devanagai",10:"x-mac-gurmukhi",11:"x-mac-gujarati",12:"x-mac-oriya",13:"x-mac-bengali",14:"x-mac-tamil",15:"x-mac-telugu",16:"x-mac-kannada",17:"x-mac-malayalam",18:"x-mac-sinhalese",19:"x-mac-burmese",20:"x-mac-khmer",21:"x-mac-thai",22:"x-mac-lao",23:"x-mac-georgian",24:"x-mac-armenian",25:"x-mac-chinesesimp",26:"x-mac-tibetan",27:"x-mac-mongolian",28:"x-mac-ethiopic",29:"x-mac-ce",30:"x-mac-vietnamese",31:"x-mac-extarabic"},$e={15:"x-mac-icelandic",17:"x-mac-turkish",18:"x-mac-croatian",24:"x-mac-ce",25:"x-mac-ce",26:"x-mac-ce",27:"x-mac-ce",28:"x-mac-ce",30:"x-mac-icelandic",37:"x-mac-romanian",38:"x-mac-ce",39:"x-mac-ce",40:"x-mac-ce",143:"x-mac-inuit",146:"x-mac-gaelic"};function et(e,t,r){switch(e){case 0:return Ke;case 1:return $e[r]||Je[t];case 3:if(1===t||10===t)return Ke}}function tt(e){var t={};for(var r in e)t[e[r]]=parseInt(r);return t}function rt(e,t,r,n,a,o){return new $.Record("NameRecord",[{name:"platformID",type:"USHORT",value:e},{name:"encodingID",type:"USHORT",value:t},{name:"languageID",type:"USHORT",value:r},{name:"nameID",type:"USHORT",value:n},{name:"length",type:"USHORT",value:a},{name:"offset",type:"USHORT",value:o}])}function nt(e,t){var r=function(e,t){var r=e.length,n=t.length-r+1;e:for(var a=0;a<n;a++)for(;a<n;a++){for(var o=0;o<r;o++)if(t[a+o]!==e[o])continue e;return a}return-1}(e,t);if(r<0){r=t.length;for(var n=0,a=e.length;n<a;++n)t.push(e[n])}return r}var at={parse:function(e,t,r){for(var n={},a=new ie.Parser(e,t),o=a.parseUShort(),s=a.parseUShort(),i=a.offset+a.parseUShort(),u=0;u<s;u++){var l=a.parseUShort(),p=a.parseUShort(),c=a.parseUShort(),h=a.parseUShort(),f=Ve[h]||h,d=a.parseUShort(),v=a.parseUShort(),g=Qe(l,c,r),m=et(l,p,c);if(void 0!==m&&void 0!==g){var y=void 0;if(y=m===Ke?I.UTF16(e,i+v,d):I.MACSTRING(e,i+v,d,m)){var b=n[f];void 0===b&&(b=n[f]={}),b[g]=y}}}return 1===o&&a.parseUShort(),n},make:function(e,t){var r,n=[],a={},o=tt(Ve);for(var s in e){var i=o[s];if(void 0===i&&(i=s),r=parseInt(i),isNaN(r))throw new Error('Name table entry "'+s+'" does not exist, see nameTableNames for complete list.');a[r]=e[s],n.push(r)}for(var u=tt(Ye),l=tt(Ze),p=[],c=[],h=0;h<n.length;h++){var f=a[r=n[h]];for(var d in f){var v=f[d],g=1,m=u[d],y=je[m],b=et(g,y,m),S=G.MACSTRING(v,b);void 0===S&&(g=0,(m=t.indexOf(d))<0&&(m=t.length,t.push(d)),y=4,S=G.UTF16(v));var x=nt(S,c);p.push(rt(g,y,m,r,S.length,x));var T=l[d];if(void 0!==T){var U=G.UTF16(v),k=nt(U,c);p.push(rt(3,1,T,r,U.length,k))}}}p.sort(function(e,t){return e.platformID-t.platformID||e.encodingID-t.encodingID||e.languageID-t.languageID||e.nameID-t.nameID});for(var O=new $.Table("name",[{name:"format",type:"USHORT",value:0},{name:"count",type:"USHORT",value:p.length},{name:"stringOffset",type:"USHORT",value:6+12*p.length}]),R=0;R<p.length;R++)O.fields.push({name:"record_"+R,type:"RECORD",value:p[R]});return O.fields.push({name:"strings",type:"LITERAL",value:c}),O}},ot=[{begin:0,end:127},{begin:128,end:255},{begin:256,end:383},{begin:384,end:591},{begin:592,end:687},{begin:688,end:767},{begin:768,end:879},{begin:880,end:1023},{begin:11392,end:11519},{begin:1024,end:1279},{begin:1328,end:1423},{begin:1424,end:1535},{begin:42240,end:42559},{begin:1536,end:1791},{begin:1984,end:2047},{begin:2304,end:2431},{begin:2432,end:2559},{begin:2560,end:2687},{begin:2688,end:2815},{begin:2816,end:2943},{begin:2944,end:3071},{begin:3072,end:3199},{begin:3200,end:3327},{begin:3328,end:3455},{begin:3584,end:3711},{begin:3712,end:3839},{begin:4256,end:4351},{begin:6912,end:7039},{begin:4352,end:4607},{begin:7680,end:7935},{begin:7936,end:8191},{begin:8192,end:8303},{begin:8304,end:8351},{begin:8352,end:8399},{begin:8400,end:8447},{begin:8448,end:8527},{begin:8528,end:8591},{begin:8592,end:8703},{begin:8704,end:8959},{begin:8960,end:9215},{begin:9216,end:9279},{begin:9280,end:9311},{begin:9312,end:9471},{begin:9472,end:9599},{begin:9600,end:9631},{begin:9632,end:9727},{begin:9728,end:9983},{begin:9984,end:10175},{begin:12288,end:12351},{begin:12352,end:12447},{begin:12448,end:12543},{begin:12544,end:12591},{begin:12592,end:12687},{begin:43072,end:43135},{begin:12800,end:13055},{begin:13056,end:13311},{begin:44032,end:55215},{begin:55296,end:57343},{begin:67840,end:67871},{begin:19968,end:40959},{begin:57344,end:63743},{begin:12736,end:12783},{begin:64256,end:64335},{begin:64336,end:65023},{begin:65056,end:65071},{begin:65040,end:65055},{begin:65104,end:65135},{begin:65136,end:65279},{begin:65280,end:65519},{begin:65520,end:65535},{begin:3840,end:4095},{begin:1792,end:1871},{begin:1920,end:1983},{begin:3456,end:3583},{begin:4096,end:4255},{begin:4608,end:4991},{begin:5024,end:5119},{begin:5120,end:5759},{begin:5760,end:5791},{begin:5792,end:5887},{begin:6016,end:6143},{begin:6144,end:6319},{begin:10240,end:10495},{begin:40960,end:42127},{begin:5888,end:5919},{begin:66304,end:66351},{begin:66352,end:66383},{begin:66560,end:66639},{begin:118784,end:119039},{begin:119808,end:120831},{begin:1044480,end:1048573},{begin:65024,end:65039},{begin:917504,end:917631},{begin:6400,end:6479},{begin:6480,end:6527},{begin:6528,end:6623},{begin:6656,end:6687},{begin:11264,end:11359},{begin:11568,end:11647},{begin:19904,end:19967},{begin:43008,end:43055},{begin:65536,end:65663},{begin:65856,end:65935},{begin:66432,end:66463},{begin:66464,end:66527},{begin:66640,end:66687},{begin:66688,end:66735},{begin:67584,end:67647},{begin:68096,end:68191},{begin:119552,end:119647},{begin:73728,end:74751},{begin:119648,end:119679},{begin:7040,end:7103},{begin:7168,end:7247},{begin:7248,end:7295},{begin:43136,end:43231},{begin:43264,end:43311},{begin:43312,end:43359},{begin:43520,end:43615},{begin:65936,end:65999},{begin:66e3,end:66047},{begin:66208,end:66271},{begin:127024,end:127135}];var st={parse:function(e,t){var r={},n=new ie.Parser(e,t);r.version=n.parseUShort(),r.xAvgCharWidth=n.parseShort(),r.usWeightClass=n.parseUShort(),r.usWidthClass=n.parseUShort(),r.fsType=n.parseUShort(),r.ySubscriptXSize=n.parseShort(),r.ySubscriptYSize=n.parseShort(),r.ySubscriptXOffset=n.parseShort(),r.ySubscriptYOffset=n.parseShort(),r.ySuperscriptXSize=n.parseShort(),r.ySuperscriptYSize=n.parseShort(),r.ySuperscriptXOffset=n.parseShort(),r.ySuperscriptYOffset=n.parseShort(),r.yStrikeoutSize=n.parseShort(),r.yStrikeoutPosition=n.parseShort(),r.sFamilyClass=n.parseShort(),r.panose=[];for(var a=0;a<10;a++)r.panose[a]=n.parseByte();return r.ulUnicodeRange1=n.parseULong(),r.ulUnicodeRange2=n.parseULong(),r.ulUnicodeRange3=n.parseULong(),r.ulUnicodeRange4=n.parseULong(),r.achVendID=String.fromCharCode(n.parseByte(),n.parseByte(),n.parseByte(),n.parseByte()),r.fsSelection=n.parseUShort(),r.usFirstCharIndex=n.parseUShort(),r.usLastCharIndex=n.parseUShort(),r.sTypoAscender=n.parseShort(),r.sTypoDescender=n.parseShort(),r.sTypoLineGap=n.parseShort(),r.usWinAscent=n.parseUShort(),r.usWinDescent=n.parseUShort(),1<=r.version&&(r.ulCodePageRange1=n.parseULong(),r.ulCodePageRange2=n.parseULong()),2<=r.version&&(r.sxHeight=n.parseShort(),r.sCapHeight=n.parseShort(),r.usDefaultChar=n.parseUShort(),r.usBreakChar=n.parseUShort(),r.usMaxContent=n.parseUShort()),r},make:function(e){return new $.Table("OS/2",[{name:"version",type:"USHORT",value:3},{name:"xAvgCharWidth",type:"SHORT",value:0},{name:"usWeightClass",type:"USHORT",value:0},{name:"usWidthClass",type:"USHORT",value:0},{name:"fsType",type:"USHORT",value:0},{name:"ySubscriptXSize",type:"SHORT",value:650},{name:"ySubscriptYSize",type:"SHORT",value:699},{name:"ySubscriptXOffset",type:"SHORT",value:0},{name:"ySubscriptYOffset",type:"SHORT",value:140},{name:"ySuperscriptXSize",type:"SHORT",value:650},{name:"ySuperscriptYSize",type:"SHORT",value:699},{name:"ySuperscriptXOffset",type:"SHORT",value:0},{name:"ySuperscriptYOffset",type:"SHORT",value:479},{name:"yStrikeoutSize",type:"SHORT",value:49},{name:"yStrikeoutPosition",type:"SHORT",value:258},{name:"sFamilyClass",type:"SHORT",value:0},{name:"bFamilyType",type:"BYTE",value:0},{name:"bSerifStyle",type:"BYTE",value:0},{name:"bWeight",type:"BYTE",value:0},{name:"bProportion",type:"BYTE",value:0},{name:"bContrast",type:"BYTE",value:0},{name:"bStrokeVariation",type:"BYTE",value:0},{name:"bArmStyle",type:"BYTE",value:0},{name:"bLetterform",type:"BYTE",value:0},{name:"bMidline",type:"BYTE",value:0},{name:"bXHeight",type:"BYTE",value:0},{name:"ulUnicodeRange1",type:"ULONG",value:0},{name:"ulUnicodeRange2",type:"ULONG",value:0},{name:"ulUnicodeRange3",type:"ULONG",value:0},{name:"ulUnicodeRange4",type:"ULONG",value:0},{name:"achVendID",type:"CHARARRAY",value:"XXXX"},{name:"fsSelection",type:"USHORT",value:0},{name:"usFirstCharIndex",type:"USHORT",value:0},{name:"usLastCharIndex",type:"USHORT",value:0},{name:"sTypoAscender",type:"SHORT",value:0},{name:"sTypoDescender",type:"SHORT",value:0},{name:"sTypoLineGap",type:"SHORT",value:0},{name:"usWinAscent",type:"USHORT",value:0},{name:"usWinDescent",type:"USHORT",value:0},{name:"ulCodePageRange1",type:"ULONG",value:0},{name:"ulCodePageRange2",type:"ULONG",value:0},{name:"sxHeight",type:"SHORT",value:0},{name:"sCapHeight",type:"SHORT",value:0},{name:"usDefaultChar",type:"USHORT",value:0},{name:"usBreakChar",type:"USHORT",value:0},{name:"usMaxContext",type:"USHORT",value:0}],e)},unicodeRanges:ot,getUnicodeRange:function(e){for(var t=0;t<ot.length;t+=1){var r=ot[t];if(e>=r.begin&&e<r.end)return t}return-1}};var it={parse:function(e,t){var r={},n=new ie.Parser(e,t);switch(r.version=n.parseVersion(),r.italicAngle=n.parseFixed(),r.underlinePosition=n.parseShort(),r.underlineThickness=n.parseShort(),r.isFixedPitch=n.parseULong(),r.minMemType42=n.parseULong(),r.maxMemType42=n.parseULong(),r.minMemType1=n.parseULong(),r.maxMemType1=n.parseULong(),r.version){case 1:r.names=he.slice();break;case 2:r.numberOfGlyphs=n.parseUShort(),r.glyphNameIndex=new Array(r.numberOfGlyphs);for(var a=0;a<r.numberOfGlyphs;a++)r.glyphNameIndex[a]=n.parseUShort();r.names=[];for(var o=0;o<r.numberOfGlyphs;o++)if(r.glyphNameIndex[o]>=he.length){var s=n.parseChar();r.names.push(n.parseString(s))}break;case 2.5:r.numberOfGlyphs=n.parseUShort(),r.offset=new Array(r.numberOfGlyphs);for(var i=0;i<r.numberOfGlyphs;i++)r.offset[i]=n.parseChar()}return r},make:function(){return new $.Table("post",[{name:"version",type:"FIXED",value:196608},{name:"italicAngle",type:"FIXED",value:0},{name:"underlinePosition",type:"FWORD",value:0},{name:"underlineThickness",type:"FWORD",value:0},{name:"isFixedPitch",type:"ULONG",value:0},{name:"minMemType42",type:"ULONG",value:0},{name:"maxMemType42",type:"ULONG",value:0},{name:"minMemType1",type:"ULONG",value:0},{name:"maxMemType1",type:"ULONG",value:0}])}},ut=new Array(9);ut[1]=function(){var e=this.offset+this.relativeOffset,t=this.parseUShort();return 1===t?{substFormat:1,coverage:this.parsePointer(oe.coverage),deltaGlyphId:this.parseUShort()}:2===t?{substFormat:2,coverage:this.parsePointer(oe.coverage),substitute:this.parseOffset16List()}:void w.assert(!1,"0x"+e.toString(16)+": lookup type 1 format must be 1 or 2.")},ut[2]=function(){var e=this.parseUShort();return w.argument(1===e,"GSUB Multiple Substitution Subtable identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(oe.coverage),sequences:this.parseListOfLists()}},ut[3]=function(){var e=this.parseUShort();return w.argument(1===e,"GSUB Alternate Substitution Subtable identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(oe.coverage),alternateSets:this.parseListOfLists()}},ut[4]=function(){var e=this.parseUShort();return w.argument(1===e,"GSUB ligature table identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(oe.coverage),ligatureSets:this.parseListOfLists(function(){return{ligGlyph:this.parseUShort(),components:this.parseUShortList(this.parseUShort()-1)}})}};var lt={sequenceIndex:oe.uShort,lookupListIndex:oe.uShort};ut[5]=function(){var e=this.offset+this.relativeOffset,t=this.parseUShort();if(1===t)return{substFormat:t,coverage:this.parsePointer(oe.coverage),ruleSets:this.parseListOfLists(function(){var e=this.parseUShort(),t=this.parseUShort();return{input:this.parseUShortList(e-1),lookupRecords:this.parseRecordList(t,lt)}})};if(2===t)return{substFormat:t,coverage:this.parsePointer(oe.coverage),classDef:this.parsePointer(oe.classDef),classSets:this.parseListOfLists(function(){var e=this.parseUShort(),t=this.parseUShort();return{classes:this.parseUShortList(e-1),lookupRecords:this.parseRecordList(t,lt)}})};if(3===t){var r=this.parseUShort(),n=this.parseUShort();return{substFormat:t,coverages:this.parseList(r,oe.pointer(oe.coverage)),lookupRecords:this.parseRecordList(n,lt)}}w.assert(!1,"0x"+e.toString(16)+": lookup type 5 format must be 1, 2 or 3.")},ut[6]=function(){var e=this.offset+this.relativeOffset,t=this.parseUShort();return 1===t?{substFormat:1,coverage:this.parsePointer(oe.coverage),chainRuleSets:this.parseListOfLists(function(){return{backtrack:this.parseUShortList(),input:this.parseUShortList(this.parseShort()-1),lookahead:this.parseUShortList(),lookupRecords:this.parseRecordList(lt)}})}:2===t?{substFormat:2,coverage:this.parsePointer(oe.coverage),backtrackClassDef:this.parsePointer(oe.classDef),inputClassDef:this.parsePointer(oe.classDef),lookaheadClassDef:this.parsePointer(oe.classDef),chainClassSet:this.parseListOfLists(function(){return{backtrack:this.parseUShortList(),input:this.parseUShortList(this.parseShort()-1),lookahead:this.parseUShortList(),lookupRecords:this.parseRecordList(lt)}})}:3===t?{substFormat:3,backtrackCoverage:this.parseList(oe.pointer(oe.coverage)),inputCoverage:this.parseList(oe.pointer(oe.coverage)),lookaheadCoverage:this.parseList(oe.pointer(oe.coverage)),lookupRecords:this.parseRecordList(lt)}:void w.assert(!1,"0x"+e.toString(16)+": lookup type 6 format must be 1, 2 or 3.")},ut[7]=function(){var e=this.parseUShort();w.argument(1===e,"GSUB Extension Substitution subtable identifier-format must be 1");var t=this.parseUShort(),r=new oe(this.data,this.offset+this.parseULong());return{substFormat:1,lookupType:t,extension:ut[t].call(r)}},ut[8]=function(){var e=this.parseUShort();return w.argument(1===e,"GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(oe.coverage),backtrackCoverage:this.parseList(oe.pointer(oe.coverage)),lookaheadCoverage:this.parseList(oe.pointer(oe.coverage)),substitutes:this.parseUShortList()}};var pt=new Array(9);pt[1]=function(e){return 1===e.substFormat?new $.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new $.Coverage(e.coverage)},{name:"deltaGlyphID",type:"USHORT",value:e.deltaGlyphId}]):new $.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:2},{name:"coverage",type:"TABLE",value:new $.Coverage(e.coverage)}].concat($.ushortList("substitute",e.substitute)))},pt[2]=function(e){return w.assert(1===e.substFormat,"Lookup type 2 substFormat must be 1."),new $.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new $.Coverage(e.coverage)}].concat($.tableList("seqSet",e.sequences,function(e){return new $.Table("sequenceSetTable",$.ushortList("sequence",e))})))},pt[3]=function(e){return w.assert(1===e.substFormat,"Lookup type 3 substFormat must be 1."),new $.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new $.Coverage(e.coverage)}].concat($.tableList("altSet",e.alternateSets,function(e){return new $.Table("alternateSetTable",$.ushortList("alternate",e))})))},pt[4]=function(e){return w.assert(1===e.substFormat,"Lookup type 4 substFormat must be 1."),new $.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new $.Coverage(e.coverage)}].concat($.tableList("ligSet",e.ligatureSets,function(e){return new $.Table("ligatureSetTable",$.tableList("ligature",e,function(e){return new $.Table("ligatureTable",[{name:"ligGlyph",type:"USHORT",value:e.ligGlyph}].concat($.ushortList("component",e.components,e.components.length+1)))}))})))},pt[6]=function(e){if(1===e.substFormat)return new $.Table("chainContextTable",[{name:"substFormat",type:"USHORT",value:e.substFormat},{name:"coverage",type:"TABLE",value:new $.Coverage(e.coverage)}].concat($.tableList("chainRuleSet",e.chainRuleSets,function(e){return new $.Table("chainRuleSetTable",$.tableList("chainRule",e,function(e){var r=$.ushortList("backtrackGlyph",e.backtrack,e.backtrack.length).concat($.ushortList("inputGlyph",e.input,e.input.length+1)).concat($.ushortList("lookaheadGlyph",e.lookahead,e.lookahead.length)).concat($.ushortList("substitution",[],e.lookupRecords.length));return e.lookupRecords.forEach(function(e,t){r=r.concat({name:"sequenceIndex"+t,type:"USHORT",value:e.sequenceIndex}).concat({name:"lookupListIndex"+t,type:"USHORT",value:e.lookupListIndex})}),new $.Table("chainRuleTable",r)}))})));if(2===e.substFormat)w.assert(!1,"lookup type 6 format 2 is not yet supported.");else if(3===e.substFormat){var r=[{name:"substFormat",type:"USHORT",value:e.substFormat}];return r.push({name:"backtrackGlyphCount",type:"USHORT",value:e.backtrackCoverage.length}),e.backtrackCoverage.forEach(function(e,t){r.push({name:"backtrackCoverage"+t,type:"TABLE",value:new $.Coverage(e)})}),r.push({name:"inputGlyphCount",type:"USHORT",value:e.inputCoverage.length}),e.inputCoverage.forEach(function(e,t){r.push({name:"inputCoverage"+t,type:"TABLE",value:new $.Coverage(e)})}),r.push({name:"lookaheadGlyphCount",type:"USHORT",value:e.lookaheadCoverage.length}),e.lookaheadCoverage.forEach(function(e,t){r.push({name:"lookaheadCoverage"+t,type:"TABLE",value:new $.Coverage(e)})}),r.push({name:"substitutionCount",type:"USHORT",value:e.lookupRecords.length}),e.lookupRecords.forEach(function(e,t){r=r.concat({name:"sequenceIndex"+t,type:"USHORT",value:e.sequenceIndex}).concat({name:"lookupListIndex"+t,type:"USHORT",value:e.lookupListIndex})}),new $.Table("chainContextTable",r)}w.assert(!1,"lookup type 6 format must be 1, 2 or 3.")};var ct={parse:function(e,t){var r=new oe(e,t=t||0),n=r.parseVersion(1);return w.argument(1===n||1.1===n,"Unsupported GSUB table version."),1===n?{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(ut)}:{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(ut),variations:r.parseFeatureVariationsList()}},make:function(e){return new $.Table("GSUB",[{name:"version",type:"ULONG",value:65536},{name:"scripts",type:"TABLE",value:new $.ScriptList(e.scripts)},{name:"features",type:"TABLE",value:new $.FeatureList(e.features)},{name:"lookups",type:"TABLE",value:new $.LookupList(e.lookups,pt)}])}};var ht={parse:function(e,t){var r=new ie.Parser(e,t),n=r.parseULong();w.argument(1===n,"Unsupported META table version."),r.parseULong(),r.parseULong();for(var a=r.parseULong(),o={},s=0;s<a;s++){var i=r.parseTag(),u=r.parseULong(),l=r.parseULong(),p=I.UTF8(e,t+u,l);o[i]=p}return o},make:function(e){var t=Object.keys(e).length,r="",n=16+12*t,a=new $.Table("meta",[{name:"version",type:"ULONG",value:1},{name:"flags",type:"ULONG",value:0},{name:"offset",type:"ULONG",value:n},{name:"numTags",type:"ULONG",value:t}]);for(var o in e){var s=r.length;r+=e[o],a.fields.push({name:"tag "+o,type:"TAG",value:o}),a.fields.push({name:"offset "+o,type:"ULONG",value:n+s}),a.fields.push({name:"length "+o,type:"ULONG",value:e[o].length})}return a.fields.push({name:"stringPool",type:"CHARARRAY",value:r}),a}};var ft={parse:function(e,t){var r=new oe(e,t),n=r.parseUShort();w.argument(0===n,"Only COLRv0 supported.");var a=r.parseUShort(),o=r.parseOffset32(),s=r.parseOffset32(),i=r.parseUShort();r.relativeOffset=o;var u=r.parseRecordList(a,{glyphID:oe.uShort,firstLayerIndex:oe.uShort,numLayers:oe.uShort});return r.relativeOffset=s,{version:n,baseGlyphRecords:u,layerRecords:r.parseRecordList(i,{glyphID:oe.uShort,paletteIndex:oe.uShort})}},make:function(e){var t=e.version;void 0===t&&(t=0);var r=e.baseGlyphRecords;void 0===r&&(r=[]);var n=e.layerRecords;void 0===n&&(n=[]),w.argument(0===t,"Only COLRv0 supported.");var a=14,o=a+6*r.length;return new $.Table("COLR",[{name:"version",type:"USHORT",value:t},{name:"numBaseGlyphRecords",type:"USHORT",value:r.length},{name:"baseGlyphRecordsOffset",type:"ULONG",value:a},{name:"layerRecordsOffset",type:"ULONG",value:o},{name:"numLayerRecords",type:"USHORT",value:n.length}].concat(r.map(function(e,t){return[{name:"glyphID_"+t,type:"USHORT",value:e.glyphID},{name:"firstLayerIndex_"+t,type:"USHORT",value:e.firstLayerIndex},{name:"numLayers_"+t,type:"USHORT",value:e.numLayers}]}).flat(),n.map(function(e,t){return[{name:"LayerGlyphID_"+t,type:"USHORT",value:e.glyphID},{name:"paletteIndex_"+t,type:"USHORT",value:e.paletteIndex}]}).flat()))}};var dt={parse:function(e,t){var r=new oe(e,t),n=r.parseShort(),a=r.parseShort(),o=r.parseShort(),s=r.parseShort(),i=r.parseOffset32(),u=r.parseUShortList(o);return r.relativeOffset=i,{version:n,numPaletteEntries:a,colorRecords:r.parseULongList(s),colorRecordIndices:u}},make:function(e){var t=e.version;void 0===t&&(t=0);var r=e.numPaletteEntries;void 0===r&&(r=0);var n=e.colorRecords;void 0===n&&(n=[]);var a=e.colorRecordIndices;return void 0===a&&(a=[0]),w.argument(0===t,"Only CPALv0 are supported."),w.argument(n.length,"No colorRecords given."),w.argument(a.length,"No colorRecordIndices given."),1<a.length&&w.argument(r,"Can't infer numPaletteEntries on multiple colorRecordIndices"),new $.Table("CPAL",[{name:"version",type:"USHORT",value:t},{name:"numPaletteEntries",type:"USHORT",value:r||n.length},{name:"numPalettes",type:"USHORT",value:a.length},{name:"numColorRecords",type:"USHORT",value:n.length},{name:"colorRecordsArrayOffset",type:"ULONG",value:12+2*a.length}].concat(a.map(function(e,t){return{name:"colorRecordIndices_"+t,type:"USHORT",value:e}}),n.map(function(e,t){return{name:"colorRecords_"+t,type:"ULONG",value:e}})))}};function vt(e){return Math.log(e)/Math.log(2)|0}function gt(e){for(;e.length%4!=0;)e.push(0);for(var t=0,r=0;r<e.length;r+=4)t+=(e[r]<<24)+(e[r+1]<<16)+(e[r+2]<<8)+e[r+3];return t%=Math.pow(2,32)}function mt(e,t,r,n){return new $.Record("Table Record",[{name:"tag",type:"TAG",value:void 0!==e?e:""},{name:"checkSum",type:"ULONG",value:void 0!==t?t:0},{name:"offset",type:"ULONG",value:void 0!==r?r:0},{name:"length",type:"ULONG",value:void 0!==n?n:0}])}function yt(e){var t=new $.Table("sfnt",[{name:"version",type:"TAG",value:"OTTO"},{name:"numTables",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);t.tables=e,t.numTables=e.length;var r=Math.pow(2,vt(t.numTables));t.searchRange=16*r,t.entrySelector=vt(r),t.rangeShift=16*t.numTables-t.searchRange;for(var n=[],a=[],o=t.sizeOf()+mt().sizeOf()*t.numTables;o%4!=0;)o+=1,a.push({name:"padding",type:"BYTE",value:0});for(var s=0;s<e.length;s+=1){var i=e[s];w.argument(4===i.tableName.length,"Table name"+i.tableName+" is invalid.");var u=i.sizeOf(),l=mt(i.tableName,gt(i.encode()),o,u);for(n.push({name:l.tag+" Table Record",type:"RECORD",value:l}),a.push({name:i.tableName+" table",type:"RECORD",value:i}),o+=u,w.argument(!isNaN(o),"Something went wrong calculating the offset.");o%4!=0;)o+=1,a.push({name:"padding",type:"BYTE",value:0})}return n.sort(function(e,t){return e.value.tag>t.value.tag?1:-1}),t.fields=t.fields.concat(n),t.fields=t.fields.concat(a),t}function bt(e,t,r){for(var n=0;n<t.length;n+=1){var a=e.charToGlyphIndex(t[n]);if(0<a)return e.glyphs.get(a).getMetrics()}return r}var St={make:yt,fontToTable:function(e){for(var t,r=[],n=[],a=[],o=[],s=[],i=[],u=[],l=0,p=0,c=0,h=0,f=0,d=0;d<e.glyphs.length;d+=1){var v=e.glyphs.get(d),g=0|v.unicode;if(isNaN(v.advanceWidth))throw new Error("Glyph "+v.name+" ("+d+"): advanceWidth is not a number.");(g<t||void 0===t)&&0<g&&(t=g),l<g&&(l=g);var m=st.getUnicodeRange(g);if(m<32)p|=1<<m;else if(m<64)c|=1<<m-32;else if(m<96)h|=1<<m-64;else{if(!(m<123))throw new Error("Unicode ranges bits > 123 are reserved for internal usage");f|=1<<m-96}if(".notdef"!==v.name){var y=v.getMetrics();r.push(y.xMin),n.push(y.yMin),a.push(y.xMax),o.push(y.yMax),i.push(y.leftSideBearing),u.push(y.rightSideBearing),s.push(v.advanceWidth)}}var b={xMin:Math.min.apply(null,r),yMin:Math.min.apply(null,n),xMax:Math.max.apply(null,a),yMax:Math.max.apply(null,o),advanceWidthMax:Math.max.apply(null,s),advanceWidthAvg:function(e){for(var t=0,r=0;r<e.length;r+=1)t+=e[r];return t/e.length}(s),minLeftSideBearing:Math.min.apply(null,i),maxLeftSideBearing:Math.max.apply(null,i),minRightSideBearing:Math.min.apply(null,u)};b.ascender=e.ascender,b.descender=e.descender;var S=ze.make({flags:3,unitsPerEm:e.unitsPerEm,xMin:b.xMin,yMin:b.yMin,xMax:b.xMax,yMax:b.yMax,lowestRecPPEM:3,createdTimestamp:e.createdTimestamp}),x=We.make({ascender:b.ascender,descender:b.descender,advanceWidthMax:b.advanceWidthMax,minLeftSideBearing:b.minLeftSideBearing,minRightSideBearing:b.minRightSideBearing,xMaxExtent:b.maxLeftSideBearing+(b.xMax-b.xMin),numberOfHMetrics:e.glyphs.length}),T=Xe.make(e.glyphs.length),U=st.make(Object.assign({xAvgCharWidth:Math.round(b.advanceWidthAvg),usFirstCharIndex:t,usLastCharIndex:l,ulUnicodeRange1:p,ulUnicodeRange2:c,ulUnicodeRange3:h,ulUnicodeRange4:f,sTypoAscender:b.ascender,sTypoDescender:b.descender,sTypoLineGap:0,usWinAscent:b.yMax,usWinDescent:Math.abs(b.yMin),ulCodePageRange1:1,sxHeight:bt(e,"xyvw",{yMax:Math.round(b.ascender/2)}).yMax,sCapHeight:bt(e,"HIKLEFJMNTZBDPRAGOQSUVWXY",b).yMax,usDefaultChar:e.hasChar(" ")?32:0,usBreakChar:e.hasChar(" ")?32:0},e.tables.os2)),k=_e.make(e.glyphs),O=ue.make(e.glyphs),R=e.getEnglishName("fontFamily"),E=e.getEnglishName("fontSubfamily"),L=R+" "+E,C=e.getEnglishName("postScriptName");C=C||R.replace(/\s/g,"")+"-"+E;var w={};for(var D in e.names)w[D]=e.names[D];w.uniqueID||(w.uniqueID={en:e.getEnglishName("manufacturer")+":"+L}),w.postScriptName||(w.postScriptName={en:C}),w.preferredFamily||(w.preferredFamily=e.names.fontFamily),w.preferredSubfamily||(w.preferredSubfamily=e.names.fontSubfamily);var I=[],G=at.make(w,I),M=0<I.length?qe.make(I):void 0,B=it.make(),A=He.make(e.glyphs,{version:e.getEnglishName("version"),fullName:L,familyName:R,weightName:E,postScriptName:C,unitsPerEm:e.unitsPerEm,fontBBox:[0,b.yMin,b.ascender,b.advanceWidthMax]}),F=e.metas&&0<Object.keys(e.metas).length?ht.make(e.metas):void 0,P=[S,x,T,U,G,O,B,A,k];M&&P.push(M),e.tables.gsub&&P.push(ct.make(e.tables.gsub)),e.tables.cpal&&P.push(dt.make(e.tables.cpal)),e.tables.colr&&P.push(ft.make(e.tables.colr)),F&&P.push(F);for(var N=yt(P),H=gt(N.encode()),z=N.fields,W=!1,_=0;_<z.length;_+=1)if("head table"===z[_].name){z[_].value.checkSumAdjustment=2981146554-H,W=!0;break}if(!W)throw new Error("Could not find head table with checkSum to adjust.");return N},computeCheckSum:gt};function xt(e,t){for(var r=0,n=e.length-1;r<=n;){var a=r+n>>>1,o=e[a].tag;if(o===t)return a;o<t?r=1+a:n=a-1}return-r-1}function Tt(e,t){for(var r=0,n=e.length-1;r<=n;){var a=r+n>>>1,o=e[a];if(o===t)return a;o<t?r=1+a:n=a-1}return-r-1}function Ut(e,t){for(var r,n=0,a=e.length-1;n<=a;){var o=n+a>>>1,s=(r=e[o]).start;if(s===t)return r;s<t?n=1+o:a=o-1}if(0<n)return t>(r=e[n-1]).end?0:r}function kt(e,t){this.font=e,this.tableName=t}function Ot(e){kt.call(this,e,"gpos")}function Rt(e){kt.call(this,e,"gsub")}function Et(e,t){var r=e.length;if(r===t.length){for(var n=0;n<r;n++)if(e[n]!==t[n])return;return 1}}function Lt(e,t,r){for(var n=e.subtables,a=0;a<n.length;a++){var o=n[a];if(o.substFormat===t)return o}if(r)return n.push(r),r}function Ct(e){for(var t=new ArrayBuffer(e.length),r=new Uint8Array(t),n=0;n<e.length;++n)r[n]=e[n];return t}function wt(e,t){if(!e)throw t}function Dt(e,t,r,n,a){var o;return o=0<(t&n)?(o=e.parseByte(),0==(t&a)&&(o=-o),r+o):0<(t&a)?r:r+e.parseShort()}function It(e,t,r){var n,a,o=new ie.Parser(t,r);if(e.numberOfContours=o.parseShort(),e._xMin=o.parseShort(),e._yMin=o.parseShort(),e._xMax=o.parseShort(),e._yMax=o.parseShort(),0<e.numberOfContours){for(var s=e.endPointIndices=[],i=0;i<e.numberOfContours;i+=1)s.push(o.parseUShort());e.instructionLength=o.parseUShort(),e.instructions=[];for(var u=0;u<e.instructionLength;u+=1)e.instructions.push(o.parseByte());var l=s[s.length-1]+1;n=[];for(var p=0;p<l;p+=1)if(a=o.parseByte(),n.push(a),0<(8&a))for(var c=o.parseByte(),h=0;h<c;h+=1)n.push(a),p+=1;if(w.argument(n.length===l,"Bad flags."),0<s.length){var f,d=[];if(0<l){for(var v=0;v<l;v+=1)a=n[v],(f={}).onCurve=!!(1&a),f.lastPointOfContour=0<=s.indexOf(v),d.push(f);for(var g=0,m=0;m<l;m+=1)a=n[m],(f=d[m]).x=Dt(o,a,g,2,16),g=f.x;for(var y=0,b=0;b<l;b+=1)a=n[b],(f=d[b]).y=Dt(o,a,y,4,32),y=f.y}e.points=d}else e.points=[]}else if(0===e.numberOfContours)e.points=[];else{e.isComposite=!0,e.points=[],e.components=[];for(var S=!0;S;){n=o.parseUShort();var x={glyphIndex:o.parseUShort(),xScale:1,scale01:0,scale10:0,yScale:1,dx:0,dy:0};0<(1&n)?0<(2&n)?(x.dx=o.parseShort(),x.dy=o.parseShort()):x.matchedPoints=[o.parseUShort(),o.parseUShort()]:0<(2&n)?(x.dx=o.parseChar(),x.dy=o.parseChar()):x.matchedPoints=[o.parseByte(),o.parseByte()],0<(8&n)?x.xScale=x.yScale=o.parseF2Dot14():0<(64&n)?(x.xScale=o.parseF2Dot14(),x.yScale=o.parseF2Dot14()):0<(128&n)&&(x.xScale=o.parseF2Dot14(),x.scale01=o.parseF2Dot14(),x.scale10=o.parseF2Dot14(),x.yScale=o.parseF2Dot14()),e.components.push(x),S=!!(32&n)}if(256&n){e.instructionLength=o.parseUShort(),e.instructions=[];for(var T=0;T<e.instructionLength;T+=1)e.instructions.push(o.parseByte())}}}function Gt(e,t){for(var r=[],n=0;n<e.length;n+=1){var a=e[n],o={x:t.xScale*a.x+t.scale01*a.y+t.dx,y:t.scale10*a.x+t.yScale*a.y+t.dy,onCurve:a.onCurve,lastPointOfContour:a.lastPointOfContour};r.push(o)}return r}function Mt(e){var t=new B;if(!e)return t;for(var r=function(e){for(var t=[],r=[],n=0;n<e.length;n+=1){var a=e[n];r.push(a),a.lastPointOfContour&&(t.push(r),r=[])}return w.argument(0===r.length,"There are still points left in the current contour."),t}(e),n=0;n<r.length;++n){var a=r[n],o=null,s=a[a.length-1],i=a[0];if(s.onCurve)t.moveTo(s.x,s.y);else if(i.onCurve)t.moveTo(i.x,i.y);else{var u={x:.5*(s.x+i.x),y:.5*(s.y+i.y)};t.moveTo(u.x,u.y)}for(var l=0;l<a.length;++l)if(o=s,s=i,i=a[(l+1)%a.length],s.onCurve)t.lineTo(s.x,s.y);else{var p=i;o.onCurve||(s.x,o.x,s.y,o.y),i.onCurve||(p={x:.5*(s.x+i.x),y:.5*(s.y+i.y)}),t.quadraticCurveTo(s.x,s.y,p.x,p.y)}t.closePath()}return t}function Bt(e,t){if(t.isComposite)for(var r=0;r<t.components.length;r+=1){var n=t.components[r],a=e.get(n.glyphIndex);if(a.getPath(),a.points){var o=void 0;if(void 0===n.matchedPoints)o=Gt(a.points,n);else{if(n.matchedPoints[0]>t.points.length-1||n.matchedPoints[1]>a.points.length-1)throw Error("Matched points out of range in "+t.name);var s=t.points[n.matchedPoints[0]],i=a.points[n.matchedPoints[1]],u={xScale:n.xScale,scale01:n.scale01,scale10:n.scale10,yScale:n.yScale,dx:0,dy:0};i=Gt([i],u)[0],u.dx=s.x-i.x,u.dy=s.y-i.y,o=Gt(a.points,u)}t.points=t.points.concat(o)}}return Mt(t.points)}(Ot.prototype=kt.prototype={searchTag:xt,binSearch:Tt,getTable:function(e){var t=this.font.tables[this.tableName];return!t&&e&&(t=this.font.tables[this.tableName]=this.createDefaultTable()),t},getScriptNames:function(){var e=this.getTable();return e?e.scripts.map(function(e){return e.tag}):[]},getDefaultScriptName:function(){var e=this.getTable();if(e){for(var t=!1,r=0;r<e.scripts.length;r++){var n=e.scripts[r].tag;if("DFLT"===n)return n;"latn"===n&&(t=!0)}return t?"latn":void 0}},getScriptTable:function(e,t){var r=this.getTable(t);if(r){e=e||"DFLT";var n=r.scripts,a=xt(r.scripts,e);if(0<=a)return n[a].script;if(t){var o={tag:e,script:{defaultLangSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]},langSysRecords:[]}};return n.splice(-1-a,0,o),o.script}}},getLangSysTable:function(e,t,r){var n=this.getScriptTable(e,r);if(n){if(!t||"dflt"===t||"DFLT"===t)return n.defaultLangSys;var a=xt(n.langSysRecords,t);if(0<=a)return n.langSysRecords[a].langSys;if(r){var o={tag:t,langSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]}};return n.langSysRecords.splice(-1-a,0,o),o.langSys}}},getFeatureTable:function(e,t,r,n){var a=this.getLangSysTable(e,t,n);if(a){for(var o,s=a.featureIndexes,i=this.font.tables[this.tableName].features,u=0;u<s.length;u++)if((o=i[s[u]]).tag===r)return o.feature;if(n){var l=i.length;return w.assert(0===l||r>=i[l-1].tag,"Features must be added in alphabetical order."),o={tag:r,feature:{params:0,lookupListIndexes:[]}},i.push(o),s.push(l),o.feature}}},getLookupTables:function(e,t,r,n,a){var o=this.getFeatureTable(e,t,r,a),s=[];if(o){for(var i,u=o.lookupListIndexes,l=this.font.tables[this.tableName].lookups,p=0;p<u.length;p++)(i=l[u[p]]).lookupType===n&&s.push(i);if(0===s.length&&a){i={lookupType:n,lookupFlag:0,subtables:[],markFilteringSet:void 0};var c=l.length;return l.push(i),u.push(c),[i]}}return s},getGlyphClass:function(e,t){switch(e.format){case 1:return e.startGlyph<=t&&t<e.startGlyph+e.classes.length?e.classes[t-e.startGlyph]:0;case 2:var r=Ut(e.ranges,t);return r?r.classId:0}},getCoverageIndex:function(e,t){switch(e.format){case 1:var r=Tt(e.glyphs,t);return 0<=r?r:-1;case 2:var n=Ut(e.ranges,t);return n?n.index+t-n.start:-1}},expandCoverage:function(e){if(1===e.format)return e.glyphs;for(var t=[],r=e.ranges,n=0;n<r.length;n++)for(var a=r[n],o=a.start,s=a.end,i=o;i<=s;i++)t.push(i);return t}}).init=function(){var e=this.getDefaultScriptName();this.defaultKerningTables=this.getKerningTables(e)},Ot.prototype.getKerningValue=function(e,t,r){for(var n=0;n<e.length;n++)for(var a=e[n].subtables,o=0;o<a.length;o++){var s=a[o],i=this.getCoverageIndex(s.coverage,t);if(!(i<0))switch(s.posFormat){case 1:for(var u=s.pairSets[i],l=0;l<u.length;l++){var p=u[l];if(p.secondGlyph===r)return p.value1&&p.value1.xAdvance||0}break;case 2:var c=this.getGlyphClass(s.classDef1,t),h=this.getGlyphClass(s.classDef2,r),f=s.classRecords[c][h];return f.value1&&f.value1.xAdvance||0}}return 0},Ot.prototype.getKerningTables=function(e,t){if(this.font.tables.gpos)return this.getLookupTables(e,t,"kern",2)},(Rt.prototype=kt.prototype).createDefaultTable=function(){return{version:1,scripts:[{tag:"DFLT",script:{defaultLangSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]},langSysRecords:[]}}],features:[],lookups:[]}},Rt.prototype.getSingle=function(e,t,r){for(var n=[],a=this.getLookupTables(t,r,e,1),o=0;o<a.length;o++)for(var s=a[o].subtables,i=0;i<s.length;i++){var u=s[i],l=this.expandCoverage(u.coverage),p=void 0;if(1===u.substFormat){var c=u.deltaGlyphId;for(p=0;p<l.length;p++){var h=l[p];n.push({sub:h,by:h+c})}}else{var f=u.substitute;for(p=0;p<l.length;p++)n.push({sub:l[p],by:f[p]})}}return n},Rt.prototype.getMultiple=function(e,t,r){for(var n=[],a=this.getLookupTables(t,r,e,2),o=0;o<a.length;o++)for(var s=a[o].subtables,i=0;i<s.length;i++){var u=s[i],l=this.expandCoverage(u.coverage),p=void 0;for(p=0;p<l.length;p++){var c=l[p],h=u.sequences[p];n.push({sub:c,by:h})}}return n},Rt.prototype.getAlternates=function(e,t,r){for(var n=[],a=this.getLookupTables(t,r,e,3),o=0;o<a.length;o++)for(var s=a[o].subtables,i=0;i<s.length;i++)for(var u=s[i],l=this.expandCoverage(u.coverage),p=u.alternateSets,c=0;c<l.length;c++)n.push({sub:l[c],by:p[c]});return n},Rt.prototype.getLigatures=function(e,t,r){for(var n=[],a=this.getLookupTables(t,r,e,4),o=0;o<a.length;o++)for(var s=a[o].subtables,i=0;i<s.length;i++)for(var u=s[i],l=this.expandCoverage(u.coverage),p=u.ligatureSets,c=0;c<l.length;c++)for(var h=l[c],f=p[c],d=0;d<f.length;d++){var v=f[d];n.push({sub:[h].concat(v.components),by:v.ligGlyph})}return n},Rt.prototype.addSingle=function(e,t,r,n){var a=Lt(this.getLookupTables(r,n,e,1,!0)[0],2,{substFormat:2,coverage:{format:1,glyphs:[]},substitute:[]});w.assert(1===a.coverage.format,"Single: unable to modify coverage table format "+a.coverage.format);var o=t.sub,s=this.binSearch(a.coverage.glyphs,o);s<0&&(s=-1-s,a.coverage.glyphs.splice(s,0,o),a.substitute.splice(s,0,0)),a.substitute[s]=t.by},Rt.prototype.addMultiple=function(e,t,r,n){w.assert(t.by instanceof Array&&1<t.by.length,'Multiple: "by" must be an array of two or more ids');var a=Lt(this.getLookupTables(r,n,e,2,!0)[0],1,{substFormat:1,coverage:{format:1,glyphs:[]},sequences:[]});w.assert(1===a.coverage.format,"Multiple: unable to modify coverage table format "+a.coverage.format);var o=t.sub,s=this.binSearch(a.coverage.glyphs,o);s<0&&(s=-1-s,a.coverage.glyphs.splice(s,0,o),a.sequences.splice(s,0,0)),a.sequences[s]=t.by},Rt.prototype.addAlternate=function(e,t,r,n){var a=Lt(this.getLookupTables(r,n,e,3,!0)[0],1,{substFormat:1,coverage:{format:1,glyphs:[]},alternateSets:[]});w.assert(1===a.coverage.format,"Alternate: unable to modify coverage table format "+a.coverage.format);var o=t.sub,s=this.binSearch(a.coverage.glyphs,o);s<0&&(s=-1-s,a.coverage.glyphs.splice(s,0,o),a.alternateSets.splice(s,0,0)),a.alternateSets[s]=t.by},Rt.prototype.addLigature=function(e,t,r,n){var a=this.getLookupTables(r,n,e,4,!0)[0],o=a.subtables[0];o||(o={substFormat:1,coverage:{format:1,glyphs:[]},ligatureSets:[]},a.subtables[0]=o),w.assert(1===o.coverage.format,"Ligature: unable to modify coverage table format "+o.coverage.format);var s=t.sub[0],i=t.sub.slice(1),u={ligGlyph:t.by,components:i},l=this.binSearch(o.coverage.glyphs,s);if(0<=l){for(var p=o.ligatureSets[l],c=0;c<p.length;c++)if(Et(p[c].components,i))return;p.push(u)}else l=-1-l,o.coverage.glyphs.splice(l,0,s),o.ligatureSets.splice(l,0,[u])},Rt.prototype.getFeature=function(e,t,r){if(/ss\d\d/.test(e))return this.getSingle(e,t,r);switch(e){case"aalt":case"salt":return this.getSingle(e,t,r).concat(this.getAlternates(e,t,r));case"dlig":case"liga":case"rlig":return this.getLigatures(e,t,r);case"ccmp":return this.getMultiple(e,t,r).concat(this.getLigatures(e,t,r));case"stch":return this.getMultiple(e,t,r)}},Rt.prototype.add=function(e,t,r,n){if(/ss\d\d/.test(e))return this.addSingle(e,t,r,n);switch(e){case"aalt":case"salt":return"number"==typeof t.by?this.addSingle(e,t,r,n):this.addAlternate(e,t,r,n);case"dlig":case"liga":case"rlig":return this.addLigature(e,t,r,n);case"ccmp":return t.by instanceof Array?this.addMultiple(e,t,r,n):this.addLigature(e,t,r,n)}};var At,Ft,Pt,Nt,Ht={getPath:Mt,parse:function(e,t,r,n,a){return a.lowMemory?(o=e,s=t,i=r,u=n,l=new Te.GlyphSet(u),u._push=function(e){var t=i[e];t!==i[e+1]?l.push(e,Te.ttfGlyphLoader(u,e,It,o,s+t,Bt)):l.push(e,Te.glyphLoader(u,e))},l):function(e,t,r,n){for(var a=new Te.GlyphSet(n),o=0;o<r.length-1;o+=1){var s=r[o];s!==r[o+1]?a.push(o,Te.ttfGlyphLoader(n,o,It,e,t+s,Bt)):a.push(o,Te.glyphLoader(n,o))}return a}(e,t,r,n);var o,s,i,u,l}};function zt(e){this.font=e,this.getCommands=function(e){return Ht.getPath(e).commands},this._fpgmState=this._prepState=void 0,this._errorState=0}function Wt(e){return e}function _t(e){return Math.sign(e)*Math.round(Math.abs(e))}function qt(e){return Math.sign(e)*Math.round(Math.abs(2*e))/2}function Xt(e){return Math.sign(e)*(Math.round(Math.abs(e)+.5)-.5)}function Vt(e){return Math.sign(e)*Math.ceil(Math.abs(e))}function Yt(e){return Math.sign(e)*Math.floor(Math.abs(e))}function jt(e){var t=this.srPeriod,r=this.srPhase,n=1;return e<0&&(e=-e,n=-1),e+=this.srThreshold-r,e=Math.trunc(e/t)*t,(e+=r)<0?r*n:e*n}var Zt={x:1,y:0,axis:"x",distance:function(e,t,r,n){return(r?e.xo:e.x)-(n?t.xo:t.x)},interpolate:function(e,t,r,n){var a,o,s,i,u,l,p;if(!n||n===this)return a=e.xo-t.xo,o=e.xo-r.xo,u=t.x-t.xo,l=r.x-r.xo,0===(p=(s=Math.abs(a))+(i=Math.abs(o)))?void(e.x=e.xo+(u+l)/2):void(e.x=e.xo+(u*i+l*s)/p);a=n.distance(e,t,!0,!0),o=n.distance(e,r,!0,!0),u=n.distance(t,t,!1,!0),l=n.distance(r,r,!1,!0),0!==(p=(s=Math.abs(a))+(i=Math.abs(o)))?Zt.setRelative(e,e,(u*i+l*s)/p,n,!0):Zt.setRelative(e,e,(u+l)/2,n,!0)},normalSlope:Number.NEGATIVE_INFINITY,setRelative:function(e,t,r,n,a){if(n&&n!==this){var o=a?t.xo:t.x,s=a?t.yo:t.y,i=o+r*n.x,u=s+r*n.y;e.x=i+(e.y-u)/n.normalSlope}else e.x=(a?t.xo:t.x)+r},slope:0,touch:function(e){e.xTouched=!0},touched:function(e){return e.xTouched},untouch:function(e){e.xTouched=!1}},Qt={x:0,y:1,axis:"y",distance:function(e,t,r,n){return(r?e.yo:e.y)-(n?t.yo:t.y)},interpolate:function(e,t,r,n){var a,o,s,i,u,l,p;if(!n||n===this)return a=e.yo-t.yo,o=e.yo-r.yo,u=t.y-t.yo,l=r.y-r.yo,0===(p=(s=Math.abs(a))+(i=Math.abs(o)))?void(e.y=e.yo+(u+l)/2):void(e.y=e.yo+(u*i+l*s)/p);a=n.distance(e,t,!0,!0),o=n.distance(e,r,!0,!0),u=n.distance(t,t,!1,!0),l=n.distance(r,r,!1,!0),0!==(p=(s=Math.abs(a))+(i=Math.abs(o)))?Qt.setRelative(e,e,(u*i+l*s)/p,n,!0):Qt.setRelative(e,e,(u+l)/2,n,!0)},normalSlope:0,setRelative:function(e,t,r,n,a){if(n&&n!==this){var o=a?t.xo:t.x,s=a?t.yo:t.y,i=o+r*n.x,u=s+r*n.y;e.y=u+n.normalSlope*(e.x-i)}else e.y=(a?t.yo:t.y)+r},slope:Number.POSITIVE_INFINITY,touch:function(e){e.yTouched=!0},touched:function(e){return e.yTouched},untouch:function(e){e.yTouched=!1}};function Kt(e,t){this.x=e,this.y=t,this.axis=void 0,this.slope=t/e,this.normalSlope=-e/t,Object.freeze(this)}function Jt(e,t){var r=Math.sqrt(e*e+t*t);return t/=r,1===(e/=r)&&0===t?Zt:0===e&&1===t?Qt:new Kt(e,t)}function $t(e,t,r,n){this.x=this.xo=Math.round(64*e)/64,this.y=this.yo=Math.round(64*t)/64,this.lastPointOfContour=r,this.onCurve=n,this.prevPointOnContour=void 0,this.nextPointOnContour=void 0,this.xTouched=!1,this.yTouched=!1,Object.preventExtensions(this)}Object.freeze(Zt),Object.freeze(Qt),Kt.prototype.distance=function(e,t,r,n){return this.x*Zt.distance(e,t,r,n)+this.y*Qt.distance(e,t,r,n)},Kt.prototype.interpolate=function(e,t,r,n){var a,o,s,i,u,l,p;s=n.distance(e,t,!0,!0),i=n.distance(e,r,!0,!0),a=n.distance(t,t,!1,!0),o=n.distance(r,r,!1,!0),0!==(p=(u=Math.abs(s))+(l=Math.abs(i)))?this.setRelative(e,e,(a*l+o*u)/p,n,!0):this.setRelative(e,e,(a+o)/2,n,!0)},Kt.prototype.setRelative=function(e,t,r,n,a){n=n||this;var o=a?t.xo:t.x,s=a?t.yo:t.y,i=o+r*n.x,u=s+r*n.y,l=n.normalSlope,p=this.slope,c=e.x,h=e.y;e.x=(p*c-l*i+u-h)/(p-l),e.y=p*(e.x-c)+h},Kt.prototype.touch=function(e){e.xTouched=!0,e.yTouched=!0},$t.prototype.nextTouched=function(e){for(var t=this.nextPointOnContour;!e.touched(t)&&t!==this;)t=t.nextPointOnContour;return t},$t.prototype.prevTouched=function(e){for(var t=this.prevPointOnContour;!e.touched(t)&&t!==this;)t=t.prevPointOnContour;return t};var er=Object.freeze(new $t(0,0)),tr={cvCutIn:17/16,deltaBase:9,deltaShift:.125,loop:1,minDis:1,autoFlip:!0};function rr(e,t){switch(this.env=e,this.stack=[],this.prog=t,e){case"glyf":this.zp0=this.zp1=this.zp2=1,this.rp0=this.rp1=this.rp2=0;case"prep":this.fv=this.pv=this.dpv=Zt,this.round=_t}}function nr(e){for(var t=e.tZone=new Array(e.gZone.length),r=0;r<t.length;r++)t[r]=new $t(0,0)}function ar(e,t){var r,n=e.prog,a=e.ip,o=1;do{if(88===(r=n[++a]))o++;else if(89===r)o--;else if(64===r)a+=n[a+1]+1;else if(65===r)a+=2*n[a+1]+1;else if(176<=r&&r<=183)a+=r-176+1;else if(184<=r&&r<=191)a+=2*(r-184+1);else if(t&&1===o&&27===r)break}while(0<o);e.ip=a}function or(e,t){O.DEBUG&&console.log(t.step,"SVTCA["+e.axis+"]"),t.fv=t.pv=t.dpv=e}function sr(e,t){O.DEBUG&&console.log(t.step,"SPVTCA["+e.axis+"]"),t.pv=t.dpv=e}function ir(e,t){O.DEBUG&&console.log(t.step,"SFVTCA["+e.axis+"]"),t.fv=e}function ur(e,t){var r,n,a=t.stack,o=a.pop(),s=a.pop(),i=t.z2[o],u=t.z1[s];O.DEBUG&&console.log("SPVTL["+e+"]",o,s),n=e?(r=i.y-u.y,u.x-i.x):(r=u.x-i.x,u.y-i.y),t.pv=t.dpv=Jt(r,n)}function lr(e,t){var r,n,a=t.stack,o=a.pop(),s=a.pop(),i=t.z2[o],u=t.z1[s];O.DEBUG&&console.log("SFVTL["+e+"]",o,s),n=e?(r=i.y-u.y,u.x-i.x):(r=u.x-i.x,u.y-i.y),t.fv=Jt(r,n)}function pr(e){O.DEBUG&&console.log(e.step,"POP[]"),e.stack.pop()}function cr(e,t){var r=t.stack.pop(),n=t.z0[r],a=t.fv,o=t.pv;O.DEBUG&&console.log(t.step,"MDAP["+e+"]",r);var s=o.distance(n,er);e&&(s=t.round(s)),a.setRelative(n,er,s,o),a.touch(n),t.rp0=t.rp1=r}function hr(e,t){var r,n,a,o=t.z2,s=o.length-2;O.DEBUG&&console.log(t.step,"IUP["+e.axis+"]");for(var i=0;i<s;i++)r=o[i],e.touched(r)||(n=r.prevTouched(e))!==r&&(n===(a=r.nextTouched(e))&&e.setRelative(r,r,e.distance(n,n,!1,!0),e,!0),e.interpolate(r,n,a,e))}function fr(e,t){for(var r=t.stack,n=e?t.rp1:t.rp2,a=(e?t.z0:t.z1)[n],o=t.fv,s=t.pv,i=t.loop,u=t.z2;i--;){var l=r.pop(),p=u[l],c=s.distance(a,a,!1,!0);o.setRelative(p,p,c,s),o.touch(p),O.DEBUG&&console.log(t.step,(1<t.loop?"loop "+(t.loop-i)+": ":"")+"SHP["+(e?"rp1":"rp2")+"]",l)}t.loop=1}function dr(e,t){var r=t.stack,n=e?t.rp1:t.rp2,a=(e?t.z0:t.z1)[n],o=t.fv,s=t.pv,i=r.pop(),u=t.z2[t.contours[i]],l=u;O.DEBUG&&console.log(t.step,"SHC["+e+"]",i);for(var p=s.distance(a,a,!1,!0);l!==a&&o.setRelative(l,l,p,s),(l=l.nextPointOnContour)!==u;);}function vr(e,t){var r,n,a=t.stack,o=e?t.rp1:t.rp2,s=(e?t.z0:t.z1)[o],i=t.fv,u=t.pv,l=a.pop();switch(O.DEBUG&&console.log(t.step,"SHZ["+e+"]",l),l){case 0:r=t.tZone;break;case 1:r=t.gZone;break;default:throw new Error("Invalid zone")}for(var p=u.distance(s,s,!1,!0),c=r.length-2,h=0;h<c;h++)n=r[h],i.setRelative(n,n,p,u)}function gr(e,t){var r=t.stack,n=r.pop()/64,a=r.pop(),o=t.z1[a],s=t.z0[t.rp0],i=t.fv,u=t.pv;i.setRelative(o,s,n,u),i.touch(o),O.DEBUG&&console.log(t.step,"MSIRP["+e+"]",n,a),t.rp1=t.rp0,t.rp2=a,e&&(t.rp0=a)}function mr(e,t){var r=t.stack,n=r.pop(),a=r.pop(),o=t.z0[a],s=t.fv,i=t.pv,u=t.cvt[n];O.DEBUG&&console.log(t.step,"MIAP["+e+"]",n,"(",u,")",a);var l=i.distance(o,er);e&&(Math.abs(l-u)<t.cvCutIn&&(l=u),l=t.round(l)),s.setRelative(o,er,l,i),0===t.zp0&&(o.xo=o.x,o.yo=o.y),s.touch(o),t.rp0=t.rp1=a}function yr(e,t){var r=t.stack,n=r.pop(),a=t.z2[n];O.DEBUG&&console.log(t.step,"GC["+e+"]",n),r.push(64*t.dpv.distance(a,er,e,!1))}function br(e,t){var r=t.stack,n=r.pop(),a=r.pop(),o=t.z1[n],s=t.z0[a],i=t.dpv.distance(s,o,e,e);O.DEBUG&&console.log(t.step,"MD["+e+"]",n,a,"->",i),t.stack.push(Math.round(64*i))}function Sr(e,t){var r=t.stack,n=r.pop(),a=t.fv,o=t.pv,s=t.ppem,i=t.deltaBase+16*(e-1),u=t.deltaShift,l=t.z0;O.DEBUG&&console.log(t.step,"DELTAP["+e+"]",n,r);for(var p=0;p<n;p++){var c=r.pop(),h=r.pop();if(i+((240&h)>>4)===s){var f=(15&h)-8;0<=f&&f++,O.DEBUG&&console.log(t.step,"DELTAPFIX",c,"by",f*u);var d=l[c];a.setRelative(d,d,f*u,o)}}}function xr(e,t){var r=t.stack,n=r.pop();O.DEBUG&&console.log(t.step,"ROUND[]"),r.push(64*t.round(n/64))}function Tr(e,t){var r=t.stack,n=r.pop(),a=t.ppem,o=t.deltaBase+16*(e-1),s=t.deltaShift;O.DEBUG&&console.log(t.step,"DELTAC["+e+"]",n,r);for(var i=0;i<n;i++){var u=r.pop(),l=r.pop();if(o+((240&l)>>4)===a){var p=(15&l)-8;0<=p&&p++;var c=p*s;O.DEBUG&&console.log(t.step,"DELTACFIX",u,"by",c),t.cvt[u]+=c}}}function Ur(e,t){var r,n,a=t.stack,o=a.pop(),s=a.pop(),i=t.z2[o],u=t.z1[s];O.DEBUG&&console.log(t.step,"SDPVTL["+e+"]",o,s),n=e?(r=i.y-u.y,u.x-i.x):(r=u.x-i.x,u.y-i.y),t.dpv=Jt(r,n)}function kr(e,t){var r=t.stack,n=t.prog,a=t.ip;O.DEBUG&&console.log(t.step,"PUSHB["+e+"]");for(var o=0;o<e;o++)r.push(n[++a]);t.ip=a}function Or(e,t){var r=t.ip,n=t.prog,a=t.stack;O.DEBUG&&console.log(t.ip,"PUSHW["+e+"]");for(var o=0;o<e;o++){var s=n[++r]<<8|n[++r];32768&s&&(s=-(1+(65535^s))),a.push(s)}t.ip=r}function Rr(e,t,r,n,a,o){var s,i,u,l,p=o.stack,c=e&&p.pop(),h=p.pop(),f=o.rp0,d=o.z0[f],v=o.z1[h],g=o.minDis,m=o.fv,y=o.dpv;u=0<=(i=s=y.distance(v,d,!0,!0))?1:-1,i=Math.abs(i),e&&(l=o.cvt[c],n&&Math.abs(i-l)<o.cvCutIn&&(i=l)),r&&i<g&&(i=g),n&&(i=o.round(i)),m.setRelative(v,d,u*i,y),m.touch(v),O.DEBUG&&console.log(o.step,(e?"MIRP[":"MDRP[")+(t?"M":"m")+(r?">":"_")+(n?"R":"_")+(0===a?"Gr":1===a?"Bl":2===a?"Wh":"")+"]",e?c+"("+o.cvt[c]+","+l+")":"",h,"(d =",s,"->",u*i,")"),o.rp1=o.rp0,o.rp2=h,t&&(o.rp0=h)}function Er(e){this.char=e,this.state={},this.activeState=null}function Lr(e,t,r){this.contextName=r,this.startIndex=e,this.endOffset=t}function Cr(e,t,r){this.contextName=e,this.openRange=null,this.ranges=[],this.checkStart=t,this.checkEnd=r}function wr(e,t){this.context=e,this.index=t,this.length=e.length,this.current=e[t],this.backtrack=e.slice(0,t),this.lookahead=e.slice(t+1)}function Dr(e){this.eventId=e,this.subscribers=[]}function Ir(e){this.tokens=[],this.registeredContexts={},this.contextCheckers=[],this.events={},this.registeredModifiers=[],function(r){var n=this,e=["start","end","next","newToken","contextStart","contextEnd","insertToken","removeToken","removeRange","replaceToken","replaceRange","composeRUD","updateContextsRanges"];e.forEach(function(e){Object.defineProperty(n.events,e,{value:new Dr(e)})}),r&&e.forEach(function(e){var t=r[e];"function"==typeof t&&n.events[e].subscribe(t)}),["insertToken","removeToken","removeRange","replaceToken","replaceRange","composeRUD"].forEach(function(e){n.events[e].subscribe(n.updateContextsRanges)})}.call(this,e)}function Gr(e){return/[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(e)}function Mr(e){return/[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(e)}function Br(e){return/[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(e)}function Ar(e){return/[A-z]/.test(e)}function Fr(e){this.font=e,this.features={}}function Pr(e){this.id=e.id,this.tag=e.tag,this.substitution=e.substitution}function Nr(e,t){if(!e)return-1;switch(t.format){case 1:return t.glyphs.indexOf(e);case 2:for(var r=t.ranges,n=0;n<r.length;n++){var a=r[n];if(e>=a.start&&e<=a.end){var o=e-a.start;return a.index+o}}break;default:return-1}return-1}function Hr(e,t){for(var r=[],n=0;n<e.length;n++){var a=e[n],o=t.current,s=Nr(o=Array.isArray(o)?o[0]:o,a);-1!==s&&r.push(s)}return r.length!==e.length?-1:r}zt.prototype.exec=function(e,t){if("number"!=typeof t)throw new Error("Point size is not a number!");if(!(2<this._errorState)){var r=this.font,n=this._prepState;if(!n||n.ppem!==t){var a=this._fpgmState;if(!a){rr.prototype=tr,(a=this._fpgmState=new rr("fpgm",r.tables.fpgm)).funcs=[],a.font=r,O.DEBUG&&(console.log("---EXEC FPGM---"),a.step=-1);try{Ft(a)}catch(e){return console.log("Hinting error in FPGM:"+e),void(this._errorState=3)}}rr.prototype=a,(n=this._prepState=new rr("prep",r.tables.prep)).ppem=t;var o=r.tables.cvt;if(o)for(var s=n.cvt=new Array(o.length),i=t/r.unitsPerEm,u=0;u<o.length;u++)s[u]=o[u]*i;else n.cvt=[];O.DEBUG&&(console.log("---EXEC PREP---"),n.step=-1);try{Ft(n)}catch(e){this._errorState<2&&console.log("Hinting error in PREP:"+e),this._errorState=2}}if(!(1<this._errorState))try{return Pt(e,n)}catch(e){return this._errorState<1&&(console.log("Hinting error:"+e),console.log("Note: further hinting errors are silenced")),void(this._errorState=1)}}},Pt=function(e,t){var r,n,a,o=t.ppem/t.font.unitsPerEm,s=o,i=e.components;if(rr.prototype=t,i){var u=t.font;n=[],r=[];for(var l=0;l<i.length;l++){var p=i[l],c=u.glyphs.get(p.glyphIndex);a=new rr("glyf",c.instructions),O.DEBUG&&(console.log("---EXEC COMP "+l+"---"),a.step=-1),Nt(c,a,o,s);for(var h=Math.round(p.dx*o),f=Math.round(p.dy*s),d=a.gZone,v=a.contours,g=0;g<d.length;g++){var m=d[g];m.xTouched=m.yTouched=!1,m.xo=m.x=m.x+h,m.yo=m.y=m.y+f}var y=n.length;n.push.apply(n,d);for(var b=0;b<v.length;b++)r.push(v[b]+y)}e.instructions&&!a.inhibitGridFit&&((a=new rr("glyf",e.instructions)).gZone=a.z0=a.z1=a.z2=n,a.contours=r,n.push(new $t(0,0),new $t(Math.round(e.advanceWidth*o),0)),O.DEBUG&&(console.log("---EXEC COMPOSITE---"),a.step=-1),Ft(a),n.length-=2)}else a=new rr("glyf",e.instructions),O.DEBUG&&(console.log("---EXEC GLYPH---"),a.step=-1),Nt(e,a,o,s),n=a.gZone;return n},Nt=function(e,t,r,n){for(var a,o,s,i=e.points||[],u=i.length,l=t.gZone=t.z0=t.z1=t.z2=[],p=t.contours=[],c=0;c<u;c++)a=i[c],l[c]=new $t(a.x*r,a.y*n,a.lastPointOfContour,a.onCurve);for(var h=0;h<u;h++)a=l[h],o||(o=a,p.push(h)),a.lastPointOfContour?((a.nextPointOnContour=o).prevPointOnContour=a,o=void 0):(s=l[h+1],(a.nextPointOnContour=s).prevPointOnContour=a);if(!t.inhibitGridFit){if(O.DEBUG){console.log("PROCESSING GLYPH",t.stack);for(var f=0;f<u;f++)console.log(f,l[f].x,l[f].y)}if(l.push(new $t(0,0),new $t(Math.round(e.advanceWidth*r),0)),Ft(t),l.length-=2,O.DEBUG){console.log("FINISHED GLYPH",t.stack);for(var d=0;d<u;d++)console.log(d,l[d].x,l[d].y)}}},Ft=function(e){var t=e.prog;if(t){var r,n=t.length;for(e.ip=0;e.ip<n;e.ip++){if(O.DEBUG&&e.step++,!(r=At[t[e.ip]]))throw new Error("unknown instruction: 0x"+Number(t[e.ip]).toString(16));r(e)}}},At=[or.bind(void 0,Qt),or.bind(void 0,Zt),sr.bind(void 0,Qt),sr.bind(void 0,Zt),ir.bind(void 0,Qt),ir.bind(void 0,Zt),ur.bind(void 0,0),ur.bind(void 0,1),lr.bind(void 0,0),lr.bind(void 0,1),function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"SPVFS[]",r,n),e.pv=e.dpv=Jt(n,r)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"SPVFS[]",r,n),e.fv=Jt(n,r)},function(e){var t=e.stack,r=e.pv;O.DEBUG&&console.log(e.step,"GPV[]"),t.push(16384*r.x),t.push(16384*r.y)},function(e){var t=e.stack,r=e.fv;O.DEBUG&&console.log(e.step,"GFV[]"),t.push(16384*r.x),t.push(16384*r.y)},function(e){e.fv=e.pv,O.DEBUG&&console.log(e.step,"SFVTPV[]")},function(e){var t=e.stack,r=t.pop(),n=t.pop(),a=t.pop(),o=t.pop(),s=t.pop(),i=e.z0,u=e.z1,l=i[r],p=i[n],c=u[a],h=u[o],f=e.z2[s];O.DEBUG&&console.log("ISECT[], ",r,n,a,o,s);var d=l.x,v=l.y,g=p.x,m=p.y,y=c.x,b=c.y,S=h.x,x=h.y,T=(d-g)*(b-x)-(v-m)*(y-S),U=d*m-v*g,k=y*x-b*S;f.x=(U*(y-S)-k*(d-g))/T,f.y=(U*(b-x)-k*(v-m))/T},function(e){e.rp0=e.stack.pop(),O.DEBUG&&console.log(e.step,"SRP0[]",e.rp0)},function(e){e.rp1=e.stack.pop(),O.DEBUG&&console.log(e.step,"SRP1[]",e.rp1)},function(e){e.rp2=e.stack.pop(),O.DEBUG&&console.log(e.step,"SRP2[]",e.rp2)},function(e){var t=e.stack.pop();switch(O.DEBUG&&console.log(e.step,"SZP0[]",t),e.zp0=t){case 0:e.tZone||nr(e),e.z0=e.tZone;break;case 1:e.z0=e.gZone;break;default:throw new Error("Invalid zone pointer")}},function(e){var t=e.stack.pop();switch(O.DEBUG&&console.log(e.step,"SZP1[]",t),e.zp1=t){case 0:e.tZone||nr(e),e.z1=e.tZone;break;case 1:e.z1=e.gZone;break;default:throw new Error("Invalid zone pointer")}},function(e){var t=e.stack.pop();switch(O.DEBUG&&console.log(e.step,"SZP2[]",t),e.zp2=t){case 0:e.tZone||nr(e),e.z2=e.tZone;break;case 1:e.z2=e.gZone;break;default:throw new Error("Invalid zone pointer")}},function(e){var t=e.stack.pop();switch(O.DEBUG&&console.log(e.step,"SZPS[]",t),e.zp0=e.zp1=e.zp2=t,t){case 0:e.tZone||nr(e),e.z0=e.z1=e.z2=e.tZone;break;case 1:e.z0=e.z1=e.z2=e.gZone;break;default:throw new Error("Invalid zone pointer")}},function(e){e.loop=e.stack.pop(),O.DEBUG&&console.log(e.step,"SLOOP[]",e.loop)},function(e){O.DEBUG&&console.log(e.step,"RTG[]"),e.round=_t},function(e){O.DEBUG&&console.log(e.step,"RTHG[]"),e.round=Xt},function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"SMD[]",t),e.minDis=t/64},function(e){O.DEBUG&&console.log(e.step,"ELSE[]"),ar(e,!1)},function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"JMPR[]",t),e.ip+=t-1},function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"SCVTCI[]",t),e.cvCutIn=t/64},void 0,void 0,function(e){var t=e.stack;O.DEBUG&&console.log(e.step,"DUP[]"),t.push(t[t.length-1])},pr,function(e){O.DEBUG&&console.log(e.step,"CLEAR[]"),e.stack.length=0},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"SWAP[]"),t.push(r),t.push(n)},function(e){var t=e.stack;O.DEBUG&&console.log(e.step,"DEPTH[]"),t.push(t.length)},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"CINDEX[]",r),t.push(t[t.length-r])},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"MINDEX[]",r),t.push(t.splice(t.length-r,1)[0])},void 0,void 0,void 0,function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"LOOPCALL[]",r,n);var a=e.ip,o=e.prog;e.prog=e.funcs[r];for(var s=0;s<n;s++)Ft(e),O.DEBUG&&console.log(++e.step,s+1<n?"next loopcall":"done loopcall",s);e.ip=a,e.prog=o},function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"CALL[]",t);var r=e.ip,n=e.prog;e.prog=e.funcs[t],Ft(e),e.ip=r,e.prog=n,O.DEBUG&&console.log(++e.step,"returning from",t)},function(e){if("fpgm"!==e.env)throw new Error("FDEF not allowed here");var t=e.stack,r=e.prog,n=e.ip,a=t.pop(),o=n;for(O.DEBUG&&console.log(e.step,"FDEF[]",a);45!==r[++n];);e.ip=n,e.funcs[a]=r.slice(o+1,n)},void 0,cr.bind(void 0,0),cr.bind(void 0,1),hr.bind(void 0,Qt),hr.bind(void 0,Zt),fr.bind(void 0,0),fr.bind(void 0,1),dr.bind(void 0,0),dr.bind(void 0,1),vr.bind(void 0,0),vr.bind(void 0,1),function(e){for(var t=e.stack,r=e.loop,n=e.fv,a=t.pop()/64,o=e.z2;r--;){var s=t.pop(),i=o[s];O.DEBUG&&console.log(e.step,(1<e.loop?"loop "+(e.loop-r)+": ":"")+"SHPIX[]",s,a),n.setRelative(i,i,a),n.touch(i)}e.loop=1},function(e){for(var t=e.stack,r=e.rp1,n=e.rp2,a=e.loop,o=e.z0[r],s=e.z1[n],i=e.fv,u=e.dpv,l=e.z2;a--;){var p=t.pop(),c=l[p];O.DEBUG&&console.log(e.step,(1<e.loop?"loop "+(e.loop-a)+": ":"")+"IP[]",p,r,"<->",n),i.interpolate(c,o,s,u),i.touch(c)}e.loop=1},gr.bind(void 0,0),gr.bind(void 0,1),function(e){for(var t=e.stack,r=e.rp0,n=e.z0[r],a=e.loop,o=e.fv,s=e.pv,i=e.z1;a--;){var u=t.pop(),l=i[u];O.DEBUG&&console.log(e.step,(1<e.loop?"loop "+(e.loop-a)+": ":"")+"ALIGNRP[]",u),o.setRelative(l,n,0,s),o.touch(l)}e.loop=1},function(e){O.DEBUG&&console.log(e.step,"RTDG[]"),e.round=qt},mr.bind(void 0,0),mr.bind(void 0,1),function(e){var t=e.prog,r=e.ip,n=e.stack,a=t[++r];O.DEBUG&&console.log(e.step,"NPUSHB[]",a);for(var o=0;o<a;o++)n.push(t[++r]);e.ip=r},function(e){var t=e.ip,r=e.prog,n=e.stack,a=r[++t];O.DEBUG&&console.log(e.step,"NPUSHW[]",a);for(var o=0;o<a;o++){var s=r[++t]<<8|r[++t];32768&s&&(s=-(1+(65535^s))),n.push(s)}e.ip=t},function(e){var t=e.stack,r=e.store;r=r||(e.store=[]);var n=t.pop(),a=t.pop();O.DEBUG&&console.log(e.step,"WS",n,a),r[a]=n},function(e){var t=e.stack,r=e.store,n=t.pop();O.DEBUG&&console.log(e.step,"RS",n);var a=r&&r[n]||0;t.push(a)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"WCVTP",r,n),e.cvt[n]=r/64},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"RCVT",r),t.push(64*e.cvt[r])},yr.bind(void 0,0),yr.bind(void 0,1),void 0,br.bind(void 0,0),br.bind(void 0,1),function(e){O.DEBUG&&console.log(e.step,"MPPEM[]"),e.stack.push(e.ppem)},void 0,function(e){O.DEBUG&&console.log(e.step,"FLIPON[]"),e.autoFlip=!0},void 0,void 0,function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"LT[]",r,n),t.push(n<r?1:0)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"LTEQ[]",r,n),t.push(n<=r?1:0)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"GT[]",r,n),t.push(r<n?1:0)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"GTEQ[]",r,n),t.push(r<=n?1:0)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"EQ[]",r,n),t.push(r===n?1:0)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"NEQ[]",r,n),t.push(r!==n?1:0)},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"ODD[]",r),t.push(Math.trunc(r)%2?1:0)},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"EVEN[]",r),t.push(Math.trunc(r)%2?0:1)},function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"IF[]",t),t||(ar(e,!0),O.DEBUG&&console.log(e.step,"EIF[]"))},function(e){O.DEBUG&&console.log(e.step,"EIF[]")},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"AND[]",r,n),t.push(r&&n?1:0)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"OR[]",r,n),t.push(r||n?1:0)},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"NOT[]",r),t.push(r?0:1)},Sr.bind(void 0,1),function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"SDB[]",t),e.deltaBase=t},function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"SDS[]",t),e.deltaShift=Math.pow(.5,t)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"ADD[]",r,n),t.push(n+r)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"SUB[]",r,n),t.push(n-r)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"DIV[]",r,n),t.push(64*n/r)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"MUL[]",r,n),t.push(n*r/64)},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"ABS[]",r),t.push(Math.abs(r))},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"NEG[]",r),t.push(-r)},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"FLOOR[]",r),t.push(64*Math.floor(r/64))},function(e){var t=e.stack,r=t.pop();O.DEBUG&&console.log(e.step,"CEILING[]",r),t.push(64*Math.ceil(r/64))},xr.bind(void 0,0),xr.bind(void 0,1),xr.bind(void 0,2),xr.bind(void 0,3),void 0,void 0,void 0,void 0,function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"WCVTF[]",r,n),e.cvt[n]=r*e.ppem/e.font.unitsPerEm},Sr.bind(void 0,2),Sr.bind(void 0,3),Tr.bind(void 0,1),Tr.bind(void 0,2),Tr.bind(void 0,3),function(e){var t,r=e.stack.pop();switch(O.DEBUG&&console.log(e.step,"SROUND[]",r),e.round=jt,192&r){case 0:t=.5;break;case 64:t=1;break;case 128:t=2;break;default:throw new Error("invalid SROUND value")}switch(e.srPeriod=t,48&r){case 0:e.srPhase=0;break;case 16:e.srPhase=.25*t;break;case 32:e.srPhase=.5*t;break;case 48:e.srPhase=.75*t;break;default:throw new Error("invalid SROUND value")}r&=15,e.srThreshold=0===r?0:(r/8-.5)*t},function(e){var t,r=e.stack.pop();switch(O.DEBUG&&console.log(e.step,"S45ROUND[]",r),e.round=jt,192&r){case 0:t=Math.sqrt(2)/2;break;case 64:t=Math.sqrt(2);break;case 128:t=2*Math.sqrt(2);break;default:throw new Error("invalid S45ROUND value")}switch(e.srPeriod=t,48&r){case 0:e.srPhase=0;break;case 16:e.srPhase=.25*t;break;case 32:e.srPhase=.5*t;break;case 48:e.srPhase=.75*t;break;default:throw new Error("invalid S45ROUND value")}r&=15,e.srThreshold=0===r?0:(r/8-.5)*t},void 0,void 0,function(e){O.DEBUG&&console.log(e.step,"ROFF[]"),e.round=Wt},void 0,function(e){O.DEBUG&&console.log(e.step,"RUTG[]"),e.round=Vt},function(e){O.DEBUG&&console.log(e.step,"RDTG[]"),e.round=Yt},pr,pr,void 0,void 0,void 0,void 0,void 0,function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"SCANCTRL[]",t)},Ur.bind(void 0,0),Ur.bind(void 0,1),function(e){var t=e.stack,r=t.pop(),n=0;O.DEBUG&&console.log(e.step,"GETINFO[]",r),1&r&&(n=35),32&r&&(n|=4096),t.push(n)},void 0,function(e){var t=e.stack,r=t.pop(),n=t.pop(),a=t.pop();O.DEBUG&&console.log(e.step,"ROLL[]"),t.push(n),t.push(r),t.push(a)},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"MAX[]",r,n),t.push(Math.max(n,r))},function(e){var t=e.stack,r=t.pop(),n=t.pop();O.DEBUG&&console.log(e.step,"MIN[]",r,n),t.push(Math.min(n,r))},function(e){var t=e.stack.pop();O.DEBUG&&console.log(e.step,"SCANTYPE[]",t)},function(e){var t=e.stack.pop(),r=e.stack.pop();switch(O.DEBUG&&console.log(e.step,"INSTCTRL[]",t,r),t){case 1:return void(e.inhibitGridFit=!!r);case 2:return void(e.ignoreCvt=!!r);default:throw new Error("invalid INSTCTRL[] selector")}},void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,kr.bind(void 0,1),kr.bind(void 0,2),kr.bind(void 0,3),kr.bind(void 0,4),kr.bind(void 0,5),kr.bind(void 0,6),kr.bind(void 0,7),kr.bind(void 0,8),Or.bind(void 0,1),Or.bind(void 0,2),Or.bind(void 0,3),Or.bind(void 0,4),Or.bind(void 0,5),Or.bind(void 0,6),Or.bind(void 0,7),Or.bind(void 0,8),Rr.bind(void 0,0,0,0,0,0),Rr.bind(void 0,0,0,0,0,1),Rr.bind(void 0,0,0,0,0,2),Rr.bind(void 0,0,0,0,0,3),Rr.bind(void 0,0,0,0,1,0),Rr.bind(void 0,0,0,0,1,1),Rr.bind(void 0,0,0,0,1,2),Rr.bind(void 0,0,0,0,1,3),Rr.bind(void 0,0,0,1,0,0),Rr.bind(void 0,0,0,1,0,1),Rr.bind(void 0,0,0,1,0,2),Rr.bind(void 0,0,0,1,0,3),Rr.bind(void 0,0,0,1,1,0),Rr.bind(void 0,0,0,1,1,1),Rr.bind(void 0,0,0,1,1,2),Rr.bind(void 0,0,0,1,1,3),Rr.bind(void 0,0,1,0,0,0),Rr.bind(void 0,0,1,0,0,1),Rr.bind(void 0,0,1,0,0,2),Rr.bind(void 0,0,1,0,0,3),Rr.bind(void 0,0,1,0,1,0),Rr.bind(void 0,0,1,0,1,1),Rr.bind(void 0,0,1,0,1,2),Rr.bind(void 0,0,1,0,1,3),Rr.bind(void 0,0,1,1,0,0),Rr.bind(void 0,0,1,1,0,1),Rr.bind(void 0,0,1,1,0,2),Rr.bind(void 0,0,1,1,0,3),Rr.bind(void 0,0,1,1,1,0),Rr.bind(void 0,0,1,1,1,1),Rr.bind(void 0,0,1,1,1,2),Rr.bind(void 0,0,1,1,1,3),Rr.bind(void 0,1,0,0,0,0),Rr.bind(void 0,1,0,0,0,1),Rr.bind(void 0,1,0,0,0,2),Rr.bind(void 0,1,0,0,0,3),Rr.bind(void 0,1,0,0,1,0),Rr.bind(void 0,1,0,0,1,1),Rr.bind(void 0,1,0,0,1,2),Rr.bind(void 0,1,0,0,1,3),Rr.bind(void 0,1,0,1,0,0),Rr.bind(void 0,1,0,1,0,1),Rr.bind(void 0,1,0,1,0,2),Rr.bind(void 0,1,0,1,0,3),Rr.bind(void 0,1,0,1,1,0),Rr.bind(void 0,1,0,1,1,1),Rr.bind(void 0,1,0,1,1,2),Rr.bind(void 0,1,0,1,1,3),Rr.bind(void 0,1,1,0,0,0),Rr.bind(void 0,1,1,0,0,1),Rr.bind(void 0,1,1,0,0,2),Rr.bind(void 0,1,1,0,0,3),Rr.bind(void 0,1,1,0,1,0),Rr.bind(void 0,1,1,0,1,1),Rr.bind(void 0,1,1,0,1,2),Rr.bind(void 0,1,1,0,1,3),Rr.bind(void 0,1,1,1,0,0),Rr.bind(void 0,1,1,1,0,1),Rr.bind(void 0,1,1,1,0,2),Rr.bind(void 0,1,1,1,0,3),Rr.bind(void 0,1,1,1,1,0),Rr.bind(void 0,1,1,1,1,1),Rr.bind(void 0,1,1,1,1,2),Rr.bind(void 0,1,1,1,1,3)],Er.prototype.setState=function(e,t){return this.state[e]=t,this.activeState={key:e,value:this.state[e]},this.activeState},Er.prototype.getState=function(e){return this.state[e]||null},Ir.prototype.inboundIndex=function(e){return 0<=e&&e<this.tokens.length},Ir.prototype.composeRUD=function(e){function t(e){return"object"==typeof e&&e.hasOwnProperty("FAIL")}var r=this,n=e.map(function(e){return r[e[0]].apply(r,e.slice(1).concat(!0))});if(n.every(t))return{FAIL:"composeRUD: one or more operations hasn't completed successfully",report:n.filter(t)};this.dispatch("composeRUD",[n.filter(function(e){return!t(e)})])},Ir.prototype.replaceRange=function(e,t,r,n){t=null!==t?t:this.tokens.length;var a=r.every(function(e){return e instanceof Er});if(!isNaN(e)&&this.inboundIndex(e)&&a){var o=this.tokens.splice.apply(this.tokens,[e,t].concat(r));return n||this.dispatch("replaceToken",[e,t,r]),[o,r]}return{FAIL:"replaceRange: invalid tokens or startIndex."}},Ir.prototype.replaceToken=function(e,t,r){if(!isNaN(e)&&this.inboundIndex(e)&&t instanceof Er){var n=this.tokens.splice(e,1,t);return r||this.dispatch("replaceToken",[e,t]),[n[0],t]}return{FAIL:"replaceToken: invalid token or index."}},Ir.prototype.removeRange=function(e,t,r){t=isNaN(t)?this.tokens.length:t;var n=this.tokens.splice(e,t);return r||this.dispatch("removeRange",[n,e,t]),n},Ir.prototype.removeToken=function(e,t){if(isNaN(e)||!this.inboundIndex(e))return{FAIL:"removeToken: invalid token index."};var r=this.tokens.splice(e,1);return t||this.dispatch("removeToken",[r,e]),r},Ir.prototype.insertToken=function(e,t,r){return e.every(function(e){return e instanceof Er})?(this.tokens.splice.apply(this.tokens,[t,0].concat(e)),r||this.dispatch("insertToken",[e,t]),e):{FAIL:"insertToken: invalid token(s)."}},Ir.prototype.registerModifier=function(o,s,i){this.events.newToken.subscribe(function(e,t){var r=[e,t],n=[e,t];if(null===s||!0===s.apply(this,r)){var a=i.apply(this,n);e.setState(o,a)}}),this.registeredModifiers.push(o)},Dr.prototype.subscribe=function(e){return"function"==typeof e?this.subscribers.push(e)-1:{FAIL:"invalid '"+this.eventId+"' event handler"}},Dr.prototype.unsubscribe=function(e){this.subscribers.splice(e,1)},wr.prototype.setCurrentIndex=function(e){this.index=e,this.current=this.context[e],this.backtrack=this.context.slice(0,e),this.lookahead=this.context.slice(e+1)},wr.prototype.get=function(e){switch(!0){case 0===e:return this.current;case e<0&&Math.abs(e)<=this.backtrack.length:return this.backtrack.slice(e)[0];case 0<e&&e<=this.lookahead.length:return this.lookahead[e-1];default:return null}},Ir.prototype.rangeToText=function(e){if(e instanceof Lr)return this.getRangeTokens(e).map(function(e){return e.char}).join("")},Ir.prototype.getText=function(){return this.tokens.map(function(e){return e.char}).join("")},Ir.prototype.getContext=function(e){var t=this.registeredContexts[e];return t||null},Ir.prototype.on=function(e,t){var r=this.events[e];return r?r.subscribe(t):null},Ir.prototype.dispatch=function(e,t){var r=this,n=this.events[e];n instanceof Dr&&n.subscribers.forEach(function(e){e.apply(r,t||[])})},Ir.prototype.registerContextChecker=function(e,t,r){if(this.getContext(e))return{FAIL:"context name '"+e+"' is already registered."};if("function"!=typeof t)return{FAIL:"missing context start check."};if("function"!=typeof r)return{FAIL:"missing context end check."};var n=new Cr(e,t,r);return this.registeredContexts[e]=n,this.contextCheckers.push(n),n},Ir.prototype.getRangeTokens=function(e){var t=e.startIndex+e.endOffset;return[].concat(this.tokens.slice(e.startIndex,t))},Ir.prototype.getContextRanges=function(e){var t=this.getContext(e);return t?t.ranges:{FAIL:"context checker '"+e+"' is not registered."}},Ir.prototype.resetContextsRanges=function(){var e=this.registeredContexts;for(var t in e){if(e.hasOwnProperty(t))e[t].ranges=[]}},Ir.prototype.updateContextsRanges=function(){this.resetContextsRanges();for(var e=this.tokens.map(function(e){return e.char}),t=0;t<e.length;t++){var r=new wr(e,t);this.runContextCheck(r)}this.dispatch("updateContextsRanges",[this.registeredContexts])},Ir.prototype.setEndOffset=function(e,t){var r=new Lr(this.getContext(t).openRange.startIndex,e,t),n=this.getContext(t).ranges;return r.rangeId=t+"."+n.length,n.push(r),this.getContext(t).openRange=null,r},Ir.prototype.runContextCheck=function(o){var s=this,i=o.index;this.contextCheckers.forEach(function(e){var t=e.contextName,r=s.getContext(t).openRange;if(!r&&e.checkStart(o)&&(r=new Lr(i,null,t),s.getContext(t).openRange=r,s.dispatch("contextStart",[t,i])),r&&e.checkEnd(o)){var n=i-r.startIndex+1,a=s.setEndOffset(n,t);s.dispatch("contextEnd",[t,a])}})},Ir.prototype.tokenize=function(e){this.tokens=[],this.resetContextsRanges();var t=Array.from(e);this.dispatch("start");for(var r=0;r<t.length;r++){var n=t[r],a=new wr(t,r);this.dispatch("next",[a]),this.runContextCheck(a);var o=new Er(n);this.tokens.push(o),this.dispatch("newToken",[o,a])}return this.dispatch("end",[this.tokens]),this.tokens},Fr.prototype.getDefaultScriptFeaturesIndexes=function(){for(var e=this.font.tables.gsub.scripts,t=0;t<e.length;t++){var r=e[t];if("DFLT"===r.tag)return r.script.defaultLangSys.featureIndexes}return[]},Fr.prototype.getScriptFeaturesIndexes=function(e){if(!this.font.tables.gsub)return[];if(!e)return this.getDefaultScriptFeaturesIndexes();for(var t=this.font.tables.gsub.scripts,r=0;r<t.length;r++){var n=t[r];if(n.tag===e&&n.script.defaultLangSys)return n.script.defaultLangSys.featureIndexes;var a=n.langSysRecords;if(a)for(var o=0;o<a.length;o++){var s=a[o];if(s.tag===e)return s.langSys.featureIndexes}}return this.getDefaultScriptFeaturesIndexes()},Fr.prototype.mapTagsToFeatures=function(e,t){for(var r={},n=0;n<e.length;n++){var a=e[n].tag,o=e[n].feature;r[a]=o}this.features[t].tags=r},Fr.prototype.getScriptFeatures=function(e){var t=this.features[e];if(this.features.hasOwnProperty(e))return t;var r=this.getScriptFeaturesIndexes(e);if(!r)return null;var n=this.font.tables.gsub;return t=r.map(function(e){return n.features[e]}),this.features[e]=t,this.mapTagsToFeatures(t,e),t},Fr.prototype.getSubstitutionType=function(e,t){return e.lookupType.toString()+t.substFormat.toString()},Fr.prototype.getLookupMethod=function(e,t){var r=this;switch(this.getSubstitutionType(e,t)){case"11":return function(e){return function(e,t){return-1===Nr(e,t.coverage)?null:e+t.deltaGlyphId}.apply(r,[e,t])};case"12":return function(e){return function(e,t){var r=Nr(e,t.coverage);return-1===r?null:t.substitute[r]}.apply(r,[e,t])};case"63":return function(e){return function(e,t){var r=t.inputCoverage.length+t.lookaheadCoverage.length+t.backtrackCoverage.length;if(e.context.length<r)return[];var n=Hr(t.inputCoverage,e);if(-1===n)return[];var a=t.inputCoverage.length-1;if(e.lookahead.length<t.lookaheadCoverage.length)return[];for(var o=e.lookahead.slice(a);o.length&&Br(o[0].char);)o.shift();var s=new wr(o,0),i=Hr(t.lookaheadCoverage,s),u=[].concat(e.backtrack);for(u.reverse();u.length&&Br(u[0].char);)u.shift();if(u.length<t.backtrackCoverage.length)return[];var l=new wr(u,0),p=Hr(t.backtrackCoverage,l),c=[];if(n.length===t.inputCoverage.length&&i.length===t.lookaheadCoverage.length&&p.length===t.backtrackCoverage.length)for(var h=0;h<t.lookupRecords.length;h++)for(var f=t.lookupRecords[h].lookupListIndex,d=this.getLookupByIndex(f),v=0;v<d.subtables.length;v++){var g=d.subtables[v],m=this.getLookupMethod(d,g);if("12"===this.getSubstitutionType(d,g))for(var y=0;y<n.length;y++){var b=m(e.get(y));b&&c.push(b)}}return c}.apply(r,[e,t])};case"41":return function(e){return function(e,t){var r,n=Nr(e.current,t.coverage);if(-1===n)return null;for(var a=t.ligatureSets[n],o=0;o<a.length;o++){r=a[o];for(var s=0;s<r.components.length;s++){if(e.lookahead[s]!==r.components[s])break;if(s===r.components.length-1)return r}}return null}.apply(r,[e,t])};case"21":return function(e){return function(e,t){var r=Nr(e,t.coverage);return-1===r?null:t.sequences[r]}.apply(r,[e,t])};default:throw new Error("lookupType: "+e.lookupType+" - substFormat: "+t.substFormat+" is not yet supported")}},Fr.prototype.lookupFeature=function(e){var t=e.contextParams,r=t.index,n=this.getFeature({tag:e.tag,script:e.script});if(!n)return new Error("font '"+this.font.names.fullName.en+"' doesn't support feature '"+e.tag+"' for script '"+e.script+"'.");for(var a=this.getFeatureLookups(n),o=[].concat(t.context),s=0;s<a.length;s++)for(var i=a[s],u=this.getLookupSubtables(i),l=0;l<u.length;l++){var p=u[l],c=this.getSubstitutionType(i,p),h=this.getLookupMethod(i,p),f=void 0;switch(c){case"11":(f=h(t.current))&&o.splice(r,1,new Pr({id:11,tag:e.tag,substitution:f}));break;case"12":(f=h(t.current))&&o.splice(r,1,new Pr({id:12,tag:e.tag,substitution:f}));break;case"63":f=h(t),Array.isArray(f)&&f.length&&o.splice(r,1,new Pr({id:63,tag:e.tag,substitution:f}));break;case"41":(f=h(t))&&o.splice(r,1,new Pr({id:41,tag:e.tag,substitution:f}));break;case"21":(f=h(t.current))&&o.splice(r,1,new Pr({id:21,tag:e.tag,substitution:f}))}t=new wr(o,r),Array.isArray(f)&&!f.length||(f=null)}return o.length?o:null},Fr.prototype.supports=function(t){if(!t.script)return!1;this.getScriptFeatures(t.script);var e=this.features.hasOwnProperty(t.script);if(!t.tag)return e;var r=this.features[t.script].some(function(e){return e.tag===t.tag});return e&&r},Fr.prototype.getLookupSubtables=function(e){return e.subtables||null},Fr.prototype.getLookupByIndex=function(e){return this.font.tables.gsub.lookups[e]||null},Fr.prototype.getFeatureLookups=function(e){return e.lookupListIndexes.map(this.getLookupByIndex.bind(this))},Fr.prototype.getFeature=function(e){if(!this.font)return{FAIL:"No font was found"};this.features.hasOwnProperty(e.script)||this.getScriptFeatures(e.script);var t=this.features[e.script];return t?t.tags[e.tag]?this.features[e.script].tags[e.tag]:null:{FAIL:"No feature for script "+e.script}};var zr={startCheck:function(e){var t=e.current,r=e.get(-1);return null===r&&Gr(t)||!Gr(r)&&Gr(t)},endCheck:function(e){var t=e.get(1);return null===t||!Gr(t)}};var Wr={startCheck:function(e){var t=e.current,r=e.get(-1);return(Gr(t)||Br(t))&&!Gr(r)},endCheck:function(e){var t=e.get(1);switch(!0){case null===t:return!0;case!Gr(t)&&!Br(t):var r=/\s/.test(t);if(!r)return!0;if(r){if(!e.lookahead.some(function(e){return Gr(e)||Br(e)}))return!0}break;default:return!1}}};var _r={11:function(e,t,r){t[r].setState(e.tag,e.substitution)},12:function(e,t,r){t[r].setState(e.tag,e.substitution)},63:function(r,n,a){r.substitution.forEach(function(e,t){n[a+t].setState(r.tag,e)})},41:function(e,t,r){var n=t[r];n.setState(e.tag,e.substitution.ligGlyph);for(var a=e.substitution.components.length,o=0;o<a;o++)(n=t[r+o+1]).setState("deleted",!0)}};function qr(e,t,r){e instanceof Pr&&_r[e.id]&&_r[e.id](e,t,r)}function Xr(e){var o=this,s=this.featuresTags.arab,i=this.tokenizer.getRangeTokens(e);if(1!==i.length){var u=new wr(i.map(function(e){return e.getState("glyphIndex")}),0),l=new wr(i.map(function(e){return e.char}),0);i.forEach(function(e,t){if(!Br(e.char)){u.setCurrentIndex(t),l.setCurrentIndex(t);var r,n=0;switch(!function(e){for(var t=[].concat(e.backtrack),r=t.length-1;0<=r;r--){var n=t[r],a=Mr(n),o=Br(n);if(!a&&!o)return 1;if(a)return}}(l)||(n|=1),function(e){if(!Mr(e.current))for(var t=0;t<e.lookahead.length;t++){if(!Br(e.lookahead[t]))return 1}}(l)&&(n|=2),n){case 1:r="fina";break;case 2:r="init";break;case 3:r="medi"}if(-1!==s.indexOf(r)){var a=o.query.lookupFeature({tag:r,script:"arab",contextParams:u});if(a instanceof Error)return console.info(a.message);a.forEach(function(e,t){e instanceof Pr&&(qr(e,i,t),u.context[t]=e.substitution)})}}})}}function Vr(e,t){return new wr(e.map(function(e){return e.activeState.value}),t||0)}var Yr={startCheck:function(e){var t=e.current,r=e.get(-1);return null===r&&Ar(t)||!Ar(r)&&Ar(t)},endCheck:function(e){var t=e.get(1);return null===t||!Ar(t)}};function jr(e,t){return new wr(e.map(function(e){return e.activeState.value}),t||0)}function Zr(e){this.baseDir=e||"ltr",this.tokenizer=new Ir,this.featuresTags={}}function Qr(e){var t=this.contextChecks[e+"Check"];return this.tokenizer.registerContextChecker(e,t.startCheck,t.endCheck)}function Kr(){if(-1===this.tokenizer.registeredModifiers.indexOf("glyphIndex"))throw new Error("glyphIndex modifier is required to apply arabic presentation features.")}function Jr(){var t=this;this.featuresTags.hasOwnProperty("arab")&&-1!==this.featuresTags.arab.indexOf("rlig")&&(Kr.call(this),this.tokenizer.getContextRanges("arabicWord").forEach(function(e){(function(e){var n=this,a=this.tokenizer.getRangeTokens(e),o=Vr(a);o.context.forEach(function(e,t){o.setCurrentIndex(t);var r=n.query.lookupFeature({tag:"rlig",script:"arab",contextParams:o});r.length&&(r.forEach(function(e){return qr(e,a,t)}),o=Vr(a))})}).call(t,e)}))}function $r(){var t=this;this.featuresTags.hasOwnProperty("latn")&&-1!==this.featuresTags.latn.indexOf("liga")&&(Kr.call(this),this.tokenizer.getContextRanges("latinWord").forEach(function(e){(function(e){var n=this,a=this.tokenizer.getRangeTokens(e),o=jr(a);o.context.forEach(function(e,t){o.setCurrentIndex(t);var r=n.query.lookupFeature({tag:"liga",script:"latn",contextParams:o});r.length&&(r.forEach(function(e){return qr(e,a,t)}),o=jr(a))})}).call(t,e)}))}function en(e){(e=e||{}).tables=e.tables||{},e.empty||(wt(e.familyName,"When creating a new Font object, familyName is required."),wt(e.styleName,"When creating a new Font object, styleName is required."),wt(e.unitsPerEm,"When creating a new Font object, unitsPerEm is required."),wt(e.ascender,"When creating a new Font object, ascender is required."),wt(e.descender<=0,"When creating a new Font object, negative descender value is required."),this.names={fontFamily:{en:e.familyName||" "},fontSubfamily:{en:e.styleName||" "},fullName:{en:e.fullName||e.familyName+" "+e.styleName},postScriptName:{en:e.postScriptName||(e.familyName+e.styleName).replace(/\s/g,"")},designer:{en:e.designer||" "},designerURL:{en:e.designerURL||" "},manufacturer:{en:e.manufacturer||" "},manufacturerURL:{en:e.manufacturerURL||" "},license:{en:e.license||" "},licenseURL:{en:e.licenseURL||" "},version:{en:e.version||"Version 0.1"},description:{en:e.description||" "},copyright:{en:e.copyright||" "},trademark:{en:e.trademark||" "}},this.unitsPerEm=e.unitsPerEm||1e3,this.ascender=e.ascender,this.descender=e.descender,this.createdTimestamp=e.createdTimestamp,this.tables=Object.assign(e.tables,{os2:Object.assign({usWeightClass:e.weightClass||this.usWeightClasses.MEDIUM,usWidthClass:e.widthClass||this.usWidthClasses.MEDIUM,fsSelection:e.fsSelection||this.fsSelectionValues.REGULAR},e.tables.os2)})),this.supported=!0,this.glyphs=new Te.GlyphSet(this,e.glyphs||[]),this.encoding=new fe(this),this.position=new Ot(this),this.substitution=new Rt(this),this.tables=this.tables||{},this._push=null,this._hmtxTableData={},Object.defineProperty(this,"hinting",{get:function(){return this._hinting?this._hinting:"truetype"===this.outlinesFormat?this._hinting=new zt(this):void 0}})}function tn(e,t){var r=JSON.stringify(e),n=256;for(var a in t){var o=parseInt(a);if(o&&!(o<256)){if(JSON.stringify(t[a])===r)return o;n<=o&&(n=o+1)}}return t[n]=e,n}function rn(e,t,r,n){for(var a=[{name:"nameID_"+e,type:"USHORT",value:tn(t.name,n)},{name:"flags_"+e,type:"USHORT",value:0}],o=0;o<r.length;++o){var s=r[o].tag;a.push({name:"axis_"+e+" "+s,type:"FIXED",value:t.coordinates[s]<<16})}return a}function nn(e,t,r,n){var a={},o=new ie.Parser(e,t);a.name=n[o.parseUShort()]||{},o.skip("uShort",1),a.coordinates={};for(var s=0;s<r.length;++s)a.coordinates[r[s].tag]=o.parseFixed();return a}Zr.prototype.setText=function(e){this.text=e},Zr.prototype.contextChecks={latinWordCheck:Yr,arabicWordCheck:zr,arabicSentenceCheck:Wr},Zr.prototype.registerFeatures=function(t,e){var r=this,n=e.filter(function(e){return r.query.supports({script:t,tag:e})});this.featuresTags.hasOwnProperty(t)?this.featuresTags[t]=this.featuresTags[t].concat(n):this.featuresTags[t]=n},Zr.prototype.applyFeatures=function(e,t){if(!e)throw new Error("No valid font was provided to apply features");this.query||(this.query=new Fr(e));for(var r=0;r<t.length;r++){var n=t[r];this.query.supports({script:n.script})&&this.registerFeatures(n.script,n.tags)}},Zr.prototype.registerModifier=function(e,t,r){this.tokenizer.registerModifier(e,t,r)},Zr.prototype.checkContextReady=function(e){return!!this.tokenizer.getContext(e)},Zr.prototype.applyFeaturesToContexts=function(){this.checkContextReady("arabicWord")&&(function(){var t=this;this.featuresTags.hasOwnProperty("arab")&&(Kr.call(this),this.tokenizer.getContextRanges("arabicWord").forEach(function(e){Xr.call(t,e)}))}.call(this),Jr.call(this)),this.checkContextReady("latinWord")&&$r.call(this),this.checkContextReady("arabicSentence")&&function(){var r=this;this.tokenizer.getContextRanges("arabicSentence").forEach(function(e){var t=r.tokenizer.getRangeTokens(e);r.tokenizer.replaceRange(e.startIndex,e.endOffset,t.reverse())})}.call(this)},Zr.prototype.processText=function(e){this.text&&this.text===e||(this.setText(e),function(){return Qr.call(this,"latinWord"),Qr.call(this,"arabicWord"),Qr.call(this,"arabicSentence"),this.tokenizer.tokenize(this.text)}.call(this),this.applyFeaturesToContexts())},Zr.prototype.getBidiText=function(e){return this.processText(e),this.tokenizer.getText()},Zr.prototype.getTextGlyphs=function(e){this.processText(e);for(var t=[],r=0;r<this.tokenizer.tokens.length;r++){var n=this.tokenizer.tokens[r];if(!n.state.deleted){var a=n.activeState.value;t.push(Array.isArray(a)?a[0]:a)}}return t},en.prototype.hasChar=function(e){return null!==this.encoding.charToGlyphIndex(e)},en.prototype.charToGlyphIndex=function(e){return this.encoding.charToGlyphIndex(e)},en.prototype.charToGlyph=function(e){var t=this.charToGlyphIndex(e),r=this.glyphs.get(t);return r=r||this.glyphs.get(0)},en.prototype.updateFeatures=function(t){return this.defaultRenderOptions.features.map(function(e){return"latn"===e.script?{script:"latn",tags:e.tags.filter(function(e){return t[e]})}:e})},en.prototype.stringToGlyphs=function(e,t){var r=this,n=new Zr;n.registerModifier("glyphIndex",null,function(e){return r.charToGlyphIndex(e.char)});var a=t?this.updateFeatures(t.features):this.defaultRenderOptions.features;n.applyFeatures(this,a);for(var o=n.getTextGlyphs(e),s=o.length,i=new Array(s),u=this.glyphs.get(0),l=0;l<s;l+=1)i[l]=this.glyphs.get(o[l])||u;return i},en.prototype.nameToGlyphIndex=function(e){return this.glyphNames.nameToGlyphIndex(e)},en.prototype.nameToGlyph=function(e){var t=this.nameToGlyphIndex(e),r=this.glyphs.get(t);return r=r||this.glyphs.get(0)},en.prototype.glyphIndexToName=function(e){return this.glyphNames.glyphIndexToName?this.glyphNames.glyphIndexToName(e):""},en.prototype.getKerningValue=function(e,t){e=e.index||e,t=t.index||t;var r=this.position.defaultKerningTables;return r?this.position.getKerningValue(r,e,t):this.kerningPairs[e+","+t]||0},en.prototype.defaultRenderOptions={kerning:!0,features:[{script:"arab",tags:["init","medi","fina","rlig"]},{script:"latn",tags:["liga","rlig"]}]},en.prototype.forEachGlyph=function(e,t,r,n,a,o){t=void 0!==t?t:0,r=void 0!==r?r:0,n=void 0!==n?n:72,a=Object.assign({},this.defaultRenderOptions,a);var s,i=1/this.unitsPerEm*n,u=this.stringToGlyphs(e,a);if(a.kerning){var l=a.script||this.position.getDefaultScriptName();s=this.position.getKerningTables(l,a.language)}for(var p=0;p<u.length;p+=1){var c=u[p];if(o.call(this,c,t,r,n,a),c.advanceWidth&&(t+=c.advanceWidth*i),a.kerning&&p<u.length-1)t+=(s?this.position.getKerningValue(s,c.index,u[p+1].index):this.getKerningValue(c,u[p+1]))*i;a.letterSpacing?t+=a.letterSpacing*n:a.tracking&&(t+=a.tracking/1e3*n)}return t},en.prototype.getPath=function(e,t,r,n,o){var s=new B;return this.forEachGlyph(e,t,r,n,o,function(e,t,r,n){var a=e.getPath(t,r,n,o,this);s.extend(a)}),s},en.prototype.getPaths=function(e,t,r,n,o){var s=[];return this.forEachGlyph(e,t,r,n,o,function(e,t,r,n){var a=e.getPath(t,r,n,o,this);s.push(a)}),s},en.prototype.getAdvanceWidth=function(e,t,r){return this.forEachGlyph(e,0,0,t,r,function(){})},en.prototype.draw=function(e,t,r,n,a,o){this.getPath(t,r,n,a,o).draw(e)},en.prototype.drawPoints=function(a,e,t,r,n,o){this.forEachGlyph(e,t,r,n,o,function(e,t,r,n){e.drawPoints(a,t,r,n)})},en.prototype.drawMetrics=function(a,e,t,r,n,o){this.forEachGlyph(e,t,r,n,o,function(e,t,r,n){e.drawMetrics(a,t,r,n)})},en.prototype.getEnglishName=function(e){var t=this.names[e];if(t)return t.en},en.prototype.validate=function(){var r=this;function e(e){var t=r.getEnglishName(e);t&&t.trim().length}e("fontFamily"),e("weightName"),e("manufacturer"),e("copyright"),e("version"),this.unitsPerEm},en.prototype.toTables=function(){return St.fontToTable(this)},en.prototype.toBuffer=function(){return console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead."),this.toArrayBuffer()},en.prototype.toArrayBuffer=function(){for(var e=this.toTables().encode(),t=new ArrayBuffer(e.length),r=new Uint8Array(t),n=0;n<e.length;n++)r[n]=e[n];return t},en.prototype.download=function(e){var t=this.getEnglishName("fontFamily"),r=this.getEnglishName("fontSubfamily");e=e||t.replace(/\s/g,"")+"-"+r+".otf";var n=this.toArrayBuffer();if("undefined"!=typeof window)if(window.URL=window.URL||window.webkitURL,window.URL){var a=new DataView(n),o=new Blob([a],{type:"font/opentype"}),s=document.createElement("a");s.href=window.URL.createObjectURL(o),s.download=e;var i=document.createEvent("MouseEvents");i.initEvent("click",!0,!1),s.dispatchEvent(i)}else console.warn("Font file could not be downloaded. Try using a different browser.");else{var u=require("fs"),l=function(e){for(var t=new Buffer(e.byteLength),r=new Uint8Array(e),n=0;n<t.length;++n)t[n]=r[n];return t}(n);u.writeFileSync(e,l)}},en.prototype.fsSelectionValues={ITALIC:1,UNDERSCORE:2,NEGATIVE:4,OUTLINED:8,STRIKEOUT:16,BOLD:32,REGULAR:64,USER_TYPO_METRICS:128,WWS:256,OBLIQUE:512},en.prototype.usWidthClasses={ULTRA_CONDENSED:1,EXTRA_CONDENSED:2,CONDENSED:3,SEMI_CONDENSED:4,MEDIUM:5,SEMI_EXPANDED:6,EXPANDED:7,EXTRA_EXPANDED:8,ULTRA_EXPANDED:9},en.prototype.usWeightClasses={THIN:100,EXTRA_LIGHT:200,LIGHT:300,NORMAL:400,MEDIUM:500,SEMI_BOLD:600,BOLD:700,EXTRA_BOLD:800,BLACK:900};function an(){return{coverage:this.parsePointer(oe.coverage),attachPoints:this.parseList(oe.pointer(oe.uShortList))}}function on(){var e=this.parseUShort();return w.argument(1===e||2===e||3===e,"Unsupported CaretValue table version."),1===e?{coordinate:this.parseShort()}:2===e?{pointindex:this.parseShort()}:3===e?{coordinate:this.parseShort()}:void 0}function sn(){return this.parseList(oe.pointer(on))}function un(){return{coverage:this.parsePointer(oe.coverage),ligGlyphs:this.parseList(oe.pointer(sn))}}function ln(){return this.parseUShort(),this.parseList(oe.pointer(oe.coverage))}var pn={make:function(e,t){var r,n,a,o,s=new $.Table("fvar",[{name:"version",type:"ULONG",value:65536},{name:"offsetToData",type:"USHORT",value:0},{name:"countSizePairs",type:"USHORT",value:2},{name:"axisCount",type:"USHORT",value:e.axes.length},{name:"axisSize",type:"USHORT",value:20},{name:"instanceCount",type:"USHORT",value:e.instances.length},{name:"instanceSize",type:"USHORT",value:4+4*e.axes.length}]);s.offsetToData=s.sizeOf();for(var i=0;i<e.axes.length;i++)s.fields=s.fields.concat((r=i,n=e.axes[i],a=t,o=tn(n.name,a),[{name:"tag_"+r,type:"TAG",value:n.tag},{name:"minValue_"+r,type:"FIXED",value:n.minValue<<16},{name:"defaultValue_"+r,type:"FIXED",value:n.defaultValue<<16},{name:"maxValue_"+r,type:"FIXED",value:n.maxValue<<16},{name:"flags_"+r,type:"USHORT",value:0},{name:"nameID_"+r,type:"USHORT",value:o}]));for(var u=0;u<e.instances.length;u++)s.fields=s.fields.concat(rn(u,e.instances[u],e.axes,t));return s},parse:function(e,t,r){var n=new ie.Parser(e,t),a=n.parseULong();w.argument(65536===a,"Unsupported fvar table version.");var o=n.parseOffset16();n.skip("uShort",1);for(var s,i,u,l,p,c=n.parseUShort(),h=n.parseUShort(),f=n.parseUShort(),d=n.parseUShort(),v=[],g=0;g<c;g++)v.push((s=e,i=t+o+g*h,u=r,p=l=void 0,l={},p=new ie.Parser(s,i),l.tag=p.parseTag(),l.minValue=p.parseFixed(),l.defaultValue=p.parseFixed(),l.maxValue=p.parseFixed(),p.skip("uShort",1),l.name=u[p.parseUShort()]||{},l));for(var m=[],y=t+o+c*h,b=0;b<f;b++)m.push(nn(e,y+b*d,v,r));return{axes:v,instances:m}}};var cn={parse:function(e,t){var r=new oe(e,t=t||0),n=r.parseVersion(1);w.argument(1===n||1.2===n||1.3===n,"Unsupported GDEF table version.");var a={version:n,classDef:r.parsePointer(oe.classDef),attachList:r.parsePointer(an),ligCaretList:r.parsePointer(un),markAttachClassDef:r.parsePointer(oe.classDef)};return 1.2<=n&&(a.markGlyphSets=r.parsePointer(ln)),a}},hn=new Array(10);hn[1]=function(){var e=this.offset+this.relativeOffset,t=this.parseUShort();return 1===t?{posFormat:1,coverage:this.parsePointer(oe.coverage),value:this.parseValueRecord()}:2===t?{posFormat:2,coverage:this.parsePointer(oe.coverage),values:this.parseValueRecordList()}:void w.assert(!1,"0x"+e.toString(16)+": GPOS lookup type 1 format must be 1 or 2.")},hn[2]=function(){var e=this.offset+this.relativeOffset,t=this.parseUShort();w.assert(1===t||2===t,"0x"+e.toString(16)+": GPOS lookup type 2 format must be 1 or 2.");var r=this.parsePointer(oe.coverage),n=this.parseUShort(),a=this.parseUShort();if(1===t)return{posFormat:t,coverage:r,valueFormat1:n,valueFormat2:a,pairSets:this.parseList(oe.pointer(oe.list(function(){return{secondGlyph:this.parseUShort(),value1:this.parseValueRecord(n),value2:this.parseValueRecord(a)}})))};if(2===t){var o=this.parsePointer(oe.classDef),s=this.parsePointer(oe.classDef),i=this.parseUShort(),u=this.parseUShort();return{posFormat:t,coverage:r,valueFormat1:n,valueFormat2:a,classDef1:o,classDef2:s,class1Count:i,class2Count:u,classRecords:this.parseList(i,oe.list(u,function(){return{value1:this.parseValueRecord(n),value2:this.parseValueRecord(a)}}))}}},hn[3]=function(){return{error:"GPOS Lookup 3 not supported"}},hn[4]=function(){return{error:"GPOS Lookup 4 not supported"}},hn[5]=function(){return{error:"GPOS Lookup 5 not supported"}},hn[6]=function(){return{error:"GPOS Lookup 6 not supported"}},hn[7]=function(){return{error:"GPOS Lookup 7 not supported"}},hn[8]=function(){return{error:"GPOS Lookup 8 not supported"}},hn[9]=function(){return{error:"GPOS Lookup 9 not supported"}};var fn=new Array(10);var dn={parse:function(e,t){var r=new oe(e,t=t||0),n=r.parseVersion(1);return w.argument(1===n||1.1===n,"Unsupported GPOS table version "+n),1===n?{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(hn)}:{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(hn),variations:r.parseFeatureVariationsList()}},make:function(e){return new $.Table("GPOS",[{name:"version",type:"ULONG",value:65536},{name:"scripts",type:"TABLE",value:new $.ScriptList(e.scripts)},{name:"features",type:"TABLE",value:new $.FeatureList(e.features)},{name:"lookups",type:"TABLE",value:new $.LookupList(e.lookups,fn)}])}};var vn={parse:function(e,t){var r=new ie.Parser(e,t),n=r.parseUShort();if(0===n)return function(e){var t={};e.skip("uShort");var r=e.parseUShort();w.argument(0===r,"Unsupported kern sub-table version."),e.skip("uShort",2);var n=e.parseUShort();e.skip("uShort",3);for(var a=0;a<n;a+=1){var o=e.parseUShort(),s=e.parseUShort(),i=e.parseShort();t[o+","+s]=i}return t}(r);if(1===n)return function(e){var t={};e.skip("uShort"),1<e.parseULong()&&console.warn("Only the first kern subtable is supported."),e.skip("uLong");var r=255&e.parseUShort();if(e.skip("uShort"),0==r){var n=e.parseUShort();e.skip("uShort",3);for(var a=0;a<n;a+=1){var o=e.parseUShort(),s=e.parseUShort(),i=e.parseShort();t[o+","+s]=i}}return t}(r);throw new Error("Unsupported kern table version ("+n+").")}};var gn={parse:function(e,t,r,n){for(var a=new ie.Parser(e,t),o=n?a.parseUShort:a.parseULong,s=[],i=0;i<r+1;i+=1){var u=o.call(a);n&&(u*=2),s.push(u)}return s}};function mn(e,r){require("fs").readFile(e,function(e,t){if(e)return r(e.message);r(null,Ct(t))})}function yn(e,t){var r=new XMLHttpRequest;r.open("get",e,!0),r.responseType="arraybuffer",r.onload=function(){return r.response?t(null,r.response):t("Font could not be loaded: "+r.statusText)},r.onerror=function(){t("Font could not be loaded")},r.send()}function bn(e,t){for(var r=[],n=12,a=0;a<t;a+=1){var o=ie.getTag(e,n),s=ie.getULong(e,n+4),i=ie.getULong(e,n+8),u=ie.getULong(e,n+12);r.push({tag:o,checksum:s,offset:i,length:u,compression:!1}),n+=16}return r}function Sn(e,t){if("WOFF"!==t.compression)return{data:e,offset:t.offset};var r=new Uint8Array(e.buffer,t.offset+2,t.compressedLength-2),n=new Uint8Array(t.length);if(a(r,n),n.byteLength!==t.length)throw new Error("Decompression error: "+t.tag+" decompressed length doesn't match recorded length");return{data:new DataView(n.buffer,0),offset:0}}function xn(e,t){var r,n;t=null==t?{}:t;var a,o,s,i,u,l,p,c,h,f,d,v,g,m=new en({empty:!0}),y=new DataView(e,0),b=[],S=ie.getTag(y,0);if(S===String.fromCharCode(0,1,0,0)||"true"===S||"typ1"===S)m.outlinesFormat="truetype",b=bn(y,a=ie.getUShort(y,4));else if("OTTO"===S)m.outlinesFormat="cff",b=bn(y,a=ie.getUShort(y,4));else{if("wOFF"!==S)throw new Error("Unsupported OpenType signature "+S);var x=ie.getTag(y,4);if(x===String.fromCharCode(0,1,0,0))m.outlinesFormat="truetype";else{if("OTTO"!==x)throw new Error("Unsupported OpenType flavor "+S);m.outlinesFormat="cff"}b=function(e,t){for(var r=[],n=44,a=0;a<t;a+=1){var o=ie.getTag(e,n),s=ie.getULong(e,n+4),i=ie.getULong(e,n+8),u=ie.getULong(e,n+12),l=void 0;l=i<u&&"WOFF",r.push({tag:o,offset:s,compression:l,compressedLength:i,length:u}),n+=20}return r}(y,a=ie.getUShort(y,12))}for(var T=0;T<a;T+=1){var U=b[T],k=void 0;switch(U.tag){case"cmap":k=Sn(y,U),m.tables.cmap=ue.parse(k.data,k.offset),m.encoding=new de(m.tables.cmap);break;case"cvt ":k=Sn(y,U),g=new ie.Parser(k.data,k.offset),m.tables.cvt=g.parseShortList(U.length/2);break;case"fvar":s=U;break;case"fpgm":k=Sn(y,U),g=new ie.Parser(k.data,k.offset),m.tables.fpgm=g.parseByteList(U.length);break;case"head":k=Sn(y,U),m.tables.head=ze.parse(k.data,k.offset),m.unitsPerEm=m.tables.head.unitsPerEm,r=m.tables.head.indexToLocFormat;break;case"hhea":k=Sn(y,U),m.tables.hhea=We.parse(k.data,k.offset),m.ascender=m.tables.hhea.ascender,m.descender=m.tables.hhea.descender,m.numberOfHMetrics=m.tables.hhea.numberOfHMetrics;break;case"hmtx":c=U;break;case"ltag":k=Sn(y,U),n=qe.parse(k.data,k.offset);break;case"COLR":k=Sn(y,U),m.tables.colr=ft.parse(k.data,k.offset);break;case"CPAL":k=Sn(y,U),m.tables.cpal=dt.parse(k.data,k.offset);break;case"maxp":k=Sn(y,U),m.tables.maxp=Xe.parse(k.data,k.offset),m.numGlyphs=m.tables.maxp.numGlyphs;break;case"name":d=U;break;case"OS/2":k=Sn(y,U),m.tables.os2=st.parse(k.data,k.offset);break;case"post":k=Sn(y,U),m.tables.post=it.parse(k.data,k.offset),m.glyphNames=new ge(m.tables.post);break;case"prep":k=Sn(y,U),g=new ie.Parser(k.data,k.offset),m.tables.prep=g.parseByteList(U.length);break;case"glyf":i=U;break;case"loca":f=U;break;case"CFF ":o=U;break;case"kern":h=U;break;case"GDEF":u=U;break;case"GPOS":l=U;break;case"GSUB":p=U;break;case"meta":v=U}}var O=Sn(y,d);if(m.tables.name=at.parse(O.data,O.offset,n),m.names=m.tables.name,i&&f){var R=0===r,E=Sn(y,f),L=gn.parse(E.data,E.offset,m.numGlyphs,R),C=Sn(y,i);m.glyphs=Ht.parse(C.data,C.offset,L,m,t)}else{if(!o)throw new Error("Font doesn't contain TrueType or CFF outlines.");var w=Sn(y,o);He.parse(w.data,w.offset,m,t)}var D=Sn(y,c);if(_e.parse(m,D.data,D.offset,m.numberOfHMetrics,m.numGlyphs,m.glyphs,t),me(m,t),h){var I=Sn(y,h);m.kerningPairs=vn.parse(I.data,I.offset)}else m.kerningPairs={};if(u){var G=Sn(y,u);m.tables.gdef=cn.parse(G.data,G.offset)}if(l){var M=Sn(y,l);m.tables.gpos=dn.parse(M.data,M.offset),m.position.init()}if(p){var B=Sn(y,p);m.tables.gsub=ct.parse(B.data,B.offset)}if(s){var A=Sn(y,s);m.tables.fvar=pn.parse(A.data,A.offset,m.names)}if(v){var F=Sn(y,v);m.tables.meta=ht.parse(F.data,F.offset),m.metas=m.tables.meta}return m}function Tn(e,o,s){s=null==s?{}:s;var t="undefined"==typeof window&&!s.isUrl?mn:yn;return new Promise(function(n,a){t(e,function(e,t){if(e){if(o)return o(e);a(e)}var r;try{r=xn(t,s)}catch(e){if(o)return o(e,null);a(e)}if(o)return o(null,r);n(r)})})}function Un(e,t){return xn(Ct(require("fs").readFileSync(e)),t)}var kn=Object.freeze({__proto__:null,Font:en,Glyph:be,Path:B,BoundingBox:E,_parse:ie,parse:xn,load:Tn,loadSync:Un});O.BoundingBox=E,O.Font=en,O.Glyph=be,O.Path=B,O._parse=ie,O.default=kn,O.load=Tn,O.loadSync=Un,O.parse=xn,Object.defineProperty(O,"__esModule",{value:!0})});
//# sourceMappingURL=opentype.min.js.map