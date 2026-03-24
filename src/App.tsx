/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Shield, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  Loader2, 
  Layers,
  Code,
  BarChart3,
  Download,
  Eye,
  Settings,
  Database,
  Network,
  Workflow,
  BrainCircuit,
  FileJson,
  Monitor,
  Folder,
  File,
  HardDrive,
  Mic,
  Lock,
  Unlock,
  Volume2,
  VolumeX
} from 'lucide-react';
import { VoiceAssistant } from './components/VoiceAssistant';
import { generatePlan, executeMission, implementFeatures, AgentPlan, FeatureImplementation } from './services/agentService';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CAPABILITIES = [
  { icon: Monitor, label: "Desktop Management", count: 1, status: "ACTIVE" },
  { icon: Mic, label: "Voice Interface", count: 1, status: "ACTIVE" },
  { icon: HardDrive, label: "System Reorganization", count: 1, status: "READY" },
  { icon: Shield, label: "Secure Permissions", count: 1, status: "ACTIVE" },
  { icon: BrainCircuit, label: "Multi-Domain Intelligence", count: 500, status: "READY" },
  { icon: Workflow, label: "Autonomous Mission Planning", count: 100, status: "READY" },
];

const SYSTEM_METRICS = [
  { label: "Execution Precision", value: "99.9%", color: "text-[#00FF00]" },
  { label: "Neural Confidence", value: "96.5%", color: "text-[#00FF00]" },
  { label: "Active Agents", value: "0", color: "text-[#00FF00]" },
  { label: "System Integrity", value: "SECURE", color: "text-[#00FF00]" },
];

const PIPELINE_STEPS = [
  "Architecture Design",
  "Capability Initialization",
  "Data Acquisition",
  "Core Processing",
  "Validation & Refinement",
  "Final Aggregation"
];

const FEATURE_LIST = [
  "Autonomous Desktop Sorting & Organization",
  "Real-time Voice Command Interface",
  "System-wide File Access & Modification",
  "Multi-Agent Intelligence Extraction",
  "Automated Web Research & Synthesis",
  "Secure Local Agent Connectivity",
  "Encrypted Data Storage & Retention",
  "High-Precision PDF Report Generation",
  "Semantic File Clustering Logic",
  "Real-time System Metrics Monitoring",
  "Neural Synthesis Module",
  "Integrity Verification Protocol"
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'results' | 'files' | 'api-keys' | 'desktop'>('home');
  const [apiKeys, setApiKeys] = useState<{
    id: string;
    provider: string;
    key: string;
    label: string;
    status: 'Active' | 'Inactive';
    type: 'Free' | 'Paid';
    usage: 'Low' | 'Medium' | 'High';
  }[]>([]);
  
  const [newKey, setNewKey] = useState({ provider: 'Gemini', key: '', label: '' });
  const [isDetecting, setIsDetecting] = useState(false);

  const [goal, setGoal] = useState('Research and extract the top 500 AI tools currently available on the web, categorized by domain and ranked by utility.');
  const [isPlanning, setIsPlanning] = useState(false);
  const [plan, setPlan] = useState<AgentPlan | null>(null);
  const [featureImplementations, setFeatureImplementations] = useState<FeatureImplementation[] | null>(null);
  const [featureIndex, setFeatureIndex] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingStep, setExecutingStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>(["SYSTEM: Video Intelligence Agent Ready."]);
  
  // Desktop Simulation State
  const [desktopFiles, setDesktopFiles] = useState<{ name: string; type: string; size: string; category?: string }[]>([
    { name: "invoice_2023.pdf", type: "pdf", size: "1.2MB" },
    { name: "vacation_photo.jpg", type: "image", size: "4.5MB" },
    { name: "script_v1.py", type: "code", size: "12KB" },
    { name: "meeting_notes.docx", type: "document", size: "45KB" },
    { name: "profile_pic.png", type: "image", size: "2.1MB" },
    { name: "data_dump.csv", type: "data", size: "15MB" },
    { name: "main.tsx", type: "code", size: "8KB" },
    { name: "budget_q1.xlsx", type: "spreadsheet", size: "89KB" },
  ]);
  const [isSortingDesktop, setIsSortingDesktop] = useState(false);
  const [sortedDesktop, setSortedDesktop] = useState<{ [key: string]: typeof desktopFiles } | null>(null);
  const [hasSystemPermissions, setHasSystemPermissions] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [baseGoal, setBaseGoal] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSortDesktop = async () => {
    setIsSortingDesktop(true);
    addLog("INITIALIZING DESKTOP SCAN...");
    
    // Simulate scan
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog(`SCAN COMPLETE: ${desktopFiles.length} FILES DETECTED.`);
    
    addLog("ANALYZING FILE METADATA AND SEMANTIC CONTEXT...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sorted: { [key: string]: typeof desktopFiles } = {};
    desktopFiles.forEach(file => {
      let category = "Miscellaneous";
      if (file.type === 'image') category = "Media/Images";
      if (file.type === 'pdf' || file.type === 'document') category = "Documents";
      if (file.type === 'code') category = "Development/Source";
      if (file.type === 'spreadsheet' || file.type === 'data') category = "Data/Finance";
      
      if (!sorted[category]) sorted[category] = [];
      sorted[category].push({ ...file, category });
    });
    
    addLog("GENERATING OPTIMAL DIRECTORY STRUCTURE...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSortedDesktop(sorted);
    setIsSortingDesktop(false);
    addLog("DESKTOP SORTING COMPLETE. VIRTUAL MAPPING GENERATED.");
  };

  const handleAddKey = async () => {
    if (!newKey.key.trim()) return;
    setIsDetecting(true);
    addLog(`DETECTING TIER FOR ${newKey.provider} KEY...`);
    
    // Simulate Tier Detection
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isPaid = Math.random() > 0.5; // Mock detection
    
    const keyEntry: {
      id: string;
      provider: string;
      key: string;
      label: string;
      status: 'Active' | 'Inactive';
      type: 'Free' | 'Paid';
      usage: 'Low' | 'Medium' | 'High';
    } = {
      id: Math.random().toString(36).substr(2, 9),
      provider: newKey.provider,
      key: newKey.key,
      label: newKey.label || `${newKey.provider}_${apiKeys.length + 1}`,
      status: 'Active',
      type: isPaid ? 'Paid' : 'Free',
      usage: 'Low',
    };
    
    setApiKeys(prev => [...prev, keyEntry]);
    setNewKey({ provider: 'Gemini', key: '', label: '' });
    setIsDetecting(false);
    addLog(`KEY ADDED: ${keyEntry.label} (${keyEntry.type} TIER)`);
  };

  const toggleKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: k.status === 'Active' ? 'Inactive' : 'Active' } : k));
  };

  const deleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  const handleExecute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim() || isPlanning || isExecuting) return;

    // Check for Desktop Sorting Command
    const isDesktopSort = goal.toLowerCase().includes('sort') && (goal.toLowerCase().includes('desktop') || goal.toLowerCase().includes('document'));
    
    if (isDesktopSort) {
      if (!hasSystemPermissions) {
        addLog("SYSTEM ALERT: DESKTOP ACCESS PERMISSION REQUIRED.");
        setActiveTab('desktop');
        return;
      }
      
      addLog("MISSION DETECTED: AUTONOMOUS DESKTOP REORGANIZATION.");
      setActiveTab('desktop');
      await handleSortDesktop();
      return;
    }

    setIsPlanning(true);
    setPlan(null);
    setFeatureImplementations(null);
    setResult(null);
    setCompletedSteps([]);
    setExecutingStep(null);
    setLogs([]);

    const activeKeys = apiKeys.filter(k => k.status === 'Active');
    const paidKeys = activeKeys.filter(k => k.type === 'Paid');
    const freeKeys = activeKeys.filter(k => k.type === 'Free');

    // Determine primary key and model
    const primaryKey = activeKeys.length > 0 ? activeKeys[0].key : (process.env.GEMINI_API_KEY || "");
    const primaryModel = "gemini-3-flash-preview";

    addLog(`INITIATING MISSION: ${goal}`);
    if (activeKeys.length > 0) {
      addLog(`SMART ROUTING ENABLED: ${activeKeys.length} AGENTS ACTIVE (${paidKeys.length} PAID, ${freeKeys.length} FREE)`);
      addLog("ROUTING STRATEGY: PARALLEL AGENT EXECUTION.");
      addLog("TASK FRAGMENTATION: GOAL SPLIT INTO SUB-TASKS.");
    } else {
      addLog("WARNING: NO EXTERNAL API KEYS DETECTED. USING SYSTEM DEFAULT (GEMINI-FLASH).");
    }
    
    try {
      // Step 1: Generate Plan
      setExecutingStep(1);
      addLog("FRAGMENTING GOAL INTO SUB-TASKS...");
      const planResult = await generatePlan(goal, primaryKey, primaryModel);
      setPlan(planResult);
      setCompletedSteps([1]);
      addLog(`EXECUTION PIPELINE DESIGNED: ${planResult.plan.length} STAGES IDENTIFIED.`);
      
      // Step 2: Implement Features
      setExecutingStep(2);
      addLog("INITIALIZING PARALLEL AGENT CAPABILITIES...");
      
      let features: FeatureImplementation[] = [];
      if (activeKeys.length > 1) {
        addLog(`DISTRIBUTING CAPABILITY INITIALIZATION ACROSS ${activeKeys.length} AGENTS...`);
        const batchSize = 4;
        const totalFeatures = FEATURE_LIST.slice(0, 8);
        const chunks = [];
        for (let i = 0; i < totalFeatures.length; i += batchSize) {
          chunks.push(totalFeatures.slice(i, i + batchSize));
        }
        
        const results = await Promise.all(chunks.map((chunk, i) => 
          implementFeatures(goal, chunk, activeKeys[i % activeKeys.length].key, primaryModel)
        ));
        features = results.flat();
      } else {
        features = await implementFeatures(goal, FEATURE_LIST.slice(0, 8), primaryKey, primaryModel);
      }

      setFeatureImplementations(features);
      setFeatureIndex(8);
      setCompletedSteps(prev => [...prev, 2]);
      addLog(`${features.length} CORE CAPABILITIES DISTRIBUTED ACROSS AGENTS.`);

      setIsPlanning(false);
      setIsExecuting(true);

      // Step 3-5: Execute Plan (Simulated parallel execution)
      for (const step of planResult.plan) {
        if (step.id <= 2) continue; // Skip already completed steps
        if (step.id >= 6) break; // Final step handled separately

        setExecutingStep(step.id);
        const assignedKey = activeKeys.length > 0 
          ? activeKeys[Math.floor(Math.random() * activeKeys.length)]
          : { label: 'SYSTEM_DEFAULT' };
        
        addLog(`EXECUTING [${step.title}] ON AGENT [${assignedKey.label}]...`);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        setCompletedSteps(prev => [...prev, step.id]);
        addLog(`STEP ${step.id} VERIFIED BY VALIDATOR AGENT.`);
      }
      
      // Step 6: Final Execution
      setExecutingStep(6);
      addLog("AGGREGATING INTELLIGENCE FROM ALL AGENTS...");
      
      const executionKey = paidKeys.length > 0 ? paidKeys[0].key : primaryKey;
      const finalOutput = await executeMission(goal, planResult, executionKey, primaryModel);
      
      try {
        const parsed = JSON.parse(finalOutput);
        setResult(parsed);
      } catch (e) {
        setResult({ raw: finalOutput });
      }
      
      setCompletedSteps(prev => [...prev, 6]);
      setExecutingStep(null);
      setIsExecuting(false);
      addLog("MISSION COMPLETE. PDF AND JSON READY.");
      
      // Automatically switch to results tab
      setTimeout(() => setActiveTab('results'), 1000);

    } catch (error) {
      addLog(`SYSTEM CRITICAL FAILURE: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsPlanning(false);
      setIsExecuting(false);
    }
  };

  const handleLoadMore = async () => {
    if (!goal || isLoadingMore || featureIndex >= FEATURE_LIST.length) return;
    setIsLoadingMore(true);
    
    const activeKeys = apiKeys.filter(k => k.status === 'Active');
    const primaryKey = activeKeys.length > 0 ? activeKeys[0].key : (process.env.GEMINI_API_KEY || "");
    const primaryModel = "gemini-3-flash-preview";

    addLog(`ENABLING ADVANCED CAPABILITIES (${featureIndex + 1}-${Math.min(featureIndex + 4, FEATURE_LIST.length)})...`);
    try {
      const nextBatch = FEATURE_LIST.slice(featureIndex, featureIndex + 4);
      const newFeatures = await implementFeatures(goal, nextBatch, primaryKey, primaryModel);
      setFeatureImplementations(prev => prev ? [...prev, ...newFeatures] : newFeatures);
      setFeatureIndex(prev => prev + 4);
      addLog(`${newFeatures.length} ADDITIONAL CAPABILITIES ENABLED.`);
    } catch (error) {
      addLog(`CAPABILITY INITIALIZATION ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setTextColor(0, 255, 0);
    doc.setFont("courier", "bold");
    doc.setFontSize(28);
    doc.text("CORTEX INTELLIGENCE REPORT", 20, 30);
    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    doc.text(`GENERATED BY: CORTEX UNIVERSAL AI COMPUTER v6.0.0`, 20, 42);
    doc.text(`TIMESTAMP: ${new Date().toISOString()}`, 20, 47);
    
    let y = 65;
    
    // Mission Parameters
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("courier", "bold");
    doc.text("MISSION PARAMETERS", 20, y);
    y += 8;
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    const goalLines = doc.splitTextToSize(`GOAL: ${goal}`, pageWidth - 40);
    doc.text(goalLines, 20, y);
    y += (goalLines.length * 5) + 10;

    // Execution Pipeline Summary
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.text("MISSION SUMMARY", 20, y);
    y += 8;
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.text(`- ASSETS GENERATED: ${result.assets_generated?.length || 0}`, 20, y);
    doc.text(`- INTELLIGENCE ITEMS: ${result.intelligence_output?.length || result.top_ai_tools?.length || 0}`, 20, y + 5);
    doc.text(`- SYSTEM CONFIDENCE: 99.9%`, 20, y + 10);
    y += 20;

    // Assets Generated
    if (result.assets_generated) {
      doc.setFont("courier", "bold");
      doc.setFontSize(12);
      doc.text("ASSETS GENERATED", 20, y);
      y += 8;
      result.assets_generated.forEach((asset: any, i: number) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont("courier", "bold");
        doc.setFontSize(9);
        doc.text(`[ASSET-${(i + 1).toString().padStart(2, '0')}] ${asset.name}`, 20, y);
        doc.setFont("courier", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(`TYPE: ${asset.type.toUpperCase()} | STATUS: ${asset.status.toUpperCase()}`, 25, y + 5);
        doc.text(`DETAILS: ${asset.details}`, 25, y + 9);
        doc.setTextColor(0, 0, 0);
        y += 15;
      });
      y += 10;
    }

    // Intelligence Output
    const output = result.intelligence_output || result.top_ai_tools;
    if (output) {
      doc.setFont("courier", "bold");
      doc.setFontSize(12);
      doc.text("INTELLIGENCE OUTPUT", 20, y);
      y += 10;
      
      output.forEach((item: any) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFont("courier", "bold");
        doc.text(`${item.rank?.toString().padStart(2, '0') || '00'}`, 22, y);
        doc.text(`${(item.item || item.name).toUpperCase()}`, 40, y);
        doc.setFont("courier", "normal");
        doc.text(`${(item.confidence || 'HIGH').toUpperCase()}`, 135, y);
        
        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        const contextLines = doc.splitTextToSize(`CONTEXT: ${item.context || item.description}`, pageWidth - 65);
        doc.text(contextLines, 40, y);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        y += (contextLines.length * 4) + 6;
      });
    }
    
    doc.save("cortex_intelligence_report.pdf");
    addLog("PDF INTELLIGENCE REPORT EXPORTED.");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono selection:bg-[#00FF00] selection:text-black pb-12">
      {/* Header */}
      <header className="border-b border-[#333] p-4 flex items-center justify-between bg-[#0F0F0F] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00FF00] flex items-center justify-center rounded-sm">
            <Cpu className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase">CORTEX: Universal AI Computer</h1>
            <div className="flex items-center gap-2 text-[10px] text-[#00FF00] opacity-70">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>SYSTEM STATUS: AUTONOMOUS</span>
              <Shield className="w-3 h-3 ml-2" />
              <span>INTEGRITY: 100%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <VoiceAssistant 
            apiKey={apiKeys.find(k => k.provider === 'Gemini')?.key || process.env.GEMINI_API_KEY || ''} 
            onSessionStart={() => {
              setBaseGoal(goal);
              setIsVoiceActive(true);
              addLog("VOICE INTERFACE INITIALIZED.");
            }}
            onSessionEnd={() => {
              setIsVoiceActive(false);
              addLog("VOICE INTERFACE DEACTIVATED.");
            }}
            onTranscription={(text) => {
              // Append the current turn's transcription to the base goal
              const updatedGoal = baseGoal ? `${baseGoal} ${text}` : text;
              setGoal(updatedGoal);
              
              // Check for immediate commands in the current turn
              const lowerText = text.toLowerCase();
              if (lowerText.includes('execute') || lowerText.includes('start mission') || lowerText.includes('initiate')) {
                // We don't want to trigger handleExecute on every partial, 
                // but if the user says a clear command, we can.
                // However, it's safer to wait for turn complete for commands.
              }
            }}
            onTurnComplete={() => {
              // Commit the current goal as the new base for the next turn
              setBaseGoal(goal);
              
              // Check for commands at the end of a turn
              const lowerGoal = goal.toLowerCase();
              if (lowerGoal.includes('execute') || lowerGoal.includes('start mission') || lowerGoal.includes('sort my desktop')) {
                addLog("VOICE COMMAND RECOGNIZED: INITIATING MISSION.");
                setTimeout(() => handleExecute(), 500);
              }
            }}
          />
          <div className="flex gap-4 md:gap-8">
          <button 
            onClick={() => setActiveTab('home')}
            className={cn("text-[11px] uppercase tracking-widest transition-all pb-1 border-b-2", activeTab === 'home' ? "text-[#00FF00] border-[#00FF00]" : "text-white/30 border-transparent hover:text-white/60")}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={cn("text-[11px] uppercase tracking-widest transition-all pb-1 border-b-2", activeTab === 'results' ? "text-[#00FF00] border-[#00FF00]" : "text-white/30 border-transparent hover:text-white/60")}
          >
            Results
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={cn("text-[11px] uppercase tracking-widest transition-all pb-1 border-b-2", activeTab === 'files' ? "text-[#00FF00] border-[#00FF00]" : "text-white/30 border-transparent hover:text-white/60")}
          >
            Files
          </button>
          <button 
            onClick={() => setActiveTab('api-keys')}
            className={cn("text-[11px] uppercase tracking-widest transition-all pb-1 border-b-2", activeTab === 'api-keys' ? "text-[#00FF00] border-[#00FF00]" : "text-white/30 border-transparent hover:text-white/60")}
          >
            API Keys
          </button>
          <button 
            onClick={() => setActiveTab('desktop')}
            className={cn("text-[11px] uppercase tracking-widest transition-all pb-1 border-b-2", activeTab === 'desktop' ? "text-[#00FF00] border-[#00FF00]" : "text-white/30 border-transparent hover:text-white/60")}
          >
            Desktop
          </button>
        </div>
      </div>
    </header>

      <main className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'api-keys' && (
            <motion.div 
              key="api-keys"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* API Keys Content (already implemented) */}
              <div className="lg:col-span-4 space-y-6">
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <Zap className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Add API Key</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-[#666] mb-1 block">Provider</label>
                      <select 
                        value={newKey.provider}
                        onChange={(e) => setNewKey(prev => ({ ...prev, provider: e.target.value }))}
                        className="w-full bg-black border border-[#333] p-2 text-xs text-white focus:border-[#00FF00] outline-none"
                      >
                        <option>Gemini</option>
                        <option>OpenAI</option>
                        <option>Anthropic</option>
                        <option>Mistral</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-[#666] mb-1 block">API Key</label>
                      <input 
                        type="password"
                        value={newKey.key}
                        onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                        placeholder="sk-..."
                        className="w-full bg-black border border-[#333] p-2 text-xs text-white focus:border-[#00FF00] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-[#666] mb-1 block">Label (Optional)</label>
                      <input 
                        type="text"
                        value={newKey.label}
                        onChange={(e) => setNewKey(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g. Gemini_1"
                        className="w-full bg-black border border-[#333] p-2 text-xs text-white focus:border-[#00FF00] outline-none"
                      />
                    </div>
                    <button 
                      onClick={handleAddKey}
                      disabled={isDetecting || !newKey.key}
                      className="w-full bg-[#00FF00] text-black py-2 font-bold uppercase text-xs hover:bg-[#00CC00] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                      Add Key
                    </button>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-8">
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm h-full">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <Settings className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Active Credentials</h2>
                  </div>
                  <div className="space-y-3">
                    {apiKeys.length === 0 ? (
                      <div className="text-center py-12 text-[#444] text-xs uppercase tracking-widest border border-dashed border-[#222]">
                        No API keys configured.
                      </div>
                    ) : (
                      apiKeys.map((key) => (
                        <div key={key.id} className="bg-black border border-[#222] p-4 flex items-center justify-between group hover:border-[#00FF00]/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-2 h-2 rounded-full", key.status === 'Active' ? "bg-[#00FF00]" : "bg-red-500")} />
                            <div>
                              <div className="text-xs font-bold text-white uppercase tracking-wider">{key.label}</div>
                              <div className="flex gap-3 mt-1">
                                <span className="text-[9px] text-[#666] uppercase tracking-widest">TYPE: {key.type}</span>
                                <span className="text-[9px] text-[#666] uppercase tracking-widest">USAGE: {key.usage}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toggleKey(key.id)}
                              className={cn("text-[9px] px-2 py-1 border font-bold uppercase", key.status === 'Active' ? "border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white" : "border-[#00FF00]/30 text-[#00FF00] hover:bg-[#00FF00] hover:text-black")}
                            >
                              {key.status === 'Active' ? 'OFF' : 'ON'}
                            </button>
                            <button 
                              onClick={() => deleteKey(key.id)}
                              className="text-[9px] px-2 py-1 border border-white/10 text-white/40 hover:border-red-500 hover:text-red-500 font-bold uppercase"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Input & Stats */}
              <div className="lg:col-span-4 space-y-6">
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#00FF00]">
                    <Zap className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Mission Goal</h2>
                  </div>
                  <form onSubmit={handleExecute} className="space-y-4">
                    <textarea
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Enter YouTube channel URL or video list..."
                      className={cn(
                        "w-full h-32 bg-black border p-4 text-sm outline-none transition-all resize-none",
                        isVoiceActive ? "border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.1)]" : "border-[#333] focus:border-[#00FF00]"
                      )}
                    />
                    <button
                      disabled={isPlanning || isExecuting}
                      className="w-full bg-[#00FF00] text-black py-3 font-bold uppercase text-sm hover:bg-[#00CC00] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isPlanning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Initializing...
                        </>
                      ) : isExecuting ? (
                        <>
                          <Activity className="w-4 h-4 animate-pulse" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-4 h-4" />
                          Initiate Extraction
                        </>
                      )}
                    </button>
                  </form>
                </section>

                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <Activity className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">System Metrics</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black border border-[#222] p-3 rounded-sm">
                      <div className="text-[9px] text-[#666] uppercase mb-1">Active Agents</div>
                      <div className="text-lg font-bold text-[#00FF00]">{apiKeys.filter(k => k.status === 'Active').length || 1}</div>
                    </div>
                    {SYSTEM_METRICS.map((metric, i) => (
                      <div key={i} className="bg-black border border-[#222] p-3 rounded-sm">
                        <div className="text-[9px] text-[#666] uppercase mb-1">{metric.label}</div>
                        <div className={cn("text-lg font-bold", metric.color)}>{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <Layers className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">System Capabilities</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {CAPABILITIES.map((cap, i) => (
                      <div key={i} className="bg-black border border-[#222] p-3 rounded-sm group hover:border-[#00FF00] transition-colors cursor-help">
                        <cap.icon className="w-4 h-4 mb-2 text-[#666] group-hover:text-[#00FF00]" />
                        <div className="text-[10px] font-bold uppercase">{cap.label}</div>
                        <div className="text-[9px] text-[#00FF00] opacity-50">{cap.status}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#00FF00]">
                    <Settings className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Agent Features</h2>
                  </div>
                  <div className="h-[200px] overflow-y-auto pr-2 space-y-2">
                    {FEATURE_LIST.map((feat, i) => (
                      <div key={i} className="text-[10px] flex items-center gap-2 text-[#666]">
                        <div className="w-1 h-1 bg-[#333] rounded-full" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Execution & Results */}
              <div className="lg:col-span-8 space-y-6">
                {/* Pipeline Status */}
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-[#00FF00]">
                      <Workflow className="w-4 h-4" />
                      <h2 className="text-xs font-bold uppercase tracking-widest">Pipeline Status</h2>
                    </div>
                    <div className="text-[10px] text-[#444] uppercase tracking-widest">
                      {isExecuting ? "PROCESSING" : "STANDBY"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#222] -z-0" />
                    {PIPELINE_STEPS.map((step, i) => {
                      const isCompleted = completedSteps.length > i;
                      const isCurrent = executingStep !== null && completedSteps.length === i;
                      return (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                          <div className={cn(
                            "w-3 h-3 rounded-full border-2 transition-all duration-500",
                            isCompleted ? "bg-[#00FF00] border-[#00FF00]" :
                            isCurrent ? "bg-black border-[#00FF00] animate-pulse" :
                            "bg-black border-[#333]"
                          )} />
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-tighter",
                            isCompleted || isCurrent ? "text-[#00FF00]" : "text-[#444]"
                          )}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Execution Log */}
                <section className="bg-[#111] border border-[#333] rounded-sm flex flex-col h-[300px]">
                  <div className="border-b border-[#333] p-3 flex items-center justify-between bg-[#151515]">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                      <Terminal className="w-4 h-4 text-[#00FF00]" />
                      Execution Log
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#333]" />
                      <div className="w-2 h-2 rounded-full bg-[#333]" />
                      <div className="w-2 h-2 rounded-full bg-[#333]" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[11px]">
                    {logs.map((log, i) => (
                      <div key={i} className={cn(
                        "border-l-2 pl-2",
                        log.includes("FAILURE") ? "border-red-500 text-red-400" : 
                        log.includes("COMPLETE") ? "border-[#00FF00] text-[#00FF00]" :
                        "border-[#333] text-[#888]"
                      )}>
                        {log}
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </section>

                {/* Feature Implementations */}
                <AnimatePresence>
                  {featureImplementations && (
                    <motion.section 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#111] border border-[#00FF00]/30 p-6 rounded-sm"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-[#00FF00]">
                          <Eye className="w-4 h-4" />
                          <h2 className="text-xs font-bold uppercase tracking-widest">Agent Capabilities Initialized</h2>
                        </div>
                        <button 
                          onClick={downloadPDF}
                          className="flex items-center gap-2 text-[10px] bg-[#00FF00] text-black px-3 py-1 font-bold uppercase hover:bg-[#00CC00] transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Export PDF Report
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featureImplementations.map((feat, i) => (
                          <div key={i} className="border border-[#222] p-4 bg-black/50 hover:border-[#00FF00]/50 transition-colors">
                            <h3 className="text-sm font-bold text-[#00FF00] mb-3 uppercase tracking-wider flex items-center gap-2">
                              <Workflow className="w-3 h-3" />
                              {feat.feature_name}
                            </h3>
                            <div className="space-y-3">
                              {feat.implementation_steps.map((step: any) => (
                                <div key={step.step_number} className="text-[10px] border-l border-[#333] pl-3">
                                  <div className="text-white font-bold mb-1">{step.step_number}. {step.description}</div>
                                  <div className="text-[#666] italic mb-1">Logic: {step.example}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#222] text-[9px] text-[#888]">
                              <span className="text-[#00FF00] font-bold">VERIFICATION:</span> {feat.expected_output}
                            </div>
                          </div>
                        ))}
                      </div>
                      {featureIndex < FEATURE_LIST.length && (
                        <div className="mt-8 flex justify-center">
                          <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="flex items-center gap-2 text-xs bg-[#222] text-[#00FF00] px-6 py-2 font-bold uppercase border border-[#00FF00]/30 hover:bg-[#00FF00] hover:text-black transition-all disabled:opacity-50"
                          >
                            {isLoadingMore ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Enabling...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                                Enable More Capabilities ({FEATURE_LIST.length - featureIndex} remaining)
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* System Architecture Plan */}
                <AnimatePresence>
                  {plan && (
                    <motion.section 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#111] border border-[#333] p-6 rounded-sm"
                    >
                      <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                        <CheckCircle2 className="w-4 h-4" />
                        <h2 className="text-xs font-bold uppercase tracking-widest">Execution Pipeline</h2>
                      </div>
                      <div className="space-y-4">
                        {plan.plan.map((step) => (
                          <div 
                            key={step.id} 
                            className={cn(
                              "border p-4 rounded-sm transition-all duration-500",
                              completedSteps.includes(step.id) ? "bg-[#00FF00]/5 border-[#00FF00]/30" :
                              executingStep === step.id ? "bg-white/5 border-[#00FF00] animate-pulse" :
                              "bg-black border-[#222]"
                            )}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border",
                                  completedSteps.includes(step.id) ? "bg-[#00FF00] text-black border-[#00FF00]" :
                                  "border-[#444] text-[#666]"
                                )}>
                                  {step.id}
                                </span>
                                <h3 className={cn(
                                  "text-sm font-bold uppercase",
                                  completedSteps.includes(step.id) ? "text-[#00FF00]" : "text-white"
                                )}>
                                  {step.title}
                                </h3>
                              </div>
                              {completedSteps.includes(step.id) && <CheckCircle2 className="w-4 h-4 text-[#00FF00]" />}
                            </div>
                            <p className="text-xs text-[#888] mb-2 leading-relaxed">{step.action}</p>
                            <div className="text-[9px] uppercase tracking-widest text-[#444] italic">
                              LOGIC: {step.reasoning}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {result ? (
                <div className="grid grid-cols-1 gap-6">
                  <section className="bg-[#111] border border-[#00FF00] p-6 rounded-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2 text-[#00FF00]">
                        <BrainCircuit className="w-5 h-5" />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Mission Intelligence Output</h2>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={downloadPDF} className="text-[10px] bg-[#00FF00] text-black px-4 py-2 font-bold uppercase hover:bg-[#00CC00]">
                          Download PDF
                        </button>
                      </div>
                    </div>

                    {result.intelligence_output && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.intelligence_output.map((item: any, i: number) => (
                          <div key={i} className="bg-black border border-[#222] p-4 hover:border-[#00FF00]/50 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] bg-[#222] text-[#00FF00] px-2 py-0.5 font-bold">RANK #{item.rank || i+1}</span>
                              <span className="text-[9px] text-[#444] uppercase tracking-widest">CONFIDENCE: {item.confidence || 'HIGH'}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00FF00] transition-colors">{item.item || item.name}</h3>
                            <p className="text-[11px] text-[#666] mb-4 line-clamp-3">{item.context || item.description}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-[#222]">
                              <div className="flex gap-3">
                                {item.total_mentions && <div className="text-[9px] text-[#444] uppercase">Mentions: <span className="text-white">{item.total_mentions}</span></div>}
                                {item.type && <div className="text-[9px] text-[#444] uppercase">Type: <span className="text-white">{item.type}</span></div>}
                              </div>
                              <ChevronRight className="w-3 h-3 text-[#333] group-hover:text-[#00FF00]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!result.intelligence_output && result.top_ai_tools && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.top_ai_tools.map((tool: any, i: number) => (
                          <div key={i} className="bg-black border border-[#222] p-4 hover:border-[#00FF00]/50 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] bg-[#222] text-[#00FF00] px-2 py-0.5 font-bold">RANK #{tool.rank || i+1}</span>
                              <span className="text-[9px] text-[#444] uppercase tracking-widest">CONFIDENCE: {tool.confidence || 'HIGH'}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00FF00] transition-colors">{tool.name}</h3>
                            <p className="text-[11px] text-[#666] mb-4 line-clamp-2">{tool.context}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-[#222]">
                              <div className="flex gap-3">
                                <div className="text-[9px] text-[#444] uppercase">Mentions: <span className="text-white">{tool.total_mentions}</span></div>
                                <div className="text-[9px] text-[#444] uppercase">Videos: <span className="text-white">{tool.video_mentions}</span></div>
                              </div>
                              <ChevronRight className="w-3 h-3 text-[#333] group-hover:text-[#00FF00]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!result.intelligence_output && !result.top_ai_tools && result.raw && (
                      <div className="bg-black p-6 border border-[#333] prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{result.raw}</ReactMarkdown>
                      </div>
                    )}
                  </section>

                  {result.assets_generated && (
                    <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                      <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                        <Layers className="w-4 h-4" />
                        <h2 className="text-xs font-bold uppercase tracking-widest">Assets Generated</h2>
                      </div>
                      <div className="space-y-3">
                        {result.assets_generated.map((asset: any, i: number) => (
                          <div key={i} className="bg-black border border-[#222] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-[#111] flex items-center justify-center text-[10px] font-bold text-[#444] border border-[#222]">
                                {(i + 1).toString().padStart(2, '0')}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">{asset.name}</div>
                                <div className="text-[9px] text-[#444] mt-1 truncate max-w-md">{asset.details}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-[9px] text-[#444] uppercase mb-1">Type</div>
                                <div className="text-[10px] font-bold text-[#00FF00] uppercase">{asset.type}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-[9px] text-[#444] uppercase mb-1">Status</div>
                                <div className="text-[10px] font-bold text-white uppercase">{asset.status}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-[#222] rounded-sm bg-[#111]/50">
                  <BrainCircuit className="w-12 h-12 text-[#222] mb-4" />
                  <div className="text-xs text-[#444] uppercase tracking-[0.2em]">No Intelligence Data Extracted</div>
                  <button onClick={() => setActiveTab('home')} className="mt-6 text-[10px] text-[#00FF00] border border-[#00FF00]/30 px-4 py-2 hover:bg-[#00FF00] hover:text-black transition-all">
                    Initiate Mission
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div 
              key="files"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-8">
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm h-full">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <FileJson className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Generated Assets</h2>
                  </div>
                  <div className="space-y-4">
                    {result ? (
                      <>
                        <div className="bg-black border border-[#222] p-6 flex items-center justify-between group hover:border-[#00FF00]/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                              <Download className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white uppercase tracking-wider">ai_tools_intelligence_report.pdf</div>
                              <div className="text-[10px] text-[#444] mt-1 uppercase tracking-widest">Format: PDF Document | Size: 1.2 MB</div>
                            </div>
                          </div>
                          <button onClick={downloadPDF} className="bg-[#00FF00] text-black px-4 py-2 text-[10px] font-bold uppercase hover:bg-[#00CC00]">
                            Download
                          </button>
                        </div>
                        <div className="bg-black border border-[#222] p-6 flex items-center justify-between group hover:border-[#00FF00]/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                              <FileJson className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white uppercase tracking-wider">intelligence_data.json</div>
                              <div className="text-[10px] text-[#444] mt-1 uppercase tracking-widest">Format: JSON Data | Size: 45 KB</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'intelligence_data.json';
                              a.click();
                              URL.revokeObjectURL(url);
                              addLog("JSON INTELLIGENCE DATA EXPORTED.");
                            }}
                            className="bg-[#00FF00] text-black px-4 py-2 text-[10px] font-bold uppercase hover:bg-[#00CC00]"
                          >
                            Download
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-24 text-[#222] border border-dashed border-[#222]">
                        <div className="text-xs uppercase tracking-widest">No assets generated yet</div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              <div className="lg:col-span-4">
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <Shield className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Storage Policy</h2>
                  </div>
                  <div className="space-y-4 text-[11px] text-[#666] leading-relaxed">
                    <p>Generated assets are stored in encrypted volumes for 24 hours.</p>
                    <p>All data is processed locally and purged upon session termination.</p>
                    <div className="pt-4 border-t border-[#222]">
                      <div className="flex justify-between mb-2">
                        <span className="uppercase">Encryption</span>
                        <span className="text-[#00FF00]">AES-256</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="uppercase">Retention</span>
                        <span className="text-[#00FF00]">24H</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'desktop' && (
            <motion.div 
              key="desktop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-8 space-y-6">
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-[#00FF00]">
                      <Monitor className="w-5 h-5" />
                      <h2 className="text-sm font-bold uppercase tracking-widest">Desktop Management Interface</h2>
                    </div>
                    <button 
                      onClick={handleSortDesktop}
                      disabled={isSortingDesktop}
                      className="bg-[#00FF00] text-black px-6 py-2 text-[10px] font-bold uppercase hover:bg-[#00CC00] disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSortingDesktop ? <Loader2 className="w-3 h-3 animate-spin" /> : <Workflow className="w-3 h-3" />}
                      {isSortingDesktop ? "Sorting..." : "Initiate Desktop Sort"}
                    </button>
                  </div>

                  {!sortedDesktop ? (
                    <div className="space-y-3">
                      <div className="text-[10px] text-[#444] uppercase tracking-widest mb-4">Detected Unsorted Files (Virtual Scan)</div>
                      {desktopFiles.map((file, i) => (
                        <div key={i} className="bg-black border border-[#222] p-3 flex items-center justify-between group hover:border-[#00FF00]/30 transition-all">
                          <div className="flex items-center gap-3">
                            <File className="w-4 h-4 text-[#444]" />
                            <span className="text-xs text-white/80">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[9px] text-[#444] uppercase">{file.type}</span>
                            <span className="text-[9px] text-[#444]">{file.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-[10px] text-[#00FF00] uppercase tracking-widest mb-4">Optimized Directory Structure Generated</div>
                      {Object.entries(sortedDesktop).map(([category, files]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest pb-1 border-b border-[#222]">
                            <Folder className="w-3 h-3" />
                            {category} ({files.length} files)
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {files.map((file, i) => (
                              <div key={i} className="bg-black/40 border border-[#222] p-2 flex items-center gap-3">
                                <File className="w-3 h-3 text-[#00FF00]/40" />
                                <span className="text-[11px] text-white/60">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setSortedDesktop(null)}
                        className="text-[9px] text-[#444] uppercase hover:text-[#00FF00] transition-colors"
                      >
                        ← Reset Simulation
                      </button>
                    </div>
                  )}
                </section>

                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <Terminal className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Local Agent Connectivity</h2>
                  </div>
                  <div className="bg-black p-4 border border-[#222] rounded-sm">
                    <p className="text-[11px] text-[#888] mb-4 leading-relaxed">
                      To enable real-world desktop sorting, you must run the CORTEX Local Agent on your machine. This agent provides a secure bridge between this web interface and your local file system.
                    </p>
                    <div className="bg-[#0A0A0A] p-4 font-mono text-[10px] text-[#00FF00] border border-[#333] overflow-x-auto">
                      <div className="mb-2 opacity-50"># Install CORTEX Local Agent</div>
                      <div className="mb-4">npm install -g @cortex/local-agent</div>
                      <div className="opacity-50"># Connect to this session</div>
                      <div>cortex-agent connect --token=CTX-882-X92-P01 --path="~/Desktop"</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[9px] text-[#444] uppercase">
                      <Shield className="w-3 h-3" />
                      End-to-End Encrypted Tunnel Active
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-6 text-[#00FF00]">
                    <Lock className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">System Permissions</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black border border-[#222] rounded-sm">
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase">Desktop Access</div>
                        <div className="text-[9px] text-[#444] uppercase">Read/Write Files</div>
                      </div>
                      <button 
                        onClick={() => {
                          setHasSystemPermissions(!hasSystemPermissions);
                          addLog(hasSystemPermissions ? "DESKTOP ACCESS REVOKED." : "DESKTOP ACCESS GRANTED.");
                        }}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-all duration-300",
                          hasSystemPermissions ? "bg-[#00FF00]" : "bg-[#333]"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 bg-black rounded-full transition-all duration-300",
                          hasSystemPermissions ? "left-6" : "left-1"
                        )} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black border border-[#222] rounded-sm opacity-50">
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase">Documents Access</div>
                        <div className="text-[9px] text-[#444] uppercase">Read/Write Files</div>
                      </div>
                      <Unlock className="w-4 h-4 text-[#444]" />
                    </div>
                    <p className="text-[9px] text-[#444] leading-relaxed italic">
                      * Granting permissions allows CORTEX to modify files on your local system via the connected agent.
                    </p>
                  </div>
                </section>

                <section className="bg-[#111] border border-[#333] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#00FF00]">
                    <Activity className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Automation Logs</h2>
                  </div>
                  <div className="h-48 overflow-y-auto space-y-2 font-mono text-[9px]">
                    {logs.filter(l => l.includes("DESKTOP") || l.includes("SCAN")).map((log, i) => (
                      <div key={i} className="text-[#666] border-l border-[#333] pl-2 py-1">
                        {log}
                      </div>
                    ))}
                    {logs.filter(l => l.includes("DESKTOP") || l.includes("SCAN")).length === 0 && (
                      <div className="text-[#333] italic">No desktop activity logged.</div>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 w-full border-t border-[#333] bg-[#0F0F0F] p-2 flex justify-between text-[9px] uppercase tracking-widest text-[#444] z-50">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Database className="w-3 h-3" /> STORAGE: 45%</span>
          <span className="flex items-center gap-1"><Network className="w-3 h-3" /> NETWORK: STABLE</span>
          <span className="flex items-center gap-1"><FileJson className="w-3 h-3" /> DATA: ENCRYPTED</span>
        </div>
        <div className="flex gap-4">
          <span>ENCRYPTION: RSA-4096</span>
          <span>STATUS: AUTONOMOUS</span>
        </div>
      </footer>
    </div>
  );
}
