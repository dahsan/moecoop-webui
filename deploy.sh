#!/bin/sh

git -rf public || exit 0
mkdir public

cp index.html public
cp -r dist public
echo $MOECOOP_DOMAIN > public/CNAME

cd public

git config user.email 'coop.e.moe@gmail.com'
git config user.name 'Travis CI'

git init
git add .
git commit -m "Deploy to Github Pages"
git push -f -q "https://${GH_TOKEN}@github.com/coop-mojo/moecoop-webui.git" master:gh-pages > /dev/null 2>&1
