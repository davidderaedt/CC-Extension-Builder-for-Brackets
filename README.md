#Creative Cloud Extension Builder

![screenshot](http://www.dehats.com/resources/ccextbrackets/header.jpg "screenshot")

An extension for [Brackets](http://brackets.io/) and [Edge code](http://html.adobe.com/edge/code/) to create HTML extension panels for Creative Cloud applications (Photoshop CC, Illustrator CC, Premiere CC…).

> *Warning*: This is a preview build. It is only compatible with Mac OSX (for now).

This project leverages the [Creative Cloud Extensions CLI](https://github.com/davidderaedt/CCEXTCLI) to deploy a ready-to-use extension template based on a modified version of the [Creative Cloud Extension boilerplate](https://github.com/davidderaedt/ccext-boilerplate) (Standard).

##Installation

1. Open [Brackets](http://brackets.io/) or [Edge code](http://html.adobe.com/edge/code/)
2. Choose `File > Extension Manager` and click `Install from URL`
3. Paste the URL of this page (`https://github.com/davidderaedt/CC-Extension-Builder-for-Brackets`) and click `Install`


No need to relaunch the app, your extension is ready to use.


##Usage

Choose `File > New Creative Cloud Extension`.

In the dialog, fill the form (which should be self explanatory), and choose `Create Extension`.


You can then launch the target application, open your extension from the `Extensions` menu.

Back in your code editor, edit some HTML, like the `<h1>Hello World</h1>` tag, and save. Now, in your target application extension panel, click refresh to see it update.

To communicate with the target application, edit the ExtendScript code in the `jsx/hostscript.jsx` file.


##FAQ


###How to use ExtendScript to communicate with applications?

Creating scripts for CC applications is related yet separated from creating panels. While you can perfectly use Brackets / Edge Code to edit such files, support is fairly basic for now.

To author ExtendScript files in a full featured Adobe official development environment, use *ExtendScript Toolkit CC*, which is included in the creative cloud. It includes help files and debugging tools.


###Where is my extension?

Extensions are located at `~/Library/Application\ Support/Adobe/CEPServiceManager4/extensions/`, whatever the target application. 

###How to uninstall those extensions?

To uninstall them, simply delete the extension directory corresponding to the extension ID. Note that Extension Manager CC will not "see" your extensions.

###Can I use Live Preview?

Brackets' *live preview* will not work in the context of a CC application.

The default panel includes a "Refresh panel" button so that you don't have to relaunch your extension or target application.

It also includes a "Show dev tools" button to open the Chrome developer tools.

###Can I customize the default extension template?

You can customize the default template from this extension source code, which you can see from the `Help > Show extension folder` menu. The template is located in the `ccext-template` directory.

###How can I distribute my extensions?

Extensions will only work on your session, you cannot simply copy/paste the extension folder to other users' systems (unless those users are extension developers themselves).

More info on signing, packaging and extension distribution on the [Adobe Exchange website](https://www.adobeexchange.com/resources/7).


###Is this an official Adobe product?

This Brackets extension is not an official Adobe product and is absolutely not supported by Adobe. The author just happens to be an Adobe employee.

###Are there other alternatives?

If you want the power of a full IDE, you can use the Eclipse based [Extension Builder 3](http://labs.adobe.com/technologies/extensionbuilder3/), which is an official Adobe product.

If you prefer working with command lines, use the [Creative Cloud Extensions CLI](https://github.com/davidderaedt/CCEXTCLI).



