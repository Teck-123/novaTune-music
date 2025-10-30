import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/theme.css";

// Error boundary for the entire application
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("App Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-5 text-white">
          <div className="max-w-md w-full p-8 rounded-xl bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-700/50">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="mb-4 text-gray-300">The application encountered an unexpected error.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              Refresh the page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-3 bg-gray-900 rounded-lg overflow-auto max-h-64 text-xs">
                <p className="text-red-400 font-mono">{this.state.error.toString()}</p>
                <p className="text-gray-400 font-mono mt-2">
                  {this.state.errorInfo?.componentStack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get root element or create if it doesn't exist
let rootElement = document.getElementById("root");

// Handle case where root element doesn't exist
if (!rootElement) {
  console.error("Root element not found! Creating a new div element.");
  rootElement = document.createElement("div");
  rootElement.id = "root";
  document.body.appendChild(rootElement);
}

// Create root and render app
const root = ReactDOM.createRoot(rootElement);

// Render with error boundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);