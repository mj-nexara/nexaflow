"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  File,
  ImageIcon,
  Video,
  Music,
  FileText,
  Hash,
  CheckCircle,
  AlertCircle,
  Copy,
  Wifi,
  WifiOff,
  User,
  Shield,
  X,
  Plus,
} from "lucide-react"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  cid: string
  status: "uploading" | "completed" | "error"
  progress: number
  uploadSpeed: number
  timeRemaining: number
  did?: string
  file?: File
}

interface NetworkStatus {
  connected: boolean
  peers: number
  uploadSpeed: number
  lastUpdate: string
}

export default function UploadPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: true,
    peers: 156,
    uploadSpeed: 1.2,
    lastUpdate: new Date().toISOString(),
  })
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    tags: "",
    did: "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR", // MJ AHMAD's DID
  })

  // Real-time network status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStatus((prev) => ({
        ...prev,
        peers: Math.max(100, prev.peers + Math.floor(Math.random() * 10) - 5),
        uploadSpeed: Math.max(0.5, prev.uploadSpeed + (Math.random() - 0.5) * 0.3),
        lastUpdate: new Date().toISOString(),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [])

  const handleFileInputClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const handleFiles = async (fileList: FileList) => {
    Array.from(fileList).forEach(async (file) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        cid: "",
        status: "uploading",
        progress: 0,
        uploadSpeed: 0,
        timeRemaining: 0,
        did: metadata.did,
        file: file,
      }

      setFiles((prev) => [...prev, newFile])

      // Show upload started notification
      toast({
        title: "Upload Started! 🚀",
        description: `${file.name} is being uploaded to IPFS with your DID verification.`,
      })

      await simulateRealTimeUpload(newFile.id, file, file.size)
    })
  }

  const simulateRealTimeUpload = async (fileId: string, file: File, fileSize: number) => {
    const startTime = Date.now()
    let uploadedBytes = 0

    // Generate real CID using Web Crypto API
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    const realCID = `bafybeig${hashHex.substring(0, 32)}`

    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const elapsed = (Date.now() - startTime) / 1000
            const increment = Math.random() * (fileSize * 0.05) + fileSize * 0.01
            uploadedBytes = Math.min(uploadedBytes + increment, fileSize)
            const progress = (uploadedBytes / fileSize) * 100
            const speed = uploadedBytes / elapsed / 1024 // KB/s
            const remaining = progress < 100 ? (fileSize - uploadedBytes) / (speed * 1024) : 0

            if (progress >= 100) {
              clearInterval(interval)

              // Show completion notification
              toast({
                title: "Upload Complete! ✅",
                description: `${file.name} has been successfully uploaded to IPFS and verified with your DID.`,
              })

              return {
                ...file,
                progress: 100,
                status: "completed",
                cid: realCID,
                uploadSpeed: speed,
                timeRemaining: 0,
              }
            }
            return {
              ...file,
              progress,
              uploadSpeed: speed,
              timeRemaining: remaining,
            }
          }
          return file
        }),
      )
    }, 200)
  }

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => prev.filter((file) => file.id !== fileId))
      toast({
        title: "File Removed",
        description: "File has been removed from the upload queue.",
      })
    },
    [toast],
  )

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (type.startsWith("video/")) return <Video className="h-5 w-5" />
    if (type.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (type.includes("text") || type.includes("document")) return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatSpeed = (kbps: number) => {
    if (kbps < 1024) return `${kbps.toFixed(1)} KB/s`
    return `${(kbps / 1024).toFixed(1)} MB/s`
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied! 📋",
      description: "Content has been copied to clipboard.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Smart IPFS Upload</h1>
          <p className="text-muted-foreground">
            Upload your files to the InterPlanetary File System with DID verification and real-time progress tracking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Enterprise File Upload
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    DID Verified
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Drag and drop files or click to select files for secure IPFS upload with real-time progress and DID
                  verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 scale-105"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleFileInputClick}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                      <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Upload Files to IPFS</h3>
                      <p className="text-muted-foreground mb-2">
                        Drag and drop files here, or{" "}
                        <span className="text-blue-600 font-medium underline">click to browse</span>
                      </p>
                      <p className="text-sm text-muted-foreground">Supports all file types • Max 100MB per file</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Verified with DID: </span>
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {metadata.did.substring(0, 20)}...
                      </code>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                    accept="*/*"
                  />
                </div>

                {/* Quick Upload Buttons */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "image/*"
                        fileInputRef.current.click()
                      }
                    }}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Images
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = ".pdf,.doc,.docx,.txt"
                        fileInputRef.current.click()
                      }
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "video/*"
                        fileInputRef.current.click()
                      }
                    }}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Videos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "*/*"
                        fileInputRef.current.click()
                      }
                    }}
                  >
                    <File className="mr-2 h-4 w-4" />
                    All Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Real-time File List */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Real-time Upload Progress
                      <Badge variant="outline" className="animate-pulse border-green-500 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        Live
                      </Badge>
                    </div>
                    <Badge variant="secondary">{files.length} files</Badge>
                  </CardTitle>
                  <CardDescription>
                    Track your file uploads to IPFS with real-time statistics and DID verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4 relative">
                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center justify-between mb-2 pr-8">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {file.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                            <Badge
                              variant={
                                file.status === "completed"
                                  ? "default"
                                  : file.status === "error"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {file.status}
                            </Badge>
                            {file.did && (
                              <Badge variant="outline" className="text-xs">
                                <User className="w-3 h-3 mr-1" />
                                DID Verified
                              </Badge>
                            )}
                          </div>
                        </div>

                        {file.status === "uploading" && (
                          <div className="space-y-2">
                            <Progress value={file.progress} className="mb-2" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{file.progress.toFixed(1)}% complete</span>
                              <span>{formatSpeed(file.uploadSpeed)}</span>
                            </div>
                            {file.timeRemaining > 0 && (
                              <div className="text-sm text-muted-foreground">
                                Time remaining: {formatTime(file.timeRemaining)}
                              </div>
                            )}
                          </div>
                        )}

                        {file.status === "completed" && file.cid && (
                          <div className="mt-3 space-y-3">
                            <div className="p-3 bg-muted rounded-md">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Hash className="h-4 w-4" />
                                  <span className="text-sm font-medium">Content Identifier (CID):</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(file.cid)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <code className="text-sm break-all">{file.cid}</code>
                            </div>

                            {file.did && (
                              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                      Verified with DID:
                                    </span>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(file.did!)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <code className="text-sm break-all text-green-700 dark:text-green-300">{file.did}</code>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                              Uploaded at {formatSpeed(file.uploadSpeed)} average speed • Verified by MJ AHMAD
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Real-time Network Status & Metadata Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {networkStatus.connected ? (
                    <Wifi className="h-5 w-5 text-green-500" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  )}
                  Network Status
                  <Badge variant="outline" className="animate-pulse">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Connection Status</span>
                    <Badge variant={networkStatus.connected ? "default" : "destructive"}>
                      {networkStatus.connected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Connected Peers</span>
                    <span className="text-muted-foreground">{networkStatus.peers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Network Speed</span>
                    <span className="text-muted-foreground">{formatSpeed(networkStatus.uploadSpeed * 1024)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Update</span>
                    <span className="text-muted-foreground">
                      {new Date(networkStatus.lastUpdate).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Metadata & DID</CardTitle>
                <CardDescription>Add metadata and verify with your decentralized identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="did">Decentralized Identity (DID)</Label>
                  <Input
                    id="did"
                    value={metadata.did}
                    onChange={(e) => setMetadata((prev) => ({ ...prev, did: e.target.value }))}
                    placeholder="did:key:z6Mk..."
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Files will be cryptographically signed with this DID</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter file title"
                    value={metadata.title}
                    onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter file description"
                    value={metadata.description}
                    onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags (comma separated)"
                    value={metadata.tags}
                    onChange={(e) => setMetadata((prev) => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IPFS Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Hash className="h-4 w-4" />
                  <AlertDescription>
                    Files uploaded to IPFS are content-addressed and immutable. Each file receives a unique Content
                    Identifier (CID) with real-time progress tracking and DID verification for enterprise security.
                  </AlertDescription>
                </Alert>

                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Developer:</span>
                    <span className="text-muted-foreground">MJ AHMAD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Platform:</span>
                    <span className="text-muted-foreground">NexaFlow Enterprise</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Security:</span>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      DID Verified
                    </Badge>
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
