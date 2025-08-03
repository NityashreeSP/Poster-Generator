import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import { SketchPicker } from "react-color";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DrawIcon from "@mui/icons-material/Brush";
import { Card, CardContent, CardMedia, Grid } from "@mui/material";

const App = () => {
  const canvasRef = useRef(null);
  const [quote, setQuote] = useState("Believe in yourself!");
  const [author, setAuthor] = useState("");
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textAlign, setTextAlign] = useState("center");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [useGradient, setUseGradient] = useState(false);
  const [gradientStart, setGradientStart] = useState("#ff7e5f");
  const [gradientEnd, setGradientEnd] = useState("#feb47b");
  const [useTextGradient, setUseTextGradient] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const fontFamilies = [
    "Arial",
    "Verdana",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Lobster",
    "Pacifico",
    "Oswald",
    "Roboto Slab",
    "Playfair Display",
  ];

  const posterTemplates = [
    {
      name: "Sunset Bliss",
      fontFamily: "Playfair Display",
      fontSize: 48,
      textColor: "#ffffff",
      useGradient: true,
      gradientStart: "#ff7e5f",
      gradientEnd: "#feb47b",
      textAlign: "center",
    },
    {
      name: "Classic Bold",
      fontFamily: "Roboto Slab",
      fontSize: 36,
      textColor: "#000000",
      bgColor: "#f5f5f5",
      textAlign: "left",
    },
    {
      name: "Night Vibes",
      fontFamily: "Oswald",
      fontSize: 42,
      textColor: "#00ffcc",
      bgColor: "#0f0f0f",
      textAlign: "center",
    },
    {
      name: "Ocean Calm",
      fontFamily: "Lobster",
      fontSize: 40,
      textColor: "#ffffff",
      useGradient: true,
      gradientStart: "#00c6ff",
      gradientEnd: "#0072ff",
      textAlign: "center",
    },
    {
      name: "Minimal Elegance",
      fontFamily: "Georgia",
      fontSize: 32,
      textColor: "#333333",
      bgColor: "#ffffff",
      textAlign: "right",
    },
    {
      name: "Retro Pop",
      fontFamily: "Courier New",
      fontSize: 38,
      textColor: "#ff4081",
      bgColor: "#ffe57f",
      textAlign: "left",
    },
    {
      name: "Mystic Forest",
      fontFamily: "Pacifico",
      fontSize: 44,
      textColor: "#ffffff",
      useGradient: true,
      gradientStart: "#005a32",
      gradientEnd: "#238b45",
      textAlign: "center",
    },
    {
      name: "Modern Gray",
      fontFamily: "Verdana",
      fontSize: 30,
      textColor: "#2c2c2c",
      bgColor: "#e0e0e0",
      textAlign: "left",
    },
    {
      name: "Golden Hour",
      fontFamily: "Times New Roman",
      fontSize: 46,
      textColor: "#ffffff",
      useGradient: true,
      gradientStart: "#f7971e",
      gradientEnd: "#ffd200",
      textAlign: "center",
    },
    {
      name: "Deep Space",
      fontFamily: "Arial",
      fontSize: 40,
      textColor: "#ffffff",
      bgColor: "#1a1a40",
      textAlign: "center",
    },
  ];

  const applyTemplate = (template) => {
    setFontFamily(template.fontFamily);
    setFontSize(template.fontSize);
    setTextColor(template.textColor);
    setTextAlign(template.textAlign);
    if (template.useGradient) {
      setUseGradient(true);
      setGradientStart(template.gradientStart);
      setGradientEnd(template.gradientEnd);
    } else {
      setUseGradient(false);
      setBgColor(template.bgColor);
    }
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new window.Image();
      img.onload = () => setBackgroundImage(img);
      img.src = URL.createObjectURL(file);
    }
  };

  const drawPoster = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else if (useGradient) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (useTextGradient) {
      const textGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      textGradient.addColorStop(0, gradientStart);
      textGradient.addColorStop(1, gradientEnd);
      ctx.fillStyle = textGradient;
    } else {
      ctx.fillStyle = textColor;
    }

    ctx.textAlign = textAlign;
    ctx.font = `${fontSize}px ${fontFamily}`;
    wrapText(ctx, quote, canvas.width / 2, canvas.height / 2, 600, fontSize + 10);

    ctx.font = `20px ${fontFamily}`;
    ctx.fillText(`- ${author}`, canvas.width / 2, canvas.height / 2 + 40);
  };

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "quote-poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Box p={4} maxWidth="800px" mx="auto">
      <Typography variant="h4" align="center" gutterBottom>
        🎨 Create Your Quote Poster
      </Typography>

      <Stack spacing={2} mb={4}>
        <TextField label="Quote" fullWidth value={quote} onChange={(e) => setQuote(e.target.value)} />
        <TextField label="Author Name" fullWidth value={author} onChange={(e) => setAuthor(e.target.value)} />

        <Box>
          <Typography gutterBottom>Font Size</Typography>
          <Slider value={fontSize} min={10} max={100} onChange={(e, val) => setFontSize(val)} />
        </Box>

        <Box display="flex" gap={4} flexWrap="wrap">
          <Box>
            <Typography gutterBottom>Text Color</Typography>
            <SketchPicker color={textColor} onChangeComplete={(color) => setTextColor(color.hex)} />
          </Box>

          <Box>
            <Typography gutterBottom>Background Color</Typography>
            <SketchPicker color={bgColor} onChangeComplete={(color) => setBgColor(color.hex)} />
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          <label>
            <input type="checkbox" checked={useGradient} onChange={(e) => setUseGradient(e.target.checked)} />
            Use Gradient Background
          </label>
          <label>
            <input type="checkbox" checked={useTextGradient} onChange={(e) => setUseTextGradient(e.target.checked)} />
            Use Gradient Text Color
          </label>
          {useGradient && (
            <>
              <input type="color" value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} />
              <input type="color" value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} />
            </>
          )}
        </Box>

        <Button variant="contained" color="secondary" onClick={() => setShowTemplates(!showTemplates)}>
          {showTemplates ? "Hide Templates" : "Show Templates"}
        </Button>

        {showTemplates && (
          <Grid container spacing={2} mt={2}>
            {posterTemplates.map((template, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="10"
                    
                    
                  />
                  <CardContent>
                    <Typography variant="h6">{template.name}</Typography>
                    <Typography variant="body2">{template.fontFamily}</Typography>
                    <Button variant="contained" size="small" onClick={() => applyTemplate(template)}>
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <FormControl fullWidth>
          <InputLabel>Font Family</InputLabel>
          <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            {fontFamilies.map((font) => (
              <MenuItem key={font} value={font}>{font}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Text Alignment</InputLabel>
          <Select value={textAlign} onChange={(e) => setTextAlign(e.target.value)}>
            <MenuItem value="left">Left</MenuItem>
            <MenuItem value="center">Center</MenuItem>
            <MenuItem value="right">Right</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
            Upload Background Image
            <input hidden type="file" accept="image/*" onChange={handleBackgroundUpload} />
          </Button>

          <Button variant="contained" onClick={drawPoster} color="primary" startIcon={<DrawIcon />}>
            Draw Poster
          </Button>

          <Button variant="outlined" color="success" onClick={downloadPoster} startIcon={<DownloadIcon />}>
            Download
          </Button>
        </Box>
      </Stack>

      <canvas ref={canvasRef} width={700} height={500} style={{ border: "1px solid #ccc", display: "block", margin: "0 auto" }} />
    </Box>
  );
};

export default App;