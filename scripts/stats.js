const al = g => {
    alert(g);
    console.error(g);
  };
  
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      let r = null;
      let isSelf = false;
      if (window.location.search !== "") {
        const searchParams = new URLSearchParams(window.location.search);
        const uid = searchParams.get("id");
        if (uid) r = await fetch("/api/stats/view?uid=" + uid);
      } else {
        isSelf = true;
        r = await fetch("/api/stats/user");
      }
  
      const a = await r.json();
      if (!a.success) return al(a.error);
  
      const u = a.user;
  
      document.querySelector("#profiletrian").src = u.pfp;
      document.querySelector(".styles__headerBg___12ogR-camelCase").src = u.banner;
  
      let formattedUsername = u.username;
      let usernameStyle = "color: black;";
      let roleStyle = "color: black;";
      const profileUser = document.querySelector("#profileuser");
      const roleElem = document.querySelector("#role");
  
      if (["Dev", "Admin", "Owner", "Co-Owner", "Artist", "Contributor"].includes(u.role)) {
        formattedUsername = `[${u.role}] ${u.username}`;
      }
  
      switch (u.role) {
        case 'Dev':
        case 'Admin':
          usernameStyle = "color: rgb(137, 10, 10);";
          roleStyle = "color: rgb(137, 10, 10);";
          break;
        case 'Owner':
        case 'Co-Owner':
          profileUser.classList.add("rainbowText");
          roleElem.classList.add("rainbowText");
          usernameStyle = "";
          roleStyle = "";
          break;
        case 'Artist':
          usernameStyle = "color: rgb(11, 132, 84);";
          roleStyle = "color: rgb(11, 132, 84);";
          break;
        case 'Contributor':
          usernameStyle = "color: rgb(94, 11, 132);";
          roleStyle = "color: rgb(94, 11, 132);";
          break;
      }
  
      if (!["Owner", "Co-Owner"].includes(u.role)) {
        profileUser.classList.remove("rainbowText");
        roleElem.classList.remove("rainbowText");
        profileUser.style = usernameStyle;
        roleElem.style = roleStyle;
      }
  
      profileUser.textContent = formattedUsername;
      roleElem.textContent = u.role;
  
      if (isSelf) {
    document.querySelector("#pfpimg").src = u.pfp;
  }
  
  
      if (isSelf) {
        const usernameDrop = document.querySelector("#usernamedrop");
        usernameDrop.textContent = formattedUsername;
        usernameDrop.style = usernameStyle;
      }
  
      document.querySelector("#opened").textContent = u.packsOpened;
      document.querySelector("#tokens").textContent = u.tokens;
      document.querySelector("#trians").textContent = `${u.ownedBlooks.length}/${a.totalBlooks}`;
      document.querySelector("#messages").textContent = u.messages.length;
      document.querySelector("#posts").textContent = u.messages.length;
      document.querySelector("#likes").textContent = u.auctions.length;
    } catch (error) {
      al("Unknown error");
      console.error(error);
    }
  });
  
  
  document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('profiletrian');
  
    if (searchButton) {
      searchButton.addEventListener('click', function () {
        showPFPModal();
      });
    }
  
    async function showPFPModal() {
      let userData;
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const uid = searchParams.get("id");
        let res = null;
  
        if (uid) {
          res = await fetch("/api/stats/view?uid=" + encodeURIComponent(uid));
        } else {
          res = await fetch("/api/stats/user");
        }
  
        if (!res.ok) throw new Error("Failed to fetch user data");
        const json = await res.json();
        if (!json.success) throw new Error("User data response not successful");
        userData = json.user;
      } catch (e) {
        alert("Could not load user data");
        console.error(e);
        return;
      }
  
      const sodaPackBlooks = {
        'pesip': 'images/Soda/pesip2.png',
        'cok': 'images/Soda/cok_soda.png',
        'spit': 'images/Soda/spit.png',
        'cursh': 'images/Soda/cursh2.png',
        'dr peeper': 'images/Soda/drpeeper.png',
        'africa moist': 'images/Soda/africamoist.png',
        'blue cow': 'images/Soda/bluecow.png',
        'mtn view': 'images/Soda/mtnview.png',
        'root beer': 'images/Soda/rootbeer.png',
        'fatna3': 'images/Soda/fatna3.png'
      };
  
      const ownedBlookSet = new Set((userData.ownedBlooks || []).map(b => b.name.toLowerCase()));
  
      function buildBlookDiv(name, imgSrc) {
        const safeName = name.replace(/"/g, '&quot;');
        return `
          <div id="${safeName}" style="height: 69px;" class="styles__blookContainer___hvHJM-camelCase" role="button" tabindex="0">
            <div class="styles__blookContainer___36LK2-camelCase styles__blook___3FnM0-camelCase">
              <img src="${imgSrc}" alt="${safeName} Trian" draggable="false" class="styles__blook___1R6So-camelCase">
            </div>
          </div>
        `;
      }
  
      let sodaPackHtml = '';
      for (const blookName in sodaPackBlooks) {
        if (ownedBlookSet.has(blookName.toLowerCase())) {
          sodaPackHtml += buildBlookDiv(blookName, sodaPackBlooks[blookName]);
        }
      }
  
      const modalContent = `
        <div class="styles__container___3St5B-camelCase">
          <div class="styles__blooksHolder___1skET-camelCase" id="trianscontainer">
            ${sodaPackHtml}
          </div>
        </div>
      `;
  
      const modal = document.createElement('div');
      modal.className = 'arts__modal___VpEAD-camelCase';
      modal.innerHTML = modalContent;
  
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
  
      document.body.appendChild(modal);
    }
  });
  
  
  
  document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('view');
  
    if (searchButton) {
      searchButton.addEventListener('click', function() {
        createModal('Enter Their Username', 'Username', 'View');
      });
    }
  
    function createModal(title, inputLabel, confirmButtonText) {
      const modal = document.createElement('div');
      modal.className = 'arts__modal___VpEAD-camelCase';
  
      modal.innerHTML = `
        <form class="styles__container___1BPm9-camelCase">
          <div class="styles__text___KSL4--camelCase" style="color: black;">${title}</div>
          <div class="styles__holder___3CEfN-camelCase">
            <div class="styles__numRow___xh98F-camelCase">
              <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17); border-radius: 0.313vw; width: 90%; height: 2.604vw; margin: 0 auto; display: flex;">
                <input id="tradeUsernameInput" style="border: none; height: 100%; font-size: 1.458vw; text-align: center; font-weight: 700; font-family: Nunito, sans-serif; color: black; background-color: #eee; outline: none; width: 100%;" placeholder="${inputLabel}" maxlength="16">
              </div>
            </div>
            <div class="styles__buttonContainer___2EaVD-camelCase">
              <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase trade-confirm" role="button" tabindex="0">
                <div class="styles__shadow___3GMdH-camelCase"></div>
                <div class="styles__edge___3eWfq-camelCase" style="background-color: #aaa;"></div>
                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #ccc;">${confirmButtonText}</div>
              </div>
              <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase trade-cancel" role="button" tabindex="0">
                <div class="styles__shadow___3GMdH-camelCase"></div>
                <div class="styles__edge___3eWfq-camelCase" style="background-color: #aaa;"></div>
                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #ccc;">Cancel</div>
              </div>
            </div>
          </div>
          <input type="submit" style="display: none;">
        </form>
      `;
  
      document.body.appendChild(modal);
  
      const input = modal.querySelector('#tradeUsernameInput');
      const confirmButton = modal.querySelector('.trade-confirm');
      const cancelButton = modal.querySelector('.trade-cancel');
      const form = modal.querySelector('form');
  
      function handleSubmit() {
        const username = input.value.trim();
        if (username === '') {
          alert('Please enter a username.');
        }
        modal.remove();
      }
  
      confirmButton.addEventListener('click', handleSubmit);
      cancelButton.addEventListener('click', () => modal.remove());
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSubmit();
      });
    }
  });
  
  
  
  document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('claim');
  
    if (searchButton) {
      searchButton.addEventListener('click', function () {
        showClaimTokensModal();
      });
    }
  
    function showClaimTokensModal() {
      const modal = document.createElement('div');
      modal.className = 'arts__modal___VpEAD-camelCase';
  
      modal.innerHTML = `
        <div id="result-modal">
          <div class="styles__container___1BPm9-camelCase">
              <div class="styles__text___KSL4--camelCase" style="color: black;">Claim Daily Tokens</div>
              <div class="styles__holder___3CEfN-camelCase">
                  <p id="result-text" style="color: #333; text-align: center; font-family: Nunito, sans-serif;">You have received 50 tokens!</p>
                  <div class="styles__buttonContainer___2EaVD-camelCase">
                      <!-- MODIFIED: Button style reverted to original gray -->
                      <div id="awesome-button" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                          <div class="styles__shadow___3GMdH-camelCase"></div>
                          <div class="styles__edge___3eWfq-camelCase" style="background-color: #aaa;"></div>
                          <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #ccc;">Awesome!</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `;
  
      document.body.appendChild(modal);
  
      modal.querySelector('[role="button"]').addEventListener('click', () => {
        modal.remove();
      });
    }
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('trade');
  
    if (searchButton) {
      searchButton.addEventListener('click', function () {
        showTradeModal((username) => {
          if (username) {
            // Your trade logic here
            alert(`You want to trade with ${username}`);
          } else {
            alert('Please enter a username.');
          }
        });
      });
    }
  
    function showTradeModal(confirmCallback) {
    const modal = document.createElement('div');
    modal.className = 'arts__modal___VpEAD-camelCase';
  
    modal.innerHTML = `
      <form class="styles__container___1BPm9-camelCase">
        <div class="styles__text___KSL4--camelCase" style="color: black;">Who would you like to trade with?</div>
        <div class="styles__holder___3CEfN-camelCase">
          <div class="styles__numRow___xh98F-camelCase">
            <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17); border-radius: 0.313vw; width: 90%; height: 2.604vw; margin: 0 auto; display: flex;">
              <input id="tradeUsernameInput" style="border: none; height: 100%; font-size: 1.458vw; text-align: center; font-weight: 700; font-family: Nunito, sans-serif; color: black; background-color: #eee; outline: none; width: 100%;" placeholder="Username" maxlength="16">
            </div>
          </div>
          <div class="styles__buttonContainer___2EaVD-camelCase">
            <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase trade-confirm" role="button" tabindex="0">
              <div class="styles__shadow___3GMdH-camelCase"></div>
              <div class="styles__edge___3eWfq-camelCase" style="background-color: #aaa;"></div>
              <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #ccc;">Trade</div>
            </div>
            <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase trade-cancel" role="button" tabindex="0">
              <div class="styles__shadow___3GMdH-camelCase"></div>
              <div class="styles__edge___3eWfq-camelCase" style="background-color: #aaa;"></div>
              <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #ccc;">Cancel</div>
            </div>
          </div>
        </div>
        <input type="submit" style="display: none;">
      </form>
    `;
  
    document.body.appendChild(modal);
  
    const input = modal.querySelector('#tradeUsernameInput');
    const confirmBtn = modal.querySelector('.trade-confirm');
    const cancelBtn = modal.querySelector('.trade-cancel');
    const form = modal.querySelector('form');
  
    confirmBtn.addEventListener('click', () => {
      const username = input.value.trim();
      confirmCallback(username);
      modal.remove();
    });
  
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = input.value.trim();
      confirmCallback(username);
      modal.remove();
    });
  }
  
  });
  