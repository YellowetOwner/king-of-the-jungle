//BLOOKS ---
async function addBlook(name, imageURL, sellPrice, rarity) {
    await fetch("/api/admin/blooks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "create",
            newData: {
               name,
               imageURL,
               sellPrice,
               rarity
            }
        })
    })
}

async function getBlooks(){
  const res = await fetch("/api/admin/blooks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "get"
    })
  });
  return await res.json();
}

async function modifyBlook(blook, fieldsToChange) {
    await fetch("/api/admin/blooks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "modify",
              blook,
              newData: fieldsToChange
        })
    })
}

async function removeBlook(blook) {
    await fetch("/api/admin/blooks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "remove",
            blook
        })
    })
}
//BLOOKS END ---

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/stats/user");
    if (!response.ok) return window.location.href = "/stats";

    const { user } = await response.json();
    const allowedRoles = ["Admin", "Dev", "Owner", "Co-Owner", "Planner"];

    if (!allowedRoles.includes(user.role)) {
      window.location.href = "/stats";
    }
  } catch {
    window.location.href = "/stats";
  }
});