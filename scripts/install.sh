#!/bin/bash

# NexaFlow Installation Script
# Usage: curl -sSL https://install.nexaflow.com | bash

set -e

echo "🚀 Installing NexaFlow CLI..."

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $ARCH in
    x86_64) ARCH="amd64" ;;
    arm64) ARCH="arm64" ;;
    aarch64) ARCH="arm64" ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    if command -v curl &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "❌ Please install Node.js manually: https://nodejs.org/"
        exit 1
    fi
fi

# Install NexaFlow CLI
echo "📦 Installing NexaFlow CLI..."
npm install -g @nexaflow/cli

# Verify installation
if command -v nexaflow &> /dev/null; then
    echo "✅ NexaFlow CLI installed successfully!"
    echo ""
    echo "🎉 Get started with:"
    echo "   nexaflow login"
    echo "   nexaflow help"
    echo ""
    echo "📚 Documentation: https://docs.nexaflow.com"
    echo "🌐 Platform: https://mjnexaflow.vercel.app"
else
    echo "❌ Installation failed. Please try manual installation:"
    echo "   npm install -g @nexaflow/cli"
fi
