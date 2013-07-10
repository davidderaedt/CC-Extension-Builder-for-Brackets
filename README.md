#Creative Cloud Extension Builder for Brackets

![screenshot](http://www.dehats.com/resources/ccextbrackets/header.jpg "screenshot")

You can now use HTML, CSS and javascript to create extension panels for Adobe Creative Cloud applications such as Photoshop, Illustrator and Premiere.

This project helps you do so super easily using [Brackets](http://brackets.io/), the free and open source code editor for the web (and its little brother [Edge code](http://html.adobe.com/edge/code/)).

Internally, it leverages the [Creative Cloud Extensions CLI](https://github.com/davidderaedt/CCEXTCLI) to deploy a ready-to-use, customizable extension template based on a modified version of the [Creative Cloud Extension boilerplate](https://github.com/davidderaedt/ccext-boilerplate) (Standard).

##Installation

You don't need to download anything. Just do the following:

1. Open [Brackets](http://brackets.io/) or [Edge code](http://html.adobe.com/edge/code/)
2. Choose `File > Extension Manager` and click `Install from URL`
3. Paste the URL of this github repo (`https://github.com/davidderaedt/CC-Extension-Builder-for-Brackets`) and click `Install`


No need to relaunch the app, your extension is ready to use.


##Usage

Choose `File > New Creative Cloud Extension`.

In the dialog, fill the form (which should be self explanatory), and choose `Create Extension`.


You can then launch the target application, open your extension from the `Extensions` menu.

Back in your code editor, edit some HTML, like the `<h1>Hello World</h1>` tag, and save. Now, in your target application extension panel, click refresh to see it update.

To communicate with the target application, edit the ExtendScript code in the `jsx/hostscript.jsx` file.


##FAQ

###Is this an official Adobe product?

This Brackets extension is not an official Adobe product and is absolutely not supported by Adobe. The author just happens to be an Adobe employee.

###I don't use Brackets or Edge Code. Are there other alternatives?

You could definitely create a project and deploy it manually, but this might prove cumbersome.

If you wish to use another code editor, a reasonable alternative would be to work from the command line, using the [Creative Cloud Extensions CLI](https://github.com/davidderaedt/CCEXTCLI).

If you want the power of a full IDE, you can use the Eclipse based [Extension Builder 3](http://labs.adobe.com/technologies/extensionbuilder3/), which is an official Adobe product.


###How to use ExtendScript to communicate with host applications?

Creating scripts for CC applications is related yet separated from creating panels. While you can perfectly use Brackets / Edge Code to edit such files, support is fairly basic for now.

To author ExtendScript files in a full featured Adobe official development environment, use *ExtendScript Toolkit CC*, which is included in the creative cloud. It includes help files and debugging tools.


###Where are my files?

Extensions are located at `~/Library/Application\ Support/Adobe/CEPServiceManager4/extensions/`, whatever the target application. 

###How do I uninstall those extensions?

To uninstall them, simply delete the extension directory corresponding to the extension ID. Note that Extension Manager CC will not "see" your extensions.

###Can I use Live Preview?

Brackets' *live preview* will not work in the context of a CC application.

The default panel includes a "Refresh panel" button so that you don't have to relaunch your extension or target application.

It also includes a "Show dev tools" button to open the Chrome developer tools.

###Can I customize the default extension template?

You can customize the default template from this extension source code, which you can see from the `Help > Show extension folder` menu. The template is located in the `ccext-template` directory.

###How can I distribute my extensions?

Extensions will only work on your session, you cannot simply copy/paste the extension folder to other users' systems (unless those users are extension developers themselves).

Support from packaging from the tool or the command line will be coming soon.

More info on signing, packaging and extension distribution on the [Adobe Exchange website](https://www.adobeexchange.com/resources/7).
