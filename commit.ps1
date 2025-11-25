### Script de PowerShell para gestionar commits en Git
# Uso: .\commit.ps1 "Mensaje del commit"

param (
    [string]$mensaje
)

# Agrega todos los cambios
git add .

# Verifica si hay commits previos
$hayCommit = git rev-parse --verify HEAD 2>$null

if ($hayCommit) {
    # Verifica si el último commit ya fue empujado al remoto
    $ultimoCommitLocal = git rev-parse HEAD
    $ultimoCommitRemoto = git ls-remote origin HEAD | ForEach-Object { ($_ -split "`t")[0] }

    if ($ultimoCommitLocal -eq $ultimoCommitRemoto) {
        # Ya se hizo push, crea un nuevo commit
        
        "Creando commit inicial..."
        #git commit -m "$mensaje"
    } else {
        # No se ha hecho push, combina el mensaje anterior con el nuevo
        
        "Creando commit incremental"
        $mensajeAnterior = git log -1 --pretty=%B
        $mensajeFinal = "$mensajeAnterior`n$mensaje"
        git commit --amend -m "$mensajeFinal"
    }
} else {
    # Primer commit
    "Creando primer commit..."
    git commit -m "$mensaje"
}


