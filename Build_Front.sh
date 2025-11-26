cd front-end
sudo rm -rf .next out
npx next build
sudo rm -rf ../cardcollector/src/main/resources/static/*
sudo cp -r out/* ../cardcollector/src/main/resources/static/
cd ..
cd cardcollector
./gradlew processResources