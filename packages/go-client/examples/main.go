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
        Timeout: 30 * time.Second,
    })

    // Set authentication
    client.SetAuth("did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR", "")

    ctx := context.Background()

    // Get network status
    fmt.Println("🌐 Getting network status...")
    status, err := client.GetStatus(ctx)
    if err != nil {
        log.Printf("Failed to get status: %v", err)
    } else {
        fmt.Printf("Connected Peers: %d\n", status.Peers)
        fmt.Printf("Network Health: %d%%\n", status.Health)
        fmt.Printf("Total Storage: %s\n", status.TotalStorage)
        fmt.Printf("Active Users: %d\n", status.ActiveUsers)
    }

    // Create a space
    fmt.Println("\n📦 Creating space...")
    space, err := client.CreateSpace(ctx, "My Go Space", "Created from Go client")
    if err != nil {
        log.Printf("Failed to create space: %v", err)
    } else {
        fmt.Printf("Space created: %s (ID: %s)\n", space.Name, space.ID)
        fmt.Printf("Space DID: %s\n", space.DID)
    }

    // List spaces
    fmt.Println("\n📋 Listing spaces...")
    spaces, err := client.ListSpaces(ctx)
    if err != nil {
        log.Printf("Failed to list spaces: %v", err)
    } else {
        for i, s := range spaces {
            fmt.Printf("%d. %s (Files: %d, Size: %d bytes)\n", i+1, s.Name, s.FileCount, s.TotalSize)
        }
    }

    // Create identity
    fmt.Println("\n🆔 Creating identity...")
    identity, err := client.CreateIdentity(ctx, "key")
    if err != nil {
        log.Printf("Failed to create identity: %v", err)
    } else {
        fmt.Printf("Identity created: %s\n", identity.ID)
        fmt.Printf("Public Key: %s\n", identity.PublicKey)
    }

    // Upload a file (if exists)
    fmt.Println("\n📁 Uploading file...")
    result, err := client.UploadFile(ctx, "example.txt", map[string]interface{}{
        "title":       "Example File",
        "description": "Uploaded from Go client",
        "tags":        []string{"example", "go", "nexaflow"},
    })
    if err != nil {
        log.Printf("Failed to upload file: %v", err)
    } else {
        fmt.Printf("File uploaded successfully!\n")
        fmt.Printf("CID: %s\n", result.CID)
        fmt.Printf("URL: %s\n", result.URL)
        fmt.Printf("Size: %d bytes\n", result.Size)
    }
}
