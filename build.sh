#!/bin/sh

if [ ! -d "./js" ];then
mkdir ./js
fi

rm -rf ./js/*

echo "Compiling ts files..."

tsc

if [ $? -ne 0 ]; then 
    exit -1
fi

echo "Merging js files..."

function scandir() {
    local cur_dir parent_dir workdir
    workdir=$1
    cd ${workdir}
    if [ ${workdir} = "/" ]
    then
        cur_dir=""
    else
        cur_dir=$(pwd)
    fi

    for dirlist in $(ls ${cur_dir})
    do
        if test -d ${dirlist};then
            cd ${dirlist}
            scandir ${cur_dir}/${dirlist}
            cd ..
        else
            if [[ "$dirlist" = "main.js" ]]; then
                continue
            fi
            echo ${cur_dir}/${dirlist}
        fi
    done
}


js_files=$(scandir "./js")

uglifyjs $js_files -o ./js/renderer.min.js

echo "Done!"
