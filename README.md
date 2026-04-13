# EMS - Education Management System (Frontend)

Hệ thống quản lý giáo dục thông minh và hiện đại, giúp tối ưu hóa quy trình dạy và học cho Giáo viên, Học sinh và Quản trị viên. This repository hosts the frontend application for the Education Management System, built with modern web technologies to provide a responsive and intuitive user experience.

## 🌟 Key Features & Benefits

*   **Smart & Modern Education Management**: Designed to streamline educational processes for Teachers, Students, and Administrators.
*   **Intuitive User Interface**: Developed with React to offer a dynamic, component-based, and highly responsive user experience.
*   **Modern Design System**: Adheres to a premium brand identity with a carefully selected color palette, ensuring a consistent and aesthetically pleasing design.
*   **Flexible Multi-Layout Architecture**: Supports various layout structures, allowing for tailored experiences across different user roles and functionalities.
*   **Rapid Development & Optimized Builds**: Leverages Vite for an incredibly fast development server and highly optimized production builds.
*   **Utility-First Styling**: Utilizes Tailwind CSS for efficient, maintainable, and highly customizable styling.
*   **Progressive Web App (PWA) Ready**: Configured with manifest and service worker support for an enhanced, app-like user experience, including offline capabilities and installability.
*   **Integrated Iconography**: Easy integration of a vast library of material design icons using `@iconify/react`.
*   **Secure Authentication**: Includes `jwt-decode` for handling JWT tokens, typically used for authentication and authorization with a backend API.

## 🎨 Design System

Dự án sử dụng bộ nhận diện thương hiệu cao cấp với tông màu chủ đạo:

| Color Name    | Hex Code  | Description          |
| :------------ | :-------- | :------------------- |
| **Primary**   | `#355872` | Deep Blue            |
| **Secondary** | `#7AAACE` | Medium Blue          |
| **Accent**    | `#9CD5FF` | Azure/Sky Blue       |
| **Background**| `#F7F8F0` | Cream/Off-white      |

These colors contribute to a professional and clean aesthetic throughout the application.

## 🏗️ Kiến trúc Layout (Layout Architecture)

Hệ thống sử dụng kiến trúc đa Layout (Multi-layout) linh hoạt, allowing different sections of the application to adopt distinct structural patterns. This approach enhances modularity and enables specific UI/UX requirements for various user roles or content types.

## 🚀 Technologies Used

*   **Language**: JavaScript
*   **Frontend Framework**: React
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Runtime**: Node.js
*   **Other Libraries**:
    *   `@iconify-react/material-symbols`, `@iconify/react`
    *   `jwt-decode`
    *   `react-router-dom`
    *   `eslint` (with `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)
    *   `@tailwindcss/vite`

## 📋 Prerequisites & Dependencies

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: A recent LTS version (e.g., v18.x or v20.x) is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager) or **Yarn**: npm comes bundled with Node.js, or you can install Yarn separately.

## ⚙️ Installation & Setup Instructions

Follow these steps to get the project up and running on your local machine:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/VCongNam/EMS-FE.git
    cd EMS-FE
    ```

2.  **Install dependencies**:

    Use npm:
    ```bash
    npm install
    ```
    Or if you prefer Yarn:
    ```bash
    yarn install
    ```

3.  **Run the development server**:

    To start the local development server with hot-reloading:
    ```bash
    npm run dev
    # or yarn dev
    ```
    The application will typically be accessible in your browser at `http://localhost:5173`.

4.  **Build for production**:

    To create an optimized production build of the application:
    ```bash
    npm run build
    # or yarn build
    ```
    This command will generate static files in the `dist` directory, ready for deployment.

5.  **Preview the production build (optional)**:

    After building, you can locally preview the production-ready application:
    ```bash
    npm run preview
    # or yarn preview
    ```

## 🛠️ Configuration Options

*   **Environment Variables**:
    This project may rely on environment variables (e.g., for API endpoints, authentication keys) to configure its behavior. These are typically managed through a `.env` file in the project root. While no explicit `.env` file is provided, you might need to create one based on backend requirements (e.g., `VITE_API_BASE_URL=http://localhost:8080/api`).

*   **ESLint Configuration**:
    Code quality and consistency are enforced using ESLint. The configuration is defined in `eslint.config.js`. You can lint your code using:
    ```bash
    npm run lint
    # or yarn lint
    ```

*   **Styling**:
    Tailwind CSS is used for styling. While no `tailwind.config.js` is explicitly shown, customizations can be added or updated if needed. The `src/App.css` indicates that global styles might be externalized or managed within components.

## 🤝 Contributing Guidelines

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1.  **Fork the repository**: Click the "Fork" button at the top right of this page.
2.  **Clone your fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/EMS-FE.git
    cd EMS-FE
    ```
3.  **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    # or bugfix/issue-description
    ```
4.  **Make your changes**: Implement your feature or fix the bug.
5.  **Ensure code quality**: Run the linter to catch any potential issues:
    ```bash
    npm run lint
    ```
6.  **Commit your changes**: Write clear and concise commit messages. Using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) is encouraged (e.g., `feat: Add new user dashboard`, `fix: Resolve login bug`).
7.  **Push to your branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request**: Go to the original `VCongNam/EMS-FE` repository on GitHub and open a pull request from your forked branch to the `main` branch. Provide a detailed description of your changes.

## 📄 Project Structure

```
├── .gitignore
├── .npmrc
├── README.md
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
└── public/
    ├── emsIcon.png
    ├── pwa-192x192.png
    ├── pwa-512x512.png
    └── vite.svg
└── src/
    ├── App.css
    ├── App.jsx
    └── assets/
        ├── .gitkeep
        └── images/
            └── emsIcon.png
```

## ⚖️ License Information

This project does not currently have an explicit license specified.
For licensing inquiries, please contact the repository owner, VCongNam.

## 🙏 Acknowledgments

*   Developed by [VCongNam](https://github.com/VCongNam)
*   Built with the power of [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/).
*   Special thanks to the open-source community for providing invaluable tools and libraries that made this project possible.
