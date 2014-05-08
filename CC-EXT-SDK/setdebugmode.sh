#!/bin/bash
/usr/libexec/PlistBuddy -c "Add:PlayerDebugMode string 1" ~/Library/Preferences/com.adobe.CSXS.5.plist
#must kill cfprefsd to take effect
ps -ef | grep "cfprefsd" | awk '{print $2}' | xargs kill
