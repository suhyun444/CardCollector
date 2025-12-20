FROM eclipse-temurin:21-jdk
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY ./cardcollector/build/libs/cardcollector-0.0.1-SNAPSHOT.jar cardcollector.jar
ENTRYPOINT exec java $JAVA_OPTS -jar cardcollector.jar
EXPOSE 8080