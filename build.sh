#!/bin/sh

rm -f ./js/renderer.min.js

echo "Compiling ts files..."

tsc

echo "Merging js files..."

js_files=""
for file in $(ls ./js)
do
    if [[ "$file" = "main.js" ]]; then
        continue
    fi
    file="./js/$file"
    js_files="$js_files $file"
done    

uglifyjs $js_files -o ./js/renderer.min.js

echo "Done."