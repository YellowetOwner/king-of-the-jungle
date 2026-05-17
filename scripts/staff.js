async function changeBlookReq(action,blook="",newData={}){
    const res = await fetch("/api/admin/blooks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,blook,newData})});
    const data = await res.json();
    if(!data.success){
      alert("Error: " + data.error);
      return;
    }
    return data;
  }
  async function changeUsersReq(action,userId="",newData={}){
    const res = await fetch("/api/admin/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,userId,newData})});
    const data = await res.json();
    if(!data.success){
      alert("Error: " + data.error);
      return;
    }
    return data;
  }
  async function changePackReq(action,packId="",packData={}){
    const res = await fetch("/api/admin/packs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,packId,packData})});
    const data = await res.json();
    if(!data.success){
      alert("Error: " + data.error);
      return;
    }
    return data;
  }
  
  // BLOOKS ---
  async function addBlook(name, imageURL, sellPrice, rarity) {
    return await changeBlookReq("create", "", {
      name,
      imageURL,
      sellPrice,
      rarity
    });
  }
  
  async function getBlooks() {
    const res = await changeBlookReq("get");
    return res.blooks;
  }
  
  async function modifyBlook(blook, fieldsToChange) {
    return await changeBlookReq("modify", blook, fieldsToChange);
  }
  
  async function removeBlook(blook) {
    return await changeBlookReq("remove", blook);
  }
  // BLOOKS END ---
  
  //USERS ---
  async function getUsers(){
    return (await changeUsersReq("get")).users;
  }
  async function modifyUser(userId, fieldsToChange){
    return await changeUsersReq("modify",userId,fieldsToChange);
  }
  async function removeUser(userId){
    return await changeUsersReq("remove",userId);
  }
  //USERS END ---
  //PACKS --
  async function getPacks(){
    return (await changePackReq("get")).packs;
  }
  async function modifyPack(packId, newData){
    return await changePackReq("modify",packId,newData);
  }
  async function createPack(packData){
    return await changePackReq("create",null,packData);
  }
  async function removePack(packId){
    return await changePackReq("remove",packId);
  }
  
  //PACKS END ---
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
  