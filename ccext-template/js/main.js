/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
    'use strict';

    var csInterface = new CSInterface();
    
    // Opens the chrome developer tools in host app
    function showDevTools() {
        window.__adobe_cep__.showDevTools();
    }
    
    // Reloads extension panel
    function reloadPanel() {
        location.reload();
    }
    
    
    function init() {
                
        themeManager.init();
        
        $("#btn_debug").click(showDevTools);
        $("#btn_reload").click(reloadPanel);
        
        $("#btn_test").click(function () {
            csInterface.evalScript('sayHello()');
        });
    }
        
    init();

}());
    
