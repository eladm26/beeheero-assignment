export const lastFeelLikeQuery = (orderBy: string) => `
        SELECT location.name, latest_forcast.feels_like
        FROM location
        INNER JOIN (
          SELECT DISTINCT ON (forcast."locationId") forcast."locationId", forcast.feels_like
          FROM forcast
          ORDER BY forcast."locationId", forcast.ts DESC
        ) AS latest_forcast
        ON location.id = latest_forcast."locationId"
        ORDER BY latest_forcast.feels_like ${orderBy}
      `