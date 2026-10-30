// Ferrum · biblioteca de estiramientos (la usa ui/ferrum-stretch-v1.js).
// Cada estiramiento: id, nombre y pautas en español e inglés, zonas, nivel
// (1 fácil · 2 medio · 3 difícil), segundos por lado, lados (1 o 2),
// posición (pie · sentado · suelo) y postura para el dibujo (ver
// ui/ferrum-stretch-figure-v1.js).
window.__FERRUM_STRETCHES = [
  {
    id: 'cuadriceps-de-pie', areas: ['cuadriceps', 'cadera'], level: 1, hold: 30, sides: 2, position: 'pie',
    es: { name: 'Cuádriceps de pie', cues: ['Agarra el empeine y lleva el talón al glúteo.', 'Rodillas juntas y pelvis un poco hacia delante.'] },
    en: { name: 'Standing Quad Stretch', cues: ['Hold your foot and bring the heel to your glute.', 'Keep knees together and tuck the pelvis slightly.'] },
    pose: { head: [50, 15], sh: [50, 26], hip: [50, 51], aN: [[49, 40], [44, 58]], aF: [[56, 37], [64, 30]], lN: [[48, 69], [37, 64], [33, 58]], lF: [[51, 70], [51, 89]] },
    pose2: { head: [50, 15], sh: [50, 26], hip: [51, 51], aN: [[48, 40], [42, 56]], aF: [[56, 37], [64, 30]], lN: [[47, 69], [40, 56], [36, 51]], lF: [[51, 70], [51, 89]] },
  },
  {
    id: 'pinza-sentado', areas: ['isquios', 'lumbar'], level: 1, hold: 40, sides: 1, position: 'sentado',
    es: { name: 'Pinza sentado', cues: ['Piernas estiradas al frente.', 'Inclínate desde la cadera con la espalda larga.'] },
    en: { name: 'Seated Forward Fold', cues: ['Legs straight out in front.', 'Hinge from the hips, keep your back long.'] },
    pose: { head: [44, 52], sh: [40, 60], hip: [28, 84], aN: [[52, 70], [64, 82]], aF: [[52, 71], [66, 83]], lN: [[46, 85], [66, 85], [67, 79]], lF: [[46, 86], [67, 86], [68, 80]] },
    pose2: { head: [54, 60], sh: [46, 64], hip: [28, 84], aN: [[60, 74], [72, 84]], aF: [[60, 75], [74, 85]], lN: [[46, 85], [66, 85], [67, 79]], lF: [[46, 86], [67, 86], [68, 80]] },
  },
  {
    id: 'postura-del-nino', areas: ['espalda-alta', 'lumbar', 'hombros'], level: 1, hold: 45, sides: 1, position: 'suelo',
    es: { name: 'Postura del niño', cues: ['Rodillas al suelo y glúteos hacia los talones.', 'Brazos largos al frente, respira hondo.'] },
    en: { name: "Child's Pose", cues: ['Knees down, sit your hips back to your heels.', 'Reach your arms long and breathe deeply.'] },
    pose: { head: [62, 80], sh: [55, 76], hip: [33, 74], aN: [[68, 82], [80, 87]], aF: [[68, 83], [82, 88]], lN: [[47, 88], [27, 89], [22, 89]], lF: [[47, 88], [27, 89], [22, 89]] },
    pose2: { head: [65, 81], sh: [57, 77], hip: [31, 76], aN: [[71, 83], [84, 87]], aF: [[71, 84], [86, 88]], lN: [[47, 88], [27, 89], [22, 89]], lF: [[47, 88], [27, 89], [22, 89]] },
  },
];
