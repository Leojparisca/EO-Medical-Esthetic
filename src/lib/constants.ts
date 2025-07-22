// This file now contains only data that is truly static and not managed by the database.

// The rules of the loyalty program are static, but the user's points are dynamic.
export const loyaltyData = {
  nextRewardTier: 5000,
  rewards: [
    { points: 1000, reward: '10% de descuento en cualquier tratamiento individual' },
    { points: 2500, reward: '50€ de descuento en tu próxima visita' },
    { points: 5000, reward: 'Terapia de Infusión de Hidratación de cortesía' },
    { points: 10000, reward: 'Crédito de 200€ para cualquier servicio' },
  ],
};
