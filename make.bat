@ECHO OFF
del files.tar
7z a -ttar -mx=9 files.tar .\files\*
del dev.hanashi.wsc.twemoji-selector.tar
7z a -ttar -mx=9 dev.hanashi.wsc.twemoji-selector.tar .\* -x!acptemplates -x!files -x!doc -x!README.adoc -x!templates -x!dev.hanashi.wsc.twemoji-selector.tar -x!.git -x!.gitignore -x!make.bat -x!make.sh
del files.tar
