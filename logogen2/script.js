const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");
const promptInput = generateForm.querySelector(".prompt-input");
const imgQuantityInput = generateForm.querySelector(".img-quantity");

const HUGGINGFACE_API_KEY = "YOUR_HUGGINGFACE_API_KEY";
const MODEL_NAME = "black-forest-labs/FLUX.1-schnell";

let isImageGenerating = false;

const generateAiLogos = async (userPrompt, userImgQuantity) => {
  try {
    const imgDataArray = [];

    for (let i = 0; i < userImgQuantity; i++) {
      const variedPrompt = `Minimalistic vector logo, ${userPrompt}, simple clean design, modern, flat style, high resolution, unique variation ${i}`;

      const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: variedPrompt,
          parameters: { width: 512, height: 512, seed: Math.floor(Math.random() * 100000) }
        }),
      });

      if (!response.ok) throw new Error("Failed to generate AI logos. Check API key or model availability.");

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      imgDataArray.push(imageUrl);
    }

    updateImageCard(imgDataArray);
  } catch (error) {
    alert(error.message);
    imageGallery.innerHTML = ""; // Remove loading placeholders if an error occurs
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
};

const updateImageCard = (imgDataArray) => {
  imageGallery.innerHTML = ""; // Clear previous images

  imgDataArray.forEach((imgSrc) => {
    const imgCard = document.createElement("div");
    imgCard.classList.add("img-card");
    
    const imgElement = document.createElement("img");
    imgElement.src = imgSrc;

    const downloadBtn = document.createElement("a");
    downloadBtn.href = imgSrc;
    downloadBtn.download = `AI_Logo_${Date.now()}.jpg`;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    downloadBtn.classList.add("download-btn");

    imgCard.appendChild(imgElement);
    imgCard.appendChild(downloadBtn);
    imageGallery.appendChild(imgCard);
  });
};

const handleImageGeneration = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  const userPrompt = promptInput.value.trim();
  const userImgQuantity = parseInt(imgQuantityInput.value);

  if (!userPrompt) {
    alert("Please enter a description for the logo.");
    return;
  }

  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating...";
  isImageGenerating = true;

  // Show loading placeholders with spinners
  imageGallery.innerHTML = Array.from({ length: userImgQuantity }, () => 
    `<div class="img-card loading">
      <div class="spinner"></div>
    </div>`
  ).join("");

  generateAiLogos(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleImageGeneration);
