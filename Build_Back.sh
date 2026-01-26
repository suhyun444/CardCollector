cd cardcollector
./gradlew processResources
./gradlew.bat clean build -x test
scp build/libs/cardcollector-0.0.1-SNAPSHOT.jar suhyun444@suhyun-server.local:~/server.jar