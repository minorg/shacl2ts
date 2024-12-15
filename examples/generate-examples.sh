#!/bin/bash

set -e

cd "$(dirname "$0")/.."


# Kitchen sink
./packages/cli/cli.sh show-ast-json $PWD/examples/kitchen-sink/kitchen-sink.shapes.ttl >examples/kitchen-sink/ast.json
./packages/cli/cli.sh generate $PWD/examples/kitchen-sink/kitchen-sink.shapes.ttl >examples/kitchen-sink/generated.ts

# SKOS
#SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH="../kos-kit/skos-shacl/shapes/skos-shaclmate.shacl.ttl"
#if [ -f "$SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH" ] ; then
#  cp $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH $PWD/examples/skos/skos.shapes.ttl
#  echo "copied SKOS shapes from original file $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH"
#else
#  echo "SKOS shapes original file $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH not found, using copy"
#fi
#./packages/cli/cli.sh show-ast-json $PWD/examples/skos/skos.shapes.ttl >examples/skos/ast.json
#./packages/cli/cli.sh generate $PWD/examples/skos/skos.shapes.ttl >examples/skos/generated.ts

npm exec biome -- check --write --unsafe $PWD/examples
