cd front-end
npm install
npm install --save-dev @types/node @types/react @types/react-dom
npx next build
rm -rf ../cardcollector/src/main/resources/static/*
cp -r out/* ../cardcollector/src/main/resources/static/