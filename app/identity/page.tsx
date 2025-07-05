"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Copy,
  QrCode,
  CheckCircle,
  AlertCircle,
  User,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Fingerprint,
  Globe,
} from "lucide-react"
import { Header } from "@/components/header"

interface Identity {
  id: string
  did: string
  publicKey: string
  privateKey: string
  created: string
  lastUsed: string
  status: "active" | "revoked" | "expired"
  method: string
  verifications: number
  reputation: number
}

interface IdentityStats {
  totalIdentities: number
  activeIdentities: number
  verifications: number
  reputation: number
}

export default function IdentityPage() {
  const [identities, setIdentities] = useState<Identity[]>([
    {
      id: "1",
      did: "did:nex:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
      publicKey: "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
      privateKey: "hidden",
      created: "2024-01-15T10:30:00Z",
      lastUsed: "2024-01-20T14:22:00Z",
      status: "active",
      method: "nex",
      verifications: 12,
      reputation: 95,
    },
    {
      id: "2",
      did: "did:nex:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH",
      publicKey: "z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH",
      privateKey: "hidden",
      created: "2024-01-10T09:15:00Z",
      lastUsed: "2024-01-18T16:45:00Z",
      status: "active",
      method: "nex",
      verifications: 8,
      reputation: 87,
    },
  ])

  const [identityStats, setIdentityStats] = useState<IdentityStats>({
    totalIdentities: 2,
    activeIdentities: 2,
    verifications: 20,
    reputation: 91,
  })

  const [showPrivateKeys, setShowPrivateKeys] = useState<{ [key: string]: boolean }>({})
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null)

  // Real-time identity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIdentityStats((prev) => ({
        ...prev,
        verifications: prev.verifications + Math.floor(Math.random() * 2),
        reputation: Math.max(80, Math.min(100, prev.reputation + (Math.random() - 0.5) * 2)),
      }))
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const togglePrivateKeyVisibility = (id: string) => {
    setShowPrivateKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const generateNewIdentity = () => {
    const newIdentity: Identity = {
      id: Date.now().toString(),
      did: `did:nex:z6Mk${Math.random().toString(36).substr(2, 40)}`,
      publicKey: `z6Mk${Math.random().toString(36).substr(2, 40)}`,
      privateKey: `z${Math.random().toString(36).substr(2, 50)}`,
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      status: "active",
      method: "nex",
      verifications: 0,
      reputation: 50,
    }

    setIdentities((prev) => [newIdentity, ...prev])
    setIdentityStats((prev) => ({
      ...prev,
      totalIdentities: prev.totalIdentities + 1,
      activeIdentities: prev.activeIdentities + 1,
    }))
  }

  const revokeIdentity = (id: string) => {
    setIdentities((prev) =>
      prev.map((identity) => (identity.id === id ? { ...identity, status: "revoked" as const } : identity)),
    )
    setIdentityStats((prev) => ({
      ...prev,
      activeIdentities: prev.activeIdentities - 1,
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: Identity["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "revoked":
        return "destructive"
      case "expired":
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Identity Management</h1>
          <p className="text-muted-foreground">
            Manage your decentralized identities with advanced security and verification features
          </p>
        </div>

        {/* Identity Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Identities</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{identityStats.totalIdentities}</div>
              <p className="text-xs text-muted-foreground">Created identities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Identities</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{identityStats.activeIdentities}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verifications</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{identityStats.verifications}</div>
              <p className="text-xs text-muted-foreground">Total verifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
              <Fingerprint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{identityStats.reputation.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Trust rating</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="identities" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="identities">My Identities</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="verify">Verification</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="identities" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Decentralized Identities</CardTitle>
                    <CardDescription>Manage and monitor your DID identities</CardDescription>
                  </div>
                  <Button onClick={generateNewIdentity}>
                    <Shield className="mr-2 h-4 w-4" />
                    Create Identity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {identities.map((identity) => (
                    <div key={identity.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Shield className="h-6 w-6" />
                          <div>
                            <div className="font-semibold">Identity #{identity.id}</div>
                            <div className="text-sm text-muted-foreground">Created {formatDate(identity.created)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(identity.status)}>{identity.status}</Badge>
                          <Badge variant="outline">{identity.verifications} verifications</Badge>
                          <Badge variant="secondary">{identity.reputation}% reputation</Badge>
                        </div>
                      </div>

                      {/* DID */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Decentralized Identifier (DID)</Label>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(identity.did)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <code className="text-sm bg-muted p-3 rounded block break-all">{identity.did}</code>
                        </div>

                        {/* Public Key */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Public Key</Label>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(identity.publicKey)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <code className="text-sm bg-muted p-3 rounded block break-all">{identity.publicKey}</code>
                        </div>

                        {/* Private Key */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Private Key</Label>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => togglePrivateKeyVisibility(identity.id)}>
                                {showPrivateKeys[identity.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              {showPrivateKeys[identity.id] && (
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(identity.privateKey)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <code className="text-sm bg-muted p-3 rounded block break-all">
                            {showPrivateKeys[identity.id]
                              ? identity.privateKey
                              : "••••••••••••••••••••••••••••••••••••••••••••••••••"}
                          </code>
                        </div>

                        {/* Identity Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-lg font-semibold">{identity.verifications}</div>
                            <div className="text-xs text-muted-foreground">Verifications</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{identity.reputation}%</div>
                            <div className="text-xs text-muted-foreground">Reputation</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{formatDate(identity.lastUsed)}</div>
                            <div className="text-xs text-muted-foreground">Last Used</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{identity.method.toUpperCase()}</div>
                            <div className="text-xs text-muted-foreground">Method</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-4">
                          <Button variant="outline" size="sm">
                            <QrCode className="mr-2 h-4 w-4" />
                            QR Code
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Globe className="mr-2 h-4 w-4" />
                            Verify
                          </Button>
                          {identity.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revokeIdentity(identity.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Revoke
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              <Unlock className="mr-2 h-4 w-4" />
                              Revoked
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Identity</CardTitle>
                <CardDescription>Generate a new decentralized identifier with advanced security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your private keys are generated locally and encrypted. NexaFlow never stores your private keys on
                    our servers.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="method">DID Method</Label>
                    <Input id="method" defaultValue="nex" placeholder="Enter DID method" />
                    <p className="text-xs text-muted-foreground mt-1">
                      The method defines how your DID is created and resolved
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose (Optional)</Label>
                    <Input id="purpose" placeholder="e.g., Personal, Business, Development" />
                  </div>

                  <div>
                    <Label>Key Type</Label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option value="ed25519">Ed25519 (Recommended)</option>
                      <option value="secp256k1">Secp256k1</option>
                      <option value="rsa">RSA-2048</option>
                    </select>
                  </div>
                </div>

                <Button onClick={generateNewIdentity} className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Generate New Identity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>Verify and validate decentralized identities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="verify-did">DID to Verify</Label>
                  <Input id="verify-did" placeholder="did:nex:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK" />
                </div>

                <Button className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Identity
                </Button>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Identity verification checks the cryptographic validity and current status of a DID.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Settings</CardTitle>
                <CardDescription>Configure your identity management preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Security Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Require confirmation for identity operations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Auto-backup identity keys</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Enable biometric authentication</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Privacy Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Hide identity from public directory</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Allow identity verification by others</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Backup & Recovery</h4>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export All Identities
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Identities
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
