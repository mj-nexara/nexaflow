# 🚀 NexaFlow Complete Setup Instructions

## Step 1: Download and Run Setup Script

### Option A: Direct Download and Run
\`\`\`bash
# Download the setup script
curl -O https://raw.githubusercontent.com/mj-nexara/nexaflow/main/setup-nexaflow.sh

# Make it executable
chmod +x setup-nexaflow.sh

# Run the setup
./setup-nexaflow.sh
\`\`\`

### Option B: One-line Installation
\`\`\`bash
# Download and run in one command
curl -sSL https://raw.githubusercontent.com/mj-nexara/nexaflow/main/setup-nexaflow.sh | bash
\`\`\`

### Option C: Manual Setup
\`\`\`bash
# Create the setup script manually
cat > setup-nexaflow.sh << 'EOF'
#!/bin/bash
echo "🚀 Setting up NexaFlow Complete Ecosystem..."
# ... (copy the entire script content from above)
EOF

chmod +x setup-nexaflow.sh
./setup-nexaflow.sh
\`\`\`

## Step 2: Navigate to Project Directory
\`\`\`bash
cd nexaflow-ecosystem
\`\`\`

## Step 3: Install Packages
\`\`\`bash
# Run the package installation script
./scripts/install-packages.sh

# Or install manually:
# Install CLI globally
cd packages/cli && npm install && npm link && cd ../..

# Install JS Client
cd packages/js-client && npm install && npm link && cd ../..
\`\`\`

## Step 4: Test Installation
\`\`\`bash
# Test CLI
nexaflow --version
nexaflow help

# Test CLI commands
nexaflow login --did "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR"
nexaflow status
nexaflow space create --name "Test Space"
\`\`\`

## Step 5: Use the CLI
\`\`\`bash
# Basic workflow
nexaflow login
nexaflow space create --name "My Project"
nexaflow upload README.md --title "Project Documentation"
nexaflow space list
\`\`\`

## Step 6: Use JavaScript SDK
\`\`\`bash
# In your project
npm install ./packages/js-client

# Or link the local package
npm link @nexaflow/client
\`\`\`

\`\`\`javascript
// In your JavaScript code
import { NexaFlowClient } from '@nexaflow/client';

const client = new NexaFlowClient({
  did: 'did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR'
});

// Upload file
const result = await client.upload(file, {
  title: 'My Document',
  tags: ['important']
});
\`\`\`

## Step 7: Use Go SDK
\`\`\`bash
# In your Go project
go mod init my-nexaflow-app
go get ./packages/go-client
\`\`\`

\`\`\`go
// In your Go code
package main

import (
    "context"
    nexaflow "./packages/go-client"
)

func main() {
    client := nexaflow.NewClient("https://api.nexaflow.com", 
        "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR")
    
    status, err := client.GetStatus(context.Background())
    if err != nil {
        panic(err)
    }
    
    fmt.Printf("Network Health: %d%%\n", status.Health)
}
\`\`\`

## Troubleshooting

### CLI Not Found
\`\`\`bash
# Check if Node.js is installed
node --version
npm --version

# Reinstall CLI
cd packages/cli
npm install
npm link
\`\`\`

### Permission Issues
\`\`\`bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
\`\`\`

### File Upload Not Working
The upload functionality has been fixed! The issue was:
1. **File input not properly connected** - Fixed with `useRef` and proper event handlers
2. **Click handler missing** - Added `handleFileInputClick` function
3. **Visual feedback improved** - Added hover effects and better UI

### Network Issues
\`\`\`bash
# Check network status
nexaflow status

# Use custom API URL
nexaflow --api-url "https://custom-api.nexaflow.com" status
\`\`\`

## Project Structure After Setup
\`\`\`
nexaflow-ecosystem/
├── packages/
│   ├── cli/                 # NexaFlow CLI
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   ├── js-client/          # JavaScript SDK
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   └── go-client/          # Go SDK
│       ├── client.go
│       └── go.mod
├── scripts/
│   ├── setup-complete.sh
│   └── install-packages.sh
└── docs/
    ├── CLI_SETUP.md
    ├── JAVASCRIPT_CLIENT.md
    └── GO_CLIENT.md
\`\`\`

## Next Steps
1. ✅ Setup complete
2. ✅ CLI installed and working
3. ✅ Upload functionality fixed
4. 🚀 Start building with NexaFlow!

## Support
- 📧 Email: mjahmad.25.10.2003@gmail.com
- 🌐 Platform: https://mjnexaflow.vercel.app
- 📚 Docs: https://docs.nexaflow.com
- 🐛 Issues: https://github.com/mj-nexara/nexaflow/issues
