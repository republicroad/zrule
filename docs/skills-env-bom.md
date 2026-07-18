# Skill: Fix BOM (Byte Order Mark) in .env Files

## Problem

UTF-8 BOM (`EF BB BF`) at the start of `.env` files causes the first environment variable to fail silently. Bun/Node may parse the BOM as part of the key name, making the first line unreadable.

## Detection

```powershell
# Check if BOM exists (look for EF BB BF at start)
Get-Content "path\to\.env" -Raw | Format-Hex | Select-Object -First 5
```

BOM present: `00000000  EF BB BF 44 41 54 ...` (starts with `EF`)
Clean file:  `00000000  44 41 54 41 42 41 ...` (starts with `D`)

## Fix (PowerShell)

```powershell
$path = "path\to\.env"
$content = [System.IO.File]::ReadAllBytes($path)
if ($content.Length -ge 3 -and $content[0] -eq 0xEF -and $content[1] -eq 0xBB -and $content[2] -eq 0xBF) {
    $content = $content[2..($content.Length-1)]
    [System.IO.File]::WriteAllBytes($path, $content)
    Write-Host "BOM removed."
} else {
    Write-Host "No BOM found."
}
```

## Prevention

- Always save `.env` as **UTF-8 without BOM**
- In VS Code: bottom-right status bar → click encoding → "Save with Encoding" → "UTF-8"
- In Notepad++: Encoding → "Encode in UTF-8" (not "UTF-8-BOM")
- Use `dotenv` library which handles BOM automatically

## Bun Behavior

- Bun auto-loads `.env` from the working directory
