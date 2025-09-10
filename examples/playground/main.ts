import PrettyQR from '../../dist/index.js';

// DOM elements
const textInput = document.getElementById('text') as HTMLTextAreaElement;
const sizeInput = document.getElementById('size') as HTMLInputElement;
const errorLevelSelect = document.getElementById('errorLevel') as HTMLSelectElement;
const backgroundInput = document.getElementById('background') as HTMLInputElement;
const foregroundInput = document.getElementById('foreground') as HTMLInputElement;
const eyeStyleSelect = document.getElementById('eyeStyle') as HTMLSelectElement;
const patternStyleSelect = document.getElementById('patternStyle') as HTMLSelectElement;
const gradientInput = document.getElementById('gradient') as HTMLInputElement;
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
    gradient: '',
    logo: '',
  },
  gradient: {
    background: '#ffffff',
    foreground: '#000000',
    eyeStyle: 'rounded',
    patternStyle: 'rounded',
    gradient: 'linear-gradient(45deg, #667eea, #764ba2)',
    logo: '',
  },
  rounded: {
    background: '#ffffff',
    foreground: '#000000',
    eyeStyle: 'rounded',
    patternStyle: 'rounded',
    gradient: '',
    logo: '',
  },
  dots: {
    background: '#ffffff',
    foreground: '#000000',
    eyeStyle: 'circle',
    patternStyle: 'dots',
    gradient: '',
    logo: '',
  },
  diamond: {
    background: '#ffffff',
    foreground: '#000000',
    eyeStyle: 'diamond',
    patternStyle: 'diamond',
    gradient: '',
    logo: '',
  },
};

// Current QR code instance
let currentQR: PrettyQR | null = null;

// Initialize
function init() {
  // Set up event listeners
  textInput.addEventListener('input', generateQR);
  sizeInput.addEventListener('input', generateQR);
  errorLevelSelect.addEventListener('change', generateQR);
  backgroundInput.addEventListener('input', generateQR);
  foregroundInput.addEventListener('input', generateQR);
  eyeStyleSelect.addEventListener('change', generateQR);
  patternStyleSelect.addEventListener('change', generateQR);
  gradientInput.addEventListener('input', generateQR);
  logoInput.addEventListener('input', generateQR);
  logoSizeInput.addEventListener('input', updateLogoSize);

  downloadSvgBtn.addEventListener('click', downloadSVG);
  downloadPngBtn.addEventListener('click', downloadPNG);
  copySvgBtn.addEventListener('click', copySVG);

  // Preset buttons
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      if (preset) applyPreset(preset);
    });
  });

  // Initial generation
  generateQR();
}

// Update logo size display
function updateLogoSize() {
  logoSizeValue.textContent = `${logoSizeInput.value}%`;
  generateQR();
}

// Apply preset
function applyPreset(presetName: string) {
  const preset = presets[presetName as keyof typeof presets];
  if (!preset) return;

  // Update UI
  backgroundInput.value = preset.background;
  foregroundInput.value = preset.foreground;
  eyeStyleSelect.value = preset.eyeStyle;
  patternStyleSelect.value = preset.patternStyle;
  gradientInput.value = preset.gradient;
  logoInput.value = preset.logo;

  // Update active preset button
  presetBtns.forEach((btn) => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-preset="${presetName}"]`)?.classList.add('active');

  generateQR();
}

// Generate QR code
function generateQR() {
  try {
    const options = {
      text: textInput.value || 'https://github.com/your-username/prettyqr',
      size: parseInt(sizeInput.value, 10),
      errorCorrectionLevel: errorLevelSelect.value as 'L' | 'M' | 'Q' | 'H',
      style: {
        background: backgroundInput.value,
        foreground: foregroundInput.value,
        eyeStyle: eyeStyleSelect.value as 'square' | 'rounded' | 'circle' | 'diamond',
        patternStyle: patternStyleSelect.value as
          | 'square'
          | 'rounded'
          | 'circle'
          | 'diamond'
          | 'dots',
        gradient: gradientInput.value
          ? {
              type: 'linear' as const,
              colors: parseGradientColors(gradientInput.value),
              direction: 45,
            }
          : undefined,
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
    const svg = currentQR.toSVG();
    qrCodeDiv.innerHTML = svg;
  } catch (error) {
    qrCodeDiv.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">
      Error generating QR code: ${error instanceof Error ? error.message : 'Unknown error'}
    </div>`;
  }
}

// Parse gradient colors from CSS string
function parseGradientColors(gradientStr: string): string[] {
  // Simple parser for linear-gradient colors
  const match = gradientStr.match(/linear-gradient\([^,]+,\s*([^)]+)\)/);
  if (match) {
    return match[1].split(',').map((color) => color.trim());
  }
  return ['#667eea', '#764ba2'];
}

// Download SVG
async function downloadSVG() {
  if (!currentQR) return;

  try {
    await currentQR.download('pretty-qr.svg');
  } catch (_error) {}
}

// Download PNG
async function downloadPNG() {
  if (!currentQR) return;

  try {
    const _svg = currentQR.toSVG();
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

// Copy SVG to clipboard
async function copySVG() {
  if (!currentQR) return;

  try {
    const svg = currentQR.toSVG();
    await navigator.clipboard.writeText(svg);

    // Show feedback
    const originalText = copySvgBtn.textContent;
    copySvgBtn.textContent = 'Copied!';
    copySvgBtn.style.background = '#28a745';

    setTimeout(() => {
      copySvgBtn.textContent = originalText;
      copySvgBtn.style.background = '';
    }, 2000);
  } catch (_error) {}
}

// Initialize the app
init();
