
#!/usr/bin/env bash

set -e

version=${1:?Target version required}

echo "Updating deployment metadata for version $version..."

git archive --remote=ssh://git@gitlab.mufan.io/makeflow/makeflow-web "$version" deployment-metadata.json | tar -xf -
