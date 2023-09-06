import { round } from "../utilities/utilities";

/**
 * @typedef {Object} DiscomfortIndexReturnType
 * @property {number} di – Discomfort Index(DI)
 * @property {string} discomfort_condition Classification of the thermal comfort conditions according to the discomfort index
 */

/**
 * @public
 * Calculates the Discomfort Index (DI). The index is essentially an effective temperature based on air temperature and humidity.
 * The discomfort index is usuallly divided in 6 dicomfort categories and it only applies to warm environments.
 * @see {@link discomfort_index_array} for a version that supports arrays
 *
 * @param {number} tdb - air temperature [C]
 * @param {number} rh - relative humidity [%]
 *
 * @returns {DiscomfortIndexReturnType} object with results of DI
 * @example
 * const DI = discomfort_index(25, 50); // returns { di: 22.1, discomfort_condition: 'Less than 50% feels discomfort' }
 */
export function discomfort_index(tdb, rh) {
  const di = tdb - 0.55 * (1 - 0.01 * rh) * (tdb - 14.5);
  const condition = check_categories(di);

  return {
    di: round(di, 1),
    discomfort_condition: condition,
  };
}

/**
 * @typedef {Object} DiscomfortIndexArrayReturnType
 * @property {number[]} di – Discomfort Index(DI) Array
 * @property {string[]} discomfort_condition Classification of the thermal comfort conditions in array
 */

/**
 * @public
 * Calculates the Discomfort Index (DI). The index is essentially an effective temperature based on air temperature and humidity.
 * The discomfort index is usuallly divided in 6 dicomfort categories and it only applies to warm environments.
 * @see {@link discomfort_index} for a version that supports scalar arguments
 *
 * @param {number[]} tdb - air temperature [C]
 * @param {number[]} rh - relative humidity [%]
 *
 * @returns {DiscomfortIndexArrayReturnType} object with results of DI
 */
export function discomfort_index_array(tdb, rh) {
  const di = tdb.map((temperature, index) => {
    const relativeHumidity = rh[index];
    return (
      temperature - 0.55 * (1 - 0.01 * relativeHumidity) * (temperature - 14.5)
    );
  });

  const discomfortCondition = di.map((value) => check_categories(value));

  return {
    di: di.map((value) => Math.round(value * 10) / 10),
    discomfort_condition: discomfortCondition,
  };
}

/**
 *
 * Determine the discomfort categories based on DI.
 *
 * @param {number} di - Discomfort Index (DI)
 * @returns {string} Discomfort condition
 */
function check_categories(di) {
  const diCategories = {
    21: "No discomfort",
    24: "Less than 50% feels discomfort",
    27: "More than 50% feels discomfort",
    29: "Most of the population feels discomfort",
    32: "Everyone feels severe stress",
    99: "State of medical emergency",
  };

  let condition = "default";
  for (const key in diCategories) {
    if (di <= key) {
      condition = diCategories[key];
      break;
    }
  }

  return condition;
}
