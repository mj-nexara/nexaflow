"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Database,
  Shield,
  Zap,
  Globe,
  Activity,
  FileText,
  Hash,
  Key,
  Network,
  Rocket,
  Star,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { RecentActivity } from "@/components/recent-activity"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalFiles: 12847,
    totalStorage: "24.7 TB",
    activeDIDs: 8924,
    networkNodes: 1567,
    globalUsers: 45231,
    uptime: 99.97,
  })

  const [realtimeData, setRealtimeData] = useState({
    uploadsToday: 234,
    retrievalsToday: 1567,
    networkHealth: 99,
    activeConnections: 892,
  })

  // Advanced real-time updates with WebSocket simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData((prev) => ({
        uploadsToday: prev.uploadsToday + Math.floor(Math.random() * 5),
        retrievalsToday: prev.retrievalsToday + Math.floor(Math.random() * 8),
        networkHealth: 95 + Math.floor(Math.random() * 5),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 10) - 5,
      }))

      setStats((prev) => ({
        ...prev,
        totalFiles: prev.totalFiles + Math.floor(Math.random() * 3),
        activeDIDs: prev.activeDIDs + Math.floor(Math.random() * 2),
        globalUsers: prev.globalUsers + Math.floor(Math.random() * 5),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    toast({
      title: "Welcome to NexaFlow! 🚀",
      description: "You're about to experience the future of decentralized content management.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />

      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <img src="/nexaflow-logo.svg" alt="NexaFlow" className="h-12 w-12 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-ping" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold text-white">NexaFlow</span>
                <span className="text-sm text-blue-100">Enterprise Edition</span>
              </div>
              <Badge variant="secondary" className="ml-4 bg-white/20 text-white border-white/30">
                <Sparkles className="mr-1 h-3 w-3" />
                v2.0 Pro
              </Badge>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Decentralized
              </span>
              <br />
              Content Management
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Enterprise-grade platform powered by IPFS, secured by DID technology, and built for the next generation of
              Web3 applications.
              <span className="font-semibold text-white">Join 45,000+ users</span> already transforming their digital
              infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto shadow-2xl"
                  onClick={handleGetStarted}
                >
                  <Rocket className="mr-3 h-6 w-6" />
                  Launch Platform
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/upload">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent text-lg px-8 py-4 h-auto backdrop-blur-sm"
                >
                  <Upload className="mr-3 h-6 w-6" />
                  Start Upload
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">{stats.uptime}%</div>
                <div className="text-blue-200 text-sm">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.globalUsers.toLocaleString()}+</div>
                <div className="text-blue-200 text-sm">Global Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.totalStorage}</div>
                <div className="text-blue-200 text-sm">Data Stored</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.networkNodes}</div>
                <div className="text-blue-200 text-sm">Network Nodes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Stats - Enhanced */}
      <section className="container mx-auto px-4 py-16 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatsCard
            title="Files Stored"
            value={stats.totalFiles.toLocaleString()}
            icon={FileText}
            trend="+12.5%"
            description="Distributed on IPFS"
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800"
          />
          <StatsCard
            title="Storage Capacity"
            value={stats.totalStorage}
            icon={Database}
            trend="+8.3%"
            description="Decentralized storage"
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800"
          />
          <StatsCard
            title="Active Identities"
            value={stats.activeDIDs.toLocaleString()}
            icon={Key}
            trend="+15.7%"
            description="Verified DIDs"
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800"
          />
          <StatsCard
            title="Network Health"
            value={`${realtimeData.networkHealth}%`}
            icon={Activity}
            trend="+2.1%"
            description="System performance"
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800"
          />
        </div>

        {/* Live Activity Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="relative">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping" />
                </div>
                Live Network Activity
                <Badge variant="outline" className="animate-pulse border-green-500 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>Real-time updates from the NexaFlow ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploads Today</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {realtimeData.uploadsToday}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Retrievals Today</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {realtimeData.retrievalsToday}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Connections</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {realtimeData.activeConnections}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network Health</span>
                      <span className="text-sm text-muted-foreground">{realtimeData.networkHealth}%</span>
                    </div>
                    <Progress value={realtimeData.networkHealth} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Global Reach</span>
                      <span className="text-sm text-muted-foreground">156 Countries</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <RecentActivity />
        </div>

        {/* Enhanced Features Overview */}
        <Tabs defaultValue="ipfs" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="ipfs" className="text-sm">
              IPFS Storage
            </TabsTrigger>
            <TabsTrigger value="did" className="text-sm">
              DID Identity
            </TabsTrigger>
            <TabsTrigger value="cid" className="text-sm">
              CID Management
            </TabsTrigger>
            <TabsTrigger value="realtime" className="text-sm">
              Real-time
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="text-sm">
              Enterprise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ipfs" className="mt-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-blue-600" />
                  Advanced IPFS Distributed Storage
                  <Badge className="bg-blue-600">Enterprise</Badge>
                </CardTitle>
                <CardDescription>
                  Next-generation decentralized file storage with enterprise-grade features and global distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Core Features
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Content-addressed storage with SHA-256</li>
                      <li>• Automatic deduplication & compression</li>
                      <li>• Global content distribution network</li>
                      <li>• Immutable file versioning</li>
                      <li>• Real-time synchronization</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      Enterprise Benefits
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• 99.97% uptime guarantee</li>
                      <li>• Reduced bandwidth costs by 60%</li>
                      <li>• Enhanced data integrity</li>
                      <li>• Improved availability & speed</li>
                      <li>• Compliance-ready architecture</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Performance Metrics
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• 10x faster than traditional storage</li>
                      <li>• 156 global edge locations</li>
                      <li>• Sub-100ms latency worldwide</li>
                      <li>• 99.999% data durability</li>
                      <li>• Auto-scaling infrastructure</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="did" className="mt-8">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                  Advanced Decentralized Identity (DID)
                  <Badge className="bg-purple-600">Secure</Badge>
                </CardTitle>
                <CardDescription>
                  Enterprise-grade self-sovereign identity management with military-grade cryptography
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      Identity Features
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Self-sovereign identity control</li>
                      <li>• Ed25519 cryptographic verification</li>
                      <li>• Cross-platform compatibility</li>
                      <li>• Zero-knowledge privacy</li>
                      <li>• Biometric authentication</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4 text-gold-600" />
                      Enterprise Use Cases
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Content ownership verification</li>
                      <li>• Multi-factor access control</li>
                      <li>• Digital contract signatures</li>
                      <li>• Reputation & trust systems</li>
                      <li>• Compliance & audit trails</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Integration Options
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• REST API & GraphQL</li>
                      <li>• SDK for major platforms</li>
                      <li>• SSO & SAML integration</li>
                      <li>• Webhook notifications</li>
                      <li>• Custom identity providers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cid" className="mt-8">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Hash className="h-6 w-6 text-green-600" />
                  Advanced Content Identifier (CID) Management
                  <Badge className="bg-green-600">Verified</Badge>
                </CardTitle>
                <CardDescription>
                  Professional-grade content addressing with advanced cryptographic hashing and validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Hash className="h-4 w-4 text-green-600" />
                      CID Features
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Multi-hash cryptographic addressing</li>
                      <li>• SHA-256, Blake2b, SHA-3 support</li>
                      <li>• Version-agnostic design</li>
                      <li>• Self-describing identifiers</li>
                      <li>• Batch processing capabilities</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Management Tools
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Real-time CID generation</li>
                      <li>• Content verification & validation</li>
                      <li>• Metadata extraction & analysis</li>
                      <li>• Link resolution & tracking</li>
                      <li>• Performance monitoring</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      Enterprise Integration
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• API-first architecture</li>
                      <li>• Webhook notifications</li>
                      <li>• Custom validation rules</li>
                      <li>• Audit logging & compliance</li>
                      <li>• High-availability clusters</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="mt-8">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-orange-600" />
                  Real-time Capabilities & Monitoring
                  <Badge className="bg-orange-600">Live</Badge>
                </CardTitle>
                <CardDescription>
                  Enterprise-grade real-time synchronization and monitoring across the entire network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-orange-600" />
                      Real-time Features
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Live network monitoring</li>
                      <li>• Instant upload notifications</li>
                      <li>• Real-time sync status</li>
                      <li>• Dynamic content updates</li>
                      <li>• Performance analytics</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Network className="h-4 w-4 text-blue-600" />
                      Technologies
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• WebSocket connections</li>
                      <li>• Server-sent events</li>
                      <li>• Push notifications</li>
                      <li>• Event-driven architecture</li>
                      <li>• Edge computing integration</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Monitoring & Analytics
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Real-time dashboards</li>
                      <li>• Custom alerting rules</li>
                      <li>• Performance metrics</li>
                      <li>• Usage analytics</li>
                      <li>• Predictive insights</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enterprise" className="mt-8">
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-slate-600" />
                  Enterprise-Grade Features
                  <Badge className="bg-slate-600">Professional</Badge>
                </CardTitle>
                <CardDescription>
                  Built for enterprise scale with advanced security, compliance, and integration capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-slate-600" />
                      Security & Compliance
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• SOC 2 Type II certified</li>
                      <li>• GDPR & CCPA compliant</li>
                      <li>• End-to-end encryption</li>
                      <li>• Multi-factor authentication</li>
                      <li>• Audit logging & trails</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Team & Collaboration
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Role-based access control</li>
                      <li>• Team workspaces</li>
                      <li>• Collaboration tools</li>
                      <li>• Activity tracking</li>
                      <li>• Custom workflows</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Integration & Support
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• REST API & GraphQL</li>
                      <li>• Webhook integrations</li>
                      <li>• 24/7 enterprise support</li>
                      <li>• Custom development</li>
                      <li>• SLA guarantees</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  )
}
