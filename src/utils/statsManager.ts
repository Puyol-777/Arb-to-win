import { GameStats, DailyStats } from '../types';
import { format, subDays, parseISO, isAfter, isBefore } from 'date-fns';

export class StatsManager {
  private static instance: StatsManager;
  
  static getInstance(): StatsManager {
    if (!StatsManager.instance) {
      StatsManager.instance = new StatsManager();
    }
    return StatsManager.instance;
  }

  // Ajouter une statistique quotidienne
  updateDailyStats(stats: GameStats, type: 'spin' | 'review'): GameStats {
    const today = format(new Date(), 'yyyy-MM-dd');
    let dailyHistory = [...stats.dailyHistory];
    
    // Trouver ou créer l'entrée du jour
    let todayIndex = dailyHistory.findIndex(day => day.date === today);
    
    if (todayIndex === -1) {
      // Créer une nouvelle entrée pour aujourd'hui
      dailyHistory.push({
        date: today,
        spins: 0,
        reviewClicks: 0,
        conversionRate: 0
      });
      todayIndex = dailyHistory.length - 1;
    }

    // Mettre à jour les statistiques
    if (type === 'spin') {
      dailyHistory[todayIndex].spins += 1;
    } else if (type === 'review') {
      dailyHistory[todayIndex].reviewClicks += 1;
    }

    // Recalculer le taux de conversion
    const todayStats = dailyHistory[todayIndex];
    todayStats.conversionRate = todayStats.spins > 0 
      ? Math.round((todayStats.reviewClicks / todayStats.spins) * 100) 
      : 0;

    // Nettoyer l'historique (garder seulement 2 ans)
    const twoYearsAgo = subDays(new Date(), 730);
    dailyHistory = dailyHistory.filter(day => 
      isAfter(parseISO(day.date), twoYearsAgo)
    );

    // Trier par date
    dailyHistory.sort((a, b) => a.date.localeCompare(b.date));

    return {
      ...stats,
      dailyHistory,
      totalSpins: stats.totalSpins + (type === 'spin' ? 1 : 0),
      dailySpins: stats.dailySpins + (type === 'spin' ? 1 : 0),
      reviewClicks: stats.reviewClicks + (type === 'review' ? 1 : 0)
    };
  }

  // Obtenir les données pour une période
  getDataForPeriod(dailyHistory: DailyStats[], period: 'day' | 'week' | 'month' | 'year'): {
    labels: string[];
    spins: number[];
    reviews: number[];
    conversions: number[];
  } {
    const now = new Date();
    let startDate: Date;
    let dateFormat: string;
    let groupBy: 'day' | 'week' | 'month' = 'day';

    switch (period) {
      case 'day':
        startDate = subDays(now, 30); // 30 derniers jours
        dateFormat = 'dd/MM';
        groupBy = 'day';
        break;
      case 'week':
        startDate = subDays(now, 84); // 12 dernières semaines
        dateFormat = 'dd/MM';
        groupBy = 'week';
        break;
      case 'month':
        startDate = subDays(now, 365); // 12 derniers mois
        dateFormat = 'MM/yyyy';
        groupBy = 'month';
        break;
      case 'year':
        startDate = subDays(now, 730); // 2 dernières années
        dateFormat = 'yyyy';
        groupBy = 'year';
        break;
      default:
        startDate = subDays(now, 30);
        dateFormat = 'dd/MM';
    }

    // Filtrer les données dans la période
    const filteredData = dailyHistory.filter(day => 
      isAfter(parseISO(day.date), startDate)
    );

    console.log('📊 Filtered data:', filteredData);
    console.log('📊 Period:', period, 'GroupBy:', groupBy, 'DateFormat:', dateFormat);
    
    // Si pas de données, créer des données par défaut pour affichage
    if (filteredData.length === 0) {
      return this.generateDefaultData(period, now);
    }

    if (groupBy === 'day') {
      // Données journalières
      const labels = filteredData.map(day => format(parseISO(day.date), dateFormat));
      const spins = filteredData.map(day => day.spins);
      const reviews = filteredData.map(day => day.reviewClicks);
      const conversions = filteredData.map(day => day.conversionRate);

      return { labels, spins, reviews, conversions };
    } else if (groupBy === 'week') {
      // Grouper par semaine ou mois
      const grouped: Record<string, { spins: number; reviews: number; dates: string[] }> = {};

      filteredData.forEach(day => {
        const date = parseISO(day.date);
        // Grouper par semaine (lundi de la semaine)
        const monday = new Date(date);
        monday.setDate(date.getDate() - date.getDay() + 1);
        const key = format(monday, 'dd/MM');

        if (!grouped[key]) {
          grouped[key] = { spins: 0, reviews: 0, dates: [] };
        }

        grouped[key].spins += day.spins;
        grouped[key].reviews += day.reviewClicks;
        grouped[key].dates.push(day.date);
      });

      const labels = Object.keys(grouped).sort();
      const spins = labels.map(label => grouped[label].spins);
      const reviews = labels.map(label => grouped[label].reviews);
      const conversions = labels.map(label => 
        grouped[label].spins > 0 
          ? Math.round((grouped[label].reviews / grouped[label].spins) * 100)
          : 0
      );

      return { labels, spins, reviews, conversions };
    } else if (groupBy === 'month') {
      // Grouper par mois
      const grouped: Record<string, { spins: number; reviews: number; dates: string[] }> = {};

      filteredData.forEach(day => {
        const date = parseISO(day.date);
        const key = format(date, dateFormat);

        if (!grouped[key]) {
          grouped[key] = { spins: 0, reviews: 0, dates: [] };
        }

        grouped[key].spins += day.spins;
        grouped[key].reviews += day.reviewClicks;
        grouped[key].dates.push(day.date);
      });

      const labels = Object.keys(grouped).sort();
      const spins = labels.map(label => grouped[label].spins);
      const reviews = labels.map(label => grouped[label].reviews);
      const conversions = labels.map(label => 
        grouped[label].spins > 0 
          ? Math.round((grouped[label].reviews / grouped[label].spins) * 100)
          : 0
      );

      return { labels, spins, reviews, conversions };
    } else {
      // Grouper par année
      const grouped: Record<string, { spins: number; reviews: number; dates: string[] }> = {};

      filteredData.forEach(day => {
        const date = parseISO(day.date);
        const key = format(date, 'yyyy');

        if (!grouped[key]) {
          grouped[key] = { spins: 0, reviews: 0, dates: [] };
        }

        grouped[key].spins += day.spins;
        grouped[key].reviews += day.reviewClicks;
        grouped[key].dates.push(day.date);
      });

      const labels = Object.keys(grouped).sort();
      const spins = labels.map(label => grouped[label].spins);
      const reviews = labels.map(label => grouped[label].reviews);
      const conversions = labels.map(label => 
        grouped[label].spins > 0 
          ? Math.round((grouped[label].reviews / grouped[label].spins) * 100)
          : 0
      );

      return { labels, spins, reviews, conversions };
    }
  }

  // Générer des données par défaut selon la période
  private generateDefaultData(period: 'day' | 'week' | 'month' | 'year', now: Date) {
    const defaultLabels = [];
    const defaultSpins = [];
    const defaultReviews = [];
    const defaultConversions = [];
    
    switch (period) {
      case 'day':
        // 7 derniers jours
        for (let i = 6; i >= 0; i--) {
          const date = subDays(now, i);
          defaultLabels.push(format(date, 'dd/MM'));
          defaultSpins.push(0);
          defaultReviews.push(0);
          defaultConversions.push(0);
        }
        break;
      case 'week':
        // 4 dernières semaines
        for (let i = 3; i >= 0; i--) {
          const date = subDays(now, i * 7);
          const monday = new Date(date);
          monday.setDate(date.getDate() - date.getDay() + 1);
          defaultLabels.push(format(monday, 'dd/MM'));
          defaultSpins.push(0);
          defaultReviews.push(0);
          defaultConversions.push(0);
        }
        break;
      case 'month':
        // 6 derniers mois
        for (let i = 5; i >= 0; i--) {
          const date = subDays(now, i * 30);
          defaultLabels.push(format(date, 'MM/yyyy'));
          defaultSpins.push(0);
          defaultReviews.push(0);
          defaultConversions.push(0);
        }
        break;
      case 'year':
        // 2 dernières années
        for (let i = 1; i >= 0; i--) {
          const date = subDays(now, i * 365);
          defaultLabels.push(format(date, 'yyyy'));
          defaultSpins.push(0);
          defaultReviews.push(0);
          defaultConversions.push(0);
        }
        break;
    }
    
    return {
      labels: defaultLabels,
      spins: defaultSpins,
      reviews: defaultReviews,
      conversions: defaultConversions
    };
  }

  // Réinitialiser les statistiques
  resetStats(stats: GameStats): GameStats {
    return {
      ...stats,
      totalSpins: 0,
      dailySpins: 0,
      reviewClicks: 0,
      prizeDistribution: {},
      lastReset: new Date().toISOString(),
      // Garder l'historique mais marquer la réinitialisation
      dailyHistory: stats.dailyHistory
    };
  }

  // Exporter les données en CSV
  exportToCSV(dailyHistory: DailyStats[]): string {
    const headers = ['Date', 'Spins', 'Clics Avis', 'Taux Conversion (%)'];
    const rows = dailyHistory.map(day => [
      day.date,
      day.spins.toString(),
      day.reviewClicks.toString(),
      day.conversionRate.toString()
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  }
}