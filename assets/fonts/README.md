# Uber Move Fonts

⚠️ **IMPORTANT: React Native requires `.ttf` or `.otf` files, NOT `.woff2`**

## Current Status

You have `.woff2` files which need to be converted to `.ttf` or `.otf` format.

## Required Font Files

Please add the following font files to this directory with these exact names:

- `UberMove-Regular.ttf` (or `.otf`) ✅ You have the .woff2 version
- `UberMove-Bold.ttf` (or `.otf`) ✅ You have the .woff2 version

## How to Convert .woff2 to .ttf

### Option 1: Online Converter (Easiest)
1. Visit: https://cloudconvert.com/woff2-to-ttf
2. Upload `UberMove-Regular.woff2` from this directory
3. Convert to `.ttf` format
4. Download and rename to `UberMove-Regular.ttf`
5. Place it in this directory (`assets/fonts/`)
6. Repeat for `UberMove-Bold.woff2`

### Option 2: FontForge (Desktop App)
1. Download FontForge: https://fontforge.org/
2. Open each `.woff2` file
3. File → Generate Fonts
4. Choose `.ttf` format
5. Save as `UberMove-Regular.ttf` and `UberMove-Bold.ttf`
6. Place in this directory

### Option 3: Run the conversion script
```bash
node scripts/convert-fonts.js
```
This will show you detailed instructions.

## Supported Formats

- `.otf` (OpenType Font) - Currently configured
- `.ttf` (TrueType Font) - If you have .ttf files, update `app/_layout.tsx` to change `.otf` to `.ttf`

## Common Uber Move Font File Names

If your downloaded fonts have different names, here are common variations:
- `UberMoveText-Regular.otf` → Rename to `UberMove-Regular.otf`
- `UberMoveText-Medium.otf` → Rename to `UberMove-Medium.otf`
- `UberMoveText-Bold.otf` → Rename to `UberMove-Bold.otf`
- `UberMoveText-Light.otf` → Rename to `UberMove-Light.otf`

Or if you prefer to keep your original file names, update the font loading in `app/_layout.tsx`:
```typescript
'UberMove-Regular': require('../assets/fonts/YourActualFileName.otf'),
```

## After Adding Fonts

Once you've added the font files:
1. **Restart your Expo development server** (stop and start again)
2. Clear cache if needed: `npx expo start --clear`
3. The fonts will be automatically loaded when the app starts

## Troubleshooting

If fonts don't load:
- Check that file names match exactly (case-sensitive)
- Verify the files are in `assets/fonts/` directory
- Make sure you're using `.otf` or update to `.ttf` in the code
- Try clearing the cache: `npx expo start --clear`

