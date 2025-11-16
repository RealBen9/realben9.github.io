# gravity.js
**A script with a payload of converting some HTML elements into Box2D boxes.**

gravity.js is a modified version of the script used in [Google Gravity](https://mrdoob.com/projects/chromeexperiments/google-gravity). ([Modified here!](https://realben9.github.io/gravity/c23.html))
## What did I change?
### Custom Gravity Settings
By replacing `var gravity = { x: 0, y: 1 }` with
```js
var promptX = prompt("Enter X Gravity (Recommended number between ±10)", "0")
if (promptX == null) promptX = 0
var promptY = prompt("Enter Y Gravity (Recommended number between ±10)", "1")
if (promptY == null) promptY = 1
var gravity = { x: promptX, y: promptY }
```
, I have effectively allowed for custom gravity settings. I find it interesting that custom gravity was only something I had to implement setting-wise.
> Note that it doesn't ***have*** to be a number between ±10, I just said that because anything outside that range isn't as fun to use.
#### How does this work?
* `var` declares a variable. Sometimes this seems to be necessary, other times it isn't.
* `prompt("X","Y")` declares a user prompt, where `"X"` defines the message & `"Y"` defines the default value.
* `if (promptX == null) promptX = 0` is an error check to verify that a value has been submitted. If nothing was submitted (Likely either because the website wasn't active at the time of the prompt, or the user pressed "Cancel"), use the default value instead. (In this case 0.)
* `var gravity = { x: promptX, y: promptY }` is a modification to `var gravity = { x: 0, y: 1 }`. The only change I made was to replace the constants `0` for `x` & `1` for `y` with variables `promptX` for `x` & `promptY` for `y`.
### More Elements
By replacing `elements = getElementsByClass("box2d")` with several variant classes (`"box2d"`, `"button"`, `"btn"`, etc.), I have effectively allowed for elements with those classes to be converted into Box2D boxes (to then be affected by "gravity").
## Usage
There are 2 intended ways to use it :
### Bookmarklets
Save a bookmark with the following code : `javascript:(function(d,s,src){s.setAttribute('src',src);d.getElementsByTagName('body')[0].appendChild(s);})(document, document.createElement('script'),"https://realben9.github.io/gravity/gravity.js")`

When you want to execute the script, attempt to open it.
#### What does this do?
* `javascript:()` Indicates that this is a *bookmarklet*, instead of a *bookmark*. The only difference between the two is that a bookmark contains a URL to a website, but a bookmarklet contains 1 line of code.
* `function(d,s,src){}` Declares a function with variables `d`, `s` & `src`, where `{}` represents what code will be inside of the function. `d` represents `#document`, which declares all of the elements inside of the active page. `s` represents the script, where `src` represents the link to the file for the script.
* `s.setAttribute('src',src)` sets the script (`s`)'s `'src'` (on the left) attribute to variable `src` (on the right). As mentioned before, `src` represents the link to the file for the script.
* `;` Represents a line break. This is required, because bookmarklets can only contain 1 line of code.
* `d.getElementsByTagName('body')` gets every element with the `'body'` tag inside of `#document` (`d`). `[0]` indexes the first element it gets & in this case ignores any other elements it found.
* `X.appendChild(s)` adds an element (`s`, the script) inside of, but at the end of element `X`. (in this case the `'body'` element from before.)
* `(document, document.createElement('script'),"https://realben9.github.io/gravity/gravity.js")` creates an element with the tag `'script'`, with an `src` of `"https://realben9.github.io/gravity/gravity.js"`. I'm not entirely sure why this is necessary, but I'm guessing that based on context it understands what variables `d`, `s` & `src` are supposed to be. Additionally, this part doesn't indicate *where* in the `#document` the script is.

This effectively injects script `"https://realben9.github.io/gravity/gravity.js"` into the document, which is then executed. However, some websites block the ability to do this, but the other method seems to work in that case.
### Console
Step 1 : Copy everything from https://realben9.github.io/gravity/gravity.js

Step 2 : Go to the website you want to execute the script on & open the console.

Step 3 : Type `setTimeout(function(){},2999)` but **don't** press enter. This makes the code wait 2999 milliseconds, which should be long enough for you to close the console before the script is executed. This is important because keeping the console open sometimes causes visual bugs in the script.

Step 4 : Paste the script from step 1 inside of `{}` & press enter to wait 2999 milliseconds & execute it. In this time, close the console. If this isn't long enough, increase the `2999` part.

Note that the only difference between doing this & just pasting the script is the 2999 millisecond wait.
