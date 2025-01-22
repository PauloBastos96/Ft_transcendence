#!/bin/bash

# Create index pattern for nginx logs
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
      -H "kbn-xsrf: true" \
      -H "Content-Type: application/json" \
      -u "elastic:${ELASTIC_PASSWORD}" \
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
      -u "elastic:${ELASTIC_PASSWORD}" \
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
      -u "elastic:${ELASTIC_PASSWORD}" \
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
      -u "elastic:${ELASTIC_PASSWORD}" \
      -d '{
        "attributes": {
          "title": "elk-*",
          "timeFieldName": "@timestamp"
        }
      }'