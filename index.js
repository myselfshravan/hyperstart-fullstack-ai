#!/usr/bin/env node
import inquirer from "inquirer";
import path from "path";
import { run, createFolder, deleteFile } from "./lib/utils.js";
import { initializePWA } from "./lib/pwa.js";
import { setupCSSFramework } from "./lib/css-frameworks.js";
import {
  createAxiosSetup,
  createAppComponent,
  setupRouterMain,
  createPWAReadme,
} from "./lib/templates.js";
import { setupFirebase } from "./lib/firebase.js";
import { setupShadcnUI, updateIndexCSS } from "./lib/shadcn-ui.js";
import { applyProjectTemplate } from "./lib/project-templates.js";

(async () => {
  console.log(`
⚡ Welcome to Hyperstart!
Generate production-ready, full-stack applications with real features.
Deploy your business in minutes, not months.
    `);

  // 1. Collect user inputs
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
    },
    {
      type: "list",
      name: "framework",
      message: "Choose a framework:",
      choices: [
        { name: "Next.js (Recommended)", value: "nextjs" },
        { name: "React + Vite", value: "vite" },
      ],
    },
    {
      type: "list",
      name: "template",
      message: "Choose your production-ready application:",
      choices: [
        { name: "🤖 AI SaaS Platform - Content generation with OpenAI, billing, user workspaces", value: "ai-saas" },
        { name: "🛒 E-commerce Platform - Complete store with Stripe, inventory, orders", value: "ecommerce" },
        { name: "📱 Social Media App - Posts, comments, likes, user profiles, real-time feed", value: "social" },
        { name: "📊 Project Management - Tasks, teams, time tracking, collaboration", value: "project-mgmt" },
        { name: "🎓 Learning Platform - Courses, videos, progress tracking, certificates", value: "learning" },
        { name: "🏠 Basic App - Simple starter with auth and dashboard", value: "basic" },
      ],
    },
    {
      type: "list",
      name: "cssFramework",
      message: "Choose a CSS framework:",
      choices: [
        "Tailwind + shadcn/ui",
        "Tailwind",
        "Bootstrap (CDN)",
        "React Bootstrap",
        "MUI",
      ],
    },
    {
      type: "checkbox",
      name: "firebaseServices",
      message: "Select Firebase services (optional):",
      choices: [
        { name: "Authentication", value: "auth" },
        { name: "Firestore Database", value: "firestore" },
        { name: "Storage", value: "storage" },
      ],
    },
    {
      type: "checkbox",
      name: "shadcnComponents",
      message: "Select shadcn/ui components to include:",
      choices: [
        { name: "Button", value: "button" },
        { name: "Input", value: "input" },
        { name: "Card", value: "card" },
        { name: "Form", value: "form" },
        { name: "Select", value: "select" },
        { name: "Dialog", value: "dialog" },
        { name: "Toast", value: "toast" },
        { name: "Checkbox", value: "checkbox" },
      ],
      when: (answers) => answers.cssFramework === "Tailwind + shadcn/ui",
    },
    {
      type: "checkbox", 
      name: "aiProviders",
      message: "Select AI providers to integrate:",
      choices: [
        { name: "OpenAI (GPT-4, ChatGPT)", value: "openai" },
        { name: "Anthropic (Claude)", value: "anthropic" },
        { name: "Google (Gemini)", value: "google" },
        { name: "Groq (Fast inference)", value: "groq" },
        { name: "Ollama (Local models)", value: "ollama" },
      ],
      when: (answers) => answers.template === "ai-saas",
      default: ["openai"],
    },
    {
      type: "checkbox",
      name: "aiFeatures", 
      message: "Select AI features to include:",
      choices: [
        { name: "Text Generation (Blog posts, emails, etc.)", value: "text-generation" },
        { name: "Image Generation (DALL-E, Midjourney style)", value: "image-generation" },
        { name: "Chat Assistant", value: "chat-assistant" },
        { name: "Code Generation", value: "code-generation" },
        { name: "Content Summarization", value: "summarization" },
        { name: "Language Translation", value: "translation" },
      ],
      when: (answers) => answers.template === "ai-saas",
      default: ["text-generation", "chat-assistant"],
    },
    {
      type: "confirm",
      name: "includePayments",
      message: "Include Stripe payment processing and subscription billing?",
      default: true,
      when: (answers) => ["ai-saas", "ecommerce", "learning"].includes(answers.template),
    },
    {
      type: "confirm",
      name: "isPWA",
      message: "Do you want to make this a Progressive Web App (PWA)?",
      default: false,
    },
    {
      type: "checkbox",
      name: "packages",
      message: "Select optional packages:",
      choices: [
        { name: "Axios", value: "axios" },
        { name: "React Icons", value: "react-icons" },
        { name: "React Hook Form", value: "react-hook-form" },
        { name: "Yup", value: "yup" },
        { name: "Formik", value: "formik" },
        { name: "Moment.js", value: "moment" },
      ],
    },
  ]);

  const {
    projectName,
    framework,
    template,
    cssFramework,
    firebaseServices,
    shadcnComponents,
    aiProviders,
    aiFeatures,
    includePayments,
    isPWA,
    packages,
  } = answers;
  const projectPath = path.join(process.cwd(), projectName);

  // Determine if using shadcn/ui
  const useShadcnUI = cssFramework === "Tailwind + shadcn/ui";
  const actualCSSFramework = useShadcnUI ? "Tailwind" : cssFramework;

  const applicationNames = {
    'ai-saas': '🤖 AI SaaS Platform',
    'ecommerce': '🛒 E-commerce Platform', 
    'social': '📱 Social Media App',
    'project-mgmt': '📊 Project Management Platform',
    'learning': '🎓 Learning Management System',
    'basic': '🏠 Basic App'
  };

  console.log(`\n🚀 Generating ${applicationNames[template]} - ${projectName}`);
  console.log(`⚡ Framework: ${framework === 'nextjs' ? 'Next.js 14 (App Router)' : 'React + Vite'}`);
  console.log(`🎨 UI: ${cssFramework}`);
  
  if (template === 'ai-saas' && aiProviders?.length > 0) {
    console.log(`🤖 AI Providers: ${aiProviders.join(", ")}`);
    console.log(`✨ AI Features: ${aiFeatures?.join(", ") || 'Text generation, Chat'}`);
  }
  
  if (includePayments) {
    console.log(`💳 Payments: Stripe integration enabled`);
  }
  
  if (firebaseServices && firebaseServices.length > 0) {
    console.log(`🔥 Firebase: ${firebaseServices.join(", ")}`);
  } else {
    console.log(`🗄️ Database: Supabase (Auth, Database, Storage)`);
  }
  
  if (isPWA) {
    console.log(`📱 PWA: Progressive Web App enabled`);
  }
  
  console.log(`\n✨ This will be a complete, production-ready application!`);

  // 2. Create project based on framework choice
  if (framework === 'nextjs') {
    run(`npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"`);
  } else {
    run(`npm create vite@latest ${projectName} -- --template react`);
  }

  // 3. Create all necessary folder structure first
  const srcPath = framework === 'nextjs' ? path.join(projectPath, "src") : path.join(projectPath, "src");
  const folders = ["components", "hooks", "store", "utils"];
  
  // Add framework-specific folders
  if (framework === 'nextjs') {
    // Next.js already has app/ folder, we'll add our own structure
    folders.push("lib");
  } else {
    // Vite structure
    folders.push("pages", "assets");
  }
  
  if (firebaseServices && firebaseServices.length > 0) {
    folders.push("lib");
  }
  if (useShadcnUI) {
    folders.push("components/ui");
  }
  if (firebaseServices && firebaseServices.includes("auth")) {
    folders.push("components/auth");
  }
  if (template !== "basic") {
    folders.push(`components/${template}`);
  }

  folders.forEach((folder) => {
    createFolder(path.join(srcPath, folder));
  });

  // 4. Install packages (base + template-specific)
  const defaultPackages = ["react-router-dom"];
  let templatePackages = [];
  
  // Add template-specific dependencies
  if (template === 'ai-saas') {
    templatePackages = [
      '@supabase/supabase-js',
      ...(aiProviders?.includes('openai') ? ['openai'] : []),
      ...(aiProviders?.includes('anthropic') ? ['@anthropic-ai/sdk'] : []),
      ...(includePayments ? ['stripe'] : []),
    ];
    console.log(`📦 Installing AI SaaS dependencies: ${templatePackages.join(', ')}`);
  } else if (template === 'ecommerce' && includePayments) {
    templatePackages = ['stripe', '@supabase/supabase-js'];
  } else if (['social', 'project-mgmt', 'learning'].includes(template)) {
    templatePackages = ['@supabase/supabase-js'];
  }
  
  const allPackages = [...defaultPackages, ...templatePackages, ...packages];
  if (allPackages.length > 0) {
    run(`npm install ${allPackages.join(" ")}`, projectPath);
  }

  // 5. Setup Firebase if selected
  if (firebaseServices && firebaseServices.length > 0) {
    console.log("🔥 Setting up Firebase...");
    setupFirebase(projectPath, firebaseServices);
  }

  // 6. Setup PWA if selected (after folder structure is created)
  if (isPWA) {
    console.log("📱 Setting up PWA...");
    initializePWA(projectPath, projectName);
  }

  // 7. Setup CSS framework and shadcn/ui
  if (useShadcnUI) {
    console.log("🎨 Setting up Tailwind + shadcn/ui...");
    setupCSSFramework(actualCSSFramework, projectPath, { isShadcnUI: true, framework });
    setupShadcnUI(projectPath, shadcnComponents || [], framework);
    updateIndexCSS(projectPath, framework);
    // Next.js already has globals.css, we'll update that instead
  } else if (framework === 'vite') {
    setupCSSFramework(cssFramework, projectPath, { framework });
  }

  // 8. Setup Axios if selected
  if (packages.includes("axios")) {
    createAxiosSetup(projectPath);
  }

  // 9. Generate production-ready application
  console.log(`🏗️ Building ${applicationNames[template]}...`);
  applyProjectTemplate(
    projectPath,
    template,
    projectName,
    framework,
    {
      firebaseServices,
      shadcnComponents,
      aiProviders,
      aiFeatures,
      includePayments,
      useShadcnUI,
      cssFramework: actualCSSFramework
    }
  );

  // 10. Clean up default boilerplate files and fix imports
  if (framework === 'vite') {
    // Vite cleanup
    deleteFile(path.join(projectPath, "src", "App.css"));
    if (!useShadcnUI && cssFramework !== "Tailwind") {
      deleteFile(path.join(projectPath, "src", "index.css"));
    }
    
    // Fix App.jsx to remove App.css import for Vite projects
    const appJsxPath = path.join(projectPath, "src", "App.jsx");
    const fs = await import("fs/promises");
    try {
      let appContent = await fs.readFile(appJsxPath, "utf8");
      appContent = appContent.replace(/import\s+['"]\.\/App\.css['"];?\s*\n?/g, "");
      await fs.writeFile(appJsxPath, appContent);
    } catch (error) {
      console.warn("Could not fix App.jsx import:", error.message);
    }
  } else {
    // Next.js cleanup - different structure
    // Next.js already comes with proper CSS setup, we just need to ensure Tailwind is configured
    console.log("✅ Next.js project created with Tailwind CSS");
  }

  // 11. Generate clean templates (only for basic template)
  if (template === "basic") {
    createAppComponent(
      projectPath,
      projectName,
      isPWA,
      firebaseServices,
      useShadcnUI
    );
    setupRouterMain(projectPath, cssFramework);
  }

  // 12. Create comprehensive README
  createPWAReadme(
    projectPath,
    projectName,
    cssFramework,
    packages,
    isPWA,
    firebaseServices,
    template,
    shadcnComponents
  );

  // 13. Success message
  console.log("\n✅ Hyperstart setup complete! 🎉");
  console.log(`📦 Project: ${projectName}`);
  console.log(`🎨 Framework: ${cssFramework}`);
  if (firebaseServices && firebaseServices.length > 0) {
    console.log(`🔥 Firebase: ${firebaseServices.join(", ")}`);
    console.log(
      "⚠️  Don't forget to configure your Firebase settings in .env.local!"
    );
  }
  if (useShadcnUI && shadcnComponents && shadcnComponents.length > 0) {
    console.log(`🧩 shadcn/ui components: ${shadcnComponents.join(", ")}`);
  }
  if (isPWA) {
    console.log(
      "📱 PWA features enabled - your app can be installed on mobile devices!"
    );
    console.log(
      "⚠️  Important: Replace placeholder SVG icons with proper PNG icons for production"
    );
  }

  console.log(`\n🚀 Next steps:`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
  if (firebaseServices && firebaseServices.length > 0) {
    console.log(
      `  cp .env.example .env.local  # Configure your Firebase settings`
    );
  }
  console.log(`  npm run dev`);

  if (isPWA) {
    console.log(`\n📱 To test PWA features:`);
    console.log(`  npm run build`);
    console.log(`  npm run preview`);
    console.log(
      `  Open http://localhost:5173 and test install/offline features`
    );
  }

  console.log(
    `\n⭐ Star us on GitHub: https://github.com/myselfshravan/hyperstart-fullstack-ai`
  );
  console.log(
    `📖 Documentation: https://github.com/myselfshravan/hyperstart-fullstack-ai#readme`
  );
  console.log(`\nHappy coding! 🚀`);
})();
