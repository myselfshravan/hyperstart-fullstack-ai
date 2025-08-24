import { run, writeFile, createFolder } from './utils.js';
import path from 'path';

export const setupFirebase = (projectPath, firebaseServices) => {
    if (!firebaseServices || firebaseServices.length === 0) return;

    run(`npm install firebase`, projectPath);

    createFirebaseConfig(projectPath, firebaseServices);
    createFirebaseEnv(projectPath);
    createFirebaseJson(projectPath, firebaseServices);
    
    if (firebaseServices.includes('auth')) {
        createFirebaseAuthHook(projectPath);
        createAuthComponents(projectPath);
    }
    
    if (firebaseServices.includes('firestore')) {
        createFirestoreHook(projectPath);
        createFirestoreUtils(projectPath);
    }
    
    if (firebaseServices.includes('storage')) {
        createStorageHook(projectPath);
        createStorageUtils(projectPath);
    }
};

const createFirebaseConfig = (projectPath, firebaseServices) => {
    const libDir = path.join(projectPath, "src", "lib");
    createFolder(libDir);
    
    const configContent = `import { initializeApp } from 'firebase/app';${firebaseServices.includes('auth') ? `
import { getAuth } from 'firebase/auth';` : ''}${firebaseServices.includes('firestore') ? `
import { getFirestore } from 'firebase/firestore';` : ''}${firebaseServices.includes('storage') ? `
import { getStorage } from 'firebase/storage';` : ''}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);${firebaseServices.includes('auth') ? `

export const auth = getAuth(app);` : ''}${firebaseServices.includes('firestore') ? `
export const db = getFirestore(app);` : ''}${firebaseServices.includes('storage') ? `
export const storage = getStorage(app);` : ''}

export default app;`;

    writeFile(path.join(libDir, "firebase.js"), configContent);
};

const createFirebaseEnv = (projectPath) => {
    const envContent = `# Firebase Configuration
# Replace these values with your Firebase project settings
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Example .env.local (copy this file and rename to .env.local)
# Add your actual Firebase config values from Firebase Console > Project Settings > SDK setup and configuration`;

    writeFile(path.join(projectPath, ".env.example"), envContent);
};

const createFirebaseJson = (projectPath, firebaseServices) => {
    const firebaseConfig = {
        "hosting": {
            "public": "dist",
            "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
            "rewrites": [
                {
                    "source": "**",
                    "destination": "/index.html"
                }
            ]
        }
    };

    if (firebaseServices.includes('firestore')) {
        firebaseConfig.firestore = {
            "rules": "firestore.rules",
            "indexes": "firestore.indexes.json"
        };
    }

    if (firebaseServices.includes('storage')) {
        firebaseConfig.storage = {
            "rules": "storage.rules"
        };
    }

    writeFile(path.join(projectPath, "firebase.json"), JSON.stringify(firebaseConfig, null, 2));

    if (firebaseServices.includes('firestore')) {
        const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Example: Public read access to posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;
        writeFile(path.join(projectPath, "firestore.rules"), firestoreRules);
        
        const firestoreIndexes = {
            "indexes": [],
            "fieldOverrides": []
        };
        writeFile(path.join(projectPath, "firestore.indexes.json"), JSON.stringify(firestoreIndexes, null, 2));
    }

    if (firebaseServices.includes('storage')) {
        const storageRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;
        writeFile(path.join(projectPath, "storage.rules"), storageRules);
    }
};

const createFirebaseAuthHook = (projectPath) => {
    const hooksDir = path.join(projectPath, "src", "hooks");
    createFolder(hooksDir);
    
    const authHookContent = `import { useState, useEffect, useContext, createContext } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      return await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};`;

    writeFile(path.join(hooksDir, "useAuth.js"), authHookContent);
};

const createAuthComponents = (projectPath) => {
    const componentsDir = path.join(projectPath, "src", "components");
    const authDir = path.join(componentsDir, "auth");
    createFolder(authDir);
    
    const loginFormContent = `import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const { login, signup, loginWithGoogle, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      
      {error && (
        <div style={{ 
          color: '#ef4444', 
          background: '#fef2f2', 
          padding: '0.75rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isSignup && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.5rem' 
              }}
              required={isSignup}
            />
          </div>
        )}
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.5rem' 
            }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.5rem' 
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
        </button>
      </form>
      
      <div style={{ margin: '1rem 0', textAlign: 'center' }}>
        <span>or</span>
      </div>
      
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Continue with Google
      </button>
      
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#2563eb', 
            cursor: 'pointer', 
            textDecoration: 'underline' 
          }}
        >
          {isSignup ? 'Login' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};`;

    writeFile(path.join(authDir, "LoginForm.js"), loginFormContent);
    
    const protectedRouteContent = `import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
};`;

    writeFile(path.join(authDir, "ProtectedRoute.js"), protectedRouteContent);
};

const createFirestoreHook = (projectPath) => {
    const hooksDir = path.join(projectPath, "src", "hooks");
    createFolder(hooksDir);
    
    const firestoreHookContent = `import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useDocument = (collectionName, docId) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, docId);
    const unsubscribe = onSnapshot(docRef, 
      (doc) => {
        if (doc.exists()) {
          setDocument({ id: doc.id, ...doc.data() });
        } else {
          setDocument(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, docId]);

  return { document, loading, error };
};

export const useCollection = (collectionName, queryOptions = {}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = collection(db, collectionName);

    // Apply query options
    if (queryOptions.where) {
      const [field, operator, value] = queryOptions.where;
      q = query(q, where(field, operator, value));
    }

    if (queryOptions.orderBy) {
      const [field, direction = 'asc'] = queryOptions.orderBy;
      q = query(q, orderBy(field, direction));
    }

    if (queryOptions.limit) {
      q = query(q, limit(queryOptions.limit));
    }

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocuments(docs);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, JSON.stringify(queryOptions)]);

  return { documents, loading, error };
};

export const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (docId, data) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDocument = async (docId) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    loading,
    error
  };
};`;

    writeFile(path.join(hooksDir, "useFirestore.js"), firestoreHookContent);
};

const createFirestoreUtils = (projectPath) => {
    const utilsDir = path.join(projectPath, "src", "utils");
    createFolder(utilsDir);
    
    const firestoreUtilsContent = `import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Generic CRUD operations
export const firestoreAPI = {
  // Create
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Read one
  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Read many
  async getAll(collectionName, options = {}) {
    try {
      let q = collection(db, collectionName);

      if (options.where) {
        const [field, operator, value] = options.where;
        q = query(q, where(field, operator, value));
      }

      if (options.orderBy) {
        const [field, direction = 'asc'] = options.orderBy;
        q = query(q, orderBy(field, direction));
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  },

  // Update
  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete
  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Paginated query
  async getPaginated(collectionName, options = {}) {
    try {
      let q = collection(db, collectionName);

      if (options.where) {
        const [field, operator, value] = options.where;
        q = query(q, where(field, operator, value));
      }

      if (options.orderBy) {
        const [field, direction = 'asc'] = options.orderBy;
        q = query(q, orderBy(field, direction));
      }

      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        docs,
        lastVisible,
        hasMore: docs.length === options.limit
      };
    } catch (error) {
      console.error('Error getting paginated documents:', error);
      throw error;
    }
  }
};

// Helper functions
export const createTimestamp = () => Timestamp.now();
export const timestampToDate = (timestamp) => timestamp?.toDate();
export const dateToTimestamp = (date) => Timestamp.fromDate(date);`;

    writeFile(path.join(utilsDir, "firestoreUtils.js"), firestoreUtilsContent);
};

const createStorageHook = (projectPath) => {
    const hooksDir = path.join(projectPath, "src", "hooks");
    createFolder(hooksDir);
    
    const storageHookContent = `import { useState } from 'react';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../lib/firebase';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = async (file, path) => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      const storageRef = ref(storage, path);
      
      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setError(error.message);
            setUploading(false);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploading(false);
              resolve({
                url: downloadURL,
                path: path,
                size: uploadTask.snapshot.totalBytes,
                name: file.name
              });
            } catch (error) {
              setError(error.message);
              setUploading(false);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      setError(error.message);
      setUploading(false);
      throw error;
    }
  };

  const deleteFile = async (path) => {
    try {
      setError(null);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const getFileURL = async (path) => {
    try {
      setError(null);
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const listFiles = async (path) => {
    try {
      setError(null);
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            url
          };
        })
      );
      
      return files;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
    getFileURL,
    listFiles,
    uploading,
    uploadProgress,
    error
  };
};`;

    writeFile(path.join(hooksDir, "useStorage.js"), storageHookContent);
};

const createStorageUtils = (projectPath) => {
    const utilsDir = path.join(projectPath, "src", "utils");
    createFolder(utilsDir);
    
    const storageUtilsContent = `import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from '../lib/firebase';

// Storage utility functions
export const storageAPI = {
  // Upload file with progress tracking
  async uploadFile(file, path, onProgress) {
    try {
      const storageRef = ref(storage, path);
      
      if (onProgress) {
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file);
          
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => reject(error),
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const metadata = await getMetadata(uploadTask.snapshot.ref);
                resolve({
                  url: downloadURL,
                  path: path,
                  size: metadata.size,
                  name: metadata.name,
                  contentType: metadata.contentType,
                  timeCreated: metadata.timeCreated
                });
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } else {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const metadata = await getMetadata(snapshot.ref);
        return {
          url: downloadURL,
          path: path,
          size: metadata.size,
          name: metadata.name,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated
        };
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Delete file
  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Get download URL
  async getFileURL(path) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  // List files in directory
  async listFiles(path) {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            url,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated
          };
        })
      );
      
      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },

  // Get file metadata
  async getFileMetadata(path) {
    try {
      const storageRef = ref(storage, path);
      return await getMetadata(storageRef);
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }
};

// Helper functions
export const generateStoragePath = (userId, folder, fileName) => {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return \`users/\${userId}/\${folder}/\${timestamp}_\${cleanFileName}\`;
};

export const getFileExtension = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

export const isImageFile = (file) => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(file.name);
  return imageTypes.includes(extension);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};`;

    writeFile(path.join(utilsDir, "storageUtils.js"), storageUtilsContent);
};