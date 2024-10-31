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
#./cli.sh ast-json examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shacl2ts.ttl >examples/mlm/generated/ast.json
./cli.sh generate examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shacl2ts.ttl >examples/mlm/generated/generated.ts

# SDO
# ./cli.sh ast-json examples/sdo/sdo.shapes.ttl examples/sdo/sdo.shacl2ts.ttl >examples/sdo/generated/ast.json

npm run check:write:unsafe