cd front-end
rm -rf .next 
rm -rf out
npx next build
rm -rf ../cardcollector/src/main/resources/static/*
cp -r out/* ../cardcollector/src/main/resources/static/
cd ..
cd cardcollector
./gradlew processResources