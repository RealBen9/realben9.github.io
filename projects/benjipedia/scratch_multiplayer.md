# scratch_multiplayer
**Utilising cloud variables whilst working around their limitations.**

**This entry is incomplete.**

Scratch's cloud variables are quite functionally limited. Compared to normal variables, they :
* Can only be present 10 times at once per project
* Can only be updated once every 0.1 seconds (Across the project; var1 affects var2's ability to update)
* Can only store integers
* Can only store up to 256-digit integers

My objective here is to create an easy-to-reproduce project, featuring workarounds for some of these limitations.
For the sake of creating an environment where *cloud* variables would be important, I'm going to try to meet these conditions :
* Make Sprite1 follow the mouse
* Using cloud variables, allow multiple people to open the project & see each other moving their Sprite1s, using their mice
> Note that this example is heavily based on griffpatch's tutorial [here](https://www.youtube.com/playlist?list=PLy4zsTUHwGJLpq574s-vtOoDJwaiva5KR).
## Step 1 : Creating a template
* Create 2 *cloud* variables : `P1X` and `P1Y`. These will later be used to store Sprite1's position server-side.
* Create a *normal* variable `slot`. This will temporarily be used as a means to manually select which cloud variables to store X & Y to.
* Create a `when flag clicked` script, which looks like :
```
when flag clicked
set [slot] to 0
```
. This just initalizes `slot` to a value which in this case means that no server-side variables are being set. Perhaps this could be used for a "spectate" mode. (In this case, `0`.)
* Next, add a way to change this variable. In this example, I'll create a `when key pressed` script, which looks like :
```
when 1 key pressed
set [slot] to 1
```
. This just simply sets `slot` to `1` when the user presses the 1 key. In this case, this will be a value where server-side variables *are* being set.
* Finally, go back to the `when flag clicked` script & modify it so that it looks like :
```
when flag clicked
set [slot] to 0
forever:
    if [slot] = 1 then
        set [P1X] to [mouse x]
        set [P1Y] to [mouse y]
    go to x: [P1X], y: [P1Y]
```
. This change makes the script do the following on every frame the project is running :
* If `slot` is equal to `1` :
    * set `P1X` to the x-position of the mouse
    * set *`P1Y`* to the *y*-position of the mouse
* Move to the x-position `P1X`
* Move to the *y*-position *`P1Y`*

Now, ensure that the project is shared, then open 2 windows viewing the same project. On **1** of these windows, press 1 to set `slot` to `1`. Now, Sprite1 should be following the mouse *smoothly* on this window. On the other window, due to the second limitation I mentioned, Sprite1 should have been following *choppily*, as it could only fully update once every 0.2 seconds. (0.1 seconds between updating `P1X` & `P1Y`.)
## Step 2 : En/Decoding
Encoding & decoding will both act as a workaround for the third limitation I mentioned.
* Create a list `encTable`. This will be used to convert various characters into 2-digit integers & should look like :

| # | Value |
| - | ----- |
| 1| a
| 2| b
| 3| c
| 4| d
| 5| e
| 6| f
| 7| g
| 8| h
| 9| i
| 10| j
| 11| k
| 12| l
| 13| m
| 14| n
| 15| o
| 16| p
| 17| q
| 18| r
| 19| s
| 20| t
| 21| u
| 22| v
| 23| w
| 24| x
| 25| y
| 26| z
| 27| 0
| 28| 1
| 29| 2
| 30| 3
| 31| 4
| 32| 5
| 33| 6
| 34| 7
| 35| 8
| 36| 9
| 37| + *(plus)*
| 38| - *(minus)*
| 39| . *(period)*
| 40| *(spacebar)*
| 41| _ *(underscore)*
* Next, create 2 *normal* variables : `packet` & `letter #` (both **for this sprite only**). Both of these will be used in a moment.
* Create a block "Encode `variable`" with **run without screen refresh** enabled, with a script which looks like :
```
set [letter #] to 1
repeat(length of [variable]):
    set [packet] to join([packet],item # of(letter([letter #] of [variable]) in encTable) + 9)
    change [letter #] by 1
set [packet] to join([packet],00)
```
. This looks slightly complicated, so lets break it down.
* `set [letter #] to 1` initializes `letter #`.
* `repeat(length of [variable]):` means repeat for the length of `variable`:
    * `set [packet] to join([packet],item # of(letter([letter #] of [variable]) in encTable) + 9)`.
        * `set [packet] to X` should be understood.
        * `join(X,Y)` concatenates values `X` and `Y`.
        * `item # of X in Y` finds where value `X` is in list `Y`, returning `0` if `X` wasn't found.
        * `letter X of Y` returns character position `X` within `Y`. (e.g `letter 3 of abcde` would return `c`.)
        * Heres an example : If `variable` is set to `a`, `letter 1 of a` returns `a`; `item # of a in encTable` returns `1`; `1` + `9` = `10`; Therefore `item # of(letter(1 of a) in encTable) + 9` returns `10`.
    * `change [letter #] by 1` increments `letter #`.
* `set [packet] to join([packet],00)` effectively appends `00` to `packet`. This will be used as a terminator in a couple moments.
* Create a block "Start decoding `integer`" with **run without screen refresh** enabled, with a script which looks like :
```
set [packet] to [integer]
set [letter #] to 1
```
* Create a *normal* variable `value` **for this sprite only**. This will be used in a moment.
* Create a block "Set value to next encoded stream" with **run without screen refresh** enabled, with a script which looks like :
```
set [value] to
forever:
    set [idX] to join(letter([letter #] of [packet]),letter([letter #] + 1) of [packet])
    change [letter #] by 2
    if [idX] < 1 then
        stop this script
    set [value] to (join([value],item(idX - 9) of encTable))
```
. This also looks slightly complicated, but it's quite similar to before.
* `set [value] to` sets `value` to *(nothing)*.
* `forever:` in this case is more of a "while" loop than forever, although that won't be too important here.
    * `set [idX] to join(letter([letter #] of [packet]),letter([letter #] + 1) of [packet])` effectively sets `idX` to the next 2 "letters" of `packet`.
    * `change [letter #] by 2` increments `letter #` by 2.
    * `if [idX] < 1 then stop this script` is self explanatory. This is why we appended `00` earlier. Without it, this loop wouldn't know when we are done decoding the data stream.
    * `set [value] to (join([value],item([idX] - 9) of encTable))` is effectively the opposite of what we did earlier. The reason why ±9 is done is to guarantee that we get a 2-digit number.
* Delete *cloud* variables `P1X` & `P1Y`. This is because we are going to replace them with *cloud* variable `P1`.
* Next, go back to the `when flag clicked` script from step 1 & modify it again so that it looks like :
```
when flag clicked
set [slot] to 0
forever:
    if [slot] = 1 then
        set [packet] to
        Encode [mouse x]
        Encode [mouse y]
        set [P1] to [packet]
    Start decoding [P1]
    Set value to next encoded stream
    set x to [value]
    Set value to next encoded stream
    set y to [value]
```
. This uses everything we have created this step to encode what used to be **2** *cloud* variables `P1X` & `P1Y` into **1** *cloud* variable `P1`. This helps with the both the first and second limitations I mentioned.
* Finally, modify the `when flag clicked` script again so that it looks like :
```
... (Same as before)
forever:
    if [slot] = 1 then
        set [packet] to
        Encode [username]
        Encode [mouse x]
        Encode [mouse y]
        set [P1] to [packet]
    Start decoding [P1]
    Set value to next encoded stream
    say [value]
    Set value to next encoded stream
    set x to [value]
    Set value to next encoded stream
    set y to [value]
```
. This just makes it so that Sprite1 will also display the username of the user. Storing the username of the player (& storing it **first**) will also be important later.
Now, Open 2 windows again. On the window where 1 was pressed, Sprite1 should be following the mouse *smoothly* on this window, and showing the username. On the other window, Sprite1 should have still been following *choppily*, but roughly twice as fast, as it can now fully update once every 0.1 seconds. (Due to only using **1** *cloud* variable.)
## Step 3 : Multiplayer
Up to this point, we have successfully allowed the input of *1* player to be seen by anyone online. In this step, we will extend to 4, but up to **10** is possible without a workaround for the first limitation.
* Create cloud variables `P2`, `P3` & `P4`. These will be used similarly to `P1`.
* Create a normal variable `plr` **for this sprite only**. This will be used later.
* Create a normal variable `plrLimit` **for all sprites**. This will also be used later.
* Create a block "initialize" with **run without screen refresh** enabled, with a script which looks like :
```
set [plr] to 1
repeat([plrLimit] - 1):
    create clone of myself
    change [plr] by 1
```
. This will be used for another workaround, but *not* one tied to cloud variables.
* Modify the `when flag clicked` script so that it looks like :
```
when flag clicked
set [plrLimit] to 4
set [slot] to 0
initialize
forever:
... (Same as before)
```
. This change does the following :
* Initializes `plrLimit` to 4 & `plr` to 1
* Creates as many clones of the sprite as `plrLimit` allows
    * Each with different `plr` values

All of this will be important later. The reason why we created a block to put in here, rather than just putting the script there is tied to Scratch's assumption that you're making an animation. Therefore, `repeat` loops run with screen refresh. The easiest workaround is to use a custom block which is set to run *without* screen refresh.
* Create a broadcast with message `initialize` & a `when I receive initialize` with a script which contains the `forever` loop within `when flag clicked`.
* Modify the `when flag clicked` script again so that it looks like :
```
when flag clicked
set [plrLimit] to 4
set [slot] to 0
initialize
broadcast initialize
```
. The reason why we moved the `forever` loop into a broadcast is to allow it to run in each clone.