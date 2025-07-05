import type { NexaFlowClient, SpaceData } from "./client"
import { AuthManager } from "./auth"

export class SpaceManager {
  constructor(
    private client: NexaFlowClient,
    private auth: AuthManager = new AuthManager(),
  ) {}

  async create(name: string, description?: string): Promise<SpaceData> {
    const authData = this.auth.getAuthData()
    if (!authData) {
      throw new Error("Not authenticated. Please login first.")
    }

    this.client.setAuth(authData.did, authData.privateKey)
    return await this.client.createSpace(name, description)
  }

  async list(): Promise<SpaceData[]> {
    const authData = this.auth.getAuthData()
    if (!authData) {
      throw new Error("Not authenticated. Please login first.")
    }

    this.client.setAuth(authData.did, authData.privateKey)
    return await this.client.listSpaces()
  }

  async use(spaceId: string): Promise<void> {
    // Implementation for switching spaces
    // This would typically update a config file with the current space
    console.log(`Switched to space: ${spaceId}`)
  }
}
