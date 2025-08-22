# ⚡ Hyperstart Fullstack AI

🚀 **Hyperstart** is an open-source CLI tool that lets you instantly scaffold a **fullstack, AI-ready React app** with Firebase, shadcn/ui, and pre-built templates — all in one command.

[![npm version](https://badge.fury.io/js/create-hyperstart.svg)](https://badge.fury.io/js/create-hyperstart)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ What's New in Hyperstart?

### 🔥 Firebase Integration

- **Authentication**: Complete auth system with Google Sign-in, email/password
- **Firestore Database**: Real-time database with React hooks
- **Storage**: File upload and management system
- **Auto-generated**: Firebase config, hooks, and security rules

### 🎨 shadcn/ui + Tailwind CSS

- **Modern Components**: Beautiful, accessible UI components
- **Customizable**: Easy theme customization with CSS variables
- **Dark Mode**: Built-in dark mode support
- **Component Library**: Button, Input, Card, Form, Dialog, Toast, and more

### 📋 Pre-built Templates

- **Dashboard**: Admin panel with stats, charts, and user management
- **Blog**: Content management with search and categories
- **E-commerce**: Product catalog with cart and filters
- **Landing Page**: Marketing site with hero, features, and contact forms

### 🚀 Enhanced Features

- **Interactive Setup** — Choose template, Firebase services, and UI components
- **Modern Stack** — Vite, React 18, TypeScript support
- **PWA Ready** — Progressive Web App capabilities
- **Development Ready** — Pre-configured folder structure and best practices

## 📦 Quick Start

```bash
npx create-hyperstart my-app
```

Follow the interactive prompts to:

1. **Choose a template** (Dashboard, Blog, E-commerce, Landing Page, or Basic)
2. **Select CSS framework** (Tailwind + shadcn/ui, Tailwind, Bootstrap, MUI)
3. **Pick Firebase services** (Auth, Firestore, Storage)
4. **Choose UI components** (Button, Input, Card, Form, etc.)
5. **Enable PWA features** (Optional)
6. **Add extra packages** (Axios, React Icons, etc.)

## 🎯 Example Usage

### Create a Dashboard with Firebase Auth + Firestore

```bash
npx create-hyperstart my-dashboard
# Select: Dashboard Template → Tailwind + shadcn/ui → Firebase Auth + Firestore → Button, Card, Form
```

### Create an E-commerce Site

```bash
npx create-hyperstart my-store
# Select: E-commerce Template → Tailwind + shadcn/ui → Firestore → Button, Card, Input, Select
```

### Create a Blog with CMS

```bash
npx create-hyperstart my-blog
# Select: Blog Template → Tailwind + shadcn/ui → Firebase Auth + Firestore → Card, Input, Form
```

## 📂 Generated Project Structure

Depending on your selections, Hyperstart generates a tailored project structure:

```
my-app/
├── public/
│   └── (PWA icons if enabled)
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (if selected)
│   │   ├── auth/            # Firebase auth components
│   │   └── [template]/      # Template-specific components
│   ├── pages/               # Page components (Dashboard, Blog, etc.)
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Firebase authentication
│   │   ├── useFirestore.js  # Firestore database hooks
│   │   └── useStorage.js    # Firebase storage hooks
│   ├── lib/
│   │   ├── firebase.js      # Firebase configuration
│   │   └── utils.js         # shadcn/ui utilities
│   ├── utils/
│   │   ├── axiosInstance.js # API client (if Axios selected)
│   │   ├── firestoreUtils.js # Firestore helpers
│   │   └── storageUtils.js  # Storage helpers
│   ├── store/               # State management
│   ├── assets/              # Static assets
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── firebase.json            # Firebase configuration
├── firestore.rules          # Database security rules
├── storage.rules            # Storage security rules
├── .env.example             # Environment template
├── components.json          # shadcn/ui config
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── README.md                # Comprehensive project docs
```

## 🔥 Firebase Integration Features

### 🔐 Authentication System

```jsx
import { useAuth } from "./hooks/useAuth";

function MyComponent() {
  const { user, login, logout, signup } = useAuth();

  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </div>
  );
}
```

### 🗄️ Firestore Database

```jsx
import { useCollection, useFirestore } from "./hooks/useFirestore";

function TodoList() {
  const { documents: todos } = useCollection("todos");
  const { addDocument } = useFirestore("todos");

  const addTodo = () => {
    addDocument({ text: "New todo", completed: false });
  };

  return (
    <div>
      {todos?.map((todo) => (
        <div key={todo.id}>{todo.text}</div>
      ))}
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
}
```

### 📁 File Storage

```jsx
import { useStorage } from "./hooks/useStorage";

function FileUpload() {
  const { uploadFile, uploading, uploadProgress } = useStorage();

  const handleUpload = async (file) => {
    const result = await uploadFile(file, `uploads/${file.name}`);
    console.log("Upload complete:", result.url);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {uploading && <div>Progress: {uploadProgress}%</div>}
    </div>
  );
}
```

## 🎨 shadcn/ui Components

Hyperstart comes with beautiful, accessible components ready to use:

```jsx
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";

function MyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input placeholder="Your name" />
          <Input placeholder="Your email" />
          <Button>Submit</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🏗️ Available Templates

### 📊 Dashboard Template

- Sidebar navigation with stats cards
- User management interface
- Data visualization ready
- Responsive design for desktop and mobile

### 📝 Blog Template

- Post listing and detail pages
- Search and category filtering
- SEO-friendly structure
- Content management interface

### 🛒 E-commerce Template

- Product catalog with search/filters
- Shopping cart functionality
- Category-based organization
- Responsive product grid

### 🚀 Landing Page Template

- Hero section with CTAs
- Feature showcase sections
- Newsletter signup form
- Contact and social links

## 🚀 Getting Started

### 1. Create Your App

```bash
npx create-hyperstart my-awesome-app
```

### 2. Navigate and Install

```bash
cd my-awesome-app
npm install
```

### 3. Configure Firebase (if selected)

```bash
# Copy environment file
cp .env.example .env.local

# Add your Firebase config to .env.local
```

### 4. Start Development

```bash
npm run dev
```

Your app will be running at `http://localhost:5173`! 🎉

## ⚡ Why Choose Hyperstart?

✅ **Save Hours of Setup** - Skip the boilerplate and configuration  
✅ **Production Ready** - Best practices and security built-in  
✅ **Modern Stack** - Latest React, Vite, and Firebase features  
✅ **Beautiful UI** - shadcn/ui components with Tailwind CSS  
✅ **Type Safe** - Full TypeScript support  
✅ **Mobile First** - Responsive design out of the box  
✅ **PWA Ready** - Progressive Web App capabilities  
✅ **Open Source** - MIT licensed and community driven

## 🔧 Advanced Usage

### Custom Templates

Want to add your own template? Check out our [template guide](docs/templates.md).

### Environment Configuration

```bash
# .env.local
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_URL=https://your-api.com
```

### Adding More Components

```bash
# Add more shadcn/ui components
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add calendar
```

## 🤝 Contributing

We welcome contributions! Here are ways you can help:

- 🐛 **Report bugs** - Create issues for any problems you encounter
- ✨ **Suggest features** - Share ideas for new templates or integrations
- 📝 **Improve docs** - Help make our documentation clearer
- 🔧 **Submit PRs** - Contribute code improvements or new features
- ⭐ **Star the repo** - Show your support and help others discover Hyperstart

### Development Setup

```bash
git clone https://github.com/myselfshravan/hyperstart-fullstack-ai.git
cd hyperstart-fullstack-ai
npm install
npm link  # Test your changes locally
```

## 📈 Roadmap

🔮 **Coming Soon:**

- [ ] Next.js template support
- [ ] AI integrations (OpenAI, Anthropic)
- [ ] Database alternatives (Supabase, PlanetScale)
- [ ] Deployment automation (Vercel, Netlify)
- [ ] Testing setup (Vitest, Testing Library)
- [ ] Storybook integration
- [ ] Docker containerization
- [ ] GitHub Actions templates

## 🙋‍♂️ FAQ

**Q: Can I use Hyperstart with existing projects?**  
A: Hyperstart is designed for new projects. For existing projects, you can manually copy the generated components and configurations.

**Q: Is TypeScript supported?**  
A: Yes! Hyperstart works with both JavaScript and TypeScript. The generated templates are compatible with both.

**Q: Can I customize the generated templates?**  
A: Absolutely! All generated code is yours to modify. Check out our customization guide for best practices.

**Q: What if I don't need Firebase?**  
A: No problem! You can skip Firebase during setup and use the tool just for React + shadcn/ui scaffolding.

**Q: How do I update to the latest version?**  
A: Since you run Hyperstart with `npx`, you always get the latest version automatically!

## 📞 Support & Community

- 💬 **Discord**: [Join our community](https://discord.gg/hyperstart) (coming soon)
- 🐛 **Issues**: [GitHub Issues](https://github.com/myselfshravan/hyperstart-fullstack-ai/issues)
- 📧 **Email**: hello@hyperstart.dev (coming soon)
- 🐦 **Twitter**: [@HyperstartDev](https://twitter.com/HyperstartDev) (coming soon)

## 🏆 Showcase

Built something awesome with Hyperstart? We'd love to feature it! Share your projects:

- Submit via [GitHub Discussions](https://github.com/myselfshravan/hyperstart-fullstack-ai/discussions)
- Tweet us [@HyperstartDev](https://twitter.com/HyperstartDev)
- Create a PR adding your project to [SHOWCASE.md](SHOWCASE.md)

## 📄 License

This project is [MIT](LICENSE) licensed - feel free to use it for personal and commercial projects.

## ⭐ Star History

If you find Hyperstart helpful, consider giving us a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=myselfshravan/hyperstart-fullstack-ai&type=Date)](https://star-history.com/#myselfshravan/hyperstart-fullstack-ai&Date)

---

**Built with ❤️ by the open source community**

[⚡ Get Started Now](https://github.com/myselfshravan/hyperstart-fullstack-ai) • [📖 Documentation](docs/) • [🚀 Examples](examples/) • [💬 Community](https://github.com/myselfshravan/hyperstart-fullstack-ai/discussions)
