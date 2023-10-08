import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import s from './MainPage.module.css'
import navigateSVG from "../assets/navigate.png";
import deleteSVG from "../assets/close.svg";
import plusSVG from "../assets/plus.png";
// import penSVG from "../assets/pen.png";

interface IObject {
    x: number;
    y: number;
    scale: number;
}

interface ILine {
    children: IObject2[];
    childIndex: number;
}

interface IObject2 {
    x: number;
    objects: Array<IObject2>
}

interface ObjectProps {
    x: number;
    index: number;
    objects: IObject2[]; // Змінено тип на IObject2
    setObjects: Dispatch<SetStateAction<IObject[]>>;
    setChildrens: Dispatch<SetStateAction<IObject2[]>>;
    childrens: IObject2[];
    level: number
}

const Line: React.FC<ILine> = ({children, childIndex}) => {
    let lineStyle: React.CSSProperties

    let newChildIndex = children.length / 2
    let newChildIndex2 =  (Number(0) + Number(children.length -1)) / 2


    if(newChildIndex2 === childIndex){
        lineStyle = {
            position: 'relative',
            margin: '10px 0 0',
            height: '20px',
            width: '100%',
            borderTop: '1px solid rgb(168, 168, 177)',
        };
        return <div style={{display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'column'}}>
            {childIndex !== 0 && <div style={lineStyle}></div>}
            {childIndex !== 0 && <div className={s.addLine1}></div>}
            {childIndex === 0 && <div className={s.addLine2}></div>}
        </div>;
    }
    else if(newChildIndex <= childIndex){
        lineStyle = {
             margin: '10px 0 0 0',
            height: '20px',
            width: '50%',
            borderTop: '1px solid rgb(168, 168, 177)',
            borderRight: '1px solid rgb(168, 168, 177)'
        };
        return <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
            <div style={lineStyle}></div>
        </div>;
    }
    else if(newChildIndex > childIndex){
        lineStyle = {
            margin: '10px 0 0 0',
            height: '20px',
            width: '50%',
            borderTop: '1px solid rgb(168, 168, 177)',
            borderLeft: '1px solid rgb(168, 168, 177)'
        };
        return <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
            <div style={lineStyle}></div>
        </div>;
    }
    else {
        lineStyle = {
            position: 'relative',
            margin: '10px 0 0',
            height: '20px',
            width: '50%',
            borderRight: '1px solid rgb(168, 168, 177)'
        };
        return <div style={lineStyle}></div>;
    }

    // return <div style={lineStyle}></div>;
};

const ObjectComponent: React.FC<ObjectProps> = ({x,
                                                    index,
                                                    setObjects,
                                                    childrens,
                                                    setChildrens,
                                                    level}) => {

    const [children, setChildren] = useState<IObject2[]>([]);
    const [name, setName] = useState('');
    const [lines, setLines] = useState<number[]>([]);

    const addChildObject = () => {
        const newObject = { x: 0, objects: [] };
        setChildren([...children, newObject]);
        setLines([...lines, index, children.length]);
    };

    const removeObject = () => {
        removeAllChildren()
        const updatedParentObjects = [...childrens];
        updatedParentObjects.splice(index, 1);
        setChildrens(updatedParentObjects);
    };

    const removeAllChildren = () => {
        setChildren([]);
    };

    if(x){}

    const arrColor = ['violet', 'yellow', 'green', 'gray', 'yellowgreen', 'tomato'];
    const colorIndex = level % arrColor.length;

    return (<>
            <div className={s.object}>
                <input type="text" placeholder='categori name' value={name} className={s.inputObject} style={{backgroundColor: arrColor[colorIndex] || 'white'}}
                       onChange={(e) => setName(e.target.value)} />
                <div className={s.divObjectBut}>
                    <div className={s.butAddAndMines} onClick={addChildObject}>
                        <img src={plusSVG} alt="plus" />
                    </div>
                    <div className={s.butAddAndMines2} onClick={removeObject}>
                        <img src={deleteSVG} alt="delete" style={{width: '30px', height: '20px'}} />
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
                    {children.map((child, childIndex) => {
                        return(
                        <div key={childIndex} className="childObject">
                            <Line children={children} childIndex={childIndex} />
                            <ObjectComponent
                                key={childIndex}
                                x={child.x}
                                index={childIndex}
                                objects={children}
                                setObjects={setObjects}
                                childrens={children}
                                setChildrens={setChildren}
                                level={level + 1}
                            />
                        </div>
                    )})}
                </div>
            </div>
    </>
    );
};

const MainPage: React.FC = () => {

    const [scale2, setScale2] = useState<number>(100)
    const [scale, setScale] = useState(1);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    const [isDragging, setIsDragging] = useState(false);
    const prevMouseXRef = useRef<number | null>(null);
    const prevMouseYRef = useRef<number | null>(null);

    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const [objects, setObjects] = useState<IObject[]>([
        { x: 0, y: 0, scale: 1 },
    ]);

    const [objects2, setObjects2] = useState<IObject2[]>([
        { x: 0, objects: [] },
    ]);

    const handleObjectMove = (index: number, deltaX: number, deltaY: number) => {
        const updatedObjects = [...objects];
        updatedObjects[index] = {
            ...objects[index],
            x: objects[index].x + deltaX,
            y: objects[index].y + deltaY,
        };
        setObjects(updatedObjects);
    };

    const handleScaleChange = (index: number, newScale: number) => {
        const updatedObjects = [...objects];
        updatedObjects[index] = {
            ...objects[index],
            scale: newScale,
        };
        setObjects(updatedObjects);
    };

    const handleScaleChange2 = (newScale: number, sumbol: string) => {
        setScale(newScale);
        if(sumbol === '+'){
            setScale2(prev => prev + 20)
        } else {
            setScale2(prev => prev - 20)
        }
    };

    const resetScale = () => {
        setScale(1);
        setTranslateX(0);
        setTranslateY(0);
        setScale2(100)
    };

    // const centerScale = () => {
    //     console.log(objects[0])
    //     // Центрування відносно координат ObjectComponent
    //     const objectX = objects[0].x; // Замініть це значення на реальне
    //     const objectY = objects[0].y; // Замініть це значення на реальне
    //
    //     const centerX = window.innerWidth / 2;
    //     const centerY = window.innerHeight / 2;
    //
    //     const deltaX = centerX - objectX * scale;
    //     const deltaY = centerY - objectY * scale;
    //
    //     setTranslateX(deltaX);
    //     setTranslateY(deltaY);
    // };

    const containerStyle: React.CSSProperties = {
        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
        transformOrigin: 'top left',
        width: '100%'
    };

    const centerScale = () => {
        const element = document.getElementById('giveCenter');
        if (element) {
            element.style.transform = `translate(0px, 55px) scale(${scale})`;
        }
        objects[0].x = 0
        objects[0].y = 55
    };

    const objectStyle: React.CSSProperties = {
        transform: `translate(${objects[0].x}px, ${objects[0].y}px) scale(${scale})`,
    };

    const handleDragStart = (e: React.MouseEvent) => {
        setIsDragging(true);
        prevMouseXRef.current = e.clientX;
        prevMouseYRef.current = e.clientY;
    };

    const handleDragStop = () => {
        setIsDragging(false);
        prevMouseXRef.current = null;
        prevMouseYRef.current = null;
    };

    const handleDrag = (e: React.MouseEvent) => {
        if (!isDragging) return;

        if (prevMouseXRef.current !== null && prevMouseYRef.current !== null) {
            const deltaX = e.clientX - prevMouseXRef.current;
            const deltaY = e.clientY - prevMouseYRef.current;
            handleObjectMove(0, deltaX, deltaY);
        }

        prevMouseXRef.current = e.clientX;
        prevMouseYRef.current = e.clientY;
    };

    const handleScale = (e: React.WheelEvent) => {
        const newScale = scale + e.deltaY * 0.01;
        handleScaleChange(0, newScale);
    };



    return (
        <div className={s.mainDiv}>

            <div className={s.headerDiv}>
                <div style={{display: 'flex', marginLeft: '30px', fontFamily: 'sans-serif'}}>
                    <p style={{fontSize: '35px'}}>Services</p>
                    <p className={s.whiteCircle}>0</p>
                </div>
                <div className={s.divNavigate}>
                    <button onClick={resetScale}>LIST VIEW</button>
                    <div className={s.divImage1} onClick={centerScale}>
                        <img src={navigateSVG} alt='navigator' />
                    </div>
                    <div className={s.divButton}>
                        <div onClick={() => handleScaleChange2(scale - 0.05, '-')} className={s.mathBut}>-</div>
                        <div className={s.divScale}>{scale2}%</div>
                        <div onClick={() => handleScaleChange2(scale + 0.05, '+')} className={s.mathBut}>+</div>
                    </div>
                </div>
            </div>

            <div style={containerStyle}>
                <div ref={containerRef} id='giveCenter'
                     style={objectStyle}
                     onMouseDown={handleDragStart}
                     onMouseUp={handleDragStop}
                     onMouseLeave={handleDragStop}
                     onMouseMove={handleDrag}
                     onWheel={handleScale}>
                    {objects.map((obj, index) => {
                        return (
                            <ObjectComponent
                                key={index}
                                x={obj.x}
                                index={index}
                                objects={objects2}
                                childrens={objects2}
                                setChildrens={setObjects2}
                                setObjects={setObjects}
                                level={0}
                            />
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default MainPage