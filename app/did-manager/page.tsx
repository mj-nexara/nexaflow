"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Key, Copy, Plus, CheckCircle, AlertCircle, User, Lock, Unlock, QrCode } from "lucide-react"
import { Header } from "@/components/header"

interface DIDDocument {
  id: string
  did: string
  publicKey: string
  privateKey: string
  created: string
  status: "active" | "revoked"
  method: string
}

export default function DIDManagerPage() {
  const [dids, setDids] = useState<DIDDocument[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newDIDForm, setNewDIDForm] = useState({
    method: "nex",
    description: "",
  })

  const createNewDID = async () => {
    setIsCreating(true)

    // Simulate key generation
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "Ed25519",
        namedCurve: "Ed25519",
      },
      true,
      ["sign", "verify"],
    )

    setTimeout(() => {
      const identifier = Math.random().toString(36).substr(2, 32)
      const newDID: DIDDocument = {
        id: Date.now().toString(),
        did: `did:${newDIDForm.method}:${identifier}`,
        publicKey: `z6Mk${identifier}`,
        privateKey: `z${Math.random().toString(36).substr(2, 44)}`,
        created: new Date().toISOString(),
        status: "active",
        method: newDIDForm.method,
      }

      setDids((prev) => [newDID, ...prev])
      setIsCreating(false)
      setNewDIDForm({ method: "nex", description: "" })
    }, 2000)
  }

  const revokeDID = (id: string) => {
    setDids((prev) => prev.map((did) => (did.id === id ? { ...did, status: "revoked" as const } : did)))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">DID Manager</h1>
          <p className="text-muted-foreground">Create and manage your Decentralized Identifiers (DIDs)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create DID</TabsTrigger>
                <TabsTrigger value="manage">Manage DIDs</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create New DID
                    </CardTitle>
                    <CardDescription>Generate a new decentralized identifier for your identity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="method">DID Method</Label>
                      <Input
                        id="method"
                        value={newDIDForm.method}
                        onChange={(e) => setNewDIDForm((prev) => ({ ...prev, method: e.target.value }))}
                        placeholder="nex"
                      />
                      <p className="text-xs text-muted-foreground">
                        The DID method defines how the identifier is created and resolved
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={newDIDForm.description}
                        onChange={(e) => setNewDIDForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the purpose of this DID..."
                        rows={3}
                      />
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Your private key will be generated locally and should be kept secure. NexaFlow does not store
                        your private keys.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={createNewDID}
                      disabled={isCreating || !newDIDForm.method.trim()}
                      className="w-full"
                    >
                      {isCreating ? (
                        <>
                          <Shield className="mr-2 h-4 w-4 animate-spin" />
                          Creating DID...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create DID
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manage" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your DIDs</CardTitle>
                    <CardDescription>Manage your existing decentralized identifiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dids.length === 0 ? (
                      <div className="text-center py-8">
                        <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No DIDs Created</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first decentralized identifier to get started
                        </p>
                        <Button onClick={() => document.querySelector('[value="create"]')?.click()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create First DID
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dids.map((did) => (
                          <div key={did.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                <Badge variant={did.status === "active" ? "default" : "secondary"}>{did.status}</Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(did.created).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">DID</span>
                                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(did.did)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <code className="text-sm bg-muted p-2 rounded block break-all">{did.did}</code>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Public Key</span>
                                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(did.publicKey)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <code className="text-sm bg-muted p-2 rounded block break-all">{did.publicKey}</code>
                              </div>

                              <div className="flex items-center gap-2 pt-2">
                                <Button variant="outline" size="sm">
                                  <QrCode className="mr-2 h-4 w-4" />
                                  QR Code
                                </Button>
                                {did.status === "active" ? (
                                  <Button variant="outline" size="sm" onClick={() => revokeDID(did.id)}>
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
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  About DIDs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Decentralized Identifiers (DIDs) are a new type of identifier that enables verifiable,
                    self-sovereign digital identity.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Key Benefits</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Self-sovereign identity</li>
                      <li>• Cryptographic verification</li>
                      <li>• Decentralized control</li>
                      <li>• Privacy-preserving</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-1">Use Cases</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Digital signatures</li>
                      <li>• Access control</li>
                      <li>• Content ownership</li>
                      <li>• Identity verification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DID Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div>
                    <code className="bg-muted p-1 rounded text-xs">did:method:identifier</code>
                  </div>
                  <div>
                    <span className="font-medium">did:</span>
                    <span className="text-muted-foreground ml-2">URI scheme</span>
                  </div>
                  <div>
                    <span className="font-medium">method:</span>
                    <span className="text-muted-foreground ml-2">DID method name</span>
                  </div>
                  <div>
                    <span className="font-medium">identifier:</span>
                    <span className="text-muted-foreground ml-2">Method-specific ID</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    Each DID resolves to a DID Document containing cryptographic material and service endpoints.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Private Key Security</div>
                    <div className="text-xs text-muted-foreground">Keys generated locally and never transmitted</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Cryptographic Proof</div>
                    <div className="text-xs text-muted-foreground">Digital signatures verify identity</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Backup Required</div>
                    <div className="text-xs text-muted-foreground">Store private keys securely</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
