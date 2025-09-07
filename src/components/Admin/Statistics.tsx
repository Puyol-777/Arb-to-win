import React, { useState, useMemo } from 'react';
import { GameStats } from '../../types';
import { Download, RotateCcw, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { StatsManager } from '../../utils/statsManager';
import logger from '../../utils/logger';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatisticsProps {
  stats: GameStats;
  onReset: () => void;
  onExport: () => void;
}

type PeriodType = 'day' | 'week' | 'month' | 'year';
type ChartType = 'line' | 'bar';

export function Statistics({ stats, onReset, onExport }: StatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('day');
  const [chartType, setChartType] = useState<ChartType>('line');
  const statsManager = StatsManager.getInstance();

  const chartData = useMemo(() => {
    const data = statsManager.getDataForPeriod(stats.dailyHistory, selectedPeriod);
    
    logger.log('📊 Chart data:', data);
    logger.log('📊 Selected period:', selectedPeriod);
    logger.log('📊 Labels count:', data.labels.length);
    
    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Spins Totaux',
          data: data.spins,
          borderColor: '#3B82F6',
          backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Clics Avis Google',
          data: data.reviews,
          borderColor: '#10B981',
          backgroundColor: chartType === 'bar' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Taux de Conversion (%)',
          data: data.conversions,
          borderColor: '#F59E0B',
          backgroundColor: chartType === 'bar' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          yAxisID: 'y1',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [stats.dailyHistory, selectedPeriod, chartType, statsManager]);

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 2,
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: `Statistiques - ${getPeriodLabel(selectedPeriod)}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        title: {
          display: true,
          text: getPeriodXAxisLabel(selectedPeriod),
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        title: {
          display: true,
          text: 'Nombre',
          font: {
            weight: 'bold'
          }
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Taux (%)',
          font: {
            weight: 'bold'
          }
        },
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
        grid: {
          drawOnChartArea: false,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  } as const;

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les statistiques ?')) {
      onReset();
    }
  };

  const handleExportDetailed = () => {
    const csvContent = statsManager.exportToCSV(stats.dailyHistory);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roue-stats-detailed-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function getPeriodLabel(period: PeriodType): string {
    switch (period) {
      case 'day': return '30 derniers jours';
      case 'week': return '12 dernières semaines';
      case 'month': return '12 derniers mois';
      case 'year': return '2 dernières années';
      default: return '';
    }
  }

  function getPeriodXAxisLabel(period: PeriodType): string {
    switch (period) {
      case 'day': return 'Jours';
      case 'week': return 'Semaines';
      case 'month': return 'Mois';
      case 'year': return 'Années';
      default: return 'Période';
    }
  }

  const todayStats = stats.dailyHistory.find(day => 
    day.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <TrendingUp className="text-blue-600" />
          <span>Statistiques Avancées</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onExport}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export Simple</span>
          </button>
          <button
            onClick={handleExportDetailed}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export Détaillé</span>
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalSpins}</div>
          <div className="text-gray-600">Spins totaux</div>
          <div className="text-sm text-gray-500 mt-1">
            Aujourd'hui: {todayStats?.spins || 0}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.dailySpins}</div>
          <div className="text-gray-600">Spins aujourd'hui</div>
          <div className="text-sm text-gray-500 mt-1">
            Depuis minuit
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">{stats.reviewClicks}</div>
          <div className="text-gray-600">Clics avis Google</div>
          <div className="text-sm text-gray-500 mt-1">
            Aujourd'hui: {todayStats?.reviewClicks || 0}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">
            {todayStats?.conversionRate || 0}%
          </div>
          <div className="text-gray-600">Taux conversion jour</div>
          <div className="text-sm text-gray-500 mt-1">
            Global: {stats.totalSpins > 0 ? Math.round((stats.reviewClicks / stats.totalSpins) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Contrôles du graphique */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-600" />
              <span className="font-medium">Période:</span>
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'day' as PeriodType, label: 'Jour' },
                { key: 'week' as PeriodType, label: 'Semaine' },
                { key: 'month' as PeriodType, label: 'Mois' },
                { key: 'year' as PeriodType, label: 'Année' }
              ].map(period => (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedPeriod === period.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-gray-600" />
              <span className="font-medium">Type:</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  chartType === 'line'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Courbe
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  chartType === 'bar'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Barres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique principal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <div className="h-96">
          {chartType === 'line' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Distribution des gains */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <h4 className="text-lg font-semibold mb-4">Distribution des gains</h4>
        {Object.keys(stats.prizeDistribution).length === 0 ? (
          <p className="text-gray-500">Aucune donnée disponible</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(stats.prizeDistribution).map(([prize, count]) => (
              <div key={prize} className="flex justify-between items-center">
                <span className="text-gray-700">{prize}</span>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 rounded-full h-2 w-32">
                    <div
                      style={{ '--progress': `${stats.totalSpins > 0 ? (count / stats.totalSpins) * 100 : 0}%` }}
                      className="bg-blue-500 h-2 rounded-full w-[var(--progress)]"
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count} ({stats.totalSpins > 0 ? Math.round((count / stats.totalSpins) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <h4 className="text-lg font-semibold mb-2">Informations</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Dernière remise à zéro: {new Date(stats.lastReset).toLocaleDateString('fr-FR')}</p>
          <p>Historique disponible: {stats.dailyHistory.length} jours</p>
          <p>Période couverte: {stats.dailyHistory.length > 0 ? 
            `${stats.dailyHistory[0]?.date} à ${stats.dailyHistory[stats.dailyHistory.length - 1]?.date}` : 
            'Aucune donnée'
          }</p>
        </div>
      </div>
    </div>
  );
}
