#!/bin/bash

echo "🚀 Building Go Hello World application with multi-stage Docker builds"
echo

# Build version with Alpine (non-distroless)
echo "📦 Building Alpine version (non-distroless)..."
docker build --target runtime-alpine -t hello-world:alpine .
echo "✅ Alpine version built successfully!"
echo

# Build version with Distroless
echo "📦 Building Distroless version..."
docker build --target runtime-distroless -t hello-world:distroless .
echo "✅ Distroless version built successfully!"
echo

# Show image sizes
echo "📊 Comparing image sizes:"
docker images | grep hello-world

echo
echo "🎯 To run the applications:"
echo "  Alpine version:     docker run --rm hello-world:alpine"
echo "  Distroless version: docker run --rm hello-world:distroless"
