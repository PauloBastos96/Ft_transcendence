#!/bin/bash -e

# Read the Elasticstash password from the secret file
export ELASTIC_PASSWORD=$(cat $ELASTIC_PASSWORD_FILE)

#Import kibana Dashboard
curl --cacert certs/kibana/kibana.crt -X POST https://kibana:5601/api/saved_objects/_import?createNewCopies=true -H "kbn-xsrf: true" -u "${ELASTIC_USER}:$(cat $ELASTIC_PASSWORD_FILE)" --form file=@/usr/share/kibana/config/dashboards/dashboard.ndjson
# curl -k -X POST https://kibana:5601/api/saved_objects/_import?createNewCopies=true -H "kbn-xsrf: true" -u "${ELASTIC_USER}:$(cat $ELASTIC_PASSWORD_FILE)" --form file=@/usr/share/kibana/config/dashboards/dashboard.ndjson

# Map environment variables to entries in logstash.yml.
# Note that this will mutate logstash.yml in place if any such settings are found.
# This may be undesirable, especially if logstash.yml is bind-mounted from the
# host system.
env2yaml /usr/share/logstash/config/logstash.yml

if [[ -n "$LOG_STYLE" ]]; then
  case "$LOG_STYLE" in
    console)
      # This is the default. Nothing to do.
      ;;
    file)
      # Overwrite the default config with the stack config. Do this as a
      # copy, not a move, in case the container is restarted.
      cp -f /usr/share/logstash/config/log4j2.file.properties /usr/share/logstash/config/log4j2.properties
      ;;
    *)
      echo "ERROR: LOG_STYLE set to [$LOG_STYLE]. Expected [console] or [file]" >&2
      exit 1 ;;
  esac
fi

export LS_JAVA_OPTS="-Dls.cgroup.cpuacct.path.override=/ -Dls.cgroup.cpu.path.override=/ $LS_JAVA_OPTS"

if [[ -z $1 ]] || [[ ${1:0:1} == '-' ]] ; then
  exec logstash "$@"
else
  exec "$@"
fi