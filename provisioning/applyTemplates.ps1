$webUrl = "" #sp site url
$template = "\Templates\Lists.xml"

function Get-ScriptDirectory {
    if ($psise) {Split-Path $psise.CurrentFile.FullPath}
    else {$global:PSScriptRoot}
}
$folderPath = Get-ScriptDirectory

#connect to site
Connect-PnPOnline -Url $webUrl 
Write-Host "Connected to site: " (Get-PnPContext).Url -f Green

#applies the provisioning
$templatePath = $folderPath + $template
Apply-PnPProvisioningTemplate -Path $templatePath