"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Upload,
  Download,
  Database,
  Shield,
  Hash,
  Network,
  TrendingUp,
  Users,
  Globe,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  const [networkStats, setNetworkStats] = useState({
    connectedPeers: 156,
    totalStorage: 2.4,
    uploadSpeed: 1.2,
    downloadSpeed: 3.8,
    networkHealth: 98,
  })

  const [userStats, setUserStats] = useState({
    filesUploaded: 47,
    totalSize: 0.8,
    didsCreated: 3,
    cidsGenerated: 52,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats((prev) => ({
        ...prev,
        connectedPeers: prev.connectedPeers + Math.floor(Math.random() * 3) - 1,
        uploadSpeed: Math.max(0.1, prev.uploadSpeed + (Math.random() - 0.5) * 0.2),
        downloadSpeed: Math.max(0.1, prev.downloadSpeed + (Math.random() - 0.5) * 0.5),
        networkHealth: Math.max(90, Math.min(100, prev.networkHealth + Math.floor(Math.random() * 3) - 1)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your NexaFlow network activity</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Network Online
            </Badge>
            <Link href="/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </Link>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Connected Peers"
            value={networkStats.connectedPeers.toString()}
            icon={Network}
            trend="+2%"
            description="Active network nodes"
          />
          <StatsCard
            title="Total Storage"
            value={`${networkStats.totalStorage.toFixed(1)} TB`}
            icon={Database}
            trend="+8%"
            description="Distributed across IPFS"
          />
          <StatsCard
            title="Upload Speed"
            value={`${networkStats.uploadSpeed.toFixed(1)} MB/s`}
            icon={TrendingUp}
            trend="+12%"
            description="Average network speed"
          />
          <StatsCard
            title="Network Health"
            value={`${networkStats.networkHealth}%`}
            icon={Activity}
            trend="+1%"
            description="System performance"
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Network Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Network Status
              </CardTitle>
              <CardDescription>Real-time network performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network Health</span>
                  <span className="text-sm text-muted-foreground">{networkStats.networkHealth}%</span>
                </div>
                <Progress value={networkStats.networkHealth} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Upload</span>
                  </div>
                  <div className="text-2xl font-bold">{networkStats.uploadSpeed.toFixed(1)} MB/s</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Download</span>
                  </div>
                  <div className="text-2xl font-bold">{networkStats.downloadSpeed.toFixed(1)} MB/s</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/upload" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to IPFS
                </Button>
              </Link>
              <Link href="/cid-generator" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Hash className="mr-2 h-4 w-4" />
                  Generate CID
                </Button>
              </Link>
              <Link href="/did-manager" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Create DID
                </Button>
              </Link>
              <Link href="/storage" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Manage Storage
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Statistics</CardTitle>
                  <CardDescription>Personal usage metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Files Uploaded</span>
                    <Badge variant="secondary">{userStats.filesUploaded}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Size</span>
                    <Badge variant="secondary">{userStats.totalSize} GB</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">DIDs Created</span>
                    <Badge variant="secondary">{userStats.didsCreated}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CIDs Generated</span>
                    <Badge variant="secondary">{userStats.cidsGenerated}</Badge>
                  </div>
                </CardContent>
              </Card>

              <RecentActivity />
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>Manage your IPFS stored files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
                  <p className="text-muted-foreground mb-4">Start by uploading your first file to IPFS</p>
                  <Link href="/upload">
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="identity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Management</CardTitle>
                <CardDescription>Manage your decentralized identities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Create your first DID</h3>
                  <p className="text-muted-foreground mb-4">Establish your decentralized identity</p>
                  <Link href="/did-manager">
                    <Button>
                      <Shield className="mr-2 h-4 w-4" />
                      Create DID
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Information</CardTitle>
                <CardDescription>Detailed network statistics and peer information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{networkStats.connectedPeers}</div>
                    <div className="text-sm text-muted-foreground">Connected Peers</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{networkStats.networkHealth}%</div>
                    <div className="text-sm text-muted-foreground">Network Health</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Globe className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                    <div className="text-2xl font-bold">Global</div>
                    <div className="text-sm text-muted-foreground">Distribution</div>
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
