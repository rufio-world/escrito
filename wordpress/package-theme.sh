#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="${ROOT_DIR}/escrito-builder-theme"
OUTPUT_DIR="${ROOT_DIR}/dist"

mkdir -p "${OUTPUT_DIR}"

if [[ ! -f "${THEME_DIR}/style.css" ]]; then
  echo "Missing theme stylesheet: ${THEME_DIR}/style.css" >&2
  exit 1
fi

(cd "${THEME_DIR}" && zip -r "${OUTPUT_DIR}/escrito-builder-theme.zip" .)

echo "Theme package created at ${OUTPUT_DIR}/escrito-builder-theme.zip"
