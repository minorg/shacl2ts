#!/bin/bash

set -e

cd "$(dirname "$0")/.."

# MLM
MLM_SHAPES_TTL_ORIGINAL_FILE_PATH="../annotize/lib/data/ontology/ttl/annotize-mlm-o.ttl"
if [ -f "$MLM_SHAPES_TTL_ORIGINAL_FILE_PATH" ] ; then
  cp $MLM_SHAPES_TTL_ORIGINAL_FILE_PATH $PWD/examples/mlm/mlm.shapes.ttl
  echo "copied MLM shapes from original file $MLM_SHAPES_TTL_ORIGINAL_FILE_PATH"
else
  echo "MLM shapes original file $MLM_SHAPES_TTL_ORIGINAL_FILE_PATH not found, using copy"
fi
#./packages/cli/cli.sh show-ast-json $PWD/examples/mlm/mlm.shapes.ttl $PWD/examples/mlm/mlm.shaclmate.ttl >examples/mlm/generated/ast.json
./packages/cli/cli.sh generate --object-type-declaration-type class $PWD/examples/mlm/mlm.shapes.ttl $PWD/examples/mlm/mlm.shaclmate.ttl >examples/mlm/generated/classes.ts
./packages/cli/cli.sh generate --object-type-declaration-type interface $PWD/examples/mlm/mlm.shapes.ttl $PWD/examples/mlm/mlm.shaclmate.ttl >examples/mlm/generated/interfaces.ts

# SDO
# ./packages/cli/cli.sh ast-json $PWD/examples/sdo/sdo.shapes.ttl $PWD/examples/sdo/sdo.shaclmate.ttl >examples/sdo/generated/ast.json

# SKOS
SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH="../kos-kit/skos-shacl/shapes/skos-shaclmate.shacl.ttl"
if [ -f "$SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH" ] ; then
  cp $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH $PWD/examples/skos/skos.shapes.ttl
  echo "copied SKOS shapes from original file $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH"
else
  echo "SKOS shapes original file $SKOS_SHAPES_TTL_ORIGINAL_FILE_PATH not found, using copy"
fi
./packages/cli/cli.sh show-ast-json $PWD/examples/skos/skos.shapes.ttl >examples/skos/generated/ast.json
./packages/cli/cli.sh generate --object-type-declaration-type class $PWD/examples/skos/skos.shapes.ttl >examples/skos/generated/classes.ts
./packages/cli/cli.sh generate --object-type-declaration-type interface $PWD/examples/skos/skos.shapes.ttl >examples/skos/generated/interfaces.ts


npm run check:write:unsafe