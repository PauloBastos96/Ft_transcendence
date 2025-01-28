#!/bin/bash

# Read the Kibana password from the secret file
export ELASTICSEARCH_PASSWORD=$(cat $ELASTICSEARCH_PASSWORD_FILE)

# Start Kibana
exec /usr/local/bin/kibana-docker