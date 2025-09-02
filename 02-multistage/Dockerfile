# Stage 1: Build stage
FROM golang:1.21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum* ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o hello-world .

FROM ubuntu:latest AS runtime-ubuntu

# Install ca-certificates for HTTPS requests if needed
RUN apt-get update && apt-get install -y ca-certificates tzdata


RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Switch to non-root user
USER appuser

WORKDIR /app

COPY --from=builder /app/hello-world .


# Run the application
CMD ["./hello-world"]


# Stage 2: Runtime with non-distroless image (Alpine)
FROM alpine:latest AS runtime-alpine

# Install ca-certificates for HTTPS requests if needed
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/hello-world .

# Change ownership to non-root user
RUN chown appuser:appgroup hello-world

# Switch to non-root user
USER appuser


# Run the application
CMD ["./hello-world"]

# Stage 3: Runtime with distroless image
FROM gcr.io/distroless/static:nonroot AS runtime-distroless

# Set working directory
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/hello-world .

# Expose port (if needed)
EXPOSE 8080

# Run the application
CMD ["./hello-world"]
