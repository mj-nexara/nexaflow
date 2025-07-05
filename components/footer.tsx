import Link from "next/link"
import { Mail, Github, Twitter, Globe, Heart, Star, Users, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img src="/nexaflow-logo.svg" alt="NexaFlow" className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  NexaFlow
                </span>
                <span className="text-sm text-slate-400">Enterprise Edition by Nexara</span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md">
              Enterprise-grade decentralized content management platform powered by IPFS and DID technology. Built for
              the future of Web3 infrastructure with military-grade security and enterprise scalability.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                99.97% Uptime
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                <Star className="w-3 h-3 mr-1" />
                Enterprise Ready
              </Badge>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Platform</h3>
            <div className="space-y-3">
              <Link href="/dashboard" className="block text-slate-300 hover:text-white transition-colors">
                Enterprise Dashboard
              </Link>
              <Link href="/upload" className="block text-slate-300 hover:text-white transition-colors">
                Smart Upload
              </Link>
              <Link href="/storage" className="block text-slate-300 hover:text-white transition-colors">
                Storage Management
              </Link>
              <Link href="/identity" className="block text-slate-300 hover:text-white transition-colors">
                Identity Hub
              </Link>
            </div>
          </div>

          {/* Developer Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Developer Tools</h3>
            <div className="space-y-3">
              <Link href="/cid-generator" className="block text-slate-300 hover:text-white transition-colors">
                CID Generator Pro
              </Link>
              <Link href="/did-manager" className="block text-slate-300 hover:text-white transition-colors">
                DID Manager Pro
              </Link>
              <a href="https://docs.nexaflow.com" className="block text-slate-300 hover:text-white transition-colors">
                API Documentation
              </a>
              <a
                href="https://github.com/mj-nexara/nexaflow"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Open Source
              </a>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Contact & Support</h3>
            <div className="space-y-3">
              <a
                href="mailto:mjahmad.25.10.2003@gmail.com"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                Enterprise Support
              </a>
              <a
                href="https://github.com/mj-nexara"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://twitter.com/mjahmad25"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
              <a
                href="https://nexarabd.vercel.app/mjahmad"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
                Developer Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">45,000+</div>
              <div className="text-slate-400 text-sm">Global Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24.7 TB</div>
              <div className="text-slate-400 text-sm">Data Stored</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,567</div>
              <div className="text-slate-400 text-sm">Network Nodes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.97%</div>
              <div className="text-slate-400 text-sm">Uptime SLA</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <p className="text-slate-400">© 2024 NexaFlow by Nexara Technologies.</p>
            <span className="text-slate-400">Built with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-slate-400">by</span>
            <a
              href="https://nexarabd.vercel.app/mjahmad"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              MJ AHMAD
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-slate-400 text-sm">Enterprise Edition v2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <a
                href="https://mjnexaflow.vercel.app"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Live Platform
              </a>
            </div>
          </div>
        </div>

        {/* Enterprise Notice */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
          <p className="text-center text-slate-300 text-sm">
            🚀 <strong>Enterprise customers:</strong> Contact us for custom deployment, SLA guarantees, and dedicated
            support.
            <a href="mailto:mjahmad.25.10.2003@gmail.com" className="text-blue-400 hover:text-blue-300 ml-1">
              Get in touch →
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
