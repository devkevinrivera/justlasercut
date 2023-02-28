import React , { ref, useEffect, useRef, useState } from "react";

export default function DragDrop({ children , handleDrop }) {
    const dropref = useRef();
    
    const [dragging,setDragging] = useState(false);
    const [dragCounter,setDragCounter] = useState(0);

    const handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if(e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    }
    const handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragCounter(dragCounter--);
        if(dragCounter > 0) return;
        setDragging(false);
    }
    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDropF = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0    
        }
    }

    useEffect(() => {
        let div = dropref.current;
        div.addEventListener('dragenter', handleDragIn)
        div.addEventListener('dragleave', handleDragOut)
        div.addEventListener('dragover', handleDrag)
        div.addEventListener('drop', handleDropF)
    },[]);
    return (
        <div 
            ref={dropref}
            style={{display: 'inline-block', position: 'relative'}}
        >
            <div 
            style={{
              border: 'dashed grey 4px',
              backgroundColor: 'rgba(255,255,255,.8)',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0, 
              right: 0,
              zIndex: 9999
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                left: 0,
                textAlign: 'center',
                color: 'grey',
                fontSize: 36
              }}
            >
              <div>drop here :)</div>
            </div>
          </div>
          {children}
        </div>
    )
}