// import s from './Header.module.css'
// import React, {useState} from "react";
// import navigateSVG from '../assets/navigate.png'
//
// const Header = () => {
//
//     const [scale2, setScale2] = useState<number>(100)
//     const [scale, setScale] = useState(1);
//     const [translateX, setTranslateX] = useState(0);
//     const [translateY, setTranslateY] = useState(0);
//
//     const handleScaleChange2 = (newScale: number) => {
//         setScale(newScale);
//     };
//
//     const resetScale = () => {
//         setScale(1);
//         setTranslateX(0);
//         setTranslateY(0);
//     };
//
//     const centerScale = () => {
//         console.log(objects[0])
//         // Центрування відносно координат ObjectComponent
//         const objectX = objects[0].x; // Замініть це значення на реальне
//         const objectY = objects[0].y; // Замініть це значення на реальне
//
//         const centerX = window.innerWidth / 2;
//         const centerY = window.innerHeight / 2;
//
//         const deltaX = centerX - objectX * scale;
//         const deltaY = centerY - objectY * scale;
//
//         setTranslateX(deltaX);
//         setTranslateY(deltaY);
//     };
//
//     const containerStyle: React.CSSProperties = {
//         transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
//         transformOrigin: 'top left',
//     };
//
//
//     return (
//         <div className={s.mainDiv}>
//             <div style={{display: 'flex'}}>
//                 <p>Services</p>
//                 <p>0</p>
//             </div>
//             <div className={s.divNavigate}>
//                 <button onClick={resetScale}>LIST VIEW</button>
//                 <div className={s.divImage1} onClick={centerScale}>
//                     <img src={navigateSVG} alt='navigator' />
//                 </div>
//                 <div className={s.divButton}>
//                     <div onClick={() => handleScaleChange2(scale - 0.1)} className={s.mathBut}>-</div>
//                     <div className={s.divScale}>{scale2}%</div>
//                     <div onClick={() => handleScaleChange2(scale + 0.1)} className={s.mathBut}>+</div>
//                 </div>
//             </div>
//         </div>
//     )
// }
//
// export default Header