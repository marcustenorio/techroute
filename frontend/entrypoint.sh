#!/bin/sh

API_URL=${REACT_APP_API_URL:-http://localhost:8000}

echo "window.RUNTIME_CONFIG = {" > /usr/share/nginx/html/runtime-config.js
echo "  API_URL: \"$API_URL\"" >> /usr/share/nginx/html/runtime-config.js
echo "};" >> /usr/share/nginx/html/runtime-config.js

exec "$@"

