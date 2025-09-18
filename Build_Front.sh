cd front-end
npx next build
rm -rf ../cardcollector/src/main/resources/static/*
cp -r out/* ../cardcollector/src/main/resources/static/