#!/bin/sh

echo $MOECOOP_DOMAIN > dist/CNAME

cd dist

git init
git config user.name 'Travis CI'
git config user.email 'coop.e.moe@gmail.com'
git add -A
git commit -m "Deploy to Github Pages"
git push -f -q "https://${GH_TOKEN}@github.com/coop-mojo/moecoop-webui.git" master:gh-pages > /dev/null 2>&1
