#!/bin/bash

set -e

cd "$(dirname "$0")/.."

# MLM
# ./cli.sh ast-json examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shacl2ts.ttl >examples/mlm/generated/ast.json
./cli.sh class-ts examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shacl2ts.ttl >examples/mlm/generated/classes.ts
# ./cli.sh interface-ts examples/mlm/mlm.shapes.ttl examples/mlm/mlm.shacl2ts.ttl >examples/mlm/generated/interfaces.ts

# SDO
./cli.sh ast-json examples/sdo/sdo.shapes.ttl examples/sdo/sdo.shacl2ts.ttl >examples/sdo/generated/ast.json
#./cli.sh class-ts examples/sdo/sdo.shapes.ttl examples/sdo/sdo.shacl2ts.ttl >examples/sdo/generated/classes.ts
#./cli.sh interface-ts examples/sdo/sdo.shapes.ttl examples/sdo/sdo.shacl2ts.ttl >examples/sdo/generated/interfaces.ts

npm run check:write