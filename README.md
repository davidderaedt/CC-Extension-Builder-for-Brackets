#Creative Cloud Extension Builder

![screenshot](http://www.dehats.com/resources/ccextbrackets/header.jpg "screenshot")

An extension for [Brackets](http://brackets.io/) and [Edge code](http://html.adobe.com/edge/code/) to create HTML extension panels for Creative Cloud applications (Photoshop CC, Illustrator CC, Premiere CC…).

> *Warning*: This is a preview build. It is only compatible with Mac OSX (for now).

This project leverages my [Creative Cloud Extensions CLI](https://github.com/davidderaedt/CCEXTCLI) to deploy a ready-to-use extension template based on a modified version of my [Creative Cloud Extension boilerplate](https://github.com/davidderaedt/ccext-boilerplate) (Standard).

##Installation

1. Open [Brackets](http://brackets.io/) or [Edge code](http://html.adobe.com/edge/code/)
2. Choose `File > Extension Manager` and click `Install from URL`
3. Paste the URL of this page (`https://github.com/davidderaedt/CC-Extension-Builder-for-Brackets`) and click `Install`


No need to relaunch the app, your extension is ready to use.


##Usage

Choose `File > New Creative Cloud Extension`.

In the dialog, fill the form (which should be self explanatory), and choose `Create Extension`.

You can then launch the target application, open your extension from the `Extensions` menu, and start developping.

You can customize the default template from this extension source code, which you can see from the `Help > Show extension folder` menu.


###Live preview support

Brackets' *live preview* and *live development* will not work in the context of the target application.

Of course, you can still develop the extension panel in your browser to use live preview before testing in the target application.

The default panel includes a "refresh panel" button so that you don't have to relaunch your extension or target application.

It also includes a "debug" button to open the Chrome developer tools.

