# NexaFlow JavaScript Client SDK

## Installation

### NPM
\`\`\`bash
npm install @nexaflow/client
\`\`\`

### CDN (Browser)
\`\`\`html
<script src="https://unpkg.com/@nexaflow/client@latest/dist/index.umd.js"></script>
\`\`\`

### ES Modules
\`\`\`javascript
import { NexaFlowClient } from '@nexaflow/client';
\`\`\`

## Quick Start

### Basic Setup
\`\`\`javascript
import { NexaFlowClient } from '@nexaflow/client';

// Create client
const client = new NexaFlowClient({
  apiUrl: 'https://api.nexaflow.com', // optional
  did: 'did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR'
});

// Or set auth later
client.setAuth('did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR');
\`\`\`

### File Upload
\`\`\`javascript
// Upload from file input
const fileInput = document.getElementById('file-input');
const file = fileInput.files[0];

const result = await client.upload(file, {
  title: 'My Document',
  description: 'Important document',
  tags: ['work', 'important'],
  space: 'my-space-id'
});

console.log('Uploaded:', result.cid);
console.log('URL:', result.url);
\`\`\`

### Space Management
\`\`\`javascript
// Create a space
const space = await client.createSpace('My Project', 'Project files and assets');
console.log('Space created:', space.id);

// List spaces
const spaces = await client.listSpaces();
spaces.forEach(space => {
  console.log(`${space.name}: ${space.fileCount} files`);
});
\`\`\`

### Identity Management
\`\`\`javascript
// Create new identity
const identity = await client.createIdentity('key');
console.log('New DID:', identity.id);
console.log('Public Key:', identity.publicKey);

// Use the new identity
client.setAuth(identity.id, identity.privateKey);
\`\`\`

## API Reference

### Constructor
\`\`\`javascript
new NexaFlowClient(config)
\`\`\`

**Parameters:**
- `config.apiUrl` (string, optional) - API endpoint URL
- `config.did` (string, optional) - Your DID for authentication
- `config.privateKey` (string, optional) - Your private key

### Methods

#### `setAuth(did, privateKey)`
Set authentication credentials.

#### `upload(file, options)`
Upload a file to IPFS.

**Parameters:**
- `file` (File|Blob) - File to upload
- `options.title` (string, optional) - File title
- `options.description` (string, optional) - File description
- `options.tags` (string[], optional) - File tags
- `options.space` (string, optional) - Target space ID

**Returns:** `Promise<UploadResult>`

#### `createSpace(name, description)`
Create a new space.

**Returns:** `Promise<Space>`

#### `listSpaces()`
List all spaces.

**Returns:** `Promise<Space[]>`

#### `createIdentity(method)`
Create a new decentralized identity.

**Parameters:**
- `method` (string, optional) - DID method (default: 'key')

**Returns:** `Promise<Identity>`

#### `getStatus()`
Get network status.

**Returns:** `Promise<NetworkStatus>`

## Examples

### React Integration
\`\`\`jsx
import React, { useState } from 'react';
import { NexaFlowClient } from '@nexaflow/client';

const client = new NexaFlowClient({
  did: 'did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR'
});

function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadResult = await client.upload(file, {
        title: file.name,
        tags: ['upload', 'react']
      });
      setResult(uploadResult);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {result && (
        <div>
          <p>Uploaded successfully!</p>
          <p>CID: {result.cid}</p>
          <p>URL: <a href={result.url}>{result.url}</a></p>
        </div>
      )}
    </div>
  );
}
\`\`\`

### Node.js Integration
\`\`\`javascript
const { NexaFlowClient } = require('@nexaflow/client');
const fs = require('fs');

const client = new NexaFlowClient({
  did: 'did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR'
});

async function uploadFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const file = new Blob([fileBuffer]);
  
  const result = await client.upload(file, {
    title: path.basename(filePath),
    description: 'Uploaded from Node.js'
  });
  
  console.log('Upload result:', result);
}

uploadFile('./document.pdf');
\`\`\`

### Vue.js Integration
\`\`\`vue
<template>
  <div>
    <input type="file" @change="handleUpload" :disabled="uploading" />
    <div v-if="uploading">Uploading...</div>
    <div v-if="result">
      <h3>Upload Successful!</h3>
      <p>CID: {{ result.cid }}</p>
      <p>URL: <a :href="result.url">{{ result.url }}</a></p>
    </div>
  </div>
</template>

<script>
import { NexaFlowClient } from '@nexaflow/client';

export default {
  data() {
    return {
      client: new NexaFlowClient({
        did: 'did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR'
      }),
      uploading: false,
      result: null
    };
  },
  methods: {
    async handleUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;
      try {
        this.result = await this.client.upload(file, {
          title: file.name,
          tags: ['vue', 'upload']
        });
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>
\`\`\`

## TypeScript Support

The SDK includes full TypeScript definitions:

\`\`\`typescript
import { NexaFlowClient, UploadResult, Space, Identity } from '@nexaflow/client';

const client = new NexaFlowClient({
  did: 'did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR'
});

// Type-safe operations
const result: UploadResult = await client.upload(file);
const spaces: Space[] = await client.listSpaces();
const identity: Identity = await client.createIdentity();
