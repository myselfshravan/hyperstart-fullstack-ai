import { writeFile, createFolder } from './utils.js';
import path from 'path';

export const applyProjectTemplate = (projectPath, templateName, projectName, firebaseServices, shadcnComponents) => {
    const templates = {
        dashboard: createDashboardTemplate,
        blog: createBlogTemplate,
        ecommerce: createEcommerceTemplate,
        landing: createLandingPageTemplate
    };

    const templateFunction = templates[templateName.toLowerCase()];
    if (templateFunction) {
        templateFunction(projectPath, projectName, firebaseServices, shadcnComponents);
    }
};

const createDashboardTemplate = (projectPath, projectName, firebaseServices, shadcnComponents) => {
    const pagesDir = path.join(projectPath, "src", "pages");
    const componentsDir = path.join(projectPath, "src", "components");
    
    createFolder(pagesDir);
    createFolder(componentsDir);
    createFolder(path.join(componentsDir, "dashboard"));
    
    // Dashboard Layout Component
    const dashboardLayoutContent = `import { useState } from 'react';
${firebaseServices?.includes('auth') ? `import { useAuth } from '../../hooks/useAuth';
import { ProtectedRoute } from '../auth/ProtectedRoute';` : ''}
${shadcnComponents?.includes('card') ? `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';` : ''}
${shadcnComponents?.includes('button') ? `import { Button } from '../ui/button';` : ''}

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  ${firebaseServices?.includes('auth') ? `const { user, logout } = useAuth();` : ''}

  const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Settings', href: '/settings', icon: '⚙️' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '250px' : '0',
        background: '#1f2937',
        color: 'white',
        transition: 'width 0.3s',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem' }}>
            ${projectName}
          </h2>
          <nav>
            {sidebarItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            ${firebaseServices?.includes('auth') ? `
            <span>Welcome, {user?.displayName || user?.email}</span>
            ${shadcnComponents?.includes('button') ? `
            <Button onClick={logout} variant="outline">
              Logout
            </Button>` : `
            <button 
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>`}` : `
            <span>Dashboard User</span>`}
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '2rem', background: '#f9fafb' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const stats = [
    { title: 'Total Users', value: '2,345', change: '+12%', icon: '👥' },
    { title: 'Revenue', value: '$45,234', change: '+8%', icon: '💰' },
    { title: 'Orders', value: '1,234', change: '+23%', icon: '📦' },
    { title: 'Conversion', value: '3.45%', change: '+2%', icon: '📈' }
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Dashboard Overview
      </h1>
      
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat) => (
          ${shadcnComponents?.includes('card') ? `
          <Card key={stat.title}>
            <CardHeader style={{ paddingBottom: '0.5rem' }}>
              <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {stat.icon} {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stat.value}
              </div>
              <p style={{ color: '#10b981', fontSize: '0.875rem' }}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>` : `
          <div
            key={stat.title}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              {stat.icon} {stat.title}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stat.value}
            </div>
            <p style={{ color: '#10b981', fontSize: '0.875rem' }}>
              {stat.change} from last month
            </p>
          </div>`}
        ))}
      </div>

      {/* Recent Activity */}
      ${shadcnComponents?.includes('card') ? `
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: '#10b981' 
              }}></div>
              <span>New user registered</span>
              <span style={{ color: '#6b7280', marginLeft: 'auto' }}>2 min ago</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: '#3b82f6' 
              }}></div>
              <span>Order #1234 completed</span>
              <span style={{ color: '#6b7280', marginLeft: 'auto' }}>5 min ago</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: '#f59e0b' 
              }}></div>
              <span>Payment processed</span>
              <span style={{ color: '#6b7280', marginLeft: 'auto' }}>10 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>` : `
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: '#10b981' 
            }}></div>
            <span>New user registered</span>
            <span style={{ color: '#6b7280', marginLeft: 'auto' }}>2 min ago</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: '#3b82f6' 
            }}></div>
            <span>Order #1234 completed</span>
            <span style={{ color: '#6b7280', marginLeft: 'auto' }}>5 min ago</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: '#f59e0b' 
            }}></div>
            <span>Payment processed</span>
            <span style={{ color: '#6b7280', marginLeft: 'auto' }}>10 min ago</span>
          </div>
        </div>
      </div>`}
    </div>
  );
};

${firebaseServices?.includes('auth') ? `
export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    </ProtectedRoute>
  );
}` : `
export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}`}`;

    writeFile(path.join(pagesDir, "Dashboard.jsx"), dashboardLayoutContent);
};

const createBlogTemplate = (projectPath, projectName, firebaseServices, shadcnComponents) => {
    const pagesDir = path.join(projectPath, "src", "pages");
    const componentsDir = path.join(projectPath, "src", "components");
    
    createFolder(pagesDir);
    createFolder(componentsDir);
    createFolder(path.join(componentsDir, "blog"));
    
    // Blog Layout Component
    const blogLayoutContent = `import { useState, useEffect } from 'react';
${firebaseServices?.includes('firestore') ? `import { useCollection, useFirestore } from '../../hooks/useFirestore';` : ''}
${shadcnComponents?.includes('card') ? `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';` : ''}
${shadcnComponents?.includes('button') ? `import { Button } from '../ui/button';` : ''}
${shadcnComponents?.includes('input') ? `import { Input } from '../ui/input';` : ''}

const BlogPost = ({ post }) => {
  return (
    ${shadcnComponents?.includes('card') ? `
    <Card style={{ marginBottom: '2rem' }}>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
          {post.excerpt}
        </p>
        <div style={{ marginTop: '1rem' }}>
          ${shadcnComponents?.includes('button') ? `
          <Button variant="outline">Read More</Button>` : `
          <button style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            background: 'white',
            cursor: 'pointer'
          }}>
            Read More
          </button>`}
        </div>
      </CardContent>
    </Card>` : `
    <article style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {post.title}
      </h2>
      <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
        By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <p style={{ lineHeight: '1.6', color: '#4b5563', marginBottom: '1rem' }}>
        {post.excerpt}
      </p>
      <button style={{
        padding: '0.5rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        background: 'white',
        cursor: 'pointer'
      }}>
        Read More
      </button>
    </article>`}
  );
};

const BlogHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '2rem 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          ${projectName} Blog
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '1.125rem',
          marginBottom: '2rem'
        }}>
          Thoughts, stories and ideas
        </p>
        
        {/* Search Bar */}
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          gap: '1rem'
        }}>
          ${shadcnComponents?.includes('input') ? `
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />` : `
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
          />`}
          ${shadcnComponents?.includes('button') ? `
          <Button>Search</Button>` : `
          <button style={{
            padding: '0.75rem 1.5rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            Search
          </button>`}
        </div>
      </div>
    </header>
  );
};

const BlogSidebar = () => {
  const categories = ['Technology', 'Design', 'Development', 'Business', 'Lifestyle'];
  const recentPosts = [
    'Getting Started with React',
    'Modern CSS Techniques',
    'Building Scalable APIs',
    'UI/UX Best Practices'
  ];

  return (
    <aside style={{ width: '300px' }}>
      {/* Categories */}
      ${shadcnComponents?.includes('card') ? `
      <Card style={{ marginBottom: '2rem' }}>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map((category) => (
              <a
                key={category}
                href={\`/category/\${category.toLowerCase()}\`}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {category}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentPosts.map((post) => (
              <a
                key={post}
                href="#"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  lineHeight: '1.4'
                }}
              >
                {post}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>` : `
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Categories
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map((category) => (
            <a
              key={category}
              href={\`/category/\${category.toLowerCase()}\`}
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {category}
            </a>
          ))}
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Recent Posts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentPosts.map((post) => (
            <a
              key={post}
              href="#"
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '0.875rem',
                lineHeight: '1.4'
              }}
            >
              {post}
            </a>
          ))}
        </div>
      </div>`}
    </aside>
  );
};

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  ${firebaseServices?.includes('firestore') ? `
  const { documents: posts, loading } = useCollection('posts', {
    orderBy: ['createdAt', 'desc'],
    limit: 10
  });

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];` : `
  const [posts] = useState([
    {
      id: 1,
      title: 'Getting Started with Modern Web Development',
      excerpt: 'Learn the fundamentals of building modern web applications with React, TypeScript, and the latest tools.',
      author: 'John Doe',
      createdAt: new Date().toISOString(),
      category: 'Development'
    },
    {
      id: 2,
      title: 'Design Systems That Scale',
      excerpt: 'Building consistent and maintainable design systems for growing teams and products.',
      author: 'Jane Smith',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      category: 'Design'
    },
    {
      id: 3,
      title: 'The Future of AI in Web Development',
      excerpt: 'Exploring how artificial intelligence is transforming the way we build and maintain web applications.',
      author: 'Mike Johnson',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      category: 'Technology'
    }
  ]);
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );`}

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <BlogHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        gap: '2rem'
      }}>
        {/* Main Content */}
        <main style={{ flex: 1 }}>
          ${firebaseServices?.includes('firestore') ? `
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              No posts found.
            </div>
          ) : (
            filteredPosts.map(post => (
              <BlogPost key={post.id} post={post} />
            ))
          )}` : `
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              No posts found matching your search.
            </div>
          ) : (
            filteredPosts.map(post => (
              <BlogPost key={post.id} post={post} />
            ))
          )}`}
        </main>

        {/* Sidebar */}
        <BlogSidebar />
      </div>
    </div>
  );
}`;

    writeFile(path.join(pagesDir, "Blog.jsx"), blogLayoutContent);
};

const createEcommerceTemplate = (projectPath, projectName, firebaseServices, shadcnComponents) => {
    const pagesDir = path.join(projectPath, "src", "pages");
    const componentsDir = path.join(projectPath, "src", "components");
    
    createFolder(pagesDir);
    createFolder(componentsDir);
    createFolder(path.join(componentsDir, "ecommerce"));
    
    const ecommerceContent = `import { useState, useEffect } from 'react';
${firebaseServices?.includes('firestore') ? `import { useCollection } from '../../hooks/useFirestore';` : ''}
${firebaseServices?.includes('auth') ? `import { useAuth } from '../../hooks/useAuth';` : ''}
${shadcnComponents?.includes('card') ? `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';` : ''}
${shadcnComponents?.includes('button') ? `import { Button } from '../ui/button';` : ''}
${shadcnComponents?.includes('input') ? `import { Input } from '../ui/input';` : ''}
${shadcnComponents?.includes('select') ? `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';` : ''}

const ProductCard = ({ product, onAddToCart }) => {
  return (
    ${shadcnComponents?.includes('card') ? `
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        height: '200px', 
        background: '#f3f4f6', 
        borderRadius: '0.375rem 0.375rem 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        {product.emoji || '📦'}
      </div>
      <CardHeader>
        <CardTitle style={{ fontSize: '1.125rem' }}>{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem', flex: 1 }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
            \${product.price}
          </span>
          <Button onClick={() => onAddToCart(product)}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>` : `
    <div style={{
      background: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        height: '200px', 
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        {product.emoji || '📦'}
      </div>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {product.name}
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {product.category}
        </p>
        <p style={{ color: '#6b7280', marginBottom: '1rem', flex: 1 }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
            \${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            style={{
              padding: '0.5rem 1rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>`}
  );
};

const EcommerceHeader = ({ cartCount, searchTerm, setSearchTerm }) => {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ${projectName} Store
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '500px', margin: '0 2rem' }}>
            ${shadcnComponents?.includes('input') ? `
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />` : `
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
            />`}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            ${firebaseServices?.includes('auth') ? `
            <span>Account</span>` : ''}
            <div style={{ position: 'relative' }}>
              ${shadcnComponents?.includes('button') ? `
              <Button variant="outline">
                🛒 Cart ({cartCount})
              </Button>` : `
              <button style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer'
              }}>
                🛒 Cart ({cartCount})
              </button>`}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ProductFilters = ({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange }) => {
  return (
    <aside style={{ width: '250px', paddingRight: '2rem' }}>
      ${shadcnComponents?.includes('card') ? `
      <Card style={{ marginBottom: '2rem' }}>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '0.5rem',
                textAlign: 'left',
                background: selectedCategory === 'all' ? '#2563eb' : 'transparent',
                color: selectedCategory === 'all' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.5rem',
                  textAlign: 'left',
                  background: selectedCategory === category ? '#2563eb' : 'transparent',
                  color: selectedCategory === category ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            ${shadcnComponents?.includes('select') ? `
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-25">Under $25</SelectItem>
                <SelectItem value="25-50">$25 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100+">$100+</SelectItem>
              </SelectContent>
            </Select>` : `
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                width: '100%'
              }}
            >
              <option value="all">All Prices</option>
              <option value="0-25">Under $25</option>
              <option value="25-50">$25 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">$100+</option>
            </select>`}
          </div>
        </CardContent>
      </Card>` : `
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Categories
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.5rem',
              textAlign: 'left',
              background: selectedCategory === 'all' ? '#2563eb' : 'transparent',
              color: selectedCategory === 'all' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.5rem',
                textAlign: 'left',
                background: selectedCategory === category ? '#2563eb' : 'transparent',
                color: selectedCategory === category ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Price Range
        </h3>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            width: '100%'
          }}
        >
          <option value="all">All Prices</option>
          <option value="0-25">Under $25</option>
          <option value="25-50">$25 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100+">$100+</option>
        </select>
      </div>`}
    </aside>
  );
};

export default function Ecommerce() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  
  ${firebaseServices?.includes('firestore') ? `
  const { documents: products, loading } = useCollection('products');
  const categories = [...new Set(products?.map(p => p.category) || [])];` : `
  const [products] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation.',
      emoji: '🎧'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      category: 'Electronics',
      description: 'Feature-rich smartwatch with health tracking.',
      emoji: '⌚'
    },
    {
      id: 3,
      name: 'Coffee Maker',
      price: 79.99,
      category: 'Home',
      description: 'Programmable coffee maker for the perfect brew.',
      emoji: '☕'
    },
    {
      id: 4,
      name: 'Running Shoes',
      price: 129.99,
      category: 'Sports',
      description: 'Comfortable running shoes for all terrains.',
      emoji: '👟'
    },
    {
      id: 5,
      name: 'Laptop Stand',
      price: 49.99,
      category: 'Electronics',
      description: 'Ergonomic laptop stand for better posture.',
      emoji: '💻'
    },
    {
      id: 6,
      name: 'Yoga Mat',
      price: 29.99,
      category: 'Sports',
      description: 'Non-slip yoga mat for comfortable practice.',
      emoji: '🧘'
    }
  ]);
  const categories = [...new Set(products.map(p => p.category))];`}

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = product.price;
      switch (priceRange) {
        case '0-25':
          matchesPrice = price < 25;
          break;
        case '25-50':
          matchesPrice = price >= 25 && price < 50;
          break;
        case '50-100':
          matchesPrice = price >= 50 && price < 100;
          break;
        case '100+':
          matchesPrice = price >= 100;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  }) || [];

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <EcommerceHeader 
        cartCount={cartCount} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        gap: '2rem'
      }}>
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        
        <main style={{ flex: 1 }}>
          ${firebaseServices?.includes('firestore') ? `
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading products...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}` : `
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>`}
          
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                No products found matching your criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}`;

    writeFile(path.join(pagesDir, "Ecommerce.jsx"), ecommerceContent);
};

const createLandingPageTemplate = (projectPath, projectName, firebaseServices, shadcnComponents) => {
    const pagesDir = path.join(projectPath, "src", "pages");
    const componentsDir = path.join(projectPath, "src", "components");
    
    createFolder(pagesDir);
    createFolder(componentsDir);
    createFolder(path.join(componentsDir, "landing"));
    
    const landingPageContent = `import { useState } from 'react';
${firebaseServices?.includes('auth') ? `import { useAuth } from '../../hooks/useAuth';` : ''}
${shadcnComponents?.includes('card') ? `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';` : ''}
${shadcnComponents?.includes('button') ? `import { Button } from '../ui/button';` : ''}
${shadcnComponents?.includes('input') ? `import { Input } from '../ui/input';` : ''}

const Hero = () => {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '6rem 2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          lineHeight: '1.2'
        }}>
          Welcome to ${projectName}
        </h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          opacity: '0.9',
          lineHeight: '1.6'
        }}>
          The ultimate solution for modern web applications. 
          Built with React, Firebase, and cutting-edge technologies.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          ${shadcnComponents?.includes('button') ? `
          <Button size="lg" variant="secondary">
            Get Started
          </Button>
          <Button size="lg" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
            Learn More
          </Button>` : `
          <button style={{
            padding: '1rem 2rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '1rem'
          }}>
            Get Started
          </button>
          <button style={{
            padding: '1rem 2rem',
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Learn More
          </button>`}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built with Vite for incredibly fast development and build times.'
    },
    {
      icon: '🔒',
      title: 'Secure by Design',
      description: 'Integrated Firebase Authentication for robust user management.'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Responsive design that works perfectly on all devices.'
    },
    {
      icon: '🎨',
      title: 'Beautiful UI',
      description: 'Modern design with shadcn/ui components and TailwindCSS.'
    },
    {
      icon: '☁️',
      title: 'Cloud Ready',
      description: 'Firebase integration for scalable backend services.'
    },
    {
      icon: '🚀',
      title: 'Easy Deploy',
      description: 'One-click deployment to modern hosting platforms.'
    }
  ];

  return (
    <section style={{ padding: '6rem 2rem', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            Why Choose ${projectName}?
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Everything you need to build modern web applications
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, index) => (
            ${shadcnComponents?.includes('card') ? `
            <Card key={index} style={{ textAlign: 'center', padding: '1rem' }}>
              <CardHeader>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>` : `
            <div
              key={index}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>`}
          ))}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      color: 'white',
      padding: '4rem 2rem'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Stay Updated
        </h2>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          opacity: '0.9'
        }}>
          Get the latest updates and features delivered to your inbox.
        </p>
        
        {subscribed ? (
          <div style={{
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: '0.5rem',
            color: '#10b981'
          }}>
            ✅ Thank you for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '1rem',
            maxWidth: '400px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            ${shadcnComponents?.includes('input') ? `
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                flex: 1, 
                minWidth: '250px',
                background: 'white',
                color: '#1f2937'
              }}
            />` : `
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />`}
            ${shadcnComponents?.includes('button') ? `
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>` : `
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#1f2937',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Subscribe
            </button>`}
          </form>
        )}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer style={{
      background: '#1f2937',
      color: 'white',
      padding: '3rem 2rem 2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              ${projectName}
            </h3>
            <p style={{ color: '#9ca3af' }}>
              Modern web applications made simple.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Connect
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '2rem',
          color: '#9ca3af'
        }}>
          <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
}`;

    writeFile(path.join(pagesDir, "LandingPage.jsx"), landingPageContent);
};