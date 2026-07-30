// HƏR BİR GEYİMİN DƏQİQ KOORDİNAT BAZASI
const itemData = {
  "open-blonde-hair": { top: "8%", left: "53.36%", width: "36.4%", zIndex: 4, },
  "red-top": { top: "29.5%", left: "53.9%", width: "115.8px", zIndex: 3 },
  "brown-top": { top: "23.7%", left: "54.5%", width: "19.8%", zIndex: 3 },
  "brown-heels": { top: "85.2%", left: "49.65%", width: "40%", zIndex: 2 },
  "trous-2": { top: "42%", left: "51.37%", width: "37%", zIndex: 2 },
};

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  // Sürüklənən əşyanın şəkli və data-id-sini yaddaşa alırıq
  ev.dataTransfer.setData("imageSrc", ev.target.src);
  ev.dataTransfer.setData("itemId", ev.target.getAttribute("data-id"));
}

function drop(ev) {
  ev.preventDefault();

  // Yaddaşdan məlumatları çəkirik
  const imgSrc = ev.dataTransfer.getData("imageSrc");
  const itemId = ev.dataTransfer.getData("itemId");

  // Əgər bu əşya bizim bazamızda yoxdursa, heç nə etmə
  if (!itemData[itemId]) return;

  const scene = document.querySelector(".scene");
  const config = itemData[itemId]; // Geyimin dəqiq rəqəmlərini alırıq

  // Eyni geyimdən iki dənə olmasın deyə, əgər əvvəl geyindirlibsə, onu tapıb silirik
  const existingItem = document.getElementById("dropped-" + itemId);
  if (existingItem) {
    existingItem.remove();
  }

  // Yeni, tam yerinə oturan şəkli yaradırıq
  const newImg = document.createElement("img");
  newImg.src = imgSrc;
  newImg.id = "dropped-" + itemId;
  newImg.className = "dropped-item";

  // Bazadakı rəqəmləri tətbiq edirik (Sehir burdadır!)
  newImg.style.top = config.top;
  newImg.style.left = config.left;
  newImg.style.right = config.right;
  newImg.style.width = config.width;
  newImg.style.zIndex = config.zIndex;

  // Geyimi səhnəyə əlavə edirik
  scene.appendChild(newImg);
  // 1. Paltarı geyindirdikdən sonra qarderobdakı orijinalını gizlədirik
  const originalItem = document.querySelector(`.wardrobe img[data-id="${itemId}"]`);
  if (originalItem) {
      originalItem.style.visibility = "hidden"; 
  }

  // 2. Layers panelinə paltarın adını əlavə edirik
  addLayerItem(itemId, config.name);

  // 3. Manekendəki paltarı çıxarıb geri ata bilmək üçün sürüklənə bilən edirik
  newImg.draggable = true;
  newImg.ondragstart = function(e) {
      e.dataTransfer.setData("itemId", itemId);
      e.dataTransfer.setData("isReturn", "true");
  };
}

// Layers panelini açıb-bağlayan köhnə funksiyan (olduğu kimi qalır)
function toggleLayers() {
  const panel = document.getElementById("layersPanel");
  panel.classList.toggle("open");
}

// Layers panelini açıb-bağlayan funksiya
function toggleLayers() {
  const panel = document.getElementById("layersPanel");
  panel.classList.toggle("open");
}

// Layers panelinə geyim adını əlavə edən yeni funksiya
function addLayerItem(layerId, itemName) {
  const panel = document.getElementById("layersPanel");
  let existingItem = document.getElementById("layer-" + layerId);

  // Əgər bu qat üçün artıq yazı yoxdursa, yenisini yarat
  if (!existingItem) {
    existingItem = document.createElement("p");
    existingItem.id = "layer-" + layerId;
    existingItem.style.color = "#fff";
    existingItem.style.fontSize = "12px";
    existingItem.style.margin = "5px 0";
    panel.appendChild(existingItem);
  }
  // Geyimin adını yenilə
  if (itemName) {
    existingItem.innerText = "- " + itemName;
  }
}

// Layers panelindən geyimi silən yeni funksiya
function removeLayerItem(layerId) {
  const existingItem = document.getElementById("layer-" + layerId);
  if (existingItem) {
    existingItem.remove();
  }
}

function returnToWardrobe(ev) {
  ev.preventDefault();
  const itemId = ev.dataTransfer.getData("itemId");
  const isReturn = ev.dataTransfer.getData("isReturn");

  // Əgər həqiqətən manekendən paltar qaytarılırsa
  if (isReturn === "true") {
      // 1. Manekendəki (səhnədəki) paltarı sil
      const droppedItem = document.getElementById("dropped-" + itemId);
      if (droppedItem) droppedItem.remove();

      // 2. Qarderobdakı paltarı yenidən görünür et
      const originalItem = document.querySelector(`.wardrobe img[data-id="${itemId}"]`);
      if (originalItem) originalItem.style.visibility = "visible";

      // 3. Layers panelindən paltarın adını sil
      removeLayerItem(itemId);
  }
}
