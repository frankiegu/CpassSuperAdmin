#!/bin/bash
npm run build
rsync -avz dist/* train@cpass.haomo-tech.com:/var/www/html/cpass/
