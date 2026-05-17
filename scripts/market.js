//DO NOT REMOVE ---------------------------------------
function updateTokens(amt){
    const el = document.querySelector("#tokenbalance");
    if (el) el.innerText = amt;
}

// MODIFIED TO HANDLE RATE LIMITS
async function openPack(packName){
  try {
    const reqResult = await fetch("/api/market/openPack",{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({pack:packName})});
    const res = await reqResult.json();

    if(!res.success){
        if (res.error && res.error.toLowerCase().includes('rate limit')) {
            showRateLimitPopup();
        } else {
            alert("Error opening pack: " + res.error);
        }
        return; // Stop execution
    }
    
    updateTokens(res.tokens);
    return {blookEarned:res.blookEarned, tokens:res.tokens};
  } catch(err) {
    alert("A network error occurred. Please try again.");
    return;
  }
}

async function updateUserInfo(){
    try {
        const userReq = await fetch("/api/stats/user");
        const data = await userReq.json();
        if(!data.success){alert("You are not logged in!");window.location.href="/login"; return;}
        const userData = data.user;
        const userEl = document.querySelector("#usernamedrop");
        if (userEl) userEl.innerText = userData.username;
        updateTokens(userData.tokens);
    } catch(e) {
        console.error("Failed to update user info. Check if you are logged in and elements exist.", e);
    }
}
async function getPacks(){
  const res = await fetch("/api/db/packs");
  const data = await res.json();
  return data.packs;
}
async function sellBlook(blook,sellAmount){
  const reqResult = await fetch("/api/market/sellBlook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ blook, sellAmount })});
  const res = await reqResult.json();
  if(!res.success){alert("Error selling blook: "+res.error);return;}
  updateTokens(res.tokens);
  return {tokens:res.tokens, ownedBlooks:res.ownedBlooks};
}
//-------------------------------------------------------


const rarityColors = {
    Common: '#4bc22e', Uncommon: '#4bc22e', Rare: '#0a14fa',
    Epic: '#be0000', Legendary: '#ff910f', Chroma: '#00ccff', Mystical: '#a335ee'
};

const rarityAnimationClasses = {
    Epic: 'styles__openingContainerEpic___3TzCR-camelCase',
    Legendary: 'styles__openingContainerLegendary___RbJZ_-camelCase',
    Chroma: 'styles__openingContainerChroma___3VBd5-camelCase',
    Mystical: 'styles__openingContainerChroma___3VBd5-camelCase'
};

let phaserGame = null;

// Function to show the rate limit popup with a countdown
function showRateLimitPopup() {
    const popup = document.getElementById('rateLimitPopup');
    const timerSpan = document.getElementById('rateLimitTimer');
    if (!popup || !timerSpan) return;

    popup.style.display = 'flex';
    let countdown = 2;
    timerSpan.textContent = `(Closing in ${countdown}s)`;

    const intervalId = setInterval(() => {
        countdown--;
        timerSpan.textContent = `(Closing in ${countdown}s)`;
        if (countdown <= 0) {
            clearInterval(intervalId);
            popup.style.display = 'none';
        }
    }, 1000);
}

function triggerRaritySpecificParticles(rarity) {
    if (phaserGame) { phaserGame.destroy(true); phaserGame = null; }
    let particleUrls = [];
    const baseConfig = {
        type: Phaser.WEBGL, width: window.innerWidth, height: window.innerHeight,
        parent: 'phaser-particle-parent', transparent: true,
        scene: {
            preload: function() {
                for (let i = 0; i < particleUrls.length; i++) {
                    this.load.svg((i + 1).toString(), particleUrls[i], { width: 30, height: 30 });
                }
            },
            create: null
        }
    };

    switch (rarity) {
        case 'Common': case 'Uncommon':
            particleUrls = ["https://media.blooket.com/image/upload/v1658567787/Media/market/particles/square_green.svg","https://media.blooket.com/image/upload/v1658567787/Media/market/particles/square_light_green.svg","https://media.blooket.com/image/upload/v1658567785/Media/market/particles/circle_dark_green.svg","https://media.blooket.com/image/upload/v1658567785/Media/market/particles/serpentine_dark_green.svg","https://media.blooket.com/image/upload/v1658567785/Media/market/particles/triangle_light_green.svg","https://media.blooket.com/image/upload/v1658567785/Media/market/particles/serpentine_light_green.svg","https://media.blooket.com/image/upload/v1658567785/Media/market/particles/triangle_green.svg"];
            baseConfig.scene.create = function() {
                const particles = Array(7).fill(null).map((_, i) => this.add.particles((i + 1).toString()));
                const emitters = particles.map(p => p.createEmitter({ speed: { min: 700, max: 800 }, angle: { min: -115, max: -65 }, gravityY: 700, frequency: 75, lifespan: 5000, x: { min: window.innerWidth / 2 - 25, max: window.innerWidth / 2 + 25 }, y: window.innerHeight / 2 + 25 }));
                setTimeout(() => emitters.forEach(e => e.stop()), 1500);
            };
            break;
        case 'Rare':
            particleUrls = ["https://media.blooket.com/image/upload/v1658567765/Media/market/particles/square_light_blue.svg","https://media.blooket.com/image/upload/v1658567765/Media/market/particles/square_dark_blue.svg","https://media.blooket.com/image/upload/v1658567763/Media/market/particles/triangle_blue.svg","https://media.blooket.com/image/upload/v1658567763/Media/market/particles/serpentine_blue.svg","https://media.blooket.com/image/upload/v1658567763/Media/market/particles/triangle_light_blue.svg","https://media.blooket.com/image/upload/v1658567763/Media/market/particles/serpentine_light_blue.svg","https://media.blooket.com/image/upload/v1658567763/Media/market/particles/circle_dark_blue.svg"];
            baseConfig.scene.create = function() {
                const particles = Array(7).fill(null).map((_, i) => this.add.particles((i + 1).toString()));
                const emitters = [];
                particles.forEach(p => {
                    emitters.push(p.createEmitter({ speed: { min: 700, max: 750 }, angle: { min: -70, max: -20 }, gravityY: 500, frequency: 75, lifespan: 5000, x: { min: -25, max: 25 }, y: window.innerHeight }));
                    emitters.push(p.createEmitter({ speed: { min: 700, max: 750 }, angle: { min: -160, max: -110 }, gravityY: 500, frequency: 75, lifespan: 5000, x: { min: window.innerWidth - 25, max: window.innerWidth + 25 }, y: window.innerHeight }));
                });
                setTimeout(() => emitters.forEach(e => e.stop()), 1500);
            };
            break;
        case 'Epic':
            particleUrls = ["https://media.blooket.com/image/upload/v1658790239/Media/market/particles/red.svg","https://media.blooket.com/image/upload/v1658790237/Media/market/particles/light_red.svg","https://media.blooket.com/image/upload/v1658790239/Media/market/particles/serpentine_red.svg","https://media.blooket.com/image/upload/v1658790239/Media/market/particles/serpentine_dark_red.svg","https://media.blooket.com/image/upload/v1658790237/Media/market/particles/triangle_red.svg","https://media.blooket.com/image/upload/v1658790237/Media/market/particles/triangle_light_red.svg","https://media.blooket.com/image/upload/v1658790237/Media/market/particles/circle_dark_red.svg"];
            baseConfig.scene.create = function() {
                const particles = Array(7).fill(null).map((_, i) => this.add.particles((i + 1).toString()));
                particles.forEach(p => {
                    p.createEmitter({ speed: 650, angle: { min: -50, max: 0 }, gravityY: 400, frequency: 65, lifespan: 5000, x: 0, y: { min: 0, max: window.innerHeight } });
                    p.createEmitter({ speed: 650, angle: { min: -180, max: -130 }, gravityY: 400, frequency: 65, lifespan: 5000, x: window.innerWidth, y: { min: 0, max: window.innerHeight } });
                });
            };
            break;
        case 'Legendary':
            particleUrls = ["https://media.blooket.com/image/upload/v1658567740/Media/market/particles/square_orange.svg","https://media.blooket.com/image/upload/v1658567740/Media/market/particles/square_light_orange.svg","https://media.blooket.com/image/upload/v1658567738/Media/market/particles/circle_orange.svg","https://media.blooket.com/image/upload/v1658567738/Media/market/particles/serpentine_orange.svg","https://media.blooket.com/image/upload/v1658567738/Media/market/particles/serpentine_light_orange.svg","https://media.blooket.com/image/upload/v1658567738/Media/market/particles/circle_dark_orange.svg","https://media.blooket.com/image/upload/v1658567738/Media/market/particles/triangle_dark_orange.svg"];
            baseConfig.scene.create = function() {
                const particles = Array(7).fill(null).map((_, i) => this.add.particles((i + 1).toString()));
                particles.forEach(p => p.createEmitter({ speed: 500, angle: 90, gravityY: 300, frequency: 65, lifespan: 5000, x: { min: 0, max: window.innerWidth }, y: -50 }));
            };
            break;
        case 'Chroma': case 'Mystical':
            particleUrls = ["https://media.blooket.com/image/upload/v1658790246/Media/market/particles/square_turquoise.svg","https://media.blooket.com/image/upload/v1658790246/Media/market/particles/square_light_turquoise.svg","https://media.blooket.com/image/upload/v1658790244/Media/market/particles/serpentine_dark_turquoise.svg","https://media.blooket.com/image/upload/v1658790244/Media/market/particles/serpentine_turquoise.svg","https://media.blooket.com/image/upload/v1658790244/Media/market/particles/triangle_turquoise.svg","https://media.blooket.com/image/upload/v1658790244/Media/market/particles/triangle_light_turquoise.svg","https://media.blooket.com/image/upload/v1658790244/Media/market/particles/circle_dark_turquoise.svg"];
            baseConfig.scene.create = function() {
                const particles = Array(7).fill(null).map((_, i) => this.add.particles((i + 1).toString()));
                particles.forEach(p => {
                    p.createEmitter({ speed: 700, angle: -30, frequency: 350, lifespan: 3000, y: { min: window.innerHeight - 651, max: window.innerHeight }, x: 0 });
                    p.createEmitter({ speed: 700, angle: -150, frequency: 350, lifespan: 3000, y: { min: window.innerHeight - 651, max: window.innerHeight }, x: window.innerWidth });
                    p.createEmitter({ speed: 700, angle: 30, frequency: 350, lifespan: 3000, y: { min: 0, max: 601 }, x: 0 });
                    p.createEmitter({ speed: 700, angle: -210, frequency: 350, lifespan: 3000, y: { min: 0, max: 601 }, x: window.innerWidth });
                });
            };
            break;
        default: return;
    }
    phaserGame = new Phaser.Game(baseConfig);
}

function createPackOpening(blook, packName = "Soda", chance = null, isNew = true) {
  const existing = document.querySelector("._openBackground_fabe0_343"); if (existing) existing.remove();
  const overlay = document.createElement("div"); overlay.className = "_openBackground_fabe0_343";
  overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: radial-gradient(circle, rgba(102, 153, 230, 1) 0%, rgba(26, 56, 117, 1) 100%);";
  const blookAnimationClass = rarityAnimationClasses[blook.rarity] || 'styles__openingContainer___2OmG9-camelCase';
  overlay.innerHTML = `
    <div id="phaser-particle-parent" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"></div>
    <div class="_openContainer_fabe0_353 ${blookAnimationClass}" style="z-index: 2;">
      <img src="https://i.ibb.co/4RHGrFgb/coolerv2.png" alt="Background" class="_blookBackground_fabe0_488" draggable="false">
      <div class="_blookContainer_1601v_1 _unlockedBlookImage_fabe0_575"><img src="${blook.imageURL}" alt="${blook.name}" draggable="false" class="_blook_1601v_1"></div>
      <div class="_unlockedText_fabe0_582"><div class="_unlockedBlook_fabe0_575" style="font-size: 40px;"><div style="font-family: 'Titan One', sans-serif; color: white; display: block; white-space: nowrap;">${blook.name}</div></div><div class="_rarityText_fabe0_599" style="color: ${rarityColors[blook.rarity] || '#fff'};">${blook.rarity}</div></div>
      <div class="_bottomText_fabe0_604">${chance ? `${chance}% - ${isNew ? "NEW!" : ""}` : ""}</div><div class="_bottomShadow_fabe0_616"></div>
    </div>
    <div class="_openingPackContainer_fabe0_494" role="button" tabindex="0" style="z-index: 3;"><div class="_openPackTop_fabe0_532" style='background-image: url("https://ac.blooket.com/dashclassic/assets/PackTop-B_oZNFnG.svg");'></div><img class="_openPack_fabe0_493" src="https://i.ibb.co/zhJctHyW/sodapack.png" alt="Pack"></div>
    <div class="_openBigButton_fabe0_645 _canOpen_fabe0_656" role="button" tabindex="0"></div>`;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.addEventListener("click", () => {
      if (phaserGame) { phaserGame.destroy(true); phaserGame = null; }
      overlay.remove();
    }, { once: true });
  }, 1000);

  // --- FASTER PARTICLE LOGIC ---
  const packTop = overlay.querySelector("._openPackTop_fabe0_532");
  setTimeout(() => {
      // Start the pack opening animation
      packTop.classList.add("_isOpeningPackTop_fabe0_542");

      // Instead of waiting for the animation to end, trigger particles
      // shortly after it starts. This makes the reveal feel much faster.
      setTimeout(() => {
          triggerRaritySpecificParticles(blook.rarity);
      }, 400); // A short delay for a more impactful burst.
      
  }, 100);
}

// --- SCRIPT LOGIC ---
let instantOpen = false;

document.addEventListener('DOMContentLoaded', () => {
    const instantBtn = document.getElementById('instantOpen');
    if (!instantBtn) return;
    function updateButtonText() { instantBtn.textContent = `Instant Open: ${instantOpen ? "On" : "Off"}`; }
    instantBtn.addEventListener('click', () => { 
        instantOpen = !instantOpen; 
        updateButtonText(); 
    });
    updateButtonText();
});

document.addEventListener('DOMContentLoaded', () => {
    updateUserInfo();
    const sodaPackButton = document.getElementById('sodaPack');
    const packName = 'OG Pack';

    async function openWithAnimation() {
        const data = await openPack(packName);
        if (data && data.blookEarned) {
            createPackOpening(data.blookEarned, packName);
        }
    }
    
    async function openInstantly() {
        const data = await openPack(packName);
        if (data && data.blookEarned) {
            alert(`You got: ${data.blookEarned.name} (${data.blookEarned.rarity})`);
        }
    }

    if (sodaPackButton) {
        sodaPackButton.addEventListener('click', () => {
            if (instantOpen) openInstantly();
            else openWithAnimation();
        });
    } else {
        console.error("Pack button with ID 'sodaPack' was not found!");
    }
});