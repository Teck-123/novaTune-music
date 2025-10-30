// Generate Tailwind CSS
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simplified tailwind config
const simpleTailwindConfig = `
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        handwritten: ['Caveat', 'Dancing Script', 'cursive'],
        sketch: ['Indie Flower', 'Kalam', 'cursive'],
        casual: ['Architects Daughter', 'Comic Neue', 'cursive'],
      },
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
    },
  },
  plugins: [],
};
`;

// Create a temporary tailwind.config.js
fs.writeFileSync(
  path.join(__dirname, 'tailwind.config.temp.js'),
  simpleTailwindConfig
);

// Create a simple input file with all Tailwind directives
const tailwindInput = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&family=Caveat:wght@400;500;600&family=Dancing+Script:wght@400;500;600&family=Indie+Flower&family=Kalam:wght@300;400;700&family=Architects+Daughter&family=Comic+Neue:wght@300;400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .handwritten {
    @apply font-handwritten text-lg tracking-wide;
  }
  
  .sketch-text {
    @apply font-sketch tracking-normal;
  }
  
  .casual-text {
    @apply font-casual;
  }
}
`;

fs.writeFileSync(
  path.join(__dirname, 'tailwind-input.css'),
  tailwindInput
);

// Generate the Tailwind CSS file using the Tailwind CLI
console.log('Generating Tailwind CSS...');
try {
  execSync(
    'npx tailwindcss -i ./tailwind-input.css -o ./src/styles/tailwind-generated.css --config ./tailwind.config.temp.js',
    { stdio: 'inherit' }
  );
  console.log('Tailwind CSS generated successfully!');
} catch (error) {
  console.error('Error generating Tailwind CSS:', error);
}

// Clean up temporary files
fs.unlinkSync(path.join(__dirname, 'tailwind.config.temp.js'));
fs.unlinkSync(path.join(__dirname, 'tailwind-input.css'));