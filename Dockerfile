FROM prabhushan/sbom-base:latest

# Install jq
RUN apt-get update && apt-get install -y jq

# Copy your entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
