"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Trash2, Sparkles, Bot } from "lucide-react"

interface EnvVariable {
  id: string
  name: string
  value: string
}

export default function CreateSwarmPage() {
  const [platform, setPlatform] = useState("discord")
  const [hostingLocation, setHostingLocation] = useState("gemini")
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([
    { id: "1", name: "DISCORD_TOKEN", value: "" },
    { id: "2", name: "DISCORD_APP_ID", value: "" },
    { id: "3", name: "GEMINI_API_KEY", value: "" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const addEnvVariable = () => {
    const newId = Date.now().toString()
    setEnvVariables([...envVariables, { id: newId, name: "", value: "" }])
  }

  const removeEnvVariable = (id: string) => {
    if (envVariables.length > 1) {
      setEnvVariables(envVariables.filter((env) => env.id !== id))
    }
  }

  const updateEnvVariable = (id: string, field: "name" | "value", value: string) => {
    setEnvVariables(envVariables.map((env) => (env.id === id ? { ...env, [field]: value } : env)))
  }

  const handleDeploy = async () => {
    setIsLoading(true)
    setShowSuccess(false)

    try {
      console.log("Deploying swarm with:", { platform, hostingLocation, envVariables })

      const response = await fetch('http://localhost:3002/api/deploy-swarm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          hostingLocation,
          envVariables
        })
      })
    
      const result = await response.json()

      if (result.success) {
        setIsLoading(false)
        setShowSuccess(true)
        console.log("Deployment successful:", result)

        setTimeout(() => {
          setShowSuccess(false)
        }, 5000)
      } else {
        throw new Error(result.message || 'Deployment failed')
      }
      } catch (error) {
        setIsLoading(false)
        console.error("Deployment error:", error)
        alert(`Deployment failed: ${error}`)
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              DaoDiplomats
            </span>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Agent Swarm
            </h1>
            <p className="text-gray-600 text-lg">Configure your intelligent agent swarm for DAO governance</p>
          </div>

          {/* Configuration Form */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Swarm Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Platform Selection */}
              <div className="space-y-3">
                <Label htmlFor="platform" className="text-lg font-semibold text-gray-700">
                  Platform to Interact With
                </Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-purple-400 transition-colors">
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="discord">Discord</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="farcaster">Farcaster</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="custom">custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hosting Location */}
              <div className="space-y-3">
                <Label htmlFor="hosting" className="text-lg font-semibold text-gray-700">
                  Agent Hosting Location
                </Label>
                <Select value={hostingLocation} onValueChange={setHostingLocation}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-purple-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="gemini">Gemini (Recommended)</SelectItem>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="localhost">Localhost</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Environment Variables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold text-gray-700">Environment Variables</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEnvVariable}
                    className="rounded-full bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Variable
                  </Button>
                </div>

                <div className="space-y-3">
                  {envVariables.map((envVar) => (
                    <Card key={envVar.id} className="bg-gray-50/50 border border-gray-200 rounded-xl">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-600">Name</Label>
                            <Input
                              placeholder="Variable name"
                              value={envVar.name}
                              onChange={(e) => updateEnvVariable(envVar.id, "name", e.target.value)}
                              className="rounded-lg border-gray-300 focus:border-purple-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-gray-600">Value</Label>
                              {envVariables.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEnvVariable(envVar.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <Input
                              type="password"
                              placeholder="Variable value"
                              value={envVar.value}
                              onChange={(e) => updateEnvVariable(envVar.id, "value", e.target.value)}
                              className="rounded-lg border-gray-300 focus:border-purple-400"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Deploy Button */}
              <div className="pt-6">
                <Button
                  onClick={handleDeploy}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!platform || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5 mr-2" />
                      Deploy Swarm
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Success Notification */}
          {showSuccess && (
            <div className="fixed bottom-4 right-4 z-50">
              <Alert className="bg-green-100 border-green-400 text-green-800 rounded-xl shadow-lg">
                <AlertDescription className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Swarm Deployed Successfully!
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 flex items-center gap-3">
                <svg
                  className="animate-spin h-8 w-8 text-purple-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-lg font-semibold text-gray-800">Deploying Swarm...</span>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-0 rounded-2xl">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Smart Coordination</h3>
                <p className="text-sm text-gray-600">
                  Agents automatically coordinate across platforms for optimal governance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-0 rounded-2xl">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Adaptive Learning</h3>
                <p className="text-sm text-gray-600">Swarm intelligence improves decision-making over time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
}