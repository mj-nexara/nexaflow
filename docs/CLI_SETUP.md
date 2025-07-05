# NexaFlow CLI Setup Guide

## Installation

### NPM Installation (Recommended)
\`\`\`bash
# Install globally
npm install -g @nexaflow/cli

# Or install locally
npm install @nexaflow/cli
\`\`\`

### Alternative Installation Methods
\`\`\`bash
# Using Yarn
yarn global add @nexaflow/cli

# Using pnpm
pnpm add -g @nexaflow/cli

# Direct from GitHub
npm install -g https://github.com/mj-nexara/nexaflow/packages/cli
\`\`\`

## Quick Start

### 1. Login to NexaFlow
\`\`\`bash
# Login with your DID
nexaflow login

# Or specify DID directly
nexaflow login --did "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR"
\`\`\`

### 2. Create Your First Space
\`\`\`bash
# Interactive space creation
nexaflow space create

# Or specify details directly
nexaflow space create --name "My Project" --description "Project files"
\`\`\`

### 3. Upload Files
\`\`\`bash
# Upload single file
nexaflow upload document.pdf

# Upload multiple files
nexaflow upload *.jpg *.png

# Upload with metadata
nexaflow upload file.txt --title "Important Document" --tags "work,important"
\`\`\`

### 4. Manage Your Content
\`\`\`bash
# List all spaces
nexaflow space list

# Switch to a space
nexaflow space use space_id_here

# Check network status
nexaflow status
\`\`\`

## Available Commands

### Authentication
- `nexaflow login` - Login to NexaFlow
- `nexaflow logout` - Logout from NexaFlow

### Space Management
- `nexaflow space create` - Create a new space
- `nexaflow space list` - List all spaces
- `nexaflow space use <space-id>` - Switch to a space
- `nexaflow space info` - Show current space info

### File Operations
- `nexaflow upload <files...>` - Upload files to IPFS
- `nexaflow download <cid>` - Download file by CID
- `nexaflow list` - List files in current space

### Identity Management
- `nexaflow identity create` - Create a new DID
- `nexaflow identity list` - List your identities
- `nexaflow identity verify <did>` - Verify a DID

### Utilities
- `nexaflow status` - Show network status
- `nexaflow version` - Show version info
- `nexaflow help` - Show help information

## Configuration

### Config File Location
- **Linux/macOS**: `~/.nexaflow/config.json`
- **Windows**: `%USERPROFILE%\.nexaflow\config.json`

### Environment Variables
\`\`\`bash
export NEXAFLOW_API_URL="https://api.nexaflow.com"
export NEXAFLOW_DID="your-did-here"
export NEXAFLOW_PRIVATE_KEY="your-private-key"
\`\`\`

## Examples

### Basic Workflow
\`\`\`bash
# 1. Login
nexaflow login --did "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR"

# 2. Create space
nexaflow space create --name "Website Assets"

# 3. Upload files
nexaflow upload images/*.jpg --tags "website,images"

# 4. Check status
nexaflow status
\`\`\`

### Advanced Usage
\`\`\`bash
# Upload with custom metadata
nexaflow upload document.pdf \
  --title "Project Proposal" \
  --description "Q1 2024 project proposal document" \
  --tags "proposal,2024,important"

# Create identity and use it
nexaflow identity create --method key
nexaflow login --did "newly-created-did"
\`\`\`

## Troubleshooting

### Common Issues

1. **Command not found**
   \`\`\`bash
   # Make sure CLI is installed globally
   npm list -g @nexaflow/cli
   
   # Or use npx
   npx @nexaflow/cli status
   \`\`\`

2. **Authentication errors**
   \`\`\`bash
   # Check if logged in
   nexaflow status
   
   # Re-login if needed
   nexaflow logout
   nexaflow login
   \`\`\`

3. **Network issues**
   \`\`\`bash
   # Check network status
   nexaflow status
   
   # Use custom API URL
   nexaflow --api-url "https://custom-api.nexaflow.com" status
   \`\`\`

### Getting Help
- Run `nexaflow help` for command help
- Visit [docs.nexaflow.com](https://docs.nexaflow.com)
- Report issues: [GitHub Issues](https://github.com/mj-nexara/nexaflow/issues)
