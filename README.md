# beeheero-assignment

## setup intructions:
1. make sure you have docker on and logged in
2. clone the [repo](git@github.com:eladm26/beeheero-assignment.git)
3. cd into `beeheero-assignmnet`
4. create a new file called `.env` in the folder root and fill the following env vars:
   - PORT
   - POSTGRESDB_USER
   - POSTGRESDB_ROOT_PASSWORD
   - POSTGRESDB_DATABASE
   - POSTGRESDB_LOCAL_PORT
   - POSTGRESDB_DOCKER_PORT

   - OPEN_WEATHER_KEY
5. run `docke compose up`

## API
- api/v1/forcast/average-temp - Average Temp
- /api/v1/forcast/lowest-humidity - Lowest Humidity
- api/v1/forcast/last-feel-like-ranked?orderBy=[asc/desc] - Feel Like Ranked (query param `orderBy` valid values are `asc` and `desc`)
