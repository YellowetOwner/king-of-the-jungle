document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById('themeSelect');
    const savedTheme = localStorage.getItem('theme');
    const script2Themes = ["Red", "Blue", "Orange", "Yellow", "Pink", "Black", "Green", "Purple"];
    const allDarkThemes = ["dark", "spooky", ...script2Themes];
    const textStyleId = 'script1-text-color-style';
    const inlineBlackFixId = 'inline-black-fix-style';
  
    const applyTextColor = (color) => {
      const existing = document.getElementById(textStyleId);
      if (color) {
        const styleContent = `
          body:not([style*="color"]):not(.styles__plusButton___2dH73-camelCase),
          body *:not([style*="color"]):not(.styles__plusButton___2dH73-camelCase) {
            color: ${color} !important;
          }
        `;
        if (!existing) {
          const style = document.createElement('style');
          style.id = textStyleId;
          style.textContent = styleContent;
          document.head.appendChild(style);
        } else {
          existing.textContent = styleContent;
        }
      } else {
        if (existing) existing.remove();
      }
    };
  
    const applyInlineBlackFix = (enable) => {
      const existing = document.getElementById(inlineBlackFixId);
      if (enable) {
        if (!existing) {
          const style = document.createElement('style');
          style.id = inlineBlackFixId;
          style.textContent = `
          [style*="color:black" i],
          [style*="color: black" i],
          [style*="color:#000" i],
          [style*="color:#000000" i],
          [style*="color: rgb(0, 0, 0)" i],
          [style*="color:rgb(0,0,0)" i] {
            color: white !important;
          }
        `;
          document.head.appendChild(style);
        }
      } else {
        if (existing) existing.remove();
      }
    };
  
    const updateTextColorForTheme = (theme) => {
      if (!theme || script2Themes.includes(theme)) {
        applyTextColor(null);
      } else if (theme === "spooky") {
        applyTextColor("#ff6734");
      } else if (theme === "dark") {
        applyTextColor("white");
      } else if (theme === "wg") {
        applyTextColor("black");
      } else {
        applyTextColor(null);
      }
  
      applyInlineBlackFix(allDarkThemes.includes(theme));
    };
  
    if (savedTheme && !script2Themes.includes(savedTheme)) {
      document.documentElement.className = savedTheme;
      if (themeSelect) {
        themeSelect.value = savedTheme;
      }
      updateTextColorForTheme(savedTheme);
    }
  
    if (themeSelect) {
      themeSelect.addEventListener('change', function () {
        const script2Styles = document.getElementById('script2-theme-styles');
        if (script2Styles) script2Styles.remove();
  
        const selected = this.value;
        document.documentElement.className = selected;
        localStorage.setItem('theme', selected);
  
        updateTextColorForTheme(selected);
      });
    }
  
    // --- Moving Background Logic ---
  
    const animatedBackgroundHTML = `
        <div class="styles__blooksBackground___3oQ7Y-camelCase" style="
            background-image: url('/images/ui7.png');
            animation: animatedBackground 9s linear infinite;
            -moz-animation: animatedBackground 9s linear infinite;
            -webkit-animation: animatedBackground 9s linear infinite;
            -ms-animation: animatedBackground 9s linear infinite;
            -o-animation: animatedBackground 9s linear infinite;
          ">
        </div>`;
      
    const staticBackgroundHTML = `
        <div class="styles__blooksBackground___3oQ7Y-camelCase" style="
            background-image: url('/images/ui7.png');
          ">
        </div>`;
  
    /**
     * Reads the setting from localStorage and applies the correct background.
     * This function runs on every page.
     */
    const applyBackgroundSetting = () => {
      const backgroundContainer = document.querySelector('.styles__background___2J-JA-camelCase');
      if (!backgroundContainer) return; // Exit if the background element doesn't exist on this page
  
      // Default to 'true' (moving) if the setting is not found.
      const isMoving = localStorage.getItem('movingBackgroundEnabled') !== 'false';
  
      if (isMoving) {
        backgroundContainer.innerHTML = animatedBackgroundHTML;
      } else {
        backgroundContainer.innerHTML = staticBackgroundHTML;
      }
    };
  
    // 1. APPLY aplication on every page load
    applyBackgroundSetting();
  
    // 2. SETUP the toggle switch (this will only work on the settings page where the toggle exists)
    const backgroundToggle = document.querySelector('.switch input[type="checkbox"]');
    if (backgroundToggle) {
      // Set the toggle's initial state to match the saved setting
      backgroundToggle.checked = localStorage.getItem('movingBackgroundEnabled') !== 'false';
  
      // Add a listener to update the setting when the toggle is clicked
      backgroundToggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        localStorage.setItem('movingBackgroundEnabled', isEnabled);
        applyBackgroundSetting(); // Re-apply the background immediately
      });
    }
    // --- End of Moving Background Logic ---
  });
  
  (function () {
    'use strict';
  
    const applyTheme = (colors) => {
  
      const prevStyle = document.getElementById('script2-theme-styles');
      if (prevStyle) prevStyle.remove();
  
      const prevBlackFix = document.getElementById('inline-black-fix-style');
      if (prevBlackFix) prevBlackFix.remove();
  
      const styleElement = document.createElement('style');
      styleElement.id = 'script2-theme-styles';
  
      styleElement.textContent = `
        ::placeholder { color: ${colors.accent}; }
        ::-webkit-scrollbar-track { background: ${colors.dark}; }
        ::-webkit-scrollbar-thumb { background: ${colors.medium}; }
        ::-webkit-scrollbar-thumb:hover { background: ${colors.accent}; }
  
        .styles__edge___3eWfq-camelCase { background-color: ${colors.accent} !important; }
        .styles__front___vcvuy-camelCase { background-color: ${colors.accent} !important; }
        .headerside { background-color: ${colors.base} !important; }
        .styles__background___2J-JA-camelCase { background-color: ${colors.base} !important; }
        ._body_di4r2_71 { background-color: ${colors.base} !important; }
        .signUpButton { background-color: ${colors.base} !important; }
        .center-square { background-color: ${colors.dark} !important; box-shadow: inset 0 -7px ${colors.shadow} !important; }
        .center-square-create { background-color: ${colors.dark} !important; box-shadow: inset 0 -7px ${colors.shadow} !important; }
        .styles__chatInput___hfdT6-camelCase { 
          border: 1px solid ${colors.dark} !important; 
          background-color: ${colors.medium} !important; 
        }
        .navigation-line { background-color: ${colors.dark} !important; }
        .styles__icon___358UQ-camelCase { color: ${colors.highlight} !important; }
        .styles__button___2hNZo-camelCase { 
          background-color: ${colors.dark} !important; 
          border-color: #3f3f3f !important; 
        }
        .styles__button___2hNZo-camelCase:hover { border-color: #3f3f3f !important; }
        .styles__input___2XTSp-camelCase { background-color: ${colors.dark} !important; }
        .styles__buttonFilled___23Dcn-camelCase { border-color: ${colors.highlight} !important; }
        .styles__forgotLink___KkpPa-camelCase { color: ${colors.highlight} !important; }
        .styles__sidebar___1XqWi-camelCase { background-color: ${colors.dark} !important; }
        .styles__mNavBar___1OUuw-camelCase { background-color: ${colors.dark} !important; }
        .styles__mSidebar___3J45k-camelCase { background-color: ${colors.dark} !important; }
        .styles__header___2O21B-camelCase { background-color: ${colors.dark} !important; }
        .styles__cardContainer___NGmjp-camelCase { background-color: ${colors.base} !important; }
        .styles__postsContainer___39_IQ-camelCase { background-color: ${colors.dark} !important; }
        .styles__statsContainer___QnrRB-camelCase { background-color: ${colors.dark} !important; }
        .styles__statContainer___QKuOF-camelCase { background-color: ${colors.base} !important; }
        .styles__containerHeader___3xghM-camelCase { background-color: ${colors.dark} !important; }
        .styles__container___1BPm9-camelCase { 
          background-color: ${colors.dark} !important; 
          border-color: ${colors.medium} !important; 
        }
        .styles__input___2vJSW-camelCase { background-color: ${colors.dark} !important; }
        .styles__container___3St5B-camelCase { background-color: ${colors.dark} !important; }
        .styles__containerHeaderInside___2omQm-camelCase {
          background: linear-gradient(${colors.accent}, ${colors.accent} 50%, ${colors.medium} 50.01%, ${colors.medium}) !important;
        }
        .styles__profileContainer___CSuIE-camelCase {
          background-color: ${colors.dark} !important; 
          box-shadow: inset 0 -8px ${colors.dark}, 0 0 4px rgba(0, 0, 0, 0.15) !important;
        }
        .styles__profileDropdownMenu___2jUAA-camelCase {
          background-color: ${colors.dark} !important; 
          box-shadow: inset 0 -8px ${colors.dark}, 0 0 4px rgba(0, 0, 0, 0.15) !important;
        }
        .styles__profileDropdownOption___ljZXD-camelCase { background-color: ${colors.accent} !important; }
        .styles__profileDropdownOption___ljZXD-camelCase:hover { background-color: ${colors.dark} !important; }
        .styles__infoContainer___2uI-S-camelCase { background-color: ${colors.dark} !important; }
        .styles__headerIcon___1ykdN-camelCase { color: ${colors.highlight} !important; }
        .styles__pageButton___1wFuu-camelCase:hover { background-color: ${colors.base} !important; color: #fff !important; }
        .postbackground { background-color: ${colors.medium} !important; color: #fff !important; }
        .explaination { color: ${colors.dark} !important; }
        .fourofoursquare { background-color: ${colors.medium} !important; color: #fff !important; }
        .legacycontainer { background-color: ${colors.medium} !important; color: #fff !important; }
        .styles__left___9beun-camelCase { background-color: ${colors.medium} !important; }
        .styles__tokenBalance___1FHgT-camelCase { background-color: ${colors.dark} !important; }
        ._front_552gk_33 { background-color: ${colors.base} !important; }
        ._edge_552gk_23 { background-color: ${colors.shadow} !important; }
        #themeselect { background-color: ${colors.accent} !important; }
  
        body:not([style*="color"]), 
        body *:not([style*="color"]) {
          color: white !important;
        }
      `;
  
      document.head.appendChild(styleElement);
  
      if (!document.getElementById('inline-black-fix-style')) {
        const blackFixStyle = document.createElement('style');
        blackFixStyle.id = 'inline-black-fix-style';
        blackFixStyle.textContent = `
          [style*="color:black" i],
          [style*="color: black" i],
          [style*="color:#000" i],
          [style*="color:#000000" i],
          [style*="color: rgb(0, 0, 0)" i],
          [style*="color:rgb(0,0,0)" i] {
            color: white !important;
          }
        `;
        document.head.appendChild(blackFixStyle);
      }
    };
  
    const themes = {
      Purple: {
        colors: {
          base: '#8521B7',
          medium: '#7b1ea9',
          accent: '#a436db',
          dark: '#4d136b',
          highlight: '#b55ce2',
          shadow: '#3f0a5b',
          buttonHover: '#7a3fad'
        }
      },
      Red: {
        colors: {
          base: '#b71c1c', medium: '#e53935', accent: '#f44336', dark: '#7f1a1a', highlight: '#ffcdd2', shadow: '#5d0d0d', buttonHover: '#c62828'
        }
      },
      Blue: {
        colors: {
          base: '#1a237e', medium: '#303f9f', accent: '#3f51b5', dark: '#121858', highlight: '#c5cae9', shadow: '#0d1042', buttonHover: '#3949ab'
        }
      },
      Orange: {
        colors: {
          base: '#ef6c00',
          medium: '#ff9800',
          accent: '#ffa726',
          dark: '#bf360c',
          highlight: '#ffe0b2',
          shadow: '#8c2700',
          buttonHover: '#f57c00'
        }
      },
      Yellow: {
        colors: {
          base: '#fdd835',
          medium: '#fff176',
          accent: '#ffee58',
          dark: '#fbc02d',
          highlight: '#fff9c4',
          shadow: '#c6a700',
          buttonHover: '#fdd835'
        }
      },
      Pink: {
        colors: {
          base: '#ad1457',
          medium: '#ec407a',
          accent: '#f06292',
          dark: '#880e4f',
          highlight: '#f8bbd0',
          shadow: '#560027',
          buttonHover: '#d81b60'
        }
      },
  Green: {
        colors: {
          base: '#53b721',
          medium: '#0e8719',
          accent: '#265b09',
          dark: '#183a06',
          highlight: '#ffffff',
          shadow: '#183a06',
          buttonHover: '#9f9f9f'
        }
      },
      Black: {
        colors: {
          base: '#121212',
          medium: '#1e1e1e',
          accent: '#000000',
          dark: '#0a0a0a',
          highlight: '#ffffff',
          shadow: '#2a2a2a',
          buttonHover: '#2c2c2c'
        }
      },
    };
  
    const current = localStorage.getItem("theme");
    if (themes[current]) {
      applyTheme(themes[current].colors);
    }
  
    const waitDropdown = setInterval(() => {
      const dropdown = document.getElementById("themeSelect");
      if (dropdown) {
        clearInterval(waitDropdown);
  
        const addOption = (name) => {
          if (![...dropdown.options].some(opt => opt.value === name)) {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = name;
            dropdown.appendChild(opt);
          }
        };
  
        addOption("Red");
        addOption("Blue");
        addOption("Orange");
        addOption("Yellow");
        addOption("Pink");
        addOption("Black");
        addOption("Green");
        addOption("Purple");
  
        dropdown.value = current || "";
  
        dropdown.addEventListener("change", () => {
          const theme = dropdown.value;
          if (!theme) {
            localStorage.removeItem("theme");
  
            const style = document.getElementById('script2-theme-styles');
            if (style) style.remove();
  
            const blackFix = document.getElementById('inline-black-fix-style');
            if (blackFix) blackFix.remove();
          } else {
            localStorage.setItem("theme", theme);
            applyTheme(themes[theme].colors);
          }
        });
      }
    }, 100);
  })();