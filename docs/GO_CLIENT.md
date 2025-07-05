# NexaFlow Go Client SDK

## Installation

\`\`\`bash
go get github.com/nexaflow/go-client
\`\`\`

## Quick Start

### Basic Setup
\`\`\`go
package main

import (
    "context"
    "fmt"
    "log"
    "time"

    nexaflow "github.com/nexaflow/go-client"
)

func main() {
    // Create client
    client := nexaflow.NewClient(nexaflow.Config{
        APIUrl:  "https://api.nexaflow.com",
        DID:     "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR",
        Timeout: 30 * time.Second,
    })

    ctx := context.Background()

    // Get network status
    status, err := client.GetStatus(ctx)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Network Health: %d%%\n", status.Health)
}
\`\`\`

### File Upload
\`\`\`go
package main

import (
    "context"
    "fmt"
    "log"

    nexaflow "github.com/nexaflow/go-client"
)

func main() {
    client := nexaflow.NewClient(nexaflow.Config{
        DID: "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR",
    })

    ctx := context.Background()

    // Upload a file
    result, err := client.UploadFile(ctx, "document.pdf", map[string]interface{}{
        "title":       "Important Document",
        "description": "Quarterly report",
        "tags":        []string{"report", "q1", "2024"},
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("File uploaded successfully!\n")
    fmt.Printf("CID: %s\n", result.CID)
    fmt.Printf("URL: %s\n", result.URL)
    fmt.Printf("Size: %d bytes\n", result.Size)
}
\`\`\`

### Space Management
\`\`\`go
// Create a space
space, err := client.CreateSpace(ctx, "My Project", "Project files and documentation")
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Space created: %s (ID: %s)\n", space.Name, space.ID)

// List all spaces
spaces, err := client.ListSpaces(ctx)
if err != nil {
    log.Fatal(err)
}

for i, space := range spaces {
    fmt.Printf("%d. %s - %d files\n", i+1, space.Name, space.FileCount)
}
\`\`\`

### Identity Management
\`\`\`go
// Create new identity
identity, err := client.CreateIdentity(ctx, "key")
if err != nil {
    log.Fatal(err)
}

fmt.Printf("New identity created:\n")
fmt.Printf("DID: %s\n", identity.ID)
fmt.Printf("Public Key: %s\n", identity.PublicKey)
fmt.Printf("Method: %s\n", identity.Method)

// Use the new identity
client.SetAuth(identity.ID, identity.PrivateKey)
\`\`\`

## API Reference

### Types

#### Config
\`\`\`go
type Config struct {
    APIUrl     string        // API endpoint URL
    DID        string        // Your DID for authentication
    PrivateKey string        // Your private key
    Timeout    time.Duration // Request timeout
}
\`\`\`

#### UploadResult
\`\`\`go
type UploadResult struct {
    CID  string `json:"cid"`  // Content Identifier
    Name string `json:"name"` // File name
    Size int64  `json:"size"` // File size in bytes
    URL  string `json:"url"`  // IPFS URL
    DID  string `json:"did"`  // Uploader's DID
}
\`\`\`

#### Space
\`\`\`go
type Space struct {
    ID        string    `json:"id"`        // Space identifier
    Name      string    `json:"name"`      // Space name
    DID       string    `json:"did"`       // Space DID
    Created   time.Time `json:"created"`   // Creation timestamp
    FileCount int       `json:"fileCount"` // Number of files
    TotalSize int64     `json:"totalSize"` // Total size in bytes
}
\`\`\`

#### Identity
\`\`\`go
type Identity struct {
    ID         string `json:"id"`         // DID identifier
    PublicKey  string `json:"publicKey"`  // Public key
    PrivateKey string `json:"privateKey"` // Private key
    Method     string `json:"method"`     // DID method
}
\`\`\`

### Methods

#### NewClient(config Config) *Client
Creates a new NexaFlow client with the specified configuration.

#### SetAuth(did, privateKey string)
Sets authentication credentials for the client.

#### UploadFile(ctx context.Context, filePath string, metadata map[string]interface{}) (*UploadResult, error)
Uploads a file to IPFS with optional metadata.

#### CreateSpace(ctx context.Context, name, description string) (*Space, error)
Creates a new space for organizing files.

#### ListSpaces(ctx context.Context) ([]*Space, error)
Lists all spaces associated with the authenticated user.

#### CreateIdentity(ctx context.Context, method string) (*Identity, error)
Creates a new decentralized identity.

#### GetStatus(ctx context.Context) (*NetworkStatus, error)
Gets current network status and health information.

## Advanced Examples

### Concurrent File Uploads
\`\`\`go
package main

import (
    "context"
    "fmt"
    "log"
    "sync"

    nexaflow "github.com/nexaflow/go-client"
)

func main() {
    client := nexaflow.NewClient(nexaflow.Config{
        DID: "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR",
    })

    files := []string{"file1.txt", "file2.jpg", "file3.pdf"}
    
    var wg sync.WaitGroup
    results := make(chan *nexaflow.UploadResult, len(files))

    for _, file := range files {
        wg.Add(1)
        go func(filePath string) {
            defer wg.Done()
            
            result, err := client.UploadFile(context.Background(), filePath, nil)
            if err != nil {
                log.Printf("Failed to upload %s: %v", filePath, err)
                return
            }
            
            results <- result
        }(file)
    }

    wg.Wait()
    close(results)

    fmt.Println("Upload results:")
    for result := range results {
        fmt.Printf("- %s: %s\n", result.Name, result.CID)
    }
}
\`\`\`

### Error Handling
\`\`\`go
package main

import (
    "context"
    "errors"
    "fmt"
    "log"

    nexaflow "github.com/nexaflow/go-client"
)

func uploadWithRetry(client *nexaflow.Client, filePath string, maxRetries int) (*nexaflow.UploadResult, error) {
    var lastErr error
    
    for i := 0; i < maxRetries; i++ {
        result, err := client.UploadFile(context.Background(), filePath, nil)
        if err == nil {
            return result, nil
        }
        
        lastErr = err
        fmt.Printf("Upload attempt %d failed: %v\n", i+1, err)
    }
    
    return nil, fmt.Errorf("upload failed after %d attempts: %w", maxRetries, lastErr)
}

func main() {
    client := nexaflow.NewClient(nexaflow.Config{
        DID: "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR",
    })

    result, err := uploadWithRetry(client, "important-file.pdf", 3)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Upload successful: %s\n", result.CID)
}
\`\`\`

### Custom HTTP Client
\`\`\`go
package main

import (
    "crypto/tls"
    "net/http"
    "time"

    nexaflow "github.com/nexaflow/go-client"
)

func main() {
    // Create client with custom HTTP configuration
    client := nexaflow.NewClient(nexaflow.Config{
        DID:     "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR",
        Timeout: 60 * time.Second,
    })

    // Customize HTTP client if needed
    client.HTTPClient = &http.Client{
        Timeout: 60 * time.Second,
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{
                InsecureSkipVerify: false,
            },
        },
    }

    // Use client normally...
}
\`\`\`

## Testing

### Unit Tests
\`\`\`go
package main

import (
    "context"
    "testing"

    nexaflow "github.com/nexaflow/go-client"
)

func TestClientCreation(t *testing.T) {
    client := nexaflow.NewClient(nexaflow.Config{
        APIUrl: "https://test-api.nexaflow.com",
        DID:    "did:key:test",
    })

    if client == nil {
        t.Fatal("Expected client to be created")
    }
}

func TestUploadFile(t *testing.T) {
    client := nexaflow.NewClient(nexaflow.Config{
        DID: "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR",
    })

    // Create a test file
    testFile := "test.txt"
    // ... create test file ...

    result, err := client.UploadFile(context.Background(), testFile, nil)
    if err != nil {
        t.Fatalf("Upload failed: %v", err)
    }

    if result.CID == "" {
        t.Fatal("Expected CID to be set")
    }
}
\`\`\`

## Best Practices

### 1. Context Management
Always use context for cancellation and timeouts:

\`\`\`go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

result, err := client.UploadFile(ctx, "file.txt", nil)
\`\`\`

### 2. Error Handling
Handle errors appropriately:

\`\`\`go
result, err := client.UploadFile(ctx, "file.txt", nil)
if err != nil {
    // Log error and handle gracefully
    log.Printf("Upload failed: %v", err)
    return
}
\`\`\`

### 3. Resource Management
Close resources properly:

\`\`\`go
file, err := os.Open("large-file.bin")
if err != nil {
    return err
}
defer file.Close()
\`\`\`

### 4. Configuration
Use environment variables for configuration:

\`\`\`go
import "os"

client := nexaflow.NewClient(nexaflow.Config{
    APIUrl: os.Getenv("NEXAFLOW_API_URL"),
    DID:    os.Getenv("NEXAFLOW_DID"),
})
