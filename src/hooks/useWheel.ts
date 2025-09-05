import { useState, useCallback } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Prize, SpinResult } from '../types';

export function useWheel(prizes: Prize[]) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = useCallback((): Promise<SpinResult> => {
    return new Promise((resolve) => {
      setIsSpinning(true);
      
      console.log('🎯 === DÉBUT DU SPIN ===');
      console.log('📋 Prizes disponibles:', prizes.map((p, i) => `${i}: ${p.label} (${p.probability}%)`));
      
      // 1. Sélectionner le prix selon les probabilités
      const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
      let random = Math.random() * totalProbability;
      console.log(`🎲 Random généré: ${random.toFixed(2)} / ${totalProbability}`);
      
      let selectedPrize = prizes[0];
      let selectedIndex = 0;
      let cumulative = 0;
      
      for (let i = 0; i < prizes.length; i++) {
        cumulative += prizes[i].probability;
        console.log(`   Test ${i}: ${prizes[i].label} - cumul: ${cumulative} - random: ${random.toFixed(2)} - ${random <= cumulative ? '✅ SÉLECTIONNÉ' : '❌'}`);
        if (random <= cumulative) {
          selectedPrize = prizes[i];
          selectedIndex = i;
          break;
        }
      }
      
      console.log(`✅ Prix sélectionné: "${selectedPrize.label}" à l'index ${selectedIndex}`);
      
      // 2. Calculer la rotation pour que ce segment soit en haut
      const anglePerSegment = 360 / prizes.length;
      console.log(`📐 Angle par segment: ${anglePerSegment}°`);
      
      // Les segments sont positionnés avec le pointeur à 0°:
      // Segment 0: 0° à 60°, Segment 1: 60° à 120°, etc.
      const segmentStart = selectedIndex * anglePerSegment;
      const segmentEnd = (selectedIndex + 1) * anglePerSegment;
      const segmentCenter = segmentStart + anglePerSegment / 2;
      
      console.log(`🎯 Segment ${selectedIndex}:`);
      console.log(`   - Début: ${segmentStart}°`);
      console.log(`   - Fin: ${segmentEnd}°`);
      console.log(`   - Centre: ${segmentCenter}°`);
      
      // Pour que le centre du segment soit en haut (0°), on doit tourner de:
      // Pour amener le centre du segment au pointeur (0°)
      const targetRotation = -segmentCenter;
      
      // Ajouter des tours complets pour l'effet
      const extraTurns = Math.floor(5 + Math.random() * 3) * 360;
      const finalRotation = targetRotation + extraTurns;
      
      console.log(`🔄 Calcul rotation:`);
      console.log(`   - Rotation cible: ${targetRotation}°`);
      console.log(`   - Tours supplémentaires: ${extraTurns}°`);
      console.log(`   - Rotation finale: ${finalRotation}°`);
      
      // 3. Appliquer la rotation
      setRotation(finalRotation);
      
      // 4. Attendre la fin de l'animation
      setTimeout(() => {
        // 5. Vérifier où on est arrivé
        const normalizedRotation = ((finalRotation % 360) + 360) % 360;
        console.log(`🔍 Vérification finale:`);
        console.log(`   - Rotation finale normalisée: ${normalizedRotation.toFixed(1)}°`);
        
        // Calculer dans quel segment on se trouve
        // Le pointeur est à 0°, après rotation quel segment contient 0° ?
        // L'angle 0° correspond maintenant à l'angle: (360 - normalizedRotation) % 360
        const angleAtPointer = (360 - normalizedRotation) % 360;
        const calculatedIndex = Math.floor(angleAtPointer / anglePerSegment) % prizes.length;
        const calculatedPrize = prizes[calculatedIndex];
        
        console.log(`   - Index calculé: ${calculatedIndex}`);
        console.log(`   - Angle au pointeur: ${angleAtPointer.toFixed(1)}°`);
        console.log(`   - Prix calculé: "${calculatedPrize?.label}"`);
        console.log(`   - Correspondance: ${calculatedIndex === selectedIndex ? '✅ PARFAIT' : '❌ ERREUR'}`);
        
        if (calculatedIndex !== selectedIndex) {
          console.error(`🚨 ERREUR DE CORRESPONDANCE:`);
          console.error(`   Attendu: ${selectedIndex} (${selectedPrize.label})`);
          console.error(`   Calculé: ${calculatedIndex} (${calculatedPrize?.label})`);
        }
        
        setTimeout(() => {
          const result: SpinResult = {
            prizeId: selectedPrize.id,
            angle: finalRotation,
            timestamp: Date.now(),
            deviceId: 'device-id'
          };
          
          setIsSpinning(false);
          setLastResult(result);
          
          if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
          }
          
          resolve(result);
        }, 1000);
      }, 3500);
    });
  }, [prizes]);

  return {
    isSpinning,
    lastResult,
    rotation,
    spin,
    setLastResult
  };
}