#Creative Cloud Extension Builder

A Brackets / Edge Code extension for easily creating HTML based panels for CC applications (Photoshop, Illustrator, Premiere…).

> *Warning*: This is a preview build. It is only compatible with Mac OSX (for now).

This project leverages my [Creative Cloud Extensions CLI](https://github.com/davidderaedt/CCEXTCLI) to deploy a ready-to-use extension template based on a modified version of my [Creative Cloud Extension boilerplate](https://github.com/davidderaedt/ccext-boilerplate) (Standard).

##Installation

> This extension is not compatible with Brackets's Extension Manager.

To install: 

1. Download the zip from this page.
2. Unzip it in the user extension folder which you can open from the `Help > Show Extension Folder` menu.
3. Relaunch Brackets / Edge Code.


##Usage

Choose `File > New CC Extension`.

In the dialog, fill the form (which should be self explanatory), and choose `Create`.

You can then launch the target application, open your extension from the `Extensions` menu, and start developping.

You can customize the default template from this extension source code, which you can see from the `Help > Show extension folder` menu.


###Live preview support

Brackets' live preview and live development features will not work in the context of the target application. 

Of course, you can still develop the extension panel in your browser to use live preview before testing in the target application.

The default panel includes a "refresh panel" button so that you don't have to relaunch your extension or target application.

It also includes a "debug" button to open the Chrome developer tools,

