from PIL import Image

# Open the image
img = Image.open('src/images/images.jpeg').convert('RGBA')

# Get the pixel data
pixels = img.load()
width, height = img.size

# Remove white/light background
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # If pixel is close to white, make it transparent
        if r > 200 and g > 200 and b > 200:
            pixels[x, y] = (r, g, b, 0)

# Resize to 32x32 for favicon
img = img.resize((32, 32), Image.Resampling.LANCZOS)

# Save as PNG
img.save('public/favicon.png', 'PNG')
print('Transparent favicon created!')
