import PrettyQR from '../../src/index';

// DOM elements
const textInput = document.getElementById('text') as HTMLTextAreaElement;
const recipePresetSelect = document.getElementById('recipePreset') as HTMLSelectElement;
const sizeInput = document.getElementById('size') as HTMLInputElement;
const errorLevelSelect = document.getElementById('errorLevel') as HTMLSelectElement;
const backgroundInput = document.getElementById('background') as HTMLInputElement;
const foregroundInput = document.getElementById('foreground') as HTMLInputElement;
const eyeStyleSelect = document.getElementById('eyeStyle') as HTMLSelectElement;
const patternStyleSelect = document.getElementById('patternStyle') as HTMLSelectElement;
const logoInput = document.getElementById('logo') as HTMLInputElement;
const logoSizeInput = document.getElementById('logoSize') as HTMLInputElement;
const logoSizeValue = document.getElementById('logoSizeValue') as HTMLSpanElement;
const qrCodeDiv = document.getElementById('qrCode') as HTMLDivElement;
const downloadSvgBtn = document.getElementById('downloadSvg') as HTMLButtonElement;
const downloadPngBtn = document.getElementById('downloadPng') as HTMLButtonElement;
const copySvgBtn = document.getElementById('copySvg') as HTMLButtonElement;
const presetBtns = document.querySelectorAll('.preset-btn') as NodeListOf<HTMLButtonElement>;

// Preset configurations
const presets = {
  default: {
    background: '#ffffff',
    foreground: '#000000',
    eyeStyle: 'square',
    patternStyle: 'square',
    logo: '',
  },
  rounded: {
    background: '#ffffff',
    foreground: '#2563eb',
    eyeStyle: 'rounded',
    patternStyle: 'rounded',
    logo: '',
  },
  circle: {
    background: '#ffffff',
    foreground: '#0b1324',
    eyeStyle: 'full-rounded',
    patternStyle: 'circle',
    logo: '',
  },
  diamond: {
    background: '#ffffff',
    foreground: '#0f172a',
    eyeStyle: 'square',
    patternStyle: 'diamond',
    logo: '',
  },
};

let currentQR: PrettyQR | null = null;

const recipeScenarios: Record<
  string,
  {
    text: string;
    foreground: string;
    patternStyle: 'square' | 'rounded' | 'circle' | 'diamond';
    eyeStyle: 'square' | 'rounded' | 'full-rounded';
  }
> = {
  none: {
    text: '',
    foreground: '',
    patternStyle: 'square',
    eyeStyle: 'square',
  },
  card: {
    text: 'solana:merchant-wallet?amount=12.50',
    foreground: '#229ed9',
    patternStyle: 'rounded',
    eyeStyle: 'rounded',
  },
  dialog: {
    text: 'https://example.com/pay/checkout-id',
    foreground: '#0b1324',
    patternStyle: 'rounded',
    eyeStyle: 'rounded',
  },
  tabs: {
    text: 'solana:merchant-wallet',
    foreground: '#0f172a',
    patternStyle: 'square',
    eyeStyle: 'square',
  },
};

function init() {
  textInput.addEventListener('input', generateQR);
  recipePresetSelect.addEventListener('change', applyRecipeScenario);
  sizeInput.addEventListener('input', generateQR);
  errorLevelSelect.addEventListener('change', generateQR);
  backgroundInput.addEventListener('input', generateQR);
  foregroundInput.addEventListener('input', generateQR);
  eyeStyleSelect.addEventListener('change', generateQR);
  patternStyleSelect.addEventListener('change', generateQR);
  logoInput.addEventListener('input', generateQR);
  logoSizeInput.addEventListener('input', updateLogoSize);

  downloadSvgBtn.addEventListener('click', downloadSVG);
  downloadPngBtn.addEventListener('click', downloadPNG);
  copySvgBtn.addEventListener('click', copySVG);

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      if (preset) applyPreset(preset);
    });
  });

  generateQR();
}

function applyRecipeScenario() {
  const selected = recipePresetSelect.value;
  const scenario = recipeScenarios[selected];
  if (!scenario || selected === 'none') {
    generateQR();
    return;
  }

  textInput.value = scenario.text;
  foregroundInput.value = scenario.foreground;
  patternStyleSelect.value = scenario.patternStyle;
  eyeStyleSelect.value = scenario.eyeStyle;
  generateQR();
}

function updateLogoSize() {
  logoSizeValue.textContent = `${logoSizeInput.value}%`;
  generateQR();
}

function applyPreset(presetName: string) {
  const preset = presets[presetName as keyof typeof presets];
  if (!preset) return;

  backgroundInput.value = preset.background;
  foregroundInput.value = preset.foreground;
  eyeStyleSelect.value = preset.eyeStyle;
  patternStyleSelect.value = preset.patternStyle;
  logoInput.value = preset.logo;

  presetBtns.forEach((btn) => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-preset="${presetName}"]`)?.classList.add('active');

  generateQR();
}

function generateQR() {
  try {
    const options = {
      text: textInput.value || 'https://github.com/your-username/prettyqr',
      size: parseInt(sizeInput.value, 10),
      errorCorrectionLevel: errorLevelSelect.value as 'L' | 'M' | 'Q' | 'H',
      style: {
        background: backgroundInput.value,
        foreground: foregroundInput.value,
        eyeStyle: eyeStyleSelect.value as 'square' | 'rounded' | 'full-rounded',
        patternStyle: patternStyleSelect.value as 'square' | 'rounded' | 'circle' | 'diamond',
      },
      logo: logoInput.value
        ? {
            src: logoInput.value,
            size: Math.floor(
              (parseInt(sizeInput.value, 10) * parseInt(logoSizeInput.value, 10)) / 100,
            ),
          }
        : undefined,
    };

    currentQR = new PrettyQR(options);
    qrCodeDiv.innerHTML = currentQR.toSVG();
  } catch (error) {
    qrCodeDiv.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">
      Error generating QR code: ${error instanceof Error ? error.message : 'Unknown error'}
    </div>`;
  }
}

async function downloadSVG() {
  if (!currentQR) return;
  try {
    await currentQR.download('pretty-qr.svg');
  } catch (_error) {}
}

async function downloadPNG() {
  if (!currentQR) return;

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();

    const size = parseInt(sizeInput.value, 10);
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'pretty-qr.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = currentQR.toDataURL();
  } catch (_error) {}
}

async function copySVG() {
  if (!currentQR) return;

  try {
    const svg = currentQR.toSVG();
    await navigator.clipboard.writeText(svg);

    const originalText = copySvgBtn.textContent;
    copySvgBtn.textContent = 'Copied!';
    copySvgBtn.style.background = '#28a745';

    setTimeout(() => {
      copySvgBtn.textContent = originalText;
      copySvgBtn.style.background = '';
    }, 2000);
  } catch (_error) {}
}

init();
