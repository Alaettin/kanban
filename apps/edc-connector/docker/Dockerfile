# ── Eclipse EDC Connector (iam-mock, in-memory) ─────────────
# Baut den Connector aus den offiziellen Eclipse EDC Samples.
# iam-mock = keine echte Authentifizierung noetig (ideal fuer Dev/Test)
# Verwendet transfer-03-consumer-pull Provider fuer HttpData-PULL Support.
# Erster Build dauert ~5 Min (Gradle + Dependencies), danach gecacht.

# Stage 1: Build
FROM eclipse-temurin:17-jdk AS builder

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /build
RUN git clone --depth 1 --branch main https://github.com/eclipse-edc/Samples.git

WORKDIR /build/Samples
RUN chmod +x gradlew && \
    ./gradlew transfer:transfer-03-consumer-pull:provider-proxy-data-plane:build -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=builder /build/Samples/transfer/transfer-03-consumer-pull/provider-proxy-data-plane/build/libs/connector.jar /app/connector.jar

EXPOSE 8080 8081 8082 8083 8084

ENTRYPOINT ["java", "-Dedc.fs.config=/app/config.properties", "-jar", "connector.jar"]
