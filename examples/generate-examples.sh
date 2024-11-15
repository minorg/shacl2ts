#!/bin/bash

set -e

cd "$(dirname "$0")/.."

# MLM
MLM_SHAPES_TTL_ORIGINAL_FILE_PATH="../annotize/lib/data/ontology/ttl/annotize-mlm-o.ttl"
if [ -f "$MLM_SHAPES_TTL_ORIGINAL_FILE_PATH" ] ; then
  cp $MLM_SHAPES_TTL_ORIGINAL_FILE_PATH examples/mlm/mlm.shapes.ttl
  echo "copied MLM shapes from original file $MLM_SHAPES_TTL_ORIGINAL_FILE_PATH"
else
  echo "MLM shapes original file $MLM_SHAPES_TTL_ORIGINAL_FILE_PATH not found, using copy"
fi
./cli.sh show-ast-json examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shaclmate.ttl >examples/mlm/generated/ast.json
./cli.sh generate --object-type-declaration-type class examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shaclmate.ttl >examples/mlm/generated/classes.ts
./cli.sh generate --object-type-declaration-type interface examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shaclmate.ttl >examples/mlm/generated/interfaces.ts

# SDO
# ./cli.sh ast-json examples/sdo/sdo.shapes.ttl examples/sdo/sdo.shaclmate.ttl >examples/sdo/generated/ast.json

# SKOS
SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH="../kos-kit/skos-shacl/shapes/skos-shaclmate.shacl.ttl"
if [ -f "$SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH" ] ; then
  cp $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH examples/skos/skos.shapes.ttl
  echo "copied SKOS shapes from original file $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH"
else
  echo "SKOS shapes original file $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH not found, using copy"
fi
./cli.sh show-ast-json examples/skos/skos.shapes.ttl >examples/skos/generated/ast.json
./cli.sh generate --object-type-declaration-type class examples/skos/skos.shapes.ttl >examples/skos/generated/classes.ts
./cli.sh generate --object-type-declaration-type interface examples/skos/skos.shapes.ttl >examples/skos/generated/interfaces.ts


npm run check:write:unsafe