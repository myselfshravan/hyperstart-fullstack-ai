import { writeFile, fileExists, createFolder } from './utils.js';
import path from 'path';

const getPackageDescription = (pkg) => {
    const descriptions = {
        'axios': 'HTTP client for API requests',
        'react-icons': 'Popular icon library',
        'react-hook-form': 'Performant forms library',
        'yup': 'Schema validation library',
        'formik': 'Form management library',
        'moment': 'Date manipulation library'
    };
    return descriptions[pkg] || 'Additional package';
};

export const createAxiosSetup = (projectPath) => {
    const utilsDir = path.join(projectPath, "src", "utils");
    createFolder(utilsDir);
    
    const axiosContent = `import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: { "Content-Type": "application/json" },
    timeout: 10000
});

// ✅ Request Interceptor
api.interceptors.request.use(
    (config) => {
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
        return response.data;
    },
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.data?.message || error.message);
            if (error.response.status === 401) {
                window.location.href = "/login";
            }
        } else if (error.request) {
            console.error("No response received from server.");
        } else {
            console.error("Request setup error:", error.message);
        }
        return Promise.reject(error);
    }
);`;

    writeFile(path.join(utilsDir, "axiosInstance.js"), axiosContent);
};

export const createAppComponent = (projectPath, projectName, isPWA, firebaseServices, useShadcnUI) => {
    const appFile = fileExists(path.join(projectPath, "src/App.jsx"))
        ? path.join(projectPath, "src/App.jsx")
        : path.join(projectPath, "src/App.tsx");

    const imports = [
        isPWA ? `import { usePWA } from './hooks/usePWA';` : null,
        firebaseServices?.includes('auth') ? `import { AuthProvider } from './hooks/useAuth';` : null,
        useShadcnUI ? `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';` : null,
        useShadcnUI ? `import { Button } from './components/ui/button';` : null
    ].filter(Boolean).join('\n');

    const appContent = `${imports ? imports + '\n\n' : ''}export default function App() {
  ${isPWA ? `const { isInstallable, installApp, isOnline } = usePWA();\n\n  ` : ''}const content = (
    <div
      ${useShadcnUI ? 'className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground text-center p-8"' : 
      `style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        background: "#f9fafb",
        color: "#111",
        textAlign: "center",
        padding: "2rem",
      }}`}
    >
      ${useShadcnUI ? `
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-4xl mb-2">
            Welcome to{" "}
            <span className="text-primary">${projectName}</span> 🚀
          </CardTitle>
          <CardDescription className="text-lg">
            Your ${isPWA ? 'PWA is' : 'project is'} ready with modern tools and frameworks!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          ${firebaseServices?.includes('auth') ? `
          <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
            🔥 Firebase Auth Ready
          </div>` : ''}
          ${firebaseServices?.includes('firestore') ? `
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            🗄️ Firestore Connected
          </div>` : ''}
          ${firebaseServices?.includes('storage') ? `
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            📁 Storage Configured
          </div>` : ''}
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            🎨 shadcn/ui Components
          </div>
          ${isPWA ? `
          <div className="flex flex-col gap-2">
            <div className="p-2 bg-primary text-primary-foreground rounded text-sm">
              📱 PWA Enabled
            </div>
            <div className={\`p-2 rounded text-sm text-white \${
              isOnline ? "bg-green-500" : "bg-red-500"
            }\`}>
              {isOnline ? "🟢 Online" : "🔴 Offline"}
            </div>
            {isInstallable && (
              <Button onClick={installApp} className="mt-2">
                📲 Install App
              </Button>
            )}
          </div>` : ''}
        </CardContent>
      </Card>` : `
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
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        Your ${isPWA ? 'PWA is' : 'project is'} ready. Start building amazing things!
      </p>
      
      ${firebaseServices && firebaseServices.length > 0 ? `
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        ${firebaseServices.includes('auth') ? `
        <div style={{ 
          padding: "0.5rem 1rem", 
          background: "#f97316", 
          color: "white", 
          borderRadius: "0.5rem",
          fontSize: "0.9rem"
        }}>
          🔥 Firebase Auth Ready
        </div>` : ''}
        ${firebaseServices.includes('firestore') ? `
        <div style={{ 
          padding: "0.5rem 1rem", 
          background: "#3b82f6", 
          color: "white", 
          borderRadius: "0.5rem",
          fontSize: "0.9rem"
        }}>
          🗄️ Firestore Connected
        </div>` : ''}
        ${firebaseServices.includes('storage') ? `
        <div style={{ 
          padding: "0.5rem 1rem", 
          background: "#10b981", 
          color: "white", 
          borderRadius: "0.5rem",
          fontSize: "0.9rem"
        }}>
          📁 Storage Configured
        </div>` : ''}
      </div>` : ''}
      
      ${isPWA ? `<div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <div style={{ 
          padding: "0.5rem 1rem", 
          background: "#2563eb", 
          color: "white", 
          borderRadius: "0.5rem",
          fontSize: "0.9rem"
        }}>
          📱 PWA Enabled
        </div>
        
        <div style={{ 
          padding: "0.5rem 1rem", 
          background: isOnline ? "#10b981" : "#ef4444", 
          color: "white", 
          borderRadius: "0.5rem",
          fontSize: "0.9rem"
        }}>
          {isOnline ? "🟢 Online" : "🔴 Offline"}
        </div>
        
        {isInstallable && (
          <button
            onClick={installApp}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            📲 Install App
          </button>
        )}
      </div>` : ''}`}
    </div>
  );

  ${firebaseServices?.includes('auth') ? `
  return (
    <AuthProvider>
      {content}
    </AuthProvider>
  );` : `
  return content;`}
}`;

    writeFile(appFile, appContent);
};

export const setupRouterMain = (projectPath, cssFramework) => {
    const mainFile = fileExists(path.join(projectPath, "src/main.jsx")) ? "src/main.jsx" : "src/main.tsx";
    const mainPath = path.join(projectPath, mainFile);

    let cssImports = "";
    const cssImportMap = {
        "React Bootstrap": `import 'bootstrap/dist/css/bootstrap.min.css';\n`,
        "Tailwind": `import './index.css';\n`,
        "Bootstrap (CDN)": "",
        "MUI": ""
    };

    cssImports = cssImportMap[cssFramework] || "";

    const routerSetup = `${cssImports}import React from 'react';
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

    writeFile(mainPath, routerSetup);
};

export const createPWAReadme = (projectPath, projectName, cssFramework, packages, isPWA, firebaseServices, template, shadcnComponents) => {
    const usingShadcnUI = cssFramework === "Tailwind + shadcn/ui";
    const actualFramework = usingShadcnUI ? "Tailwind CSS + shadcn/ui" : cssFramework;
    
    const readmeContent = `# ⚡ ${projectName}

A modern React application built with Hyperstart${isPWA ? ' with Progressive Web App (PWA) capabilities' : ''}.

${template && template !== 'basic' ? `🎯 **Template**: ${template.charAt(0).toUpperCase() + template.slice(1)}` : ''}

## 🚀 Features

- ⚡ **Vite** - Lightning-fast build tool and development server
- ⚛️ **React 18** - Latest React with modern hooks and concurrent features
- 🎨 **${actualFramework}** - Modern styling framework
- 🛣️ **React Router** - Client-side routing
${firebaseServices && firebaseServices.length > 0 ? `
### 🔥 Firebase Integration
${firebaseServices.includes('auth') ? '- 🔐 **Firebase Authentication** - User management and auth flows' : ''}
${firebaseServices.includes('firestore') ? '- 🗄️ **Firestore Database** - Real-time NoSQL database' : ''}
${firebaseServices.includes('storage') ? '- 📁 **Firebase Storage** - File upload and storage' : ''}` : ''}
${usingShadcnUI && shadcnComponents && shadcnComponents.length > 0 ? `
### 🧩 shadcn/ui Components
${shadcnComponents.map(comp => `- ✨ **${comp.charAt(0).toUpperCase() + comp.slice(1)}** component`).join('\n')}` : ''}
${isPWA ? `
### 📱 PWA Features
- 📱 **PWA Ready** - Installable, offline-capable app
- 🔄 **Auto-updates** - Service worker with auto-update functionality
- 📊 **Caching Strategy** - Smart caching for better performance` : ''}
${packages.length > 0 ? `
### 📦 Additional Packages
${packages.map(pkg => `- **${pkg}** - ${getPackageDescription(pkg)}`).join('\n')}` : ''}

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🛠️ Installation

1. Navigate to the project directory:
   \`\`\`bash
   cd ${projectName}
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

${firebaseServices && firebaseServices.length > 0 ? `3. Configure Firebase:
   \`\`\`bash
   # Copy the environment example file
   cp .env.example .env.local
   
   # Add your Firebase configuration to .env.local
   # Get these values from Firebase Console > Project Settings > SDK setup
   \`\`\`

4. Update \`.env.local\` with your Firebase project settings:
   \`\`\`env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   \`\`\`
` : ''}

## 🏃‍♂️ Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`
The app will be available at \`http://localhost:5173\`

### Production Build
\`\`\`bash
npm run build
\`\`\`

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

${isPWA ? `## 📱 PWA Features

### Installation
- **Desktop**: Look for the install icon in the address bar or use the "Install App" button
- **Mobile**: Use "Add to Home Screen" option in your browser menu

### Offline Support
This app works offline thanks to service worker caching:
- Static assets are cached automatically
- API responses are cached with NetworkFirst strategy
- Fallback pages for offline scenarios

### Testing PWA Features

1. **Install Prompt Testing**:
   \`\`\`bash
   # Serve the built app locally
   npm run build
   npm run preview
   \`\`\`

2. **Service Worker Testing**:
   - Open DevTools → Application → Service Workers
   - Check if SW is registered and active

3. **Offline Testing**:
   - Build and serve the app
   - Open DevTools → Network → check "Offline"
   - Refresh the page - it should still work

### PWA Asset Replacement

⚠️ **Important**: Replace the placeholder SVG icons with proper PNG icons:

1. Replace these files in \`public/\` folder:
   - \`pwa-192x192.svg\` → \`pwa-192x192.png\`
   - \`pwa-512x512.svg\` → \`pwa-512x512.png\`
   - \`apple-touch-icon.svg\` → \`apple-touch-icon.png\`
   - \`favicon.svg\` → \`favicon.ico\`

2. Use tools like:
   - [PWA Asset Generator](https://www.pwabuilder.com/)
   - [Favicon Generator](https://www.favicon-generator.org/)
   - [App Icon Generator](https://appicon.co/)

### PWA Checklist

- ✅ Web App Manifest configured
- ✅ Service Worker registered
- ✅ HTTPS ready (required for PWA)
- ✅ Responsive design
- ⚠️ Replace placeholder icons with real ones
- ⚠️ Test on actual devices
- ⚠️ Test offline functionality

` : ''}${firebaseServices && firebaseServices.length > 0 ? `
## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable the services you need:
${firebaseServices.includes('auth') ? '   - **Authentication**: Enable Email/Password and/or Google Sign-in' : ''}
${firebaseServices.includes('firestore') ? '   - **Firestore**: Create database in production mode' : ''}
${firebaseServices.includes('storage') ? '   - **Storage**: Enable Firebase Storage' : ''}

### 2. Get Configuration
1. Go to Project Settings → General → Your apps
2. Click on Web app icon to create/select web app
3. Copy the configuration object
4. Update your \`.env.local\` file with these values

### 3. Security Rules
${firebaseServices.includes('firestore') ? `
#### Firestore Rules (\`firestore.rules\`)
The project includes basic security rules. Customize them based on your needs:
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`
` : ''}${firebaseServices.includes('storage') ? `
#### Storage Rules (\`storage.rules\`)
\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`
` : ''}
### 4. Deploy Rules
\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy rules
firebase deploy --only firestore:rules,storage
\`\`\`
` : ''}

## 📁 Project Structure

\`\`\`
${projectName}/
├── public/
${isPWA ? `│   ├── pwa-192x192.svg    # Replace with PNG
│   ├── pwa-512x512.svg    # Replace with PNG
│   └── apple-touch-icon.svg # Replace with PNG
` : ''}${firebaseServices && firebaseServices.length > 0 ? `├── firebase.json          # Firebase configuration
├── .env.example           # Environment variables template
` : ''}├── src/
│   ├── components/        # Reusable components
${usingShadcnUI ? `│   │   └── ui/            # shadcn/ui components
` : ''}${firebaseServices?.includes('auth') ? `│   │   └── auth/          # Authentication components
` : ''}│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
${isPWA ? `│   │   └── usePWA.js      # PWA functionality hook
` : ''}${firebaseServices?.includes('auth') ? `│   │   └── useAuth.js     # Firebase Auth hook
` : ''}${firebaseServices?.includes('firestore') ? `│   │   └── useFirestore.js # Firestore hooks
` : ''}${firebaseServices?.includes('storage') ? `│   │   └── useStorage.js  # Firebase Storage hook
` : ''}${firebaseServices && firebaseServices.length > 0 ? `│   ├── lib/              # Utility libraries
│   │   └── firebase.js   # Firebase configuration
` : ''}│   ├── store/            # State management
│   ├── utils/            # Utility functions
${packages.includes('axios') ? `│   │   └── axiosInstance.js # Axios configuration
` : ''}${firebaseServices?.includes('firestore') ? `│   │   └── firestoreUtils.js # Firestore utilities
` : ''}${firebaseServices?.includes('storage') ? `│   │   └── storageUtils.js # Storage utilities
` : ''}│   ├── assets/          # Static assets
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
${usingShadcnUI ? `├── components.json       # shadcn/ui configuration
├── tailwind.config.js    # Tailwind configuration
` : ''}├── vite.config.js        # Vite configuration
└── package.json
\`\`\`

## 🎨 Styling

This project uses **${actualFramework}** for styling:

${usingShadcnUI ? `
### shadcn/ui + Tailwind CSS
- **Utility-first**: Use Tailwind classes for custom styling
- **Component system**: Pre-built accessible components
- **Customizable**: Easy to customize via CSS variables
- **Dark mode**: Built-in dark mode support

#### Adding Components
\`\`\`bash
# Install new shadcn/ui components
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
\`\`\`

#### Customization
- Colors: Edit CSS variables in \`src/index.css\`
- Components: Modify components in \`src/components/ui/\`
- Theme: Update \`tailwind.config.js\`
` : cssFramework === 'Tailwind' ? `- Classes are available globally
- Configuration in \`vite.config.js\`
- Customize in \`src/index.css\`` : 
cssFramework === 'Bootstrap (CDN)' ? `- Bootstrap 5.3.3 loaded via CDN
- All Bootstrap classes available globally
- No additional configuration needed` :
cssFramework === 'React Bootstrap' ? `- React Bootstrap components installed
- Import components: \`import { Button, Container } from 'react-bootstrap'\`
- Bootstrap CSS included automatically` :
cssFramework === 'MUI' ? `- Material-UI components installed
- Import components: \`import { Button, Container } from '@mui/material'\`
- Emotion for CSS-in-JS styling` : ''}

${packages.includes('axios') ? `## 🌐 API Integration

Axios is pre-configured in \`src/utils/axiosInstance.js\`:

\`\`\`javascript
import { api } from './utils/axiosInstance';

// GET request
const data = await api.get('/users');

// POST request
const response = await api.post('/users', { name: 'John' });
\`\`\`

### Environment Variables
Create a \`.env\` file:
\`\`\`
VITE_API_URL=https://your-api-url.com
\`\`\`

` : ''}## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint (if configured)

## 🚀 Deployment

### Vercel
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Upload dist/ folder to Netlify
\`\`\`

### Firebase Hosting${firebaseServices && firebaseServices.length > 0 ? ' (Recommended)' : ''}
\`\`\`bash
npm run build
firebase deploy --only hosting
\`\`\`

${isPWA ? `### PWA Deployment Checklist
- ✅ Build with \`npm run build\`
- ✅ Serve over HTTPS
- ✅ Test service worker registration
- ✅ Verify manifest.json is accessible
- ✅ Test install prompt on mobile/desktop
- ✅ Replace placeholder icons with real ones

` : ''}## 🎯 Next Steps

${template && template !== 'basic' ? `### Template-Specific Features
This project uses the **${template}** template with:
${template === 'dashboard' ? `- Pre-built dashboard layout with sidebar navigation
- Statistics cards and data visualization ready components
- User management interface (if Firebase Auth enabled)
- Responsive design for desktop and mobile` : 
template === 'blog' ? `- Blog post listing and detail pages
- Search and filtering functionality
- Category-based organization
- SEO-friendly structure` :
template === 'ecommerce' ? `- Product catalog with search and filters
- Shopping cart functionality
- Category-based product organization
- Responsive product grid layout` :
template === 'landing' ? `- Hero section with call-to-action buttons
- Feature showcase sections
- Newsletter subscription form
- Contact and social media links` : ''}

### Customization
` : ''}1. **Customize Components**: ${template !== 'basic' ? `Modify the ${template} components in \`src/pages/\` and \`src/components/${template}/\`` : 'Start building your components in `src/components/`'}
2. **Add Routes**: ${template !== 'basic' ? `Extend the routing in \`src/main.jsx\` for additional pages` : 'Set up routing in `src/main.jsx`'}
${firebaseServices && firebaseServices.length > 0 ? `3. **Configure Firebase**: Update your Firebase settings and customize security rules
4. **Add Authentication**: ${firebaseServices.includes('auth') ? 'Customize the auth flows and user management' : 'Enable Firebase Auth and implement user flows'}
5. **Database Design**: ${firebaseServices.includes('firestore') ? 'Design your Firestore collections and implement CRUD operations' : 'Set up your data structure'}` : `3. **State Management**: Implement Redux/Zustand if needed for complex state
4. **API Integration**: ${packages.includes('axios') ? 'Configure your API endpoints and implement data fetching' : 'Add API integration for dynamic data'}`}
${usingShadcnUI ? `6. **UI Enhancement**: Add more shadcn/ui components and customize the design system` : `6. **Styling**: Enhance the UI with additional ${actualFramework} components`}
7. **Testing**: Add unit tests and integration tests
8. **Deploy**: Deploy to your preferred hosting service

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
${usingShadcnUI ? '- [shadcn/ui Documentation](https://ui.shadcn.com/)' : ''}
${actualFramework.includes('Tailwind') ? '- [Tailwind CSS Documentation](https://tailwindcss.com/)' : ''}
${firebaseServices && firebaseServices.length > 0 ? '- [Firebase Documentation](https://firebase.google.com/docs)' : ''}
${isPWA ? '- [PWA Documentation](https://web.dev/progressive-web-apps/)' : ''}

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/harshgupta20/hyperstart-fullstack-ai/issues).

## ⭐ Show your support

Give a ⭐ if this project helped you!

## 📄 License

This project is [MIT](LICENSE) licensed.

---

**Built with ⚡ [Hyperstart](https://github.com/harshgupta20/hyperstart-fullstack-ai) - The AI-first fullstack starter kit**`;

    writeFile(path.join(projectPath, "README.md"), readmeContent);
};
