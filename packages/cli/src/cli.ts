#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import inquirer from "inquirer"
import { NexaFlowClient } from "./client"
import { AuthManager } from "./auth"
import { SpaceManager } from "./space"
import { UploadManager } from "./upload"
import { IdentityManager } from "./identity"

const program = new Command()
const client = new NexaFlowClient()
const auth = new AuthManager()
const space = new SpaceManager(client)
const upload = new UploadManager(client)
const identity = new IdentityManager(client)

program
  .name("nexaflow")
  .description("NexaFlow CLI - Enterprise Decentralized Content Management")
  .version("1.0.0")
  .option("-v, --verbose", "verbose output")
  .option("--api-url <url>", "NexaFlow API URL", "https://api.nexaflow.com")

// Authentication Commands
program
  .command("login")
  .description("Login to NexaFlow")
  .option("--did <did>", "Login with DID")
  .action(async (options) => {
    const spinner = ora("Logging in to NexaFlow...").start()

    try {
      let did = options.did

      if (!did) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "did",
            message: "Enter your DID:",
            default: "did:key:z6MkvS5hwP993amMA9kCbwK2Wbd7SifuwsBnRKFmaGhN92ZR",
          },
        ])
        did = answers.did
      }

      await auth.login(did)
      spinner.succeed(chalk.green("Successfully logged in to NexaFlow!"))

      console.log(chalk.blue("\n🚀 Welcome to NexaFlow Enterprise!"))
      console.log(chalk.gray(`DID: ${did}`))
      console.log(chalk.gray("You can now create spaces and upload files.\n"))
    } catch (error) {
      spinner.fail(chalk.red("Login failed"))
      console.error(chalk.red(error.message))
      process.exit(1)
    }
  })

program
  .command("logout")
  .description("Logout from NexaFlow")
  .action(async () => {
    const spinner = ora("Logging out...").start()

    try {
      await auth.logout()
      spinner.succeed(chalk.green("Successfully logged out!"))
    } catch (error) {
      spinner.fail(chalk.red("Logout failed"))
      console.error(chalk.red(error.message))
    }
  })

// Space Management Commands
program
  .command("space")
  .description("Manage NexaFlow spaces")
  .action(() => {
    console.log(chalk.blue("NexaFlow Space Management"))
    console.log("Available commands:")
    console.log("  nexaflow space create    - Create a new space")
    console.log("  nexaflow space list      - List all spaces")
    console.log("  nexaflow space use       - Switch to a space")
    console.log("  nexaflow space info      - Show space information")
  })

program
  .command("space:create")
  .alias("space create")
  .description("Create a new NexaFlow space")
  .option("-n, --name <name>", "Space name")
  .option("-d, --description <description>", "Space description")
  .action(async (options) => {
    const spinner = ora("Creating NexaFlow space...").start()

    try {
      if (!auth.isLoggedIn()) {
        spinner.fail(chalk.red("Please login first: nexaflow login"))
        return
      }

      let name = options.name
      let description = options.description

      if (!name) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Space name:",
            validate: (input) => input.length > 0 || "Space name is required",
          },
          {
            type: "input",
            name: "description",
            message: "Space description (optional):",
          },
        ])
        name = answers.name
        description = answers.description
      }

      const spaceData = await space.create(name, description)
      spinner.succeed(chalk.green("Space created successfully!"))

      console.log(chalk.blue("\n📦 Space Details:"))
      console.log(chalk.gray(`Name: ${spaceData.name}`))
      console.log(chalk.gray(`ID: ${spaceData.id}`))
      console.log(chalk.gray(`DID: ${spaceData.did}`))
      console.log(chalk.gray(`Created: ${new Date(spaceData.created).toLocaleString()}`))

      if (description) {
        console.log(chalk.gray(`Description: ${description}`))
      }

      console.log(chalk.green("\n✅ Space is ready for uploads!"))
    } catch (error) {
      spinner.fail(chalk.red("Failed to create space"))
      console.error(chalk.red(error.message))
    }
  })

program
  .command("space:list")
  .alias("space list")
  .description("List all NexaFlow spaces")
  .action(async () => {
    const spinner = ora("Fetching spaces...").start()

    try {
      if (!auth.isLoggedIn()) {
        spinner.fail(chalk.red("Please login first: nexaflow login"))
        return
      }

      const spaces = await space.list()
      spinner.succeed(chalk.green(`Found ${spaces.length} spaces`))

      if (spaces.length === 0) {
        console.log(chalk.yellow("\n📦 No spaces found. Create one with: nexaflow space create"))
        return
      }

      console.log(chalk.blue("\n📦 Your NexaFlow Spaces:"))
      spaces.forEach((s, index) => {
        const current = s.current ? chalk.green("(current)") : ""
        console.log(`${index + 1}. ${chalk.bold(s.name)} ${current}`)
        console.log(`   ID: ${chalk.gray(s.id)}`)
        console.log(`   Files: ${chalk.gray(s.fileCount || 0)}`)
        console.log(`   Size: ${chalk.gray(s.totalSize || "0 B")}`)
        console.log("")
      })
    } catch (error) {
      spinner.fail(chalk.red("Failed to fetch spaces"))
      console.error(chalk.red(error.message))
    }
  })

program
  .command("space:use")
  .alias("space use")
  .description("Switch to a NexaFlow space")
  .argument("<space-id>", "Space ID or name")
  .action(async (spaceId) => {
    const spinner = ora("Switching space...").start()

    try {
      if (!auth.isLoggedIn()) {
        spinner.fail(chalk.red("Please login first: nexaflow login"))
        return
      }

      await space.use(spaceId)
      spinner.succeed(chalk.green(`Switched to space: ${spaceId}`))
    } catch (error) {
      spinner.fail(chalk.red("Failed to switch space"))
      console.error(chalk.red(error.message))
    }
  })

// Upload Commands
program
  .command("upload")
  .description("Upload files to NexaFlow IPFS")
  .argument("<files...>", "Files to upload")
  .option("-s, --space <space>", "Target space")
  .option("-t, --title <title>", "File title")
  .option("-d, --description <description>", "File description")
  .option("--tags <tags>", "Comma-separated tags")
  .action(async (files, options) => {
    const spinner = ora("Uploading files to IPFS...").start()

    try {
      if (!auth.isLoggedIn()) {
        spinner.fail(chalk.red("Please login first: nexaflow login"))
        return
      }

      const results = await upload.uploadFiles(files, {
        space: options.space,
        title: options.title,
        description: options.description,
        tags: options.tags?.split(","),
      })

      spinner.succeed(chalk.green(`Successfully uploaded ${results.length} files!`))

      console.log(chalk.blue("\n📁 Upload Results:"))
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${chalk.bold(result.name)}`)
        console.log(`   CID: ${chalk.green(result.cid)}`)
        console.log(`   Size: ${chalk.gray(result.size)}`)
        console.log(`   URL: ${chalk.blue(result.url)}`)
        console.log("")
      })
    } catch (error) {
      spinner.fail(chalk.red("Upload failed"))
      console.error(chalk.red(error.message))
    }
  })

// Identity Commands
program
  .command("identity")
  .description("Manage decentralized identities")
  .action(() => {
    console.log(chalk.blue("NexaFlow Identity Management"))
    console.log("Available commands:")
    console.log("  nexaflow identity create  - Create a new DID")
    console.log("  nexaflow identity list    - List all DIDs")
    console.log("  nexaflow identity verify  - Verify a DID")
  })

program
  .command("identity:create")
  .alias("identity create")
  .description("Create a new decentralized identity (DID)")
  .option("-m, --method <method>", "DID method", "key")
  .action(async (options) => {
    const spinner = ora("Creating new DID...").start()

    try {
      const did = await identity.create(options.method)
      spinner.succeed(chalk.green("DID created successfully!"))

      console.log(chalk.blue("\n🆔 New Identity:"))
      console.log(chalk.gray(`DID: ${did.id}`))
      console.log(chalk.gray(`Public Key: ${did.publicKey}`))
      console.log(chalk.yellow("\n⚠️  Keep your private key secure!"))
      console.log(chalk.gray(`Private Key: ${did.privateKey}`))
    } catch (error) {
      spinner.fail(chalk.red("Failed to create DID"))
      console.error(chalk.red(error.message))
    }
  })

// Utility Commands
program
  .command("status")
  .description("Show NexaFlow status")
  .action(async () => {
    const spinner = ora("Checking NexaFlow status...").start()

    try {
      const status = await client.getStatus()
      spinner.succeed(chalk.green("NexaFlow is online!"))

      console.log(chalk.blue("\n🌐 Network Status:"))
      console.log(chalk.gray(`Connected Peers: ${status.peers}`))
      console.log(chalk.gray(`Network Health: ${status.health}%`))
      console.log(chalk.gray(`Total Storage: ${status.totalStorage}`))
      console.log(chalk.gray(`Active Users: ${status.activeUsers}`))

      if (auth.isLoggedIn()) {
        console.log(chalk.green("\n✅ You are logged in"))
        console.log(chalk.gray(`DID: ${auth.getCurrentDID()}`))
      } else {
        console.log(chalk.yellow("\n⚠️  You are not logged in"))
        console.log(chalk.gray("Run: nexaflow login"))
      }
    } catch (error) {
      spinner.fail(chalk.red("Failed to get status"))
      console.error(chalk.red(error.message))
    }
  })

program
  .command("version")
  .description("Show version information")
  .action(() => {
    console.log(chalk.blue("NexaFlow CLI v1.0.0"))
    console.log(chalk.gray("Enterprise Decentralized Content Management"))
    console.log(chalk.gray("Built by MJ AHMAD under Nexara"))
    console.log(chalk.gray("https://mjnexaflow.vercel.app"))
  })

// Help command
program
  .command("help")
  .description("Show help information")
  .action(() => {
    console.log(chalk.blue("🚀 NexaFlow CLI - Quick Start Guide\n"))

    console.log(chalk.bold("1. Login to NexaFlow:"))
    console.log("   nexaflow login\n")

    console.log(chalk.bold("2. Create a space:"))
    console.log("   nexaflow space create\n")

    console.log(chalk.bold("3. Upload files:"))
    console.log("   nexaflow upload file1.txt file2.jpg\n")

    console.log(chalk.bold("4. List your spaces:"))
    console.log("   nexaflow space list\n")

    console.log(chalk.bold("5. Check status:"))
    console.log("   nexaflow status\n")

    console.log(chalk.gray("For more help: nexaflow --help"))
    console.log(chalk.gray("Documentation: https://docs.nexaflow.com"))
  })

// Error handling
program.on("command:*", () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(" ")}`))
  console.log(chalk.gray('Run "nexaflow help" for available commands'))
  process.exit(1)
})

// Parse arguments
program.parse()
