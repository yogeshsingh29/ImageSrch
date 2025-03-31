import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Text, Image, Rect, Circle, RegularPolygon, Transformer } from 'react-konva';
import { toast } from 'react-hot-toast'; 
import './Caption.css'; 

const CaptionPage = ({ imageUrl, onBack }) => {
  const [image, setImage] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [color, setColor] = useState('#ffffff');
  const [caption, setCaption] = useState('Add your caption here!');
  const stageRef = useRef(null);
  const trRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      setImage(img);
      // toast.success('Image loaded successfully!'); 
    };
    img.onerror = () => {
      alert('Failed to load image. Please try again.');
      toast.error('Failed to load image.'); 
    };
  }, [imageUrl]);

  const handleFocus = () => {
    if (caption === 'Add your caption here!') setCaption('');
  };

  const handleBlur = () => {
    if (caption.trim() === '') setCaption('Add your caption here!');
  };

  const addText = () => {
    setElements([...elements, {
      type: 'text',
      id: Date.now().toString(),
      text: 'New Text',
      x: 100,
      y: 100,
      fontSize: 30,
      fill: color,
      draggable: true
    }]);
    toast.success('Text added!'); 
  };

  const addShape = (shapeType) => {
    const commonProps = {
      id: Date.now().toString(),
      x: 150,
      y: 150,
      fill: color,
      draggable: true
    };

    let newShape;
    switch (shapeType) {
      case 'rectangle': newShape = { ...commonProps, type: 'rectangle', width: 100, height: 100 }; break;
      case 'circle': newShape = { ...commonProps, type: 'circle', radius: 50 }; break;
      case 'triangle': newShape = { ...commonProps, type: 'triangle', sides: 3, radius: 50 }; break;
      case 'polygon': newShape = { ...commonProps, type: 'polygon', sides: 5, radius: 50 }; break;
    }
    setElements([...elements, newShape]);
    toast.success(`${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added!`); 
  };

  const handleDragEnd = (id) => (e) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el
    ));
  };

  const handleTextChange = (id, newText) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, text: newText } : el
    ));
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    if (selectedId) {
      setElements(elements.map(el => 
        el.id === selectedId ? { ...el, fill: newColor } : el
      ));
    }
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    const selectedElement = elements.find(el => el.id === id);
    if (selectedElement) setColor(selectedElement.fill);
  };

  useEffect(() => {
    if (selectedId && trRef.current) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      trRef.current.nodes([node]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  const downloadImage = () => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ mimeType: 'image/png', pixelRatio: 3 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'image_with_elements.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const renderElement = (el) => {
    switch (el.type) {
      case 'text':
        return (
          <Text
            key={el.id}
            id={el.id}
            {...el}
            onClick={() => handleSelect(el.id)}
            onDblClick={(e) => {
              const newText = prompt('Enter new text:', el.text);
              if (newText) handleTextChange(el.id, newText);
            }}
            onDragEnd={handleDragEnd(el.id)}
          />
        );
      case 'rectangle':
        return <Rect key={el.id} id={el.id} {...el} onClick={() => handleSelect(el.id)} onDragEnd={handleDragEnd(el.id)} />;
      case 'circle':
        return <Circle key={el.id} id={el.id} {...el} onClick={() => handleSelect(el.id)} onDragEnd={handleDragEnd(el.id)} />;
      case 'triangle':
      case 'polygon':
        return <RegularPolygon key={el.id} id={el.id} {...el} onClick={() => handleSelect(el.id)} onDragEnd={handleDragEnd(el.id)} />;
      default:
        return null;
    }
  };

  return (
    <div className="caption-page" ref={containerRef}>
      <div className="header">
        <button onClick={onBack} className="back-button">Back to Search</button>
        <h1>Add Elements to Your Image</h1>
      </div>

      <div className="controls">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Edit your caption here"
          className="caption-input"
        />
        <div className="button-group">
          <button onClick={addText}>Text</button>
          <button onClick={() => addShape('rectangle')}>Rectangle</button>
          <button onClick={() => addShape('circle')}>Circle</button>
          <button onClick={() => addShape('triangle')}>Triangle</button>
          <button onClick={() => addShape('polygon')}>Polygon</button>
        </div>
        <div className="color-download-group">
          <label className="color-picker">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              title="Pick a color"
            />
          </label>
          <button onClick={downloadImage} className="download-btn">Download</button>
        </div>
      </div>

      <div className="canvas-container">
        <Stage width={800} height={600} ref={stageRef}>
          <Layer>
            {image && <Image image={image} width={800} height={600} />}
          </Layer>
          <Layer>
            <Rect x={0} y={0} width={800} height={50} fill="#1a1a1a" />
            <Text
              text={caption}
              x={0}
              y={10}
              width={800}
              fontSize={30}
              fontFamily="Arial"
              fill="#ffffff"
              align="center"
            />
            {elements.filter(el => el.type !== 'text').map(renderElement)}
          </Layer>
          <Layer>
            {elements.filter(el => el.type === 'text').map(renderElement)}
            {selectedId && (
              <Transformer
                ref={trRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 20 || newBox.height < 20) return oldBox;
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CaptionPage;