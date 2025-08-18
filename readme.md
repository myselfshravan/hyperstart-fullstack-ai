# ⚡ quickstart-react (React Package Solution)

🚀 **quickstart-react** is an open-source CLI tool that lets you instantly create a Vite + React app with your choice of CSS framework, optional packages, and pre-configured project structure — all in one command.

## ✨ Features
- **Interactive Setup** — prompts you for project name, CSS framework, and optional packages
- **CSS Framework Support** — Tailwind CSS, Bootstrap, or MUI (Material UI)
- **Optional Packages** — easily add Axios, React Icons, React Hook Form, Yup, Formik, and Moment.js
- **Automatic Folder Structure** — creates `components`, `pages`, `hooks`, `store`, `utils`, `assets` folders
- **Boilerplate Ready** — replaces default Vite boilerplate with a clean welcome page
- **Axios Setup** — pre-configured Axios instance if selected
- **CSS Integration** — automatically configures your chosen CSS framework with Vite

## 📦 Installation
You don’t need to install it globally — run it instantly with `npx`:
```bash
npx quickstart-react
```

## 🛠 Usage
When you run `npx quickstart-react`, you will be prompted to:
1. **Enter Project Name** — e.g., `my-app`
2. **Choose CSS Framework** — Tailwind, Bootstrap, or MUI
3. **Select Optional Packages** — choose from a list of commonly used React libraries

Example run:
```bash
npx quickstart-react
```

### Example Walkthrough
```
? Enter project name: my-portfolio
? Choose a CSS framework: Tailwind
? Select optional packages: Axios, React Icons
```

This will:
- Create a new Vite + React project in `my-portfolio/`
- Install Tailwind CSS and configure it with Vite
- Install Axios and React Icons
- Create standard project folders
- Add a clean welcome screen
- Set up an Axios instance at `src/utils/axiosInstance.js`

## 📂 Folder Structure
After running, your project will look like this:
```
my-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── utils/
│   │   └── axiosInstance.js (if Axios selected)
│   ├── assets/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── vite.config.js
├── package.json
└── README.md
```

## ⚡ CSS Framework Integration
### Tailwind CSS
- Installs `tailwindcss` & `@tailwindcss/vite`
- Updates `vite.config.js` to use Tailwind plugin
- Sets up `index.css` with Tailwind directives
- Removes unused default CSS files

### Bootstrap
- Installs `bootstrap`
- Imports Bootstrap CSS in `main.jsx`
- Removes unused default CSS files

### MUI (Material UI)
- Installs `@mui/material`, `@emotion/react`, `@emotion/styled`
- Removes unused default CSS files

## 🧩 Optional Packages
You can add these during setup:
- **Axios** — with a ready-to-use `axiosInstance.js`
- **React Icons** — icon library
- **React Hook Form** — form management
- **Yup** — schema validation
- **Formik** — form management
- **Moment.js** — date/time utilities

## 🚀 Quick Start
```bash
npx quickstart-react my-dashboard
```
Select Tailwind, Bootstrap, or MUI, add any packages, and start coding immediately

## 👐 Contributing
We welcome contributions! Follow these steps:
1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push to your branch: `git push origin feature-name`
5. Open a Pull Request

Before submitting, please ensure:
- Your code follows project style guidelines
- You have tested your changes locally

#### Happy Hacking 🐱‍🏍

---


Certainly! If you're planning to contribute to the existing project, here's how you can structure your pull request (PR) description, along with a proposed issue that can be raised on the `harshgupta20/quickstart-react` repository.

### 1. **Issue to Raise**

#### Title: **Enhance Quickstart-React with Firebase Integration and shadcn/ui Support**

**Description:**
We'd like to expand the functionality of the `quickstart-react` tool to support Firebase configuration, authentication, Firestore integration, and storage. Additionally, we'd like to add support for the shadcn/ui library for faster UI development using TailwindCSS. This would streamline the process for developers who need Firebase setup and ready-to-use UI components, similar to the "Lovable" tool.

**Suggested Enhancements:**

1. **Firebase Integration**:

   * Optionally configure Firebase for Firestore, Authentication, and Storage during project setup.
   * Automatically generate Firebase configuration files (`firebase.json` and `.env`).
   * Include Firebase hooks and utility functions (for Auth, Firestore).

2. **shadcn/ui Integration**:

   * Optionally install and configure `shadcn/ui` components (like Buttons, Inputs, Cards, Forms) along with TailwindCSS.
   * Provide choices to select components to include during project setup (e.g., Button, Input, Form components).

3. **Project Template Options**:

   * Allow the user to choose between different pre-configured project templates (E-commerce, Dashboard, Blog, etc.) with Firebase and UI component support.

**Benefit**:
This enhancement would allow developers to quickly scaffold React apps with Firebase integrated and pre-built UI components using TailwindCSS, significantly reducing setup time and increasing productivity for developers who use these tools.

---

### 2. **Pull Request Description**

#### Title: **Add Firebase Integration & shadcn/ui Support to Quickstart-React**

**Description:**
This PR enhances the `quickstart-react` CLI tool by adding options to integrate Firebase services (Authentication, Firestore, Storage) and shadcn/ui components during project initialization. The user is prompted to select Firebase services and UI components during the interactive setup. The Firebase configuration is automatically set up with `.env` variables, and Firebase hooks are generated for easy use.

Additionally, the shadcn/ui library is integrated with TailwindCSS, making it easy to add UI components like Buttons, Inputs, Forms, and Cards.

**Changes Made:**

1. **Firebase Setup**:

   * Added an interactive prompt to enable Firebase configuration (Authentication, Firestore, Storage).
   * Automatically generate `firebase.json` and `.env` for Firebase setup.
   * Set up Firebase hooks for authentication and Firestore access.

2. **shadcn/ui Integration**:

   * Added an interactive prompt to select shadcn/ui components (Button, Input, Form, Card).
   * Configured TailwindCSS with shadcn preset and included shadcn/ui components.
   * Generated UI components in the `src/components/ui/` folder based on user input.

3. **Project Template**:

   * Added options for different project templates (Dashboard, Blog, E-commerce) that come pre-configured with Firebase and UI components.

4. **Folder Structure Changes**:

   * Added `src/lib/firebase.js` for Firebase config and utility functions.
   * Added `src/components/ui/` for shadcn/ui components.

**Example Usage**:

1. Run the CLI: `npx quickstart-react`
2. Choose Firebase services (Auth, Firestore, etc.).
3. Select shadcn/ui components to install (Button, Input, etc.).
4. Choose a project template (Dashboard, Blog, etc.).

**Next Steps**:

* Review and test the changes for Firebase integration and UI setup.
* Further improve Firebase function templates based on feedback.

---

### 3. **PR Review Checklist**

Before submitting the PR, make sure to include the following in the PR description:

1. **Code quality**: Ensure the code follows the project’s code style and guidelines.
2. **Documentation**: Update the README or relevant documentation to reflect the new features (Firebase integration, shadcn/ui support, etc.).
3. **Tests**: If applicable, add or update tests for the new features. For Firebase, this could involve testing authentication hooks and Firestore utilities.
4. **Interactive Setup**: Make sure the interactive prompts work as expected, allowing users to select Firebase services and UI components.

---

### 4. **Discussion Points for PR Review**

Here are some points to discuss with the repository owner (Harsh Gupta) and other collaborators during the review:

* **Firebase Configuration**: Does the Firebase setup require any additional steps for different environments (e.g., production vs. local development)?
* **shadcn/ui Customization**: Are there any specific components or configurations from `shadcn/ui` that should be included/excluded by default? Would you want to allow custom UI libraries in the future?
* **CLI Interactivity**: Is the interactive setup smooth enough? Should we include any default configurations for commonly used services (like Firestore or Firebase Auth)?
* **Project Templates**: What templates should be included by default? Are there other use cases that might be worth adding to the templates (e.g., mobile-first templates, admin dashboards, etc.)?

---

### Example PR Template (for your contribution):

````markdown
# Add Firebase Integration & shadcn/ui Support

## Description

This PR enhances the `quickstart-react` CLI tool by adding Firebase integration (Auth, Firestore, Storage) and shadcn/ui support, which makes it easier to scaffold React apps with pre-configured Firebase services and TailwindCSS components.

### Changes Made:
1. **Firebase Integration**: 
   - Firebase Auth, Firestore, and Storage setup.
   - Generated Firebase configuration and hooks.
   
2. **shadcn/ui Integration**:
   - Selectable UI components (Button, Input, Card, Form) from shadcn/ui.
   - Configured TailwindCSS for shadcn/ui.

3. **Project Template**: 
   - Added E-commerce, Blog, and Dashboard templates.

### Example Use Case:
```bash
npx quickstart-react
````

1. Choose Firebase services.
2. Select shadcn/ui components.
3. Pick a project template (E-commerce, Blog, Dashboard).

### Benefits:

* Faster project setup with Firebase and pre-built UI components.
* Customizable templates to kickstart various types of apps.

---

**Next Steps**:

* Review and test Firebase integration and UI components.
* Further refine templates based on feedback.

```

