# Creating the Steganography Image (Q9)

You need to manually create the steganography image before deployment.

## Steps

1. Go to: https://incoherency.co.uk/image-steganography/
2. Upload any photo in the Image section
3. In the Message field (Encode tab), type exactly: FLAG{HIDDEN_IN_PIXELS}
4. Click Encode image and download the result
5. Rename it to: steg-image.png
6. Place it at: public/challenge-pages/steg-image.png

## Verification

Upload steg-image.png back to the same site, click Decode, and confirm
you see: FLAG{HIDDEN_IN_PIXELS}
