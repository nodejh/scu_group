#!/bin/bash
say "start"
echo "start deploy..."
# 编译JS
cd client
# npm run build
cd ../
# 复制 server 到 serverPro
cp -r -f server/bin serverPro/
cp -r -f server/config serverPro/
cp -r -f server/crawler serverPro/
cp -r -f server/helpers serverPro/
cp -r -f server/middlewares serverPro/
cp -r -f server/models serverPro/
cp -r -f server/package.json serverPro/
cp -r -f server/public serverPro/
cp -r -f server/routes serverPro/
cp -r -f server/views serverPro/
cp -r -f server/app.js serverPro/
# 复制编译后的静态文件到 serverPro
# cp -rv client/build/static/ serverPro/public/static/
# 复制 html 到 serverPro 的模板目录
rm -fv serverPro/views/index.ejs
cp -v client/build/index.html serverPro/views/index.ejs
# 安装包
# npm i
# npm shrinkwrap
# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git add --all
git commit -m "$msg"
git push
cd serverPro
echo "done!"
say "done"
# DEBUG=* npm start
