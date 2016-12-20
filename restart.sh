#!/bin/bash
git pull https://git.coding.net/nodejh/scu_group.git v0.1
pm2 restart all
pm2 logs
