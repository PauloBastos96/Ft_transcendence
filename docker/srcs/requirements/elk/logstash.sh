#!/bin/bash

# Create index pattern for nginx logs
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
      -H "kbn-xsrf: true" \
      -H "Content-Type: application/json" \
      -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
      -d '{
        "attributes": {
          "title": "nginx-*",
          "timeFieldName": "@timestamp"
        }
      }'

# Create index pattern for postgres logs
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
      -H "kbn-xsrf: true" \
      -H "Content-Type: application/json" \
      -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
      -d '{
        "attributes": {
          "title": "postgres-*",
          "timeFieldName": "@timestamp"
        }
      }'

# Create index pattern for backend logs
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
      -H "kbn-xsrf: true" \
      -H "Content-Type: application/json" \
      -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
      -d '{
        "attributes": {
          "title": "backend-*",
          "timeFieldName": "@timestamp"
        }
      }'

# Create index pattern for general logstash logs
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
      -H "kbn-xsrf: true" \
      -H "Content-Type: application/json" \
      -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
      -d '{
        "attributes": {
          "title": "elk-*",
          "timeFieldName": "@timestamp"
        }
      }'

# # CREATE backup repository

# curl -X PUT "https://es01:9200/_snapshot/my_backup" \
#   --cacert /usr/share/logstash/certs/ca/ca.crt \
#   --key /usr/share/logstash/certs/ca/ca.key \
#   -u ${ELASTIC_USER}:${ELASTIC_PASSWORD} \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "type": "fs",
#     "settings": {
#       "location": "/usr/share/elasticsearch/backup/"
#     }
#   }'

# # CREATE elasticsearch snapshots

# curl -X PUT "https://es01:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true" \
#   --cacert /usr/share/logstash/certs/ca/ca.crt \
#   --key /usr/share/logstash/certs/ca/ca.key \
#   -u ${ELASTIC_USER}:${ELASTIC_PASSWORD} \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "indices": "nginx-logs-*,postgres-logs-*,backend-logs-*",
#     "ignore_unavailable": true,
#     "include_global_state": false
#   }'

