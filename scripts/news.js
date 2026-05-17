async function getNewsArticles() {
    const res = await fetch("/api/db/news");
    const data = await res.json();
    if (!data.success && data.error?.includes?.("logged in")) {
      alert("You aren't logged in!");
      window.location.href = ".";
    }
    return data.news;
  }
  
  function createNewsContainer(articles) {
    const container = document.createElement("div");
    container.className = "styles__container___3LSgB-camelCase";
    container.style.opacity = "0";
    container.style.transition = "transform 0.3s ease-in-out, opacity 0.1s linear";
    container.style.transform = "translateX(100%)";
    container.style.zIndex = "99999";
  
    const header = document.createElement("div");
    header.className = "styles__header___2O21B-camelCase";
    header.innerHTML = `
      <i class="far fa-newspaper styles__newsIcon___1Gixg-camelCase"></i>
      <div class="styles__headerText___1RCjc-camelCase">Whitet</div>
      <div class="styles__newsText___14273-camelCase">News</div>
      <i class="fas fa-times styles__closeIcon___16coI-camelCase" role="button"></i>
    `;
  
    const postsContainer = document.createElement("div");
    postsContainer.className = "styles__postsContainer___39_IQ-camelCase";
  
    for (const a of articles) {
      const card = document.createElement("div");
      card.className = "styles__cardContainer___NGmjp-camelCase";
      card.innerHTML = `
        <div class="styles__header___kLT5x-camelCase">${a.title}</div>
        <img loading="lazy" src="${a.imageURL}" onerror="this.remove()" style="border-radius:5px;max-width:100%;max-height:100%;" class="styles__image___2uoLV-camelCase">
        <div class="styles__text___1L6DW-camelCase">
          <div>${a.text.split('\n').join('</div><div>')}</div>
        </div>
        <div class="styles__dateRow___1jkQT-camelCase">
          <i class="far fa-calendar-alt"></i>
          ${new Date(a.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
        </div>
      `;
      postsContainer.appendChild(card);
    }
  
    container.appendChild(header);
    container.appendChild(postsContainer);
    return container;
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const articles = await getNewsArticles();
  
    const modal = document.createElement("div");
    modal.className = "arts__modal___VpEAD-camelCase";
    Object.assign(modal.style, {
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 100,
      display: "none"
    });
  
    const newsContainer = createNewsContainer(articles);
    document.body.appendChild(modal);
    document.body.appendChild(newsContainer);
  
    function applyResponsiveStyles() {
      if (window.innerWidth <= 850) {
        Object.assign(newsContainer.style, {
          position: "fixed",
          top: "0", left: "0",
          width: "100vw", height: "100vh",
          backgroundColor: "var(--secondary-color)",
          overflowY: "auto", overflowX: "hidden"
        });
      } else {
        newsContainer.style.position = "";
        newsContainer.style.top = "";
        newsContainer.style.left = "";
        newsContainer.style.width = "";
        newsContainer.style.height = "";
        newsContainer.style.backgroundColor = "";
        newsContainer.style.overflowY = "";
        newsContainer.style.overflowX = "";
      }
    }
    applyResponsiveStyles();
    window.addEventListener("resize", applyResponsiveStyles);
  
    // fade-in opacity (desktop & mobile both start hidden by transform)
    requestAnimationFrame(() => {
      newsContainer.style.opacity = "1";
    });
  
    let visible = false;
    function showNews() {
      modal.style.display = "block";
      if (window.innerWidth <= 850) {
        newsContainer.style.transform = "translateX(0)";
      } else {
        newsContainer.style.transform = "translateX(-100%)";
      }
      visible = true;
    }
  
    function hideNews() {
      if (window.innerWidth <= 850) {
        newsContainer.style.transform = "translateX(100%)";
      } else {
        newsContainer.style.transform = "translateX(100%)";
      }
      modal.style.display = "none";
      visible = false;
    }
  
    modal.addEventListener("click", hideNews);
    newsContainer.querySelector(".styles__closeIcon___16coI-camelCase")
                  .addEventListener("click", hideNews);
  
    document.addEventListener("click", e => {
      if (e.target.id === "newsbutton") {
        visible ? hideNews() : showNews();
      }
    });
  });