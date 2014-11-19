/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";
    
    var sys = require('sys');
    var exec = require('child_process').exec;
    var os = require('os');
    var fs = require('fs');
    
    var isMac;
    
    
    function log(pMsg) {
        
        var sep = (isMac) ? "/" : "\\";
        fs.appendFile(__dirname + sep + "nodelog.txt", pMsg + "\r\n");
        
        //console.log(pMsg);
    }

    
    /**
     * @private
     * Converts unix paths to windows paths
     * @return string path
     */
    function toWinPath(pPath) {
        if (pPath[pPath.length - 1] === "/") {
            pPath = pPath.slice(0, -1);
        }
        var reg = new RegExp("\/", "g");
        var result = pPath.replace(reg, "\\");
        //result = result.substr(0, result.length - 1);
        return result;
    }
    
    
    /**
     * @private
     * Handler function for the ccext.execmd command.
     * @return true
     */
    function cmdExec(cmd, cb) {
                        
        log("Exec:" + cmd);
        
        exec(cmd, function (error, stdout, stderr) {
            if (error !== null) {
                log(error);
                cb(error, null);
            } else {
                log("stdout:" + stdout);
                cb(null, stdout);
            }
        });
    }        
    
 
    /**
    * @private
    * Give execution rights to scripts
    */
    
    function setExecPermissions() {
        
        var cmd1 = "chmod 755 '" + __dirname + "/../CC-EXT-SDK/setdebugmode.sh'";
        log("Exec:" + cmd1);       
        exec(cmd1, function (error, stdout, stderr) {if (error !== null) {log(error);}});        
        
        var cmd2 = "chmod 755 '" + __dirname + "/../CC-EXT-SDK/createext.sh'";
        /*
        if (!isMac) {
            cmd2 = 'cacls ' + __dirname + '\\CC-EXT-SDK\\createext.bat /e /g everyone:f';
        }
        */
        log("Exec:" + cmd2);
        
        exec(cmd2, function (error, stdout, stderr) {if (error !== null) {log(error);}});        
        
        return true;
    }
    
  
    /**
     * @private
     * Initializes domain by setting permissions and enabling debug mode 
     * @return string the path of the home directory
     */
    function cmdInitialize() {
        
        //setExecPermissions();
        var home = (process.env.HOME || process.env.USERPROFILE);
        return home;
    }
        
    
    
    /**
     * Initializes the test domain with several commands.
     * @param {DomainManager} DomainManager The DomainManager for the server
     */
    function init(DomainManager) {
        
        isMac = os.platform() === "darwin";
        
        log("start " + new Date().toString() + " -- Platform: " + os.platform());

        if (!DomainManager.hasDomain("ccext")) {
            DomainManager.registerDomain("ccext", {major: 0, minor: 1});
        }

                        
        DomainManager.registerCommand(
            "ccext",       // domain name
            "execmd",    // command name
            cmdExec,   // command handler function
            true,          // this command is synchronous
            "Executes arbitrary command",
            [
                {
                    name: "cmd",
                    type: "String",
                    description: "command to be executed"
                }
            ],// parameters
            [{name: "success",
                type: "String",
                description: "success of file operation"}]
        );   

        DomainManager.registerCommand(
            "ccext",       // domain name
            "initialize",    // command name
            cmdInitialize,   // command handler function
            false,          // this command is synchronous
            "initialize domain and returns Home dir",
            [],// parameters
            [{name: "path",
                type: "String",
                description: "user home directory"}]
        );
        setExecPermissions();
        
    }
        
    exports.init = init;
    
}());
