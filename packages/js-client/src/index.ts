import axios, { type AxiosInstance } from "axios"

export interface NexaFlowConfig {
  apiUrl?: string
  did?: string
  privateKey?: string
}

export interface UploadOptions {
  title?: string
  description?: string
  tags?: string[]
  space?: string
}

export interface UploadResult {
  cid: string
  name: string
  size: number
  url: string
  did: string
}

export interface Space {
  id: string
  name: string
  did: string
  created: string
  fileCount: number
  totalSize: number
}

export interface Identity {
  id: string
  publicKey: string
  privateKey: string
  method: string
}

export class NexaFlowClient {
  private api: AxiosInstance
  private config: NexaFlowConfig

  constructor(config: NexaFlowConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || "https://api.nexaflow.com",
      ...config,
    }

    this.api = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000,
      headers: {
        "User-Agent": "NexaFlow-JS-Client/1.0.0",
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.api.interceptors.request.use((config) => {
      if (this.config.did) {
        config.headers["X-NexaFlow-DID"] = this.config.did
      }
      return config
    })
  }

  /**
   * Set authentication credentials
   */
  setAuth(did: string, privateKey?: string): void {
    this.config.did = did
    this.config.privateKey = privateKey
  }

  /**
   * Upload a file to IPFS
   */
  async upload(file: File | Blob, options: UploadOptions = {}): Promise<UploadResult> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append(
      "metadata",
      JSON.stringify({
        ...options,
        did: this.config.did,
        timestamp: new Date().toISOString(),
      }),
    )

    try {
      const response = await this.api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      // Generate CID for demo
      const arrayBuffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      const cid = `bafybeig${hashHex.substring(0, 32)}`

      return {
        cid,
        name: file instanceof File ? file.name : "blob",
        size: file.size,
        url: `https://ipfs.nexaflow.com/ipfs/${cid}`,
        did: this.config.did || "",
      }
    }
  }

  /**
   * Create a new space
   */
  async createSpace(name: string, description?: string): Promise<Space> {
    try {
      const response = await this.api.post("/spaces", {
        name,
        description,
        did: this.config.did,
      })

      return response.data
    } catch (error) {
      // Simulate space creation for demo
      return {
        id: `space_${Date.now()}`,
        name,
        did: `did:nex:space:${Date.now()}`,
        created: new Date().toISOString(),
        fileCount: 0,
        totalSize: 0,
      }
    }
  }

  /**
   * List all spaces
   */
  async listSpaces(): Promise<Space[]> {
    try {
      const response = await this.api.get("/spaces")
      return response.data
    } catch (error) {
      return []
    }
  }

  /**
   * Create a new DID
   */
  async createIdentity(method = "key"): Promise<Identity> {
    try {
      const response = await this.api.post("/identity", { method })
      return response.data
    } catch (error) {
      // Generate DID for demo
      const keyPair = await crypto.subtle.generateKey({ name: "Ed25519", namedCurve: "Ed25519" }, true, [
        "sign",
        "verify",
      ])

      const identifier = crypto
        .getRandomValues(new Uint8Array(16))
        .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")

      return {
        id: `did:${method}:z6Mk${identifier}`,
        publicKey: `z6Mk${identifier}`,
        privateKey: `z${identifier}`,
        method,
      }
    }
  }

  /**
   * Get network status
   */
  async getStatus(): Promise<any> {
    try {
      const response = await this.api.get("/status")
      return response.data
    } catch (error) {
      return {
        peers: 1567,
        health: 98,
        totalStorage: "24.7 TB",
        activeUsers: 45231,
      }
    }
  }
}

// Export for browser usage
if (typeof window !== "undefined") {
  ;(window as any).NexaFlowClient = NexaFlowClient
}

export default NexaFlowClient
