#!/bin/sh

NODE_USER=mljia pm2 start  bin/www -i 2 -o '/data/logs/mljia/o2o_node/web-out.log' -e '/data/logs/mljia/o2o_node/web-err.log'