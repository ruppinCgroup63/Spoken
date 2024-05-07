
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.jsx",
    "./assets/FuncComps/FCLogin.jsx",
    "./assets/FuncComps/FCRegister.jsx",
    "./assets/FuncComps/CreateTemplate.jsx/FCCreateTemplate3",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        OurColor1: "#332A6",
        OurColor2: "#070A40",
        btn:"#070A40",
        step:"#070A40",
        OurColor3: "#2D4BA6",
        OurColor4: "#E4E9F2",
        OurColor5: "#04D9B2",
        // You can add more colors as needed
      },
    },
  },
  plugins: [require("daisyui")],
};


// tailwind.config.js




