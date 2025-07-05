"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Download, Shield, Hash, Globe, Users, Zap, CheckCircle } from "lucide-react"

interface ActivityItem {
  id: string
  type: "upload" | "download" | "did" | "cid" | "verification" | "connection"
  description: string
  timestamp: string
  status: "success" | "pending" | "error"
  user?: string
  location?: string
}

const activityTemplates = [
  { type: "upload", description: "Large dataset uploaded to IPFS", user: "Enterprise User" },
  { type: "did", description: "New enterprise DID created", user: "Admin" },
  { type: "cid", description: "Batch CID generation completed", user: "Developer" },
  { type: "download", description: "Content retrieved from global CDN", user: "End User" },
  { type: "verification", description: "Identity verification successful", user: "Security Team" },
  { type: "connection", description: "New node joined the network", location: "Singapore" },
]

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "upload",
      description: "enterprise-data.zip uploaded to IPFS",
      timestamp: "2 minutes ago",
      status: "success",
      user: "Enterprise User",
    },
    {
      id: "2",
      type: "did",
      description: "New enterprise DID created: did:nex:ent123",
      timestamp: "5 minutes ago",
      status: "success",
      user: "Admin",
    },
    {
      id: "3",
      type: "verification",
      description: "Identity verification completed",
      timestamp: "8 minutes ago",
      status: "success",
      user: "Security Team",
    },
    {
      id: "4",
      type: "cid",
      description: "Batch CID generation: 1,247 files",
      timestamp: "12 minutes ago",
      status: "success",
      user: "Developer",
    },
  ])

  // Enhanced real-time activity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)]
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: template.type as ActivityItem["type"],
        description: template.description,
        timestamp: "just now",
        status: Math.random() > 0.1 ? "success" : "pending",
        user: template.user,
        location: template.location,
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
      case "did":
        return <Shield className="h-4 w-4" />
      case "cid":
        return <Hash className="h-4 w-4" />
      case "verification":
        return <CheckCircle className="h-4 w-4" />
      case "connection":
        return <Globe className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: ActivityItem["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500 animate-pulse"
      case "error":
        return "bg-red-500"
    }
  }

  const getTypeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "upload":
        return "text-blue-600"
      case "download":
        return "text-green-600"
      case "did":
        return "text-purple-600"
      case "cid":
        return "text-orange-600"
      case "verification":
        return "text-emerald-600"
      case "connection":
        return "text-indigo-600"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Global Activity Feed
          </div>
          <Badge variant="outline" className="animate-pulse border-green-500 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getTypeColor(activity.type)}`}
                  >
                    {getIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    {activity.user && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {activity.user}
                        </Badge>
                      </>
                    )}
                    {activity.location && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {activity.location}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`} />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
