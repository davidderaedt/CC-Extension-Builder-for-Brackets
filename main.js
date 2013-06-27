/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** CCExtBuilder Extension 
    Create HTML based Extensions for Creative Cloud applications
*/
define(function (require, exports, module) {
    'use strict';

    console.log("INITIALIZING CCExtBuilder EXTENSION");
        
    var CommandManager      = brackets.getModule("command/CommandManager");
    var Menus               = brackets.getModule("command/Menus");
    var ProjectManager      = brackets.getModule("project/ProjectManager");
    var FileUtils           = brackets.getModule("file/FileUtils");
    var NativeFileSystem    = brackets.getModule("file/NativeFileSystem").NativeFileSystem;
    var PanelManager        = brackets.getModule("view/PanelManager");
    var Resizer             = brackets.getModule("utils/Resizer");
    var PanelTemplate       = require("text!panel.html");
    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    var AppInit             = brackets.getModule("utils/AppInit");
    var NodeConnection      = brackets.getModule("utils/NodeConnection");


    var NEW_CCEXT_COMMAND_ID  = "CCExtBuilder.newExt";
    var NEW_CCEXT_MENU_NAME   = "New CC Extension";
            
    var TEMPLATE_FOLDER_NAME = "/ccext-template/";
    var EXTENSION_DIR_MAC = "/Library/Application\ Support/Adobe/CEPServiceManager4/extensions/";
    var PREF_LOCATION_MAC = "/Library/Preferences/com.adobe.CSXS.4.plist";
    var PLAYER_DEBUG_STRING = "<key>PlayerDebugMode</key><string>1</string>";
    var NODE_DOMAIN_LOCATION = "node/CCExtDomain";
    var HOSTS = [
            '<Host Name="PHXS" Version="[14.0,14.9]" /><Host Name="PHSP" Version="[14.0,14.9]" />',
            '<Host Name="ILST" Version="[17.0,17.9]" />',
            '<Host Name="PPRO" Version="[7.0,7.9]" />',
            '<Host Name="PRLD" Version="[2.0,2.9]" />'
        ];
        
        
    // jquery handle for the UI
    var $panel;
    // Path to the user home directory
    var userHomeDir;
    // Object used to connect to node services
    var nodeConnection;

    
                  
    function _processTemplate(template, rep) {
        
        var txt = template;
        var z;
        for (z in rep) {
            if (rep.hasOwnProperty(z)) {
                var reg = new RegExp("\\${" + z + "}", "g");
                txt = txt.replace(reg, rep[z]);
            }
        }
        
        return txt;
    }
        
    
    function processFileTemplate(srcFile, data) {
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



    function setDebugMode() {
        
        var promise = nodeConnection.domains.ccext.setDebugMode();
        promise.fail(function (err) {
            console.error("[brackets-ccext-node] failed to run ccext.setDebugMode", err);
        });
        promise.done(function (path) {
            console.log("debug mode on");
        });
        return promise;
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
            console.log("Template copied: " + success);

            // TMP hack before we get a clean way get async response
            window.setTimeout(function () {
                // Modify manifest file             
                var srcFile =  new NativeFileSystem.FileEntry(destDirPath + "/CSXS/manifest.xml");
                processFileTemplate(srcFile, data);
                
                setDebugMode();

                ProjectManager.openProject(destDirPath);
                                
            }, 1000);
            
        });
    }



    function createPanel() {
        
        ExtensionUtils.loadStyleSheet(module, "panel.css");
        
        var panel = PanelManager.createBottomPanel("ccextbuilder.panel", $(PanelTemplate), 350);
        $panel = $("#ccext-panel");
        
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
                extname : $extname.val()
            };
            
            Resizer.hide($panel);
            
            createExtension(data);
        });
        
        $cancelBt.on("click", function (e) {
            Resizer.hide($panel);
        });
        
    }
    


    function createNewCCExt() {
        if (!$panel) {
            createPanel();
        }
        
        Resizer.show($panel);
    }
    

        
    function getHomeDir() {
                    
        var promise = nodeConnection.domains.ccext.getHomeDirectory();
        promise.fail(function (err) {
            console.error("[brackets-ccext-node] failed to run ccext.getHomeDirectory", err);
        });
        promise.done(function (path) {
            //console.log("Home directory: " + path);
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
                getHomeDir();
            });
        });
            
    }
            
            
    AppInit.appReady(function () {
        initNodeCnx();
    });

    
    
    CommandManager.register(NEW_CCEXT_MENU_NAME, NEW_CCEXT_COMMAND_ID, createNewCCExt);
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(NEW_CCEXT_COMMAND_ID);
    menu.addMenuDivider(Menus.BEFORE, NEW_CCEXT_COMMAND_ID);
    
});