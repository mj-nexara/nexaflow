#!/bin/bash

# NexaFlow Complete Setup Script
# This script will set up the entire NexaFlow ecosystem

echo "🚀 Setting up NexaFlow Complete Ecosystem..."

# Create project structure
echo "📁 Creating project structure..."
mkdir -p nexaflow-ecosystem/{packages/{cli,js-client,go-client},scripts,docs}

# Setup CLI Package
echo "📦 Setting up CLI package..."
cd nexaflow-ecosystem/packages/cli

# Initialize package.json for CLI
cat > package.json << 'EOF'
{
  "name": "@nexaflow/cli",
  "version": "1.0.0",
  "description": "NexaFlow CLI - Enterprise Decentralized Content Management",
  "main": "dist/index.js",
  "bin": {
    "nexaflow": "dist/cli.js",
    "nf": "dist/cli.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/cli.ts",
    "start": "node dist/cli.js",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["nexaflow", "ipfs", "did", "web3", "cli"],
  "author": "MJ AHMAD <mjahmad.25.10.2003@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "commander": "^11.0.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.1",
    "inquirer": "^9.2.0",
    "axios": "^1.6.0",
    "form-data": "^4.0.0",
    "fs-extra": "^11.1.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
EOF

# Install CLI dependencies
echo "⬇️ Installing CLI dependencies..."
npm install

# Setup TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Create CLI source directory
mkdir -p src

# Build CLI
echo "🔨 Building CLI..."
npm run build

echo "✅ CLI setup complete!"

# Go back to root
cd ../../..

# Setup JavaScript Client
echo "📦 Setting up JavaScript Client..."
cd packages/js-client

# Initialize package.json for JS Client
cat > package.json << 'EOF'
{
  "name": "@nexaflow/client",
  "version": "1.0.0",
  "description": "NexaFlow JavaScript Client SDK",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["nexaflow", "ipfs", "did", "web3", "javascript", "sdk"],
  "author": "MJ AHMAD <mjahmad.25.10.2003@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@rollup/plugin-typescript": "^11.0.0",
    "rollup": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

npm install
echo "✅ JavaScript Client setup complete!"

# Go back to root
cd ../../..

# Setup Go Client
echo "📦 Setting up Go Client..."
cd packages/go-client

# Initialize Go module
go mod init github.com/nexaflow/go-client

# Create basic Go file
cat > client.go << 'EOF'
package nexaflow

import (
    "context"
    "fmt"
)

type Client struct {
    APIUrl string
    DID    string
}

func NewClient(apiUrl, did string) *Client {
    return &Client{
        APIUrl: apiUrl,
        DID:    did,
    }
}

func (c *Client) GetStatus(ctx context.Context) error {
    fmt.Println("NexaFlow Go Client initialized successfully!")
    return nil
}
EOF

echo "✅ Go Client setup complete!"

# Go back to root
cd ../../..

# Create main setup script
echo "📝 Creating main setup script..."
cat > scripts/setup-complete.sh << 'EOF'
#!/bin/bash

echo "🎉 NexaFlow Ecosystem Setup Complete!"
echo ""
echo "📦 Available Packages:"
echo "   1. CLI: @nexaflow/cli"
echo "   2. JavaScript SDK: @nexaflow/client" 
echo "   3. Go SDK: github.com/nexaflow/go-client"
echo ""
echo "🚀 Quick Start Commands:"
echo "   # Install CLI globally"
echo "   npm install -g ./packages/cli"
echo ""
echo "   # Use CLI"
echo "   nexaflow login"
echo "   nexaflow space create"
echo "   nexaflow upload file.txt"
echo ""
echo "   # Use JavaScript SDK"
echo "   npm install ./packages/js-client"
echo ""
echo "   # Use Go SDK"
echo "   go get ./packages/go-client"
echo ""
echo "📚 Documentation available in docs/ folder"
echo "🌐 Platform: https://mjnexaflow.vercel.app"
EOF

chmod +x scripts/setup-complete.sh

# Create package installation script
cat > scripts/install-packages.sh << 'EOF'
#!/bin/bash

echo "📦 Installing NexaFlow Packages..."

# Install CLI globally
echo "🔧 Installing CLI globally..."
cd packages/cli
npm link
cd ../..

# Test CLI installation
echo "🧪 Testing CLI installation..."
if command -v nexaflow &> /dev/null; then
    echo "✅ CLI installed successfully!"
    nexaflow --version
else
    echo "❌ CLI installation failed"
fi

# Install JS Client locally for testing
echo "🔧 Installing JS Client..."
cd packages/js-client
npm link
cd ../..

echo "✅ Package installation complete!"
EOF

chmod +x scripts/install-packages.sh

# Run the complete setup
echo "🏃‍♂️ Running complete setup..."
./scripts/setup-complete.sh

echo ""
echo "🎊 NexaFlow Ecosystem Setup Complete!"
echo "📁 Project structure created in: nexaflow-ecosystem/"
echo ""
echo "🔧 Next Steps:"
echo "1. cd nexaflow-ecosystem"
echo "2. ./scripts/install-packages.sh"
echo "3. nexaflow login"
echo ""
