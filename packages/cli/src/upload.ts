import type { NexaFlowClient, UploadResult } from "./client"
import { AuthManager } from "./auth"
import path from "path"

export interface UploadOptions {
  space?: string
  title?: string
  description?: string
  tags?: string[]
}

export class UploadManager {
  constructor(
    private client: NexaFlowClient,
    private auth: AuthManager = new AuthManager(),
  ) {}

  async uploadFiles(files: string[], options: UploadOptions = {}): Promise<UploadResult[]> {
    const authData = this.auth.getAuthData()
    if (!authData) {
      throw new Error("Not authenticated. Please login first.")
    }

    this.client.setAuth(authData.did, authData.privateKey)

    const results: UploadResult[] = []

    for (const file of files) {
      const metadata = {
        title: options.title || path.basename(file),
        description: options.description,
        tags: options.tags,
        space: options.space,
      }

      const result = await this.client.uploadFile(file, metadata)
      results.push(result)
    }

    return results
  }
}
