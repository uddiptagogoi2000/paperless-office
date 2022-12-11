/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/*.ejs',
    './views/*/*.ejs',
    'otp.ejs'
  ],
  
 
  theme: {
    colors:{
      'theme1' : 'hsl(243.11,100%,62.16%)',
      'theme2':'hsl(243.11,100%,62.16%)',
      'red':'#FF0000',
      'themebackground':'hsl(206.13,93.94%,87.06%)',
      'bar':'hsl(213.41,95.65%,18.04%)',
      'yellow':'#ca8a04',
      'green':'#33a532',
      'blue':'#0000FF',
      'lightRed':'#fee2e2',
      'lightGreen':'#dcfce7',
      'lightYellow':'#fef9c3',
      'lightBlue':'#dbeafe',
      'lightGray':'#f7f8fd'

      
  
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      center: true,
    },
    extend: {
      backgroundImage:{
        'index-bg':"url('/img/bg.jpeg')"
      }
      
    },
  },
  plugins: [
    
]
}

