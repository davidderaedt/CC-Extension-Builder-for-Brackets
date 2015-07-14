/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** CCExtBuilder Extension 
    Create HTML based Extensions for Creative Cloud applications
*/
define(function (require, exports, module) {
    'use strict';

    //console.log("INITIALIZING CCExtBuilder EXTENSION");
        
    var CommandManager      = brackets.getModule("command/CommandManager");
    var DocumentManager     = brackets.getModule("document/DocumentManager");
    var Menus               = brackets.getModule("command/Menus");
    var ProjectManager      = brackets.getModule("project/ProjectManager");
    var FileUtils           = brackets.getModule("file/FileUtils");
    var FileSystem          = brackets.getModule("filesystem/FileSystem");
    var Dialogs             = brackets.getModule("widgets/Dialogs");
    var PanelTemplate       = require("text!panel.html");
    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    var AppInit             = brackets.getModule("utils/AppInit");
    var NodeConnection      = brackets.getModule("utils/NodeConnection");
    
    
    var CCEXT_MENU_ID  = "CCExtBuilder.menu";
    var CCEXT_MENU_NAME = "CC Extension Builder";
    var NEW_CCEXT_CMDID  = "CCExtBuilder.newExt";
    var NEW_CCEXT_MENU_NAME   = "New Creative Cloud Extension";
    var DEBUGMODE_ON_CMDID  = "CCExtBuilder.setDebugMode";
    var DEBUGMODE_ON_CMDNAME   = "Enable Debug Mode";
    
    var SDK_FOLDER_NAME = "/CC-EXT-SDK/";
    var NODE_DOMAIN_LOCATION = "node/CCExtDomain";
    var SUCCESS_MSG = "Extension successfully created. Please Edit the manifest file according to your needs and launch the corresponding CC app.";

    
    var HOSTS = [
            '<Host Name="PHXS" Version="[14.0,2100.0]" /><Host Name="PHSP" Version="[14.0,2100.0]" />',
            '<Host Name="ILST" Version="[17.0,2100.0]" />',
            '<Host Name="PPRO" Version="[7.0,2100.0]" />',
            '<Host Name="PRLD" Version="[2.0,2100.0]" />',
            '<Host Name="IDSN" Version="[9.1,2100.0]" />',
            '<Host Name="FLPR" Version="[13.1,2100.0]" />',
            '<Host Name="AEFT" Version="[13.0,2100.0]" />'
        ];    
                
    var isWin = true;
    var userHomeDir;
    var nodeConnection;
    var moduleFolder;
    var sdkFolder;
    
        
    function enableDebugging(){
        
        var cmd = "";
        if(isWin) {
            cmd = '"'+sdkFolder.fullPath + 'setdebugmode.bat"';
        } else {
            cmd = "'"+sdkFolder.fullPath + "setdebugmode.sh'" ;
        } 
                
        console.log("Brackets cmd:"+cmd);
        
        var exePromise = nodeConnection.domains.ccext.execmd(cmd);
        
        exePromise.fail(function (err) {
            console.error("[brackets-ccext-node] failed to run ccext.execmd", err);
        });
        
        exePromise.done(function (stdout) {            
            alert("Debug Mode ON");
        });    
    }
    
    
    function createExtension(data) {
                
        var cmd = "";
        if(isWin) {
            cmd = '"'+sdkFolder.fullPath + "createext.bat" + '" default ' + data.extid;
        } else {
            cmd = "'"+sdkFolder.fullPath + "createext.sh"  + "' default " + data.extid;
        } 
                
        console.log("Brackets cmd:"+cmd);
        
        var exePromise = nodeConnection.domains.ccext.execmd(cmd);
        
        exePromise.fail(function (err) {
            console.error("[brackets-ccext-node] failed to run ccext.execmd", err);
        });
        
        exePromise.done(function (stdout) {
            
            var nstdout = stdout.replace(/[\r\n]/g, "");// remove line breaks
            var path = nstdout.replace(/\\/g,"/");// normalize windows paths       
            
            
            // Modify manifest file             
            var manifestFile =  new FileSystem.getFileForPath(path + "/CSXS/manifest.xml");
            processTemplateFile(manifestFile, data);

            // Modify debug file             
            var debugFile =  new FileSystem.getFileForPath(path + "/.debug");
            processTemplateFile(debugFile, data);
          
            
            // Open project and document
            ProjectManager.openProject(path).done(
                function () {
                    DocumentManager.getDocumentForPath(path + "/CSXS/manifest.xml").done(
                        function (doc) {
                            DocumentManager.setCurrentDocument(doc);
                            alert(SUCCESS_MSG);
                        }
                    );
                }
            );
                                
        });
    }
    
    
    function _processTemplate(templateString, data) {
        
        var str = templateString;
        var reg1 = new RegExp("com.example.ext", "g");
        str = str.replace(reg1, data.extid);
        var reg2 = new RegExp("Extension-Name", "g");
        str = str.replace(reg2, data.extname);
        
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
    
    
    function createPanel() {
        
        ExtensionUtils.loadStyleSheet(module, "panel.css");
        
        Dialogs.showModalDialogUsingTemplate(PanelTemplate);
                
        
        $("#ccextSubmit").on("click", function (e) {
            
            var data = {
                extid : $("#ccext-id").val(),
                extname : $("#ccext-extname").val()
                /*
                host: HOSTS[parseInt($("#ccext-host").val(), 10)],
                width: $("#ccext-extwidth").val(),
                height: $("#ccext-extheight").val(),
                minwidth: $("#ccext-extminwidth").val(),
                minheight: $("#ccext-extminheight").val(),
                maxwidth: $("#ccext-extmaxwidth").val(),
                maxheight: $("#ccext-extmaxheight").val()
                */
            };
                        
            createExtension(data);
        });
                
    }
    
            
            
    AppInit.appReady(function () {
        
        isWin = (brackets.platform!="mac");
        
        moduleFolder = FileUtils.getNativeModuleDirectoryPath(module);
        sdkFolder = new FileSystem.getDirectoryForPath(moduleFolder + SDK_FOLDER_NAME);        
        
        initNodeCnx();
        
    });
    

    function setupMenu(){
        
        CommandManager.register(DEBUGMODE_ON_CMDNAME, DEBUGMODE_ON_CMDID, onMenuDebugModeOn);
        function onMenuDebugModeOn(){
            enableDebugging();
        }

        CommandManager.register(NEW_CCEXT_MENU_NAME, NEW_CCEXT_CMDID, onMenuCreateNewCCExt);    
        function onMenuCreateNewCCExt(){
            createPanel();
        }    


        var ccextMenu =  Menus.getMenu(CCEXT_MENU_ID);
        if (!ccextMenu) {
            ccextMenu = Menus.addMenu(CCEXT_MENU_NAME, CCEXT_MENU_ID, Menus.LAST);
        }

        ccextMenu.addMenuItem(DEBUGMODE_ON_CMDID);
        ccextMenu.addMenuItem(NEW_CCEXT_CMDID);    
        
        //ccextMenu.addMenuDivider(Menus.BEFORE, NEW_CCEXT_COMMAND_ID);

    }
    setupMenu();
    
});
