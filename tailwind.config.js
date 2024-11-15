/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.{html,js}', 
    './src/**/*.{html,js}'
  ],
  screens:{
    sm:'480px',
    md:'767px',
    lg:'1020px',
    xl:'1440px'
  },
  theme: {
    extend: {
      fontFamily:{
        zilla:['Zilla Slab', 'serif']
      },
      backgroundImage:{
        summer : "url('./src/image/summer.jpg')",
        rainy : "url('./src/image/rainy.jpg')",
        spring: "url('./src/image/spring.jpg')",
        winter: "url('./src/image/winter.jpg')",
        autumn: "url('./src/image/autumn.jpg')"
      }
    },
  },
  plugins: [],
}

