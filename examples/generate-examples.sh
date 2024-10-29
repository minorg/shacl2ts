#!/bin/bash

set -e

cd "$(dirname "$0")/.."

# MLM
#./cli.sh ast-json examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shacl2ts.ttl >examples/mlm/generated/ast.json
./cli.sh generate --object-type-discriminator-property-name type examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shacl2ts.ttl >examples/mlm/generated/generated.ts

# SDO
# ./cli.sh ast-json examples/sdo/sdo.shapes.ttl examples/sdo/sdo.shacl2ts.ttl >examples/sdo/generated/ast.json

npm run check:write