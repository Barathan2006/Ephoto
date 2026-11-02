import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Upload, RefreshCw, Check, ArrowRight, Image as ImageIcon, Sliders } from 'lucide-react';
import { Product } from '../types';

export const ImageCreationStudio: React.FC = () => {
  const { categories, addProduct, currentUser, navigateTo, showToast } = useApp();

  const [mode, setMode] = useState<'generate' | 'upload'>('generate');
  const [stylePreset, setStylePreset] = useState<'sunset' | 'cyber' | 'nebula' | 'bauhaus' | 'waves'>('sunset');
  const [colorPalette, setColorPalette] = useState<'golden' | 'cyber' | 'emerald' | 'violet' | 'mono'>('golden');
  const [resolution, setResolution] = useState<'4k' | '2k' | 'square'>('4k');
  const [seed, setSeed] = useState<number>(42);

  // Form details
  const [title, setTitle] = useState('Golden Horizon Alpine Glow');
  const [description, setDescription] = useState('Atmospheric sunset gradients over mountain silhouetted peaks, rendered with mathematical precision for wallpaper and print reproduction.');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [price, setPrice] = useState<number>(29.0);

  // Generated or uploaded images
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [originalDataUrl, setOriginalDataUrl] = useState<string>('');
  const [imageWidth, setImageWidth] = useState<number>(3840);
  const [imageHeight, setImageHeight] = useState<number>(2160);
  const [fileSize, setFileSize] = useState<string>('12.4 MB');
  const [format, setFormat] = useState<'JPEG' | 'PNG' | 'WebP'>('PNG');
  const [isRendering, setIsRendering] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Render procedural canvas artwork
  const renderArtwork = () => {
    setIsRendering(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 1920;
    let h = 1080;
    if (resolution === '4k') {
      w = 3840;
      h = 2160;
    } else if (resolution === '2k') {
      w = 2560;
      h = 1440;
    } else {
      w = 2048;
      h = 2048;
    }

    canvas.width = w;
    canvas.height = h;

    setImageWidth(w);
    setImageHeight(h);

    // Color definitions
    const paletteConfigs = {
      golden: ['#0f0c1b', '#2d1537', '#7b1e42', '#d94b34', '#f8a541', '#ffe49e'],
      cyber: ['#050811', '#0b192e', '#093c59', '#0d828a', '#2be4ba', '#98fce2'],
      emerald: ['#02120e', '#05291f', '#094d3a', '#10805a', '#2ac289', '#8efbd2'],
      violet: ['#0c0617', '#1c0f33', '#391c63', '#6f2b96', '#ba4de0', '#f1a8ff'],
      mono: ['#0a0a0a', '#1a1a1a', '#333333', '#666666', '#a0a0a0', '#f5f5f5'],
    };

    const colors = paletteConfigs[colorPalette];

    // Style generator logic
    if (stylePreset === 'sunset') {
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(0.3, colors[1]);
      grad.addColorStop(0.55, colors[2]);
      grad.addColorStop(0.75, colors[3]);
      grad.addColorStop(0.9, colors[4]);
      grad.addColorStop(1, colors[5]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Glowing Sun orb
      const sunGrad = ctx.createRadialGradient(w * 0.5, h * 0.65, 10, w * 0.5, h * 0.65, w * 0.35);
      sunGrad.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
      sunGrad.addColorStop(0.2, colors[4]);
      sunGrad.addColorStop(0.6, 'rgba(217, 75, 52, 0.3)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, h);

      // Layered Mountain Ridges
      const ridges = [
        { yOffset: 0.65, height: 0.15, color: colors[2], steps: 18 },
        { yOffset: 0.72, height: 0.20, color: colors[1], steps: 22 },
        { yOffset: 0.80, height: 0.24, color: '#090510', steps: 26 },
        { yOffset: 0.90, height: 0.18, color: '#030206', steps: 30 },
      ];

      ridges.forEach((ridge, rIdx) => {
        ctx.fillStyle = ridge.color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * ridge.yOffset);

        const segmentWidth = w / ridge.steps;
        for (let i = 0; i <= ridge.steps; i++) {
          const pseudoRand = Math.sin(i * 1.7 + seed + rIdx * 3.1) * Math.cos(i * 0.8 + seed);
          const py = h * ridge.yOffset + pseudoRand * (h * ridge.height);
          ctx.lineTo(i * segmentWidth, py);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      });

    } else if (stylePreset === 'cyber') {
      // Dark cyber background
      ctx.fillStyle = colors[0];
      ctx.fillRect(0, 0, w, h);

      // Perspective Grid
      const horizonY = h * 0.55;
      const vanishingX = w * 0.5;

      // Top sky ambient
      const topGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      topGrad.addColorStop(0, colors[1]);
      topGrad.addColorStop(1, colors[0]);
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Radial neon pulse
      const pulseGrad = ctx.createRadialGradient(vanishingX, horizonY, 5, vanishingX, horizonY, w * 0.45);
      pulseGrad.addColorStop(0, colors[4]);
      pulseGrad.addColorStop(0.4, colors[2] + '55');
      pulseGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = pulseGrad;
      ctx.fillRect(0, 0, w, h);

      // Floor grid lines
      ctx.strokeStyle = colors[3];
      ctx.lineWidth = Math.max(2, w / 1200);

      const numLines = 32;
      for (let i = -numLines; i <= numLines * 2; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(i * (w / 16), h);
        ctx.stroke();
      }

      // Horizontal grid lines with perspective compression
      for (let y = horizonY + 20; y < h; y += Math.pow((y - horizonY) / 12, 1.35)) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

    } else if (stylePreset === 'nebula') {
      // Cosmic Nebula space
      ctx.fillStyle = '#030206';
      ctx.fillRect(0, 0, w, h);

      // Starfield
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 400; i++) {
        const sx = ((Math.sin(i * 99 + seed) + 1) / 2) * w;
        const sy = ((Math.cos(i * 37 + seed) + 1) / 2) * h;
        const sSize = ((Math.sin(i * 13) + 1) / 2) * 2.5 + 0.5;
        const alpha = ((Math.cos(i * 71) + 1) / 2) * 0.8 + 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gas clouds
      for (let c = 0; c < 5; c++) {
        const cx = w * (0.3 + c * 0.15);
        const cy = h * (0.4 + (Math.sin(c + seed) * 0.2));
        const rad = w * (0.2 + c * 0.08);

        const nebGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, rad);
        nebGrad.addColorStop(0, colors[(c % colors.length)] + 'aa');
        nebGrad.addColorStop(0.5, colors[((c + 1) % colors.length)] + '44');
        nebGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = nebGrad;
        ctx.fillRect(0, 0, w, h);
      }

    } else if (stylePreset === 'bauhaus') {
      // Minimal Bauhaus
      ctx.fillStyle = '#f2efe9';
      ctx.fillRect(0, 0, w, h);

      // Large geometric circle
      ctx.fillStyle = colors[2];
      ctx.beginPath();
      ctx.arc(w * 0.45, h * 0.45, Math.min(w, h) * 0.32, 0, Math.PI * 2);
      ctx.fill();

      // Sharp diagonal rectangle
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.85);
      ctx.lineTo(w * 0.75, h * 0.15);
      ctx.lineTo(w * 0.82, h * 0.22);
      ctx.lineTo(w * 0.17, h * 0.92);
      ctx.closePath();
      ctx.fill();

      // Accent square & grid
      ctx.fillStyle = colors[4];
      ctx.fillRect(w * 0.62, h * 0.5, w * 0.2, h * 0.3);

      ctx.fillStyle = '#111111';
      for (let col = 0; col < 6; col++) {
        ctx.fillRect(w * 0.2 + col * (w * 0.04), h * 0.25, 4, h * 0.15);
      }

    } else {
      // Fluid Waves
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let wave = 0; wave < 6; wave++) {
        const waveGrad = ctx.createLinearGradient(0, 0, w, 0);
        waveGrad.addColorStop(0, colors[(wave + 1) % colors.length] + 'cc');
        waveGrad.addColorStop(1, colors[(wave + 2) % colors.length] + 'ee');
        ctx.fillStyle = waveGrad;

        ctx.beginPath();
        const startY = h * (0.3 + wave * 0.1);
        ctx.moveTo(0, startY);

        for (let x = 0; x <= w; x += w / 20) {
          const cy = startY + Math.sin(x * 0.003 + wave + seed) * (h * 0.12);
          ctx.lineTo(x, cy);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Export high-res data URL
    const originalUrl = canvas.toDataURL('image/png', 0.95);
    setOriginalDataUrl(originalUrl);
    setPreviewDataUrl(originalUrl);
    setFormat('PNG');
    setFileSize((((w * h * 4) / (1024 * 1024)) * 0.18).toFixed(1) + ' MB');
    setIsRendering(false);
  };

  useEffect(() => {
    if (mode === 'generate') {
      renderArtwork();
    }
  }, [stylePreset, colorPalette, resolution, seed, mode]);

  // Handle local image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPEG, PNG, WebP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.naturalWidth || 4000);
        setImageHeight(img.naturalHeight || 3000);
        setOriginalDataUrl(result);
        setPreviewDataUrl(result);
        setFormat(file.type.includes('png') ? 'PNG' : file.type.includes('webp') ? 'WebP' : 'JPEG');
        setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        showToast(`Loaded ${file.name} (${img.naturalWidth} × ${img.naturalHeight}px)`, 'success');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Submit to Marketplace Catalog
  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please provide a title for your image.', 'error');
      return;
    }

    if (!previewDataUrl || !originalDataUrl) {
      showToast('Please generate or upload an image first.', 'error');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const newProduct: Omit<Product, 'id' | 'createdAt' | 'downloadsCount'> = {
      title: title.trim(),
      description: description.trim(),
      price: Math.max(1, Number(price) || 29),
      categoryId,
      categoryName: selectedCategory?.categoryName || 'Wallpapers',
      previewImage: previewDataUrl,
      originalImage: originalDataUrl,
      imageFormat: format,
      imageWidth,
      imageHeight,
      fileSize,
      isActive: true,
      authorName: currentUser.username,
      authorAvatar: currentUser.profileImage,
      orientation: imageWidth > imageHeight ? 'landscape' : imageWidth < imageHeight ? 'portrait' : 'square',
    };

    const created = addProduct(newProduct);
    showToast(`"${created.title}" successfully listed on the marketplace!`, 'success');
    navigateTo('details', created.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      
      {/* Studio Header */}
      <div className="border-b border-neutral-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-emerald-400 font-medium">Creator Studio</span>
          <span aria-hidden="true">·</span>
          <span>Generate or Upload Custom Artwork</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Deployment Demo Marketplace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create & Sell Your Own Image
        </h1>
        <p className="mt-2 text-sm text-neutral-400 max-w-2xl leading-relaxed">
          Produce high-definition digital imagery using our in-browser mathematical procedural canvas engine or upload your original photography to list directly for demo purchase and high-res download.
        </p>

        {/* Mode Selector Tabs */}
        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => setMode('generate')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'generate'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Procedural Canvas Art Studio
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'upload'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload My Image File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Side: Artwork Visualizer & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 aspect-[16/9] shadow-2xl flex items-center justify-center">
            {mode === 'generate' ? (
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain bg-neutral-950"
              />
            ) : previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Upload preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-center p-8 cursor-pointer hover:border-emerald-500 transition-colors"
              >
                <Upload className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Click or drag image file here</p>
                <p className="text-xs text-neutral-500 mt-1">JPEG, PNG, WebP up to 50MB</p>
              </div>
            )}

            {isRendering && (
              <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center text-white text-xs gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                Rendering 4K Canvas...
              </div>
            )}
          </div>

          {/* Generator Controls (when mode === generate) */}
          {mode === 'generate' ? (
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Visual Parameters
                </span>
                <button
                  onClick={() => setSeed(Math.floor(Math.random() * 10000))}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Randomize Variation
                </button>
              </div>

              {/* Style Presets */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Art Style Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { id: 'sunset', label: 'Sunset Peaks' },
                    { id: 'cyber', label: 'Cyber Matrix' },
                    { id: 'nebula', label: 'Cosmic Nebula' },
                    { id: 'bauhaus', label: 'Bauhaus' },
                    { id: 'waves', label: 'Fluid Waves' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setStylePreset(preset.id as any)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors border ${
                        stylePreset === preset.id
                          ? 'bg-neutral-800 text-emerald-400 border-emerald-500/50'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Palette & Resolution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Color Spectrum
                  </label>
                  <select
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="golden">Golden Horizon / Amber</option>
                    <option value="cyber">Cyber Cyan & Teal</option>
                    <option value="emerald">Deep Forest Emerald</option>
                    <option value="violet">Deep Space Violet</option>
                    <option value="mono">Architectural Monochrome</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Export Output Quality
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="4k">Ultra HD 4K (3840 × 2160)</option>
                    <option value="2k">QHD 2K (2560 × 1440)</option>
                    <option value="square">Square 1:1 (2048 × 2048)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Upload file picker */
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-xs text-neutral-400">
                {originalDataUrl ? 'File ready for listing' : 'No local file chosen yet'}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Choose Local File
              </button>
            </div>
          )}

          {/* Detected specs summary */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Resolution: {imageWidth} × {imageHeight} px</span>
            <span aria-hidden="true">·</span>
            <span>Format: {format}</span>
            <span aria-hidden="true">·</span>
            <span>Size: {fileSize}</span>
          </div>
        </div>

        {/* Right Side: Marketplace Listing Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handlePublishListing}
            className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl space-y-5"
          >
            <div>
              <h2 className="text-lg font-bold text-white">
                Marketplace Listing Details
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Configure your product information for potential demo buyers.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Image Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Alpine Dawn Over Dolomite Pinnacles"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Marketplace Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Demo Price ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-7 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Demo price only. No real payment will be collected during checkout.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Description & Story
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe camera settings, scene context, or artistic inspiration..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
              />
            </div>

            {/* Author Attribution */}
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-3">
              <img
                src={currentUser.profileImage}
                alt={currentUser.username}
                className="w-7 h-7 rounded-full object-cover border border-neutral-700"
              />
              <div className="text-xs">
                <div className="text-neutral-400">Seller / Creator:</div>
                <div className="font-semibold text-white">{currentUser.username}</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Publish Image for Demo Sale
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
