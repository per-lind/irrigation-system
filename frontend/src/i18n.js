import i18next from 'i18next';

i18next
  .init({
    interpolation: {
      escapeValue: false
    },
    lng: 'en',
    resources: {
      en: {
        translation: {
          methods: {
            GetDistance: 'Get water level',
          },
          headers: {
            pumps: 'Pumps'
          },
          actions: {
            button: {
              startPump1: 'Run PUMP 1 for {{duration}} seconds',
              startPump2: 'Run PUMP 2 for {{duration}} seconds',
              startPump3: 'Run PUMP 3 for {{duration}} seconds',
              TogglePow1: 'Pow 1',
              GetDistance: 'Get water level',
              GetSoilMoisture: 'Get soil moisture',
            },
            result: {
              TogglePow1: 'Pow 1',
              GetDistance: 'Tank water level',
            }
          },
          getTodaysImage: "Get today's image",
          imageMissing: 'No image',
          graph: {
            light: 'Light',
            light_analog: 'Light analog',
            temperature_BMP085: 'Temperature (BMP085)',
            temperature_AM2320: 'Temperature (AM2320)',
            temperature_analog: 'Temperature (analog)',
            humidity: 'Humidity',
            sealevelpressure: 'Sealevel pressure',
          }
        }
      }
    }
  })

export default i18next;
