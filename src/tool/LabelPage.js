import React, { useState, useRef, useEffect } from 'react';

const LabelPage = ({ src }) => {
  const canvasRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxCount, setBoxCount] = useState(0);

  const handleDeleteButtonClick = () => {
    if (selectedBox) {
      setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== selectedBox.id));
      setSelectedBox(null);
    }
  };

  const handleBoxClick = (box) => {
    setSelectedBox(box);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const handleMouseDown = (event) => {
      const offsetX = event.offsetX || event.nativeEvent.offsetX;
      const offsetY = event.offsetY || event.nativeEvent.offsetY;

      if (selectedBox) {
        const { startX, startY } = selectedBox;
        const deltaX = offsetX - startX;
        const deltaY = offsetY - startY;

        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => {
            if (box.id === selectedBox.id) {
              return { ...box, isMoving: true, deltaX, deltaY };
            }
            return box;
          })
        );
      } else {
        setDrawing(true);
        setBoxCount((prevCount) => prevCount + 1);

        setBoxes((prevBoxes) => [
          ...prevBoxes,
          {
            id: boxCount,
            startX: offsetX,
            startY: offsetY,
            width: 0,
            height: 0,
          },
        ]);
      }
    };

    const handleMouseMove = (event) => {
      const offsetX = event.offsetX || event.nativeEvent.offsetX;
      const offsetY = event.offsetY || event.nativeEvent.offsetY;

      if (drawing) {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => {
            if (box.id === boxCount) {
              return { ...box, width: offsetX - box.startX, height: offsetY - box.startY };
            }
            return box;
          })
        );
      } else if (selectedBox && selectedBox.isMoving) {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => {
            if (box.id === selectedBox.id) {
              return { ...box, startX: offsetX - selectedBox.deltaX, startY: offsetY - selectedBox.deltaY };
            }
            return box;
          })
        );
      }
    };

    const handleMouseUp = () => {
      setDrawing(false);

      setBoxes((prevBoxes) =>
        prevBoxes.map((box) => ({ ...box, isMoving: false, deltaX: 0, deltaY: 0 }))
      );
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drawing, src, boxes, selectedBox, boxCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const img = new Image();
    img.src = src;
    img.onload = () => {
      context.drawImage(img, 0, 0);
    };
  }, [src]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid #000' }} />
      <button onClick={handleDeleteButtonClick} disabled={!selectedBox}>
        Delete Selected Box
      </button>
      <ul>
        {boxes.map((box) => (
          <li key={box.id} onClick={() => handleBoxClick(box)}>
            Box {box.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LabelPage;
