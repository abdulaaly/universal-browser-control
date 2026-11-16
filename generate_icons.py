import math
from PIL import Image, ImageDraw, ImageFilter

def create_icon(size):
    scale = 4  # supersample for antialiasing
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background rounded rect with deep dark gradient
    radius = int(s * 0.22)
    # Background base
    draw.rounded_rectangle([0, 0, s - 1, s - 1], radius=radius, fill=(10, 15, 29, 255), outline=(30, 41, 59, 255), width=int(s * 0.02))

    # Inner subtle glow border
    glow_margin = int(s * 0.04)
    draw.rounded_rectangle([glow_margin, glow_margin, s - 1 - glow_margin, s - 1 - glow_margin], 
                           radius=int(radius * 0.85), outline=(16, 185, 129, 80), width=int(s * 0.015))

    # 2. Browser Header Bar (dots)
    header_y = int(s * 0.22)
    draw.line([(int(s * 0.12), header_y), (int(s * 0.88), header_y)], fill=(30, 41, 59, 200), width=int(s * 0.015))

    dot_r = int(s * 0.025)
    dot_y = int(s * 0.13)
    draw.ellipse([int(s * 0.16) - dot_r, dot_y - dot_r, int(s * 0.16) + dot_r, dot_y + dot_r], fill=(239, 68, 68, 220))
    draw.ellipse([int(s * 0.24) - dot_r, dot_y - dot_r, int(s * 0.24) + dot_r, dot_y + dot_r], fill=(245, 158, 11, 220))
    draw.ellipse([int(s * 0.32) - dot_r, dot_y - dot_r, int(s * 0.32) + dot_r, dot_y + dot_r], fill=(16, 185, 129, 220))

    # 3. Central AI Quantum Core
    cx, cy = s // 2, int(s * 0.58)
    core_r = int(s * 0.16)

    # Outer orbital ring 1 (Cyan)
    orbit1_rx = int(s * 0.30)
    orbit1_ry = int(s * 0.12)
    draw.ellipse([cx - orbit1_rx, cy - orbit1_ry, cx + orbit1_rx, cy + orbit1_ry], 
                 outline=(6, 182, 212, 180), width=int(s * 0.02))

    # Outer orbital ring 2 (Emerald tilted 45 deg via points)
    n_pts = 60
    tilt = math.pi / 4
    pts = []
    for i in range(n_pts + 1):
        angle = 2 * math.pi * i / n_pts
        # 2D ellipse unrotated
        x0 = orbit1_rx * math.cos(angle)
        y0 = orbit1_ry * math.sin(angle)
        # rotate
        xr = x0 * math.cos(tilt) - y0 * math.sin(tilt)
        yr = x0 * math.sin(tilt) + y0 * math.cos(tilt)
        pts.append((cx + xr, cy + yr))
    draw.line(pts, fill=(16, 185, 129, 200), width=int(s * 0.022))

    # Glowing AI Core Circle
    draw.ellipse([cx - core_r, cy - core_r, cx + core_r, cy + core_r], fill=(16, 185, 129, 255), outline=(52, 211, 153, 255), width=int(s * 0.025))

    # Inner Core Eye/Spark
    inner_r = int(core_r * 0.45)
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(255, 255, 255, 255))

    # Satellite node
    sat_x = cx + int(orbit1_rx * 0.85)
    sat_y = cy - int(orbit1_ry * 0.5)
    sat_r = int(s * 0.035)
    draw.ellipse([sat_x - sat_r, sat_y - sat_r, sat_x + sat_r, sat_y + sat_r], fill=(6, 182, 212, 255), outline=(255, 255, 255, 255), width=int(s * 0.01))

    # Downsample cleanly with LANCZOS filter
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

if __name__ == "__main__":
    import os
    out_dir = r"C:\Users\abdul\.gemini\antigravity\scratch\universal-browser-control\packages\extension\public\icons"
    os.makedirs(out_dir, exist_ok=True)
    for sz in [16, 32, 48, 128, 512]:
        icon = create_icon(sz)
        icon.save(os.path.join(out_dir, f"icon{sz}.png"))
        print(f"Generated icon{sz}.png")
