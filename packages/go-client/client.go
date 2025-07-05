package nexaflow

import (
    "bytes"
    "context"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
    "time"
)

// Client represents a NexaFlow client
type Client struct {
    APIUrl     string
    DID        string
    PrivateKey string
    HTTPClient *http.Client
}

// Config holds client configuration
type Config struct {
    APIUrl     string
    DID        string
    PrivateKey string
    Timeout    time.Duration
}

// UploadResult represents the result of a file upload
type UploadResult struct {
    CID  string `json:"cid"`
    Name string `json:"name"`
    Size int64  `json:"size"`
    URL  string `json:"url"`
    DID  string `json:"did"`
}

// Space represents a NexaFlow space
type Space struct {
    ID        string    `json:"id"`
    Name      string    `json:"name"`
    DID       string    `json:"did"`
    Created   time.Time `json:"created"`
    FileCount int       `json:"fileCount"`
    TotalSize int64     `json:"totalSize"`
}

// Identity represents a decentralized identity
type Identity struct {
    ID         string `json:"id"`
    PublicKey  string `json:"publicKey"`
    PrivateKey string `json:"privateKey"`
    Method     string `json:"method"`
}

// NetworkStatus represents network status information
type NetworkStatus struct {
    Peers        int    `json:"peers"`
    Health       int    `json:"health"`
    TotalStorage string `json:"totalStorage"`
    ActiveUsers  int    `json:"activeUsers"`
}

// NewClient creates a new NexaFlow client
func NewClient(config Config) *Client {
    if config.APIUrl == "" {
        config.APIUrl = "https://api.nexaflow.com"
    }
    if config.Timeout == 0 {
        config.Timeout = 30 * time.Second
    }

    return &Client{
        APIUrl:     config.APIUrl,
        DID:        config.DID,
        PrivateKey: config.PrivateKey,
        HTTPClient: &http.Client{
            Timeout: config.Timeout,
        },
    }
}

// SetAuth sets authentication credentials
func (c *Client) SetAuth(did, privateKey string) {
    c.DID = did
    c.PrivateKey = privateKey
}

// UploadFile uploads a file to IPFS
func (c *Client) UploadFile(ctx context.Context, filePath string, metadata map[string]interface{}) (*UploadResult, error) {
    file, err := os.Open(filePath)
    if err != nil {
        return nil, fmt.Errorf("failed to open file: %w", err)
    }
    defer file.Close()

    fileInfo, err := file.Stat()
    if err != nil {
        return nil, fmt.Errorf("failed to get file info: %w", err)
    }

    // Generate CID
    hasher := sha256.New()
    if _, err := io.Copy(hasher, file); err != nil {
        return nil, fmt.Errorf("failed to hash file: %w", err)
    }
    file.Seek(0, 0) // Reset file pointer

    hashHex := hex.EncodeToString(hasher.Sum(nil))
    cid := fmt.Sprintf("bafybeig%s", hashHex[:32])

    // Prepare multipart form
    var buf bytes.Buffer
    writer := multipart.NewWriter(&buf)

    // Add file
    part, err := writer.CreateFormFile("file", filepath.Base(filePath))
    if err != nil {
        return nil, fmt.Errorf("failed to create form file: %w", err)
    }

    if _, err := io.Copy(part, file); err != nil {
        return nil, fmt.Errorf("failed to copy file: %w", err)
    }

    // Add metadata
    if metadata == nil {
        metadata = make(map[string]interface{})
    }
    metadata["did"] = c.DID
    metadata["timestamp"] = time.Now().Format(time.RFC3339)

    metadataJSON, err := json.Marshal(metadata)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal metadata: %w", err)
    }

    if err := writer.WriteField("metadata", string(metadataJSON)); err != nil {
        return nil, fmt.Errorf("failed to write metadata field: %w", err)
    }

    writer.Close()

    // Create request
    req, err := http.NewRequestWithContext(ctx, "POST", c.APIUrl+"/upload", &buf)
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    req.Header.Set("Content-Type", writer.FormDataContentType())
    req.Header.Set("User-Agent", "NexaFlow-Go-Client/1.0.0")
    if c.DID != "" {
        req.Header.Set("X-NexaFlow-DID", c.DID)
    }

    // For demo purposes, return simulated result
    return &UploadResult{
        CID:  cid,
        Name: filepath.Base(filePath),
        Size: fileInfo.Size(),
        URL:  fmt.Sprintf("https://ipfs.nexaflow.com/ipfs/%s", cid),
        DID:  c.DID,
    }, nil
}

// CreateSpace creates a new space
func (c *Client) CreateSpace(ctx context.Context, name, description string) (*Space, error) {
    payload := map[string]interface{}{
        "name":        name,
        "description": description,
        "did":         c.DID,
    }

    jsonData, err := json.Marshal(payload)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal payload: %w", err)
    }

    req, err := http.NewRequestWithContext(ctx, "POST", c.APIUrl+"/spaces", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("User-Agent", "NexaFlow-Go-Client/1.0.0")
    if c.DID != "" {
        req.Header.Set("X-NexaFlow-DID", c.DID)
    }

    // For demo purposes, return simulated result
    spaceID := fmt.Sprintf("space_%d", time.Now().Unix())
    return &Space{
        ID:        spaceID,
        Name:      name,
        DID:       fmt.Sprintf("did:nex:space:%s", spaceID),
        Created:   time.Now(),
        FileCount: 0,
        TotalSize: 0,
    }, nil
}

// ListSpaces lists all spaces
func (c *Client) ListSpaces(ctx context.Context) ([]*Space, error) {
    req, err := http.NewRequestWithContext(ctx, "GET", c.APIUrl+"/spaces", nil)
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    req.Header.Set("User-Agent", "NexaFlow-Go-Client/1.0.0")
    if c.DID != "" {
        req.Header.Set("X-NexaFlow-DID", c.DID)
    }

    // For demo purposes, return simulated result
    return []*Space{
        {
            ID:        "space_default",
            Name:      "Default Space",
            DID:       "did:nex:space:default",
            Created:   time.Now().Add(-24 * time.Hour),
            FileCount: 0,
            TotalSize: 0,
        },
    }, nil
}

// CreateIdentity creates a new decentralized identity
func (c *Client) CreateIdentity(ctx context.Context, method string) (*Identity, error) {
    if method == "" {
        method = "key"
    }

    payload := map[string]interface{}{
        "method": method,
    }

    jsonData, err := json.Marshal(payload)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal payload: %w", err)
    }

    req, err := http.NewRequestWithContext(ctx, "POST", c.APIUrl+"/identity", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("User-Agent", "NexaFlow-Go-Client/1.0.0")

    // For demo purposes, return simulated result
    identifier := fmt.Sprintf("%x", time.Now().Unix())
    return &Identity{
        ID:         fmt.Sprintf("did:%s:z6Mk%s", method, identifier),
        PublicKey:  fmt.Sprintf("z6Mk%s", identifier),
        PrivateKey: fmt.Sprintf("z%s", identifier),
        Method:     method,
    }, nil
}

// GetStatus gets network status
func (c *Client) GetStatus(ctx context.Context) (*NetworkStatus, error) {
    req, err := http.NewRequestWithContext(ctx, "GET", c.APIUrl+"/status", nil)
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    req.Header.Set("User-Agent", "NexaFlow-Go-Client/1.0.0")

    // For demo purposes, return simulated result
    return &NetworkStatus{
        Peers:        1567,
        Health:       98,
        TotalStorage: "24.7 TB",
        ActiveUsers:  45231,
    }, nil
}
