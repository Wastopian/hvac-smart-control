import { ComfortMetrics, ComfortFactor } from '../types/room';

/**
 * Calculate comfort score based on temperature, humidity, and airflow
 */
export function calculateComfortScore(
  temperature: number,
  targetTemp: number,
  humidity: number,
  targetHumidity: number,
  airflow: number,
  targetAirflow: number
): number {
  const tempScore = calculateTemperatureScore(temperature, targetTemp);
  const humidityScore = calculateHumidityScore(humidity, targetHumidity);
  const airflowScore = calculateAirflowScore(airflow, targetAirflow);

  // Weighted average (temperature is most important)
  const weights = { temperature: 0.5, humidity: 0.3, airflow: 0.2 };
  
  return Math.round(
    tempScore * weights.temperature +
    humidityScore * weights.humidity +
    airflowScore * weights.airflow
  );
}

/**
 * Calculate temperature comfort score (0-100)
 */
export function calculateTemperatureScore(current: number, target: number): number {
  const deviation = Math.abs(current - target);
  
  // Perfect score at target, decreases with deviation
  if (deviation <= 0.5) return 100;
  if (deviation <= 1) return 90;
  if (deviation <= 2) return 70;
  if (deviation <= 3) return 50;
  if (deviation <= 5) return 30;
  return 10;
}

/**
 * Calculate humidity comfort score (0-100)
 */
export function calculateHumidityScore(current: number, target: number): number {
  const deviation = Math.abs(current - target);
  
  // Optimal humidity range is typically 40-60%
  if (current < 30 || current > 70) return 20;
  if (deviation <= 5) return 100;
  if (deviation <= 10) return 80;
  if (deviation <= 15) return 60;
  if (deviation <= 20) return 40;
  return 20;
}

/**
 * Calculate airflow comfort score (0-100)
 */
export function calculateAirflowScore(current: number, target: number): number {
  const deviation = Math.abs(current - target);
  const percentDeviation = deviation / target;
  
  if (percentDeviation <= 0.1) return 100;
  if (percentDeviation <= 0.2) return 85;
  if (percentDeviation <= 0.3) return 70;
  if (percentDeviation <= 0.5) return 50;
  return 30;
}

/**
 * Calculate detailed comfort metrics for a room
 */
export function calculateDetailedComfortMetrics(
  currentTemp: number,
  targetTemp: number,
  currentHumidity: number,
  targetHumidity: number,
  currentAirflow: number,
  targetAirflow: number,
  ventPosition: number,
  previousMetrics?: ComfortMetrics
): ComfortMetrics {
  const tempScore = calculateTemperatureScore(currentTemp, targetTemp);
  const humidityScore = calculateHumidityScore(currentHumidity, targetHumidity);
  const airflowScore = calculateAirflowScore(currentAirflow, targetAirflow);
  const overallScore = calculateComfortScore(
    currentTemp, targetTemp,
    currentHumidity, targetHumidity,
    currentAirflow, targetAirflow
  );

  // Determine trends
  const tempTrend = previousMetrics
    ? getTrend(currentTemp, previousMetrics.temperature.current)
    : 'stable';
  const humidityTrend = previousMetrics
    ? getTrend(currentHumidity, previousMetrics.humidity.current)
    : 'stable';

  const factors: ComfortFactor[] = [
    {
      name: 'Temperature',
      weight: 0.5,
      score: tempScore,
      description: getTemperatureDescription(currentTemp, targetTemp)
    },
    {
      name: 'Humidity',
      weight: 0.3,
      score: humidityScore,
      description: getHumidityDescription(currentHumidity, targetHumidity)
    },
    {
      name: 'Airflow',
      weight: 0.2,
      score: airflowScore,
      description: getAirflowDescription(currentAirflow, targetAirflow)
    }
  ];

  return {
    temperature: {
      current: currentTemp,
      target: targetTemp,
      deviation: currentTemp - targetTemp,
      trend: tempTrend
    },
    humidity: {
      current: currentHumidity,
      target: targetHumidity,
      deviation: currentHumidity - targetHumidity,
      trend: humidityTrend
    },
    airflow: {
      current: currentAirflow,
      target: targetAirflow,
      ventPosition
    },
    overall: {
      score: overallScore,
      factors
    }
  };
}

function getTrend(current: number, previous: number): 'rising' | 'falling' | 'stable' {
  const diff = current - previous;
  if (Math.abs(diff) < 0.1) return 'stable';
  return diff > 0 ? 'rising' : 'falling';
}

function getTemperatureDescription(current: number, target: number): string {
  const diff = current - target;
  if (Math.abs(diff) <= 0.5) return 'Perfect temperature';
  if (diff > 0) return `${Math.abs(diff).toFixed(1)}°C too warm`;
  return `${Math.abs(diff).toFixed(1)}°C too cool`;
}

function getHumidityDescription(current: number, target: number): string {
  const diff = current - target;
  if (Math.abs(diff) <= 5) return 'Optimal humidity';
  if (current < 30) return 'Very dry air';
  if (current > 70) return 'Very humid air';
  if (diff > 0) return `${Math.abs(diff).toFixed(0)}% too humid`;
  return `${Math.abs(diff).toFixed(0)}% too dry`;
}

function getAirflowDescription(current: number, target: number): string {
  const percentDiff = ((current - target) / target) * 100;
  if (Math.abs(percentDiff) <= 10) return 'Good airflow';
  if (percentDiff > 0) return `${Math.abs(percentDiff).toFixed(0)}% too much airflow`;
  return `${Math.abs(percentDiff).toFixed(0)}% insufficient airflow`;
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

/**
 * Convert Pascal to various pressure units
 */
export function pascalToInchesHg(pascal: number): number {
  return pascal * 0.0002953;
}

export function pascalToBar(pascal: number): number {
  return pascal / 100000;
}

export function pascalToPsi(pascal: number): number {
  return pascal * 0.000145038;
} 