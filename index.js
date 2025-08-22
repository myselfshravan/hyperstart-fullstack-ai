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
Create a fullstack, AI-ready React app in seconds.
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
      name: "template",
      message: "Choose a project template:",
      choices: [
        { name: "Basic React App", value: "basic" },
        { name: "Dashboard Template", value: "dashboard" },
        { name: "Blog Template", value: "blog" },
        { name: "E-commerce Template", value: "ecommerce" },
        { name: "Landing Page Template", value: "landing" },
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
    template,
    cssFramework,
    firebaseServices,
    shadcnComponents,
    isPWA,
    packages,
  } = answers;
  const projectPath = path.join(process.cwd(), projectName);

  // Determine if using shadcn/ui
  const useShadcnUI = cssFramework === "Tailwind + shadcn/ui";
  const actualCSSFramework = useShadcnUI ? "Tailwind" : cssFramework;

  console.log(`\n🚀 Creating ${projectName}...`);
  console.log(`📋 Template: ${template}`);
  console.log(`🎨 CSS Framework: ${cssFramework}`);
  if (firebaseServices && firebaseServices.length > 0) {
    console.log(`🔥 Firebase: ${firebaseServices.join(", ")}`);
  }
  if (isPWA) {
    console.log(`📱 PWA: Enabled`);
  }

  // 2. Create Vite project
  run(`npm create vite@latest ${projectName} -- --template react`);

  // 3. Create all necessary folder structure first
  const folders = ["components", "pages", "hooks", "store", "utils", "assets"];
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
    createFolder(path.join(projectPath, "src", folder));
  });

  // 4. Install packages
  const defaultPackages = ["react-router-dom"];
  const allPackages = [...defaultPackages, ...packages];
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
    setupCSSFramework(actualCSSFramework, projectPath, { isShadcnUI: true });
    setupShadcnUI(projectPath, shadcnComponents || []);
    updateIndexCSS(projectPath);
  } else {
    setupCSSFramework(cssFramework, projectPath);
  }

  // 8. Setup Axios if selected
  if (packages.includes("axios")) {
    createAxiosSetup(projectPath);
  }

  // 9. Apply project template
  if (template !== "basic") {
    console.log(`📋 Applying ${template} template...`);
    applyProjectTemplate(
      projectPath,
      template,
      projectName,
      firebaseServices,
      shadcnComponents
    );
  }

  // 10. Clean up default boilerplate files
  deleteFile(path.join(projectPath, "src", "App.css"));
  if (!useShadcnUI && cssFramework !== "Tailwind") {
    deleteFile(path.join(projectPath, "src", "index.css"));
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
