!macro customInstall
  ; Ajouter une option pour l'icône sur le bureau
  !insertmacro MUI_PAGE_COMPONENTS
!macroend

!macro customInit
  ; Option par défaut pour créer une icône sur le bureau
  WriteRegStr HKCU "Software\Silverdium" "CreateDesktopShortcut" "1"
!macroend

Section "Create Desktop Shortcut" SEC_DESKTOP_SHORTCUT
  SetOutPath "$INSTDIR"
  CreateShortcut "$DESKTOP\Silverdium.lnk" "$INSTDIR\Silverdium Launcher.exe"
SectionEnd
