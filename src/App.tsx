import "./App.css";
import { Var, wrap, SOUND_EFFECTS } from "./common.tsx";
import { useState, useEffect } from "react";
import Cardle from "./Cardle.tsx";
import PlayingCard from "./PlayingCard.tsx";

function App() {
    const scene: Var<number> = wrap(useState(0));
    const mouse: Var<MouseEvent | undefined> = wrap(useState(undefined));
    
    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            mouse.set(event);
        }
        
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    
    function getRandomCardPath() {
        const suits = ["hearts", "clubs", "diamonds", "spades"];
        const values = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
        const colors = ["white", "green", "yellow"];
        
        const randomValue = values[Math.floor(Math.random() * values.length)];
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        return `./src/assets/cards/${randomColor}/${randomValue}-of-${randomSuit}.png`;
    }
    
    switch (scene.get) {
        case 0: {
            const backgroundCards = [];
            for (let i = 0; i < 20; i++) {
                const xPos = 10 + Math.random() * 80; // percentage across screen
                const yPos = 10 + Math.random() * 80; // percentage down screen
                const rotation = Math.random() * 360; // full rotation
                const scale = 0.5 + Math.random() * 1; // random scale between 0.5 and 1.5
                const zIndex = Math.floor(Math.random() * 10);
                
                backgroundCards.push(
                    <div 
                        key={`bg-card-${i}`}
                        style={{
                            position: "absolute",
                            left: `${xPos}%`,
                            top: `${yPos}%`,
                            transform: `rotate(${rotation}deg) scale(${scale})`,
                            zIndex: zIndex,
                            width: "10%",
                            opacity: 0.6,
                        }}
                    >
                        <PlayingCard
                            card={getRandomCardPath()}
                            style={{}}
                            mouse={mouse.get}
                            jitter={5}
                        />
                    </div>
                );
            }
            
            const titleChars = ["C", "A", "R", "D", "L", "E"];
            const title = [];
            
            for (let i = 0; i < titleChars.length; i++) {
                const scale = 100 + Math.floor(Math.random() * 20);
                const jitter = Math.floor(Math.random() * 20) - 10;
                
                const char = (
                    <div
                        key={`title-char-${i}`}
                        style={{
                            fontFamily: "balatro",
                            fontSize: "35vh",
                            transform: `scale(${scale}%) rotate(${jitter}deg)`,
                            color: "white",
                            textShadow: "0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5)",
                            zIndex: 20,
                            position: "relative",
                        }}
                        className="title"
                    >
                        <span>{titleChars[i]}</span>
                    </div>
                );
                title.push(char);
            }

            const startButton = (
                <button
                    style={{
                        fontFamily: "balatro",
                        border: "none",
                        backgroundColor: "transparent",
                        position: "relative",
                        padding: "2vh",
                        cursor: "pointer",
                    }}
                    className="button"
                    onClick={() => {
                        SOUND_EFFECTS.cardFan();
                        scene.set(1);
                    }}
                >
                    <PlayingCard
                        card="./src/assets/cards/white/ace-of-spades.png"
                        style={{
                            transform: "scale(1.2)",
                        }}
                        jitter={3}
                        mouse={mouse.get}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontFamily: "balatro",
                            fontSize: "5vh",
                            color: "white",
                            textShadow: "2px 2px 4px #000000",
                        }}
                    >
                        START
                    </div>
                </button>
            );

            return (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20vh",
                        flexShrink: "0",
                        overflow: "hidden",
                        position: "relative",
                        background: "linear-gradient(135deg, #1a1a3a 0%, #0f0f2a 100%)",
                    }}
                >
                    {backgroundCards}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${titleChars.length}, 1fr)`,
                            gap: "1vw",
                            zIndex: 10,
                        }}
                    >
                        {title}
                    </div>
                    <div style={{ zIndex: 10 }}>
                        {startButton}
                    </div>
                </div>
            );
        }
        case 1:
            return <Cardle restart={() => scene.set(0)}></Cardle>;
    }
}

export default App;
