#!/bin/bash

curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
      -H "kbn-xsrf: true" \
      -H "Content-Type: application/json" \
      -u "elastic:${ELASTIC_PASSWORD}" \
      -d '{
        "attributes": {
          "title": "logstash-*",
          "timeFieldName": "@timestamp"
        }
      }'