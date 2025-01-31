#!/bin/bash

# Read the Elasticstash password from the secret file
export ELASTIC_PASSWORD=$(cat $ELASTIC_PASSWORD_FILE)

# Run Logstash
/requirements/elk/logstash.sh && logstash -f /usr/share/logstash/pipeline/logstash.conf