export interface PitchContent {
  type: 'speech' | 'stage';
  text: string;
}

export interface PitchSlide {
  number: number;
  title: string;
  duration: string;
  content: PitchContent[];
}

export interface ProjectSession {
  id: string;
  title: string;
  description: string;
  created: string;
  research: Record<string, any>;
  architecture: string;
  pitch: PitchSlide[];
}

export const mockSessions: ProjectSession[] = [
  {
    id: "copilot",
    title: "The Innovator's Co-Pilot",
    description: "Multi-agent concierge system for hackathon teams to extract intelligence, design systems, and draft pitches.",
    created: "2 mins ago",
    research: {
      project_meta: {
        codename: "InnovatorsCoPilot",
        target_hackathon: "Global AI Hackathon 2026",
        concierge_type: "Multi-Agent Coordinator"
      },
      problem_validation: {
        target_pain_point: "Hackathon teams waste 60% of their 48 hours on administrative alignment, manual architecture diagramming, and script drafting.",
        validated_need: "Automated, immediate conversion of a single idea sentence/URL/doc into structured research, production-ready system architecture, and slide-ready script.",
        market_fit: "12,000+ global hackathons yearly with 2M+ active technical participants."
      },
      agent_orchestration: {
        researcher: {
          focus: "Semantic extraction, competitor mapping, value proposition analysis.",
          inputs_accepted: ["URLs", "PDF files", "Text guidelines"]
        },
        architect: {
          focus: "Design patterns, cloud architecture mapping, Mermaid diagram compiling.",
          output_format: "Mermaid-JS flowchart"
        },
        pitcher: {
          focus: "Narrative pacing, hook development, slide script creation.",
          output_format: "Slide accordion with stage directions"
        }
      },
      competitive_gaps: [
        "Generic LLM chats lack persistent team state",
        "No visual architecture visualization from chat prompts",
        "Lack of unified export bundle (JSON + SVG + TXT)"
      ]
    },
    architecture: `%%{init: {
  "theme": "base",
  "themeVariables": {
    "background": "#1A1A2E",
    "primaryColor": "#16213E",
    "primaryTextColor": "#ffffff",
    "primaryBorderColor": "#00FF87",
    "lineColor": "#00FF87",
    "fontFamily": "JetBrains Mono"
  }
}}%%
graph TD
    User([User Request / Document]) --> Web[Web Dashboard / Next.js]
    Web --> Gateway[Session Controller Gateway]
    
    subgraph MultiAgentOrchestrator [Multi-Agent Pipeline]
        Gateway --> RA[Research Agent / Extract JSON]
        RA --> AA[Architect Agent / Mermaid Compiler]
        AA --> PA[Pitch Agent / Slide Planner]
    end
    
    RA -.-> DB[(Session Cache Store)]
    AA -.-> DB
    PA -.-> DB
    
    Web --> Downloader[ZIP Bundle Exporter]
    Downloader --> DB
    Downloader --> ZIP[Downloadable ZIP Bundle]
`,
    pitch: [
      {
        number: 1,
        title: "The Hook",
        duration: "30s",
        content: [
          { type: 'stage', text: "Walk on stage with high energy, looking confident. Click to slide 1 showing a sleek dark screen with a single glowing green node." },
          { type: 'speech', text: "Every weekend, thousands of builders gather at hackathons, dreaming of shifting the future. Yet, 60% of that precious 48 hours is wasted on arguments over structure, styling diagrams by hand, and writing slides. What if you had an autonomous chief of staff doing the heavy lifting while you code?" },
          { type: 'stage', text: "Pause. Let the question sink in." },
          { type: 'speech', text: "Introducing The Innovator's Co-Pilot. A multi-agent AI concierge that takes your single-line spark and turns it into extracted market intelligence, system architectures, and stage-ready scripts." }
        ]
      },
      {
        number: 2,
        title: "The Problem",
        duration: "45s",
        content: [
          { type: 'stage', text: "Point to the screen showing the current manual alignment overhead graphic." },
          { type: 'speech', text: "Here is the cold hard truth: building is easy, but alignment is hard. Teams get bogged down in technical debates, draft incorrect schemas, and struggle to explain their design to judges. General AI chats don't help because they lack shared context and cannot produce production-ready architectures or slide-synchronized scripts. We solve this fragmentation." }
        ]
      },
      {
        number: 3,
        title: "The Solution & Live Demo",
        duration: "60s",
        content: [
          { type: 'stage', text: "Click slide to play the dynamic dashboard walkthrough. Point at the status pipeline." },
          { type: 'speech', text: "With The Innovator's Co-Pilot, you simply paste a URL or drop a text prompt. Instantly, our Research Agent crawls the web and maps the competitive landscape in JSON. Next, our Architect Agent compiles dynamic, interactive system diagrams in Mermaid.js. Finally, the Pitch Agent writes your exact speech alongside stage directions." },
          { type: 'stage', text: "Click 'Export Bundle' on the screen to show how all assets are packaged." },
          { type: 'speech', text: "In just 10 seconds, you download a complete deployment and presentation bundle. You go from 'idea' to 'production' before your competitors even create their Slack channel." }
        ]
      },
      {
        number: 4,
        title: "The Vision",
        duration: "45s",
        content: [
          { type: 'stage', text: "Transition to a slide showing a network of connected hackathon hubs." },
          { type: 'speech', text: "Our business model begins at the source: hackathon platforms like Devpost and BeMyApp. By integrating directly, we provide sponsors with high-quality submissions and builders with the ultimate competitive edge. We're not replacing the developer; we are removing the friction that stops them from shipping." },
          { type: 'stage', text: "Smile, make eye contact with the lead judge." },
          { type: 'speech', text: "The Innovator's Co-Pilot. Drop a problem. Ship a solution. Thank you." }
        ]
      }
    ]
  },
  {
    id: "energy",
    title: "GreenGrid: P2P Microgrid",
    description: "A decentralized peer-to-peer solar energy trading microgrid system built on blockchain smart contracts.",
    created: "2 hours ago",
    research: {
      project_meta: {
        codename: "GreenGrid",
        industry: "Renewable Energy / Web3",
        solution_type: "P2P Trading Platform"
      },
      market_analysis: {
        problem: "Local rooftop solar owners waste 40% of surplus energy due to poor battery storage economics and low utility grid buyback rates.",
        solution: "Direct peer-to-peer energy sharing using local microgrid smart contracts, maximizing solar ROI for prosumers.",
        addressable_market: "$18.5 Billion by 2028."
      },
      technical_stack: {
        smart_contracts: "Solidity / Arbitrum Rollup",
        iot_hardware: "Raspberry Pi smart meters with JWT auth",
        frontend: "Next.js / Tailwind / Ethers.js"
      }
    },
    architecture: `%%{init: {
  "theme": "base",
  "themeVariables": {
    "background": "#1A1A2E",
    "primaryColor": "#16213E",
    "primaryTextColor": "#ffffff",
    "primaryBorderColor": "#00FF87",
    "lineColor": "#00FF87",
    "fontFamily": "JetBrains Mono"
  }
}}%%
graph LR
    SolarProsumer[Solar Prosumer / IoT Meter] -->|Broadcast Surplus| EVM[Arbitrum Smart Contract]
    EVM -->|Match Energy order| Buyer[Energy Consumer]
    EVM -->|Trigger Smart Switch| HardwareGrid[IoT Microgrid Switch]
    Buyer -->|Send USDC Payment| EVM
    EVM -->|Release Funds| SolarProsumer
`,
    pitch: [
      {
        number: 1,
        title: "The Hook",
        duration: "30s",
        content: [
          { type: 'stage', text: "Hold up a lightbulb or smart plug if possible. Speak in a serious tone." },
          { type: 'speech', text: "Right now, your neighbor's rooftop solar panels are producing surplus electricity. But because of outdated utility regulations, they sell it back to the grid for pennies, while you buy it for triple the cost. We are cutting out the middleman." }
        ]
      },
      {
        number: 2,
        title: "The Tech & Architecture",
        duration: "60s",
        content: [
          { type: 'stage', text: "Point to the system architecture diagram showing Arbitrum blockchain and IoT meters." },
          { type: 'speech', text: "GreenGrid uses Raspberry Pi-enabled smart meters that automatically log energy metrics on Arbitrum smart contracts. When prosumers produce surplus, they sell it directly to consumers in their local neighborhood. Transactions settle in USDC instantly, and the physical electricity routes via local microgrids." }
        ]
      }
    ]
  },
  {
    id: "docuquery",
    title: "DocuQuery Compliance Engine",
    description: "Semantic compliance auditor using RAG and specialized legal vector indexes to identify regulatory gaps.",
    created: "1 day ago",
    research: {
      project_meta: {
        codename: "DocuQuery",
        industry: "RegTech / Legal AI",
        solution_type: "AI Compliance Auditor"
      },
      core_engine: {
        vector_db: "Pinecone / pgvector",
        embedding_model: "text-embedding-3-large",
        orchestration: "LlamaIndex custom pipelines"
      }
    },
    architecture: `%%{init: {
  "theme": "base",
  "themeVariables": {
    "background": "#1A1A2E",
    "primaryColor": "#16213E",
    "primaryTextColor": "#ffffff",
    "primaryBorderColor": "#00FF87",
    "lineColor": "#00FF87",
    "fontFamily": "JetBrains Mono"
  }
}}%%
graph TD
    PDF[Compliance PDF Upload] --> Parser[LlamaParse Engine]
    Parser --> Chunker[Semantic Paragraph Splitter]
    Chunker --> Embedder[Ollama Embeddings API]
    Embedder --> VDB[(Pinecone Vector DB)]
    
    Query[User Query / Policy Check] --> QEmbed[Query Embedder]
    QEmbed --> Search[Pinecone KNN Search]
    Search --> RAG[RAG Context Formatter]
    RAG --> LLM[Claude 3.5 Sonnet Validator]
    LLM --> Report[Compliance Audit Report]
`,
    pitch: [
      {
        number: 1,
        title: "The Problem",
        duration: "40s",
        content: [
          { type: 'stage', text: "Show a slide with stacks of endless paperwork and a giant red warning sign." },
          { type: 'speech', text: "Every month, global banks and healthcare companies face new compliance audits. A single missed paragraph in a 500-page document can cost up to 5 million dollars in regulatory fines. Compliance officers spend weeks manually checking legal lines against rules. We automate this in seconds." }
        ]
      }
    ]
  }
];

export const getSessionById = (id: string): ProjectSession | undefined => {
  return mockSessions.find(s => s.id === id);
};
