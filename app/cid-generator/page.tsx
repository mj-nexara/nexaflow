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
import { Hash, Copy, CheckCircle, Upload, FileText, Info, Zap } from "lucide-react"
import { Header } from "@/components/header"

interface GeneratedCID {
  cid: string
  hash: string
  size: number
  type: string
  timestamp: string
}

export default function CIDGeneratorPage() {
  const [textInput, setTextInput] = useState("")
  const [generatedCIDs, setGeneratedCIDs] = useState<GeneratedCID[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCIDFromText = async () => {
    if (!textInput.trim()) return

    setIsGenerating(true)

    // Simulate real CID generation process
    const encoder = new TextEncoder()
    const data = encoder.encode(textInput)

    // Simulate hash calculation
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    setTimeout(() => {
      const newCID: GeneratedCID = {
        cid: `bafybeig${hashHex.substring(0, 32)}`,
        hash: `sha256-${hashHex}`,
        size: data.length,
        type: "text/plain",
        timestamp: new Date().toISOString(),
      }

      setGeneratedCIDs((prev) => [newCID, ...prev])
      setIsGenerating(false)
    }, 1000)
  }

  const generateCIDFromFile = async (file: File) => {
    setIsGenerating(true)

    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    setTimeout(() => {
      const newCID: GeneratedCID = {
        cid: `bafybeig${hashHex.substring(0, 32)}`,
        hash: `sha256-${hashHex}`,
        size: file.size,
        type: file.type,
        timestamp: new Date().toISOString(),
      }

      setGeneratedCIDs((prev) => [newCID, ...prev])
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CID Generator</h1>
          <p className="text-muted-foreground">Generate Content Identifiers (CIDs) for IPFS content addressing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Content</TabsTrigger>
                <TabsTrigger value="file">File Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Generate CID from Text
                    </CardTitle>
                    <CardDescription>Enter text content to generate its IPFS Content Identifier</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-input">Text Content</Label>
                      <Textarea
                        id="text-input"
                        placeholder="Enter your text content here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={6}
                      />
                    </div>

                    <Button
                      onClick={generateCIDFromText}
                      disabled={!textInput.trim() || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Zap className="mr-2 h-4 w-4 animate-spin" />
                          Generating CID...
                        </>
                      ) : (
                        <>
                          <Hash className="mr-2 h-4 w-4" />
                          Generate CID
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="file" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Generate CID from File
                    </CardTitle>
                    <CardDescription>Upload a file to generate its IPFS Content Identifier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Upload File</h3>
                      <p className="text-muted-foreground mb-4">Select a file to generate its CID</p>
                      <Input
                        type="file"
                        className="hidden"
                        id="file-cid-upload"
                        onChange={(e) => e.target.files?.[0] && generateCIDFromFile(e.target.files[0])}
                      />
                      <Label htmlFor="file-cid-upload">
                        <Button variant="outline" className="cursor-pointer bg-transparent" disabled={isGenerating}>
                          {isGenerating ? (
                            <>
                              <Zap className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Select File
                            </>
                          )}
                        </Button>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Generated CIDs */}
            {generatedCIDs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated CIDs</CardTitle>
                  <CardDescription>Recently generated Content Identifiers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedCIDs.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Content Identifier (CID)</span>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.cid)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <code className="text-sm bg-muted p-2 rounded block break-all">{item.cid}</code>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Hash</span>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.hash)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <code className="text-sm bg-muted p-2 rounded block break-all">{item.hash}</code>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span>Size: {formatFileSize(item.size)}</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About CIDs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Hash className="h-4 w-4" />
                  <AlertDescription>
                    Content Identifiers (CIDs) are self-describing content-addressed identifiers used in IPFS to
                    uniquely identify content.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Key Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Content-addressed</li>
                      <li>• Cryptographically secure</li>
                      <li>• Self-describing</li>
                      <li>• Version-agnostic</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-1">Use Cases</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Content verification</li>
                      <li>• Deduplication</li>
                      <li>• Immutable references</li>
                      <li>• Distributed storage</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CID Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Version:</span>
                    <span className="text-muted-foreground ml-2">CID format version</span>
                  </div>
                  <div>
                    <span className="font-medium">Codec:</span>
                    <span className="text-muted-foreground ml-2">Content encoding</span>
                  </div>
                  <div>
                    <span className="font-medium">Hash Type:</span>
                    <span className="text-muted-foreground ml-2">Cryptographic hash function</span>
                  </div>
                  <div>
                    <span className="font-medium">Hash Value:</span>
                    <span className="text-muted-foreground ml-2">Actual content hash</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    CIDs ensure that identical content always produces the same identifier, enabling efficient
                    deduplication and content verification.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Hash className="mr-2 h-4 w-4" />
                  Validate CID
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  CID Inspector
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Batch Generate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
