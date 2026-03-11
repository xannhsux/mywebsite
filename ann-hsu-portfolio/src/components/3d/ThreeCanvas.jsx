import { useEffect, useRef, useCallback } from 'react';
import ThreeScene from '../../lib/ThreeScene';

/**
 * Thin React wrapper around the pure Three.js scene.
 * Handles mount/unmount lifecycle and forwards callbacks.
 */
export default function ThreeCanvas({ stage, onCardSelect, onScrollAbout }) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);

    const handleCardSelect = useCallback((project) => {
        onCardSelect(project);
    }, [onCardSelect]);

    const handleScrollAbout = useCallback(() => {
        onScrollAbout();
    }, [onScrollAbout]);

    // Mount the Three.js scene
    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new ThreeScene(containerRef.current, {
            onCardSelect: handleCardSelect,
            onScrollAbout: handleScrollAbout,
        });
        sceneRef.current = scene;

        return () => {
            scene.dispose();
            sceneRef.current = null;
        };
    }, [handleCardSelect, handleScrollAbout]);

    // Show/hide based on stage
    useEffect(() => {
        if (sceneRef.current) {
            sceneRef.current.setVisible(stage !== 'landing');
        }
    }, [stage]);

    // Deselect card when going to About
    useEffect(() => {
        if (stage === 'about' && sceneRef.current) {
            sceneRef.current.deselectCard();
        }
    }, [stage]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
