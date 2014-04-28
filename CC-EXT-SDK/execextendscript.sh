#!/bin/bash

appcode=$1

if [ "$appcode" = "ps" ]
then 
    app="Adobe Photoshop CC"
    command="javascript"
    lang=""
elif [ "$appcode" = "ai" ]
then 
    app="Adobe Illustrator"
    command="javascript"
    lang=""
elif [ "$appcode" = "id" ]
then 
    app="Adobe InDesign CC"
    command="script"
    lang="language javascript"           
fi

osascript <<-AS
tell application "$app"
   do $command "#include $2" $lang
end tell
AS
