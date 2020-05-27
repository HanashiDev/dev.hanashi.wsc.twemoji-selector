@ECHO OFF
del files.tar
7z a -ttar -mx=9 files.tar .\files\*
del templates.tar
7z a -ttar -mx=9 templates.tar .\templates\*
del dev.hanashi.wsc.twemoji-selector.tar
7z a -ttar -mx=9 dev.hanashi.wsc.twemoji-selector.tar .\* -x!acptemplates -x!files -x!templates -x!dev.hanashi.wsc.twemoji-selector.tar -x!.git -x!.gitignore -x!make.bat -x!make.sh
del files.tar
del templates.tar
