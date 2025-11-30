# Font Conversion Guide

## ⚠️ Current Issue

You have `.woff2` font files, but React Native requires `.ttf` or `.otf` files.

## Quick Fix (5 minutes)

### Step 1: Convert Fonts Online

1. Go to: **https://cloudconvert.com/woff2-to-ttf**
2. Upload `assets/fonts/UberMove-Regular.woff2`
3. Click "Convert"
4. Download the converted file
5. Rename it to `UberMove-Regular.ttf`
6. Place it in `assets/fonts/` folder
7. Repeat for `UberMove-Bold.woff2` → `UberMove-Bold.ttf`

### Step 2: Verify Files

Make sure these files exist in `assets/fonts/`:
- ✅ `UberMove-Regular.ttf`
- ✅ `UberMove-Bold.ttf`

### Step 3: Restart Expo

```bash
npx expo start --clear
```

## Alternative: Use FontForge

1. Download: https://fontforge.org/
2. Open each `.woff2` file
3. File → Generate Fonts → Choose `.ttf`
4. Save in `assets/fonts/` with correct names

## Current Font Setup

The app is configured to use:
- `UberMove-Regular.ttf` - For regular text
- `UberMove-Bold.ttf` - For bold text

Medium and Light weights will use Regular with font-weight until you add those font files.

## After Conversion

Once converted, the fonts will automatically load when you restart the app. No code changes needed!

