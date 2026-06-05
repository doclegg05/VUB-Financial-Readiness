#!/usr/bin/env python3
"""Generate an accurate public-domain 50-star US flag SVG with a wind-ripple filter."""
import math, pathlib
W, H, UW, UH = 1235, 650, 494, 350
RED, BLUE = "#B31942", "#0A3161"   # theme Old Glory Red / Blue
r, ir = 18.0, 18.0 * 0.382
pts = " ".join(
    f"{(r if k%2==0 else ir)*math.cos(math.radians(-90+k*36)):.2f},"
    f"{(r if k%2==0 else ir)*math.sin(math.radians(-90+k*36)):.2f}" for k in range(10))
L = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1235 650" preserveAspectRatio="xMidYMid slice">',
     '<defs>',
     '<filter id="flagwave" x="-12%" y="-12%" width="124%" height="124%">',
     '<feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="2" seed="6" result="n">',
     '<animate attributeName="baseFrequency" dur="18s" repeatCount="indefinite" calcMode="spline"'
     ' keyTimes="0;0.5;1" values="0.006 0.016;0.010 0.024;0.006 0.016"'
     ' keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>',
     '</feTurbulence>',
     '<feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G"/>',
     '</filter>',
     f'<polygon id="s" points="{pts}" fill="#fff"/>',
     '</defs>',
     '<g filter="url(#flagwave)">']
sh = H / 13
for i in range(13):
    L.append(f'<rect x="0" y="{i*sh:.3f}" width="{W}" height="{sh:.3f}" fill="{RED if i%2==0 else "#ffffff"}"/>')
L.append(f'<rect x="0" y="0" width="{UW}" height="{UH}" fill="{BLUE}"/>')
csp, rsp = UW/12, UH/10
for row in range(1, 10):
    for c in (range(1, 12, 2) if row % 2 else range(2, 11, 2)):
        L.append(f'<use href="#s" x="{c*csp:.2f}" y="{row*rsp:.2f}"/>')
L.append('</g></svg>')
pathlib.Path("assets/vub-usflag.svg").write_text("\n".join(L), encoding="utf-8")
print("wrote assets/vub-usflag.svg")
