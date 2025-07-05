import fs from "fs-extra"
import path from "path"
import os from "os"

interface AuthData {
  did: string
  privateKey?: string
  timestamp: string
}

export class AuthManager {
  private configDir: string
  private authFile: string

  constructor() {
    this.configDir = path.join(os.homedir(), ".nexaflow")
    this.authFile = path.join(this.configDir, "auth.json")
    this.ensureConfigDir()
  }

  private ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true })
    }
  }

  async login(did: string, privateKey?: string): Promise<void> {
    const authData: AuthData = {
      did,
      privateKey,
      timestamp: new Date().toISOString(),
    }

    await fs.writeJson(this.authFile, authData, { spaces: 2 })
  }

  async logout(): Promise<void> {
    if (fs.existsSync(this.authFile)) {
      await fs.remove(this.authFile)
    }
  }

  isLoggedIn(): boolean {
    return fs.existsSync(this.authFile)
  }

  getCurrentDID(): string | null {
    if (!this.isLoggedIn()) {
      return null
    }

    try {
      const authData: AuthData = fs.readJsonSync(this.authFile)
      return authData.did
    } catch (error) {
      return null
    }
  }

  getAuthData(): AuthData | null {
    if (!this.isLoggedIn()) {
      return null
    }

    try {
      return fs.readJsonSync(this.authFile)
    } catch (error) {
      return null
    }
  }
}
