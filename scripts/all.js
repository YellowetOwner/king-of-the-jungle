console.log("%cWARNING... ", "color: red;font-size: 50px;");
console.log("%cThis console is intended for developers, if someone told you to paste something here it is most likely a scam.", "color: grey;font-size: 30px;");
console.log("%cIf you ran something here, please contact a Whitet developer now.", "color: grey;font-size: 30px;");

        document.addEventListener("DOMContentLoaded", async () => {
    try {
        const r = await fetch("/api/stats/user");
        if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
        }
        const a = await r.json();
        if (a.success) {
            const u = a.user;
            const pfpImg = document.querySelector("#pfpimg");
            const usernameDrop = document.querySelector("#usernamedrop");

            if (pfpImg) pfpImg.src = u.pfp;

            let formattedUsername = u.username;
            let usernameStyle = "color: black;";

            if (["Dev", "Admin", "Owner", "Co-Owner", "Artist", "Contributor"].includes(u.role)) {
                formattedUsername = `[${u.role}] ${u.username}`;
            }

            switch (u.role) {
                case 'Dev':
                case 'Admin':
                    usernameStyle = "color: rgb(137, 10, 10);";
                    break;
                case 'Owner':
                case 'Co-Owner':
                    usernameDrop.classList.add('rainbowText');
                    break;
                case 'Artist':
                    usernameStyle = "color: rgb(11, 132, 84);";
                    break;
                case 'Contributor':
                    usernameStyle = "color: rgb(94, 11, 132);";
                    break;
                default:
                    usernameStyle = "color: black;";
            }

            if (usernameDrop) {
                usernameDrop.textContent = formattedUsername;
                usernameDrop.style = usernameStyle;
            }
        } else {
            console.error(a.error);
            window.location.replace("/login");
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
        window.location.replace("/login");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
  // Select all sidebars (desktop + mobile) by just ".nothin"
  const sidebars = Array.from(document.querySelectorAll(".nothin"));
  // Select all bottom rows
  const bottomRows = Array.from(document.querySelectorAll(".styles__bottomRow___3OozA-camelCase"));
  if (sidebars.length === 0 || bottomRows.length === 0) return;

  // Fetch current user info
  const { user } = await (await fetch("/api/stats/user")).json();

  // Base links for sidebar navigation
  const baseLinks = [
    { href: "/stats",    icon: "fas fa-chart-column", text: "Stats" },
    { href: "/market",   icon: "fas fa-store",        text: "Market" },
    { href: "/blooks",   icon: "fas fa-suitcase",     text: "Blooks" },
    { href: "/chat",     icon: "fas fa-comments",     text: "Chat" },
    { href: "/posts",    icon: "fas fa-file",         text: "Posts" },
    { href: "/whitetai", icon: "fas fa-robot",        text: "WhitetAI" }
  ];

  // Add staff link if applicable
  const staffRoles = ["Admin", "Dev", "Owner", "Co-Owner", "Planner"];
  if (staffRoles.includes(user.role)) {
    baseLinks.push({ href: "/staff", icon: "fas fa-terminal", text: "Staff" });
  }

  // Bottom buttons for all bottom rows
  const bottomButtons = [
    { href: "/credits", icon: "fas fa-users",        tip: "Credits" },
    { href: "/settings", icon: "fas fa-cog",         tip: "Settings" },
    { href: null,        icon: "fas fa-newspaper",    tip: "News", id: "newsbutton" },
    { href: "/redeem",   icon: "fas fa-gift",        tip: "Redeem" },
    { href: "https://discord.gg/Bvv6Qk4892", icon: "fa-brands fa-discord", tip: "Discord" }
  ];

  // Helper to create a sidebar link element
  function createSidebarLink({ href, icon, text }) {
    const a = document.createElement("a");
    a.className = "styles__pageButton___1wFuu-camelCase";
    if (href) {
      a.href = href;
      if (href.startsWith("http")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    }
    a.setAttribute("data-tip", text);

    const i = document.createElement("i");
    i.className = `styles__pageIcon___3OSy9-camelCase ${icon}`;
    i.setAttribute("aria-hidden", "true");

    const divText = document.createElement("div");
    divText.className = "styles__pageText___1eo7q-camelCase";
    divText.textContent = text;

    a.appendChild(i);
    a.appendChild(divText);
    return a;
  }

  // Helper to create a bottom row button element
  function createBottomButton({ href, icon, tip, id }) {
    const a = document.createElement("a");
    a.className = "styles__smallButton___sQuq8-camelCase";
    if (href) {
      a.href = href;
      if (href.startsWith("http")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    }
    if (id) a.id = id;
    a.setAttribute("data-tip", tip);
    a.setAttribute("currentitem", "false");

    const i = document.createElement("i");
    i.className = `styles__bottomIcon___3Fswk-camelCase ${icon}`;
    i.setAttribute("aria-hidden", "true");
    if (id) i.id = id;

    a.appendChild(i);
    return a;
  }

  // Build sidebar wrapper with links + Visit Store button
  function buildWrapper(links) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.height = "calc(100vh - 130px)";

    const scrollContainer = document.createElement("div");
    scrollContainer.style.overflowY = "auto";
    scrollContainer.style.flexGrow = "1";
    scrollContainer.style.paddingRight = "2px";

    links.forEach(link => scrollContainer.appendChild(createSidebarLink(link)));

    wrapper.appendChild(scrollContainer);

    const storeBtn = document.createElement("a");
    storeBtn.className = "styles__plusButton___2dH73-camelCase";
    storeBtn.href = "/store";
    storeBtn.innerHTML = `<i class="icon-darkmode"></i> Visit Store`;
    storeBtn.style.marginTop = "10px";

    wrapper.appendChild(storeBtn);
    return wrapper;
  }

  // Append to sidebars:
  // - For mobile sidebar(s), append baseLinks + logout
  // - For desktop sidebars, append baseLinks only
  sidebars.forEach(sb => {
    const isMobile = sb.closest("#mobileSidebar") !== null;
    const linksToUse = isMobile
      ? [...baseLinks, { href: "/logout", icon: "fas fa-sign-out", text: "Log Out" }]
      : baseLinks;
    sb.appendChild(buildWrapper(linksToUse));
  });

  // Append bottom buttons to all bottom rows (both desktop & mobile)
  bottomRows.forEach(row => {
    bottomButtons.forEach(button => row.appendChild(createBottomButton(button)));
  });

  // Add scrollbar styles for sidebars
  const style = document.createElement("style");
  style.textContent = `
    .nothin div::-webkit-scrollbar {
      width: 6px;
    }
    .nothin div::-webkit-scrollbar-track {
      background: transparent;
    }
    .nothin div::-webkit-scrollbar-thumb {
      background-color: rgba(0,0,0,0.2);
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
});





(async function checkUserBanStatus() {
  try {
    const res = await fetch("/api/stats/user");
    const data = await res.json();

    if (!data.success || !data.user?.username) return;
    const username = data.user.username;

    if (typeof firebase === 'undefined' || !firebase.apps?.length) {
      await new Promise((resolve) => {
        const firebaseConfig = {
          apiKey: "AIzaSyDV9tQXgzqxUayhvc384tTLOwy0QOEZVcU",
          authDomain: "chat-e6c93.firebaseapp.com",
          databaseURL: "https://chat-e6c93-default-rtdb.firebaseio.com",
          projectId: "chat-e6c93",
          storageBucket: "chat-e6c93.appspot.com",
          messagingSenderId: "131547791719",
          appId: "1:131547791719:web:2f567033f028810345afc2",
          measurementId: "G-VY49LNJJLG"
        };

        const s1 = document.createElement('script');
        s1.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
        s1.onload = () => {
          const s2 = document.createElement('script');
          s2.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js';
          s2.onload = () => {
            firebase.initializeApp(firebaseConfig);
            resolve();
          };
          document.head.appendChild(s2);
        };
        document.head.appendChild(s1);
      });
    }


    if (!firebase.database) {
      console.error("Firebase database module not available.");
      return;
    }

    const bannedRef = firebase.database().ref('whitet415_banned/' + username);
    const snapshot = await bannedRef.once('value');

    if (snapshot.exists()) {
      window.location.href = "/banned";
    }
  } catch (error) {
    console.error("Ban check error:", error);
  }
})();



  document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("hamburgerToggle");
    const closeBtn = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("mobileSidebar");

    let artsModal = null;

    function showEmptyArtsModal() {
      if (artsModal) return; 

      artsModal = document.createElement('div');
      artsModal.className = 'arts__modal___VpEAD-camelCase';


      document.body.appendChild(artsModal);
    }

    function removeEmptyArtsModal() {
      if (artsModal) {
        artsModal.remove();
        artsModal = null;
      }
    }

    openBtn?.addEventListener("click", () => {
      sidebar.classList.add("styles__mSidebarOpen___1hYtk-camelCase");
      showEmptyArtsModal();
    });

    closeBtn?.addEventListener("click", () => {
      sidebar.classList.remove("styles__mSidebarOpen___1hYtk-camelCase");
      removeEmptyArtsModal();
    });
  });