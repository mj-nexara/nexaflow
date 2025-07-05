"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Search,
  Download,
  Trash2,
  Copy,
  Eye,
  Share,
  SortAsc,
  SortDesc,
  FileText,
  ImageIcon,
  Video,
  Music,
  File,
  HardDrive,
  Activity,
} from "lucide-react"
import { Header } from "@/components/header"

interface StoredFile {
  id: string
  name: string
  cid: string
  size: number
  type: string
  uploadDate: string
  lastAccessed: string
  pinned: boolean
  replicas: number
  status: "available" | "retrieving" | "error"
}

interface StorageStats {
  totalFiles: number
  totalSize: number
  usedSpace: number
  availableSpace: number
  pinnedFiles: number
  replicationFactor: number
}

export default function StoragePage() {
  const [files, setFiles] = useState<StoredFile[]>([
    {
      id: "1",
      name: "project-document.pdf",
      cid: "QmX7Y8Z9abcdef123456789",
      size: 2048576,
      type: "application/pdf",
      uploadDate: "2024-01-15T10:30:00Z",
      lastAccessed: "2024-01-20T14:22:00Z",
      pinned: true,
      replicas: 5,
      status: "available",
    },
    {
      id: "2",
      name: "presentation.pptx",
      cid: "QmA1B2C3def456789012345",
      size: 5242880,
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      uploadDate: "2024-01-14T09:15:00Z",
      lastAccessed: "2024-01-19T16:45:00Z",
      pinned: false,
      replicas: 3,
      status: "available",
    },
    {
      id: "3",
      name: "demo-video.mp4",
      cid: "QmD4E5F6ghi789012345678",
      size: 15728640,
      type: "video/mp4",
      uploadDate: "2024-01-13T15:45:00Z",
      lastAccessed: "2024-01-18T11:30:00Z",
      pinned: true,
      replicas: 7,
      status: "available",
    },
  ])

  const [storageStats, setStorageStats] = useState<StorageStats>({
    totalFiles: 47,
    totalSize: 838860800, // ~800MB
    usedSpace: 838860800,
    availableSpace: 1073741824, // 1GB
    pinnedFiles: 23,
    replicationFactor: 4.2,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState<string>("all")

  // Real-time storage updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStorageStats((prev) => ({
        ...prev,
        totalFiles: prev.totalFiles + Math.floor(Math.random() * 2),
        replicationFactor: Math.max(3, Math.min(8, prev.replicationFactor + (Math.random() - 0.5) * 0.2)),
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />
    if (type.includes("text") || type.includes("document") || type.includes("pdf"))
      return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredAndSortedFiles = files
    .filter(
      (file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === "all" || file.type.startsWith(filterType)),
    )
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "date":
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          break
        case "size":
          comparison = a.size - b.size
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const usagePercentage = (storageStats.usedSpace / (storageStats.usedSpace + storageStats.availableSpace)) * 100

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">IPFS Storage Management</h1>
          <p className="text-muted-foreground">
            Manage your decentralized storage with real-time monitoring and file operations
          </p>
        </div>

        {/* Storage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageStats.totalFiles}</div>
              <p className="text-xs text-muted-foreground">Stored on IPFS</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(storageStats.usedSpace)}</div>
              <Progress value={usagePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{usagePercentage.toFixed(1)}% of available space</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pinned Files</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageStats.pinnedFiles}</div>
              <p className="text-xs text-muted-foreground">Permanently stored</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Replication Factor</CardTitle>
              <Share className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageStats.replicationFactor.toFixed(1)}x</div>
              <p className="text-xs text-muted-foreground">Average replicas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">File Management</TabsTrigger>
            <TabsTrigger value="analytics">Storage Analytics</TabsTrigger>
            <TabsTrigger value="settings">Storage Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>Browse, search, and manage your IPFS stored files</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "name" | "date" | "size")}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="date">Date</option>
                      <option value="name">Name</option>
                      <option value="size">Size</option>
                    </select>

                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="audio">Audio</option>
                      <option value="application">Documents</option>
                    </select>
                  </div>
                </div>

                {/* File List */}
                <div className="space-y-4">
                  {filteredAndSortedFiles.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {file.pinned && <Badge variant="secondary">Pinned</Badge>}
                          <Badge variant="outline">{file.replicas} replicas</Badge>
                          <Badge variant={file.status === "available" ? "default" : "secondary"}>{file.status}</Badge>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">CID:</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(file.cid)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <code className="text-sm break-all">{file.cid}</code>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Storage Usage Over Time</CardTitle>
                  <CardDescription>Track your storage consumption patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Activity className="h-12 w-12 mx-auto mb-4" />
                      <p>Storage analytics visualization</p>
                      <p className="text-sm">Real-time charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Type Distribution</CardTitle>
                  <CardDescription>Breakdown of stored file types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Documents</span>
                      </div>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm">Images</span>
                      </div>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">Videos</span>
                      </div>
                      <span className="text-sm text-muted-foreground">20%</span>
                    </div>
                    <Progress value={20} />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <span className="text-sm">Audio</span>
                      </div>
                      <span className="text-sm text-muted-foreground">5%</span>
                    </div>
                    <Progress value={5} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Settings</CardTitle>
                <CardDescription>Configure your IPFS storage preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Storage settings allow you to control replication, pinning policies, and garbage collection for your
                    IPFS content.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Auto-Pin Settings</h4>
                    <p className="text-sm text-muted-foreground mb-2">Automatically pin files based on criteria</p>
                    <Button variant="outline">Configure Auto-Pin Rules</Button>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Replication Policy</h4>
                    <p className="text-sm text-muted-foreground mb-2">Set minimum replication factor for your files</p>
                    <Button variant="outline">Manage Replication</Button>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Garbage Collection</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Configure automatic cleanup of unpinned content
                    </p>
                    <Button variant="outline">GC Settings</Button>
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
