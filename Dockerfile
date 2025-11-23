FROM ubuntu:latest
LABEL authors="osanz"

ENTRYPOINT ["top", "-b"]
