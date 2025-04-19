CREATE USER ${POSTGRES_DJANGO_USER} WITH PASSWORD '${POSTGRES_DJANGO_PASSWORD}';
CREATE DATABASE ${POSTGRES_DJANGO_DB} OWNER ${POSTGRES_DJANGO_USER};
GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DJANGO_DB} TO ${POSTGRES_DJANGO_USER};