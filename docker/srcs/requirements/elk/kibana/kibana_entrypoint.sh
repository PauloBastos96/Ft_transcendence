#!/bin/bash

# Read the Kibana password from the secret file
export ELASTICSEARCH_PASSWORD=$(cat $ELASTICSEARCH_PASSWORD_FILE)

# # Set correct permissions for the certs_kibana volume
# chown -R kibana:kibana /usr/share/kibana/certs
# chmod -R 755 /usr/share/kibana/certs

# # Generate self-signed certificates
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /usr/share/kibana/certs/kibana.key -out /usr/share/kibana/certs/kibana-selfsigned.crt -subj "/C=PT/ST=Lx/L=Lx/O=42/OU=42/CN=localhost/UID=anda-cun"

# Update Kibana configuration to use the generated certificates
echo -e "\nserver.ssl.enabled: true" >> config/kibana.yml
echo -e "\nserver.ssl.certificate: /usr/share/kibana/config/certs/kibana/kibana.crt" >> config/kibana.yml
echo -e "\nserver.ssl.key: /usr/share/kibana/config/certs/kibana/kibana.key" >> config/kibana.yml

# Set the encryption keys in the Kibana configuration
echo -e "\nxpack.encryptedSavedObjects.encryptionKey: $(cat $ENCRYPTED_SAVED_OBJECTS_KEY_FILE)" >> config/kibana.yml
echo -e "\nxpack.reporting.encryptionKey: $(cat $REPORTING_KEY_FILE)" >> config/kibana.yml
echo -e "\nxpack.security.encryptionKey: $(cat $SECURITY_KEY_FILE)" >> config/kibana.yml

echo -e "\nserver.publicBaseUrl: https://localhost:5601" >> config/kibana.yml

# Start Kibana
exec /usr/local/bin/kibana-docker