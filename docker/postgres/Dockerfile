# Custom PostgreSQL + PostGIS image
# Extends the official postgis/postgis image to add any project-specific
# init scripts or extensions.

FROM postgis/postgis:16-3.4

# Copy any custom init SQL scripts into the Docker entrypoint directory.
# Files are executed in alphabetical order on first container start.
COPY ./init/ /docker-entrypoint-initdb.d/
