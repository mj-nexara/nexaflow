"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, X, Upload, Database, Shield, Hash, Activity, User, Bell, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [networkStatus, setNetworkStatus] = useState({
    status: "online",
    peers: 1567,
    latency: 45,
  })
  const { toast } = useToast()

  // Real-time network status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStatus((prev) => ({
        status: Math.random() > 0.05 ? "online" : "degraded",
        peers: Math.max(1000, prev.peers + Math.floor(Math.random() * 20) - 10),
        latency: Math.max(20, Math.min(100, prev.latency + Math.floor(Math.random() * 10) - 5)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = () => {
    toast({
      title: "Network Update",
      description: `Connected to ${networkStatus.peers} peers with ${networkStatus.latency}ms latency`,
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <img src="/nexaflow-logo.svg" alt="NexaFlow" className="h-10 w-10" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NexaFlow
              </span>
              <span className="text-xs text-muted-foreground">Enterprise Edition</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Platform</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-600 p-6 no-underline outline-none focus:shadow-md text-white"
                          href="/dashboard"
                        >
                          <Activity className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">Enterprise Dashboard</div>
                          <p className="text-sm leading-tight text-blue-100">
                            Monitor your decentralized infrastructure with real-time analytics and insights
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/upload"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Smart Upload</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Enterprise-grade IPFS uploads with real-time progress
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/storage"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Storage Management</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Advanced storage analytics and file management
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/identity"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Identity Hub</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Enterprise DID management and verification
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Developer Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/cid-generator"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">CID Generator Pro</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Advanced content identifier generation with cryptographic validation
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/did-manager"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">DID Manager Pro</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Enterprise decentralized identity creation and management
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a
                        href="https://docs.nexaflow.com"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">API Documentation</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Comprehensive API docs and integration guides
                        </p>
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a
                        href="https://github.com/mj-nexara/nexaflow"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Open Source</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Contribute to the NexaFlow ecosystem on GitHub
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className={`hidden sm:inline-flex ${
                networkStatus.status === "online"
                  ? "border-green-500 text-green-600"
                  : "border-yellow-500 text-yellow-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  networkStatus.status === "online" ? "bg-green-500" : "bg-yellow-500"
                } animate-pulse`}
              />
              Network: {networkStatus.status}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex relative"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
            </Button>

            <Link href="/dashboard">
              <Button className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Launch Platform
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent">
                <Activity className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/upload" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Link>
              <Link href="/storage" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent">
                <Database className="h-4 w-4" />
                <span>Storage</span>
              </Link>
              <Link href="/identity" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent">
                <Shield className="h-4 w-4" />
                <span>Identity</span>
              </Link>
              <Link href="/cid-generator" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent">
                <Hash className="h-4 w-4" />
                <span>CID Generator</span>
              </Link>
              <Link href="/did-manager" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent">
                <User className="h-4 w-4" />
                <span>DID Manager</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
