#!/bin/bash
cd ..
ng build --prod --aot --env=prod
cp -a dist/. /var/www/html
