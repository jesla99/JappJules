#!/bin/bash


## Script de automatización para crear commits en Git para linux.
# Uso: ./commit.sh "Mensaje del commit"
mensaje="$1"

# Agrega todos los cambios
git add .

# Verifica si hay commits previos
if git rev-parse --verify HEAD >/dev/null 2>&1; then
    # Verifica si el último commit ya fue empujado al remoto
    ultimoCommitLocal=$(git rev-parse HEAD)
    ultimoCommitRemoto=$(git ls-remote origin HEAD | awk '{print $1}')

    if [ "$ultimoCommitLocal" = "$ultimoCommitRemoto" ]; then
        echo "Creando commit nuevo (ya se hizo push)..."
        git commit -m "$mensaje"
    else
        echo "Creando commit incremental (sin push previo)..."
        mensajeAnterior=$(git log -1 --pretty=%B)
        mensajeFinal="$mensajeAnterior"$'\n'"$mensaje"
        git commit --amend -m "$mensajeFinal"
    fi
else
    echo "Creando primer commit..."
    git commit -m "$mensaje"
fi