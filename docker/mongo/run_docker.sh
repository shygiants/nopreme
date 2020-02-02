#!/usr/bin/env bash

WORK_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check environment variables
if [ ! -f ${WORK_DIR}/run_args.sh ]; then
    echo "run_args.sh not found. Make use of environment variables."

    UNSET_VARS=""
    
    if [ -z "$LOCAL_DB_DIR" ]; then
        UNSET_VARS="${UNSET_VARS} LOCAL_DB_DIR"
    fi

    if [ -z "$MONGO_INITDB_ROOT_USERNAME" ]; then
        UNSET_VARS="${UNSET_VARS} MONGO_INITDB_ROOT_USERNAME"
    fi

    if [ -z "$MONGO_INITDB_ROOT_PASSWORD" ]; then
        UNSET_VARS="${UNSET_VARS} MONGO_INITDB_ROOT_PASSWORD"
    fi

    # Print unset vars
    if [ ! -z "$UNSET_VARS" ]; then
        echo "Environment variable$UNSET_VARS is not set"
        exit 1
    fi
else
    . ${WORK_DIR}/run_args.sh
fi

CONTAINER_NAME="nopreme-mongo"

docker stop ${CONTAINER_NAME}
docker run --name ${CONTAINER_NAME} \
    -e MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME} \
    -e MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD} \
    -v ${LOCAL_DB_DIR}:/data/db \
    -p 27017:27017 \
    --rm -d mongo
docker logs -f ${CONTAINER_NAME}