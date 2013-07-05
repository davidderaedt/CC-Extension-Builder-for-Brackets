/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** CCExtBuilder Extension 
    Create HTML based Extensions for Creative Cloud applications
*/
define(function (require, exports, module) {
    'use strict';

    console.log("INITIALIZING CCExtBuilder EXTENSION");
        
    var CommandManager      = brackets.getModule("command/CommandManager");
    var DocumentManager = brackets.getModule("document/DocumentManager");
    var Menus               = brackets.getModule("command/Menus");
    var ProjectManager      = brackets.getModule("project/ProjectManager");
    var FileUtils           = brackets.getModule("file/FileUtils");
    var NativeFileSystem    = brackets.getModule("file/NativeFileSystem").NativeFileSystem;
    var Dialogs             = brackets.getModule("widgets/Dialogs");
    var PanelTemplate       = require("text!panel.html");
    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    var AppInit             = brackets.getModule("utils/AppInit");
    var NodeConnection      = brackets.getModule("utils/NodeConnection");


    var NEW_CCEXT_COMMAND_ID  = "CCExtBuilder.newExt";
    var NEW_CCEXT_MENU_NAME   = "New Creative Cloud Extension";
            
    var TEMPLATE_FOLDER_NAME = "/ccext-template/";
    var EXTENSION_DIR_MAC = "/Library/Application\ Support/Adobe/CEPServiceManager4/extensions/";
    var NODE_DOMAIN_LOCATION = "node/CCExtDomain";
    var SUCCESS_MSG = "Extension successfully created! You may now launch it from its Creative Cloud application(s).";
    var HOSTS = [
            '<Host Name="PHXS" Version="[14.0,14.9]" /><Host Name="PHSP" Version="[14.0,14.9]" />',
            '<Host Name="ILST" Version="[17.0,17.9]" />',
            '<Host Name="PPRO" Version="[7.0,7.9]" />',
            '<Host Name="PRLD" Version="[2.0,2.9]" />'
        ];
        
                
    var $panel;
    var userHomeDir;
    var nodeConnection;

    
                  
    function _processTemplate(templateString, data) {
        
        var str = templateString;
        var z;
        for (z in data) {
            if (data.hasOwnProperty(z)) {
                var reg = new RegExp("\\${" + z + "}", "g");
                str = str.replace(reg, data[z]);
            }
        }
        
        return str;
    }
        
    
    
    function processTemplateFile(srcFile, data) {
        
        var srcTxt = "";
        
        FileUtils.readAsText(srcFile)
            .done(function (rawText, readTimestamp) {
                var newText = _processTemplate(rawText, data);
                FileUtils.writeText(srcFile, newText)
                    .fail(function (err) {
                        console.log(err);
                    });
            })
            .fail(function (err) {
                console.log(err);
            });
    }



    function createExtension(data) {
        
        var moduleFolder = FileUtils.getNativeModuleDirectoryPath(module);
        var templateFolder = new NativeFileSystem.DirectoryEntry(moduleFolder + TEMPLATE_FOLDER_NAME);

        var destParentPath = userHomeDir + EXTENSION_DIR_MAC;
        
        var destDirPath = destParentPath + data.extid;
        
        var copyPromise = nodeConnection.domains.ccext.copyTemplate(templateFolder.fullPath, data.extid);
        copyPromise.fail(function (err) {
            console.error("[brackets-ccext-node] failed to run ccext.copyTemplate", err);
        });
        copyPromise.done(function (success) {
            //console.log("Template copied: " + success);

            // TMP (awful) hack before we get a clean way to get async response
            window.setTimeout(function () {
                
                // Modify manifest file             
                var manifestFile =  new NativeFileSystem.FileEntry(destDirPath + "/CSXS/manifest.xml");
                processTemplateFile(manifestFile, data);

                // Open project and document
                ProjectManager.openProject(destDirPath).done(
                    function () {
                        DocumentManager.getDocumentForPath(destDirPath + "/index.html").done(
                            function (doc) {
                                DocumentManager.setCurrentDocument(doc);
                                alert(SUCCESS_MSG);
                            }
                        );
                    }
                );
                                
            }, 700);
        });
    }



    function createPanel() {
        
        ExtensionUtils.loadStyleSheet(module, "panel.css");
        
        Dialogs.showModalDialogUsingTemplate(PanelTemplate);
                
        var $submitBt = $("#ccextSubmit");
        var $cancelBt = $("#ccextCancel");
        
        var $extid = $("#ccext-id");
        var $extname = $("#ccext-extname");
        var $exthost = $("#ccext-host");
        var $extwidth = $("#ccext-extwidth");
        var $extheight = $("#ccext-extheight");
        
        $submitBt.on("click", function (e) {
            
            var data = {
                extid : $extid.val(),
                host: HOSTS[parseInt($exthost.val(), 10)],
                width: $extwidth.val(),
                height: $extheight.val(),
                minwidth: "",
                minheight: "",
                maxwidth: "",
                maxheight: "",
                
                extname : $extname.val()
            };
                        
            createExtension(data);
        });
                
    }
    


    function onMenuCreateNewCCExt() {
        createPanel();
    }
    

        
    function initNodeDomain() {
                    
        var promise = nodeConnection.domains.ccext.initialize();
        promise.fail(function (err) {
            console.error("[brackets-ccext-node] failed to run ccext.initialize", err);
        });
        promise.done(function (path) {
            console.log("Home directory: " + path);
            userHomeDir = path;
        });
        return promise;
    }

                
            
    function initNodeCnx() {
        
        nodeConnection = new NodeConnection();
        
        var connectionPromise = nodeConnection.connect(true);
        connectionPromise.fail(function () {
            console.error("[brackets-ccext-node] failed to connect to node");
        });
        connectionPromise.done(function () {
            var path = ExtensionUtils.getModulePath(module, NODE_DOMAIN_LOCATION);

            var loadPromise = nodeConnection.loadDomains([path], true);
            loadPromise.fail(function () {
                console.log("[brackets-ccext-node] failed to load domain");
            });
            loadPromise.done(function () {
                initNodeDomain();
            });
        });
            
    }
            
            
    AppInit.appReady(function () {
        initNodeCnx();
    });

    
    CommandManager.register(NEW_CCEXT_MENU_NAME, NEW_CCEXT_COMMAND_ID, onMenuCreateNewCCExt);
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(NEW_CCEXT_COMMAND_ID);
    menu.addMenuDivider(Menus.BEFORE, NEW_CCEXT_COMMAND_ID);
});