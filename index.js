#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const run = (cmd, cwd = process.cwd()) => {
    console.log(`\n📦 Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit", cwd });
};

(async () => {
    // 1. Ask project name
    const { projectName } = await inquirer.prompt([
        { type: "input", name: "projectName", message: "Enter project name:" }
    ]);

    // 2. Ask for CSS framework
    const { cssFramework } = await inquirer.prompt([
        {
            type: "list",
            name: "cssFramework",
            message: "Choose a CSS framework:",
            choices: ["Tailwind", "Bootstrap", "MUI"]
        }
    ]);

    // 3. Ask optional packages
    const { packages } = await inquirer.prompt([
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
                { name: "Moment.js", value: "moment" }
            ]
        }
    ]);

    // 4. Create Vite + React project
    run(`npm create vite@latest ${projectName} -- --template react`);
    const projectPath = path.join(process.cwd(), projectName);

    // 5. Install chosen CSS framework
    if (cssFramework === "Tailwind") {
        run(`npm install tailwindcss @tailwindcss/vite`, projectPath);

        const viteConfigPath = path.join(projectPath, "vite.config.js");
        let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");
        viteConfig = `import tailwindcss from '@tailwindcss/vite'\n` + viteConfig;
        viteConfig = viteConfig.replace(/plugins:\s*\[/, "plugins: [\n    tailwindcss(),");
        fs.writeFileSync(viteConfigPath, viteConfig);

        fs.writeFileSync(path.join(projectPath, "src", "index.css"), `@import "tailwindcss";\n`);

        const mainFile = fs.existsSync(path.join(projectPath, "src/main.jsx"))
            ? "src/main.jsx"
            : "src/main.tsx";
        const mainPath = path.join(projectPath, mainFile);
        let mainContent = fs.readFileSync(mainPath, "utf-8");
        mainContent = mainContent.replace(/import\s+['"]\.\/index\.css['"];?/g, ""); // remove default CSS import
        if (!mainContent.includes(`import './index.css'`)) {
            mainContent = `import './index.css';\n` + mainContent;
        }
        fs.writeFileSync(mainPath, mainContent);
    } else if (cssFramework === "Bootstrap") {
        run(`npm install bootstrap`, projectPath);
        const mainFile = fs.existsSync(path.join(projectPath, "src/main.jsx"))
            ? "src/main.jsx"
            : "src/main.tsx";
        const mainPath = path.join(projectPath, mainFile);
        let mainContent = fs.readFileSync(mainPath, "utf-8");
        mainContent = mainContent
            .replace(/import\s+['"]\.\/index\.css['"];?/g, "") // remove vite css import
            .replace(/import\s+['"]\.\/App\.css['"];?/g, ""); // remove App.css import
        mainContent = `import 'bootstrap/dist/css/bootstrap.min.css';\n` + mainContent;
        fs.writeFileSync(mainPath, mainContent);
    } else if (cssFramework === "MUI") {
        run(`npm install @mui/material @emotion/react @emotion/styled`, projectPath);
        const mainFile = fs.existsSync(path.join(projectPath, "src/main.jsx"))
            ? "src/main.jsx"
            : "src/main.tsx";
        const mainPath = path.join(projectPath, mainFile);
        let mainContent = fs.readFileSync(mainPath, "utf-8");
        mainContent = mainContent
            .replace(/import\s+['"]\.\/index\.css['"];?/g, "")
            .replace(/import\s+['"]\.\/App\.css['"];?/g, "");
        fs.writeFileSync(mainPath, mainContent);
    }

    // 6. Install default + optional packages
    const defaultPackages = ["react-router-dom"];
    const allPackages = [...defaultPackages, ...packages];
    if (allPackages.length > 0) {
        run(`npm install ${allPackages.join(" ")}`, projectPath);
    }

    // 7. Create folder structure
    const folders = ["components", "pages", "hooks", "store", "utils", "assets"];
    folders.forEach((folder) => {
        fs.mkdirSync(path.join(projectPath, "src", folder), { recursive: true });
    });

    // 8. Axios setup if chosen
    if (packages.includes("axios")) {
        const axiosContent = `import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: { "Content-Type": "application/json" },
    timeout: 10000
});

// ✅ Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Example: Add token if available
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
    },
    (error) => {
            return Promise.reject(error);
        }
);

// ✅ Response Interceptor
api.interceptors.response.use(
    (response) => {
            return response.data; // Return only data for convenience
        },
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.data?.message || error.message);
            // Example: Handle unauthorized
            if (error.response.status === 401) {
            // Optionally redirect to login
                window.location.href = "/login";
            }
        } else if (error.request) {
            console.error("No response received from server.");
        } else {
            console.error("Request setup error:", error.message);
        }
        return Promise.reject(error);
    }
);
`;

        fs.writeFileSync(path.join(projectPath, "src", "utils", "axiosInstance.js"), axiosContent);
    }

    // 9. Clean up default CSS files from Vite
    const appCssPath = path.join(projectPath, "src", "App.css");
    if (fs.existsSync(appCssPath)) fs.unlinkSync(appCssPath);

    const appFile = fs.existsSync(path.join(projectPath, "src/App.jsx"))
        ? path.join(projectPath, "src/App.jsx")
        : path.join(projectPath, "src/App.tsx");

    let appContent = fs.readFileSync(appFile, "utf-8");
    appContent = appContent.replace(/import\s+['"]\.\/App\.css['"];?/g, ""); // remove App.css import
    appContent = `export default function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        background: "#f9fafb",
        color: "#111",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "0.5rem",
          fontWeight: 600,
        }}
      >
        Welcome to{" "}
        <span style={{ color: "#2563eb" }}>${projectName}</span> 🚀
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#555" }}>
        Your project is ready. Start building amazing things!
      </p>
    </div>
  );
}`;
    fs.writeFileSync(appFile, appContent);

    // 10. Default Router setup in main.jsx
    const mainFile = fs.existsSync(path.join(projectPath, "src/main.jsx"))
        ? "src/main.jsx"
        : "src/main.tsx";
    const mainPath = path.join(projectPath, mainFile);

    const routerSetup = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);`;

    fs.writeFileSync(mainPath, routerSetup);

    console.log("\n✅ Setup complete!");
    console.log(`\nNext steps:\n  cd ${projectName}\n  npm run dev`);
})();
