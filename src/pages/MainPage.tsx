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
    // setObjects: (objects: IObject2[]) => void;
    setObjects: Dispatch<SetStateAction<IObject[]>>;
    // setChildrens: (objects: IObject2[]) => void;
    setChildrens: Dispatch<SetStateAction<IObject2[]>>;
    childrens: IObject2[];
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
            width: '50%',
            borderRight: '1px solid rgb(168, 168, 177)'
        };
        return <div style={lineStyle}></div>;
    }
    else if(newChildIndex <= childIndex){
        lineStyle = {
            position: 'relative',
            // margin: '10px 0 0px -100px',
            margin: '10px 0 0 -200px',
            height: '20px',
            width: '140%',
            borderTop: '1px solid rgb(168, 168, 177)',
            borderRight: '1px solid rgb(168, 168, 177)'
        };
        return <div style={lineStyle}></div>;
    }
    else if(newChildIndex > childIndex){
        lineStyle = {
            position: 'relative',
            // margin: '10px -1px 0px 100px',
            margin: '10px 0 0 120px',
            height: '20px',
            // width: '100%',
            width: '147%',
            borderTop: '1px solid rgb(168, 168, 177)',
            borderLeft: '1px solid rgb(168, 168, 177)'
        };
        return <div style={lineStyle}></div>;
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

const ObjectComponent: React.FC<ObjectProps> = ({x, index, setObjects, childrens, setChildrens}) => {

    const [children, setChildren] = useState<IObject2[]>([]);
    const [name, setName] = useState('');
    const [lines, setLines] = useState<number[]>([]);

    const addChildObject = () => {
        const newObject = { x: 0, objects: [] };
        setChildren([...children, newObject]);
        setLines([...lines, index, children.length]);
    };

    const removeObject = () => {
        // const updatedParentObjects = [...objects];
        const updatedParentObjects = [...childrens];
        updatedParentObjects.splice(index, 1);
        // setObjects(updatedParentObjects);
        setChildrens(updatedParentObjects);
    };

    if(x){}


    return (<>
            <div className={s.object}>
                <input type="text" placeholder='categori name' value={name} className={s.inputObject}
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
                    {children.map((child, childIndex) => (
                        <div key={childIndex} className="childObject">
                            <Line children={children} childIndex={childIndex} />
                            <ObjectComponent
                                key={childIndex}
                                x={child.x}
                                index={childIndex}
                                objects={children}
                                // objects={child.objects || []}
                                // setObjects={(newObjects) => {
                                //     const updatedChildren = [...children];
                                //     updatedChildren[childIndex] = { ...child, x: newObjects[0]?.x };
                                //     setChildren(updatedChildren);
                                // }}
                                setObjects={setObjects}
                                childrens={children}
                                setChildrens={setChildren}
                            />
                        </div>
                    ))}
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
        if (containerRef.current) {
            const centerX = containerRef.current.clientWidth / 2;
            const centerY = containerRef.current.clientHeight / 2;

            // Розрахунок зсуву для центрування
            const deltaX = centerX * (1 - scale);
            const deltaY = centerY * (1 - scale);

            setScale(1);
            containerRef.current.style.transform = `scale(${scale}) translate(${deltaX}px, ${deltaY}px)`;
            containerRef.current.style.transformOrigin = 'center center';
        }
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
                <div style={{display: 'flex'}}>
                    <p>Services</p>
                    <p>0</p>
                </div>
                <div className={s.divNavigate}>
                    <button onClick={resetScale}>LIST VIEW</button>
                    <div className={s.divImage1} onClick={centerScale}>
                        <img src={navigateSVG} alt='navigator' />
                    </div>
                    <div className={s.divButton}>
                        <div onClick={() => handleScaleChange2(scale - 0.1, '-')} className={s.mathBut}>-</div>
                        <div className={s.divScale}>{scale2}%</div>
                        <div onClick={() => handleScaleChange2(scale + 0.1, '+')} className={s.mathBut}>+</div>
                    </div>
                </div>
            </div>

            <div style={containerStyle}>
                <div ref={containerRef}
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
                            />
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default MainPage